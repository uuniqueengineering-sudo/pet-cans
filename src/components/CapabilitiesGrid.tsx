import React from 'react';
import { Factory, Sparkles, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageId } from '../types';

interface CapabilitiesGridProps {
  onNavigate: (page: PageId) => void;
}

export const CapabilitiesGrid: React.FC<CapabilitiesGridProps> = ({ onNavigate }) => {
  const capabilities = [
    {
      icon: Factory,
      title: 'End-to-end PET packaging manufacturing',
      description:
        'Full lifecycle production from raw polymer resin formulation and injection preform handling to automated stretch blow molding and high-precision neck seaming.',
      tag: 'Integrated Process',
    },
    {
      icon: Sparkles,
      title: 'Custom sizes, shapes, and branding options',
      description:
        'In-house engineering team providing custom container mold design, volume calibration, logo embossing, transparent tinting, and tailor-made closure systems.',
      tag: 'Custom Tooling',
    },
    {
      icon: Truck,
      title: 'Bulk and wholesale order fulfillment',
      description:
        'Scalable manufacturing lines across Delhi and Haryana geared for high-volume contract packing, reliable production schedules, and nationwide logistics dispatch.',
      tag: 'High Capacity',
    },
    {
      icon: CheckCircle2,
      title: 'Quality-tested, food-safe materials',
      description:
        'Every batch undergoes rigorous quality control including optical clarity inspection, wall-thickness uniformity checks, top-load pressure tests, and leakproof verification.',
      tag: '100% Food Grade',
    },
  ];

  return (
    <section id="what-we-do" className="py-20 bg-[#FAF6EE] border-b border-[#EAE1D3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#C88214] mb-2">
            Manufacturing Operations & Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0F1E36] tracking-tight">
            What We Do
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5A5348] leading-relaxed">
            At PET Cans, we design and manufacture high-quality PET packaging solutions for food, beverage, and consumer product brands. From concept to production, our team works closely with clients to deliver containers that are safe, cost-effective, and tailored to specific product needs — whether that's a snack jar, a beverage bottle, or a custom-shaped can.
          </p>
          <p className="mt-3 text-base text-[#5A5348] leading-relaxed">
            Our manufacturing facilities are equipped to handle both standard and custom orders at scale, backed by strict quality control at every stage of production.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white border border-[#EAE1D3] p-6 flex flex-col justify-between hover:border-[#0F1E36] transition-all duration-200 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#0F1E36] text-white flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#DF9B2D]" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#71695D] bg-[#FAF6EE] px-2 py-1 border border-[#EAE1D3]">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-display font-bold text-[#0F1E36] mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#5A5348] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EAE1D3] flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-[#0F1E36]">
                  <span>Verified Capability</span>
                  <span className="text-[#C88214]">0{index + 1}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Action bar */}
        <div className="mt-12 bg-[#0A1424] text-white border border-[#182C4D] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-display font-extrabold text-white">
              Need a Custom Volume or Specific Neck Specification?
            </h3>
            <p className="text-xs sm:text-sm text-[#CBD5E1] mt-1">
              Our engineering team works directly with food & beverage brand teams on technical drawings and pilot batches.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('products')}
              className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-transparent border border-white/40 text-white hover:bg-white hover:text-[#0F1E36] transition-colors cursor-pointer"
            >
              Explore Products
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#C88214] text-white hover:bg-white hover:text-[#0F1E36] transition-colors inline-flex items-center gap-1.5 cursor-pointer border border-[#C88214]"
            >
              <span>Consult Engineering Team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
