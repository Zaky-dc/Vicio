"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, AlertCircle, TrendingUp, Calendar as CalendarIcon, CheckCircle2, XCircle, Phone, Pencil, Check, X as XIcon } from "lucide-react";

import CalendarMonth, { DayStatus } from "@/components/CalendarMonth";
import PanicModal from "@/components/PanicModal";
import { Surface } from "@/components/ui/Surface";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getSupabaseClient } from "@/lib/supabase/browserClient";
import { calcStreakDays } from "@/lib/vicios/streak";
import { daysBetweenCalendarDates, parseISODateLocal, toISODate } from "@/lib/vicios/date";
import { formatDaysWithout, getMotivationalMessage } from "@/lib/vicios/motivacao";

type VicioRow = {
  id: string;
  name: string;
  start_date: string;
  created_at: string;
};

type CommitRow = {
  commit_date: string;
  status: DayStatus;
};

type PanicContactRow = {
  id: string;
  name: string;
  phone: string | null;
  whatsapp_phone: string | null;
};

export default function VicioPage() {
  const params = useParams<{ vicioId: string }>();
  const router = useRouter();
  const vicioId = params?.vicioId;

  const supabase = React.useMemo(() => getSupabaseClient(), []);
  const [vicio, setVicio] = React.useState<VicioRow | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [monthDate, setMonthDate] = React.useState(new Date());
  const [selectedISODate, setSelectedISODate] = React.useState<string | null>(toISODate(new Date()));
  const [statusMap, setStatusMap] = React.useState<Map<string, DayStatus>>(new Map());
  const [streakDays, setStreakDays] = React.useState(0);
  const [totalSuccess, setTotalSuccess] = React.useState(0);
  const [totalRelapse, setTotalRelapse] = React.useState(0);
  const [message, setMessage] = React.useState<{ title: string; body: string; type: "success" | "error" | "info" } | null>(null);
  const [panicOpen, setPanicOpen] = React.useState(false);
  const [contacts, setContacts] = React.useState<PanicContactRow[]>([]);
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [editName, setEditName] = React.useState("");

  const todayISO = React.useMemo(() => toISODate(new Date()), []);

  React.useEffect(() => {
    let mounted = true;
    async function init() {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      if (mounted) setUserId(data.session?.user?.id ?? null);
    }
    init();

    if (supabase) {
      const { data: sub } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        setUserId(session?.user?.id ?? null);
      });
      return () => {
        mounted = false;
        sub.subscription.unsubscribe();
      };
    }
  }, [supabase]);

  React.useEffect(() => {
    if (!vicioId || !userId || !supabase) return;
    async function load() {
      const { data: vData } = await supabase.from("vices").select("*").eq("id", vicioId).maybeSingle();
      if (vData) {
        setVicio(vData as VicioRow);
        setEditName(vData.name);
      }

      const { data: cData } = await supabase.from("panic_contacts").select("*").order("created_at", { ascending: false });
      if (cData) setContacts(cData as PanicContactRow[]);
    }
    load();
  }, [vicioId, userId, supabase]);

  const loadStats = React.useCallback(async () => {
    if (!vicioId || !vicio || !supabase) return;

    const { data: allCommits } = await supabase
      .from("vicio_commits")
      .select("status")
      .eq("vicio_id", vicioId);

    if (allCommits) {
      setTotalSuccess(allCommits.filter((c: any) => c.status === "success").length);
      setTotalRelapse(allCommits.filter((c: any) => c.status === "relapse").length);
    }

    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const { data: monthCommits } = await supabase
      .from("vicio_commits")
      .select("commit_date, status")
      .eq("vicio_id", vicioId)
      .gte("commit_date", toISODate(start))
      .lte("commit_date", toISODate(end));

    const map = new Map<string, DayStatus>();
    monthCommits?.forEach((c: any) => map.set(c.commit_date, c.status as DayStatus));
    setStatusMap(map);

    const { data: lastRelapse } = await supabase
      .from("vicio_commits")
      .select("commit_date")
      .eq("vicio_id", vicioId)
      .eq("status", "relapse")
      .lte("commit_date", todayISO)
      .order("commit_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    const baseDate = lastRelapse?.commit_date ? parseISODateLocal(lastRelapse.commit_date) : parseISODateLocal(vicio.start_date);
    const diff = daysBetweenCalendarDates(parseISODateLocal(todayISO), baseDate);
    setStreakDays(Math.max(0, diff));
  }, [vicioId, vicio, monthDate, supabase, todayISO]);

  React.useEffect(() => {
    loadStats();
  }, [loadStats]);

  async function updateVicioName() {
    if (!vicioId || !supabase || !editName.trim()) return;
    const { error } = await supabase.from("vices").update({ name: editName }).eq("id", vicioId);
    if (!error) {
      setVicio(prev => prev ? { ...prev, name: editName } : null);
      setIsEditingName(false);
    }
  }

  async function setStatusForDate(isoDate: string, status: DayStatus) {
    if (!vicioId || !supabase) return;

    // Toggle logic: If same status, delete it
    if (statusMap.get(isoDate) === status) {
      await supabase.from("vicio_commits").delete().eq("vicio_id", vicioId).eq("commit_date", isoDate);
      setMessage({ title: "Removido", body: "Registro removido com sucesso.", type: "info" });
    } else {
      const { error } = await supabase.from("vicio_commits").upsert({
        user_id: userId,
        vicio_id: vicioId,
        commit_date: isoDate,
        status,
      }, { onConflict: "vicio_id,commit_date" });

      if (!error) {
        if (status === "success") {
          setMessage({ 
            title: "Parabéns!", 
            body: "Mais um passo em direção à liberdade. Continue assim!", 
            type: "success" 
          });
        } else if (status === "relapse") {
          const sortedDates = Array.from(statusMap.keys()).sort();
          const prevDateStr = sortedDates.reverse().find(d => d < isoDate);
          const daysWithout = prevDateStr ? daysBetweenCalendarDates(parseISODateLocal(isoDate), parseISODateLocal(prevDateStr)) : 0;

          // Fetch random Hadith for motivation
          const { data: hadithData } = await supabase
            .from("hadiths")
            .select("content_pt, source")
            .limit(100); 
          
          let incentiveText = daysWithout > 1 
            ? `Você já provou que consegue ao ficar ${daysWithout} dias limpo. Cada esforço conta. Recomece agora mesmo com fé!` 
            : "Uma falha não define sua jornada. O arrependimento é o primeiro passo para a vitória. Continue tentando!";

          let motivationalBody = incentiveText;

          if (hadithData && hadithData.length > 0) {
            const randomH = hadithData[Math.floor(Math.random() * hadithData.length)];
            motivationalBody = `"${randomH.content_pt}"\n— ${randomH.source}\n\n${incentiveText}`;
          }

          setMessage({ 
            title: "Não Desanime!", 
            body: motivationalBody,
            type: "error"
          });
        }
      }
    }
    loadStats();
  }

  function monthShift(delta: number) {
    if (!vicio) return;
    const nextMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + delta, 1);
    const startLimit = startOfMonth(parseISODateLocal(vicio.start_date));
    
    if (delta < 0 && nextMonth < startLimit) return;
    if (delta > 0 && nextMonth > startOfMonth(new Date())) return;

    setMonthDate(nextMonth);
  }

  if (!vicioId) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background p-4 md:p-8 font-sans">
      <header className="mx-auto w-full max-w-6xl py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-variant/50 text-on-surface hover:bg-surface-variant transition-colors">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div className="flex-1 group">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-surface-variant/50 border-none rounded-lg px-3 py-1 text-xl font-black focus:ring-2 focus:ring-primary outline-none w-full max-w-xs"
                  autoFocus
                />
                <button onClick={updateVicioName} className="p-2 bg-primary text-on-primary rounded-full hover:bg-primary/90">
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={() => setIsEditingName(false)} className="p-2 bg-surface-variant text-on-surface rounded-full hover:bg-surface-variant/80">
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-on-background tracking-tight">
                  {vicio?.name ?? "Carregando..."}
                </h1>
                <button 
                  onClick={() => setIsEditingName(true)} 
                  className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-surface-variant rounded-full transition-all"
                  title="Editar nome"
                >
                  <Pencil className="h-4 w-4 opacity-50" />
                </button>
              </div>
            )}
            <p className="text-sm font-medium text-on-surface-variant flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              Sequência: <span className="text-primary font-bold">{streakDays} dias</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="error" size="sm" onClick={() => setPanicOpen(true)} className="hidden md:flex gap-2">
            <AlertCircle className="h-4 w-4" />
            Pânico
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Surface elevation={1} className="flex flex-col items-center justify-center p-6 bg-primary/5 border-primary/10">
                <span className="text-3xl font-black text-primary">{streakDays}</span>
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">Dias Limpo</span>
              </Surface>
              <Surface elevation={1} className="flex flex-col items-center justify-center p-6 bg-green-500/5 border-green-500/10">
                <span className="text-3xl font-black text-green-600">{totalSuccess}</span>
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">Vitórias</span>
              </Surface>
              <Surface elevation={1} className="flex flex-col items-center justify-center p-6 bg-red-500/5 border-red-500/10 col-span-2 md:col-span-1">
                <span className="text-3xl font-black text-red-600">{totalRelapse}</span>
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">Recaídas</span>
              </Surface>
            </div>

            <Surface elevation={2} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold">Histórico</h2>
                </div>
                <div className="flex items-center gap-1 bg-surface-variant/30 p-1 rounded-full">
                  <button onClick={() => monthShift(-1)} className="p-2 hover:bg-surface-variant rounded-full transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                  <button onClick={() => monthShift(1)} className="p-2 hover:bg-surface-variant rounded-full transition-colors rotate-180"><ChevronLeft className="h-4 w-4" /></button>
                </div>
              </div>

              <CalendarMonth
                monthDate={monthDate}
                selectedISODate={selectedISODate ?? ""}
                onSelectISODate={setSelectedISODate}
                statusMap={statusMap}
              />
            </Surface>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <Surface elevation={2} className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Check-in do Dia</h3>
              <p className="text-lg font-bold mb-6">
                {selectedISODate ? format(parseISODateLocal(selectedISODate), "dd 'de' MMMM", { locale: ptBR }) : "Selecione um dia"}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => selectedISODate && setStatusForDate(selectedISODate, "success")}
                  className="bg-green-600 hover:bg-green-700 h-24 flex-col gap-2 rounded-2xl"
                  disabled={!selectedISODate}
                >
                  <CheckCircle2 className="h-8 w-8" />
                  <span>Cumpri</span>
                </Button>
                <Button
                  variant="error"
                  onClick={() => selectedISODate && setStatusForDate(selectedISODate, "relapse")}
                  className="h-24 flex-col gap-2 rounded-2xl shadow-lg shadow-red-500/20"
                  disabled={!selectedISODate}
                >
                  <XCircle className="h-8 w-8" />
                  <span>Recaí</span>
                </Button>
              </div>

              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className={cn(
                      "mt-6 p-4 rounded-2xl border flex gap-3",
                      message.type === "success" && "bg-green-100 border-green-200 text-green-900 dark:bg-green-900/20 dark:text-green-100",
                      message.type === "error" && "bg-red-100 border-red-200 text-red-900 dark:bg-red-900/20 dark:text-red-100",
                      message.type === "info" && "bg-blue-100 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100"
                    )}
                  >
                    <div className="flex-1">
                      <p className="font-black text-sm">{message.title}</p>
                      <p className="text-xs mt-1 leading-relaxed opacity-90">{message.body}</p>
                    </div>
                    <button onClick={() => setMessage(null)}><XCircle className="h-4 w-4 opacity-50" /></button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Surface>
            <Button variant="error" className="w-full py-6 gap-3 rounded-2xl shadow-xl shadow-red-500/20 md:hidden" onClick={() => setPanicOpen(true)}>
                <AlertCircle className="h-6 w-6" />
                <span className="text-lg">PÂNICO</span>
              </Button>
            </aside>
          </div>
        </main>

      <PanicModal isOpen={panicOpen} onClose={() => setPanicOpen(false)} contacts={contacts} />
    </div>
  );
}

