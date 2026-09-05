import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteImagesConfig } from '../types';
import { api } from '../services/api';
import { IMAGES } from '../data/companyData';
import { safeStorage } from '../utils/storage';

export const DEFAULT_SITE_IMAGES: SiteImagesConfig = {
  hero: IMAGES.hero,
  foodJars: IMAGES.foodJars,
  beverageCans: IMAGES.beverageCans,
  kingFlatCan: IMAGES.kingFlatCan,
  factory: IMAGES.factory,
  customPackaging: IMAGES.customPackaging,
  singleCan: IMAGES.singleCan,
  jarCaps: IMAGES.jarCaps,
  honeyJar: IMAGES.jarCaps,
  spiceJar: IMAGES.foodJars,
};

interface SiteImagesContextValue {
  images: SiteImagesConfig;
  loading: boolean;
  refreshImages: () => Promise<void>;
  updateSiteImages: (newImages: Partial<SiteImagesConfig>) => Promise<void>;
}

const SiteImagesContext = createContext<SiteImagesContextValue>({
  images: DEFAULT_SITE_IMAGES,
  loading: false,
  refreshImages: async () => {},
  updateSiteImages: async () => {},
});

export const SiteImagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<SiteImagesConfig>(() => {
    try {
      const cached = safeStorage.getItem('petcans_site_images');
      if (cached) {
        return { ...DEFAULT_SITE_IMAGES, ...JSON.parse(cached) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SITE_IMAGES;
  });
  const [loading, setLoading] = useState(false);

  const refreshImages = async () => {
    try {
      setLoading(true);
      const data = await api.getSiteImages();
      if (data && typeof data === 'object') {
        const merged = { ...DEFAULT_SITE_IMAGES, ...data };
        setImages(merged);
        safeStorage.setItem('petcans_site_images', JSON.stringify(merged));
      }
    } catch (err) {
      console.warn('[SiteImages] Could not load live images from server, using local fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSiteImages = async (newImages: Partial<SiteImagesConfig>) => {
    const updated = await api.updateSiteImages(newImages);
    const merged = { ...DEFAULT_SITE_IMAGES, ...updated };
    setImages(merged);
    safeStorage.setItem('petcans_site_images', JSON.stringify(merged));
  };

  useEffect(() => {
    refreshImages();
  }, []);

  return (
    <SiteImagesContext.Provider value={{ images, loading, refreshImages, updateSiteImages }}>
      {children}
    </SiteImagesContext.Provider>
  );
};

export const useSiteImages = () => useContext(SiteImagesContext);
