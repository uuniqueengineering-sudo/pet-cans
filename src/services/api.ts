import { ProductItem, CareerRole, InquiryRequest, ReportBatch, WebsiteSettings, AuditLog, AdminUser, JobApplication, SiteImagesConfig } from '../types';
import { safeStorage } from '../utils/storage';

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return safeStorage.getItem('petcans_admin_token');
}

export function setAuthToken(token: string) {
  safeStorage.setItem('petcans_admin_token', token);
}

export function removeAuthToken() {
  safeStorage.removeItem('petcans_admin_token');
  safeStorage.removeItem('petcans_admin_user');
}

export function getStoredUser(): AdminUser | null {
  const u = safeStorage.getItem('petcans_admin_user');
  if (!u) return null;
  try {
    return JSON.parse(u);
  } catch {
    return null;
  }
}

export function setStoredUser(user: AdminUser) {
  safeStorage.setItem('petcans_admin_user', JSON.stringify(user));
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Public
  getPublicProducts: () => request<ProductItem[]>('/products/public'),
  getPublicJobs: () => request<CareerRole[]>('/careers/jobs/public'),
  getPublicSettings: () => request<WebsiteSettings>('/settings'),
  submitInquiry: (payload: {
    type: 'quote' | 'sample' | 'contact' | 'custom_mold';
    name: string;
    company?: string;
    email: string;
    phone?: string;
    productInterest?: string;
    estimatedVolume?: string;
    message: string;
  }) => request<{ success: boolean; request: InquiryRequest; message: string }>('/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  submitApplication: (payload: {
    jobId?: string;
    jobTitle?: string;
    candidateName: string;
    email: string;
    phone: string;
    experienceYears?: string;
    currentLocation?: string;
    resumeNote?: string;
  }) => request<{ success: boolean; application: JobApplication; message: string }>('/careers/applications', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  // Auth
  login: async (email: string, password: string) => {
    const data = await request<{ token: string; user: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(data.token);
    setStoredUser(data.user);
    return data;
  },
  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      removeAuthToken();
    }
  },
  getMe: () => request<AdminUser>('/auth/me'),
  resetPassword: (email: string, newPassword: string, masterKey: string) => request<{ success: boolean; message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, newPassword, masterKey }),
  }),
  requestPasswordReset: (email: string) => request<{ success: boolean; message: string; email: string }>('/auth/request-reset', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  adminResetUserPassword: (userId: string, newPassword: string) => request<{ success: boolean; message: string }>(`/users/${userId}/reset-password`, {
    method: 'POST',
    body: JSON.stringify({ newPassword }),
  }),

  // Products (Admin)
  getAdminProducts: () => request<ProductItem[]>('/products'),
  addProduct: (product: Partial<ProductItem>) => request<ProductItem>('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  updateProduct: (id: string, product: Partial<ProductItem>) => request<ProductItem>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }),
  toggleProductStatus: (id: string) => request<ProductItem>(`/products/${id}/status`, {
    method: 'PATCH',
  }),
  deleteProduct: (id: string) => request<{ success: boolean; message: string }>(`/products/${id}`, {
    method: 'DELETE',
  }),

  // Requests (Admin)
  getRequests: (params?: { status?: string; type?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.type) query.set('type', params.type);
    if (params?.search) query.set('search', params.search);
    return request<InquiryRequest[]>(`/requests?${query.toString()}`);
  },
  updateRequest: (id: string, updates: { status?: string; internalNotes?: string }) => request<InquiryRequest>(`/requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  }),
  deleteRequest: (id: string) => request<{ success: boolean }>(`/requests/${id}`, {
    method: 'DELETE',
  }),

  // 12-Hour Reports (Admin)
  getReports: () => request<{ batches: ReportBatch[]; unreportedCount: number; nextScheduledInHours: number }>('/reports'),
  trigger12HourReport: (forceAll = false) => request<{ success: boolean; total: number; batchId?: string; error?: string }>('/reports/trigger-12h', {
    method: 'POST',
    body: JSON.stringify({ forceAll }),
  }),

  // Careers (Admin)
  getAdminJobs: () => request<CareerRole[]>('/careers/jobs'),
  addJob: (job: Partial<CareerRole>) => request<CareerRole>('/careers/jobs', {
    method: 'POST',
    body: JSON.stringify(job),
  }),
  updateJob: (id: string, job: Partial<CareerRole>) => request<CareerRole>(`/careers/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(job),
  }),
  toggleJobStatus: (id: string) => request<CareerRole>(`/careers/jobs/${id}/status`, {
    method: 'PATCH',
  }),
  deleteJob: (id: string) => request<{ success: boolean }>(`/careers/jobs/${id}`, {
    method: 'DELETE',
  }),
  getApplications: () => request<JobApplication[]>('/careers/applications'),
  updateApplication: (id: string, updates: { status?: string; notes?: string }) => request<JobApplication>(`/careers/applications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  }),

  // Settings & Audit (Admin)
  getAdminSettings: () => request<WebsiteSettings>('/settings/admin'),
  updateAdminSettings: (settings: Partial<WebsiteSettings>) => request<WebsiteSettings>('/settings/admin', {
    method: 'PUT',
    body: JSON.stringify(settings),
  }),
  getAuditLogs: () => request<AuditLog[]>('/audit-logs'),

  // Site Images Management
  getSiteImages: () => request<SiteImagesConfig>('/site-images'),
  updateSiteImages: (images: Partial<SiteImagesConfig>) => request<SiteImagesConfig>('/site-images', {
    method: 'PUT',
    body: JSON.stringify(images),
  }),
  uploadImage: (dataUrl: string, filename?: string) => request<{ success: boolean; url: string; error?: string }>('/upload-image', {
    method: 'POST',
    body: JSON.stringify({ dataUrl, filename }),
  }),

  // Users (Super Admin)
  getUsers: () => request<AdminUser[]>('/users'),
  createUser: (user: { email: string; name: string; password: string; role: string }) => request<AdminUser>('/users', {
    method: 'POST',
    body: JSON.stringify(user),
  }),
  updateUser: (id: string, updates: { role?: string; isActive?: boolean; name?: string; password?: string }) => request<{ success: boolean; user: AdminUser }>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  }),
};
