import React from 'react';
import { PageId } from '../types';
import { COMPANY_INFO, MANUFACTURING_FACILITIES } from '../data/companyData';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, Recycle, MapPin, Mail, Phone, Globe, ArrowUpRight, MessageCircle } from 'lucide-react';
import { openWhatsAppDirect } from './WhatsAppWidget';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#0A1424] text-[#F5EFE6] border-t border-[#162744]">
      {/* Upper Footer section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <BrandLogo variant="horizontal" theme="light" size="md" showSubtitle={true} />
            
            <p className="text-xs text-[#CBD5E1] leading-relaxed border-l-2 border-[#C88214] pl-3">
              "{COMPANY_INFO.tagline}"
            </p>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Industrial manufacturer of food-grade PET cans, wide-mouth jars, EOE closures, and preforms engineered for food, beverage, and consumer product brands.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-2">
              <span className="inline-flex items-center text-[10px] uppercase font-mono px-2 py-0.5 bg-[#12223D] border border-[#1E365E] text-[#E2E8F0]">
                <ShieldCheck className="w-3 h-3 text-[#C88214] mr-1" />
                Food-Grade
              </span>
              <span className="inline-flex items-center text-[10px] uppercase font-mono px-2 py-0.5 bg-[#12223D] border border-[#1E365E] text-[#E2E8F0]">
                <Recycle className="w-3 h-3 text-[#C88214] mr-1" />
                100% Recyclable
              </span>
              <span className="inline-flex items-center text-[10px] uppercase font-mono px-2 py-0.5 bg-[#12223D] border border-[#1E365E] text-[#E2E8F0]">
                Direct Supply
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#98A7BC] mb-4 pb-2 border-b border-[#182C4D]">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="text-[#CBD5E1] hover:text-white transition-colors flex items-center group text-left cursor-pointer uppercase font-semibold tracking-wider"
                >
                  <span className="w-1.5 h-1.5 bg-[#2A436D] group-hover:bg-[#C88214] mr-2.5 transition-colors" />
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="text-[#CBD5E1] hover:text-white transition-colors flex items-center group text-left cursor-pointer uppercase font-semibold tracking-wider"
                >
                  <span className="w-1.5 h-1.5 bg-[#2A436D] group-hover:bg-[#C88214] mr-2.5 transition-colors" />
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('products')}
                  className="text-[#CBD5E1] hover:text-white transition-colors flex items-center group text-left cursor-pointer uppercase font-semibold tracking-wider"
                >
                  <span className="w-1.5 h-1.5 bg-[#2A436D] group-hover:bg-[#C88214] mr-2.5 transition-colors" />
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('careers')}
                  className="text-[#CBD5E1] hover:text-white transition-colors flex items-center group text-left cursor-pointer uppercase font-semibold tracking-wider"
                >
                  <span className="w-1.5 h-1.5 bg-[#2A436D] group-hover:bg-[#C88214] mr-2.5 transition-colors" />
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="text-[#CBD5E1] hover:text-white transition-colors flex items-center group text-left cursor-pointer uppercase font-semibold tracking-wider"
                >
                  <span className="w-1.5 h-1.5 bg-[#2A436D] group-hover:bg-[#C88214] mr-2.5 transition-colors" />
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Factory Locations */}
          <div>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#98A7BC] mb-4 pb-2 border-b border-[#182C4D]">
              Factory Locations (Delhi & Haryana)
            </h3>
            <ul className="space-y-3 text-xs">
              {MANUFACTURING_FACILITIES.map((fac) => (
                <li key={fac.id} className="text-xs text-[#CBD5E1]">
                  <div className="flex items-start">
                    <MapPin className="w-3.5 h-3.5 text-[#C88214] mr-2 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-sans">{fac.name}</strong>
                      <span className="text-[#94A3B8] text-[11px]">{fac.address}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & WhatsApp Connectivity */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#98A7BC] mb-4 pb-2 border-b border-[#182C4D]">
              Contact & WhatsApp
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-start">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] mr-2.5 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#98A7BC]">
                    WhatsApp Direct ({COMPANY_INFO.contactPerson}):
                  </div>
                  <div className="text-white font-mono text-xs font-bold">
                    <button
                      onClick={() => openWhatsAppDirect()}
                      className="text-[#25D366] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{COMPANY_INFO.whatsappDisplay}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="w-3.5 h-3.5 text-[#98A7BC] mr-2.5 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#98A7BC]">Phone Inquiries:</div>
                  <div className="text-white font-mono text-xs">
                    <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-[#DF9B2D] transition-colors">
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="w-3.5 h-3.5 text-[#98A7BC] mr-2.5 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#98A7BC]">Official Email:</div>
                  <div className="text-white font-mono text-xs">
                    <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-[#DF9B2D] transition-colors">
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <Globe className="w-3.5 h-3.5 text-[#98A7BC] mr-2.5 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#98A7BC]">Websites:</div>
                  <div className="text-[#C88214] font-mono text-xs font-bold space-x-1">
                    <span>{COMPANY_INFO.domain}</span>
                    <span className="text-[#475569]">|</span>
                    <a href="https://uunique.in" target="_blank" rel="noreferrer" className="text-white hover:underline">
                      uunique.in
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => openWhatsAppDirect()}
                className="w-full text-xs font-bold uppercase tracking-wider py-2.5 px-3 bg-[#25D366] hover:bg-[#1ebd5d] text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#25D366]"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Chat on WhatsApp</span>
              </button>

              <button
                onClick={() => handleNav('contact')}
                className="w-full text-xs font-bold uppercase tracking-wider py-2.5 px-3 bg-[#C88214] hover:bg-white hover:text-[#0F1E36] text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#C88214]"
              >
                <span>Request Quotation</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#14233D] bg-[#070E1A] py-5 text-xs text-[#7A8EA8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-mono text-[11px]">
            © 2026 PETCANS.IN (A Unit of Uunique). All rights reserved.
          </div>
          <div className="flex items-center space-x-4 text-[#8A9EB8] font-mono text-[11px]">
            <span>Industrial Packaging</span>
            <span>•</span>
            <span>Delhi & Haryana</span>
            <span>•</span>
            <button
              onClick={() => handleNav('admin')}
              className="text-[#98A7BC] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Admin Portal</span>
            </button>
            <span>•</span>
            <span className="text-[#C88214] font-bold">petcans.in</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
