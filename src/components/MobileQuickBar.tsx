import React from 'react';
import { PageId } from '../types';
import { COMPANY_INFO } from '../data/companyData';
import { Mail, MessageCircle, Package, Send } from 'lucide-react';
import { openWhatsAppDirect } from './WhatsAppWidget';

interface MobileQuickBarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenQuoteModal: (productId?: string) => void;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  currentPage,
  onNavigate,
  onOpenQuoteModal,
}) => {
  return (
    <div
      id="mobile-bottom-bar"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#0A1424] border-t border-[#1E365E] shadow-2xl px-2 py-1.5 backdrop-blur-md bg-opacity-95"
      style={{ paddingBottom: 'max(6px, env(safe-area-inset-bottom))' }}
    >
      <div className="grid grid-cols-4 gap-1 items-center">
        
        {/* 1. Email Direct */}
        <a
          href={`mailto:${COMPANY_INFO.email}`}
          className="flex flex-col items-center justify-center py-1.5 px-1 text-white hover:text-[#C88214] transition-colors rounded-none group text-center"
          aria-label="Email factory desk"
        >
          <div className="w-8 h-8 rounded-full bg-[#14233D] flex items-center justify-center mb-0.5 group-hover:bg-[#C88214] transition-colors">
            <Mail className="w-4 h-4 text-[#C88214] group-hover:text-white" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A1B2C9] group-hover:text-white">
            Email
          </span>
        </a>

        {/* 2. WhatsApp Direct */}
        <button
          type="button"
          onClick={() => openWhatsAppDirect()}
          className="flex flex-col items-center justify-center py-1.5 px-1 text-white transition-colors rounded-none group text-center cursor-pointer"
          aria-label="Chat on WhatsApp"
        >
          <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center mb-0.5 shadow-xs">
            <MessageCircle className="w-4 h-4 text-white fill-current" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#25D366]">
            WhatsApp
          </span>
        </button>

        {/* 3. Products */}
        <button
          type="button"
          onClick={() => {
            onNavigate('products');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 transition-colors rounded-none group text-center cursor-pointer ${
            currentPage === 'products' ? 'text-[#C88214]' : 'text-white hover:text-[#C88214]'
          }`}
          aria-label="View products"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-0.5 ${
            currentPage === 'products' ? 'bg-[#C88214] text-white' : 'bg-[#14233D] text-[#A1B2C9] group-hover:bg-[#C88214] group-hover:text-white'
          }`}>
            <Package className="w-4 h-4" />
          </div>
          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
            currentPage === 'products' ? 'text-[#C88214]' : 'text-[#A1B2C9] group-hover:text-white'
          }`}>
            Products
          </span>
        </button>

        {/* 4. Instant Quote */}
        <button
          type="button"
          onClick={() => onOpenQuoteModal()}
          className="flex flex-col items-center justify-center py-1.5 px-1 bg-[#C88214] text-white hover:bg-[#b07010] transition-colors rounded-none group text-center cursor-pointer shadow-xs"
          aria-label="Request instant quote"
        >
          <div className="w-8 h-8 flex items-center justify-center mb-0.5">
            <Send className="w-4 h-4 text-white" />
          </div>
          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-white">
            Get Quote
          </span>
        </button>

      </div>
    </div>
  );
};
