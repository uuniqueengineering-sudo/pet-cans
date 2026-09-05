import React, { useState } from 'react';
import { ProductItem } from '../types';
import { ShieldCheck, Check, ArrowRight, ChevronDown, ChevronUp, Eye, MessageCircle, Image as ImageIcon } from 'lucide-react';
import { openWhatsAppDirect } from './WhatsAppWidget';

interface ProductCardProps {
  product: ProductItem;
  onRequestQuote: (product: ProductItem) => void;
  onRequestSample?: (product: ProductItem) => void;
  onViewDetails?: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onRequestQuote,
  onViewDetails,
}) => {
  const [showFullSpecs, setShowFullSpecs] = useState(false);

  const getCategoryLabel = () => {
    switch (product.category) {
      case 'food':
        return 'Food-Grade PET';
      case 'beverage':
        return 'Beverage (Flat Base)';
      case 'caps':
        return 'Caps & Closures';
      case 'preforms':
        return 'PET Preforms';
      case 'machinery':
        return 'Machinery & Equipment';
      case 'custom':
      default:
        return 'Custom Tooling & Molds';
    }
  };

  const getCategoryStyle = () => {
    switch (product.category) {
      case 'beverage':
        return 'bg-[#0F1E36] text-white border-[#0F1E36]';
      case 'caps':
        return 'bg-[#2563EB] text-white border-[#2563EB]';
      case 'preforms':
        return 'bg-[#7C3AED] text-white border-[#7C3AED]';
      case 'machinery':
        return 'bg-[#047857] text-white border-[#047857]';
      case 'custom':
        return 'bg-[#C88214] text-white border-[#C88214]';
      case 'food':
      default:
        return 'bg-[#FAF6EE] text-[#0F1E36] border-[#EAE1D3]';
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="bg-white border border-[#EAE1D3] overflow-hidden flex flex-col justify-between hover:border-[#0F1E36] transition-all duration-200 group shadow-2xs"
    >
      <div>
        {/* Product Image Header */}
        <div
          onClick={() => onViewDetails && onViewDetails(product)}
          className="relative bg-[#FAF6EE] border-b border-[#EAE1D3] aspect-4/3 overflow-hidden flex items-center justify-center p-6 cursor-pointer"
        >
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
          {product.badge && (
            <div className="absolute top-3 left-3 bg-[#0F1E36] text-white text-[9px] uppercase font-mono tracking-widest font-bold px-2 py-0.5 shadow-xs">
              {product.badge}
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white border border-[#EAE1D3] text-[#0F1E36] text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5">
            {product.capacity || 'Standard Size'}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs border border-[#EAE1D3] text-[#0F1E36] text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 flex items-center gap-1 shadow-xs">
              <ImageIcon className="w-2.5 h-2.5 text-[#C88214]" />
              <span>{product.images.length} Angles</span>
            </div>
          )}
          <div className="absolute inset-0 bg-[#0F1E36]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-white/95 backdrop-blur-xs text-[#0F1E36] text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 border border-[#EAE1D3] shadow-sm flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#C88214]" />
              Quick Specs
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-[9px] uppercase font-mono tracking-widest font-bold px-2 py-0.5 border ${getCategoryStyle()}`}>
              {getCategoryLabel()}
            </span>
            {product.moq && (
              <span className="text-[10px] font-mono text-[#71695D] bg-[#FAF6EE] px-1.5 py-0.5 border border-[#EAE1D3]">
                MOQ: {product.moq}
              </span>
            )}
            {product.neckSize && (
              <span className="text-[10px] font-mono text-[#71695D]">
                • {product.neckSize}
              </span>
            )}
          </div>

          <h3
            onClick={() => onViewDetails && onViewDetails(product)}
            className="text-lg font-display font-bold text-[#0F1E36] leading-snug mb-2 group-hover:text-[#C88214] transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#5A5348] leading-relaxed mb-4">
            {product.description}
          </p>

          {/* Closure Specs */}
          <div className="bg-[#FAF6EE] border border-[#EAE1D3] p-2.5 text-xs text-[#0F1E36] mb-4 font-mono">
            <span className="text-[#71695D] block text-[9px] uppercase tracking-wider">Closure / Sealing System:</span>
            <span className="font-semibold">{product.closureType || 'Contact us for specifications'}</span>
          </div>

          {/* Key Features */}
          <div className="space-y-1.5 mb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#71695D] block mb-1">
              Key Features:
            </span>
            {product.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-start text-xs text-[#5A5348]">
                <Check className="w-3.5 h-3.5 text-[#C88214] mr-2 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Applications list */}
          <div className="pt-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#71695D] block mb-2">
              Recommended Applications:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.applications.map((app, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono bg-[#FAF6EE] text-[#5A5348] border border-[#EAE1D3] px-2 py-0.5 font-medium"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>

          {/* Expandable Technical Specs Drawer */}
          {showFullSpecs && (
            <div className="mt-4 pt-4 border-t-2 border-[#C88214] text-xs space-y-3 bg-[#FAF6EE] p-3.5 border border-[#EAE1D3] animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center justify-between border-b border-[#EAE1D3] pb-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#C88214]">
                  Technical Specifications
                </span>
                <span className="text-[10px] font-mono text-[#71695D]">
                  SKU: {product.id}
                </span>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-white p-2 border border-[#EAE1D3]">
                  <span className="text-[#71695D] block text-[9px] uppercase">Nominal Capacity</span>
                  <span className="font-bold text-[#0F1E36]">{product.capacity || 'Standard'}</span>
                </div>
                <div className="bg-white p-2 border border-[#EAE1D3]">
                  <span className="text-[#71695D] block text-[9px] uppercase">Neck / Mouth</span>
                  <span className="font-bold text-[#0F1E36]">{product.neckSize || 'Custom Fit'}</span>
                </div>
                <div className="bg-white p-2 border border-[#EAE1D3]">
                  <span className="text-[#71695D] block text-[9px] uppercase">Material Resin</span>
                  <span className="font-bold text-[#0F1E36]">{product.material || 'Virgin PET (Code #1)'}</span>
                </div>
                <div className="bg-white p-2 border border-[#EAE1D3]">
                  <span className="text-[#71695D] block text-[9px] uppercase">Minimum Order</span>
                  <span className="font-bold text-[#2D5A27]">{product.moq || '1,000 Pcs'}</span>
                </div>
              </div>

              <div className="bg-white border border-[#EAE1D3] p-2.5 space-y-1">
                <div className="font-bold flex items-center text-[11px] text-[#0F1E36]">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#2D5A27]" />
                  Food-Grade & Pan-India Dispatch
                </div>
                <div className="text-[10px] text-[#5A5348] leading-normal font-sans">
                  Manufactured under strict ISO/FSSAI cleanroom standards at Delhi & Haryana facilities.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-6 pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onViewDetails && onViewDetails(product)}
            className="w-full text-center text-[10px] font-mono uppercase font-bold tracking-wider text-[#0F1E36] hover:bg-[#0F1E36] hover:text-white py-2 border border-[#0F1E36] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            title="Open comprehensive product overview"
          >
            <Eye className="w-3.5 h-3.5 text-[#C88214]" />
            <span>View Details</span>
          </button>
          <button
            type="button"
            onClick={() => setShowFullSpecs(!showFullSpecs)}
            className={`w-full text-center text-[10px] font-mono uppercase font-bold tracking-wider py-2 border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              showFullSpecs
                ? 'bg-[#0F1E36] text-white border-[#0F1E36]'
                : 'text-[#0F1E36] bg-[#FAF6EE] hover:bg-[#EAE1D3] border-[#EAE1D3]'
            }`}
            title="Toggle inline technical specifications"
          >
            <span>{showFullSpecs ? 'Hide Specs' : 'Quick Specs'}</span>
            {showFullSpecs ? <ChevronUp className="w-3.5 h-3.5 text-[#C88214]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#C88214]" />}
          </button>
        </div>

        {/* Dual Actions: Request Quote + Instant WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            id={`quote-btn-${product.id}`}
            onClick={() => onRequestQuote(product)}
            className="w-full py-2.5 px-3 bg-[#0F1E36] text-white hover:bg-[#C88214] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#0F1E36] hover:border-[#C88214] shadow-xs"
          >
            <span>Get Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            id={`whatsapp-btn-${product.id}`}
            onClick={() => openWhatsAppDirect(product.name, product.capacity)}
            className="w-full py-2.5 px-3 bg-[#25D366] text-white hover:bg-[#1ebd5d] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#25D366] shadow-xs"
            title="Chat with our Team about this product"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
