"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Award, Star, Trophy, ShieldCheck, Gem } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type BadgeLevel = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "locked";

interface AchievementBadgeProps {
  level: BadgeLevel;
  label: string;
  days: number;
  isUnlocked: boolean;
}

const BADGE_CONFIG = {
  bronze: {
    icon: Star,
    color: "from-[#CD7F32] to-[#A0522D]",
    shadow: "shadow-orange-500/20",
    border: "border-orange-400/30",
  },
  silver: {
    icon: ShieldCheck,
    color: "from-[#C0C0C0] to-[#708090]",
    shadow: "shadow-slate-400/20",
    border: "border-slate-300/30",
  },
  gold: {
    icon: Award,
    color: "from-[#FFD700] to-[#DAA520]",
    shadow: "shadow-yellow-500/20",
    border: "border-yellow-400/30",
  },
  platinum: {
    icon: Trophy,
    color: "from-[#E5E4E2] to-[#B0C4DE]",
    shadow: "shadow-blue-300/20",
    border: "border-blue-200/30",
  },
  diamond: {
    icon: Gem,
    color: "from-[#B9F2FF] to-[#00CED1]",
    shadow: "shadow-cyan-400/30",
    border: "border-cyan-200/40",
  },
  locked: {
    icon: Star,
    color: "from-surface-variant/40 to-surface-variant/20",
    shadow: "shadow-none",
    border: "border-outline/5",
  },
};

export function AchievementBadge({ level, label, days, isUnlocked }: AchievementBadgeProps) {
  const config = isUnlocked ? BADGE_CONFIG[level] : BADGE_CONFIG.locked;
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={isUnlocked ? { scale: 1.05, y: -5 } : {}}
      className={cn(
        "relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-500",
        config.border,
        config.shadow,
        !isUnlocked && "opacity-40 grayscale"
      )}
    >
      <div className={cn(
        "relative h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br mb-2 shadow-inner",
        config.color
      )}>
        {isUnlocked && (
          <motion.div
            animate={{ 
              rotate: [0, 360],
              opacity: [0.3, 0.6, 0.3] 
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 to-transparent"
          />
        )}
        <Icon className={cn("h-6 w-6", isUnlocked ? "text-white" : "text-on-surface-variant/50")} />
      </div>
      
      <span className="text-[10px] font-black uppercase tracking-widest text-on-surface text-center leading-tight">
        {label}
      </span>
      <span className="text-[8px] font-bold text-on-surface-variant opacity-60 uppercase mt-0.5">
        {days} Dias
      </span>

      {isUnlocked && (
        <div className="absolute -top-1 -right-1">
          <div className="h-3 w-3 bg-green-500 rounded-full border-2 border-surface animate-pulse" />
        </div>
      )}
    </motion.div>
  );
}
