import React, { useState, useEffect } from 'react';
import {
  AdminUser,
  AdminRole,
  ProductItem,
  InquiryRequest,
  CareerRole,
  JobApplication,
  ReportBatch,
  WebsiteSettings,
  AuditLog,
  PageId,
  SiteImagesConfig,
} from '../types';
import { api, getStoredUser, removeAuthToken } from '../services/api';
import { IMAGES } from '../data/companyData';
import { useSiteImages, DEFAULT_SITE_IMAGES } from '../context/SiteImagesContext';
import { AdminMediaManager } from '../components/AdminMediaManager';
import { AdminProductImagesManager } from '../components/AdminProductImagesManager';
import {
  Lock,
  User,
  LogOut,
  Package,
  Inbox,
  Mail,
  Briefcase,
  Settings as SettingsIcon,
  ShieldCheck,
  Activity,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Send,
  Search,
  Filter,
  RefreshCw,
  X,
  Upload,
  AlertCircle,
  AlertTriangle,
  FileText,
  UserCheck,
  UserX,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Image as ImageIcon,
  RotateCcw,
  Check,
  Copy,
  EyeOff,
  KeyRound,
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (page: PageId) => void;
}

type AdminTab = 'overview' | 'products' | 'media' | 'requests' | 'reports' | 'careers' | 'settings' | 'users' | 'audit';

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(getStoredUser());
  const [loginEmail, setLoginEmail] = useState('uunequeengineering@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Password Reset System state
  const [authMode, setAuthMode] = useState<'login' | 'reset'>('login');
  const [resetEmail, setResetEmail] = useState('uunequeengineering@gmail.com');
  const [resetMasterKey, setResetMasterKey] = useState('210107');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  // Super Admin in-dashboard user reset modal
  const [resetTargetUser, setResetTargetUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [targetNewPassword, setTargetNewPassword] = useState('');
  const [isTargetResetting, setIsTargetResetting] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const safeConfirm = (msg: string): boolean => {
    try {
      if (typeof window !== 'undefined' && window.confirm) {
        return window.confirm(msg);
      }
    } catch {
      // Sandboxed iframe blocked confirm
    }
    return true;
  };

  // Site Images Context & Local State
  const { images: currentGlobalImages, updateSiteImages: contextUpdateSiteImages, refreshImages: contextRefreshImages } = useSiteImages();
  const [siteImagesState, setSiteImagesState] = useState<SiteImagesConfig>(currentGlobalImages);
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<'all' | 'banners' | 'beverage' | 'food' | 'plant'>('all');
  const [isSavingMedia, setIsSavingMedia] = useState(false);
  const [uploadingSlotKey, setUploadingSlotKey] = useState<string | null>(null);
  const [recentlyUploadedUrls, setRecentlyUploadedUrls] = useState<Array<{ name: string; url: string }>>([]);

  // Data states
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [requests, setRequests] = useState<InquiryRequest[]>([]);
  const [jobs, setJobs] = useState<CareerRole[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [reportsData, setReportsData] = useState<{ batches: ReportBatch[]; unreportedCount: number; nextScheduledInHours: number }>({
    batches: [],
    unreportedCount: 0,
    nextScheduledInHours: 12,
  });
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Filtering
  const [requestStatusFilter, setRequestStatusFilter] = useState('all');
  const [requestSearch, setRequestSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Modals & Drawers
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem> | null>(null);

  const [selectedRequest, setSelectedRequest] = useState<InquiryRequest | null>(null);
  const [selectedReportBatch, setSelectedReportBatch] = useState<ReportBatch | null>(null);

  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Partial<CareerRole> | null>(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminRole>('staff');

  const [careersSubTab, setCareersSubTab] = useState<'jobs' | 'applications'>('jobs');
  const [isTriggeringReport, setIsTriggeringReport] = useState(false);

  // Auto-dismiss success notification
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Auto-dismiss error notification
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 6000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Load user data on startup if already logged in
  useEffect(() => {
    if (currentUser) {
      loadInitialData();
    }
  }, [currentUser]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [prodsData, reqsData, reportsRes, settingsData] = await Promise.allSettled([
        api.getAdminProducts(),
        api.getRequests(),
        api.getReports(),
        api.getAdminSettings(),
      ]);

      if (prodsData.status === 'fulfilled') setProducts(prodsData.value);
      if (reqsData.status === 'fulfilled') setRequests(reqsData.value);
      if (reportsRes.status === 'fulfilled') setReportsData(reportsRes.value);
      if (settingsData.status === 'fulfilled') setSettings(settingsData.value);

      // Load careers
      api.getAdminJobs().then(setJobs).catch(() => {});
      api.getApplications().then(setApplications).catch(() => {});

      // Super Admin specific data
      if (currentUser?.role === 'super_admin') {
        api.getUsers().then(setUsersList).catch(() => {});
        api.getAuditLogs().then(setAuditLogs).catch(() => {});
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);
    try {
      const res = await api.login(loginEmail, loginPassword);
      setCurrentUser(res.user);
      setSuccessMessage(`Welcome back, ${res.user.name} (${res.user.role.toUpperCase()})`);
    } catch (err: any) {
      setAuthError(err.message || 'Invalid login credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    removeAuthToken();
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccessMessage('');

    if (!resetEmail || !resetNewPassword || !resetMasterKey) {
      setResetError('Please enter Admin Email, Master Security Key, and New Password.');
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      setResetError('New password and confirmation password do not match.');
      return;
    }
    if (resetNewPassword.length < 6) {
      setResetError('New password must be at least 6 characters long.');
      return;
    }

    setIsResetting(true);
    try {
      const res = await api.resetPassword(resetEmail, resetNewPassword, resetMasterKey);
      setResetSuccessMessage(res.message || 'Password successfully updated! You can now sign in.');
      setLoginEmail(resetEmail);
      // Clear all password fields so they never auto-fill
      setLoginPassword('');
      setResetNewPassword('');
      setResetConfirmPassword('');
    } catch (err: any) {
      setResetError(err.message || 'Failed to reset password. Please check your Master Security Key.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleAdminResetUserPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetUser || !targetNewPassword) return;
    if (targetNewPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    setIsTargetResetting(true);
    try {
      await api.adminResetUserPassword(resetTargetUser.id, targetNewPassword);
      setSuccessMessage(`Password for ${resetTargetUser.email} has been reset successfully.`);
      setResetTargetUser(null);
      setTargetNewPassword('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password.');
    } finally {
      setIsTargetResetting(false);
    }
  };

  // ==========================================
  // PRODUCT ACTIONS
  // ==========================================
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.category || !editingProduct?.capacity || !editingProduct?.description) {
      setErrorMessage('Please fill in Name, Category, Capacity, and Description.');
      return;
    }

    try {
      if (editingProduct.id) {
        const updated = await api.updateProduct(editingProduct.id, editingProduct);
        setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
        setSuccessMessage(`Product "${updated.name}" updated successfully.`);
      } else {
        const created = await api.addProduct(editingProduct);
        setProducts(prev => [created, ...prev]);
        setSuccessMessage(`Product "${created.name}" published to catalog.`);
      }
      setShowProductModal(false);
      setEditingProduct(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save product.');
    }
  };

  const handleToggleProductStatus = async (id: string) => {
    try {
      const updated = await api.toggleProductStatus(id);
      setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      setSuccessMessage(`Product status updated to: ${updated.status}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to change product status.');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!safeConfirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setSuccessMessage(`Product "${name}" deleted.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete product.');
    }
  };

  // ==========================================
  // REQUEST ACTIONS
  // ==========================================
  const handleUpdateRequestStatus = async (id: string, newStatus: string) => {
    try {
      const updated = await api.updateRequest(id, { status: newStatus });
      setRequests(prev => prev.map(r => (r.id === updated.id ? updated : r)));
      if (selectedRequest?.id === id) setSelectedRequest(updated);
      setSuccessMessage(`Inquiry status updated to ${newStatus}.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update request.');
    }
  };

  const handleSaveRequestNotes = async (id: string, notes: string) => {
    try {
      const updated = await api.updateRequest(id, { internalNotes: notes });
      setRequests(prev => prev.map(r => (r.id === updated.id ? updated : r)));
      if (selectedRequest?.id === id) setSelectedRequest(updated);
      setSuccessMessage('Internal follow-up notes saved.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save notes.');
    }
  };

  // ==========================================
  // 12-HOUR REPORT TRIGGER
  // ==========================================
  const handleTriggerReport = async (forceAll = false) => {
    setIsTriggeringReport(true);
    try {
      const res = await api.trigger12HourReport(forceAll);
      if (res.success) {
        setSuccessMessage(`12-Hour Report Dispatched! ${res.total} inquiries compiled & verified.`);
        // Reload reports
        const updatedReports = await api.getReports();
        setReportsData(updatedReports);
        const updatedReqs = await api.getRequests();
        setRequests(updatedReqs);
      } else {
        setErrorMessage('Report trigger encountered an issue: ' + res.error);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to trigger report.');
    } finally {
      setIsTriggeringReport(false);
    }
  };

  // ==========================================
  // CAREERS ACTIONS
  // ==========================================
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob?.title || !editingJob?.category || !editingJob?.location || !editingJob?.description) {
      setErrorMessage('Please fill in Title, Category, Location, and Description.');
      return;
    }

    try {
      if (editingJob.id) {
        const updated = await api.updateJob(editingJob.id, editingJob);
        setJobs(prev => prev.map(j => (j.id === updated.id ? updated : j)));
        setSuccessMessage(`Job "${updated.title}" updated.`);
      } else {
        const created = await api.addJob(editingJob);
        setJobs(prev => [created, ...prev]);
        setSuccessMessage(`Job "${created.title}" created.`);
      }
      setShowJobModal(false);
      setEditingJob(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save job opening.');
    }
  };

  const handleToggleJobStatus = async (id: string) => {
    try {
      const updated = await api.toggleJobStatus(id);
      setJobs(prev => prev.map(j => (j.id === updated.id ? updated : j)));
      setSuccessMessage(`Job status toggled to: ${updated.status}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update job status.');
    }
  };

  const handleDeleteJob = async (id: string, title: string) => {
    if (!safeConfirm(`Delete job opening "${title}"?`)) return;
    try {
      await api.deleteJob(id);
      setJobs(prev => prev.filter(j => j.id !== id));
      setSuccessMessage(`Job opening deleted.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete job.');
    }
  };

  const handleUpdateAppStatus = async (id: string, status: string, notes?: string) => {
    try {
      const updated = await api.updateApplication(id, { status, notes });
      setApplications(prev => prev.map(a => (a.id === updated.id ? updated : a)));
      setSuccessMessage(`Applicant status marked as ${status}.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update candidate status.');
    }
  };

  // ==========================================
  // SETTINGS ACTIONS
  // ==========================================
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const updated = await api.updateAdminSettings(settings);
      setSettings(updated);
      setSuccessMessage('Website configuration & operating parameters saved.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save settings.');
    }
  };

  // ==========================================
  // USER MANAGEMENT (SUPER ADMIN)
  // ==========================================
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserName || !newUserPassword || !newUserRole) {
      setErrorMessage('Please fill in all user fields.');
      return;
    }
    try {
      const created = await api.createUser({
        email: newUserEmail,
        name: newUserName,
        password: newUserPassword,
        role: newUserRole,
      });
      setUsersList(prev => [...prev, created]);
      setSuccessMessage(`Admin user "${created.name}" created with role ${created.role}.`);
      setShowUserModal(false);
      setNewUserEmail('');
      setNewUserName('');
      setNewUserPassword('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create admin user.');
    }
  };

  const handleToggleUserActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await api.updateUser(id, { isActive: !currentActive });
      setUsersList(prev => prev.map(u => (u.id === id ? { ...u, isActive: res.user.isActive } : u)));
      setSuccessMessage(`Admin status set to ${res.user.isActive ? 'Active' : 'Deactivated'}.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update user status.');
    }
  };

  const handleUpdateUserRole = async (id: string, newRole: string) => {
    try {
      const res = await api.updateUser(id, { role: newRole });
      setUsersList(prev => prev.map(u => (u.id === id ? { ...u, role: res.user.role } : u)));
      setSuccessMessage(`Admin role updated to ${newRole}.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to change user role.');
    }
  };

  // Role Permissions Checks
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isManager = currentUser?.role === 'manager' || isSuperAdmin;
  const isStaff = currentUser?.role === 'staff' || isManager;

  // Filtered requests list
  const filteredRequests = requests.filter(r => {
    if (requestStatusFilter !== 'all' && r.status !== requestStatusFilter) return false;
    if (requestSearch) {
      const q = requestSearch.toLowerCase();
      const match =
        r.name.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        (r.productInterest && r.productInterest.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Filtered products list
  const filteredProducts = products.filter(p => {
    if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) return false;
    return true;
  });

  // ==========================================
  // UN-AUTHENTICATED LOGIN & RESET SYSTEM SCREEN
  // ==========================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0F1E36] flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-lg bg-white border-2 border-[#C88214] shadow-2xl p-6 sm:p-8 space-y-6">
          
          {/* Header Branding */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-[#FAF6EE] border border-[#C88214]/40 text-[#C88214] mb-1 shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C88214] font-bold">
              AUTHORIZED PERSONNEL & OPERATIONS PORTAL
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F1E36] tracking-tight">
              Executive Management Console
            </h1>
            <p className="text-xs text-[#5A5348] max-w-sm mx-auto">
              Secure administrative system for Uunique Engineering PET Cans manufacturing, quotation dispatch, 12-hour automated digests, and RBAC control.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-[#F5EFE6] p-1 border border-[#E3D8C8]">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setAuthError('');
                setResetError('');
              }}
              className={`py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-[#0F1E36] shadow-xs border border-[#C88214]'
                  : 'text-[#71695D] hover:text-[#0F1E36]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('reset');
                setAuthError('');
                setResetError('');
              }}
              className={`py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                authMode === 'reset'
                  ? 'bg-white text-[#0F1E36] shadow-xs border border-[#C88214]'
                  : 'text-[#71695D] hover:text-[#0F1E36]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-[#C88214]" />
              <span>Reset System</span>
            </button>
          </div>

          {/* TAB 1: SIGN IN MODE */}
          {authMode === 'login' && (
            <div className="space-y-4">
              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {resetSuccessMessage && (
                <div className="p-3 bg-green-50 border border-green-300 text-green-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
                  <span>{resetSuccessMessage}</span>
                </div>
              )}

              <div className="p-3 bg-[#FAF6EE] border border-[#E3D8C8] text-[11px] space-y-1">
                <div className="flex items-center justify-between text-[#0F1E36] font-bold">
                  <span className="font-mono uppercase text-[#C88214]">Super Admin Account:</span>
                  <span className="bg-[#2D5A27] text-white text-[9px] px-1.5 py-0.2 uppercase font-mono">Verified</span>
                </div>
                <div className="font-mono text-[#0F1E36] font-bold truncate">uunequeengineering@gmail.com</div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    Admin Email Address:
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="uunequeengineering@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#FAF6EE] border border-[#E3D8C8] text-sm text-[#0F1E36] font-mono focus:border-[#C88214] focus:bg-white outline-none"
                    />
                    <User className="w-4 h-4 text-[#71695D] absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono uppercase font-bold text-[#444440]">
                      Password:
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthMode('reset')}
                      className="text-[10px] font-mono text-[#C88214] hover:underline cursor-pointer font-bold"
                    >
                      Reset Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-9 pr-10 py-2.5 bg-[#FAF6EE] border border-[#E3D8C8] text-sm text-[#0F1E36] font-mono focus:border-[#C88214] focus:bg-white outline-none"
                    />
                    <Lock className="w-4 h-4 text-[#71695D] absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#71695D] hover:text-[#0F1E36] cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 bg-[#0F1E36] hover:bg-[#C88214] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 border border-[#0F1E36] shadow-sm"
                >
                  {isLoggingIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4 text-[#DF9B2D]" />}
                  <span>{isLoggingIn ? 'Verifying Super Admin...' : 'Sign In as Super Admin'}</span>
                </button>
              </form>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setAuthMode('reset')}
                  className="text-xs text-[#C88214] hover:text-[#0F1E36] font-semibold flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Master Password Reset System (Key: 210107)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MASTER PASSWORD RESET SYSTEM */}
          {authMode === 'reset' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#FAF6EE] border-l-4 border-[#C88214] text-xs space-y-1">
                <div className="font-bold text-[#0F1E36] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C88214]" />
                  <span>Executive Password Reset Engine</span>
                </div>
                <p className="text-[#5A5348] text-[11px]">
                  Authorize password reset using the 6-digit Master Security Key. Authorized Key: <strong className="font-mono text-[#0F1E36]">210107</strong>
                </p>
              </div>

              {resetError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              {resetSuccessMessage ? (
                <div className="p-4 bg-green-50 border-2 border-green-400 text-green-900 text-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>Password Successfully Reset!</span>
                  </div>
                  <p className="text-[11px] text-green-800">
                    The credentials for <strong className="font-mono">{resetEmail}</strong> have been updated in the database.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="w-full py-2.5 bg-[#0F1E36] hover:bg-[#C88214] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Sign In</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                      Admin Email to Reset:
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="uunequeengineering@gmail.com"
                        className="w-full pl-9 pr-3 py-2 bg-[#FAF6EE] border border-[#E3D8C8] text-xs font-mono text-[#0F1E36] focus:border-[#C88214] focus:bg-white outline-none"
                      />
                      <Mail className="w-3.5 h-3.5 text-[#71695D] absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                      6-Digit Master Security Key:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        autoComplete="off"
                        value={resetMasterKey}
                        onChange={(e) => setResetMasterKey(e.target.value)}
                        placeholder="210107"
                        maxLength={10}
                        className="w-full pl-9 pr-3 py-2 bg-[#FAF6EE] border border-[#C88214] text-xs font-mono font-bold text-[#0F1E36] focus:bg-white outline-none tracking-widest"
                      />
                      <KeyRound className="w-3.5 h-3.5 text-[#C88214] absolute left-3 top-2.5" />
                    </div>
                    <span className="text-[10px] text-[#71695D] font-mono mt-0.5 block">
                      Master Key: <strong className="text-[#0F1E36]">210107</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                        New Password:
                      </label>
                      <div className="relative">
                        <input
                          type={showResetPassword ? 'text' : 'password'}
                          required
                          autoComplete="new-password"
                          value={resetNewPassword}
                          onChange={(e) => setResetNewPassword(e.target.value)}
                          placeholder="Min 6 chars"
                          className="w-full pl-9 pr-8 py-2 bg-[#FAF6EE] border border-[#E3D8C8] text-xs font-mono text-[#0F1E36] focus:border-[#C88214] focus:bg-white outline-none"
                        />
                        <Lock className="w-3.5 h-3.5 text-[#71695D] absolute left-3 top-2.5" />
                        <button
                          type="button"
                          onClick={() => setShowResetPassword(!showResetPassword)}
                          className="absolute right-2.5 top-2.5 text-[#71695D] hover:text-[#0F1E36] cursor-pointer"
                        >
                          {showResetPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                        Confirm New Password:
                      </label>
                      <div className="relative">
                        <input
                          type={showResetPassword ? 'text' : 'password'}
                          required
                          autoComplete="new-password"
                          value={resetConfirmPassword}
                          onChange={(e) => setResetConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          className="w-full pl-9 pr-3 py-2 bg-[#FAF6EE] border border-[#E3D8C8] text-xs font-mono text-[#0F1E36] focus:border-[#C88214] focus:bg-white outline-none"
                        />
                        <Lock className="w-3.5 h-3.5 text-[#71695D] absolute left-3 top-2.5" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isResetting}
                    className="w-full py-3 bg-[#C88214] hover:bg-[#0F1E36] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 border border-[#C88214] shadow-sm mt-2"
                  >
                    {isResetting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    <span>{isResetting ? 'Verifying & Updating...' : 'Authorize & Set New Password'}</span>
                  </button>
                </form>
              )}

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs text-[#71695D] hover:text-[#0F1E36] font-semibold underline cursor-pointer"
                >
                  ← Back to Admin Sign In
                </button>
              </div>
            </div>
          )}

          {/* Return to Website link */}
          <div className="text-center pt-2 border-t border-[#E3D8C8]">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-[#71695D] hover:text-[#0F1E36] font-semibold cursor-pointer"
            >
              ← Return to Public Website (petcans.in)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1A1A1A]">
      {/* Top Admin Status Bar */}
      <div className="bg-[#1A1A1A] text-white border-b border-[#333330] px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#2D5A27] flex items-center justify-center font-bold text-sm tracking-wider">
              PC
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight">PET CANS INDIA — ADMIN PORTAL</div>
              <div className="text-[10px] font-mono text-[#999990] flex items-center gap-2">
                <span>Logged in as: <strong className="text-white">{currentUser.name}</strong></span>
                <span className="px-1.5 py-0.5 bg-[#2D5A27] text-white text-[9px] font-bold uppercase rounded">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 text-xs font-mono bg-[#333330] hover:bg-[#444440] text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-mono bg-red-950/40 hover:bg-red-900 border border-red-800/60 text-red-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="bg-[#2D5A27] text-white px-4 py-2 text-center text-xs font-mono font-bold flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="bg-[#991B1B] text-white px-4 py-2 text-center text-xs font-mono font-bold flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <AlertTriangle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="bg-white border border-[#E5E5E0] p-1.5 flex flex-wrap items-center gap-1 shadow-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-[#1A1A1A] text-white' : 'text-[#555550] hover:bg-[#F5F5F4]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'products' ? 'bg-[#1A1A1A] text-white' : 'text-[#555550] hover:bg-[#F5F5F4]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          {isManager && (
            <button
              onClick={() => setActiveTab('media')}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'media' ? 'bg-[#1A1A1A] text-white' : 'text-[#555550] hover:bg-[#F5F5F4]'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Site Images & Visuals</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer relative ${
              activeTab === 'requests' ? 'bg-[#1A1A1A] text-white' : 'text-[#555550] hover:bg-[#F5F5F4]'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Inquiries & Quotes</span>
            {requests.filter(r => r.status === 'new').length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#2D5A27] text-white text-[10px] font-mono font-bold rounded-full">
                {requests.filter(r => r.status === 'new').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'reports' ? 'bg-[#1A1A1A] text-white' : 'text-[#555550] hover:bg-[#F5F5F4]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>12-Hour Reports</span>
            {reportsData.unreportedCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-600 text-white text-[10px] font-mono font-bold rounded-full">
                {reportsData.unreportedCount} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('careers')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'careers' ? 'bg-[#1A1A1A] text-white' : 'text-[#555550] hover:bg-[#F5F5F4]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Careers ({jobs.length})</span>
          </button>

          {isManager && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'settings' ? 'bg-[#1A1A1A] text-white' : 'text-[#555550] hover:bg-[#F5F5F4]'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Settings</span>
            </button>
          )}

          {isSuperAdmin && (
            <>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'users' ? 'bg-[#1A1A1A] text-white' : 'text-[#555550] hover:bg-[#F5F5F4]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admins & RBAC</span>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'audit' ? 'bg-[#1A1A1A] text-white' : 'text-[#555550] hover:bg-[#F5F5F4]'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Audit Logs</span>
              </button>
            </>
          )}

          <div className="ml-auto flex items-center pr-2">
            <button
              onClick={loadInitialData}
              disabled={loading}
              title="Refresh all data"
              className="p-2 text-[#777770] hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* ==========================================
            TAB 1: OVERVIEW & DASHBOARD
        ========================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#E5E5E0] p-5 space-y-2">
                <div className="text-[10px] font-mono uppercase text-[#777770] font-bold">Total Inquiries Logged</div>
                <div className="text-3xl font-extrabold text-[#1A1A1A]">{requests.length}</div>
                <div className="text-xs text-[#2D5A27] font-semibold flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#2D5A27]" />
                  <span>{requests.filter(r => r.status === 'new').length} Pending Action</span>
                </div>
              </div>

              <div className="bg-white border border-[#E5E5E0] p-5 space-y-2">
                <div className="text-[10px] font-mono uppercase text-[#777770] font-bold">Published Products</div>
                <div className="text-3xl font-extrabold text-[#2D5A27]">
                  {products.filter(p => p.status === 'published').length}
                </div>
                <div className="text-xs text-[#777770] font-mono">
                  {products.filter(p => p.status === 'draft').length} Draft items in catalog
                </div>
              </div>

              <div className="bg-white border border-[#E5E5E0] p-5 space-y-2">
                <div className="text-[10px] font-mono uppercase text-[#777770] font-bold">12-Hour Email Queue</div>
                <div className="text-3xl font-extrabold text-amber-600">{reportsData.unreportedCount}</div>
                <div className="text-xs text-[#777770] font-mono">
                  Unreported leads ready for next digest
                </div>
              </div>

              <div className="bg-white border border-[#E5E5E0] p-5 space-y-2">
                <div className="text-[10px] font-mono uppercase text-[#777770] font-bold">Job Applicants</div>
                <div className="text-3xl font-extrabold text-[#1A1A1A]">{applications.length}</div>
                <div className="text-xs text-[#2D5A27] font-semibold">
                  {applications.filter(a => a.status === 'new').length} New resumes to review
                </div>
              </div>
            </div>

            {/* 12-Hour Report Executive Widget */}
            <div className="bg-[#1A1A1A] text-white p-6 border-l-4 border-[#2D5A27] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2 text-[#2D5A27] font-mono text-[11px] uppercase tracking-widest font-bold">
                  <Clock className="w-4 h-4" />
                  <span>AUTOMATED 12-HOUR EXECUTIVE EMAIL ENGINE</span>
                </div>
                <h3 className="text-lg font-bold">
                  Guaranteed Inquiry Delivery & Digest System
                </h3>
                <p className="text-xs text-[#CCCCCC] leading-relaxed">
                  Every 12 hours, the engine automatically compiles all new, uncontacted customer leads into a clean, formatted HTML email table to <strong>{settings?.reportRecipientEmail || 'reports@petcans.in'}</strong>. Inquiries are only marked as reported once verified, preventing lead loss.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-3 shrink-0">
                {isManager && (
                  <button
                    onClick={() => handleTriggerReport(false)}
                    disabled={isTriggeringReport}
                    className="px-5 py-3 bg-[#2D5A27] hover:bg-white hover:text-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#2D5A27]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isTriggeringReport ? 'Sending...' : 'Trigger 12-Hour Digest Now'}</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('reports')}
                  className="px-4 py-3 bg-[#333330] hover:bg-[#444440] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Report History</span>
                </button>
              </div>
            </div>

            {/* Recent Inquiries Quick Table */}
            <div className="bg-white border border-[#E5E5E0] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#1A1A1A]">Recent Inquiries & Quote Submissions</h3>
                  <p className="text-xs text-[#777770]">Real-time leads submitted via public contact and product pages</p>
                </div>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="text-xs font-bold uppercase tracking-wider text-[#2D5A27] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All ({requests.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F5F5F4] border-b border-[#E5E5E0] font-mono text-[10px] uppercase text-[#777770]">
                      <th className="p-3">Client Name</th>
                      <th className="p-3">Company</th>
                      <th className="p-3">Phone & Email</th>
                      <th className="p-3">Interest</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E0]">
                    {requests.slice(0, 5).map((req) => (
                      <tr key={req.id} className="hover:bg-[#FAFAFA] transition-colors">
                        <td className="p-3 font-bold text-[#1A1A1A]">{req.name}</td>
                        <td className="p-3 text-[#555550]">{req.company || '—'}</td>
                        <td className="p-3 font-mono text-[11px]">
                          <div>{req.phone || 'No phone'}</div>
                          <div className="text-[#777770]">{req.email}</div>
                        </td>
                        <td className="p-3 text-[#1A1A1A]">{req.productInterest || req.type}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                              req.status === 'new'
                                ? 'bg-amber-100 text-amber-800'
                                : req.status === 'contacted'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setActiveTab('requests');
                            }}
                            className="px-2.5 py-1 bg-[#F5F5F4] hover:bg-[#1A1A1A] hover:text-white text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: PRODUCT MANAGEMENT
        ========================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">Products & Inventory Management</h2>
                <p className="text-xs text-[#777770]">
                  Published items immediately appear on the public products page. Drafts remain internal.
                </p>
              </div>

              {isManager && (
                <button
                  onClick={() => {
                    const defaultImg = DEFAULT_SITE_IMAGES.foodJars || '/src/assets/images/can_easy_open_1788254205018.jpg';
                    setEditingProduct({
                      category: 'food',
                      closureType: 'Standard Lid',
                      status: 'published',
                      features: [],
                      applications: [],
                      image: defaultImg,
                      images: [defaultImg],
                    });
                    setShowProductModal(true);
                  }}
                  className="px-5 py-2.5 bg-[#2D5A27] hover:bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer border border-[#2D5A27]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All Products' },
                { id: 'food', label: 'Food Packaging' },
                { id: 'beverage', label: 'Beverage Packaging' },
                { id: 'machinery', label: 'Sealing Machines' },
                { id: 'caps', label: 'Caps & Closures' },
                { id: 'preforms', label: 'PET Preforms' },
                { id: 'custom', label: 'Custom Tooling' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setProductCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    productCategoryFilter === cat.id
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-white text-[#555550] border border-[#E5E5E0] hover:bg-[#F5F5F4]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <div key={prod.id} className="bg-white border border-[#E5E5E0] flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="relative h-48 bg-[#F5F5F4] overflow-hidden border-b border-[#E5E5E0]">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span
                          className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
                            prod.status === 'published'
                              ? 'bg-[#2D5A27] text-white'
                              : 'bg-amber-600 text-white'
                          }`}
                        >
                          {prod.status}
                        </span>
                        {prod.badge && (
                          <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-[#1A1A1A] text-white">
                            {prod.badge}
                          </span>
                        )}
                      </div>
                      {prod.images && prod.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                          <ImageIcon className="w-2.5 h-2.5" />
                          <span>{prod.images.length} Angles</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="text-[10px] font-mono uppercase text-[#2D5A27] font-bold">
                        Category: {prod.category} • {prod.capacity}
                      </div>
                      <h3 className="font-bold text-base text-[#1A1A1A] leading-snug">{prod.name}</h3>
                      <p className="text-xs text-[#555550] line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                      <div className="pt-2 text-[11px] font-mono text-[#777770] border-t border-[#E5E5E0] space-y-1">
                        <div>Neck: <strong>{prod.neckSize || 'Standard'}</strong></div>
                        <div>Closure: <strong>{prod.closureType}</strong></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FAFAFA] border-t border-[#E5E5E0] flex items-center justify-between gap-2">
                    {isManager ? (
                      <>
                        <button
                          onClick={() => handleToggleProductStatus(prod.id)}
                          className="px-2.5 py-1.5 bg-white border border-[#E5E5E0] hover:bg-[#F5F5F4] text-[10px] font-mono uppercase font-bold transition-colors cursor-pointer"
                        >
                          {prod.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const prodImages = (prod.images && prod.images.length > 0)
                                ? prod.images
                                : (prod.image ? [prod.image] : []);
                              setEditingProduct({
                                ...prod,
                                images: prodImages,
                                image: prodImages[0] || prod.image,
                              });
                              setShowProductModal(true);
                            }}
                            className="p-1.5 text-[#555550] hover:text-[#1A1A1A] hover:bg-white border border-transparent hover:border-[#E5E5E0] transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <span className="text-[10px] font-mono text-[#777770]">View only permissions (Staff)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB: SITE IMAGES & MEDIA GALLERY
        ========================================== */}
        {activeTab === 'media' && isManager && (
          <AdminMediaManager
            currentImages={siteImagesState}
            onSaveImages={async (newImages) => {
              setIsSavingMedia(true);
              try {
                await contextUpdateSiteImages(newImages);
                setSiteImagesState((prev) => ({ ...prev, ...newImages }));
                setSuccessMessage('Site images successfully saved and updated live across the entire website.');
              } catch (err: any) {
                setErrorMessage('Failed to save site images: ' + (err.message || 'Unknown error'));
              } finally {
                setIsSavingMedia(false);
              }
            }}
            isSaving={isSavingMedia}
          />
        )}

        {/* ==========================================
            TAB 3: INQUIRIES & QUOTE REQUESTS
        ========================================== */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">Customer Inquiries & Quote Requests</h2>
                <p className="text-xs text-[#777770]">
                  Real-time leads submitted via public contact and product pages
                </p>
              </div>

              {isManager && (
                <button
                  onClick={() => handleTriggerReport(false)}
                  disabled={isTriggeringReport}
                  className="px-4 py-2 bg-[#2D5A27] hover:bg-[#1A1A1A] text-white text-xs font-mono uppercase font-bold transition-colors flex items-center gap-2 cursor-pointer border border-[#2D5A27]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isTriggeringReport ? 'Dispatching...' : 'Dispatch 12-Hour Email'}</span>
                </button>
              )}
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-[#E5E5E0] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto">
                {['all', 'new', 'contacted', 'completed', 'archived'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setRequestStatusFilter(status)}
                    className={`px-3 py-1.5 text-xs font-mono uppercase font-bold transition-colors cursor-pointer ${
                      requestStatusFilter === status
                        ? 'bg-[#1A1A1A] text-white'
                        : 'bg-[#F5F5F4] text-[#555550] hover:bg-[#E5E5E0]'
                    }`}
                  >
                    {status} ({requests.filter(r => (status === 'all' ? true : r.status === status)).length})
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search name, email, phone..."
                  value={requestSearch}
                  onChange={(e) => setRequestSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F5F5F4] border border-[#E5E5E0] focus:bg-white focus:border-[#2D5A27] outline-none font-mono"
                />
                <Search className="w-3.5 h-3.5 text-[#777770] absolute left-2.5 top-2" />
              </div>
            </div>

            {/* Inquiries Table */}
            <div className="bg-white border border-[#E5E5E0] overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F4] border-b border-[#E5E5E0] font-mono text-[10px] uppercase text-[#777770]">
                    <th className="p-3.5">Received</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Customer / Company</th>
                    <th className="p-3.5">Contact Details</th>
                    <th className="p-3.5">Product Interest</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">12h Report</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E0]">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="p-3.5 font-mono text-[11px] text-[#555550]">
                        {new Date(req.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-[#EBF3E8] text-[#2D5A27] font-mono text-[10px] font-bold uppercase rounded">
                          {req.type}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-[#1A1A1A]">{req.name}</div>
                        <div className="text-[#777770] text-[11px]">{req.company || 'Individual / Direct'}</div>
                      </td>
                      <td className="p-3.5 font-mono text-[11px]">
                        <div className="text-[#2D5A27] font-bold">{req.phone || 'N/A'}</div>
                        <div className="text-[#555550]">{req.email}</div>
                      </td>
                      <td className="p-3.5 max-w-xs truncate text-[#1A1A1A]">
                        {req.productInterest || 'General Inquiry'}
                        {req.estimatedVolume && (
                          <div className="text-[10px] font-mono text-[#777770]">
                            Vol: {req.estimatedVolume}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5">
                        <select
                          value={req.status}
                          onChange={(e) => handleUpdateRequestStatus(req.id, e.target.value)}
                          className="px-2 py-1 bg-[#F5F5F4] border border-[#E5E5E0] text-[11px] font-mono font-bold uppercase outline-none cursor-pointer focus:border-[#2D5A27]"
                        >
                          <option value="new">NEW</option>
                          <option value="contacted">CONTACTED</option>
                          <option value="completed">COMPLETED</option>
                          <option value="archived">ARCHIVED</option>
                        </select>
                      </td>
                      <td className="p-3.5">
                        {req.reportedToEmail ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#2D5A27]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Reported</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-600">
                            <Clock className="w-3 h-3" />
                            <span>Queued</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#2D5A27] text-white text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer"
                        >
                          Review Lead
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-[#777770] font-mono text-xs">
                        No customer inquiries match this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 4: 12-HOUR EMAIL REPORTS
        ========================================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">12-Hour Executive Inquiries Reports</h2>
                <p className="text-xs text-[#777770]">
                  Automated background service aggregating and sending customer leads to management
                </p>
              </div>

              {isManager && (
                <button
                  onClick={() => handleTriggerReport(true)}
                  disabled={isTriggeringReport}
                  className="px-5 py-2.5 bg-[#2D5A27] hover:bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer border border-[#2D5A27]"
                >
                  <Send className="w-4 h-4" />
                  <span>{isTriggeringReport ? 'Generating...' : 'Send Test 12-Hour Digest'}</span>
                </button>
              )}
            </div>

            {/* Overview Metric Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-[#E5E5E0] p-5 space-y-1">
                <div className="text-[10px] font-mono uppercase text-[#777770] font-bold">Unreported Inquiries Queue</div>
                <div className="text-2xl font-extrabold text-amber-600">{reportsData.unreportedCount} Leads</div>
                <div className="text-xs text-[#777770]">Awaiting next scheduled dispatch</div>
              </div>
              <div className="bg-white border border-[#E5E5E0] p-5 space-y-1">
                <div className="text-[10px] font-mono uppercase text-[#777770] font-bold">Report Recipient Target</div>
                <div className="text-sm font-mono font-bold text-[#1A1A1A] truncate">
                  {settings?.reportRecipientEmail || 'reports@petcans.in'}
                </div>
                <div className="text-xs text-[#2D5A27]">Executive Inquiries In-Box</div>
              </div>
              <div className="bg-white border border-[#E5E5E0] p-5 space-y-1">
                <div className="text-[10px] font-mono uppercase text-[#777770] font-bold">Cycle Interval</div>
                <div className="text-2xl font-extrabold text-[#2D5A27]">Every 12 Hours</div>
                <div className="text-xs text-[#777770]">Automatic background cron check</div>
              </div>
            </div>

            {/* Past Report Batches Table */}
            <div className="bg-white border border-[#E5E5E0] p-6 space-y-4">
              <h3 className="font-bold text-base text-[#1A1A1A]">Dispatched 12-Hour Report Batches</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F5F5F4] border-b border-[#E5E5E0] font-mono text-[10px] uppercase text-[#777770]">
                      <th className="p-3">Batch ID</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Recipient Email</th>
                      <th className="p-3">Inquiries Count</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E0]">
                    {reportsData.batches.map((b) => (
                      <tr key={b.id} className="hover:bg-[#FAFAFA] transition-colors">
                        <td className="p-3 font-mono text-[11px] text-[#555550]">{b.id}</td>
                        <td className="p-3 font-mono text-[11px]">
                          {new Date(b.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        </td>
                        <td className="p-3 font-mono text-[#1A1A1A]">{b.recipientEmail}</td>
                        <td className="p-3 font-bold text-[#2D5A27]">{b.totalRequests} Inquiries</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                              b.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedReportBatch(b)}
                            className="px-3 py-1 bg-[#F5F5F4] hover:bg-[#1A1A1A] hover:text-white text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer"
                          >
                            View HTML Digest
                          </button>
                        </td>
                      </tr>
                    ))}
                    {reportsData.batches.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-[#777770] font-mono text-xs">
                          No report batches generated yet. Click "Send Test 12-Hour Digest" to trigger one now.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 5: CAREERS & APPLICATIONS
        ========================================== */}
        {activeTab === 'careers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">Careers & Recruitment Portal</h2>
                <p className="text-xs text-[#777770]">
                  Manage open plant and corporate roles, and review candidate applications
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCareersSubTab('jobs')}
                  className={`px-3 py-1.5 text-xs font-mono uppercase font-bold transition-colors cursor-pointer ${
                    careersSubTab === 'jobs' ? 'bg-[#1A1A1A] text-white' : 'bg-white border border-[#E5E5E0] text-[#555550]'
                  }`}
                >
                  Job Openings ({jobs.length})
                </button>
                <button
                  onClick={() => setCareersSubTab('applications')}
                  className={`px-3 py-1.5 text-xs font-mono uppercase font-bold transition-colors cursor-pointer ${
                    careersSubTab === 'applications' ? 'bg-[#1A1A1A] text-white' : 'bg-white border border-[#E5E5E0] text-[#555550]'
                  }`}
                >
                  Applications ({applications.length})
                </button>

                {isManager && careersSubTab === 'jobs' && (
                  <button
                    onClick={() => {
                      setEditingJob({
                        category: 'Production & Plant',
                        type: 'Full-Time | On-Site',
                        status: 'published',
                        responsibilities: [],
                        qualifications: [],
                      });
                      setShowJobModal(true);
                    }}
                    className="px-3 py-1.5 bg-[#2D5A27] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post Job</span>
                  </button>
                )}
              </div>
            </div>

            {careersSubTab === 'jobs' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white border border-[#E5E5E0] p-5 space-y-3 flex flex-col justify-between shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-[#2D5A27] font-bold">
                          {job.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${
                            job.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-[#1A1A1A]">{job.title}</h3>
                      <div className="text-xs font-mono text-[#777770]">
                        {job.location} • {job.type}
                      </div>
                      <p className="text-xs text-[#555550] leading-relaxed line-clamp-3">
                        {job.description}
                      </p>
                    </div>

                    {isManager && (
                      <div className="pt-3 border-t border-[#E5E5E0] flex items-center justify-between">
                        <button
                          onClick={() => handleToggleJobStatus(job.id)}
                          className="text-[11px] font-mono font-bold uppercase text-[#2D5A27] hover:underline cursor-pointer"
                        >
                          {job.status === 'published' ? 'Make Draft' : 'Publish'}
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingJob(job);
                              setShowJobModal(true);
                            }}
                            className="p-1 text-[#555550] hover:text-[#1A1A1A] cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id, job.title)}
                            className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#E5E5E0] overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F5F5F4] border-b border-[#E5E5E0] font-mono text-[10px] uppercase text-[#777770]">
                      <th className="p-3">Applied Date</th>
                      <th className="p-3">Candidate</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Exp / Location</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Resume / Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E0]">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-[#FAFAFA]">
                        <td className="p-3 font-mono text-[11px] text-[#555550]">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 font-bold text-[#1A1A1A]">{app.candidateName}</td>
                        <td className="p-3 font-mono text-[11px]">
                          <div>{app.phone}</div>
                          <div className="text-[#777770]">{app.email}</div>
                        </td>
                        <td className="p-3 font-semibold text-[#2D5A27]">{app.jobTitle}</td>
                        <td className="p-3 text-[11px] text-[#555550]">
                          {app.experienceYears} • {app.currentLocation}
                        </td>
                        <td className="p-3">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                            className="px-2 py-1 bg-[#F5F5F4] border border-[#E5E5E0] text-[10px] font-mono font-bold uppercase outline-none"
                          >
                            <option value="new">NEW</option>
                            <option value="under_review">UNDER REVIEW</option>
                            <option value="shortlisted">SHORTLISTED</option>
                            <option value="hired">HIRED</option>
                            <option value="rejected">REJECTED</option>
                          </select>
                        </td>
                        <td className="p-3 text-[11px] text-[#555550] max-w-xs">
                          {app.resumeNote || app.notes || 'Direct application'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 6: SETTINGS (MANAGER & SUPER ADMIN)
        ========================================== */}
        {activeTab === 'settings' && isManager && settings && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A]">Corporate & System Configuration</h2>
              <p className="text-xs text-[#777770]">
                Configure verified contact lines, email dispatch routing, and manufacturing operating parameters
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-white border border-[#E5E5E0] p-6 space-y-6 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    Primary Phone Number:
                  </label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs font-mono text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    Alternate / WhatsApp Line:
                  </label>
                  <input
                    type="text"
                    value={settings.phoneAlt}
                    onChange={(e) => setSettings({ ...settings, phoneAlt: e.target.value })}
                    className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs font-mono text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    General Inquiries Email:
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs font-mono text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    Sales & Quote Inquiries Email:
                  </label>
                  <input
                    type="email"
                    value={settings.salesEmail}
                    onChange={(e) => setSettings({ ...settings, salesEmail: e.target.value })}
                    className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs font-mono text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    12-Hour Report Recipient Email (Executive Digest):
                  </label>
                  <input
                    type="email"
                    value={settings.reportRecipientEmail}
                    onChange={(e) => setSettings({ ...settings, reportRecipientEmail: e.target.value })}
                    className="w-full p-2.5 bg-[#EBF3E8] border border-[#2D5A27] text-xs font-mono font-bold text-[#2D5A27] outline-none"
                  />
                  <span className="text-[10px] text-[#777770] font-mono mt-1 block">
                    All new customer inquiries are batched and delivered to this address every 12 hours.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    Careers & HR Email:
                  </label>
                  <input
                    type="email"
                    value={settings.careersEmail}
                    onChange={(e) => setSettings({ ...settings, careersEmail: e.target.value })}
                    className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs font-mono text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    HQ & Registered Plant Address:
                  </label>
                  <input
                    type="text"
                    value={settings.registeredAddress}
                    onChange={(e) => setSettings({ ...settings, registeredAddress: e.target.value })}
                    className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    Operating Hours (Weekdays):
                  </label>
                  <input
                    type="text"
                    value={settings.businessHoursWeekdays}
                    onChange={(e) => setSettings({ ...settings, businessHoursWeekdays: e.target.value })}
                    className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs font-mono text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    Operating Hours (Sunday / Holidays):
                  </label>
                  <input
                    type="text"
                    value={settings.businessHoursSunday}
                    onChange={(e) => setSettings({ ...settings, businessHoursSunday: e.target.value })}
                    className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs font-mono text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E5E0] flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#2D5A27] hover:bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border border-[#2D5A27]"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==========================================
            TAB 7: ADMIN USERS & RBAC (SUPER ADMIN ONLY)
        ========================================== */}
        {activeTab === 'users' && isSuperAdmin && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A]">Administrator Access & Role Control (RBAC)</h2>
                <p className="text-xs text-[#777770]">
                  Super Admin exclusive control over admin accounts, roles, and security permissions
                </p>
              </div>

              <button
                onClick={() => setShowUserModal(true)}
                className="px-4 py-2 bg-[#2D5A27] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Admin User</span>
              </button>
            </div>

            <div className="bg-white border border-[#E5E5E0] overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F4] border-b border-[#E5E5E0] font-mono text-[10px] uppercase text-[#777770]">
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Assigned Role</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Last Active</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E0]">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FAFAFA]">
                      <td className="p-3.5 font-bold text-[#1A1A1A]">{u.name}</td>
                      <td className="p-3.5 font-mono text-[#555550]">{u.email}</td>
                      <td className="p-3.5">
                        <select
                          value={u.role}
                          disabled={u.id === currentUser.id}
                          onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                          className="px-2 py-1 bg-[#F5F5F4] border border-[#E5E5E0] text-[11px] font-mono font-bold uppercase outline-none cursor-pointer"
                        >
                          <option value="super_admin">SUPER ADMIN</option>
                          <option value="manager">MANAGER</option>
                          <option value="staff">STAFF</option>
                        </select>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                            u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-[#777770]">
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}
                      </td>
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setResetTargetUser({ id: u.id, email: u.email, name: u.name });
                            setTargetNewPassword('');
                          }}
                          className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 transition-colors cursor-pointer"
                          title="Reset user password"
                        >
                          Reset Pass
                        </button>
                        {u.id !== currentUser.id ? (
                          <button
                            onClick={() => handleToggleUserActive(u.id, u.isActive)}
                            className={`px-3 py-1 text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                              u.isActive
                                ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                            }`}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-[#777770] px-2 py-1">(Current)</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 8: AUDIT LOGS (SUPER ADMIN ONLY)
        ========================================== */}
        {activeTab === 'audit' && isSuperAdmin && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A]">System Activity & Audit Trail</h2>
              <p className="text-xs text-[#777770]">
                Chronological security and operational event logs
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E0] overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F5F5F4] border-b border-[#E5E5E0] font-mono text-[10px] uppercase text-[#777770]">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Operator</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Target</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E0]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FAFAFA]">
                      <td className="p-3 font-mono text-[11px] text-[#555550]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3 font-bold text-[#1A1A1A]">{log.userName}</td>
                      <td className="p-3 font-mono text-[10px] uppercase text-[#2D5A27]">{log.userRole}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-[#F5F5F4] border border-[#E5E5E0] text-[10px] font-mono font-bold">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-[#1A1A1A]">{log.target}</td>
                      <td className="p-3 text-[#555550]">{log.details || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
          MODAL: ADD / EDIT PRODUCT
      ========================================== */}
      {showProductModal && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-[#2D5A27] w-full max-w-3xl my-8 p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1A]">
                  {editingProduct.id ? 'Edit Product Specification' : 'Add New Product'}
                </h3>
                <p className="text-xs text-[#777770]">
                  Fill in standard technical specifications. Published products immediately appear on petcans.in
                </p>
              </div>
              <button
                onClick={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                }}
                className="p-2 text-[#777770] hover:text-[#1A1A1A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    Product Title / Name: *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. King Size PET Beverage Can — 500ml (Plain Flat Base)"
                    className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    Category: *
                  </label>
                  <select
                    value={editingProduct.category || 'food'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs text-[#1A1A1A] outline-none focus:border-[#2D5A27] font-mono uppercase font-bold"
                  >
                    <option value="food">FOOD PACKAGING (MAKANA, DRY FRUITS, NAMKEEN, MAHARAJA JARS)</option>
                    <option value="beverage">BEVERAGE PACKAGING (CARBONATED & NON-CARBONATED)</option>
                    <option value="machinery">SEALING MACHINES & PACKAGING EQUIPMENT</option>
                    <option value="caps">ALUMINIUM EOE, CAPS & CLOSURES (NO TIN LIDS)</option>
                    <option value="preforms">PET PREFORMS (WIDE MOUTH & BEVERAGE)</option>
                    <option value="custom">CUSTOM MOLDS & PACKAGING TOOLING</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    Capacity / Volume: *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.capacity || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, capacity: e.target.value })}
                    placeholder="e.g. 500 ml (King Size)"
                    className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    Neck Size / Diameter:
                  </label>
                  <input
                    type="text"
                    value={editingProduct.neckSize || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, neckSize: e.target.value })}
                    placeholder="e.g. 202 CDL / 200 EOE Neck"
                    className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    Closure Type: *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.closureType || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, closureType: e.target.value })}
                    placeholder="e.g. Aluminum Easy Open Lid / Snap Overcap"
                    className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    Badge Tag (Optional):
                  </label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    placeholder="e.g. Plain Flat Base / Top Seller / Trending"
                    className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
                  />
                </div>
              </div>

              {/* Multi-Angle Product Image Gallery Section */}
              <div>
                <AdminProductImagesManager
                  images={
                    editingProduct.images && editingProduct.images.length > 0
                      ? editingProduct.images
                      : (editingProduct.image ? [editingProduct.image] : [])
                  }
                  onChange={(newImages) => {
                    setEditingProduct({
                      ...editingProduct,
                      images: newImages,
                      image: newImages[0] || '',
                    });
                  }}
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                  Product Description: *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Describe dimensions, barrier properties, clarity, and structural benefits..."
                  className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    Key Features (1 per line):
                  </label>
                  <textarea
                    rows={3}
                    value={Array.isArray(editingProduct.features) ? editingProduct.features.join('\n') : ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, features: e.target.value.split('\n') })}
                    placeholder="Plain flat standing bottom (no bottle feet)&#10;100% leakproof aluminum pull tab&#10;Food-grade virgin resin"
                    className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs font-mono text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    Applications (1 per line):
                  </label>
                  <textarea
                    rows={3}
                    value={Array.isArray(editingProduct.applications) ? editingProduct.applications.join('\n') : ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, applications: e.target.value.split('\n') })}
                    placeholder="Cold brew coffee & iced matcha&#10;Craft sparkling sodas&#10;Kombucha & mocktails"
                    className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs font-mono text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E0]">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.status === 'published'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.checked ? 'published' : 'draft' })}
                      className="accent-[#2D5A27] w-4 h-4"
                    />
                    <span className="text-xs font-bold text-[#1A1A1A]">Publish to Public Products</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.isPopular)}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isPopular: e.target.checked })}
                      className="accent-[#2D5A27] w-4 h-4"
                    />
                    <span className="text-xs font-bold text-[#1A1A1A]">Featured / Popular Item</span>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductModal(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2.5 bg-[#F5F5F4] hover:bg-[#E5E5E0] text-[#1A1A1A] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#2D5A27] hover:bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border border-[#2D5A27]"
                  >
                    Save & Publish
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: INQUIRY REVIEW & NOTES DRAWER
      ========================================== */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-[#2D5A27] w-full max-w-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase bg-[#EBF3E8] text-[#2D5A27] px-2 py-0.5 font-bold rounded">
                  {selectedRequest.type} LEAD #{selectedRequest.id}
                </span>
                <h3 className="text-lg font-bold text-[#1A1A1A] mt-1">{selectedRequest.name}</h3>
                <div className="text-xs text-[#777770]">
                  Received: {new Date(selectedRequest.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                </div>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 text-[#777770] hover:text-[#1A1A1A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-[#F5F5F4] p-4 text-xs font-mono border border-[#E5E5E0]">
              <div>
                <span className="text-[10px] uppercase text-[#777770] block">Company / Brand:</span>
                <strong className="text-[#1A1A1A] text-sm">{selectedRequest.company || 'Direct Buyer'}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#777770] block">Phone Contact:</span>
                <a href={`tel:${selectedRequest.phone}`} className="text-[#2D5A27] font-bold hover:underline">
                  {selectedRequest.phone || 'N/A'}
                </a>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#777770] block">Email Contact:</span>
                <a href={`mailto:${selectedRequest.email}`} className="text-[#2D5A27] font-bold hover:underline">
                  {selectedRequest.email}
                </a>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#777770] block">Estimated Volume:</span>
                <strong className="text-[#1A1A1A]">{selectedRequest.estimatedVolume || 'Not Specified'}</strong>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#777770] block mb-1">
                Product of Interest:
              </span>
              <div className="p-3 bg-[#FAFAFA] border border-[#E5E5E0] text-xs font-semibold text-[#1A1A1A]">
                {selectedRequest.productInterest || 'General PET Packaging Inquiry'}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#777770] block mb-1">
                Client Message & Specifications:
              </span>
              <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E0] text-xs text-[#333330] leading-relaxed whitespace-pre-wrap">
                {selectedRequest.message}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                Internal Plant Follow-Up Notes:
              </label>
              <textarea
                rows={3}
                defaultValue={selectedRequest.internalNotes || ''}
                onBlur={(e) => handleSaveRequestNotes(selectedRequest.id, e.target.value)}
                placeholder="Log internal notes (e.g. Samples dispatched via courier, price quoted at ₹6.50/unit, callback set for Monday)..."
                className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs font-mono text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
              />
              <span className="text-[9px] font-mono text-[#777770] mt-0.5 block">
                Notes auto-save when clicking outside the box.
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E0]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-[#777770]">Status:</span>
                <select
                  value={selectedRequest.status}
                  onChange={(e) => handleUpdateRequestStatus(selectedRequest.id, e.target.value)}
                  className="px-2.5 py-1.5 bg-[#1A1A1A] text-white text-xs font-mono font-bold uppercase outline-none cursor-pointer"
                >
                  <option value="new">NEW</option>
                  <option value="contacted">CONTACTED</option>
                  <option value="completed">COMPLETED</option>
                  <option value="archived">ARCHIVED</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedRequest.phone}`}
                  className="px-4 py-2 bg-[#2D5A27] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Call Client
                </a>
                <a
                  href={`mailto:${selectedRequest.email}?subject=PET Cans Quote Inquiry Follow-up`}
                  className="px-4 py-2 bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Email Reply
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: VIEW 12-HOUR HTML REPORT
      ========================================== */}
      {selectedReportBatch && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-[#2D5A27] w-full max-w-4xl my-8 p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1A]">
                  12-Hour Digest Email Preview ({selectedReportBatch.id})
                </h3>
                <div className="text-xs font-mono text-[#777770]">
                  Delivered to: {selectedReportBatch.recipientEmail} • {new Date(selectedReportBatch.timestamp).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => setSelectedReportBatch(null)}
                className="p-2 text-[#777770] hover:text-[#1A1A1A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-[#E5E5E0] bg-[#F5F5F4] p-4 overflow-x-auto">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedReportBatch.htmlPreview }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: ADD / EDIT JOB
      ========================================== */}
      {showJobModal && editingJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-[#2D5A27] w-full max-w-2xl my-8 p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-3">
              <h3 className="text-lg font-bold text-[#1A1A1A]">
                {editingJob.id ? 'Edit Job Opening' : 'Post New Job Opening'}
              </h3>
              <button
                onClick={() => {
                  setShowJobModal(false);
                  setEditingJob(null);
                }}
                className="p-2 text-[#777770] hover:text-[#1A1A1A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                  Job Title: *
                </label>
                <input
                  type="text"
                  required
                  value={editingJob.title || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                  placeholder="e.g. Senior Blow Molding Shift Engineer"
                  className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs text-[#1A1A1A] outline-none focus:border-[#2D5A27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    Department Category: *
                  </label>
                  <select
                    value={editingJob.category || 'Production & Plant'}
                    onChange={(e) => setEditingJob({ ...editingJob, category: e.target.value as any })}
                    className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs font-mono uppercase font-bold outline-none"
                  >
                    <option value="Production & Plant">Production & Plant</option>
                    <option value="Corporate & Support">Corporate & Support</option>
                    <option value="Early Career">Early Career (Interns / Freshers)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                    Facility Location: *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingJob.location || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                    placeholder="e.g. Rama Road HQ, New Delhi"
                    className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs text-[#1A1A1A] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                  Job Description: *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingJob.description || ''}
                  onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                  className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs text-[#1A1A1A] outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E0]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingJob.status === 'published'}
                    onChange={(e) => setEditingJob({ ...editingJob, status: e.target.checked ? 'published' : 'draft' })}
                    className="accent-[#2D5A27] w-4 h-4"
                  />
                  <span className="text-xs font-bold text-[#1A1A1A]">Publish on petcans.in/careers</span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowJobModal(false);
                      setEditingJob(null);
                    }}
                    className="px-4 py-2 bg-[#F5F5F4] text-[#1A1A1A] font-bold text-xs uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#2D5A27] text-white font-bold text-xs uppercase cursor-pointer"
                  >
                    Save Job
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: CREATE NEW ADMIN USER
      ========================================== */}
      {showUserModal && isSuperAdmin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#2D5A27] w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-3">
              <h3 className="text-lg font-bold text-[#1A1A1A]">Create Administrator Account</h3>
              <button onClick={() => setShowUserModal(false)} className="p-2 text-[#777770] hover:text-[#1A1A1A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                  Full Name: *
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Vikram Batra"
                  className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs text-[#1A1A1A] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                  Corporate Email: *
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="vikram@petcans.in"
                  className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs text-[#1A1A1A] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                  Password: *
                </label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs text-[#1A1A1A] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                  Role Permission Level: *
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs font-mono uppercase font-bold outline-none"
                >
                  <option value="staff">STAFF (Inquiries & Read-Only Products)</option>
                  <option value="manager">MANAGER (Products, Leads, Reports & Settings)</option>
                  <option value="super_admin">SUPER ADMIN (Full Unrestricted Access)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#E5E5E0] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 bg-[#F5F5F4] text-[#1A1A1A] font-bold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2D5A27] text-white font-bold text-xs uppercase cursor-pointer"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUPER ADMIN RESET USER PASSWORD MODAL */}
      {resetTargetUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#C88214] max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E0]">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#C88214]" />
                <h3 className="font-bold text-base text-[#1A1A1A]">Reset Account Password</h3>
              </div>
              <button
                onClick={() => setResetTargetUser(null)}
                className="p-1 hover:bg-[#F5F5F4] text-[#777770] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#FAF6EE] border border-[#E3D8C8] text-xs space-y-1">
              <div className="text-[10px] font-mono uppercase text-[#71695D]">Target User:</div>
              <div className="font-bold text-[#0F1E36]">{resetTargetUser.name} ({resetTargetUser.email})</div>
              <div className="text-[10px] text-[#71695D]">As Super Admin, you can assign a new direct password to this account.</div>
            </div>

            <form onSubmit={handleAdminResetUserPassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-[#444440] mb-1">
                  New Password (min 6 chars): *
                </label>
                <input
                  type="text"
                  required
                  autoComplete="new-password"
                  value={targetNewPassword}
                  onChange={(e) => setTargetNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full p-2.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs font-mono text-[#1A1A1A] outline-none focus:border-[#C88214]"
                />
              </div>

              <div className="pt-4 border-t border-[#E5E5E0] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setResetTargetUser(null)}
                  className="px-4 py-2 bg-[#F5F5F4] text-[#1A1A1A] font-bold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTargetResetting}
                  className="px-5 py-2 bg-[#C88214] hover:bg-[#0F1E36] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {isTargetResetting ? 'Updating...' : 'Set Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
