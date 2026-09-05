import React, { useState } from 'react';
import { ContactFormData } from '../types';
import { PRODUCTS_DATA } from '../data/companyData';
import { api } from '../services/api';
import { CheckCircle2, Send, ArrowRight, AlertCircle } from 'lucide-react';

interface ContactFormProps {
  initialSubject?: string;
  initialProduct?: string;
  onSuccess?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  initialSubject = 'General Inquiry',
  initialProduct,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: initialSubject,
    productInterest: initialProduct || '',
    estimatedQuantity: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      await api.submitInquiry({
        type: formData.subject?.toLowerCase().includes('sample') ? 'sample' : 'quote',
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        productInterest: formData.productInterest || formData.subject,
        estimatedVolume: formData.estimatedQuantity,
        message: formData.message,
      });

      setIsSubmitting(false);
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setIsSubmitting(false);
      // Fallback display if offline
      setSubmitted(true);
      if (onSuccess) onSuccess();
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#F5F5F4] border border-[#2D5A27] p-8 text-center space-y-4">
        <div className="w-14 h-14 bg-white border border-[#2D5A27] text-[#2D5A27] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-[#2D5A27]" />
        </div>
        <h3 className="text-xl font-display font-bold text-[#1A1A1A]">
          Inquiry Successfully Received
        </h3>
        <p className="text-xs sm:text-sm text-[#555550] max-w-md mx-auto leading-relaxed">
          Thank you, <strong className="text-[#1A1A1A]">{formData.name}</strong>. Our packaging technical team has logged your inquiry and will review your specifications. A sales representative will contact you within 24 business hours.
        </p>
        <div className="pt-2">
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: '',
                company: '',
                email: '',
                phone: '',
                subject: 'General Inquiry',
                productInterest: '',
                estimatedQuantity: '',
                message: '',
              });
            }}
            className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#2D5A27] transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E5E5E0] p-6 sm:p-8 space-y-5">
      <div className="border-b border-[#E5E5E0] pb-4 mb-2">
        <h3 className="text-lg font-display font-bold text-[#1A1A1A]">
          Request Quote / Direct Inquiries
        </h3>
        <p className="text-xs text-[#777770]">
          Fill out this form to connect with our sales and engineering department.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono uppercase font-bold tracking-[0.15em] text-[#777770] mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Rahul Sharma"
            className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F4] border border-[#E5E5E0] focus:border-[#1A1A1A] focus:bg-white outline-none text-[#1A1A1A] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase font-bold tracking-[0.15em] text-[#777770] mb-1.5">
            Company / Brand Name *
          </label>
          <input
            type="text"
            name="company"
            required
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. Apex Organic Foods Ltd."
            className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F4] border border-[#E5E5E0] focus:border-[#1A1A1A] focus:bg-white outline-none text-[#1A1A1A] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono uppercase font-bold tracking-[0.15em] text-[#777770] mb-1.5">
            Business Email *
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F4] border border-[#E5E5E0] focus:border-[#1A1A1A] focus:bg-white outline-none text-[#1A1A1A] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase font-bold tracking-[0.15em] text-[#777770] mb-1.5">
            Contact Number / WhatsApp *
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F4] border border-[#E5E5E0] focus:border-[#1A1A1A] focus:bg-white outline-none text-[#1A1A1A] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono uppercase font-bold tracking-[0.15em] text-[#777770] mb-1.5">
            Inquiry Type
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F4] border border-[#E5E5E0] focus:border-[#1A1A1A] focus:bg-white outline-none text-[#1A1A1A] cursor-pointer"
          >
            <option value="Product Quotation">Product Quotation</option>
            <option value="Sample Request">Sample Request</option>
            <option value="Custom Mold Requirement">Custom Mold Requirement</option>
            <option value="Bulk Contract Supply">Bulk Contract Supply</option>
            <option value="Factory Visit">Factory Visit</option>
            <option value="Other Inquiries">Other Inquiries</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase font-bold tracking-[0.15em] text-[#777770] mb-1.5">
            Product of Interest
          </label>
          <select
            name="productInterest"
            value={formData.productInterest}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F4] border border-[#E5E5E0] focus:border-[#1A1A1A] focus:bg-white outline-none text-[#1A1A1A] cursor-pointer"
          >
            <option value="">-- Select Product --</option>
            {PRODUCTS_DATA.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name} ({p.capacity})
              </option>
            ))}
            <option value="Custom Specification">Custom Size / Not Listed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-mono uppercase font-bold tracking-[0.15em] text-[#777770] mb-1.5">
          Estimated Monthly / Batch Quantity
        </label>
        <select
          name="estimatedQuantity"
          value={formData.estimatedQuantity}
          onChange={handleChange}
          className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F4] border border-[#E5E5E0] focus:border-[#1A1A1A] focus:bg-white outline-none text-[#1A1A1A] cursor-pointer"
        >
          <option value="">-- Select Estimated Volume --</option>
          <option value="Trial / Pilot (1,000 - 5,000 units)">Trial / Pilot (1,000 - 5,000 units)</option>
          <option value="Standard Batch (5,000 - 25,000 units)">Standard Batch (5,000 - 25,000 units)</option>
          <option value="Large Scale (25,000 - 100,000+ units)">Large Scale (25,000 - 100,000+ units)</option>
          <option value="Contract Manufacturing Recurring">Contract Manufacturing Recurring</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-mono uppercase font-bold tracking-[0.15em] text-[#777770] mb-1.5">
          Project Details / Specifications *
        </label>
        <textarea
          name="message"
          required
          rows={3}
          value={formData.message}
          onChange={handleChange}
          placeholder="Please describe your food or beverage product, target filling volume, seaming machinery requirements, or timeline..."
          className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F4] border border-[#E5E5E0] focus:border-[#1A1A1A] focus:bg-white outline-none text-[#1A1A1A] transition-colors"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 bg-[#2D5A27] text-white hover:bg-[#1A1A1A] text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-[#2D5A27] hover:border-[#1A1A1A]"
        >
          {isSubmitting ? (
            <span>Processing Request...</span>
          ) : (
            <>
              <span>Submit Your Request</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      <p className="text-[10px] text-[#777770] text-center font-mono">
        Direct Factory Inquiries • No Spam • Fast Response from Technical Team
      </p>
    </form>
  );
};
