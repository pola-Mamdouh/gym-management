/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useMemberContext } from "@/context/MemberContext";

export default function DeleteModal({ id, onClose }: { id: number; onClose: () => void }) {
  const { deleteMember } = useMemberContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setLoading(true);
    try {
      await deleteMember(id);
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">Confirm deletion</h3>
        <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this member? This action cannot be undone.</p>
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleDelete} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded">
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
