export type MembershipType = 'monthly' | 'quarterly' | 'annual';
export type MembershipStatus = 'active' | 'expired' | 'suspended';

export interface Member {
  id: number;
  fullName: string;
  memberId: string;
  email: string;
  phone?: string;
  membershipType: MembershipType;
  status: MembershipStatus;
  startDate: string;
  endDate: string;
  notes?: string;
  createdAt: string;
}

export interface MemberFormData {
  fullName: string;
  memberId: string;
  email: string;
  phone?: string;
  membershipType: MembershipType;
  status: MembershipStatus;
  startDate: string;
  endDate: string;
  notes?: string;
}