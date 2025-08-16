"use client";

import React from "react";
import { useMemberContext } from "@/context/MemberContext";

export default function Toasts() {
  const { toasts } = useMemberContext();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-2 rounded shadow max-w-xs text-sm ${
            t.type === "success" ? "bg-green-50 text-green-800" : t.type === "error" ? "bg-red-50 text-red-800" : "bg-gray-50 text-gray-800"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
