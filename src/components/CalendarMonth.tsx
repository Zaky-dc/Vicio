"use client";

import { addDays, format, startOfMonth, endOfMonth, startOfWeek, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as React from "react";
import { motion } from "framer-motion";
import { toISODate } from "@/lib/vicios/date";
import { Check, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DayStatus = "success" | "relapse" | null;

export default function CalendarMonth({
  monthDate,
  selectedISODate,
  onSelectISODate,
  statusMap,
}: {
  monthDate: Date;
  selectedISODate: string | null;
  onSelectISODate: (isoDate: string) => void;
  statusMap: Map<string, DayStatus>;
}) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);

  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    cells.push(addDays(gridStart, i));
  }

  const todayISO = toISODate(new Date());

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between px-1">
        <h3 className="text-lg font-bold capitalize text-on-surface">
          {format(monthStart, "MMMM yyyy", { locale: ptBR })}
        </h3>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-on-surface-variant/60">
        {["S", "T", "Q", "Q", "S", "S", "D"].map((d, i) => (
          <div key={i} className="py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-2">
        {cells.map((d, i) => {
          const iso = toISODate(d);
          const inMonth = isSameMonth(d, monthStart);
          const status = statusMap.get(iso);
          const isSelected = selectedISODate === iso;
          const isToday = iso === todayISO;

          return (
            <motion.button
              key={iso}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectISODate(iso)}
              disabled={!inMonth}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center rounded-2xl text-sm transition-all duration-200",
                !inMonth && "opacity-0 pointer-events-none",
                isSelected
                  ? "bg-primary text-on-primary ring-4 ring-primary/20 scale-105 z-10"
                  : "bg-surface-variant/30 text-on-surface-variant hover:bg-surface-variant/50",
                isToday && !isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-surface",
                status === "success" && !isSelected && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                status === "relapse" && !isSelected && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              )}
            >
              <span className={cn("font-bold", isSelected ? "text-on-primary" : "text-on-surface")}>
                {format(d, "d")}
              </span>
              
              <div className="absolute bottom-1.5 flex gap-0.5">
                {status === "success" && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check className={cn("h-3 w-3", isSelected ? "text-on-primary" : "text-green-600 dark:text-green-400")} />
                  </motion.div>
                )}
                {status === "relapse" && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <X className={cn("h-3 w-3", isSelected ? "text-on-primary" : "text-red-600 dark:text-red-400")} />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

