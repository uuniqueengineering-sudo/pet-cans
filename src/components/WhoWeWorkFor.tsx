import React from 'react';
import { 
  Cookie, 
  Wine, 
  Nut, 
  Flame, 
  Coffee, 
  Factory, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { PageId } from '../types';

interface WhoWeWorkForProps {
  onNavigate?: (page: PageId) => void;
  onOpenQuoteModal?: (productOrRequirement?: string) => void;
  variant?: 'full' | 'compact';
}

export const WhoWeWorkFor: React.FC<WhoWeWorkForProps> = ({
  onNavigate,
  onOpenQuoteModal,
  variant = 'full',
}) => {
  const industries = [
    {
      id: 'snacks-makhana',
      title: 'Snack & Confectionery Brands',
      subtitle: 'Roasted Makhanas, Namkeens, Sev, Cookies & Rusks',
      icon: Cookie,
      description: 'Supplying moisture-tight, crystal-clear PET cans that protect crispness and flavor aroma. Food-grade virgin polymer prevents stale texture and oil migration.',
      keyNeeds: [
        'Airtight hermetic sealing against ambient humidity',
        '360° optical clarity to showcase peri-peri seasonings and textures',
        'Shatterproof durability replacing fragile glass jars'
      ],
      recommendedFormats: 'Makhana Cans (500ml/800ml), Namkeen Cans, Wide-Mouth Jars',
      filterTarget: 'food'
    },
    {
      id: 'dry-fruits-nuts',
      title: 'Dry Fruit Processors & Packers',
      subtitle: 'Almonds, Cashews, Pistachios, Walnuts & Trail Mixes',
      icon: Nut,
      description: 'High-barrier transparent cylindrical packaging engineered for nitrogen flushing and shelf-life extension. Calibrated in verified 500ml and 800ml volume sizes.',
      keyNeeds: [
        'Aluminium Easy Open Ends (EOE) and peel-off foil membranes',
        'Rigid wall integrity preventing container collapse under vacuum',
        'Tamper-evident consumer security for premium festive gifts'
      ],
      recommendedFormats: 'Dry Fruits PET Cans (500ml & 800ml), Octagonal Jars',
      filterTarget: 'food'
    },
    {
      id: 'beverage-rtd',
      title: 'Beverage Brands & Bottlers',
      subtitle: 'Carbonated Drinks, Cold Brews, Kombucha & Juices',
      icon: Wine,
      description: 'Engineered plain flat-base PET beverage cans compatible with standard 200/202 aluminium pop-tab lids. Built for both Carbonated and Non-carbonated applications.',
      keyNeeds: [
        'Authentic plain flat base (true can profile, no bottle petaloid feet)',
        'Pressure resistance for carbonated soft drinks and nitrogen dosing',
        'Compatible with commercial high-speed can seaming lines'
      ],
      recommendedFormats: '250ml Pocket, 330ml Sleek, 350ml Standard, 500ml King, 650ml Tall',
      filterTarget: 'beverage'
    },
    {
      id: 'gourmet-ghee',
      title: 'Gourmet Condiments & Dairies',
      subtitle: 'Pure Desi Ghee, Organic Honey, Saffron & Spreads',
      icon: Flame,
      description: 'Specialized luxury container silhouettes including our traditional Maharaja Jars and faceted geometries. Delivers premium shelf presentation for heritage brands.',
      keyNeeds: [
        'Oil-impermeable virgin resin preventing fat seepage',
        'Available in verified 100gm, 200gm, 250gm, and 300gm Maharaja sizes',
        'Induction seal wad compatibility for leakproof courier transit'
      ],
      recommendedFormats: 'Maharaja Jars (100g–300g), Hexagonal Jars, Peanut Butter Jars',
      filterTarget: 'food'
    },
    {
      id: 'cloud-kitchens-cafes',
      title: 'Cafes, Cloud Kitchens & QSR Chains',
      subtitle: 'Fresh Boba Tea, Iced Lattes, Mocktails & On-Demand Sealing',
      icon: Coffee,
      description: 'Equipping modern delivery kitchens and beverage bars with tabletop semi-automatic PET can seamers for rapid 3-second sealing with 100% leakproof delivery.',
      keyNeeds: [
        'Spill-free, tamper-proof courier transit for Swiggy & Zomato orders',
        'Single-button tabletop seaming machines (up to 1,200 cans/hour)',
        'Low footprint and single-phase electrical operation'
      ],
      recommendedFormats: 'Tabletop Can Seaming Machines, 330ml/500ml Beverage Cans',
      filterTarget: 'machinery'
    },
    {
      id: 'copackers-converters',
      title: 'Co-Packers & Contract Manufacturers',
      subtitle: 'Third-Party Food & Beverage Packaging Facilities',
      icon: Factory,
      description: 'High-volume scheduled dispatch of raw PET preforms, aluminium EOE lids (200/202/206/209), and rotary automated packaging machinery from our Delhi and Haryana plants.',
      keyNeeds: [
        'Guaranteed dimensional tolerance (IV 0.80–0.84 virgin resin)',
        'Mass bulk pallets and wholesale carton dispatches',
        'Turnkey tooling support and technical seam calibration'
      ],
      recommendedFormats: 'Injection Preforms, Aluminium EOE Lids, Rotary Seamers',
      filterTarget: 'preforms'
    }
  ];

  return (
    <section id="who-we-work-for" className="py-16 sm:py-20 bg-[#FAF6EE] border-b border-[#EAE1D3] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#C88214] bg-white px-3 py-1.5 border border-[#EAE1D3] mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C88214]" />
              <span>B2B Industrial Packaging Sectors</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-[#0F1E36] tracking-tight">
              Who We Work For
            </h2>
            <p className="mt-3 text-[#5A5348] text-sm sm:text-base leading-relaxed">
              We partner with commercial FMCG producers, beverage brands, co-packers, and food processors across India. Our container geometries and closure systems are engineered specifically to meet regulatory food-contact standards and retail supply chain demands.
            </p>
          </div>

          {onNavigate && (
            <div className="mt-6 md:mt-0 shrink-0">
              <button
                onClick={() => onNavigate('products')}
                className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#0F1E36] hover:text-[#C88214] transition-colors cursor-pointer"
              >
                <span>Browse Products By Category</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          )}
        </div>

        {/* 6 Core Industry Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.id}
                className="bg-white border border-[#EAE1D3] p-6 flex flex-col justify-between hover:border-[#0F1E36] transition-all duration-200 group shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#FAF6EE] border border-[#EAE1D3] flex items-center justify-center text-[#0F1E36] group-hover:bg-[#0F1E36] group-hover:text-white transition-colors shrink-0">
                      <Icon className="w-6 h-6 text-[#C88214] group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#71695D] bg-[#FAF6EE] px-2 py-1 border border-[#EAE1D3]">
                      B2B Sector
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-bold text-[#0F1E36] leading-snug">
                    {ind.title}
                  </h3>
                  <div className="text-xs font-mono text-[#C88214] font-medium mt-1 mb-3">
                    {ind.subtitle}
                  </div>

                  <p className="text-xs text-[#5A5348] leading-relaxed mb-4">
                    {ind.description}
                  </p>

                  <div className="space-y-2 mb-4 pt-3 border-t border-[#EAE1D3]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#71695D] font-bold block">
                      Core Functional Requirements:
                    </span>
                    {ind.keyNeeds.map((need, idx) => (
                      <div key={idx} className="flex items-start text-xs text-[#5A5348] leading-tight">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C88214] mr-2 shrink-0 mt-0.5" />
                        <span>{need}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EAE1D3] mt-2 space-y-3">
                  <div className="text-[11px] font-mono text-[#0F1E36] bg-[#FAF6EE] p-2.5 border border-[#EAE1D3]">
                    <span className="text-[9px] uppercase tracking-wider text-[#71695D] block">Recommended Packaging:</span>
                    <span className="font-semibold text-[#0F1E36]">{ind.recommendedFormats}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('products')}
                        className="text-[11px] font-mono font-bold text-[#0F1E36] hover:text-[#C88214] flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Suitable Cans</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                    {onOpenQuoteModal && (
                      <button
                        onClick={() => onOpenQuoteModal(`${ind.title} Packaging Inquiry`)}
                        className="px-3 py-1.5 bg-[#0F1E36] hover:bg-[#C88214] text-white text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer"
                      >
                        Inquire
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Industrial Closure Standard Policy Note */}
        <div className="mt-8 bg-white border-2 border-[#0F1E36] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#0F1E36] text-white text-[9px] font-mono uppercase font-bold tracking-wider">
                Industrial Closure Standard
              </span>
              <span className="text-xs font-bold text-[#0F1E36]">100% Aluminium EOE & Peel Foil Membranes</span>
            </div>
            <p className="text-xs text-[#5A5348] leading-relaxed">
              <strong>Notice:</strong> PETCANS.IN exclusively supplies precision Food-Grade Aluminium Easy Open Ends (EOE), soft-peel foils, and food-grade PP caps. <strong>We do NOT offer tin lids</strong> on any product lines due to aluminium's superior corrosion barrier, lightweight efficiency, and clean food-contact safety.
            </p>
          </div>
          {onOpenQuoteModal && (
            <button
              onClick={() => onOpenQuoteModal('Aluminium EOE Closure Specifications')}
              className="shrink-0 px-4 py-2 bg-[#C88214] text-white hover:bg-[#a66a0f] text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Closure Specs
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
