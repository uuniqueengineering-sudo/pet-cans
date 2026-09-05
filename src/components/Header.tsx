import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { COMPANY_INFO } from '../data/companyData';
import { BrandLogo } from './BrandLogo';
import { 
  ShieldCheck, 
  ArrowRight, 
  MapPin, 
  Mail,
  Menu, 
  X, 
  ChevronRight, 
  User, 
  LogOut, 
  Building2,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenQuoteModal: (productId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenQuoteModal,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navItems: { id: PageId; label: string; description: string }[] = [
    { id: 'home', label: 'HOME', description: 'Overview & Direct Manufacturing' },
    { id: 'about', label: 'ABOUT US', description: 'Infrastructure, Plants & Specifications' },
    { id: 'products', label: 'PRODUCT', description: 'Jars, Cans, Preforms & Seamers' },
    { id: 'careers', label: 'CAREERS', description: 'Culture & Workplace Overview' },
    { id: 'contact', label: 'CONTACT US', description: 'Delhi & Haryana Factory Units' },
  ];

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 w-full transition-all duration-150 ${
        scrolled
          ? 'bg-[#FAF6EE]/95 backdrop-blur-md border-b border-[#E3D8C8] shadow-sm'
          : 'bg-[#FAF6EE] border-b border-[#EAE2D5]'
      }`}
    >
      {/* Top Utility Bar - Deep Navy with Ochre and WhatsApp Green */}
      <div className="bg-[#0A1424] text-[#B8C5D6] text-xs py-1.5 px-4 hidden sm:block border-b border-[#14233D]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4 text-[11px]">
            <span className="flex items-center text-white/95 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C88214] mr-1.5 inline shrink-0" />
              100% Food-Grade Certified PET Packaging Manufacturer
            </span>
            <span className="text-[#25395A] hidden md:inline">|</span>
            <span className="hidden md:flex items-center text-[#A1B2C9]">
              <MapPin className="w-3.5 h-3.5 text-[#C88214] mr-1.5 inline shrink-0" />
              Delhi & Haryana Manufacturing Units (Rama Road • Panipat • Rai)
            </span>
          </div>

          <div className="flex items-center space-x-4 font-mono text-[11px] shrink-0">
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="flex items-center text-white hover:text-[#DF9B2D] transition-colors font-bold"
              title="Email PET Cans Sales & Engineering"
            >
              <Mail className="w-3 h-3 text-[#C88214] mr-1.5" />
              <span>{COMPANY_INFO.email}</span>
            </a>
            <span className="text-[#25395A]">•</span>
            <span className="text-[#A1B2C9] hidden lg:inline">Dispatch Hours: 9 AM – 7 PM IST</span>
            <span className="text-[#25395A] hidden lg:inline">•</span>
            {/* Console Link in Top Bar (only if authenticated) */}
            {isAuthenticated && user && (
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center text-[#DF9B2D] hover:text-white transition-colors font-bold uppercase cursor-pointer"
              >
                <Lock className="w-3 h-3 text-[#C88214] mr-1" />
                <span>Console ({user.role})</span>
              </button>
            )}
            <span className="text-[#25395A]">•</span>
            <a
              href="https://uunique.in"
              target="_blank"
              rel="noreferrer"
              className="text-[#C88214] hover:underline font-bold uppercase"
            >
              uunique.in
            </a>
          </div>
        </div>
      </div>

      {/* Main Visible Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* 1. Authentic PETCANS.IN Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left group focus:outline-none cursor-pointer shrink-0 py-1"
            aria-label="PETCANS.IN Home"
          >
            <BrandLogo size="md" theme="dark" showSubtitle={true} />
          </button>

          {/* 2. Desktop Navigation Links (Hidden on mobile/tablet, shown on lg+) */}
          <nav
            id="main-navigation"
            className="hidden lg:flex items-center space-x-1 sm:space-x-1.5 md:space-x-2"
            aria-label="Public Navigation"
          >
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 text-xs md:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-150 relative cursor-pointer select-none ${
                    isActive
                      ? 'text-[#0F1E36] font-extrabold bg-[#EFE7D8]'
                      : 'text-[#5C5549] hover:text-[#0F1E36] hover:bg-[#F2ECE0]'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#C88214]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 relative">
            {/* Quick Factory Email on md+ */}
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold text-[#0F1E36] hover:text-[#C88214] bg-white border border-[#DCD3C4] hover:border-[#C88214] transition-colors shadow-2xs"
              title={`Email Factory Sales: ${COMPANY_INFO.email}`}
            >
              <Mail className="w-3.5 h-3.5 text-[#C88214]" />
              <span className="hidden xl:inline">{COMPANY_INFO.email}</span>
              <span className="xl:hidden">Email Sales</span>
            </a>

            {/* Desktop User Profile Button (only if authenticated) */}
            {isAuthenticated && user && (
              <div className="relative hidden md:block">
                <button
                  id="nav-user-profile-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="inline-flex items-center justify-center px-3 py-2 text-xs font-bold uppercase tracking-wider bg-white text-[#0F1E36] hover:bg-[#F2ECE0] border border-[#0F1E36] shadow-xs cursor-pointer gap-1.5 min-h-[40px]"
                >
                  <div className="w-2 h-2 rounded-full bg-[#2D5A27]" />
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-mono text-[#C88214]">({user.role === 'super_admin' ? 'Admin' : user.role})</span>
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-1 w-56 bg-white border-2 border-[#0F1E36] shadow-xl z-50 py-1.5 text-xs animate-in fade-in duration-100"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3.5 py-2 border-b border-[#E3D8C8] bg-[#FAF6EE]">
                      <div className="font-bold text-[#0F1E36] truncate">{user.name}</div>
                      <div className="text-[10px] font-mono text-[#71695D] truncate">{user.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('admin');
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#FAF6EE] flex items-center gap-2 text-[#0F1E36] font-bold cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 text-[#C88214]" />
                      <span>Operations Console</span>
                    </button>
                    <button
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        await logout();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#FFF1F0] flex items-center gap-2 text-[#CF1322] font-bold cursor-pointer border-t border-[#F0EAE1]"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Get Quote button (Touch-friendly on mobile) */}
            <button
              id="nav-get-quote"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="inline-flex items-center justify-center px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#C88214] text-white hover:bg-[#0F1E36] hover:text-white transition-all duration-150 cursor-pointer border border-[#C88214] hover:border-[#0F1E36] shadow-xs whitespace-nowrap min-h-[40px]"
            >
              <span>Get Quote</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#0F1E36] hover:bg-[#EFE7D8] transition-colors border border-[#E3D8C8] bg-white min-w-[42px] min-h-[42px] flex items-center justify-center cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#0F1E36]" />
              ) : (
                <Menu className="w-6 h-6 text-[#0F1E36]" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* 4. Mobile Drawer Navigation Overlay (for screens < lg) */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-overlay"
          className="lg:hidden fixed inset-x-0 top-[64px] sm:top-[80px] bottom-0 z-50 bg-[#0F1E36]/60 backdrop-blur-xs flex flex-col animate-in fade-in duration-150"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            id="mobile-menu-content"
            className="bg-[#FAF6EE] border-b border-[#E3D8C8] shadow-2xl p-5 sm:p-6 space-y-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Navigation links list */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71695D] font-bold px-3 py-1">
                Navigation Menu
              </div>
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-3.5 flex items-center justify-between border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white border-[#C88214] text-[#0F1E36] font-bold shadow-xs'
                        : 'bg-[#FAF6EE] border-transparent text-[#3A3328] hover:bg-white hover:border-[#E3D8C8]'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold uppercase tracking-wider">{item.label}</div>
                      <div className="text-[11px] text-[#71695D] font-normal">{item.description}</div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#C88214]' : 'text-[#A0988A]'}`} />
                  </button>
                );
              })}
            </div>

            {/* Direct Mobile Quick Actions inside Drawer */}
            <div className="pt-4 border-t border-[#E3D8C8] space-y-2.5">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71695D] font-bold px-1">
                Direct Factory & Sales Desks
              </div>

              {/* Direct Email */}
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="w-full py-3 px-4 bg-white border-2 border-[#0F1E36] text-[#0F1E36] hover:bg-[#0F1E36] hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors min-h-[44px]"
              >
                <Mail className="w-4 h-4 text-[#C88214]" />
                <span className="truncate">Email Sales ({COMPANY_INFO.email})</span>
              </a>

              {/* Request Samples & Quote */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuoteModal();
                }}
                className="w-full py-3 px-4 bg-[#C88214] hover:bg-[#0F1E36] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[44px]"
              >
                <span>Request Quotation & Sample Kit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Active Operations Session (only if authenticated) */}
            {isAuthenticated && user && (
              <div className="pt-3 border-t border-[#E3D8C8] space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71695D] font-bold px-1">
                  Active Operations Session
                </div>
                <div className="p-3 bg-white border border-[#2D5A27] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F1E36]">{user.name}</span>
                    <span className="text-[9px] font-mono uppercase font-bold bg-[#EBF3E8] text-[#2D5A27] px-2 py-0.5 border border-[#2D5A27]">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onNavigate('admin');
                      }}
                      className="flex-1 py-2 px-3 bg-[#0F1E36] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#C88214]" />
                      <span>Console</span>
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        setMobileMenuOpen(false);
                        await logout();
                      }}
                      className="py-2 px-3 bg-[#FAF6EE] text-[#CF1322] border border-[#E3D8C8] text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Manufacturing Units Footnote */}
            <div className="p-3 bg-white border border-[#E3D8C8] text-[11px] font-mono text-[#5A5348] space-y-1">
              <div className="flex items-center gap-1.5 text-[#0F1E36] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C88214]" />
                <span>Delhi & Haryana Production Units</span>
              </div>
              <div>Rama Road • Panipat • Rai Industrial Area</div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
