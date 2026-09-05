export type PageId = 'home' | 'about' | 'products' | 'careers' | 'contact' | 'admin';

export type AdminRole = 'super_admin' | 'manager' | 'staff';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export type ProductCategory = 'food' | 'beverage' | 'caps' | 'preforms' | 'custom' | 'machinery' | 'equipment';

export interface ProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  capacity: string;
  neckSize?: string;
  closureType: string;
  description: string;
  features: string[];
  applications: string[];
  image: string;
  images?: string[];
  badge?: string;
  isPopular?: boolean;
  moq?: string;
  material?: string;
  status?: 'published' | 'draft';
  createdAt?: string;
  updatedAt?: string;
}

export interface FacilityLocation {
  id: string;
  name: string;
  state: 'Delhi' | 'Haryana';
  address: string;
  facilityType: string;
  capabilities: string[];
  badge: string;
}

export interface CareerRole {
  id: string;
  title: string;
  category: 'Production & Plant' | 'Corporate & Support' | 'Early Career';
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  status?: 'published' | 'draft';
  createdAt?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  email: string;
  phone: string;
  experienceYears?: string;
  currentLocation?: string;
  resumeNote?: string;
  status: 'new' | 'under_review' | 'shortlisted' | 'rejected' | 'hired';
  createdAt: string;
  notes?: string;
}

export interface QuoteRequestData {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  reason: string;
  productId?: string;
  estimatedVolume?: string;
  message: string;
}

export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  productInterest?: string;
  estimatedQuantity?: string;
  message: string;
}

export interface InquiryRequest {
  id: string;
  type: 'quote' | 'sample' | 'contact' | 'custom_mold';
  name: string;
  company: string;
  email: string;
  phone: string;
  productInterest?: string;
  estimatedVolume?: string;
  message: string;
  status: 'new' | 'contacted' | 'completed' | 'archived';
  internalNotes?: string;
  reportedToEmail: boolean;
  reportedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportBatch {
  id: string;
  timestamp: string;
  totalRequests: number;
  recipientEmail: string;
  status: 'delivered' | 'pending' | 'failed';
  requestIds: string[];
  htmlPreview: string;
}

export interface WebsiteSettings {
  companyName: string;
  brandName: string;
  parentCompany: string;
  phone: string;
  phoneAlt: string;
  email: string;
  salesEmail: string;
  careersEmail: string;
  reportRecipientEmail: string;
  registeredAddress: string;
  businessHoursWeekdays: string;
  businessHoursSunday: string;
  autoReportIntervalHours: number;
}

export interface SiteImagesConfig {
  hero: string;
  foodJars: string;
  beverageCans: string;
  kingFlatCan: string;
  factory: string;
  customPackaging: string;
  singleCan: string;
  jarCaps: string;
  logoUrl?: string;
  aboutFacility?: string;
  [key: string]: string | undefined;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  userRole: AdminRole;
  action: string;
  target: string;
  details?: string;
}

