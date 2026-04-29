import { differenceInCalendarDays, formatISO, startOfDay } from "date-fns";

export function toISODate(d: Date) {
  // yyyy-MM-dd (compatível com `date` no Postgres)
  return formatISO(startOfDay(d), { representation: "date" });
}

export function parseISODateLocal(isoDate: string) {
  // Evita conversão UTC -> local que pode deslocar o dia.
  const [y, m, d] = isoDate.split("-").map((x) => Number(x));
  if (!y || !m || !d) return new Date(isoDate);
  return new Date(y, m - 1, d);
}

export function daysBetweenCalendarDates(a: Date, b: Date) {
  // Diferença em dias usando calendário (ignora horário).
  return differenceInCalendarDays(startOfDay(a), startOfDay(b));
}

