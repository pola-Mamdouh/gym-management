import React from "react";
import MembersTable from "./components/MembersTable";
import { MemberProvider } from "@/context/MemberContext";
import Toasts from "./components/Toast";

export default function Page() {
  return (
    <MemberProvider>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <MembersTable />
        </div>
      </div>
      <Toasts />
    </MemberProvider>
  );
}
