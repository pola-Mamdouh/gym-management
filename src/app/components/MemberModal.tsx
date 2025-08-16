/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Member, MemberFormData } from "@/types/member";
import { useMemberContext } from "@/context/MemberContext";
import { formatISODateSafe } from "@/lib/utils/date";
import { MembershipStatus, MembershipType } from "@prisma/client";

type Props = {
  initialData?: Member;
  onClose: () => void;
};

const PHONE_REGEX = /^\d{8,15}$/;
const EMAIL_SIMPLE_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function MemberModal({ initialData, onClose }: Props) {
  const { addMember, updateMember, pushToast } = useMemberContext();

  const [fullName, setFullName] = useState(initialData?.fullName ?? "");
  const [memberId, setMemberId] = useState(initialData?.memberId ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [membershipType, setMembershipType] = useState(initialData?.membershipType ?? "monthly");
  const [status, setStatus] = useState(initialData?.status ?? "active");
  const [startDate, setStartDate] = useState<string | undefined>(initialData?.startDate ? formatISODateSafe(initialData.startDate)! : undefined);
  const [endDate, setEndDate] = useState<string | undefined>(initialData?.endDate ?? undefined);
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [fullName, memberId, email, phone]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) return setError("Full name is required");
    if (!memberId.trim()) return setError("Member ID is required");
    if (email && !EMAIL_SIMPLE_REGEX.test(email)) return setError("Invalid email");
    if (phone && !PHONE_REGEX.test(phone)) return setError("Phone must be 8-15 digits");

    const payload: MemberFormData = {
      fullName: fullName.trim(),
      memberId: memberId.trim(),
      email: email ? email.trim() : undefined,
      phone: phone ? phone.trim() : undefined,
      membershipType: membershipType,
      status: status,
      startDate: startDate ?? undefined,
      endDate: endDate ?? undefined,
      notes: notes ?? undefined,
    };

    try {
      setLoading(true);
      if (initialData) {
        await updateMember(initialData.id, payload);
      } else {
        await addMember(payload);
      }
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Failed to save");
      pushToast({ message: e?.message ?? "Failed to save", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{initialData ? "Edit Member" : "Add Member"}</h3>
          <button onClick={onClose} className="text-gray-600">&times;</button>
        </div>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="p-2 border rounded"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              className="p-2 border rounded"
              placeholder="Member ID"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            />
            <input
              className="p-2 border rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="p-2 border rounded"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <select 
              className="p-2 border rounded" 
              value={membershipType} 
              onChange={(e) => setMembershipType(e.target.value as MembershipType)}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </select>

            <select 
              className="p-2 border rounded" 
              value={status} 
              onChange={(e) => setStatus(e.target.value as MembershipStatus)}
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="suspended">Suspended</option>
            </select>


            <label className="flex flex-col">
              <span className="text-sm text-gray-600">Start Date</span>
              <input type="date" value={startDate ?? ""} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded" />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-600">End Date (optional)</span>
              <input type="date" value={endDate ?? ""} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded" />
            </label>
          </div>

          <div>
            <textarea className="w-full p-2 border rounded" placeholder="Notes" value={notes ?? ""} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-orange-500 text-white">
              {loading ? "Saving..." : initialData ? "Save changes" : "Add member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
