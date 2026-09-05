import React, { useState, useEffect } from 'react';
import { ProductItem } from '../types';
import {
  X,
  ShieldCheck,
  Check,
  ArrowRight,
  Package,
  Truck,
  Layers,
  PhoneCall,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Image as ImageIcon,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';
import { openWhatsAppDirect } from './WhatsAppWidget';

interface ProductDetailModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestQuote: (productName: string) => void;
  onRequestSample?: (productName: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onRequestQuote,
  onRequestSample,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset to first image when product changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

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

  if (!isOpen || !product) return null;

  const allImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  const currentImage = allImages[activeImageIndex] || product.image;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  const getCategoryLabel = () => {
    switch (product.category) {
      case 'food':
        return 'Food-Grade PET Can / Jar';
      case 'beverage':
        return 'Beverage & Fizzy Drink PET Can (Flat Base)';
      case 'caps':
        return 'PET Caps, Closures & Sealing Systems';
      case 'preforms':
        return 'Injection Molded PET Preforms';
      case 'machinery':
        return 'Can Seaming & Packaging Machinery';
      case 'custom':
      default:
        return 'Custom Tooling & Mold Solutions';
    }
  };

  return (
    <div
      id="product-detail-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        id="product-detail-modal-container"
        className="bg-white border border-[#EAE1D3] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-10 bg-[#0F1E36] text-white px-6 py-4 flex items-center justify-between border-b border-[#1E365E]">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#0F1E36] bg-[#FAF6EE] px-2.5 py-0.5 font-bold">
              {getCategoryLabel()}
            </span>
            {product.badge && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-white bg-[#C88214] px-2.5 py-0.5 font-bold">
                {product.badge}
              </span>
            )}
          </div>
          <button
            id="close-product-detail-btn"
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-white hover:bg-[#1E365E] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Product Image & Thumbnail Gallery */}
            <div className="lg:col-span-5 space-y-3">
              {/* Main Active Image Box */}
              <div className="bg-[#FAF6EE] border border-[#EAE1D3] aspect-4/3 sm:aspect-square flex items-center justify-center p-6 relative overflow-hidden group">
                <img
                  src={currentImage}
                  alt={`${product.name} - View ${activeImageIndex + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-200"
                />

                {/* Multi-angle Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      aria-label="Previous image angle"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-[#0F1E36] hover:text-white text-[#0F1E36] p-1.5 border border-[#EAE1D3] shadow-sm transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      aria-label="Next image angle"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-[#0F1E36] hover:text-white text-[#0F1E36] p-1.5 border border-[#EAE1D3] shadow-sm transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Perspective Counter Badge */}
                {allImages.length > 1 && (
                  <div className="absolute top-3 left-3 bg-[#0F1E36]/90 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2 py-0.5 flex items-center gap-1 shadow-xs">
                    <ImageIcon className="w-3 h-3 text-[#C88214]" />
                    <span>View {activeImageIndex + 1} of {allImages.length}</span>
                  </div>
                )}

                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs border border-[#EAE1D3] px-2.5 py-1 text-[10px] font-mono font-bold text-[#0F1E36]">
                  petcans.in • uunique.in
                </div>
              </div>

              {/* Thumbnail Gallery Strip */}
              {allImages.length > 1 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#71695D] uppercase px-1">
                    <span>Available Angles ({allImages.length})</span>
                    <span>Click to Switch View</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {allImages.map((imgUrl, idx) => {
                      const isSelected = idx === activeImageIndex;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative aspect-square w-16 h-16 shrink-0 bg-[#FAF6EE] border transition-all p-1 cursor-pointer overflow-hidden flex items-center justify-center ${
                            isSelected
                              ? 'border-[#0F1E36] ring-2 ring-[#C88214] scale-105'
                              : 'border-[#EAE1D3] hover:border-[#0F1E36] opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Angle thumbnail ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                          <span
                            className={`absolute bottom-0 right-0 px-1 text-[8px] font-mono font-bold ${
                              isSelected
                                ? 'bg-[#0F1E36] text-white'
                                : 'bg-[#EAE1D3] text-[#0F1E36]'
                            }`}
                          >
                            #{idx + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Manufacturing badges */}
              <div className="bg-[#FAF6EE] border border-[#EAE1D3] p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#0F1E36]">
                  <ShieldCheck className="w-4 h-4 text-[#C88214]" />
                  <span>Quality & Standards Compliance</span>
                </div>
                <div className="text-[11px] text-[#5A5348] leading-relaxed">
                  • 100% Virgin Food-Grade PET Polymer<br />
                  • Odorless, BPA-Free & Chemically Inert<br />
                  • Resin Identification Code #1 (100% Recyclable)<br />
                  • Manufactured by Uunique (Delhi & Haryana Units)
                </div>
              </div>
            </div>

            {/* Right: Product Information & Technical Specs */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-[#0F1E36] leading-tight">
                  {product.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#5A5348] mt-3 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Technical Specifications Table */}
              <div className="border border-[#EAE1D3] bg-white">
                <div className="bg-[#FAF6EE] px-4 py-2.5 border-b border-[#EAE1D3] flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#0F1E36] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#C88214]" />
                    Verified Technical Specifications
                  </span>
                  <span className="text-[9px] font-mono text-[#71695D] uppercase">Direct Supply</span>
                </div>

                <div className="divide-y divide-[#EAE1D3] text-xs">
                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <span className="font-mono text-[#71695D] text-[11px] uppercase">Capacity / Volume</span>
                    <span className="col-span-2 font-bold text-[#0F1E36] font-mono">
                      {product.capacity || 'Contact for custom sizing'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <span className="font-mono text-[#71695D] text-[11px] uppercase">Neck Diameter</span>
                    <span className="col-span-2 font-medium text-[#0F1E36]">
                      {product.neckSize || 'Standard Industrial Finish'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <span className="font-mono text-[#71695D] text-[11px] uppercase">Closure / Sealing</span>
                    <span className="col-span-2 font-medium text-[#0F1E36]">
                      {product.closureType || 'Airtight EOE / Foil / PP Cap'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <span className="font-mono text-[#71695D] text-[11px] uppercase">Base Profile</span>
                    <span className="col-span-2 font-medium text-[#0F1E36]">
                      {product.category === 'beverage'
                        ? 'Plain Flat Base (True Can Standing Bottom, no bottle petaloid feet)'
                        : 'Reinforced Flat / Cylindrical Standing Base'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <span className="font-mono text-[#71695D] text-[11px] uppercase">Minimum Order (MOQ)</span>
                    <span className="col-span-2 font-bold text-[#C88214] font-mono">
                      {product.moq || '1,000 units (Trial) / 25,000+ (Bulk)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 px-4 py-2.5">
                    <span className="font-mono text-[#71695D] text-[11px] uppercase">Material</span>
                    <span className="col-span-2 font-medium text-[#0F1E36]">
                      {product.material || 'Polyethylene Terephthalate (PET Grade 1) / rPET on request'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Features Bullet List */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#71695D] block">
                  Key Product Features:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start text-xs text-[#5A5348] bg-[#FAF6EE] p-2.5 border border-[#EAE1D3]">
                      <Check className="w-3.5 h-3.5 text-[#C88214] mr-2 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applications Tags */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#71695D] block">
                  Recommended Industry Applications:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.applications.map((app, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono bg-[#FAF6EE] text-[#0F1E36] border border-[#EAE1D3] px-3 py-1 font-medium"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Request Quote + WhatsApp Chat + Request Sample */}
              <div className="pt-4 border-t border-[#EAE1D3] flex flex-col sm:flex-row gap-2.5">
                <button
                  id="modal-request-quote-btn"
                  onClick={() => {
                    onClose();
                    onRequestQuote(product.name);
                  }}
                  className="flex-1 py-3 px-4 bg-[#0F1E36] text-white hover:bg-[#C88214] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#0F1E36]"
                >
                  <Package className="w-4 h-4" />
                  <span>Request Quotation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="modal-whatsapp-btn"
                  onClick={() => openWhatsAppDirect(product.name, product.capacity)}
                  className="py-3 px-5 bg-[#25D366] text-white hover:bg-[#1ebd5d] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#25D366]"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Quote</span>
                </button>

                <button
                  id="modal-request-sample-btn"
                  onClick={() => {
                    onClose();
                    onRequestQuote(`Sample Kit Request: ${product.name}`);
                  }}
                  className="py-3 px-4 bg-white text-[#0F1E36] hover:bg-[#FAF6EE] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#EAE1D3]"
                >
                  <Truck className="w-4 h-4 text-[#C88214]" />
                  <span>Sample Kit</span>
                </button>
              </div>

              {/* Direct Call & WhatsApp Assist */}
              <div className="flex flex-wrap items-center justify-between text-xs text-[#71695D] pt-2 border-t border-[#EAE1D3] gap-2">
                <span>Direct Sales Desk: <strong>{COMPANY_INFO.contactPerson}</strong></span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openWhatsAppDirect(product.name, product.capacity)}
                    className="font-mono font-bold text-[#25D366] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp</span>
                  </button>
                  <span className="text-[#CCC]">•</span>
                  <a
                    href={`tel:${COMPANY_INFO.phone}`}
                    className="font-mono font-bold text-[#0F1E36] hover:text-[#C88214] flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3 text-[#C88214]" />
                    <span>{COMPANY_INFO.phone}</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
