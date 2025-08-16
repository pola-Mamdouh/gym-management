import React from "react";
import Navigation from "./Navigation";
import MembersTable from "./MembersTable";

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <Navigation />
      <main className="mt-6">
        <MembersTable />
      </main>
    </div>
  );
}