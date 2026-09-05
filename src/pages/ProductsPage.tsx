import React, { useState, useEffect } from 'react';
import { PageId, ProductItem, ProductCategory } from '../types';
import { PRODUCTS_DATA, CUSTOM_PACKAGING_CAPABILITIES, COMPANY_INFO } from '../data/companyData';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { Search, ArrowRight, HelpCircle, ShieldCheck, Sparkles, Filter, MessageCircle } from 'lucide-react';
import { openWhatsAppDirect } from '../components/WhatsAppWidget';
import { useSiteImages } from '../context/SiteImagesContext';

interface ProductsPageProps {
  onNavigate: (page: PageId) => void;
  onOpenQuoteModal: (productId?: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onNavigate,
  onOpenQuoteModal,
}) => {
  const { images } = useSiteImages();
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubFilter, setActiveSubFilter] = useState<string>('all');
  const [productsList, setProductsList] = useState<ProductItem[]>(PRODUCTS_DATA);
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductItem | null>(null);

  useEffect(() => {
    api.getPublicProducts()
      .then((data) => {
        if (data && data.length > 0) {
          // Merge or replace
          setProductsList(data);
        }
      })
      .catch(() => {
        // Fallback to static PRODUCTS_DATA
      });
  }, []);

  const foodProductsCount = productsList.filter((p) => p.category === 'food').length;
  const beverageProductsCount = productsList.filter((p) => p.category === 'beverage').length;
  const capsProductsCount = productsList.filter((p) => p.category === 'caps').length;
  const preformsProductsCount = productsList.filter((p) => p.category === 'preforms').length;
  const machineryProductsCount = productsList.filter((p) => p.category === 'machinery').length;
  const customProductsCount = productsList.filter((p) => p.category === 'custom').length;

  const filteredProducts = productsList.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.capacity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.closureType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.applications.some((app) => app.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubFilter =
      activeSubFilter === 'all' ||
      p.applications.some((app) => app.toLowerCase().includes(activeSubFilter.toLowerCase())) ||
      (activeSubFilter === 'beverage' && p.category === 'beverage') ||
      (activeSubFilter === 'caps' && p.category === 'caps') ||
      (activeSubFilter === 'preforms' && p.category === 'preforms');

    return matchesCat && matchesSearch && matchesSubFilter;
  });

  const handleProductQuote = (product: ProductItem) => {
    onOpenQuoteModal(product.name);
  };

  const handleOpenDetailModal = (product: ProductItem) => {
    setSelectedProductForModal(product);
  };

  return (
    <div className="w-full">
      {/* 1. HERO BANNER */}
      <section className="bg-[#FAF6EE] border-b border-[#EAE1D3] py-14 lg:py-18 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#0F1E36] bg-white px-3 py-1.5 border border-[#EAE1D3] mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C88214]" />
              <span>Products • Direct Manufacturing</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-[#0F1E36] tracking-tighter leading-tight">
              PET Cans, Jars, Caps & Preforms<span className="text-[#C88214]">.</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg text-[#5A5348] leading-relaxed font-normal">
              Direct manufacturing of food-grade PET jars, plain flat-bottom beverage cans, aluminium EOE lids, and injection-molded preforms engineered for high barrier, structural integrity, and retail shelf excellence.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#71695D]">
              <span className="font-mono font-bold text-[#0F1E36]">Contact Sales & Inquiries:</span>
              <button
                onClick={() => openWhatsAppDirect()}
                className="text-[#25D366] hover:underline font-bold font-mono flex items-center gap-1 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Connect to Team: {COMPANY_INFO.whatsappDisplay}</span>
              </button>
              <span>•</span>
              <a href="https://uunique.in" target="_blank" rel="noreferrer" className="text-[#C88214] font-bold hover:underline">
                uunique.in
              </a>
            </div>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="mt-8 pt-6 border-t border-[#EAE1D3] flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            {/* Filter Pills */}
            <div className="flex overflow-x-auto scrollbar-none pb-1 gap-2 sm:flex-wrap">
              <button
                id="filter-tab-all"
                onClick={() => {
                  setSelectedCategory('all');
                  setActiveSubFilter('all');
                }}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border whitespace-nowrap shrink-0 min-h-[38px] ${
                  selectedCategory === 'all'
                    ? 'bg-[#0F1E36] text-white border-[#0F1E36]'
                    : 'bg-white border-[#EAE1D3] text-[#0F1E36] hover:bg-[#FAF6EE]'
                }`}
              >
                All Products ({productsList.length})
              </button>

              <button
                id="filter-tab-food"
                onClick={() => {
                  setSelectedCategory('food');
                  setActiveSubFilter('all');
                }}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border whitespace-nowrap shrink-0 min-h-[38px] ${
                  selectedCategory === 'food'
                    ? 'bg-[#0F1E36] text-white border-[#0F1E36]'
                    : 'bg-white border-[#EAE1D3] text-[#0F1E36] hover:bg-[#FAF6EE]'
                }`}
              >
                Food Cans & Jars ({foodProductsCount})
              </button>

              <button
                id="filter-tab-beverage"
                onClick={() => {
                  setSelectedCategory('beverage');
                  setActiveSubFilter('all');
                }}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border whitespace-nowrap shrink-0 min-h-[38px] ${
                  selectedCategory === 'beverage'
                    ? 'bg-[#0F1E36] text-white border-[#0F1E36]'
                    : 'bg-white border-[#EAE1D3] text-[#0F1E36] hover:bg-[#FAF6EE]'
                }`}
              >
                Beverage Cans ({beverageProductsCount})
              </button>

              <button
                id="filter-tab-caps"
                onClick={() => {
                  setSelectedCategory('caps');
                  setActiveSubFilter('all');
                }}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border whitespace-nowrap shrink-0 min-h-[38px] ${
                  selectedCategory === 'caps'
                    ? 'bg-[#2563EB] text-white border-[#2563EB]'
                    : 'bg-white border-[#EAE1D3] text-[#0F1E36] hover:bg-[#FAF6EE]'
                }`}
              >
                Caps & Closures ({capsProductsCount})
              </button>

              <button
                id="filter-tab-preforms"
                onClick={() => {
                  setSelectedCategory('preforms');
                  setActiveSubFilter('all');
                }}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border whitespace-nowrap shrink-0 min-h-[38px] ${
                  selectedCategory === 'preforms'
                    ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                    : 'bg-white border-[#EAE1D3] text-[#0F1E36] hover:bg-[#FAF6EE]'
                }`}
              >
                PET Preforms ({preformsProductsCount})
              </button>

              <button
                id="filter-tab-machinery"
                onClick={() => {
                  setSelectedCategory('machinery');
                  setActiveSubFilter('all');
                }}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border whitespace-nowrap shrink-0 min-h-[38px] ${
                  selectedCategory === 'machinery'
                    ? 'bg-[#047857] text-white border-[#047857]'
                    : 'bg-white border-[#EAE1D3] text-[#0F1E36] hover:bg-[#FAF6EE]'
                }`}
              >
                Machinery & Seamers ({machineryProductsCount})
              </button>

              <button
                id="filter-tab-custom"
                onClick={() => {
                  setSelectedCategory('custom');
                  setActiveSubFilter('all');
                }}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border whitespace-nowrap shrink-0 min-h-[38px] ${
                  selectedCategory === 'custom'
                    ? 'bg-[#C88214] text-white border-[#C88214]'
                    : 'bg-white border-[#EAE1D3] text-[#0F1E36] hover:bg-[#FAF6EE]'
                }`}
              >
                Custom Tooling ({customProductsCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[280px]">
              <Search className="w-4 h-4 text-[#71695D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="catalog-search-input"
                type="text"
                placeholder="Search sizes (e.g. 500ml, 1000ml), caps, preforms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-14 py-2.5 text-base sm:text-xs bg-white border border-[#EAE1D3] focus:border-[#0F1E36] outline-none text-[#0F1E36]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#71695D] hover:text-[#0F1E36] cursor-pointer font-mono font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Sub-Tag Filters */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] font-mono uppercase text-[#71695D] flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> Quick Filter:
            </span>
            {[
              { id: 'all', label: 'All Items' },
              { id: 'makhana', label: 'Makhana / Foxnuts' },
              { id: 'dry fruits', label: 'Dry Fruits (500ml / 800ml)' },
              { id: 'namkeen', label: 'Namkeen & Savories' },
              { id: 'maharaja', label: 'Maharaja Jars (100g–300g)' },
              { id: 'carbonated', label: 'Carbonated Beverages' },
              { id: 'non-carbonated', label: 'Non-Carbonated Beverages' },
              { id: 'seam', label: 'Sealing Machines' },
              { id: 'caps', label: 'Aluminium EOE & Caps' },
              { id: 'preforms', label: 'PET Preforms' },
            ].map((tag) => (
              <button
                key={tag.id}
                onClick={() => setActiveSubFilter(tag.id)}
                className={`px-2.5 py-1 text-[11px] font-mono uppercase shrink-0 transition-colors cursor-pointer border ${
                  activeSubFilter === tag.id
                    ? 'bg-[#C88214] text-white border-[#C88214] font-bold'
                    : 'bg-white text-[#5A5348] border-[#EAE1D3] hover:bg-[#FAF6EE]'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 2. PRODUCT GRID SECTION */}
      <section className="py-12 bg-white border-b border-[#EAE1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#FAF6EE] border border-[#EAE1D3]">
              <HelpCircle className="w-10 h-10 text-[#71695D] mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#0F1E36]">No products matched your criteria</h3>
              <p className="text-xs text-[#5A5348] mt-1">Try another search term or reset your category filter.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setActiveSubFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-5 py-2.5 bg-[#0F1E36] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cv-auto">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onRequestQuote={handleProductQuote}
                  onViewDetails={handleOpenDetailModal}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 3. CUSTOM ENGINEERING CAPABILITIES SECTION */}
      <section id="custom-packaging-solutions" className="py-16 bg-[#FAF6EE] border-b border-[#EAE1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-[#EAE1D3] p-6 sm:p-8">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#C88214] block mb-1">
                  UUNIQUE BESPOKE TOOLING CAPABILITIES
                </span>
                <h3 className="text-2xl font-display font-bold text-[#0F1E36]">
                  Custom Molds, Shapes & Preform Engineering
                </h3>
                <p className="text-xs sm:text-sm text-[#5A5348] mt-2 leading-relaxed">
                  Have a proprietary brand packaging design or specialized volume requirement? Uunique develops custom blow molds, preform injection tooling, and customized neck finishes from 3D CAD modeling to high-speed multi-cavity production tooling.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {CUSTOM_PACKAGING_CAPABILITIES.map((cap, idx) => (
                  <div key={idx} className="bg-[#FAF6EE] border border-[#EAE1D3] p-4 space-y-2">
                    <h4 className="text-xs font-bold text-[#0F1E36] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C88214]" />
                      {cap.title}
                    </h4>
                    <p className="text-[11px] text-[#5A5348] leading-relaxed">
                      {cap.description}
                    </p>
                    <div className="space-y-1 pt-1">
                      {cap.points.map((p, i) => (
                        <div key={i} className="text-[10px] font-mono text-[#71695D]">
                          • {p}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => onOpenQuoteModal('Custom Mold / Shape Engineering Requirement')}
                  className="px-6 py-3 bg-[#0F1E36] text-white hover:bg-[#C88214] text-xs font-bold uppercase tracking-wider transition-colors border border-[#0F1E36] inline-flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Request Custom Mold Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => openWhatsAppDirect('Custom Mold & Tooling', 'Uunique Engineering')}
                  className="px-5 py-3 bg-[#25D366] text-white hover:bg-[#1ebd5d] text-xs font-bold uppercase tracking-wider transition-colors border border-[#25D366] inline-flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Connect to Team</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-[#EAE1D3] bg-[#FAF6EE] p-2">
                <img
                  src={images.customPackaging}
                  alt="Custom PET container mold and shape engineering"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover aspect-4/3"
                />
                <div className="p-4 bg-[#0F1E36] text-white mt-2 text-xs space-y-1 font-mono">
                  <div className="font-bold text-[#C88214] text-[10px] uppercase tracking-wider">
                    DIRECT DISPATCH & TOOLING BY UUNIQUE
                  </div>
                  <p className="text-[#CBD5E1] text-[11px]">
                    Tooling timelines, preform grammage tuning, barrier testing, and pilot runs are structured directly by our Rama Road engineering desk.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. PRODUCT DETAIL MODAL */}
      <ProductDetailModal
        product={selectedProductForModal}
        isOpen={!!selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onRequestQuote={(productName: string) => onOpenQuoteModal(productName)}
      />
    </div>
  );
};
