"use client";
import React, { useMemo } from "react";
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import {
  FaUsers,
  FaUserPlus,
  FaExclamationTriangle,
  FaUserTimes,
  FaPlus,
  FaList,
  FaDownload,
} from "react-icons/fa";
import { useMemberContext } from "@/context/MemberContext";
import { MembershipStatus } from "@/types/member";
import { addDays, isAfter, isBefore, parseISO, startOfDay } from "date-fns";

const Dashboard: React.FC = () => {
  const {
    members,
    setActiveSection,
    setShowMemberModal,
    recentActivities,
    showToastMessage,
  } = useMemberContext();

  // Calculate dashboard stats
  const stats = useMemo(() => {
    const today = startOfDay(new Date());

    // Changed to a more standard 7-day window for "expiring soon" to match common use cases and the display utility
    const sevenDaysFromNow = addDays(today, 7);

    const activeMembers = members.filter((m) => m.status === "active").length;

    const newThisMonth = members.filter((m) => {
      const createdDate = parseISO(m.createdAt || m.startDate);
      return (
        createdDate.getMonth() === today.getMonth() &&
        createdDate.getFullYear() === today.getFullYear()
      );
    }).length;

    const expiringSoon = members.filter((m) => {
      const endDate = parseISO(m.endDate);
      return (
        m.status === "active" &&
        isBefore(endDate, sevenDaysFromNow) && // Check if end date is within the next 7 days
        !isBefore(endDate, today) // Make sure it hasn't expired yet
      );
    }).length;

    const expired = members.filter(
      (m) => m.status === "expired" || isBefore(parseISO(m.endDate), today)
    ).length;

    return { activeMembers, newThisMonth, expiringSoon, expired };
  }, [members]);

  const handleExport = () => {
    const dataStr = JSON.stringify(members, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gym-members-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToastMessage("Data exported successfully!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.text('Gym Members Report', 15, 15);

    const tableColumn = [
      'ID',
      'Full Name',
      'Email',
      'Phone',
      'Membership',
      'Status',
      'Start Date',
      'End Date'
    ];

    const tableRows = members.map(member => [
      member.memberId,
      member.fullName,
      member.email,
      member.phone || 'N/A',
      member.membershipType,
      member.status,
      member.startDate,
      member.endDate
    ]);

    // Use the imported autoTable function
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save(`gym-members-${new Date().toISOString().split('T')[0]}.pdf`);
    showToastMessage('PDF exported successfully!');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Members</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.activeMembers}
              </p>
            </div>
            <FaUsers className="text-orange-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">New This Month</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.newThisMonth}
              </p>
            </div>
            <FaUserPlus className="text-green-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Expiring Soon</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.expiringSoon}
              </p>
            </div>
            <FaExclamationTriangle className="text-yellow-500 text-3xl" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Expired</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.expired}
              </p>
            </div>
            <FaUserTimes className="text-red-500 text-3xl" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowMemberModal(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" /> Add New Member
          </button>
          <button
            onClick={() => setActiveSection("members")}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            <FaList className="mr-2" /> View All Members
          </button>
          <button
            onClick={handleExport}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center"
          >
            <FaDownload className="mr-2" /> Export Data
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center"
          >
            <FaDownload className="mr-2" /> Export Data PDF
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No recent activity to display
            </p>
          ) : (
            recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  {activity.action === "added" && (
                    <FaUserPlus className="text-green-500 mr-3" />
                  )}
                  {activity.action === "updated" && (
                    <FaExclamationTriangle className="text-blue-500 mr-3" />
                  )}
                  {activity.action === "deleted" && (
                    <FaUserTimes className="text-red-500 mr-3" />
                  )}
                  <span>
                    Member <strong>{activity.memberName}</strong> was{" "}
                    {activity.action}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {activity.timestamp}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

