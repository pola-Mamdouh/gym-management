// src/lib/utils/date.ts
import { addMonths, addYears, format, parseISO } from "date-fns";

export function toDateSafe(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  try {
    return parseISO(value.toString());
  } catch {
    return null;
  }
}

export function formatISODateSafe(value: Date | string | null | undefined): string | null {
  const d = toDateSafe(value);
  return d ? format(d, "yyyy-MM-dd") : null;
}

export function calcEndDate(startDate: Date, membershipType: string): Date {
  const t = membershipType?.toString().toLowerCase();
  if (!t) return addMonths(startDate, 1);
  if (t.includes("month")) return addMonths(startDate, 1);
  if (t.includes("quarter")) return addMonths(startDate, 3);
  if (t.includes("ann") || t.includes("year")) return addYears(startDate, 1);
  return addMonths(startDate, 1);
}
