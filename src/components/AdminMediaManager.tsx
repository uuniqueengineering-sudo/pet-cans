import React, { useState } from 'react';
import { SiteImagesConfig } from '../types';
import { DEFAULT_SITE_IMAGES } from '../context/SiteImagesContext';
import { api } from '../services/api';
import {
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Check,
  ExternalLink,
  Copy,
  Sparkles,
  Search,
  Filter,
  Eye,
  AlertCircle,
  Save,
  CheckCircle2,
} from 'lucide-react';

export interface AdminMediaManagerProps {
  currentImages: SiteImagesConfig;
  onSaveImages: (newImages: Partial<SiteImagesConfig>) => Promise<void>;
  isSaving: boolean;
}

interface ImageSlotDef {
  key: keyof SiteImagesConfig;
  title: string;
  category: 'banners' | 'beverage' | 'food' | 'plant';
  categoryLabel: string;
  description: string;
  location: string;
  aspect: string;
  defaultUrl: string;
}

export const SITE_SLOTS: ImageSlotDef[] = [
  {
    key: 'hero',
    title: 'Homepage Main Hero Banner',
    category: 'banners',
    categoryLabel: 'Homepage & Banners',
    description: 'Prominent header banner displaying flagship PET cans and food jars on the homepage hero section.',
    location: 'Homepage (Top Hero Section)',
    aspect: '4:3 or 16:10',
    defaultUrl: DEFAULT_SITE_IMAGES.hero,
  },
  {
    key: 'beverageCans',
    title: 'Flat-Base Sleek Beverage Cans',
    category: 'beverage',
    categoryLabel: 'Beverage Packaging',
    description: 'Ultra-clear plain flat-base cylindrical cans (250ml, 330ml, 350ml) for sparkling drinks, cold brew, and juices.',
    location: 'Homepage Product Highlights & Products',
    aspect: '1:1 or 4:3',
    defaultUrl: DEFAULT_SITE_IMAGES.beverageCans,
  },
  {
    key: 'kingFlatCan',
    title: '500ml King Size Can (Plain Flat Base)',
    category: 'beverage',
    categoryLabel: 'Beverage Packaging',
    description: '500ml King Size PET beverage can engineered with flat bottom and 202/200 EOE pop-tab pull ring.',
    location: 'Educational Section & Technical Showcase',
    aspect: '16:10 or 4:3',
    defaultUrl: DEFAULT_SITE_IMAGES.kingFlatCan,
  },
  {
    key: 'foodJars',
    title: 'Food-Grade Round PET Jars (1000ml / 750ml / 500ml)',
    category: 'food',
    categoryLabel: 'Food Jars & Closures',
    description: 'Crystal-clear wide-mouth containers for dry fruits, confectionery, protein powders, and spices.',
    location: 'Products & Food Packaging Section',
    aspect: '1:1 or 4:3',
    defaultUrl: DEFAULT_SITE_IMAGES.foodJars,
  },
  {
    key: 'singleCan',
    title: 'Semi-Automatic Can Seamer & EOE Pull Tab',
    category: 'beverage',
    categoryLabel: 'Beverage Packaging',
    description: 'Commercial tabletop seamer machine and airtight pull-tab aluminum closures for beverage canning.',
    location: 'Machinery & Equipment Category',
    aspect: '1:1 or 4:3',
    defaultUrl: DEFAULT_SITE_IMAGES.singleCan,
  },
  {
    key: 'jarCaps',
    title: 'Aluminium EOE, PP Caps & Preforms (No Tin Lids)',
    category: 'food',
    categoryLabel: 'Food Jars & Closures',
    description: 'Precision Food-Grade Aluminium Easy Open Ends (EOE pull tabs), PP plastic screw caps, and virgin resin preforms. Strictly zero tin lids.',
    location: 'Caps & Closures Category',
    aspect: '1:1 or 4:3',
    defaultUrl: DEFAULT_SITE_IMAGES.jarCaps,
  },
  {
    key: 'factory',
    title: 'Factory Facility & Manufacturing Cleanroom',
    category: 'plant',
    categoryLabel: 'Facility & Engineering',
    description: 'High-speed automated blow molding lines and cleanroom packaging plant in Delhi / Haryana.',
    location: 'About Us, Facility Locations & Infrastructure',
    aspect: '16:9 or 4:3',
    defaultUrl: DEFAULT_SITE_IMAGES.factory,
  },
  {
    key: 'customPackaging',
    title: 'Custom Mold & Shape Engineering Banner',
    category: 'plant',
    categoryLabel: 'Facility & Engineering',
    description: 'Bespoke container mold design, 3D CAD rapid prototyping, and custom tool engineering showcase.',
    location: 'Products Page Custom Mold Banner & About Us',
    aspect: '4:3 or 16:9',
    defaultUrl: DEFAULT_SITE_IMAGES.customPackaging,
  },
];

export const PRESET_GALLERY = [
  { name: 'Sleek Flat Beverage Cans', url: DEFAULT_SITE_IMAGES.beverageCans, type: 'Beverage' },
  { name: '500ml King Size Flat Can', url: DEFAULT_SITE_IMAGES.kingFlatCan, type: 'Beverage' },
  { name: 'Food Grade PET Jars 1000ml', url: DEFAULT_SITE_IMAGES.foodJars, type: 'Food' },
  { name: 'Can Seamer & Pull Tab', url: DEFAULT_SITE_IMAGES.singleCan, type: 'Equipment' },
  { name: 'PET Jar Caps & Preforms', url: DEFAULT_SITE_IMAGES.jarCaps, type: 'Components' },
  { name: 'Factory Facility & Cleanroom', url: DEFAULT_SITE_IMAGES.factory, type: 'Facility' },
  { name: 'Custom Mold Engineering', url: DEFAULT_SITE_IMAGES.customPackaging, type: 'Engineering' },
  { name: 'Hero PET Packaging Showcase', url: DEFAULT_SITE_IMAGES.hero, type: 'Hero Banner' },
];

export const AdminMediaManager: React.FC<AdminMediaManagerProps> = ({
  currentImages,
  onSaveImages,
  isSaving,
}) => {
  const [imagesState, setImagesState] = useState<SiteImagesConfig>(currentImages);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'banners' | 'beverage' | 'food' | 'plant'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [globalUploading, setGlobalUploading] = useState(false);
  const [presetModalSlot, setPresetModalSlot] = useState<keyof SiteImagesConfig | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState('');

  const handleUpdateSlot = (key: keyof SiteImagesConfig, url: string) => {
    setImagesState((prev) => ({ ...prev, [key]: url }));
    setHasUnsavedChanges(true);
  };

  const handleResetSlot = (key: keyof SiteImagesConfig) => {
    const defaultUrl = DEFAULT_SITE_IMAGES[key];
    if (defaultUrl) {
      handleUpdateSlot(key, defaultUrl);
      showToast(`Reset "${key}" to original default.`);
    }
  };

  const safeConfirm = (msg: string): boolean => {
    try {
      if (typeof window !== 'undefined' && window.confirm) {
        return window.confirm(msg);
      }
    } catch {
      // Ignored if sandboxed iframe blocks confirm
    }
    return true;
  };

  const handleResetAll = () => {
    if (safeConfirm('Reset ALL site images back to factory default photos?')) {
      setImagesState(DEFAULT_SITE_IMAGES);
      setHasUnsavedChanges(true);
      showToast('All image slots set to factory defaults. Click "Save & Publish" to apply.');
    }
  };

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(''), 4000);
  };

  const handleSave = async () => {
    try {
      await onSaveImages(imagesState);
      setHasUnsavedChanges(false);
      showToast('All website images successfully published live!');
    } catch (err: any) {
      showToast('Error saving site images: ' + (err.message || 'Unknown error'));
    }
  };

  // Upload file handler for a specific slot
  const handleUploadForSlot = async (key: keyof SiteImagesConfig, file: File) => {
    setUploadingKey(key as string);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await api.uploadImage(base64, file.name);
        if (res.success && res.url) {
          handleUpdateSlot(key, res.url);
          showToast(`Uploaded and assigned to "${key}"!`);
        } else {
          showToast('Upload failed: ' + (res.error || 'Server error'));
        }
        setUploadingKey(null);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      showToast('File read error: ' + err.message);
      setUploadingKey(null);
    }
  };

  // Global standalone file upload
  const handleGlobalUpload = async (file: File) => {
    setGlobalUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await api.uploadImage(base64, file.name);
        if (res.success && res.url) {
          showToast(`File uploaded successfully! URL: ${res.url}`);
          setCopiedUrl(res.url);
        } else {
          showToast('Upload failed: ' + (res.error || 'Server error'));
        }
        setGlobalUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      showToast('Upload error: ' + err.message);
      setGlobalUploading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // Filter slots
  const filteredSlots = SITE_SLOTS.filter((slot) => {
    const matchesCat = categoryFilter === 'all' || slot.category === categoryFilter;
    const matchesSearch =
      searchQuery === '' ||
      slot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="bg-[#2D5A27] text-white px-4 py-2.5 text-xs font-mono font-bold flex items-center justify-between border border-[#1E365E] shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{feedbackToast}</span>
          </div>
          <button onClick={() => setFeedbackToast('')} className="text-white/80 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Top Header & Save Action Bar */}
      <div className="bg-white border border-[#E5E5E0] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF6EE] border border-[#EAE1D3] text-[#C88214] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Dynamic Visual Content Manager</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
            Site Images & Media Gallery
          </h2>
          <p className="text-xs text-[#666660] mt-1 max-w-2xl">
            Upload new packaging photography, change homepage banners, replace product photos, or enter custom URLs. All changes take effect across the entire website instantly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetAll}
            className="px-3.5 py-2.5 bg-[#F5F5F4] hover:bg-[#E5E5E0] text-[#555550] hover:text-[#1A1A1A] text-xs font-mono font-bold uppercase tracking-wider transition-colors border border-[#E5E5E0] flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
              hasUnsavedChanges
                ? 'bg-[#2D5A27] hover:bg-[#1A1A1A] text-white border border-[#2D5A27] ring-2 ring-emerald-500/20'
                : 'bg-[#1A1A1A] hover:bg-[#2D5A27] text-white border border-[#1A1A1A]'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Publishing...' : hasUnsavedChanges ? 'Save & Publish Changes (*)' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Global Quick Upload Dropzone */}
      <div className="bg-[#FAF6EE] border border-[#EAE1D3] p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C88214]" />
              <h3 className="text-sm font-bold text-[#0F1E36]">Quick Upload Any Image File</h3>
            </div>
            <p className="text-xs text-[#5A5348]">
              Upload any high-res product photo, factory picture, or client spec sheet. Files are stored on the server and receive an immediate public link.
            </p>
          </div>

          <label className="px-4 py-2.5 bg-white hover:bg-[#0F1E36] hover:text-white text-[#0F1E36] border border-[#0F1E36] text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-2xs shrink-0">
            <Upload className="w-4 h-4" />
            <span>{globalUploading ? 'Uploading File...' : 'Browse Computer'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={globalUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleGlobalUpload(file);
              }}
            />
          </label>
        </div>

        {copiedUrl && (
          <div className="mt-3 p-2.5 bg-white border border-[#2D5A27] text-xs font-mono flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate text-[#2D5A27] font-bold">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Uploaded: {copiedUrl}</span>
            </div>
            <button
              onClick={() => handleCopy(copiedUrl)}
              className="px-2 py-1 bg-[#F5F5F4] hover:bg-[#E5E5E0] text-[10px] uppercase font-bold text-[#1A1A1A] shrink-0 flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              <span>Copy Link</span>
            </button>
          </div>
        )}
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white border border-[#E5E5E0] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `All Visuals (${SITE_SLOTS.length})` },
            { id: 'banners', label: 'Banners & Hero' },
            { id: 'beverage', label: 'Beverage Cans' },
            { id: 'food', label: 'Food Jars & Caps' },
            { id: 'plant', label: 'Facility & Engineering' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === tab.id
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-[#F5F5F4] text-[#555550] hover:bg-[#E5E5E0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#888880] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search slots or sections..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#F5F5F4] border border-[#E5E5E0] text-xs font-mono outline-none focus:border-[#2D5A27]"
          />
        </div>
      </div>

      {/* Image Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSlots.map((slot) => {
          const currentUrl = imagesState[slot.key] || slot.defaultUrl;
          const isCustom = currentUrl !== slot.defaultUrl;
          const isSlotUploading = uploadingKey === slot.key;

          return (
            <div
              key={slot.key}
              className={`bg-white border transition-all p-5 flex flex-col justify-between shadow-xs ${
                isCustom ? 'border-[#C88214]/60 bg-amber-50/10' : 'border-[#E5E5E0]'
              }`}
            >
              {/* Top metadata */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#F5F5F4] border border-[#E5E5E0] text-[#777770] text-[9px] font-mono font-bold uppercase">
                        {slot.categoryLabel}
                      </span>
                      {isCustom ? (
                        <span className="px-2 py-0.5 bg-[#C88214] text-white text-[9px] font-mono font-bold uppercase">
                          Custom Image
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[#2D5A27] text-white text-[9px] font-mono font-bold uppercase">
                          Factory Default
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-[#1A1A1A] mt-1.5">{slot.title}</h3>
                  </div>

                  <button
                    onClick={() => setPreviewModalUrl(currentUrl)}
                    title="View Full Size"
                    className="p-1.5 bg-[#F5F5F4] hover:bg-[#1A1A1A] hover:text-white text-[#555550] transition-colors cursor-pointer border border-[#E5E5E0]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-[#666660] mb-3 leading-relaxed">{slot.description}</p>

                <div className="text-[10px] font-mono text-[#888880] mb-4 space-y-0.5">
                  <div>📍 Location: <strong className="text-[#333330]">{slot.location}</strong></div>
                  <div>📐 Target Ratio: <strong className="text-[#333330]">{slot.aspect}</strong></div>
                </div>

                {/* Visual Preview Box */}
                <div className="relative border border-[#E5E5E0] bg-[#F5F5F4] overflow-hidden mb-4 group aspect-16/10">
                  <img
                    src={currentUrl}
                    alt={slot.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = slot.defaultUrl;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPreviewModalUrl(currentUrl)}
                      className="px-3 py-1.5 bg-white text-[#1A1A1A] text-xs font-mono font-bold uppercase cursor-pointer"
                    >
                      Fullscreen
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="space-y-3 pt-2 border-t border-[#F0F0EE]">
                {/* URL Input */}
                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-[#555550] mb-1">
                    Image Source Path / URL:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={currentUrl}
                      onChange={(e) => handleUpdateSlot(slot.key, e.target.value)}
                      placeholder="Enter image URL or upload below..."
                      className="flex-1 p-2 bg-[#F5F5F4] border border-[#E5E5E0] text-xs font-mono outline-none focus:border-[#2D5A27]"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(currentUrl)}
                      title="Copy URL"
                      className="p-2 bg-[#F5F5F4] hover:bg-[#E5E5E0] text-[#555550] border border-[#E5E5E0] cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* File Upload */}
                  <label className="flex-1 px-3 py-2 bg-white hover:bg-[#F5F5F4] border border-[#1A1A1A] text-[#1A1A1A] text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-[#2D5A27]" />
                    <span>{isSlotUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isSlotUploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadForSlot(slot.key, file);
                      }}
                    />
                  </label>

                  {/* Pick from Presets */}
                  <button
                    type="button"
                    onClick={() => setPresetModalSlot(slot.key)}
                    className="px-3 py-2 bg-[#F5F5F4] hover:bg-[#E5E5E0] border border-[#E5E5E0] text-[#444440] text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
                  >
                    Select Preset
                  </button>

                  {/* Reset Single */}
                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => handleResetSlot(slot.key)}
                      title="Reset to Factory Default"
                      className="p-2 bg-amber-100/60 hover:bg-amber-200 border border-amber-300 text-amber-900 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preset Selector Modal */}
      {presetModalSlot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full border border-[#E5E5E0] p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E0]">
              <div>
                <h3 className="text-base font-bold text-[#1A1A1A]">Select Packaging Photo Preset</h3>
                <p className="text-xs text-[#777770]">
                  Choose an authentic factory photography asset for <strong className="text-[#1A1A1A]">"{presetModalSlot}"</strong>
                </p>
              </div>
              <button
                onClick={() => setPresetModalSlot(null)}
                className="p-1 text-[#777770] hover:text-[#1A1A1A] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_GALLERY.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    handleUpdateSlot(presetModalSlot, preset.url);
                    setPresetModalSlot(null);
                    showToast(`Applied preset "${preset.name}" to slot!`);
                  }}
                  className="border border-[#E5E5E0] p-2 bg-[#F5F5F4] hover:border-[#2D5A27] hover:bg-white transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="aspect-4/3 bg-black/5 overflow-hidden mb-2">
                    <img
                      src={preset.url}
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <div className="text-[9px] font-mono text-[#2D5A27] font-bold uppercase">{preset.type}</div>
                    <div className="text-xs font-bold text-[#1A1A1A] line-clamp-1">{preset.name}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right pt-3 border-t border-[#E5E5E0]">
              <button
                onClick={() => setPresetModalSlot(null)}
                className="px-4 py-2 bg-[#F5F5F4] hover:bg-[#E5E5E0] text-xs font-mono font-bold uppercase cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {previewModalUrl && (
        <div
          onClick={() => setPreviewModalUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="max-w-4xl max-h-[90vh] bg-white p-2 relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewModalUrl}
              alt="Fullscreen Preview"
              referrerPolicy="no-referrer"
              className="max-h-[80vh] w-auto object-contain mx-auto"
            />
            <div className="p-3 bg-[#1A1A1A] text-white flex items-center justify-between text-xs font-mono">
              <span className="truncate">{previewModalUrl}</span>
              <button
                onClick={() => setPreviewModalUrl(null)}
                className="px-3 py-1 bg-white text-[#1A1A1A] font-bold uppercase cursor-pointer ml-3"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
