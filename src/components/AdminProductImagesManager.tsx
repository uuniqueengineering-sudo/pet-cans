import React, { useState } from 'react';
import { api } from '../services/api';
import { DEFAULT_SITE_IMAGES } from '../context/SiteImagesContext';
import {
  Upload,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
  Image as ImageIcon,
  Check,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export interface AdminProductImagesManagerProps {
  images: string[];
  onChange: (newImages: string[]) => void;
}

const PRESET_OPTIONS = [
  { label: 'Sleek Flat Can (330ml)', url: DEFAULT_SITE_IMAGES.beverageCans, category: 'Beverage' },
  { label: '500ml King Flat Can', url: DEFAULT_SITE_IMAGES.kingFlatCan, category: 'Beverage' },
  { label: 'Food-Grade Round Jar', url: DEFAULT_SITE_IMAGES.foodJars, category: 'Food' },
  { label: 'Can Seamer & Pull Tab', url: DEFAULT_SITE_IMAGES.singleCan, category: 'Equipment' },
  { label: 'Caps, Lids & Preforms', url: DEFAULT_SITE_IMAGES.jarCaps, category: 'Components' },
  { label: 'Cleanroom Plant View', url: DEFAULT_SITE_IMAGES.factory, category: 'Facility' },
  { label: 'Custom Mold Engineering', url: DEFAULT_SITE_IMAGES.customPackaging, category: 'Tooling' },
];

export const AdminProductImagesManager: React.FC<AdminProductImagesManagerProps> = ({
  images = [],
  onChange,
}) => {
  const [newUrlInput, setNewUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [showPresetPicker, setShowPresetPicker] = useState(false);

  // Helper to ensure at least default array
  const imageList = images && images.length > 0 ? images : [];

  const handleAddImage = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    onChange([...imageList, trimmed]);
    setNewUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    const updated = imageList.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMoveLeft = (index: number) => {
    if (index <= 0) return;
    const updated = [...imageList];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const handleMoveRight = (index: number) => {
    if (index >= imageList.length - 1) return;
    const updated = [...imageList];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = imageList[index];
    const remaining = imageList.filter((_, i) => i !== index);
    onChange([item, ...remaining]);
  };

  const handleUpdateSingleUrl = (index: number, newUrl: string) => {
    const updated = [...imageList];
    updated[index] = newUrl;
    onChange(updated);
  };

  // Upload handler for adding one or multiple images
  const uploadSingleFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const res = await api.uploadImage(base64, file.name);
          resolve(res.success && res.url ? res.url : base64);
        } catch {
          resolve(base64);
        }
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleMultipleFilesUpload = async (files: FileList | null, targetIndex?: number) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      if (targetIndex !== undefined && targetIndex !== null && targetIndex >= 0) {
        // Replacing a single angle
        const singleFile = files[0];
        const url = await uploadSingleFile(singleFile);
        if (url) {
          handleUpdateSingleUrl(targetIndex, url);
        }
      } else {
        // Adding one or multiple new angles
        const newUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const url = await uploadSingleFile(files[i]);
          if (url) newUrls.push(url);
        }
        if (newUrls.length > 0) {
          onChange([...imageList, ...newUrls]);
        }
      }
    } catch (err: any) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      setReplacingIndex(null);
    }
  };

  return (
    <div className="space-y-4 border border-[#E5E5E0] bg-[#FAFAF9] p-4">
      {/* Header with Counter and Add Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E5E0]">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#2D5A27]" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
              Multi-Angle Product Image Gallery ({imageList.length} {imageList.length === 1 ? 'Angle' : 'Angles'})
            </h4>
          </div>
          <p className="text-[11px] text-[#666660] mt-0.5">
            Add multiple perspective shots (e.g. Front View, Standing Base, Aluminum Pull-Tab, Bulk Pallet). The first image is the main catalog cover.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Upload Button */}
          <label className="px-3 py-1.5 bg-white hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] text-[#1A1A1A] text-[11px] font-mono font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs">
            <Upload className="w-3.5 h-3.5 text-[#2D5A27]" />
            <span>{isUploading ? 'Uploading...' : 'Upload Angle(s)'}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={isUploading}
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  handleMultipleFilesUpload(files);
                }
                e.target.value = '';
              }}
            />
          </label>

          {/* Presets Button */}
          <button
            type="button"
            onClick={() => setShowPresetPicker(!showPresetPicker)}
            className="px-2.5 py-1.5 bg-[#F5F5F4] hover:bg-[#E5E5E0] border border-[#E5E5E0] text-[11px] font-mono font-bold uppercase text-[#444440] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#C88214]" />
            <span>Presets</span>
          </button>
        </div>
      </div>

      {/* Preset Picker Dropdown */}
      {showPresetPicker && (
        <div className="p-3 bg-white border border-[#E5E5E0] space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#555550]">
            <span>Select Packaging Preset Photo:</span>
            <button
              type="button"
              onClick={() => setShowPresetPicker(false)}
              className="text-[#888880] hover:text-[#1A1A1A]"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_OPTIONS.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  handleAddImage(opt.url);
                  setShowPresetPicker(false);
                }}
                className="p-1.5 bg-[#FAF6EE] hover:bg-amber-100/60 border border-[#EAE1D3] text-left flex items-center gap-2 cursor-pointer transition-colors"
              >
                <img
                  src={opt.url}
                  alt={opt.label}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 object-cover border border-[#EAE1D3] bg-white shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[9px] font-mono font-bold text-[#2D5A27] uppercase">{opt.category}</div>
                  <div className="text-[10px] font-bold text-[#1A1A1A] truncate">{opt.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {imageList.length === 0 && (
        <div className="p-6 bg-white border border-dashed border-[#CCCCCC] text-center space-y-2">
          <ImageIcon className="w-8 h-8 text-[#999990] mx-auto" />
          <p className="text-xs text-[#555550]">No images added for this product yet.</p>
          <p className="text-[11px] text-[#888880]">Upload an image from your device or select from packaging presets.</p>
        </div>
      )}

      {/* Images List / Grid */}
      {imageList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {imageList.map((url, index) => {
            const isPrimary = index === 0;
            return (
              <div
                key={index}
                className={`bg-white border transition-all p-3 space-y-2.5 shadow-2xs relative ${
                  isPrimary ? 'border-[#2D5A27] ring-1 ring-[#2D5A27]' : 'border-[#E5E5E0]'
                }`}
              >
                {/* Badges Bar */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-[#F5F5F4] border border-[#E5E5E0] text-[9px] font-mono font-bold text-[#555550]">
                      Angle #{index + 1}
                    </span>
                    {isPrimary && (
                      <span className="px-1.5 py-0.5 bg-[#2D5A27] text-white text-[9px] font-mono font-bold uppercase flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-white" />
                        Main Cover
                      </span>
                    )}
                  </div>

                  {/* Move & Star Controls */}
                  <div className="flex items-center gap-0.5">
                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(index)}
                        title="Make Main Cover"
                        className="p-1 hover:bg-[#FAF6EE] text-[#C88214] transition-colors cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleMoveLeft(index)}
                      disabled={index === 0}
                      title="Move Left / Earlier"
                      className={`p-1 transition-colors ${
                        index === 0 ? 'text-[#CCCCCC] cursor-not-allowed' : 'text-[#555550] hover:bg-[#F5F5F4] cursor-pointer'
                      }`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveRight(index)}
                      disabled={index === imageList.length - 1}
                      title="Move Right / Later"
                      className={`p-1 transition-colors ${
                        index === imageList.length - 1
                          ? 'text-[#CCCCCC] cursor-not-allowed'
                          : 'text-[#555550] hover:bg-[#F5F5F4] cursor-pointer'
                      }`}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Thumbnail Display */}
                <div className="relative aspect-4/3 bg-[#FAF6EE] border border-[#EAE1D3] overflow-hidden group flex items-center justify-center p-2">
                  <img
                    src={url}
                    alt={`Product angle ${index + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_SITE_IMAGES.foodJars;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="px-2.5 py-1 bg-white text-[#1A1A1A] hover:bg-[#2D5A27] hover:text-white text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer">
                      <span>Replace</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            handleMultipleFilesUpload(files, index);
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* URL Edit & Delete Row */}
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleUpdateSingleUrl(index, e.target.value)}
                    placeholder="Image URL..."
                    className="w-full p-1.5 bg-[#F5F5F4] border border-[#E5E5E0] text-[10px] font-mono text-[#333330] outline-none focus:border-[#2D5A27]"
                  />

                  <div className="flex items-center justify-between gap-1 pt-1">
                    {/* Replace via upload shortcut */}
                    <label className="text-[9px] font-mono text-[#2D5A27] hover:underline font-bold uppercase cursor-pointer flex items-center gap-1">
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Replace File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            handleMultipleFilesUpload(files, index);
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      title="Delete Image Angle"
                      className="px-2 py-0.5 bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer border border-red-200"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add by Direct URL Input */}
      <div className="pt-2 border-t border-[#E5E5E0]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newUrlInput}
            onChange={(e) => setNewUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddImage(newUrlInput);
              }
            }}
            placeholder="Or paste image URL to add as new perspective..."
            className="flex-1 p-2 bg-white border border-[#E5E5E0] text-xs font-mono outline-none focus:border-[#2D5A27]"
          />
          <button
            type="button"
            onClick={() => handleAddImage(newUrlInput)}
            disabled={!newUrlInput.trim()}
            className={`px-3 py-2 text-xs font-mono font-bold uppercase flex items-center gap-1 transition-colors ${
              newUrlInput.trim()
                ? 'bg-[#1A1A1A] hover:bg-[#2D5A27] text-white cursor-pointer'
                : 'bg-[#E5E5E0] text-[#999990] cursor-not-allowed'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Angle</span>
          </button>
        </div>
      </div>
    </div>
  );
};
