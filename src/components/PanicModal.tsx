"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Play, Heart, ShieldAlert, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";

type PanicContact = {
  id: string;
  name: string;
  phone: string | null;
  whatsapp_phone: string | null;
};

const YOUTUBE_VIDEOS: { title: string; videoId: string }[] = [
  { title: "Respiração", videoId: "0c1D0v7pZyE" },
  { title: "Música Relax", videoId: "C0DPdy98e4c" },
  { title: "Meditação", videoId: "fJ9rUzIMcZQ" },
];

const EMERGENCY_LINES = [
  { name: "Emergência Geral (Polícia/Ambulância)", phone: "112", icon: ShieldAlert },
  { name: "SNS 24 (Apoio Psicológico)", phone: "800242424", icon: LifeBuoy },
  { name: "SOS Voz Amiga", phone: "218544310", icon: Heart },
];

function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

function QuickDistractionGame() {
  const [secondsLeft, setSecondsLeft] = React.useState(20);
  const [score, setScore] = React.useState(0);
  const running = secondsLeft > 0;

  React.useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [running]);

  function start() {
    setScore(0);
    setSecondsLeft(20);
  }

  return (
    <Surface elevation={1} className="p-4 bg-surface-variant/20 border border-outline/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-black text-on-surface">Distração Ativa</h4>
          <p className="text-xs text-on-surface-variant">
            {running ? `Tempo: ${secondsLeft}s` : "Clique o máximo que puder"}
          </p>
        </div>
        <div className="text-lg font-black text-primary">{score}</div>
      </div>

      <div className="flex gap-3">
        <Button
          size="sm"
          onClick={start}
          disabled={running}
          className="flex-shrink-0"
        >
          {running ? "Em andamento" : "Começar"}
        </Button>
        <Button
          variant="tonal"
          size="sm"
          onClick={() => running && setScore((x) => x + 1)}
          className="flex-1"
          disabled={!running}
        >
          CLIQUE AQUI
        </Button>
      </div>
    </Surface>
  );
}

export default function PanicModal({
  isOpen,
  onClose,
  contacts,
}: {
  isOpen: boolean;
  onClose: () => void;
  contacts: PanicContact[];
}) {
  const [selectedVideoId, setSelectedVideoId] = React.useState(() => {
    const pick = YOUTUBE_VIDEOS[Math.floor(Math.random() * YOUTUBE_VIDEOS.length)]?.videoId;
    return pick ?? "";
  });

  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-surface border border-outline/20 shadow-2xl"
          >
            <div className="flex h-14 items-center justify-between px-6 bg-red-600 text-white">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                <span className="font-black text-sm uppercase tracking-widest">Zona de Apoio Crítico</span>
              </div>
              <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight flex items-center gap-2 text-on-surface">
                      <Heart className="h-6 w-6 text-red-600" />
                      Não desista agora
                    </h3>
                    <p className="text-on-surface-variant mt-2 text-sm leading-relaxed">
                      Respire fundo. Essa vontade vai passar. Você não está sozinho e existem pessoas prontas para te ouvir agora.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary">Linhas de Apoio Profissional</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {EMERGENCY_LINES.map((line) => (
                        <a key={line.phone} href={`tel:${line.phone}`} className="block">
                          <Surface elevation={1} className="p-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border-red-100 dark:border-red-900/30">
                            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600">
                              <line.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-black text-on-surface">{line.name}</div>
                              <div className="text-lg font-black text-red-600">{line.phone}</div>
                            </div>
                            <Phone className="h-5 w-5 text-red-600 animate-pulse" />
                          </Surface>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Seus Contatos de Confiança</h4>
                    <div className="space-y-3">
                      {contacts.length === 0 ? (
                        <p className="text-sm italic opacity-50">Nenhum contato cadastrado.</p>
                      ) : (
                        contacts.map((c) => (
                          <Surface key={c.id} variant="surface-variant" elevation={0} className="p-4 flex items-center justify-between gap-4">
                            <div>
                              <div className="font-bold text-on-surface">{c.name}</div>
                              <div className="text-xs text-on-surface-variant opacity-70">{c.phone || c.whatsapp_phone}</div>
                            </div>
                            <div className="flex gap-2">
                              {c.phone && (
                                <a href={`tel:${c.phone}`}>
                                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                    <Phone className="h-4 w-4" />
                                  </Button>
                                </a>
                              )}
                              {c.whatsapp_phone && (
                                <a href={`https://wa.me/${onlyDigits(c.whatsapp_phone)}`} target="_blank" rel="noreferrer">
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                    <Play className="h-4 w-4 fill-current" />
                                  </Button>
                                </a>
                              )}
                            </div>
                          </Surface>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <Surface elevation={1} className="p-4 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Distração Visual</h4>
                    <div className="flex flex-wrap gap-2">
                      {YOUTUBE_VIDEOS.map((v) => (
                        <button
                          key={v.videoId}
                          onClick={() => setSelectedVideoId(v.videoId)}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                            selectedVideoId === v.videoId 
                              ? "bg-primary text-on-primary" 
                              : "bg-surface-variant text-on-surface-variant hover:bg-surface-variant/80"
                          }`}
                        >
                          {v.title}
                        </button>
                      ))}
                    </div>
                    <div className="aspect-video w-full rounded-2xl overflow-hidden border border-outline/10 bg-black">
                      {selectedVideoId && (
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                    </div>
                  </Surface>

                  <QuickDistractionGame />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

