import React from "react";

export default function Navigation() {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Gym Management</h1>
      <div className="flex items-center gap-3">
        <button className="text-sm text-gray-600 hover:text-gray-800">Settings</button>
        <button className="text-sm text-gray-600 hover:text-gray-800">Profile</button>
      </div>
    </header>
  );
}