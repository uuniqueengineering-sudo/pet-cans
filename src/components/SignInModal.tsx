import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageId } from '../types';
import { 
  X, 
  Lock, 
  Mail, 
  Key, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  UserCheck, 
  Building, 
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { api } from '../services/api';
import { InquiryRequest } from '../types';
import { openWhatsAppDirect } from './WhatsAppWidget';

interface SignInModalProps {
  onNavigate?: (page: PageId) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ onNavigate }) => {
  const { isSignInModalOpen, closeSignInModal, login, user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'staff' | 'client'>('staff');
  
  // Staff Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Client Quote Lookup State
  const [searchQuery, setSearchQuery] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [lookupResults, setLookupResults] = useState<InquiryRequest[] | null>(null);

  // Prevent background scrolling on touch screens & body
  useEffect(() => {
    if (isSignInModalOpen) {
      document.body.style.overflow = 'hidden';
      setError('');
      setSuccessMsg('');
      setLookupError('');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSignInModalOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSignInModalOpen) {
        closeSignInModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSignInModalOpen, closeSignInModal]);

  if (!isSignInModalOpen) return null;

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password) {
      setError('Please enter both your work email and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email.trim(), password);
      setSuccessMsg(`Welcome back, ${loggedUser.name}!`);
      setTimeout(() => {
        closeSignInModal();
        if (onNavigate) {
          onNavigate('admin');
        }
      }, 700);
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@petcans.in');
    setPassword('Admin@12345');
    setError('');
  };

  const handleClientLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    setLookupResults(null);

    const query = searchQuery.trim();
    if (!query || query.length < 3) {
      setLookupError('Please enter at least 3 characters of your email, phone, or company name.');
      return;
    }

    setLookupLoading(true);
    try {
      // Fetch matching public/client inquiries if permitted
      const res = await api.getRequests({ search: query });
      if (res && res.length > 0) {
        setLookupResults(res);
      } else {
        setLookupError(`No inquiry records found matching "${query}". Please check your details or contact us directly.`);
      }
    } catch {
      // In case unauthenticated user searches, provide graceful fallback
      setLookupError('Could not verify inquiries online. Please message us on WhatsApp for instant quote tracking.');
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div
      id="signin-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0F1E36]/80 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={closeSignInModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-modal-title"
    >
      <div
        id="signin-modal-card"
        className="bg-[#FAF6EE] border-2 border-[#0F1E36] w-full max-w-md shadow-2xl relative my-auto overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Strip */}
        <div className="bg-[#0F1E36] text-white px-5 py-4 flex items-center justify-between border-b border-[#1E365E]">
          <div className="flex items-center space-x-3">
            <BrandLogo variant="icon-only" size="sm" theme="light" />
            <div>
              <h2 id="signin-modal-title" className="text-base font-display font-bold text-white tracking-tight">
                PET Cans Portal & Sign In
              </h2>
              <span className="text-[10px] font-mono text-[#CBD5E1] uppercase tracking-wider block">
                Direct Manufacturing & Plant Operations
              </span>
            </div>
          </div>
          <button
            onClick={closeSignInModal}
            className="text-[#94A3B8] hover:text-white p-1.5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E3D8C8] bg-white text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-[#FAF6EE] text-[#0F1E36] border-b-2 border-[#C88214] font-black'
                : 'text-[#71695D] hover:text-[#0F1E36] hover:bg-[#F8F4EA]'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#C88214]" />
            <span>Staff & Admin</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('client')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'client'
                ? 'bg-[#FAF6EE] text-[#0F1E36] border-b-2 border-[#C88214] font-black'
                : 'text-[#71695D] hover:text-[#0F1E36] hover:bg-[#F8F4EA]'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#C88214]" />
            <span>Track Quote / Inquiry</span>
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* If already authenticated */}
          {isAuthenticated && user && (
            <div className="bg-white border border-[#2D5A27] p-4 text-xs space-y-3">
              <div className="flex items-center gap-2.5 text-[#2D5A27] font-bold">
                <UserCheck className="w-4 h-4 text-[#2D5A27]" />
                <span>Currently Signed In as {user.name}</span>
              </div>
              <div className="text-[11px] text-[#5A5348] font-mono">
                Role: <strong className="uppercase text-[#0F1E36]">{user.role}</strong> ({user.email})
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    closeSignInModal();
                    if (onNavigate) onNavigate('admin');
                  }}
                  className="flex-1 py-2 px-3 bg-[#0F1E36] text-white hover:bg-[#C88214] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Open Operations Console</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                  }}
                  className="py-2 px-3 bg-[#F0EAE1] text-[#0F1E36] hover:bg-[#E3D8C8] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: Staff & Admin Sign In Form */}
          {activeTab === 'staff' && !isAuthenticated && (
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              {/* Error / Success Notifications */}
              {error && (
                <div className="p-3 bg-[#FFF1F0] border border-[#F5222D] text-[#CF1322] text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-[#F6FFED] border border-[#52C41A] text-[#389E0D] text-xs flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F1E36] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#C88214]" />
                    Work Email
                  </span>
                  <span className="text-[10px] font-mono text-[#71695D] font-normal">Official Staff / Admin</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@petcans.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E3D8C8] focus:border-[#C88214] text-xs text-[#0F1E36] font-mono outline-none transition-colors"
                  autoComplete="email"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F1E36] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#C88214]" />
                    Password
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] font-mono text-[#C88214] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter security password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E3D8C8] focus:border-[#C88214] text-xs text-[#0F1E36] font-mono outline-none transition-colors pr-10"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Demo Credentials Helper Pill */}
              <div className="bg-white border border-[#E3D8C8] p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C88214]" />
                  <div>
                    <div className="text-[11px] font-bold text-[#0F1E36]">Demo Administrator Account</div>
                    <div className="text-[10px] font-mono text-[#71695D]">admin@petcans.in • Admin@12345</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="px-2.5 py-1 bg-[#FAF6EE] hover:bg-[#C88214] hover:text-white border border-[#E3D8C8] text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer text-[#0F1E36]"
                >
                  Quick Fill
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#0F1E36] text-white hover:bg-[#C88214] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#C88214]" />
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center text-[10px] text-[#71695D] space-x-1 font-mono pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C88214]" />
                <span>256-Bit Encrypted Session • Authorized Staff Only</span>
              </div>
            </form>
          )}

          {/* TAB 2: Customer Quote & Inquiry Tracking */}
          {activeTab === 'client' && (
            <div className="space-y-4">
              <p className="text-xs text-[#5A5348] leading-relaxed">
                Check the latest processing status of your custom bottle specifications, sample kits, and official rate quotes submitted via PETCANS.IN.
              </p>

              <form onSubmit={handleClientLookup} className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0F1E36] flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-[#C88214]" />
                    Search by Email, Phone, or Company
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. +91 98998... or yourcompany@email.com"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-white border border-[#E3D8C8] focus:border-[#C88214] text-xs text-[#0F1E36] font-mono outline-none"
                    />
                    <button
                      type="submit"
                      disabled={lookupLoading}
                      className="px-4 py-2.5 bg-[#0F1E36] text-white hover:bg-[#C88214] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {lookupLoading ? '...' : 'Track'}
                    </button>
                  </div>
                </div>
              </form>

              {lookupError && (
                <div className="p-3 bg-[#FFF1F0] border border-[#F5222D] text-[#CF1322] text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{lookupError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openWhatsAppDirect(undefined, `Hi, I would like to track my quote status for: ${searchQuery}`)}
                    className="w-full py-2 px-3 bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1EBE5D] transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Inquire via WhatsApp Desk</span>
                  </button>
                </div>
              )}

              {/* Inquiry Results if Found */}
              {lookupResults && lookupResults.length > 0 && (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#71695D] font-bold">
                    Found {lookupResults.length} Matching Records:
                  </div>
                  {lookupResults.map((item) => (
                    <div key={item.id} className="p-3 bg-white border border-[#E3D8C8] text-xs space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0F1E36]">{item.company || item.name}</span>
                        <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold ${
                          item.status === 'completed'
                            ? 'bg-[#EBF3E8] text-[#2D5A27] border border-[#2D5A27]'
                            : item.status === 'contacted'
                            ? 'bg-[#EBF1FA] text-[#1E365E] border border-[#1E365E]'
                            : 'bg-[#FFF7E8] text-[#C88214] border border-[#C88214]'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#5A5348]">
                        Product: <strong>{item.productInterest || 'General Inquiry'}</strong>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#71695D] pt-1 border-t border-[#F0EAE1]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#C88214]" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => openWhatsAppDirect(item.productInterest, `Hi, following up on inquiry reference #${item.id.slice(0, 8)} for ${item.company}`)}
                          className="text-[#25D366] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <MessageCircle className="w-3 h-3 fill-current" />
                          Follow Up
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Direct Help */}
              <div className="pt-2 border-t border-[#E3D8C8] text-center">
                <button
                  type="button"
                  onClick={() => {
                    closeSignInModal();
                    openWhatsAppDirect();
                  }}
                  className="text-xs text-[#0F1E36] hover:text-[#C88214] font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-current" />
                  <span>Need live assistance? Chat on WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
