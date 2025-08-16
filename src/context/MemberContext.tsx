/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Member, MemberFormData } from "@/types/member";
import {
  fetchMembersClient,
  addMemberClient,
  updateMemberClient,
  deleteMemberClient,
} from "@/lib/client/api";

type ToastItem = { id: string; message: string; type?: "success" | "error" | "info" };

type MemberContextType = {
  members: Member[];
  loading: boolean;
  fetchMembers: () => Promise<void>;
  addMember: (data: MemberFormData) => Promise<Member | void>;
  updateMember: (id: number, data: Partial<MemberFormData>) => Promise<Member | void>;
  deleteMember: (id: number) => Promise<void>;
  toasts: ToastItem[];
  pushToast: (t: Omit<ToastItem, "id">) => void;
};

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider = ({ children }: { children: React.ReactNode }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  async function fetchMembers() {
    setLoading(true);
    try {
      const res = await fetchMembersClient();
      setMembers(res);
    } catch (e) {
      pushToast({ message: "Failed to load members", type: "error" });
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  function pushToast(item: Omit<ToastItem, "id">) {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
    setToasts((s) => [...s, { id, ...item }]);
    // auto remove after 4s
    setTimeout(() => {
      setToasts((s) => s.filter((t) => t.id !== id));
    }, 4000);
  }

  async function addMember(data: MemberFormData) {
    try {
      const created = await addMemberClient(data);
      setMembers((prev) => [created, ...prev]);
      pushToast({ message: "Member added", type: "success" });
      return created;
    } catch (e: any) {
      pushToast({ message: e?.message ?? "Failed to add member", type: "error" });
      throw e;
    }
  }

  async function updateMember(id: number, data: Partial<MemberFormData>) {
    try {
      const updated = await updateMemberClient(id, data);
      setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)));
      pushToast({ message: "Member updated", type: "success" });
      return updated;
    } catch (e: any) {
      pushToast({ message: e?.message ?? "Failed to update member", type: "error" });
      throw e;
    }
  }

  async function deleteMember(id: number) {
    try {
      await deleteMemberClient(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      pushToast({ message: "Member deleted", type: "success" });
    } catch (e: any) {
      pushToast({ message: e?.message ?? "Failed to delete member", type: "error" });
      throw e;
    }
  }

  return (
    <MemberContext.Provider
      value={{ members, loading, fetchMembers, addMember, updateMember, deleteMember, toasts, pushToast }}
    >
      {children}
    </MemberContext.Provider>
  );
};

export function useMemberContext() {
  const ctx = useContext(MemberContext);
  if (!ctx) throw new Error("useMemberContext must be used inside MemberProvider");
  return ctx;
}
