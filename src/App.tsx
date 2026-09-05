import React, { useState, useEffect } from 'react';
import { PageId } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { CareersPage } from './pages/CareersPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { QuoteModal } from './components/QuoteModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { MobileQuickBar } from './components/MobileQuickBar';
import { SiteImagesProvider } from './context/SiteImagesContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <SiteImagesProvider>
        <MainAppContent />
      </SiteImagesProvider>
    </AuthProvider>
  );
}

function MainAppContent() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteModalProduct, setQuoteModalProduct] = useState<string | undefined>(undefined);

  // Sync state with browser location pathname or hash
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '') || window.location.hash.replace(/^#\/?/, '');
      if (path === 'about') setCurrentPage('about');
      else if (path === 'products' || path === 'catalogue') setCurrentPage('products');
      else if (path === 'careers') setCurrentPage('careers');
      else if (path === 'contact' || path === 'quote') setCurrentPage('contact');
      else if (path === 'admin') setCurrentPage('admin');
      else setCurrentPage('home');
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);

    // Keyboard shortcut for quick admin access: Ctrl + Shift + A (or Cmd + Shift + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        handleNavigate('admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    try {
      const newPath = page === 'home' ? '/' : `/${page}`;
      window.history.pushState(null, '', newPath);
    } catch {
      // Fallback for sandboxed iframes where pushState may be restricted
      try {
        window.location.hash = page === 'home' ? '' : `#${page}`;
      } catch {
        // Ignore
      }
    }

    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      try {
        window.scrollTo(0, 0);
      } catch {
        // Ignore
      }
    }

    // Update document title for SEO & accessibility
    const titles: Record<PageId, string> = {
      home: 'PET Cans (petcans.in) — A Unit of Uunique | Food & Beverage Packaging Manufacturer',
      about: 'About Us — PET Cans (A Unit of Uunique) | Food-Grade Packaging Manufacturer',
      products: 'Products — Food Jars, Beverage Cans, Caps & Preforms | petcans.in',
      careers: 'Careers at PET Cans — Join Our Manufacturing & Engineering Team',
      contact: 'Contact Us & WhatsApp — Connect to Team (+91 98998 88945) | petcans.in',
      admin: 'Admin Operations Console — PET Cans Management System',
    };
    document.title = titles[page] || 'PET Cans — A Unit of Uunique (uunique.in)';
  };

  const handleOpenQuoteModal = (productId?: string) => {
    setQuoteModalProduct(productId);
    setQuoteModalOpen(true);
  };

  const handleCloseQuoteModal = () => {
    setQuoteModalOpen(false);
    setQuoteModalProduct(undefined);
  };

  // If in Admin Mode, render the dedicated Admin Portal layout
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-[#FAF6EE] text-[#0F1E36] selection:bg-[#C88214] selection:text-white">
        <AdminPage onNavigate={handleNavigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EE] text-[#0F1E36] selection:bg-[#C88214] selection:text-white pb-16 md:pb-0">
      {/* Global Sticky Header with Logo & WhatsApp */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      {/* Main Page Content */}
      <main id="main-content" className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        )}
        {currentPage === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        )}
        {currentPage === 'products' && (
          <ProductsPage
            onNavigate={handleNavigate}
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        )}
        {currentPage === 'careers' && (
          <CareersPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'contact' && (
          <ContactPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating WhatsApp Quick Connect Widget */}
      <WhatsAppWidget />

      {/* Mobile Sticky Quick Action Dock (visible on mobile only) */}
      <MobileQuickBar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      {/* Interactive Quotation / Sample Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={handleCloseQuoteModal}
        initialProductId={quoteModalProduct}
      />
    </div>
  );
}
