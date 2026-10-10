export type HospitalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Suspended';

export type HospitalCategory = 
  | 'General Hospital' 
  | 'Multi-Specialty' 
  | 'Super-Specialty' 
  | 'District Hospital' 
  | 'Community Health Center';

export type OwnershipType = 'Government' | 'Public-Private' | 'Private' | 'Trust / Non-Profit';

export interface HospitalDocument {
  name: string;
  type: string;
  size: string;
  verified: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  registrationNumber: string;
  licenseNumber: string;
  district: string;
  state: string;
  category: HospitalCategory;
  ownership: OwnershipType;
  status: HospitalStatus;
  appliedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  suspensionReason?: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  availableIcuBeds: number;
  ventilators: number;
  availableVentilators: number;
  emergencyServices: boolean;
  ambulanceCount: number;
  accreditation: 'NABH Accredited' | 'JCI Accredited' | 'ISO 9001:2015' | 'State Certified' | 'Under Review';
  documents: HospitalDocument[];
}

export interface DistrictCapacity {
  district: string;
  totalHospitals: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  icuTotal: number;
  icuOccupied: number;
  icuAvailable: number;
  ventilatorTotal: number;
  ventilatorAvailable: number;
  emergencyStatus: 'Normal' | 'Elevated' | 'High' | 'Critical';
  reportedAt: string;
}

export type ComplaintCategory =
  | 'Overcharging / Billing Irregularity'
  | 'Medical Negligence'
  | 'Infrastructure / Sanitation'
  | 'Staff Misconduct'
  | 'Denial of Emergency Care'
  | 'Essential Medicine Shortage';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved' | 'Escalated';

export interface ComplaintAuditItem {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  notes?: string;
}

export interface Complaint {
  id: string;
  hospitalId: string;
  hospitalName: string;
  district: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  submittedBy: string;
  contactEmail: string;
  submittedDate: string;
  description: string;
  assignedTo?: string;
  resolutionNotes?: string;
  resolvedDate?: string;
  history: ComplaintAuditItem[];
}

export type AnnouncementCategory =
  | 'Disease Outbreak Alert'
  | 'Vaccination Drive'
  | 'Regulatory Policy Update'
  | 'Emergency Healthcare Advisory'
  | 'Hospital Compliance Directive';

export type AnnouncementStatus = 'Draft' | 'Published' | 'Archived';

export interface Announcement {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: AnnouncementCategory;
  targetAudience: string;
  targetDistricts: string[];
  priority: 'Normal' | 'High' | 'Urgent';
  status: AnnouncementStatus;
  publishedDate?: string;
  createdDate: string;
  author: string;
  referenceNumber: string;
}

export interface StaffMember {
  id: string;
  name: string;
  badgeId: string;
  email: string;
  role: 'Chief Medical Officer' | 'Senior Healthcare Regulator' | 'District Health Inspector' | 'Compliance & Audit Officer' | 'Grievance Redressal Officer';
  department: string;
  district: string;
  status: 'Active' | 'On Leave' | 'Suspended';
  assignedCasesCount: number;
  joinedDate: string;
  avatarUrl?: string;
}

export interface ActivityLog {
  id: string;
  actionType: 
    | 'HOSPITAL_APPROVED' 
    | 'HOSPITAL_REJECTED' 
    | 'HOSPITAL_SUSPENDED' 
    | 'COMPLAINT_STATUS_UPDATED' 
    | 'COMPLAINT_ASSIGNED' 
    | 'ANNOUNCEMENT_PUBLISHED' 
    | 'ANNOUNCEMENT_ARCHIVED' 
    | 'ADMIN_LOGIN';
  actor: string;
  actorRole: string;
  timestamp: string;
  relatedRecord: string;
  details: string;
  ipAddress: string;
}

export interface DashboardStats {
  totalRegisteredHospitals: number;
  hospitalsAwaitingApproval: number;
  reportedAvailableBeds: number;
  totalBedsCapacity: number;
  openComplaints: number;
  urgentComplaints: number;
  activeAnnouncements: number;
  bedOccupancyRate: number;
}
