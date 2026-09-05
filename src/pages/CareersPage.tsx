import React, { useState } from 'react';
import { PageId } from '../types';
import { CAREER_ROLES_DATA, COMPANY_INFO } from '../data/companyData';
import {
  Briefcase,
  Users,
  GraduationCap,
  MapPin,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Building2,
  Package,
  PhoneCall,
  Clock
} from 'lucide-react';

interface CareersPageProps {
  onNavigate: (page: PageId) => void;
}

export const CareersPage: React.FC<CareersPageProps> = ({ onNavigate }) => {
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<'All' | 'Production & Plant' | 'Corporate & Support' | 'Early Career'>('All');
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);

  const filteredRoles = CAREER_ROLES_DATA.filter(
    (role) => selectedRoleCategory === 'All' || role.category === selectedRoleCategory
  );

  const toggleRoleExpand = (roleId: string) => {
    setExpandedRoleId(expandedRoleId === roleId ? null : roleId);
  };

  return (
    <div className="w-full">
      {/* 1. HERO */}
      <section className="bg-[#FAF6EE] border-b border-[#E3D8C8] py-16 lg:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#C88214] bg-white px-3 py-1.5 border border-[#E3D8C8] mb-4">
              <span>Careers • PET Cans</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-[#0F1E36] tracking-tighter leading-tight">
              Careers at PET Cans<span className="text-[#C88214]">.</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-[#5A5348] leading-relaxed font-normal">
              Learn about our workplace culture, precision engineering teams, and packaging manufacturing facilities.
            </p>

            {/* Prominent Recruitment Notice */}
            <div className="mt-8 p-4 sm:p-5 bg-amber-50 border-2 border-amber-300 flex items-start gap-3.5 shadow-xs">
              <AlertCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-mono font-bold uppercase tracking-wider">
                    Recruitment Notice
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-950">
                    We Are Not Currently Hiring
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                  All production, engineering, and administrative positions across our Delhi and Haryana facilities are currently fully staffed. We are not actively recruiting or accepting applications at this time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY WORK AT PET CANS? */}
      <section className="py-20 bg-white border-b border-[#E5E5E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#777770]">
              Workplace Culture
            </span>
            <h2 className="text-3xl font-display font-extrabold text-[#1A1A1A] tracking-tight mt-1">
              Workplace Culture & Manufacturing Excellence
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#555550] leading-relaxed">
              We are an established packaging manufacturing unit where great packaging starts with great people. Whether on our automated blow-molding production floor or in our corporate offices, our team values quality, safety, food-grade standards, and continuous technical refinement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FAF6EE] border border-[#E3D8C8] p-6 hover:border-[#0F1E36] transition-all">
              <div className="w-10 h-10 bg-white border border-[#E3D8C8] text-[#C88214] flex items-center justify-center font-bold mb-4 shadow-2xs">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-[#0F1E36] mb-2">
                Collaborative Environment
              </h3>
              <p className="text-xs text-[#5A5348] leading-relaxed">
                Work alongside experienced machine specialists, polymer engineers, and modern supply chain coordinators in a supportive, safety-first setting.
              </p>
            </div>

            <div className="bg-[#FAF6EE] border border-[#E3D8C8] p-6 hover:border-[#0F1E36] transition-all">
              <div className="w-10 h-10 bg-white border border-[#E3D8C8] text-[#C88214] flex items-center justify-center font-bold mb-4 shadow-2xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-[#0F1E36] mb-2">
                Hands-On Practical Training
              </h3>
              <p className="text-xs text-[#5A5348] leading-relaxed">
                Direct technical experience on automated blow molding machines, cleanroom packaging cells, optical QA tools, and modern ERP systems.
              </p>
            </div>

            <div className="bg-[#FAF6EE] border border-[#E3D8C8] p-6 hover:border-[#0F1E36] transition-all">
              <div className="w-10 h-10 bg-white border border-[#E3D8C8] text-[#C88214] flex items-center justify-center font-bold mb-4 shadow-2xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-[#0F1E36] mb-2">
                Clear Progression Paths
              </h3>
              <p className="text-xs text-[#5A5348] leading-relaxed">
                We foster longevity and pride of craft, with internal promotions based on diligence, technical mastery, and continuous improvement across our plants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DEPARTMENT FUNCTIONS & TEAMS */}
      <section className="py-20 bg-[#F5F5F4] border-b border-[#E5E5E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#C88214]">
                Department Overview
              </span>
              <span className="px-2 py-0.5 bg-stone-200 text-stone-700 text-[10px] font-mono font-bold uppercase">
                Positions Filled
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#1A1A1A] tracking-tight">
              Our Operational Divisions & Roles
            </h2>
            <p className="mt-3 text-base text-[#555550] leading-relaxed">
              Explore the functional teams and responsibilities that drive manufacturing at PET Cans. <strong className="text-[#1A1A1A]">Please note: We are not currently hiring for these positions.</strong> This overview is provided for organizational transparency.
            </p>
          </div>

          {/* Role Categories Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(['All', 'Production & Plant', 'Corporate & Support', 'Early Career'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedRoleCategory(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedRoleCategory === cat
                    ? 'bg-[#0F1E36] text-white'
                    : 'bg-white border border-[#E5E5E0] text-[#1A1A1A] hover:bg-[#FAF6EE]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Roles Listing Accordion */}
          <div className="space-y-4">
            {filteredRoles.map((role) => {
              const isExpanded = expandedRoleId === role.id;
              return (
                <div
                  key={role.id}
                  className="bg-white border border-[#E5E5E0] overflow-hidden hover:border-[#0F1E36] transition-all"
                >
                  <div
                    onClick={() => toggleRoleExpand(role.id)}
                    className="p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 bg-[#FAF6EE] text-[#0F1E36] border border-[#E3D8C8]">
                          {role.category}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#5A5348] bg-[#F5F5F4] px-2 py-0.5 border border-[#E5E5E0]">
                          {role.type}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-stone-600 bg-stone-100 px-2 py-0.5 border border-stone-200">
                          Closed • Not Hiring
                        </span>
                      </div>
                      <h3 className="text-lg font-display font-bold text-[#1A1A1A]">
                        {role.title}
                      </h3>
                      <div className="flex items-center text-xs text-[#777770] mt-1 font-mono">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-[#777770]" />
                        <span>{role.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0F1E36] hidden sm:inline font-mono">
                        {isExpanded ? 'Hide Details' : 'View Role Overview'}
                      </span>
                      <div className="w-8 h-8 bg-[#F5F5F4] border border-[#E5E5E0] flex items-center justify-center text-[#1A1A1A]">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-[#E5E5E0] text-xs sm:text-sm text-[#555550] space-y-4 animate-in fade-in duration-150">
                      <p className="leading-relaxed">
                        {role.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold tracking-[0.15em] text-[#777770] block mb-2">
                            Key Responsibilities:
                          </span>
                          <ul className="space-y-1.5 text-xs text-[#555550]">
                            {role.responsibilities.map((r, idx) => (
                              <li key={idx} className="flex items-start">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#C88214] mr-2 shrink-0 mt-0.5" />
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold tracking-[0.15em] text-[#777770] block mb-2">
                            Qualifications & Requirements:
                          </span>
                          <ul className="space-y-1.5 text-xs text-[#555550]">
                            {role.qualifications.map((q, idx) => (
                              <li key={idx} className="flex items-start">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#C88214] mr-2 shrink-0 mt-0.5" />
                                <span>{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Not Hiring Status Note */}
                      <div className="pt-4 border-t border-[#E5E5E0] flex items-center justify-between flex-wrap gap-3 bg-[#FAF6EE] p-3 border">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-stone-500" />
                          <span className="text-xs text-stone-700 font-mono">
                            Current Status: <strong>Positions Fully Staffed • Applications Closed</strong>
                          </span>
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                          Not Currently Hiring
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. GROWTH FOR EVERYONE, AT EVERY STAGE */}
      <section className="py-20 bg-white border-b border-[#E5E5E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0F1E36] text-white p-8 sm:p-12 border border-[#1A2E4E]">
            <div className="max-w-3xl space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#DF9B2D] font-bold">
                Workplace Values
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
                Our Workplace Standards
              </h2>
              <p className="text-base sm:text-lg text-[#CBD5E1] leading-relaxed font-normal">
                We believe great packaging operations require discipline, high safety compliance, cleanroom hygiene, and continuous learning. When recruitment cycles open, we value potential, diligence, and technical precision across all engineering, quality, and administrative functions.
              </p>
              <div className="pt-4 flex flex-wrap gap-3 text-xs font-mono text-[#CBD5E1]">
                <span className="px-3 py-1 bg-[#182B49] border border-[#233B63]">
                  • Structured Hands-On Mentorship
                </span>
                <span className="px-3 py-1 bg-[#182B49] border border-[#233B63]">
                  • Cleanroom Food-Grade Environments
                </span>
                <span className="px-3 py-1 bg-[#182B49] border border-[#233B63]">
                  • Equal Opportunity Employer
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CURRENT RECRUITMENT STATUS */}
      <section className="py-20 bg-[#FAF6EE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-14 h-14 bg-white border border-[#E3D8C8] text-[#C88214] flex items-center justify-center mx-auto shadow-xs">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-mono font-bold uppercase tracking-wider">
            Notice: Applications Temporarily Closed
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0F1E36] tracking-tight">
            We Are Not Currently Hiring
          </h2>

          <p className="text-base sm:text-lg text-[#5A5348] max-w-2xl mx-auto leading-relaxed">
            Thank you for your interest in joining the PET Cans team. At present, all positions across our corporate departments and Delhi/Haryana manufacturing plants are filled. We are not actively hiring or reviewing applications at this time.
          </p>

          <div className="bg-white border border-[#E3D8C8] p-6 max-w-md mx-auto text-left text-xs text-[#5A5348] font-mono space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E3D8C8] pb-2">
              <span className="uppercase text-[10px] text-[#71695D]">Status:</span>
              <span className="text-red-700 font-bold uppercase">No Open Vacancies</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#E3D8C8] pb-2">
              <span className="uppercase text-[10px] text-[#71695D]">Application Option:</span>
              <span className="text-[#0F1E36] font-bold">Closed / Removed</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="uppercase text-[10px] text-[#71695D]">Future Openings:</span>
              <span className="text-[#C88214] font-bold">Announced on petcans.in</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('products')}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#C88214] hover:bg-[#0F1E36] text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs border border-[#C88214]"
            >
              <Package className="w-4 h-4" />
              <span>Explore Products & Packaging</span>
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="w-full sm:w-auto px-7 py-3.5 bg-white border border-[#0F1E36] hover:bg-[#0F1E36] hover:text-white text-[#0F1E36] font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Building2 className="w-4 h-4" />
              <span>About Our Manufacturing Plants</span>
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-7 py-3.5 bg-white border border-[#E3D8C8] hover:bg-[#0F1E36] hover:text-white text-[#5A5348] font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contact Sales / General Inquiry</span>
            </button>
          </div>

          <p className="text-xs text-[#71695D] font-mono pt-2">
            For business inquiries, bulk packaging orders, or technical plant visits, please contact us at {COMPANY_INFO.email}
          </p>
        </div>
      </section>
    </div>
  );
};
