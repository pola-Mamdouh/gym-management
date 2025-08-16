// src/lib/client/api.ts
import type { CreateMemberInput } from "@/lib/server/api";

const BASE = "/api/members";

export async function fetchMembersClient() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Failed to fetch members");
  return res.json();
}

export async function addMemberClient(data: CreateMemberInput) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to add member");
  }
  return res.json();
}

export async function updateMemberClient(id: number, data: Partial<CreateMemberInput>) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to update member");
  }
  return res.json();
}

export async function deleteMemberClient(id: number) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to delete member");
  }
  return res.json();
}
