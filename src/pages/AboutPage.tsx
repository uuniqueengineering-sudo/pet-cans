import React from 'react';
import { PageId } from '../types';
import { MANUFACTURING_FACILITIES } from '../data/companyData';
import {
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Gauge,
  Cpu,
  Truck,
  Building2,
  Scale
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
  onOpenQuoteModal?: (productId?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenQuoteModal }) => {
  const technicalPillars = [
    {
      icon: ShieldCheck,
      badge: 'Food Safety Standard',
      title: 'US FDA & EU Compliant Resins',
      description:
        '100% virgin food-grade PET polymer conforming to US FDA 21 CFR §177.1630, EU 10/2011, and FSSAI standards. Completely BPA-free, odorless, and non-reactive with dry foods, confectionery, spices, or carbonated beverages.',
    },
    {
      icon: Gauge,
      badge: 'Precision Engineering',
      title: 'Optical Tolerance & Wall Consistency',
      description:
        'High-cavity automated stretch blow molding maintains wall distribution within ±0.03mm. Ensures uniform top-load compressive strength for high-speed automated filling lines and multi-tier pallet stacking.',
    },
    {
      icon: Cpu,
      badge: 'Rapid Tooling',
      title: 'In-House Mold Fabrication (14 Days)',
      description:
        'Dedicated CNC mold engineering facilities allow custom neck finishes, specialized embossed brand logos, and proprietary container geometries in under 14 business days from 3D CAD sign-off.',
    },
    {
      icon: Truck,
      badge: 'Logistics SLA',
      title: '15M+ Monthly Output & JIT Supply',
      description:
        'Interconnected manufacturing facilities across Delhi and Haryana ensure continuous multi-shift production, buffer stock management for contract clients, and daily scheduled dispatch across India.',
    },
  ];

  const comparisonData = [
    {
      metric: 'Transit & Warehousing Breakage',
      petCans: '< 0.01% (Virtually Unbreakable)',
      glassJars: '4.0% – 8.5% (High Shard Risk)',
      metalCans: '< 0.5% (Prone to Dents)',
      highlight: true,
    },
    {
      metric: 'Tare Weight (Empty Container)',
      petCans: '18g – 38g (85% Lighter)',
      glassJars: '180g – 420g (Heavy Tare)',
      metalCans: '35g – 65g (Moderate)',
      highlight: true,
    },
    {
      metric: 'Product Optical Visibility',
      petCans: '100% Crystal Transparency',
      glassJars: '92% Transparent',
      metalCans: '0% (Completely Opaque)',
      highlight: false,
    },
    {
      metric: 'Closure & Sealing Integrity',
      petCans: 'Hermetic 202 EOE Pull Tab / Induction Foil',
      glassJars: 'Lug / Twist-Off Cap (Vulnerable Vacuum)',
      metalCans: 'Double-Seamed Metal End',
      highlight: false,
    },
    {
      metric: 'Freight & Fuel Efficiency',
      petCans: 'Maximum Payload (Up to 35% Freight Savings)',
      glassJars: 'High Dead-Weight Diesel Cost',
      metalCans: 'Standard Payload Efficiency',
      highlight: true,
    },
    {
      metric: 'End-of-Life Recyclability',
      petCans: '100% Recyclable (RIC #1) / rPET Available',
      glassJars: '100% Recyclable (High Remelt Energy)',
      metalCans: '100% Recyclable',
      highlight: false,
    },
  ];

  const qualityStandards = [
    {
      step: '01',
      title: 'Virgin Polymer Inspection',
      desc: 'Intrinsic viscosity (IV) verification, moisture desorption analysis, and spectrophotometer color index audit on every incoming resin batch.',
    },
    {
      step: '02',
      title: 'Multi-Cavity Preform Molding',
      desc: 'Precision hot-runner injection molding guaranteeing flash-free neck finishes and uniform gate crystallite dispersion.',
    },
    {
      step: '03',
      title: 'Automated Stretch Blow Molding',
      desc: 'Infrared preheating profile control with bi-axial molecular orientation for superior barrier properties and shatter resistance.',
    },
    {
      step: '04',
      title: 'Hydrostatic & Seal Testing',
      desc: 'Chamber vacuum leak detection, 90 PSI burst pressure threshold validation, and optical seam micrometer verification for 202 EOE ends.',
    },
  ];

  return (
    <div className="w-full bg-[#FAF6EE]">
      {/* 1. HERO BANNER — DEEP NAVY WITH WARM OCHRE ACCENTS */}
      <section className="bg-[#0A1424] text-white border-b border-[#182C4D] py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-subtle opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center space-x-2 bg-[#C88214] text-white px-3.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-6 shadow-sm">
              <span className="w-2 h-2 bg-white" />
              <span>Direct Manufacturing & Tooling Infrastructure</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white tracking-tighter leading-[1.05]">
              Engineering Superior Food & Beverage Packaging<span className="text-[#C88214]">.</span>
            </h1>

            <p className="mt-6 text-base sm:text-xl text-[#CBD5E1] leading-relaxed font-normal max-w-3xl">
              PET Cans is an industrial packaging manufacturer operating automated injection and blow molding units across Delhi and Haryana. We produce food-grade PET cans, airtight pantry jars, and custom tooling solutions for FMCG brands, beverage bottlers, and procurement leaders nationwide.
            </p>

            {/* High-Impact Institutional Metrics Bar */}
            <div className="mt-10 pt-8 border-t border-[#182C4D] grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
              <div>
                <div className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">15M+</div>
                <div className="text-[11px] font-mono text-[#98A7BC] uppercase mt-1">Monthly Unit Capacity</div>
              </div>
              <div>
                <div className="font-display font-black text-3xl sm:text-4xl text-[#DF9B2D] tracking-tight">100%</div>
                <div className="text-[11px] font-mono text-[#98A7BC] uppercase mt-1">US FDA & FSSAI Compliant</div>
              </div>
              <div>
                <div className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">4 Plants</div>
                <div className="text-[11px] font-mono text-[#98A7BC] uppercase mt-1">Delhi & Haryana Hubs</div>
              </div>
              <div>
                <div className="font-display font-black text-3xl sm:text-4xl text-[#DF9B2D] tracking-tight">±0.03mm</div>
                <div className="text-[11px] font-mono text-[#98A7BC] uppercase mt-1">Precision Neck Tolerance</div>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => onOpenQuoteModal ? onOpenQuoteModal() : onNavigate('contact')}
                className="px-6 py-3.5 bg-[#C88214] text-white hover:bg-white hover:text-[#0F1E36] text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-2 cursor-pointer border border-[#C88214]"
              >
                <span>Request Sample Kit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('products')}
                className="px-6 py-3.5 bg-transparent text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer border border-white/40"
              >
                <span>Explore Products</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. INSTITUTIONAL STATEMENT & MANUFACTURING ARCHITECTURE */}
      <section className="py-20 bg-white border-b border-[#EAE1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#C88214] mb-2">
              Corporate & Engineering Heritage
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0F1E36] tracking-tight">
              Built for Scale, Safety, and Supply Reliability
            </h2>
            <p className="mt-4 text-base text-[#5A5348] leading-relaxed">
              In modern FMCG and beverage retail, packaging must perform on three non-negotiable fronts: preserve shelf life, eliminate transport breakage, and maximize on-shelf consumer conversion. PET Cans was founded to replace fragile glass jars and opaque metal tins with high-clarity, unbreakable food-grade PET containers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FAF6EE] border border-[#EAE1D3] p-8 space-y-4 hover:border-[#0F1E36] transition-all">
              <div className="w-10 h-10 bg-[#0F1E36] text-white flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h3 className="text-xl font-display font-bold text-[#0F1E36]">
                The Engineering Shift
              </h3>
              <p className="text-xs text-[#5A5348] leading-relaxed">
                Glass packaging burdens brands with 4–8% transit breakage, costly freight dead-weight, and hazardous shatter risks in kitchens. Our PET cans deliver 100% optical transparency while being 85% lighter and virtually indestructible.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#C88214] font-bold uppercase">
                Zero Glass Shard Hazard
              </div>
            </div>

            <div className="bg-[#FAF6EE] border border-[#EAE1D3] p-8 space-y-4 hover:border-[#0F1E36] transition-all">
              <div className="w-10 h-10 bg-[#C88214] text-white flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h3 className="text-xl font-display font-bold text-[#0F1E36]">
                In-House Tooling & Molds
              </h3>
              <p className="text-xs text-[#5A5348] leading-relaxed">
                Unlike third-party repackagers, we operate complete CNC mold machining and preform injection facilities across our manufacturing hubs. Brands can commission proprietary container shapes, customized neck finishes, and embossed lids in record time.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#C88214] font-bold uppercase">
                14-Day Custom Mold Turnaround
              </div>
            </div>

            <div className="bg-[#FAF6EE] border border-[#EAE1D3] p-8 space-y-4 hover:border-[#0F1E36] transition-all">
              <div className="w-10 h-10 bg-[#0F1E36] text-white flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h3 className="text-xl font-display font-bold text-[#0F1E36]">
                Contract Manufacturing & SLAs
              </h3>
              <p className="text-xs text-[#5A5348] leading-relaxed">
                We partner with commercial food processors, cloud kitchen chains, craft soda breweries, and dry fruit distributors with strict SLA commitments, dedicated account managers, and pre-scheduled regional deliveries.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#C88214] font-bold uppercase">
                Guaranteed On-Time Dispatch
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. TECHNICAL PILLARS (CORE CAPABILITIES) */}
      <section className="py-20 bg-[#FAF6EE] border-b border-[#EAE1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#71695D]">
              Manufacturing Rigor
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0F1E36] tracking-tight mt-1">
              Engineered for Industrial Procurement
            </h2>
            <p className="mt-3 text-[#5A5348] text-base">
              Every production lot undergoes structured dimensional audits, hydrostatic burst testing, and hermetic seam inspection to guarantee zero line stoppages for our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {technicalPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#EAE1D3] p-8 hover:border-[#0F1E36] transition-all flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-[#FAF6EE] border border-[#EAE1D3] flex items-center justify-center text-[#C88214]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono uppercase font-bold tracking-widest px-2.5 py-1 bg-[#FAF6EE] text-[#0F1E36] border border-[#EAE1D3]">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-display font-bold text-[#0F1E36] mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#5A5348] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#EAE1D3] flex items-center text-[11px] font-mono font-bold text-[#C88214]">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    <span>Verified Production Standard</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. TECHNICAL COMPARISON TABLE (PET VS GLASS VS METAL) */}
      <section className="py-20 bg-white border-b border-[#EAE1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#C88214] bg-[#FAF6EE] px-3 py-1.5 border border-[#EAE1D3] mb-3">
              <Scale className="w-3.5 h-3.5 text-[#C88214]" />
              <span>Material Science Evaluation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0F1E36] tracking-tight">
              Specification Matrix: PET vs. Glass vs. Metal
            </h2>
            <p className="mt-3 text-base text-[#5A5348]">
              A direct comparison of structural resilience, tare weight, logistical efficiency, and unit economics across commercial packaging formats.
            </p>
          </div>

          <div className="overflow-x-auto border border-[#EAE1D3] shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0A1424] text-white font-mono text-[11px] uppercase tracking-wider">
                  <th className="p-4 sm:p-5 font-bold border-b border-[#182C4D]">Performance Dimension</th>
                  <th className="p-4 sm:p-5 font-bold bg-[#C88214] text-white border-b border-[#C88214]">
                    PET Cans (Our Standard)
                  </th>
                  <th className="p-4 sm:p-5 font-bold border-b border-[#182C4D]">Traditional Glass Jars</th>
                  <th className="p-4 sm:p-5 font-bold border-b border-[#182C4D]">Tinplate & Aluminium Cans</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE1D3] font-mono">
                {comparisonData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2] hover:bg-[#F3ECE2] transition-colors'}
                  >
                    <td className="p-4 sm:p-5 font-sans font-bold text-[#0F1E36] text-xs sm:text-sm">
                      {row.metric}
                    </td>
                    <td className="p-4 sm:p-5 bg-[#FAF3E5] text-[#A5680B] font-bold text-xs sm:text-sm border-x border-[#EED7B2]">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#C88214] shrink-0" />
                        <span>{row.petCans}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-[#5A5348] text-xs">
                      {row.glassJars}
                    </td>
                    <td className="p-4 sm:p-5 text-[#5A5348] text-xs">
                      {row.metalCans}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 bg-[#FAF6EE] border border-[#EAE1D3] text-xs text-[#5A5348] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono">
            <span>* Data benchmarked against standard 330ml – 1000ml commercial container formats in interstate Indian logistics.</span>
            <button
              onClick={() => onOpenQuoteModal ? onOpenQuoteModal() : onNavigate('contact')}
              className="text-[#C88214] font-bold hover:underline shrink-0 uppercase tracking-wider"
            >
              Request Full Technical Whitepaper &rarr;
            </button>
          </div>

        </div>
      </section>

      {/* 5. QUALITY ASSURANCE PROTOCOLS */}
      <section className="py-20 bg-[#FAF6EE] border-b border-[#EAE1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#C88214]">
              Quality Assurance Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0F1E36] tracking-tight mt-1">
              4-Stage Quality Verification on Every Lot
            </h2>
            <p className="mt-3 text-[#5A5348] text-base">
              Zero-defect commitment for high-speed filling lines and automated seaming machines. Every shipment includes batch Certificate of Analysis (COA).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualityStandards.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#EAE1D3] p-6 hover:border-[#0F1E36] transition-all space-y-3 shadow-2xs"
              >
                <div className="text-2xl font-display font-black text-[#C88214] font-mono">
                  {item.step}
                </div>
                <h3 className="text-base font-display font-bold text-[#0F1E36]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#5A5348] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. MANUFACTURING FACILITIES (STRATEGIC PLANT NETWORK) */}
      <section id="manufacturing-facilities" className="py-20 bg-white border-b border-[#EAE1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#C88214] bg-[#FAF6EE] px-3 py-1.5 border border-[#EAE1D3] mb-3">
              <Building2 className="w-3.5 h-3.5 text-[#C88214]" />
              <span>Plant Network & Capacity</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0F1E36] tracking-tight">
              Our Manufacturing Network
            </h2>
            <p className="mt-3 text-[#5A5348] text-base">
              Strategically located across industrial hubs in Delhi and Haryana to ensure uninterrupted high-volume production, dedicated mold tooling, and rapid nationwide dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MANUFACTURING_FACILITIES.map((facility) => (
              <div
                key={facility.id}
                className="bg-[#FAF6EE] border border-[#EAE1D3] p-6 sm:p-8 hover:border-[#0F1E36] hover:bg-white transition-all flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 bg-[#0F1E36] text-white">
                      {facility.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#C88214] bg-white px-2.5 py-1 border border-[#EAE1D3]">
                      {facility.state}
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-[#0F1E36] mb-2">
                    {facility.name}
                  </h3>

                  <div className="flex items-start text-xs text-[#5A5348] mb-4 font-mono">
                    <MapPin className="w-4 h-4 text-[#71695D] mr-2 shrink-0 mt-0.5" />
                    <span>{facility.address}</span>
                  </div>

                  <div className="bg-white border border-[#EAE1D3] p-3.5 text-xs text-[#0F1E36] mb-4 font-mono font-semibold">
                    {facility.facilityType}
                  </div>

                  <div className="space-y-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#71695D] block mb-1">
                      Key Technical Capabilities:
                    </span>
                    {facility.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-start text-xs text-[#5A5348]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C88214] mr-2 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EAE1D3] flex items-center justify-between text-xs text-[#71695D] font-mono">
                  <span>Capacity: Active Commercial Run</span>
                  <span className="text-[#0F1E36] font-bold">Pan-India Freight Ready</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. PROCUREMENT & ONBOARDING STEPS */}
      <section className="py-20 bg-[#FAF6EE] border-b border-[#EAE1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12 text-center mx-auto">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#C88214]">
              Simple Procurement Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0F1E36] tracking-tight mt-1">
              How We Work with Clients
            </h2>
            <p className="mt-3 text-[#5A5348] text-base">
              Streamlined onboarding from initial sample kit evaluation to bulk commercial production contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-[#EAE1D3] p-6 space-y-3 shadow-2xs">
              <div className="w-8 h-8 bg-[#0F1E36] text-white flex items-center justify-center font-mono font-bold text-xs">
                STEP 1
              </div>
              <h3 className="font-display font-bold text-base text-[#0F1E36]">Sample Kit Dispatch</h3>
              <p className="text-xs text-[#5A5348] leading-relaxed">
                Specify your product application (beverage, snacks, confectionery, honey) and receive pre-calibrated sample cans with matching lids within 24–48 hours.
              </p>
            </div>

            <div className="bg-white border border-[#EAE1D3] p-6 space-y-3 shadow-2xs">
              <div className="w-8 h-8 bg-[#C88214] text-white flex items-center justify-center font-mono font-bold text-xs">
                STEP 2
              </div>
              <h3 className="font-display font-bold text-base text-[#0F1E36]">Line Seaming Calibration</h3>
              <p className="text-xs text-[#5A5348] leading-relaxed">
                We provide seaming machine roller profiles, chuck specifications, and optional tabletop can seaming equipment for pilot batch testing.
              </p>
            </div>

            <div className="bg-white border border-[#EAE1D3] p-6 space-y-3 shadow-2xs">
              <div className="w-8 h-8 bg-[#0F1E36] text-white flex items-center justify-center font-mono font-bold text-xs">
                STEP 3
              </div>
              <h3 className="font-display font-bold text-base text-[#0F1E36]">Pilot Run & Lab COA</h3>
              <p className="text-xs text-[#5A5348] leading-relaxed">
                Initial pilot production lot molded and verified against shelf life, drop test, and leak integrity with Certificate of Analysis provided.
              </p>
            </div>

            <div className="bg-white border border-[#EAE1D3] p-6 space-y-3 shadow-2xs">
              <div className="w-8 h-8 bg-[#C88214] text-white flex items-center justify-center font-mono font-bold text-xs">
                STEP 4
              </div>
              <h3 className="font-display font-bold text-base text-[#0F1E36]">Commercial Scale Supply</h3>
              <p className="text-xs text-[#5A5348] leading-relaxed">
                Dedicated plant allocation, volume price tier activation, and automated weekly/monthly recurring deliveries directly to your bottling plants.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 8. INSTITUTIONAL CALL TO ACTION */}
      <section className="py-20 bg-[#0A1424] text-white border-t border-[#182C4D]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-[#C88214] text-white px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest shadow-sm">
            <span>Direct Inquiries</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
            Upgrade Your Product Packaging with PET Cans
          </h2>

          <p className="text-[#CBD5E1] text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Connect with our packaging engineering team for volume price matrices, custom mold consultations, or to request physical sample kits.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="about-quote-cta-btn"
              onClick={() => onOpenQuoteModal ? onOpenQuoteModal() : onNavigate('contact')}
              className="w-full sm:w-auto px-8 py-4 bg-[#C88214] hover:bg-white hover:text-[#0F1E36] text-white font-bold text-xs uppercase tracking-wider transition-all duration-150 inline-flex items-center justify-center gap-2 cursor-pointer border border-[#C88214]"
            >
              <span>Request Quote / Sample Kit</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="about-plant-visit-btn"
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer border border-white/40"
            >
              <span>Schedule Plant Visit (Delhi HQ)</span>
            </button>

            <button
              id="about-products-btn"
              onClick={() => onNavigate('products')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#0F1E36] hover:bg-[#FAF6EE] font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer border border-white"
            >
              <span>View Products</span>
            </button>
          </div>

          <div className="pt-6 text-xs text-[#98A7BC] font-mono">
            Manufacturing Units: Rama Road (HQ) • Panipat • Rai Industrial Estate
          </div>
        </div>
      </section>

    </div>
  );
};
