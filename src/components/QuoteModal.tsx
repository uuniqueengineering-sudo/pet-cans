import React, { useState, useEffect } from 'react';
import { PRODUCTS_DATA, COMPANY_INFO } from '../data/companyData';
import { api } from '../services/api';
import { X, CheckCircle2, ShieldCheck, Send, Layers, MessageCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductId?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  initialProductId,
}) => {
  const [product, setProduct] = useState(initialProductId || '');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState('5,000 - 25,000 units');
  const [closureType, setClosureType] = useState('Standard Recommended');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Prevent background scrolling on touch screens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.submitInquiry({
        type: 'quote',
        name,
        company,
        email,
        phone,
        productInterest: product || 'Custom Quote Selection',
        estimatedVolume: quantity,
        message: `Closure: ${closureType}. Details: ${notes}`,
      });
      setIsSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleSendToWhatsApp = () => {
    const text = `Hi ${COMPANY_INFO.contactPerson}, I would like to request an official Quote from PETCANS.IN:
- Name: ${name || 'Prospective Buyer'}
- Company: ${company || 'N/A'}
- Contact Phone: ${phone || 'N/A'}
- Product: ${product || 'Standard Food/Beverage PET Cans'}
- Volume: ${quantity}
- Closure: ${closureType}
- Notes: ${notes || 'Please share per-unit price, lead time and MOQ.'}`;

    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encoded}`;
    try {
      const opened = window.open(url, '_blank', 'noopener,noreferrer');
      if (!opened) {
        window.location.href = url;
      }
    } catch {
      window.location.href = url;
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-[#0F1E36]/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative bg-white border border-[#EAE1D3] w-full max-w-xl shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-[#FAF6EE] border-b border-[#EAE1D3] p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BrandLogo variant="icon-only" size="sm" theme="dark" />
            <div>
              <h2 className="text-base font-display font-bold text-[#0F1E36]">
                Request Quotation / Technical Specifications
              </h2>
              <span className="text-[10px] font-mono text-[#71695D] uppercase tracking-wider block">
                Direct Manufacturing Quotation
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#71695D] hover:text-[#0F1E36] hover:bg-[#EAE1D3] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-[#FAF6EE] border border-[#C88214] text-[#C88214] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-bold text-[#0F1E36]">
                Quote Request Submitted Successfully
              </h3>
              <p className="text-xs sm:text-sm text-[#5A5348] max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-[#0F1E36]">{name}</strong>. {COMPANY_INFO.contactPerson} and our packaging engineering desk will calculate customized pricing for <strong>{product || 'your product selection'}</strong> and get back to you shortly.
              </p>
              
              <div className="pt-3 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={handleSendToWhatsApp}
                  className="px-6 py-2.5 bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1ebd5d] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Also Send on WhatsApp</span>
                </button>
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-[#0F1E36] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#C88214] transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold tracking-[0.15em] text-[#71695D] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amit Kapoor"
                    className="w-full px-3 py-2 text-xs bg-[#FAF6EE] border border-[#EAE1D3] focus:border-[#0F1E36] focus:bg-white outline-none text-[#0F1E36]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold tracking-[0.15em] text-[#71695D] mb-1">
                    Company / Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Organic Beverages Co."
                    className="w-full px-3 py-2 text-xs bg-[#FAF6EE] border border-[#EAE1D3] focus:border-[#0F1E36] focus:bg-white outline-none text-[#0F1E36]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold tracking-[0.15em] text-[#71695D] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 text-xs bg-[#FAF6EE] border border-[#EAE1D3] focus:border-[#0F1E36] focus:bg-white outline-none text-[#0F1E36]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold tracking-[0.15em] text-[#71695D] mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs bg-[#FAF6EE] border border-[#EAE1D3] focus:border-[#0F1E36] focus:bg-white outline-none text-[#0F1E36]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold tracking-[0.15em] text-[#71695D] mb-1">
                    Select Container / Product
                  </label>
                  <select
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF6EE] border border-[#EAE1D3] focus:border-[#0F1E36] outline-none text-[#0F1E36]"
                  >
                    <option value="">-- Choose Container --</option>
                    {PRODUCTS_DATA.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.capacity})
                      </option>
                    ))}
                    <option value="Custom Mold / Sizing Requirement">Custom Sizing / New Mold (Uunique Engineering)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold tracking-[0.15em] text-[#71695D] mb-1">
                    Estimated Batch Volume
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF6EE] border border-[#EAE1D3] focus:border-[#0F1E36] outline-none text-[#0F1E36]"
                  >
                    <option value="Sample Pack (Physical Kit)">Sample Pack (Physical Kit)</option>
                    <option value="1,000 - 5,000 units">1,000 - 5,000 units (Trial)</option>
                    <option value="5,000 - 25,000 units">5,000 - 25,000 units (Standard)</option>
                    <option value="25,000 - 100,000+ units">25,000 - 100,000+ units (Bulk Pallets)</option>
                    <option value="Monthly Contract Ongoing">Monthly Contract Ongoing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase font-bold tracking-[0.15em] text-[#71695D] mb-1">
                  Closure / Sealing Requirement
                </label>
                <select
                  value={closureType}
                  onChange={(e) => setClosureType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF6EE] border border-[#EAE1D3] focus:border-[#0F1E36] outline-none text-[#0F1E36]"
                >
                  <option value="Standard Recommended">Standard Recommended for Selected Product</option>
                  <option value="Aluminum Easy Open End (EOE 200/202/206)">Aluminum Easy Open End (EOE 200/202/206)</option>
                  <option value="Aluminum Peel-Off Foil Membrane (Safe Edge)">Aluminum Peel-Off Foil Membrane (Safe Edge)</option>
                  <option value="Plastic Threaded Screw Cap (Gold/Black/White)">Plastic Threaded Screw Cap (Gold/Black/White)</option>
                  <option value="Induction Heat Seal Wad (Hermetic)">Induction Heat Seal Wad (Hermetic)</option>
                  <option value="Tabletop Can Seaming Machine + Cans Bundle">Tabletop Can Seaming Machine + Cans Bundle</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase font-bold tracking-[0.15em] text-[#71695D] mb-1">
                  Product Details / Application Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What product will be filled (e.g. roasted almonds, fizzy kombucha, protein powder)? Any custom neck, wall thickness or dispatch urgency?"
                  className="w-full px-3 py-2 text-xs bg-[#FAF6EE] border border-[#EAE1D3] focus:border-[#0F1E36] focus:bg-white outline-none text-[#0F1E36]"
                />
              </div>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#0F1E36] text-white hover:bg-[#C88214] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#0F1E36] hover:border-[#C88214]"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Submit Request</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendToWhatsApp}
                  className="w-full py-3 px-4 bg-[#25D366] text-white hover:bg-[#1ebd5d] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#25D366]"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Send via WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center justify-center text-[10px] text-[#71695D] space-x-1 font-mono pt-1">
                <ShieldCheck className="w-3 h-3 text-[#C88214]" />
                <span>Direct Factory Pricing • Quality Assured</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
