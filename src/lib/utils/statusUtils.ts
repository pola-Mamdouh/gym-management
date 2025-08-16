// src/lib/utils/statusUtils.ts

/**
 * Return a human-friendly display status string.
 * Input status is Prisma enum value (e.g., "active"|"expired"|"suspended").
 * We also allow passing endDate to mark expired if endDate passed.
 */
export function getMemberDisplayStatus(status: string, endDate?: string | null): string {
  // if endDate passed and date is in past -> expired
  if (endDate) {
    const d = new Date(endDate);
    if (!isNaN(d.getTime()) && d.getTime() < Date.now()) {
      return "expired";
    }
  }
  // default to given status
  return status ?? "active";
}

/**
 * Return Tailwind classes (bg + text) for a given display status.
 * Keep these conservative — feel free to tweak colors.
 */
export function getStatusClass(displayStatus: string): string {
  const s = (displayStatus || "").toString().toLowerCase();
  if (s === "active") return "bg-green-100 text-green-800";
  if (s === "expired") return "bg-red-100 text-red-800";
  if (s === "suspended") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
}
