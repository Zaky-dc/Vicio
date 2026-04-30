"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, LogOut, ShieldAlert, Calendar as CalendarIcon, User, ChevronRight } from "lucide-react";

import AuthCard from "@/components/AuthCard";
import CalendarMonth from "@/components/CalendarMonth";
import PanicModal from "@/components/PanicModal";
import PanicContactsForm from "@/components/PanicContactsForm";
import VicioForm from "@/components/VicioForm";
import { Surface } from "@/components/ui/Surface";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getSupabaseClient } from "@/lib/supabase/browserClient";
import { toISODate } from "@/lib/vicios/date";

type VicioRow = {
  id: string;
  name: string;
  start_date: string;
  created_at: string;
};

type CommitRow = {
  vicio_id: string;
  commit_date: string;
  status: "success" | "relapse";
};

type PanicContactRow = {
  id: string;
  name: string;
  phone: string | null;
  whatsapp_phone: string | null;
};

export default function HomePage() {
  const supabase = React.useMemo(() => getSupabaseClient(), []);
  const [sessionEmail, setSessionEmail] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = React.useState(true);

  const [vicios, setVicios] = React.useState<VicioRow[]>([]);
  const [allCommits, setAllCommits] = React.useState<CommitRow[]>([]);
  const [contacts, setContacts] = React.useState<PanicContactRow[]>([]);
  const [panicOpen, setPanicOpen] = React.useState(false);
  const [randomHadith, setRandomHadith] = React.useState<{ content_pt: string; source: string } | null>(null);

  const todayISO = React.useMemo(() => toISODate(new Date()), []);

  React.useEffect(() => {
    let mounted = true;
    async function init() {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setUserId(data.session?.user?.id ?? null);
      setSessionEmail(data.session?.user?.email ?? null);
      setLoadingAuth(false);
    }
    init();

    if (supabase) {
      const { data: sub } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        setUserId(session?.user?.id ?? null);
        setSessionEmail(session?.user?.email ?? null);
      });
      return () => {
        mounted = false;
        sub.subscription.unsubscribe();
      };
    }
    return () => { mounted = false; };
  }, [supabase]);

  React.useEffect(() => {
    if (!userId || !supabase) return;
    async function load() {
      const { data: vData } = await supabase.from("vices").select("*").order("created_at", { ascending: false });
      if (vData) setVicios(vData as VicioRow[]);

      const { data: cData } = await supabase.from("panic_contacts").select("*").order("created_at", { ascending: false });
      if (cData) setContacts(cData as PanicContactRow[]);

      // Fetch all commits for overview
      const { data: commits } = await supabase.from("vicio_commits").select("*").order("commit_date", { ascending: true });
      if (commits) setAllCommits(commits as CommitRow[]);

      // Fetch random hadith
      const { data: hadiths } = await supabase.from("hadiths").select("content_pt, source");
      if (hadiths && hadiths.length > 0) {
        setRandomHadith(hadiths[Math.floor(Math.random() * hadiths.length)]);
      }
    }
    load();
  }, [userId, supabase]);

  async function createVicio(name: string) {
    if (!userId || !supabase) return;
    await supabase.from("vices").insert({ user_id: userId, name, start_date: todayISO });
    const { data } = await supabase.from("vices").select("*").order("created_at", { ascending: false });
    setVicios((data as VicioRow[]) ?? []);
  }

  async function createContact(input: { name: string; phone: string; whatsapp_phone: string }) {
    if (!userId || !supabase) return;
    await supabase.from("panic_contacts").insert({
      user_id: userId,
      name: input.name,
      phone: input.phone || null,
      whatsapp_phone: input.whatsapp_phone || null,
    });
    const { data } = await supabase.from("panic_contacts").select("*").order("created_at", { ascending: false });
    setContacts((data as PanicContactRow[]) ?? []);
  }

  // Aggregated status map for the sidebar calendar
  const aggregatedStatusMap = React.useMemo(() => {
    const map = new Map<string, "success" | "relapse">();
    allCommits.forEach(c => {
      const existing = map.get(c.commit_date);
      // If there's a relapse in any habit, the day is marked as relapse
      if (c.status === "relapse" || existing === "relapse") {
        map.set(c.commit_date, "relapse");
      } else {
        map.set(c.commit_date, "success");
      }
    });
    return map;
  }, [allCommits]);

  // Helper to get last 7 days of status for a specific vicio
  function getMiniHeatmap(vicioId: string) {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = toISODate(d);
      const commit = allCommits.find(c => c.vicio_id === vicioId && c.commit_date === iso);
      days.push({ iso, status: commit?.status });
    }
    return days;
  }

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-primary font-black text-2xl"
        >
          Vícios
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-outline/10 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-black">V</div>
            <span className="text-xl font-black tracking-tight text-on-background">Vícios</span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {userId && (
              <Button variant="text" size="sm" onClick={() => supabase.auth.signOut()} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-8">
        {!userId ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Surface elevation={2} className="w-full max-w-md p-8">
              <h2 className="text-2xl font-black mb-2">Bem-vindo</h2>
              <p className="text-on-surface-variant mb-8">Faça login para começar sua jornada.</p>
              <AuthCard onAuthed={(email) => setSessionEmail(email)} />
            </Surface>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-8">
              {randomHadith && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-3xl p-6 bg-primary/5 border border-primary/10"
                >
                  <div className="relative z-10 italic text-lg font-medium text-on-background leading-relaxed">
                    "{randomHadith.content_pt}"
                  </div>
                  <div className="mt-2 font-black text-xs text-primary uppercase tracking-widest">— {randomHadith.source}</div>
                  <div className="absolute top-[-20px] left-[-20px] text-8xl text-primary/5 font-serif select-none pointer-events-none">“</div>
                </motion.div>
              )}

              <section>
                <div className="flex items-center justify-between mb-4 px-1">
                  <h2 className="text-xl font-black flex items-center gap-2 text-on-background">
                    <User className="h-5 w-5 text-primary" />
                    Seus Desafios
                  </h2>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{vicios.length} ativos</span>
                </div>

                <Surface elevation={1} className="p-6">
                  <VicioForm onCreate={createVicio} />
                  
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vicios.length === 0 ? (
                      <div className="md:col-span-2 flex flex-col items-center justify-center py-12 rounded-2xl border-2 border-dashed border-outline/20">
                        <Plus className="h-10 w-10 text-on-surface-variant/40 mb-2" />
                        <p className="text-sm font-bold text-on-surface-variant">Adicione seu primeiro vício</p>
                      </div>
                    ) : (
                      vicios.map((v) => (
                        <Link key={v.id} href={`/vicios/${v.id}`}>
                          <Surface 
                            variant="surface-variant" 
                            elevation={0} 
                            className="group relative overflow-hidden p-5 transition-all hover:ring-2 hover:ring-primary/50"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="font-black text-lg group-hover:text-primary transition-colors">{v.name}</h3>
                                <p className="text-xs font-medium opacity-70 mt-0.5">Iniciado em {v.start_date}</p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                            </div>

                            <div className="flex gap-1.5 items-center">
                              {getMiniHeatmap(v.id).map((day, idx) => (
                                <div 
                                  key={idx}
                                  className={`h-2.5 w-2.5 rounded-sm flex-shrink-0 transition-colors ${
                                    day.status === "success" ? "bg-green-500" :
                                    day.status === "relapse" ? "bg-red-500" :
                                    "bg-surface-variant/50"
                                  }`}
                                  title={day.iso}
                                />
                              ))}
                              <span className="text-[10px] font-bold text-on-surface-variant uppercase ml-2 opacity-50">Últimos 7 dias</span>
                            </div>
                          </Surface>
                        </Link>
                      ))
                    )}
                  </div>
                </Surface>
              </section>
            </div>

            <aside className="lg:col-span-4 space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4 px-1">
                  <ShieldAlert className="h-5 w-5 text-red-600" />
                  <h2 className="text-lg font-black text-on-background">Linha de Frente</h2>
                </div>
                <PanicContactsForm onCreate={createContact} />
                <Button variant="error" className="w-full mt-4 py-6 gap-3 rounded-2xl shadow-lg shadow-red-500/20" onClick={() => setPanicOpen(true)}>
                  <ShieldAlert className="h-6 w-6" />
                  <span className="text-lg">BOTÃO DE PÂNICO</span>
                </Button>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4 px-1">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-black text-on-background">Visão Consolidada</h2>
                </div>
                <Surface elevation={1} className="p-5">
                  <div className="mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Status Global (Todos os Vícios)</p>
                    <CalendarMonth
                      monthDate={new Date()}
                      selectedISODate={todayISO}
                      onSelectISODate={() => {}}
                      statusMap={aggregatedStatusMap}
                    />
                  </div>
                  <p className="mt-4 text-xs font-medium text-on-surface-variant leading-relaxed italic opacity-80 border-t border-outline/10 pt-4">
                    "O sucesso é a soma de pequenos esforços repetidos dia após dia."
                  </p>
                </Surface>
              </section>
            </aside>
          </div>
        )}
      </main>

      <PanicModal isOpen={panicOpen} onClose={() => setPanicOpen(false)} contacts={contacts} />
    </div>
  );
}
