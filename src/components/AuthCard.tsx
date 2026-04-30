"use client";

import * as React from "react";
import { getMissingSupabaseEnv, getSupabaseClient } from "@/lib/supabase/browserClient";
import { Button } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";
import { Mail, Lock, UserPlus, LogIn } from "lucide-react";

export default function AuthCard({
  onAuthed,
}: {
  onAuthed: (email: string | null) => void;
}) {
  const supabase = React.useMemo(() => getSupabaseClient(), []);
  const [mode, setMode] = React.useState<"signin" | "signup">("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);

  async function submit() {
    if (!supabase) {
      const missing = getMissingSupabaseEnv();
      setError(`Faltam variáveis: ${missing.join(", ")}`);
      return;
    }
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        setInfo("Conta criada! Confirme seu e-mail.");
        return;
      }
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      onAuthed(data.session?.user?.email ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao autenticar.");
    } finally {
      setBusy(false);
    }
  }

  async function signInAnonymously() {
    if (!supabase) return;
    setBusy(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      onAuthed(null); // Anonymous user has no email
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao entrar anonimamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex bg-surface-variant/30 p-1 rounded-2xl">
        <button
          onClick={() => setMode("signin")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
            mode === "signin" ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant opacity-60"
          }`}
        >
          <LogIn className="h-4 w-4" />
          Entrar
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
            mode === "signup" ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant opacity-60"
          }`}
        >
          <UserPlus className="h-4 w-4" />
          Cadastrar
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/50" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full rounded-2xl border-2 border-surface-variant bg-surface-variant/10 pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all"
              placeholder="exemplo@email.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant px-1">Senha</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/50" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full rounded-2xl border-2 border-surface-variant bg-surface-variant/10 pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}
      {info && (
        <div className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-200 dark:border-green-800">
          {info}
        </div>
      )}

      <div className="space-y-3">
        <Button
          onClick={submit}
          disabled={busy || !email || !password}
          className="w-full py-4 text-base"
        >
          {busy ? "Processando..." : mode === "signin" ? "Acessar Conta" : "Criar Minha Conta"}
        </Button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline/10"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-on-surface-variant/40 bg-surface px-2 w-fit mx-auto">OU</div>
        </div>

        <div className="space-y-2">
          <button
            onClick={signInAnonymously}
            disabled={busy}
            className="w-full py-3 rounded-2xl bg-surface-variant/20 hover:bg-surface-variant/40 text-on-surface font-bold text-sm transition-all border border-outline/10"
          >
            Entrar como Anônimo
          </button>
          <p className="text-[10px] text-center text-on-surface-variant opacity-60 leading-relaxed px-4">
            <span className="text-red-500 font-black">AVISO:</span> Como anônimo, seus dados ficam vinculados apenas a este navegador. 
            Se limpar o histórico ou trocar de dispositivo, perderá o acesso ao seu progresso.
          </p>
        </div>
      </div>
    </div>
  );
}

