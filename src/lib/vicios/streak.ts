import { differenceInCalendarDays, isValid, startOfDay } from "date-fns";
import { daysBetweenCalendarDates } from "./date";

export function calcStreakDays({
  today,
  lastCommitDate,
  startDate,
}: {
  today: Date;
  lastCommitDate: Date | null;
  startDate: Date;
}) {
  const t = startOfDay(today);
  if (!isValid(t)) return 0;

  if (!lastCommitDate) {
    const s = startOfDay(startDate);
    return Math.max(0, differenceInCalendarDays(t, s));
  }

  const c = startOfDay(lastCommitDate);
  return Math.max(0, daysBetweenCalendarDates(t, c));
}

