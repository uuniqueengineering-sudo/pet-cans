import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Truck, Recycle, Check, Layers, Leaf, Factory } from 'lucide-react';
import { useSiteImages } from '../context/SiteImagesContext';

export const EducationalSection: React.FC = () => {
  const { images } = useSiteImages();
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'sustainability'>('overview');

  return (
    <section id="what-are-pet-cans" className="py-20 bg-white border-b border-[#EAE1D3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#C88214] bg-[#FAF6EE] px-3 py-1.5 border border-[#EAE1D3] mb-3">
            <Layers className="w-3.5 h-3.5 text-[#C88214]" />
            <span>Material Science & Technical Overview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#0F1E36] tracking-tight">
            What Are PET Cans?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5A5348] leading-relaxed font-normal">
            <strong>PET (Polyethylene Terephthalate) cans</strong> are modern, high-clarity cylindrical containers that combine the crystal transparency of glass with the unbreakable strength and lightweight efficiency of advanced polymers.
          </p>
          <p className="mt-3 text-sm sm:text-base text-[#5A5348] leading-relaxed">
            Sealed with hermetic aluminum Easy Open Ends (EOE pop-tab pull rings) or airtight induction peel-off foil membranes, PET cans provide barrier protection against moisture, oxygen, and carbonation loss — giving FMCG, snack, and beverage brands maximum shelf appeal without the fragility of glass or the opacity of metal cans.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex overflow-x-auto scrollbar-none border-b border-[#EAE1D3] mb-8 gap-2 pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-3.5 sm:px-4 text-[11px] sm:text-xs uppercase font-bold tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'overview'
                ? 'border-[#C88214] text-[#0F1E36]'
                : 'border-transparent text-[#71695D] hover:text-[#0F1E36]'
            }`}
          >
            Core Engineering Advantages
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`pb-3 px-3.5 sm:px-4 text-[11px] sm:text-xs uppercase font-bold tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'comparison'
                ? 'border-[#C88214] text-[#0F1E36]'
                : 'border-transparent text-[#71695D] hover:text-[#0F1E36]'
            }`}
          >
            PET vs. Metal vs. Glass
          </button>
          <button
            onClick={() => setActiveTab('sustainability')}
            className={`pb-3 px-3.5 sm:px-4 text-[11px] sm:text-xs uppercase font-bold tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'sustainability'
                ? 'border-[#C88214] text-[#0F1E36]'
                : 'border-transparent text-[#71695D] hover:text-[#0F1E36]'
            }`}
          >
            100% Recyclable & rPET
          </button>
        </div>

        {/* View 1: Core Material Advantages */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#FAF6EE] border border-[#EAE1D3] p-6 relative group hover:border-[#0F1E36] hover:bg-white transition-all duration-200 shadow-2xs">
                <div className="w-11 h-11 bg-white border border-[#EAE1D3] flex items-center justify-center text-[#C88214] mb-4 font-bold">
                  <Sparkles className="w-5 h-5 text-[#C88214]" />
                </div>
                <h3 className="text-base font-display font-bold text-[#0F1E36] mb-2">
                  100% Crystal Optical Clarity
                </h3>
                <p className="text-xs text-[#5A5348] leading-relaxed">
                  Glass-like transparency showcases premium dry fruits, vibrant confectionery, roasted nuts, or colorful fizzy beverages directly to shoppers on retail shelves.
                </p>
                <div className="mt-4 pt-3 border-t border-[#EAE1D3] text-[10px] font-mono text-[#C88214] font-bold uppercase">
                  Zero Visual Distortion
                </div>
              </div>

              <div className="bg-[#FAF6EE] border border-[#EAE1D3] p-6 relative group hover:border-[#0F1E36] hover:bg-white transition-all duration-200 shadow-2xs">
                <div className="w-11 h-11 bg-white border border-[#EAE1D3] flex items-center justify-center text-[#C88214] mb-4 font-bold">
                  <Truck className="w-5 h-5 text-[#C88214]" />
                </div>
                <h3 className="text-base font-display font-bold text-[#0F1E36] mb-2">
                  85% Lighter Than Glass
                </h3>
                <p className="text-xs text-[#5A5348] leading-relaxed">
                  Substantially cuts freight weight and diesel costs across interstate logistics while drastically minimizing warehouse floor dead-load.
                </p>
                <div className="mt-4 pt-3 border-t border-[#EAE1D3] text-[10px] font-mono text-[#C88214] font-bold uppercase">
                  Logistics Cost Reducer
                </div>
              </div>

              <div className="bg-[#FAF6EE] border border-[#EAE1D3] p-6 relative group hover:border-[#0F1E36] hover:bg-white transition-all duration-200 shadow-2xs">
                <div className="w-11 h-11 bg-white border border-[#EAE1D3] flex items-center justify-center text-[#C88214] mb-4 font-bold">
                  <ShieldCheck className="w-5 h-5 text-[#C88214]" />
                </div>
                <h3 className="text-base font-display font-bold text-[#0F1E36] mb-2">
                  Shatterproof Resilience
                </h3>
                <p className="text-xs text-[#5A5348] leading-relaxed">
                  Engineered with high tensile wall strength and impact resistance to prevent transit breakage, warehouse transit drops, and customer safety liability.
                </p>
                <div className="mt-4 pt-3 border-t border-[#EAE1D3] text-[10px] font-mono text-[#C88214] font-bold uppercase">
                  Zero Transit Loss
                </div>
              </div>

              <div className="bg-[#FAF6EE] border border-[#EAE1D3] p-6 relative group hover:border-[#0F1E36] hover:bg-white transition-all duration-200 shadow-2xs">
                <div className="w-11 h-11 bg-white border border-[#EAE1D3] flex items-center justify-center text-[#C88214] mb-4 font-bold">
                  <Recycle className="w-5 h-5 text-[#C88214]" />
                </div>
                <h3 className="text-base font-display font-bold text-[#0F1E36] mb-2">
                  100% Recyclable Grade 1
                </h3>
                <p className="text-xs text-[#5A5348] leading-relaxed">
                  Resin Identification Code #1 is the most widely collected polymer on Earth. 100% circular and readily recycled into food-contact rPET bottles and cans.
                </p>
                <div className="mt-4 pt-3 border-t border-[#EAE1D3] text-[10px] font-mono text-[#C88214] font-bold uppercase">
                  Circular Polymer #1
                </div>
              </div>
            </div>

            {/* Plain Flat Base Highlight Visual Card */}
            <div className="bg-[#FAF6EE] border border-[#EAE1D3] p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xs">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#C88214] bg-white px-2.5 py-1 border border-[#EAE1D3]">
                  <span>Specialized Manufacturing Innovation</span>
                </div>
                <h3 className="text-2xl font-display font-black text-[#0F1E36]">
                  Plain Flat-Bottom Can Engineering (No Bottle Feet)
                </h3>
                <p className="text-xs sm:text-sm text-[#5A5348] leading-relaxed">
                  Unlike conventional soft drink bottles molded with petaloid feet, our <strong>PET Beverage Cans</strong> are engineered with an authentic, flat plain bottom profile identical to commercial aluminum beverage cans. This provides stable retail standing balance, genuine can aesthetics, and internal carbonation pressure resistance.
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-mono text-[#0F1E36]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Check className="w-4 h-4 text-[#C88214]" />
                    True Can Standing Base
                  </span>
                  <span className="flex items-center gap-1.5 font-bold">
                    <Check className="w-4 h-4 text-[#C88214]" />
                    202 & 200 EOE Compatible
                  </span>
                  <span className="flex items-center gap-1.5 font-bold">
                    <Check className="w-4 h-4 text-[#C88214]" />
                    Carbonation & Gas Barrier
                  </span>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="border border-[#EAE1D3] bg-white p-2 shadow-xs">
                  <img
                    src={images.kingFlatCan}
                    alt="Authentic flat-bottom 500ml King Size PET beverage can"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover aspect-16/10"
                  />
                  <div className="bg-[#0A1424] text-white p-3 text-[11px] font-mono flex items-center justify-between">
                    <span>500ml King Size • Plain Flat Base</span>
                    <span className="text-[#DF9B2D] font-bold">petcans.in</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Packaging Comparison Matrix */}
        {activeTab === 'comparison' && (
          <div className="overflow-x-auto border border-[#EAE1D3] bg-white shadow-2xs">
            <table className="min-w-full divide-y divide-[#EAE1D3] text-sm">
              <thead className="bg-[#FAF6EE]">
                <tr>
                  <th className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-[#71695D]">
                    Performance Metric
                  </th>
                  <th className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-white bg-[#0F1E36]">
                    PET Cans (petcans.in)
                  </th>
                  <th className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-[#71695D]">
                    Traditional Metal Cans
                  </th>
                  <th className="px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-[#71695D]">
                    Glass Jars & Bottles
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE1D3] text-xs font-mono">
                <tr>
                  <td className="px-6 py-4 font-sans font-bold text-[#0F1E36]">
                    Product Visibility & Clarity
                  </td>
                  <td className="px-6 py-4 bg-[#FAF3E5] text-[#0F1E36] font-semibold flex items-center">
                    <Check className="w-4 h-4 text-[#C88214] mr-2 shrink-0" />
                    100% Crystal Clear (Showcases Contents)
                  </td>
                  <td className="px-6 py-4 text-[#5A5348]">
                    Opaque (Zero Product Visibility)
                  </td>
                  <td className="px-6 py-4 text-[#5A5348]">
                    Transparent (High visual clarity)
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 font-sans font-bold text-[#0F1E36]">
                    Impact & Shatter Resistance
                  </td>
                  <td className="px-6 py-4 bg-[#FAF3E5] text-[#0F1E36] font-semibold flex items-center">
                    <Check className="w-4 h-4 text-[#C88214] mr-2 shrink-0" />
                    High (Shatterproof & Drop Resistant)
                  </td>
                  <td className="px-6 py-4 text-[#5A5348]">
                    Moderate (Dents under impact)
                  </td>
                  <td className="px-6 py-4 text-[#B83A2A] font-semibold">
                    Extremely Fragile (High transit breakage)
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 font-sans font-bold text-[#0F1E36]">
                    Tare Weight & Freight Efficiency
                  </td>
                  <td className="px-6 py-4 bg-[#FAF3E5] text-[#0F1E36] font-semibold flex items-center">
                    <Check className="w-4 h-4 text-[#C88214] mr-2 shrink-0" />
                    Ultra-Lightweight (~25g - 45g)
                  </td>
                  <td className="px-6 py-4 text-[#5A5348]">
                    Lightweight (~15g - 20g)
                  </td>
                  <td className="px-6 py-4 text-[#B83A2A] font-semibold">
                    Heavy (~250g - 450g tare per unit)
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 font-sans font-bold text-[#0F1E36]">
                    Hermetic Sealing & Freshness
                  </td>
                  <td className="px-6 py-4 bg-[#FAF3E5] text-[#0F1E36] font-semibold flex items-center">
                    <Check className="w-4 h-4 text-[#C88214] mr-2 shrink-0" />
                    Airtight Aluminium EOE / Peel Foil (No Tin Lids)
                  </td>
                  <td className="px-6 py-4 text-[#5A5348]">
                    Double-seamed steel / traditional can end
                  </td>
                  <td className="px-6 py-4 text-[#5A5348]">
                    Lug / Crown cap with plastisol liner
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 font-sans font-bold text-[#0F1E36]">
                    Recyclability & Environmental Impact
                  </td>
                  <td className="px-6 py-4 bg-[#FAF3E5] text-[#0F1E36] font-semibold flex items-center">
                    <Check className="w-4 h-4 text-[#C88214] mr-2 shrink-0" />
                    100% Recyclable (Resin Code #1 + rPET)
                  </td>
                  <td className="px-6 py-4 text-[#5A5348]">
                    100% Recyclable Aluminum/Steel
                  </td>
                  <td className="px-6 py-4 text-[#5A5348]">
                    Recyclable (High energy to re-melt)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* View 3: Sustainability & rPET */}
        {activeTab === 'sustainability' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#FAF6EE] border border-[#EAE1D3] p-6 space-y-3 shadow-2xs">
              <div className="w-10 h-10 bg-white border border-[#EAE1D3] flex items-center justify-center text-[#C88214]">
                <Recycle className="w-5 h-5 text-[#C88214]" />
              </div>
              <h3 className="text-base font-display font-bold text-[#0F1E36]">
                Closed-Loop Circular Economy
              </h3>
              <p className="text-xs text-[#5A5348] leading-relaxed">
                PET is the only plastic packaging that can be continuously recycled back into food-contact packaging over and over again without quality degradation.
              </p>
            </div>

            <div className="bg-[#FAF6EE] border border-[#EAE1D3] p-6 space-y-3 shadow-2xs">
              <div className="w-10 h-10 bg-white border border-[#EAE1D3] flex items-center justify-center text-[#C88214]">
                <Leaf className="w-5 h-5 text-[#C88214]" />
              </div>
              <h3 className="text-base font-display font-bold text-[#0F1E36]">
                Certified Food-Grade rPET Blends
              </h3>
              <p className="text-xs text-[#5A5348] leading-relaxed">
                We support your brand’s sustainability goals by offering up to 100% food-grade certified recycled PET (rPET) resin blends meeting FSSAI standards.
              </p>
            </div>

            <div className="bg-[#FAF6EE] border border-[#EAE1D3] p-6 space-y-3 shadow-2xs">
              <div className="w-10 h-10 bg-white border border-[#EAE1D3] flex items-center justify-center text-[#C88214]">
                <Factory className="w-5 h-5 text-[#C88214]" />
              </div>
              <h3 className="text-base font-display font-bold text-[#0F1E36]">
                Lower Manufacturing Carbon Footprint
              </h3>
              <p className="text-xs text-[#5A5348] leading-relaxed">
                Blow molding PET operates at significantly lower melt temperatures (~260°C) than glass furnaces (~1500°C) or aluminum smelters, consuming far less thermal energy.
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
