'use client'
import Dashboard from './components/Dashboard';
import MemberModal from './components/MemberModal';
import DeleteModal from './components/DeleteModal';
import MembersTable from './components/MembersTable';
import { useMemberContext } from '@/context/MemberContext';

export default function Home() {
  const { 
    activeSection, 
    showMemberModal, 
    setShowMemberModal,
    showDeleteModal,
    setShowDeleteModal
  } = useMemberContext();

  return (
    <div className="min-h-screen">
      {activeSection === 'dashboard' && <Dashboard />}
      {activeSection === 'members' && <MembersTable />}
      
      {showMemberModal && <MemberModal />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
}