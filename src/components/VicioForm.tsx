"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default function VicioForm({
  onCreate,
}: {
  onCreate: (name: string) => Promise<void>;
}) {
  const [name, setName] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const trimmed = name.trim();
      if (!trimmed) throw new Error("Informe o nome do vício.");
      await onCreate(trimmed);
      setName("");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Falha ao criar.";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Qual vício quer superar?"
            className="w-full rounded-2xl border-2 border-surface-variant bg-surface-variant/20 px-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all placeholder:text-on-surface-variant/50"
          />
        </div>
        <Button
          onClick={submit}
          disabled={busy || !name.trim()}
          className="gap-2 h-auto py-3.5"
        >
          {busy ? "Criando..." : (
            <>
              <Plus className="h-5 w-5" />
              Adicionar
            </>
          )}
        </Button>
      </div>
      {error && (
        <div className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}

