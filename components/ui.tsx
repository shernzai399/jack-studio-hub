import { clsx, type ClassValue } from "clsx";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Card({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-black/10 bg-white p-5 shadow-soft", className)}>
      {children}
    </section>
  );
}

export function Badge({
  children,
  tone = "neutral"
}: {
  children: ReactNode;
  tone?: "neutral" | "good" | "warn" | "danger";
}) {
  const tones = {
    neutral: "border-black/10 bg-stone-100 text-ink",
    good: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warn: "border-amber-200 bg-amber-50 text-amber-800",
    danger: "border-red-200 bg-red-50 text-red-800"
  };

  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}

export function Field({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-ink">
      {label}
      {children}
    </label>
  );
}

export const inputClass =
  "min-h-10 rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/20";

export function PrimaryButton({
  children,
  type = "button"
}: {
  children: ReactNode;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      className="inline-flex min-h-10 items-center justify-center rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-moss"
    >
      {children}
    </button>
  );
}
