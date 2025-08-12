'use client'
import React, { useMemo } from 'react';
import { 
  FaUsers, 
  FaUserPlus, 
  FaExclamationTriangle, 
  FaUserTimes,
  FaPlus,
  FaList,
  FaDownload
} from 'react-icons/fa';
import { useMemberContext } from '@/context/MemberContext';
import { MembershipStatus } from '@/types/member';
import { addMonths, addYears, isAfter, isBefore, parseISO } from 'date-fns';

const Dashboard: React.FC = () => {
  const { 
    members, 
    setActiveSection, 
    setShowMemberModal,
    recentActivities,
    showToastMessage
  } = useMemberContext();

  // Calculate dashboard stats
  const stats = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    const activeMembers = members.filter(m => m.status === 'active').length;
    
    const newThisMonth = members.filter(m => {
      const createdDate = parseISO(m.createdAt || m.startDate);
      return createdDate.getMonth() === now.getMonth() && 
             createdDate.getFullYear() === now.getFullYear();
    }).length;
    
    const expiringSoon = members.filter(m => {
      const endDate = parseISO(m.endDate);
      return m.status === 'active' && 
             isAfter(endDate, now) && 
             isBefore(endDate, thirtyDaysFromNow);
    }).length;
    
    const expired = members.filter(m => 
      m.status === 'expired' || 
      isBefore(parseISO(m.endDate), now)
    ).length;
    
    return { activeMembers, newThisMonth, expiringSoon, expired };
  }, [members]);

  const handleExport = () => {
    const dataStr = JSON.stringify(members, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gym-members-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToastMessage('Data exported successfully!');
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
              <p className="text-3xl font-bold text-gray-800">{stats.activeMembers}</p>
            </div>
            <FaUsers className="text-orange-500 text-3xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">New This Month</p>
              <p className="text-3xl font-bold text-gray-800">{stats.newThisMonth}</p>
            </div>
            <FaUserPlus className="text-green-500 text-3xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Expiring Soon</p>
              <p className="text-3xl font-bold text-gray-800">{stats.expiringSoon}</p>
            </div>
            <FaExclamationTriangle className="text-yellow-500 text-3xl" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Expired</p>
              <p className="text-3xl font-bold text-gray-800">{stats.expired}</p>
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
            onClick={() => setActiveSection('members')}
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
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent activity to display</p>
          ) : (
            recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {activity.action === 'added' && (
                    <FaUserPlus className="text-green-500 mr-3" />
                  )}
                  {activity.action === 'updated' && (
                    <FaExclamationTriangle className="text-blue-500 mr-3" />
                  )}
                  {activity.action === 'deleted' && (
                    <FaUserTimes className="text-red-500 mr-3" />
                  )}
                  <span>Member <strong>{activity.memberName}</strong> was {activity.action}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;