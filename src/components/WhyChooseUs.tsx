import React from 'react';
import { ShieldCheck, Recycle, Leaf, Award } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const cards = [
    {
      icon: ShieldCheck,
      number: '01',
      title: '100% Food Grade',
      description:
        'Every can we produce meets strict food-safety standards, ensuring what you package stays safe for consumers.',
      detail: 'Odorless, non-reactive polymer matrix certified for direct contact with wet, dry, acidic, and carbonated food and beverages.',
    },
    {
      icon: Recycle,
      number: '02',
      title: 'Fully Recyclable',
      description:
        'Our PET cans are 100% recyclable, supporting a circular packaging economy and reducing landfill waste.',
      detail: 'Standard Resin Identification Code #1 PET allows direct entry into established municipal and industrial recycling streams.',
    },
    {
      icon: Award,
      number: '03',
      title: 'Made with Recycled Plastic',
      description:
        'We incorporate recycled PET (rPET) into our manufacturing process, cutting down on virgin plastic use without compromising quality.',
      detail: 'State-of-the-art decontamination and polymer blending technologies allow food-contact-grade rPET integration on request.',
    },
    {
      icon: Leaf,
      number: '04',
      title: 'Good for the Environment',
      description:
        'From material sourcing to production, we’re committed to packaging solutions that reduce environmental impact at every step.',
      detail: 'Reduced melt temperatures during blow molding and lightweight product geometry minimize overall lifecycle carbon emissions.',
    },
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-white border-b border-[#EAE1D3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#C88214] mb-2">
            Quality Assurance & Responsibility
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0F1E36] tracking-tight">
            Why Choose PET Cans
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5A5348] leading-relaxed">
            We engineer food and beverage containers with an uncompromising focus on food safety, structural resilience, and material responsibility for modern packaging brands.
          </p>
        </div>

        {/* 4 Geometric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-[#FAF6EE] border border-[#EAE1D3] p-6 flex flex-col justify-between hover:border-[#0F1E36] hover:bg-white transition-all duration-200 group shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-white border border-[#EAE1D3] text-[#C88214] flex items-center justify-center group-hover:bg-[#0F1E36] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#71695D]">
                      {card.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-bold text-[#0F1E36] mb-3 group-hover:text-[#C88214] transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs font-medium text-[#0F1E36] leading-relaxed mb-4">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAE1D3]">
                  <p className="text-[11px] text-[#71695D] leading-relaxed">
                    {card.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Environmental compliance footnote */}
        <div className="mt-12 p-4 bg-[#FAF6EE] border border-[#EAE1D3] text-xs text-[#5A5348] flex items-center justify-between flex-wrap gap-3">
          <span className="flex items-center font-medium">
            <ShieldCheck className="w-4 h-4 text-[#C88214] mr-2 shrink-0" />
            Verified manufacturing compliance: 100% Food-Grade Resin • Non-Toxic • BPA-Free • Full EPR Stewardship
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#71695D]">
            PETCANS.IN Technical Standard #2026-IND
          </span>
        </div>

      </div>
    </section>
  );
};
