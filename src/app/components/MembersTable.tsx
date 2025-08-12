'use client'
import React, { useMemo } from 'react';
import { 
  FaEdit, 
  FaTrash, 
  FaPlus 
} from 'react-icons/fa';
import { 
  MembershipStatus, 
  MembershipType,
  Member
} from '@/types/member';
import { parseISO, isAfter, isBefore } from 'date-fns';
import { useMemberContext } from '@/context/MemberContext';

const MembersTable: React.FC = () => {
  const { 
    members, 
    setShowMemberModal, 
    setCurrentEditingId,
    setMemberToDelete,
    setShowDeleteModal,
    searchTerm,
    statusFilter,
    typeFilter,
    setSearchTerm,
    setStatusFilter,
    setTypeFilter
  } = useMemberContext();

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === '' || member.status === statusFilter;
      
      // Type filter
      const matchesType = typeFilter === '' || member.membershipType === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [members, searchTerm, statusFilter, typeFilter]);

  const getStatusBadge = (member: Member) => {
    const now = new Date();
    const endDate = parseISO(member.endDate);
    const isExpired = isBefore(endDate, now);
    const isExpiringSoon = isAfter(endDate, now) && isBefore(endDate, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));
    
    if (isExpired && member.status === 'active') {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
          Expired
        </span>
      );
    }
    
    if (isExpiringSoon && member.status === 'active') {
      return (
        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
          Expiring Soon
        </span>
      );
    }
    
    switch (member.status) {
      case 'active':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Active
          </span>
        );
      case 'expired':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Expired
          </span>
        );
      case 'suspended':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Member Management</h2>
        <button 
          onClick={() => setShowMemberModal(true)}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" /> Add New Member
        </button>
      </div>

      {/* Search and Filter */}
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
              onChange={(e) => setStatusFilter(e.target.value as MembershipStatus | '')}
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
              onChange={(e) => setTypeFilter(e.target.value as MembershipType | '')}
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

      {/* Members Table */}
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
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No members found. Click &quot;Add New Member&quot; to get started.
                  </td>
                </tr>
              ) : (
                filteredMembers.map(member => (
                  <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{member.memberId}</td>
                    <td className="px-6 py-4">{member.fullName}</td>
                    <td className="px-6 py-4">{member.email}</td>
                    <td className="px-6 py-4 capitalize">{member.membershipType}</td>
                    <td className="px-6 py-4">{getStatusBadge(member)}</td>
                    <td className="px-6 py-4">{new Date(member.endDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setCurrentEditingId(member.id);
                            setShowMemberModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => {
                            setMemberToDelete(member.id);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MembersTable;