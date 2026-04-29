"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";
import { UserPlus } from "lucide-react";

export default function PanicContactsForm({
  onCreate,
}: {
  onCreate: (input: {
    name: string;
    phone: string;
    whatsapp_phone: string;
  }) => Promise<void>;
}) {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [whatsappPhone, setWhatsappPhone] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const trimmedName = name.trim();
      if (!trimmedName) throw new Error("Informe o nome do contato.");
      await onCreate({
        name: trimmedName,
        phone: phone.trim(),
        whatsapp_phone: whatsappPhone.trim(),
      });
      setName("");
      setPhone("");
      setWhatsappPhone("");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Falha ao salvar contato.";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Surface elevation={1} className="p-6">
      <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-4">Novo Contato</h3>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface-variant px-1">Nome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border-2 border-surface-variant bg-surface-variant/20 px-4 py-2.5 text-sm font-medium outline-none focus:border-primary transition-all"
            placeholder="Ex: Maria"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant px-1">Telefone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl border-2 border-surface-variant bg-surface-variant/20 px-4 py-2.5 text-sm font-medium outline-none focus:border-primary transition-all"
              placeholder="Ligação"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant px-1">WhatsApp</label>
            <input
              value={whatsappPhone}
              onChange={(e) => setWhatsappPhone(e.target.value)}
              className="w-full rounded-2xl border-2 border-surface-variant bg-surface-variant/20 px-4 py-2.5 text-sm font-medium outline-none focus:border-primary transition-all"
              placeholder="Opcional"
            />
          </div>
        </div>

        {error && (
          <div className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
            {error}
          </div>
        )}

        <Button
          onClick={submit}
          disabled={busy || !name.trim()}
          variant="tonal"
          className="w-full gap-2 py-3 mt-2"
        >
          <UserPlus className="h-4 w-4" />
          {busy ? "Salvando..." : "Salvar Contato"}
        </Button>
      </div>
    </Surface>
  );
}

