import React from 'react';
import { PageId, ProductItem } from '../types';
import { PRODUCTS_DATA, COMPANY_INFO } from '../data/companyData';
import { EducationalSection } from '../components/EducationalSection';
import { CapabilitiesGrid } from '../components/CapabilitiesGrid';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { WhoWeWorkFor } from '../components/WhoWeWorkFor';
import { ProductCard } from '../components/ProductCard';
import { CheckCircle2, ArrowRight, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { openWhatsAppDirect } from '../components/WhatsAppWidget';
import { BrandLogo } from '../components/BrandLogo';
import { useSiteImages } from '../context/SiteImagesContext';
import transpetWideHeroImg from '../assets/images/transpet_wide_hero_packaging_1788335025066.webp';
import heroCansCapsImg from '../assets/images/hero_cans_plastic_caps_easy_open.webp';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onOpenQuoteModal: (productId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenQuoteModal,
}) => {
  const { images } = useSiteImages();
  const featuredProducts = PRODUCTS_DATA.filter((p) => p.isPopular).slice(0, 3);

  const handleProductQuote = (product: ProductItem) => {
    onOpenQuoteModal(product.name);
  };

  return (
    <div className="w-full bg-[#FAF6EE]">
      {/* 1. HERO SECTION — FINAL COMMERCIAL PRODUCT SHOWCASE */}
      <section id="hero" className="relative bg-[#FAF6EE] border-b border-[#EAE1D3] overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20">
        {/* Geometric subtle grid */}
        <div className="absolute inset-0 bg-grid-subtle pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="space-y-8">
            {/* Top Typography & Call to Action Header */}
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center space-x-2 bg-white border border-[#E3D8C8] px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#C88214] shadow-2xs">
                <span className="w-2 h-2 bg-[#C88214]" />
                <span>DIRECT MANUFACTURER</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-[#0F1E36] tracking-tight leading-[1.1] sm:leading-[1.05]">
                PET Packaging Engineered for Freshness & Shelf Impact
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#5A5348] leading-relaxed max-w-3xl mx-auto">
                High-clarity food PET jars and plain flat-bottom beverage cans for dry fruits, confectionery, snacks, spices, juices, and cold brews. 100% food-grade virgin PET with airtight seaming.
              </p>

              {/* Main Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
                <button
                  id="hero-request-quote-btn"
                  onClick={() => onOpenQuoteModal()}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#C88214] text-white hover:bg-[#0F1E36] font-bold text-xs uppercase tracking-wider transition-all duration-200 border border-[#C88214] hover:border-[#0F1E36] flex items-center justify-center gap-2 group cursor-pointer shadow-xs min-h-[46px]"
                >
                  <span>Request Quote & Samples</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-whatsapp-btn"
                  onClick={() => openWhatsAppDirect()}
                  className="w-full sm:w-auto px-5 py-3.5 bg-[#25D366] text-white hover:bg-[#1ebd5d] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs border border-[#25D366] min-h-[46px]"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp: {COMPANY_INFO.whatsappDisplay}</span>
                </button>

                <button
                  id="hero-explore-products-btn"
                  onClick={() => onNavigate('products')}
                  className="w-full sm:w-auto px-5 py-3.5 bg-white border border-[#0F1E36] text-[#0F1E36] hover:bg-[#0F1E36] hover:text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center cursor-pointer shadow-2xs min-h-[46px]"
                >
                  View Products
                </button>
              </div>
            </div>

            {/* Wide Panoramic Commercial Showcase Stage */}
            <div className="relative border border-[#E3D8C8] bg-white p-2 sm:p-3 shadow-md">
              <div className="relative overflow-hidden bg-[#FAF6EE]">
                <img
                  src={images.hero || transpetWideHeroImg}
                  alt="Commercial showcase of crystal-clear PET food jars and cans fitted with food-grade plastic caps and easy-open closures"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  decoding="async"
                  className="w-full h-auto object-cover max-h-[520px] aspect-4/3 sm:aspect-21/9 md:aspect-16/8"
                />

                {/* Gradient Overlay for subtle text contrast at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-t from-[#0A1424]/90 via-[#0A1424]/60 to-transparent pointer-events-none" />

                {/* Feature Pills floating over the wide product shot */}
                <div className="absolute bottom-2.5 sm:bottom-4 left-2.5 sm:left-4 right-2.5 sm:right-4 flex flex-wrap items-center justify-between gap-2 text-white">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-xs border border-[#DF9B2D]/60 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-[#DF9B2D]">
                      Aluminium Easy-Open Lid Caps (202 / 206 / 209 EOE)
                    </span>
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-xs border border-white/20 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-[#CBD5E1]">
                      Resealable Plastic Screw & Snap-On Caps
                    </span>
                    <span className="hidden md:inline-block px-2.5 py-1 bg-black/60 backdrop-blur-xs border border-white/20 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-[#CBD5E1]">
                      PET Food Jars & Plain Flat-Base Beverage Cans
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono text-[#E2E8F0] font-bold hidden md:block">
                    uunique.in • petcans.in
                  </div>
                </div>
              </div>

              {/* 4 Feature Highlights directly beneath the wide shot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-[#FAF6EE] border-t border-[#E3D8C8]">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C88214] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#0F1E36]">Glass-Like Optical Clarity</div>
                    <div className="text-[11px] text-[#5A5348]">Shatterproof high-IV virgin PET</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C88214] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#0F1E36]">True Plain Flat Base</div>
                    <div className="text-[11px] text-[#5A5348]">Authentic can profile, no feet</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C88214] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#0F1E36]">Hermetic Airtight Seal</div>
                    <div className="text-[11px] text-[#5A5348]">202 / 206 Aluminium EOE lids</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C88214] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#0F1E36]">Direct Factory Supply</div>
                    <div className="text-[11px] text-[#5A5348]">Delhi & Haryana production</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. WHAT ARE PET CANS? (Educational Section) */}
      <EducationalSection />

      {/* 3. WHAT WE DO (Capabilities) */}
      <CapabilitiesGrid onNavigate={onNavigate} />

      {/* 4. FEATURED PRODUCTS SECTION */}
      <section id="product-range" className="py-20 bg-white border-b border-[#EAE1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-2xl">
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#C88214] mb-2">
                Featured Highlights
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0F1E36] tracking-tight">
                Our Popular Packaging Solutions
              </h2>
              <p className="mt-3 text-[#5A5348] text-base">
                Engineered for food safety, consumer convenience, and retail shelf excellence. Explore our flagship models or view all products for custom sizes.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => onNavigate('products')}
                className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#0F1E36] hover:text-[#C88214] transition-colors cursor-pointer"
              >
                <span>View All Products ({PRODUCTS_DATA.length} Items)</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </div>

          {/* 3 Featured Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onRequestQuote={handleProductQuote}
              />
            ))}
          </div>

          {/* CTA Banner to All Products */}
          <div className="bg-[#FAF6EE] border border-[#EAE1D3] p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#C88214] mb-1">
                Explore Full Range
              </div>
              <h3 className="text-xl font-display font-bold text-[#0F1E36]">
                Looking for specific capacities, preforms, or custom molds?
              </h3>
              <p className="text-sm text-[#5A5348] mt-1">
                Browse our complete product range with technical specifications, dimensions, and minimum order quantities.
              </p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="px-6 py-3.5 bg-[#0F1E36] text-white hover:bg-[#C88214] font-bold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Explore All {PRODUCTS_DATA.length} Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. WHO WE WORK FOR (B2B Industry Sectors & No Tin Lids Statement) */}
      <WhoWeWorkFor onNavigate={onNavigate} />

      {/* 6. WHY CHOOSE PET CANS */}
      <WhyChooseUs />

      {/* 7. FINAL CTA BANNER */}
      <section id="home-final-cta" className="py-20 bg-[#0A1424] text-white relative overflow-hidden border-t border-[#182C4D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#DF9B2D] font-bold">
              Ready to Upgrade Your Packaging?
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
              Direct Manufacturing & Supply
            </h2>
            <p className="text-base sm:text-lg text-[#CBD5E1] max-w-xl mx-auto leading-relaxed font-normal">
              Connect directly with our Team to discuss container specifications, custom molds, sample kit dispatch, or wholesale bulk pricing.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="final-cta-whatsapp-btn"
                onClick={() => openWhatsAppDirect()}
                className="w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#1ebd5d] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp: {COMPANY_INFO.whatsappDisplay}</span>
              </button>

              <button
                id="final-cta-contact-btn"
                onClick={() => onNavigate('contact')}
                className="w-full sm:w-auto px-8 py-4 bg-[#C88214] hover:bg-white hover:text-[#0F1E36] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer border border-[#C88214]"
              >
                <span>Request Quotation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="text-[11px] text-[#98A7BC] pt-4 font-mono">
              Direct Manufacturing • Factory Units in Delhi & Haryana • petcans.in
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
