import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { MessageCircle, X, Send, Phone, CheckCircle2, ArrowUpRight, Sparkles, ShieldCheck } from 'lucide-react';

interface WhatsAppWidgetProps {
  customMessage?: string;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const phoneDisplay = COMPANY_INFO.whatsappDisplay;
  const phoneNumber = COMPANY_INFO.whatsappNumber;
  const contactPerson = COMPANY_INFO.contactPerson;

  const quickInquiries = [
    {
      title: 'Request Price Quote',
      desc: 'Get bulk per-unit pricing for PET Cans & Jars',
      text: `Hi ${contactPerson}, I would like to request a wholesale price quote for PET Cans / Jars for our brand.`,
    },
    {
      title: 'Request Free Sample Kit',
      desc: 'Get physical sample containers sent to your address',
      text: `Hi ${contactPerson}, I would like to request a Physical Sample Kit of food-grade PET cans and closures.`,
    },
    {
      title: 'Plain Flat Base Beverage Cans',
      desc: '330ml / 350ml / 500ml Flat Bottom Cans + 202 EOE',
      text: `Hi ${contactPerson}, I am interested in Plain Flat Base PET Beverage Cans (330ml/350ml/500ml). Please share specs and MOQ.`,
    },
    {
      title: 'Can Seaming Machine + Cans Combo',
      desc: 'Tabletop seamer + 202 EOE cans bundle',
      text: `Hi ${contactPerson}, we want to set up an in-house PET can seaming line. Please share details and pricing of the Tabletop Seaming Machine.`,
    },
    {
      title: 'Custom Mold & Tooling',
      desc: 'Bespoke bottle/jar shapes & proprietary tooling',
      text: `Hi ${contactPerson}, we have a requirement for Custom Tooling / Mold Development from Uunique.`,
    },
  ];

  const handleSendWhatsApp = (customText?: string) => {
    const textToSend = customText || message || `Hi ${contactPerson}, I am contacting you from petcans.in regarding food-grade packaging containers.`;
    const encoded = encodeURIComponent(textToSend);
    const url = `https://wa.me/${phoneNumber}?text=${encoded}`;
    try {
      const opened = window.open(url, '_blank', 'noopener,noreferrer');
      if (!opened) {
        window.location.href = url;
      }
    } catch {
      window.location.href = url;
    }
  };

  return (
    <div id="whatsapp-floating-widget" className="fixed bottom-18 sm:bottom-6 right-3 sm:right-6 z-40">
      {/* Expanded Popup Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[calc(100vw-24px)] sm:w-[380px] max-w-sm bg-white border border-[#E5E5E0] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-[#075E54] text-white p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm sm:text-base">
                    PC
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#25D366] border-2 border-[#075E54] rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm leading-tight flex items-center gap-1.5">
                    <span>Connect to Team</span>
                    <span className="text-[9px] sm:text-[10px] bg-[#128C7E] px-1.5 py-0.2 rounded font-mono font-normal">
                      Sales Desk
                    </span>
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-[#A7D7CE] font-mono">
                    Uunique • PETCANS.IN Manufacturing
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1.5 transition-colors cursor-pointer"
                aria-label="Close WhatsApp chat popup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between text-[10px] sm:text-[11px] text-white/90 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                Direct WhatsApp Hotline
              </span>
              <a
                href={`tel:${phoneNumber}`}
                className="hover:underline text-white font-bold flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                {phoneDisplay}
              </a>
            </div>
          </div>

          {/* Body */}
          <div className="p-3.5 sm:p-4 bg-[#ECE5DD]/40 max-h-[60vh] sm:max-h-[380px] overflow-y-auto space-y-3 text-xs">
            
            {/* Greeting speech bubble */}
            <div className="bg-white p-3 sm:p-3.5 border border-[#E5E5E0] shadow-2xs space-y-1.5 relative">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0F1E36] text-xs">
                  PET Cans Team (Uunique)
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#888] font-mono">
                  Official Desk
                </span>
              </div>
              <p className="text-[#333] text-xs leading-relaxed">
                Hello! Welcome to <strong>PETCANS.IN</strong> by Uunique. How can our team assist with your packaging, MOQ, or sample kit requirements today?
              </p>
            </div>

            {/* Quick Inquiries list */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#555] px-1">
                ⚡ Instant Quick Connect:
              </div>
              {quickInquiries.map((inq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendWhatsApp(inq.text)}
                  className="w-full text-left p-2 sm:p-2.5 bg-white hover:bg-[#F0FDF4] border border-[#E5E5E0] hover:border-[#25D366] transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <div className="pr-2">
                    <div className="font-bold text-[#0F1E36] text-[11px] group-hover:text-[#075E54]">
                      {inq.title}
                    </div>
                    <div className="text-[10px] text-[#71695D] leading-tight">
                      {inq.desc}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#888] group-hover:text-[#25D366] shrink-0" />
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="pt-1.5">
              <div className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#555] px-1 mb-1">
                Or write your custom requirement:
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 border border-[#E5E5E0]">
                <input
                  type="text"
                  placeholder="Type a message (e.g. 1000ml jar quote)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendWhatsApp();
                    }
                  }}
                  className="flex-1 text-xs px-2 py-1.5 outline-none text-[#1A1A1A]"
                />
                <button
                  onClick={() => handleSendWhatsApp()}
                  className="bg-[#25D366] hover:bg-[#1ebd5d] text-white p-2 shrink-0 transition-colors cursor-pointer"
                  aria-label="Send WhatsApp message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-[9px] sm:text-[10px] font-mono text-[#71695D] flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Direct connect with our Team (+91 98998 88945)</span>
            </div>

          </div>

        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        id="floating-whatsapp-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#25D366] hover:bg-[#1ebd5d] text-white font-bold text-xs uppercase tracking-wider shadow-xl transition-all duration-200 cursor-pointer border-2 border-white group"
        aria-label="Chat on WhatsApp with our Team"
      >
        <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-current" />
        <div className="flex flex-col text-left leading-none">
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-white/90">
            WhatsApp
          </span>
          <span className="text-[11px] sm:text-xs font-black tracking-tight mt-0.5">
            +91 98998 88945
          </span>
        </div>
      </button>
    </div>
  );
};

// Standalone WhatsApp Action helper for buttons across the app
export const openWhatsAppDirect = (productName?: string, specs?: string) => {
  const phoneNumber = COMPANY_INFO.whatsappNumber;
  const contactPerson = COMPANY_INFO.contactPerson;
  
  let msg = `Hi ${contactPerson}, I am contacting you from petcans.in.`;
  if (productName) {
    msg += ` I would like to request an official price quote and MOQ for *${productName}*`;
    if (specs) msg += ` (${specs})`;
    msg += `. Please share availability and dispatch timelines.`;
  } else {
    msg += ` I would like to request an official price quote for food-grade PET containers.`;
  }

  const encoded = encodeURIComponent(msg);
  const url = `https://wa.me/${phoneNumber}?text=${encoded}`;
  try {
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) {
      window.location.href = url;
    }
  } catch {
    window.location.href = url;
  }
};
