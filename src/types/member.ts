// src/types/member.ts
export type Member = {
  id: number;
  fullName: string;
  memberId: string;
  email?: string | null;
  phone?: string | null;
  membershipType: "monthly" | "quarterly" | "annual";
  status: "active" | "expired" | "suspended";
  startDate: string;
  endDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MemberFormData = {
  fullName: string;
  memberId: string;
  email?: string;
  phone?: string;
  membershipType: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
};
