"use client";

import React, { useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useMemberContext } from "@/context/MemberContext";
import MemberModal from "./MemberModal";
import DeleteModal from "./DeleteModal";
import { formatISODateSafe } from "@/lib/utils/date";
import { getMemberDisplayStatus, getStatusClass } from "@/lib/utils/statusUtils";
import type { Member } from "@/types/member";

export default function MembersTable() {
  const { members, loading } = useMemberContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return members.filter((m) => {
      if (q) {
        const matches =
          m.fullName.toLowerCase().includes(q) ||
          m.memberId.toLowerCase().includes(q) ||
          (m.email || "").toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (statusFilter && m.status !== statusFilter) return false;
      if (typeFilter && m.membershipType !== typeFilter) return false;
      return true;
    });
  }, [members, searchTerm, statusFilter, typeFilter]);

  function openAdd() {
    setEditingMember(null);
    setShowMemberModal(true);
  }

  function openEdit(m: Member) {
    setEditingMember(m);
    setShowMemberModal(true);
  }

  function openDelete(id: number) {
    setMemberToDelete(id);
    setShowDeleteModal(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Member Management</h2>
        <button
          onClick={openAdd}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" /> Add New Member
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Members</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, ID, or email..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Members</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Membership Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Member ID</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Expires</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No members found. Click Add New Member to get started.
                  </td>
                </tr>
              ) : (
                filtered.map((member) => {
                  const displayStatus = getMemberDisplayStatus(member.status, member.endDate);
                  const statusClass = getStatusClass(displayStatus);

                  return (
                    <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{member.memberId}</td>
                      <td className="px-6 py-4">{member.fullName}</td>
                      <td className="px-6 py-4">{member.email ?? "—"}</td>
                      <td className="px-6 py-4 capitalize">{member.membershipType}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">{member.endDate ? formatISODateSafe(member.endDate) : "—"}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button onClick={() => openEdit(member)} className="text-blue-600 hover:text-blue-800">
                            <FaEdit />
                          </button>
                          <button onClick={() => openDelete(member.id)} className="text-red-600 hover:text-red-800">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showMemberModal && (
        <MemberModal initialData={editingMember ?? undefined} onClose={() => setShowMemberModal(false)} />
      )}

      {showDeleteModal && memberToDelete !== null && (
        <DeleteModal id={memberToDelete} onClose={() => setShowDeleteModal(false)} />
      )}
    </div>
  );
}
