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
  { title: "Paciência (Sabr)", videoId: "r2iF_5DQQa8" },
  { title: "Misericórdia de Allah", videoId: "9x_z_zJh0aI" },
  { title: "Arrependimento (Taubah)", videoId: "kSsNpOJi-to" },
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

function TasbihCounter() {
  const [count, setCount] = React.useState(0);
  const [phase, setPhase] = React.useState(0); // 0: SubhanAllah, 1: Alhamdulillah, 2: Allahu Akbar

  const phases = [
    { name: "SubhanAllah", sub: "Glória a Allah" },
    { name: "Alhamdulillah", sub: "Louvado seja Allah" },
    { name: "Allahu Akbar", sub: "Allah é o Maior" },
  ];

  const handleIncrement = () => {
    if (count < 33) {
      setCount(prev => prev + 1);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(50);
      }
    } else {
      if (phase < 2) {
        setPhase(prev => prev + 1);
        setCount(1);
      } else {
        setPhase(0);
        setCount(0);
      }
    }
  };

  const reset = () => {
    setCount(0);
    setPhase(0);
  };

  return (
    <Surface elevation={1} className="p-6 relative overflow-hidden border border-primary/10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-primary">Tasbih Digital</h4>
          <p className="text-[10px] text-on-surface-variant opacity-60">Distração Ativa & Dhikr</p>
        </div>
        <button onClick={reset} className="text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors">
          REINICIAR
        </button>
      </div>

      <div className="flex flex-col items-center text-center">
        <motion.div 
          key={phase}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-1"
        >
          <div className="text-2xl font-black text-on-surface tracking-tight leading-none">{phases[phase].name}</div>
          <div className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1 opacity-70">{phases[phase].sub}</div>
        </motion.div>

        <div className="relative my-6 h-36 w-36 flex items-center justify-center">
          <svg className="absolute inset-0 h-full w-full -rotate-90 transform">
            <circle cx="72" cy="72" r="66" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-surface-variant/30" />
            <motion.circle
              cx="72"
              cy="72"
              r="66"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 66}
              animate={{ strokeDashoffset: 2 * Math.PI * 66 * (1 - count / 33) }}
              className="text-primary"
              strokeLinecap="round"
            />
          </svg>
          <div className="flex flex-col items-center">
            <span className="text-5xl font-black text-on-surface font-mono leading-none">{count}</span>
            <span className="text-[10px] font-bold text-on-surface-variant opacity-40 mt-1">/ 33</span>
          </div>
        </div>

        <button
          onClick={handleIncrement}
          className="h-20 w-20 rounded-full bg-primary text-on-primary shadow-lg shadow-primary/30 active:scale-90 transition-all flex items-center justify-center group"
          title="Clique para contar"
        >
          <Play className="h-8 w-8 fill-current group-active:scale-110" />
        </button>
        
        <div className="mt-6 flex gap-1.5">
          {[0, 1, 2].map(p => (
            <div 
              key={p} 
              className={`h-1 w-10 rounded-full transition-all duration-500 ${p === phase ? "bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" : "bg-surface-variant/50"}`} 
            />
          ))}
        </div>
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

                  <TasbihCounter />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

