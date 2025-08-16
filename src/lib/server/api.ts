/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api.ts
import prisma from "@/lib/prisma";
import { calcEndDate } from "@/lib/utils/date";
import type {
  MembershipType as PrismaMembershipType,
  MembershipStatus as PrismaMembershipStatus,
  Member as PrismaMember,
  Prisma,
} from "@prisma/client";

/**
 * Input types expected from frontend (camelCase)
 */
export type CreateMemberInput = {
  fullName: string;
  memberId: string;
  email?: string | null;
  phone?: string | null;
  membershipType: string; // incoming (will be mapped to enum)
  status?: string; // incoming (will be mapped to enum)
  startDate?: string | null; // ISO date string
  endDate?: string | null; // ISO date string or null
  notes?: string | null;
};

export type UpdateMemberInput = Partial<CreateMemberInput>;

/* ------------------ Validators / mappers ------------------ */

const PHONE_REGEX = /^\d{8,15}$/;
const EMAIL_SIMPLE_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Normalize & map incoming membershipType string to Prisma enum value.
 * Returns a value typed as PrismaMembershipType (trusted by TS after assert).
 * Throws Error if value invalid.
 */
function mapToMembershipType(input?: string): PrismaMembershipType {
  if (!input) throw new Error("membershipType is required");
  const s = input.toString().trim().toLowerCase();

  // Accept flexible inputs like "Monthly", "monthly", "month"
  if (s === "monthly" || s.includes("month")) return "monthly" as PrismaMembershipType;
  if (s === "quarterly" || s.includes("quarter")) return "quarterly" as PrismaMembershipType;
  if (s === "annual" || s.includes("year") || s.includes("ann")) return "annual" as PrismaMembershipType;

  throw new Error(`Invalid membershipType value: ${input}`);
}

/**
 * Normalize & map incoming status string to Prisma enum value.
 * Returns a value typed as PrismaMembershipStatus.
 */
function mapToMembershipStatus(input?: string): PrismaMembershipStatus {
  if (!input) return "active" as PrismaMembershipStatus; // default
  const s = input.toString().trim().toLowerCase();

  if (s === "active") return "active" as PrismaMembershipStatus;
  if (s === "expired" || s === "inactive") return "expired" as PrismaMembershipStatus;
  if (s === "suspended") return "suspended" as PrismaMembershipStatus;

  throw new Error(`Invalid status value: ${input}`);
}

/* ------------------ Helper: Prisma unique error handler ------------------ */
function handlePrismaError(e: unknown) {
  if (e && typeof e === "object" && "code" in e) {
    const code = (e as any).code;
    // P2002 -> Unique constraint failed
    if (code === "P2002") {
      const target = (e as any).meta?.target ?? "field";
      throw new Error(`Unique constraint failed on ${Array.isArray(target) ? target.join(", ") : target}`);
    }
  }
  throw e;
}

/* ------------------ CRUD functions (explicit returns) ------------------ */

/**
 * Get all members ordered by createdAt desc
 */
export async function getMembers(): Promise<PrismaMember[]> {
  return prisma.member.findMany({ orderBy: { createdAt: "desc" } });
}

/**
 * Get single member by numeric id
 */
export async function getMemberById(id: number): Promise<PrismaMember | null> {
  if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid id");
  return prisma.member.findUnique({ where: { id } });
}

/**
 * Create a new member (maps enums, validates simple fields, calculates endDate when missing)
 */
export async function createMember(data: CreateMemberInput): Promise<PrismaMember> {
  // Basic required fields validation & normalization
  const fullName = data.fullName?.toString().trim();
  const memberId = data.memberId?.toString().trim();

  if (!fullName) throw new Error("fullName is required");
  if (!memberId) throw new Error("memberId is required");
  if (!data.membershipType) throw new Error("membershipType is required");

  // Optional validation: email & phone
  let email: string | null = null;
  if (data.email !== undefined && data.email !== null && data.email !== "") {
    const e = data.email.toString().trim();
    if (!EMAIL_SIMPLE_REGEX.test(e)) throw new Error("Invalid email format");
    email = e;
  }

  let phone: string | null = null;
  if (data.phone !== undefined && data.phone !== null && data.phone !== "") {
    const p = data.phone.toString().trim();
    if (!PHONE_REGEX.test(p)) throw new Error("Invalid phone number (must be 8-15 digits)");
    phone = p;
  }

  // Map enums
  const membershipType = mapToMembershipType(data.membershipType);
  const status = mapToMembershipStatus(data.status);

  // Dates handling
  const start = data.startDate ? new Date(data.startDate) : new Date();
  if (isNaN(start.getTime())) throw new Error("Invalid startDate");

  const endDate = data.endDate ? new Date(data.endDate) : calcEndDate(start, membershipType);
  if (endDate && isNaN(endDate.getTime())) throw new Error("Invalid endDate");

  // Build create payload (camelCase fields, matching Prisma model)
  try {
    const created = await prisma.member.create({
      data: {
        fullName,
        memberId,
        email,
        phone,
        membershipType,
        status,
        startDate: start,
        endDate: endDate ?? null,
        notes: data.notes ?? null,
      },
    });
    return created;
  } catch (e) {
    handlePrismaError(e);
    throw e;
  }
}

/**
 * Update member by id.
 * Only fields present in `data` are applied.
 */
export async function updateMember(id: number, data: UpdateMemberInput): Promise<PrismaMember> {
  if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid id");

  const updateData: Prisma.MemberUpdateInput = {};

  if (data.fullName !== undefined) {
    updateData.fullName = data.fullName === null ? '' : data.fullName.toString().trim();
  }
  if (data.memberId !== undefined) {
    updateData.memberId = data.memberId === null ? '' : data.memberId.toString().trim();
  }
  if (data.email !== undefined) {
    if (data.email === null || data.email === "") {
      updateData.email = null;
    } else {
      const e = data.email.toString().trim();
      if (!EMAIL_SIMPLE_REGEX.test(e)) throw new Error("Invalid email format");
      updateData.email = e;
    }
  }
  if (data.phone !== undefined) {
    if (data.phone === null || data.phone === "") {
      updateData.phone = null;
    } else {
      const p = data.phone.toString().trim();
      if (!PHONE_REGEX.test(p)) throw new Error("Invalid phone number (must be 8-15 digits)");
      updateData.phone = p;
    }
  }
  if (data.notes !== undefined) {
    updateData.notes = data.notes === null ? null : data.notes.toString();
  }

  if (data.membershipType !== undefined) {
    updateData.membershipType = mapToMembershipType(data.membershipType) as Prisma.MemberUpdateInput["membershipType"];
  }
  if (data.status !== undefined) {
    updateData.status = mapToMembershipStatus(data.status) as Prisma.MemberUpdateInput["status"];
  }

  if (data.startDate !== undefined) {
    if (data.startDate === null) {
      updateData.startDate = '';
    } else {
      const s = new Date(data.startDate);
      if (isNaN(s.getTime())) throw new Error("Invalid startDate");
      updateData.startDate = s;
    }
  }

  if (data.endDate !== undefined) {
    if (data.endDate === null) {
      updateData.endDate = null;
    } else {
      const eDate = new Date(data.endDate);
      if (isNaN(eDate.getTime())) throw new Error("Invalid endDate");
      updateData.endDate = eDate;
    }
  }

  try {
    const updated = await prisma.member.update({
      where: { id },
      data: updateData,
    });
    return updated;
  } catch (e) {
    handlePrismaError(e);
    throw e;
  }
}

/**
 * Delete member by id
 */
export async function deleteMember(id: number): Promise<PrismaMember> {
  if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid id");
  try {
    const deleted = await prisma.member.delete({ where: { id } });
    return deleted;
  } catch (e) {
    handlePrismaError(e);
    throw e;
  }
}
