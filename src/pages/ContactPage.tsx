import React, { useState, useEffect } from 'react';
import { PageId, WebsiteSettings } from '../types';
import { COMPANY_INFO, MANUFACTURING_FACILITIES } from '../data/companyData';
import { api } from '../services/api';
import { ContactForm } from '../components/ContactForm';
import { MapPin, Phone, Mail, Globe, ShieldCheck, Clock, ArrowRight, Building2, Factory, MessageCircle, UserCheck } from 'lucide-react';
import { openWhatsAppDirect } from '../components/WhatsAppWidget';
import { BrandLogo } from '../components/BrandLogo';

interface ContactPageProps {
  onNavigate?: (page: PageId) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    api.getPublicSettings()
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(() => {
        // Fallback to static COMPANY_INFO
      });
  }, []);

  const phone = settings?.phone || COMPANY_INFO.phone;
  const phoneAlt = settings?.phoneAlt || COMPANY_INFO.phoneAlt;
  const email = settings?.email || COMPANY_INFO.email;
  const salesEmail = settings?.salesEmail || COMPANY_INFO.salesEmail;
  const careersEmail = settings?.careersEmail || COMPANY_INFO.careersEmail;
  const registeredAddress = settings?.registeredAddress || COMPANY_INFO.registeredAddress;
  const businessHours = settings?.businessHoursWeekdays || COMPANY_INFO.businessHoursWeekdays;

  return (
    <div className="w-full">
      {/* 1. HERO */}
      <section className="bg-[#FAF6EE] border-b border-[#EAE1D3] py-16 lg:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#0F1E36] bg-white px-3 py-1.5 border border-[#EAE1D3] mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C88214]" />
              <span>Sales & Engineering Inquiries • Direct Manufacturing</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-[#0F1E36] tracking-tighter leading-tight">
              Contact PET Cans<span className="text-[#C88214]">.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#5A5348] leading-relaxed font-normal">
              Direct connection with {COMPANY_INFO.contactPerson} and our packaging engineering team across our Delhi and Haryana production facilities.
            </p>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTACT SECTION */}
      <section className="py-20 bg-white border-b border-[#EAE1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="mb-6">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#C88214] block mb-1">
                  Online Inquiry Desk
                </span>
                <h2 className="text-2xl font-display font-black text-[#0F1E36]">
                  Request Quotations, Specifications & Sample Kits
                </h2>
                <p className="text-xs text-[#71695D] mt-1">
                  Fill out your commercial packaging requirements below. Our technical dispatch desk will respond within 2-4 business hours.
                </p>
              </div>
              <ContactForm />
            </div>

            {/* Right Column: Contact Details & Plant Information */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* WhatsApp Direct Contact Highlight Card */}
              <div className="bg-[#075E54] text-white p-6 border border-[#054C44] shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center font-bold text-sm">
                      PC
                    </div>
                    <div>
                      <h3 className="text-base font-bold leading-tight">
                        Connect to Team
                      </h3>
                      <span className="text-[11px] text-[#A7D7CE] font-mono">
                        Direct Sales Desk • Uunique
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-[#25D366] text-[#075E54] font-bold px-2 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#075E54] animate-ping" />
                    ONLINE
                  </span>
                </div>

                <p className="text-xs text-white/90 leading-relaxed">
                  Connect immediately with our Team for urgent dispatch timelines, custom tooling consultations, physical sample kit requests, or bulk container pricing.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    onClick={() => openWhatsAppDirect()}
                    className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#1ebd5d] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>WhatsApp Chat</span>
                  </button>

                  <a
                    href={`tel:${COMPANY_INFO.phone}`}
                    className="py-3 px-4 bg-white/15 hover:bg-white/25 text-white font-bold text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{COMPANY_INFO.phone}</span>
                  </a>
                </div>
              </div>

              {/* Direct Info Card */}
              <div className="bg-[#FAF6EE] border border-[#EAE1D3] p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE1D3]">
                  <h3 className="text-base font-display font-bold text-[#0F1E36] flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#C88214]" />
                    <span>Corporate & Sales Channels</span>
                  </h3>
                  <span className="text-[10px] font-mono text-[#C88214] font-bold uppercase">petcans.in</span>
                </div>

                <div className="space-y-4 text-xs text-[#5A5348]">
                  <div className="flex items-start">
                    <Phone className="w-4 h-4 text-[#C88214] mr-3 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] uppercase font-mono text-[#71695D]">Direct Sales Phone & WhatsApp:</div>
                      <div className="text-sm font-bold text-[#0F1E36] font-mono mt-0.5 space-x-2">
                        <a href={`tel:${phone}`} className="hover:text-[#C88214] transition-colors">
                          {phone}
                        </a>
                        {phoneAlt && (
                          <>
                            <span className="text-[#999990]">•</span>
                            <a href={`tel:${phoneAlt}`} className="hover:text-[#C88214] transition-colors text-xs text-[#5A5348]">
                              {phoneAlt}
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="w-4 h-4 text-[#C88214] mr-3 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] uppercase font-mono text-[#71695D]">Official Email / Gmail:</div>
                      <div className="text-sm font-bold text-[#0F1E36] font-mono mt-0.5">
                        <a href={`mailto:${email}`} className="hover:text-[#C88214] transition-colors">
                          {email}
                        </a>
                      </div>
                      <div className="text-xs text-[#71695D] font-mono mt-0.5 space-x-2">
                        <span>Direct Inquiries: <a href={`mailto:${email}`} className="hover:underline">{email}</a></span>
                        {careersEmail && careersEmail !== email && (
                          <>
                            <span>•</span>
                            <span>Careers: <a href={`mailto:${careersEmail}`} className="hover:underline">{careersEmail}</a></span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Globe className="w-4 h-4 text-[#C88214] mr-3 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] uppercase font-mono text-[#71695D]">Official Web Portals:</div>
                      <div className="text-sm font-bold text-[#0F1E36] font-mono mt-0.5 space-x-3">
                        <a href="https://petcans.in" target="_blank" rel="noreferrer" className="hover:underline font-bold">
                          petcans.in
                        </a>
                        <span className="text-[#999990]">|</span>
                        <a href="https://uunique.in" target="_blank" rel="noreferrer" className="hover:underline text-[#C88214] font-bold">
                          uunique.in
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-4 h-4 text-[#C88214] mr-3 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] uppercase font-mono text-[#71695D]">Plant & Dispatch Hours:</div>
                      <div className="text-xs font-semibold text-[#0F1E36] mt-0.5">
                        {businessHours}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start pt-2 border-t border-[#EAE1D3]">
                    <MapPin className="w-4 h-4 text-[#C88214] mr-3 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] uppercase font-mono text-[#71695D]">Registered Office:</div>
                      <div className="text-xs text-[#0F1E36] mt-0.5 leading-relaxed">
                        {registeredAddress}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manufacturing Plant Hubs Card: Rama Road, Panipat, Rai */}
              <div className="bg-[#FAF6EE] border border-[#EAE1D3] p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE1D3]">
                  <h3 className="text-base font-display font-bold text-[#0F1E36] flex items-center gap-2">
                    <Factory className="w-4 h-4 text-[#C88214]" />
                    <span>Manufacturing & Tooling Facilities</span>
                  </h3>
                  <span className="text-[10px] font-mono text-[#71695D] uppercase">Delhi & Haryana</span>
                </div>

                <div className="space-y-4">
                  {MANUFACTURING_FACILITIES.map((fac) => (
                    <div key={fac.id} className="text-xs border-b border-[#EAE1D3] last:border-0 pb-3 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0F1E36] text-xs">{fac.name}</span>
                        <span className="text-[10px] font-mono bg-white text-[#C88214] px-2 py-0.5 border border-[#EAE1D3] font-bold">
                          {fac.state}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5A5348] mt-1 flex items-start">
                        <MapPin className="w-3 h-3 text-[#71695D] mr-1 shrink-0 mt-0.5" />
                        <span>{fac.address}</span>
                      </p>
                      <div className="text-[10px] font-mono text-[#71695D] mt-1 pl-4">
                        Focus: {fac.facilityType}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
