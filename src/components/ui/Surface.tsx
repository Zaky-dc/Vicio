"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SurfaceProps extends HTMLMotionProps<"div"> {
  elevation?: 0 | 1 | 2;
  variant?: "surface" | "surface-variant" | "outline";
}

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, elevation = 1, variant = "surface", ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-xl p-4 transition-colors",
          variant === "surface" && "bg-surface text-on-surface",
          variant === "surface-variant" && "bg-surface-variant text-on-surface-variant",
          variant === "outline" && "border border-outline bg-transparent text-on-surface",
          elevation === 1 && "shadow-sm",
          elevation === 2 && "shadow-md",
          className
        )}
        {...props}
      />
    );
  }
);

Surface.displayName = "Surface";
