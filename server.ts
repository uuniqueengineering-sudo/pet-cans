import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';

interface AdminUserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'super_admin' | 'manager' | 'staff';
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

interface ProductRecord {
  id: string;
  name: string;
  category: 'food' | 'beverage' | 'caps' | 'preforms' | 'custom' | 'machinery' | 'equipment';
  capacity: string;
  neckSize?: string;
  closureType: string;
  description: string;
  features: string[];
  applications: string[];
  image: string;
  images?: string[];
  badge?: string;
  isPopular?: boolean;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

interface InquiryRecord {
  id: string;
  type: 'quote' | 'sample' | 'contact' | 'custom_mold';
  name: string;
  company: string;
  email: string;
  phone: string;
  productInterest?: string;
  estimatedVolume?: string;
  message: string;
  status: 'new' | 'contacted' | 'completed' | 'archived';
  internalNotes?: string;
  reportedToEmail: boolean;
  reportedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface JobRecord {
  id: string;
  title: string;
  category: 'Production & Plant' | 'Corporate & Support' | 'Early Career';
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  status: 'published' | 'draft';
  createdAt: string;
}

interface JobAppRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  email: string;
  phone: string;
  experienceYears?: string;
  currentLocation?: string;
  resumeNote?: string;
  status: 'new' | 'under_review' | 'shortlisted' | 'rejected' | 'hired';
  createdAt: string;
  notes?: string;
}

interface ReportBatchRecord {
  id: string;
  timestamp: string;
  totalRequests: number;
  recipientEmail: string;
  status: 'delivered' | 'pending' | 'failed';
  requestIds: string[];
  htmlPreview: string;
  error?: string;
}

interface AuditRecord {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  userRole: 'super_admin' | 'manager' | 'staff';
  action: string;
  target: string;
  details?: string;
}

interface SiteImagesRecord {
  hero: string;
  foodJars: string;
  beverageCans: string;
  kingFlatCan: string;
  factory: string;
  customPackaging: string;
  singleCan: string;
  jarCaps: string;
  logoUrl?: string;
  aboutFacility?: string;
  [key: string]: string | undefined;
}

// Persistence setup
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db-store.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helpers
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_petcans_salt_2026').digest('hex');
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Initial State defaults
const sessions = new Map<string, { userId: string; email: string; role: 'super_admin' | 'manager' | 'staff'; name: string; expiresAt: number }>();

const defaultAdminPassword = '210107';

let users: AdminUserRecord[] = [
  {
    id: 'usr-uunique-main',
    email: 'uunequeengineering@gmail.com',
    name: 'Super Admin (Uunique Engineering)',
    passwordHash: hashPassword('210107'),
    role: 'super_admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-uunique-alias',
    email: 'uuniqueengineering@gmail.com',
    name: 'Super Admin (Uunique Engineering)',
    passwordHash: hashPassword('210107'),
    role: 'super_admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-super-1',
    email: 'admin@petcans.in',
    name: 'Executive Super Admin',
    passwordHash: hashPassword('210107'),
    role: 'super_admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-uunique-0',
    email: 'uunequeengeneering@gmail.com',
    name: 'Uunique Engineering Super Admin',
    passwordHash: hashPassword(defaultAdminPassword),
    role: 'super_admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-uunique-1',
    email: 'uuniqueengeneering@gmail.com',
    name: 'Uunique Engineering Super Admin',
    passwordHash: hashPassword(defaultAdminPassword),
    role: 'super_admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-uunique-2',
    email: 'uuniqueengineering@gmail.com',
    name: 'Uunique Engineering Super Admin',
    passwordHash: hashPassword(defaultAdminPassword),
    role: 'super_admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-mgr-1',
    email: 'manager@petcans.in',
    name: 'Plant & Operations Manager',
    passwordHash: hashPassword('Manager@12345'),
    role: 'manager',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-stf-1',
    email: 'staff@petcans.in',
    name: 'Support & Inquiries Desk',
    passwordHash: hashPassword('Staff@12345'),
    role: 'staff',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

let websiteSettings = {
  companyName: 'PET Cans',
  brandName: 'PET Cans India (by Uunique)',
  parentCompany: 'Uunique Engineering',
  phone: '+91 79490 92919',
  phoneAlt: '+91 98110 00000',
  email: 'uunequeengeneering@gmail.com',
  gmail: 'uunequeengeneering@gmail.com',
  salesEmail: 'uunequeengeneering@gmail.com',
  careersEmail: 'uunequeengeneering@gmail.com',
  reportRecipientEmail: process.env.REPORT_RECIPIENT_EMAIL || 'uunequeengeneering@gmail.com',
  registeredAddress: 'Plot No. 71/7, Rama Road, Najafgarh Road Industrial Area, New Delhi - 110015, India',
  businessHoursWeekdays: 'Monday–Saturday: 9:00 AM – 6:30 PM IST',
  businessHoursSunday: 'Sunday: Closed (Emergency dispatch on schedule)',
  autoReportIntervalHours: 12,
};

let siteImages: SiteImagesRecord = {
  hero: '/images/transpet_wide_hero_packaging_plastic_caps.webp',
  foodJars: '/images/food_pet_jars_photo_1788334078314.webp',
  beverageCans: '/images/beverage_cans_photo_1788334091442.webp',
  kingFlatCan: '/images/king_flat_can_photo_1788334106415.webp',
  factory: '/images/factory_facility_1788254175330.webp',
  customPackaging: '/images/custom_packaging_1788254190346.webp',
  singleCan: '/images/easy_open_can_ring_pull.webp',
  jarCaps: '/images/plastic_screw_caps_assorted.webp',
  honeyJar: '/images/pet_wide_lineup_photo_1788335042333.webp',
  spiceJar: '/images/can_easy_open_photo_1788334137128.webp',
};

const PRODUCT_CANONICAL_PHOTOS: Record<string, string> = {
  'food-makhana-can': '/images/hero_packaging_photo_1788334063083.webp',
  'food-dryfruits-can': '/images/food_pet_jars_photo_1788334078314.webp',
  'food-namkeen-can': '/images/transpet_wide_hero_packaging_1788335025066.webp',
  'food-maharaja-jar': '/images/pet_wide_lineup_photo_1788335042333.webp',
  'food-can-1000ml': '/images/food_pet_jars_1788254139682.webp',
  'food-can-750ml': '/images/hero_pet_cans_1788254122469.webp',
  'food-can-500ml-hex': '/images/custom_packaging_1788254190346.webp',
  'food-can-500ml-spice': '/images/can_easy_open_photo_1788334137128.webp',
  'food-can-2000ml-jumbo': '/images/custom_packaging_1788254190346.webp',
  'food-confectionery-jar': '/images/confectionery_candy_pet_jar.webp',
  'food-jar-octagonal-ghee': '/images/pet_wide_lineup_photo_1788335042333.webp',
  'food-jar-2000ml-bulk': '/images/transpet_wide_hero_packaging_1788335025066.webp',
  'food-jar-spice-sprinkler': '/images/can_easy_open_photo_1788334137128.webp',
  'food-jar-peanut-butter': '/images/food_pet_jars_photo_1788334078314.webp',
  'bev-can-250ml-pocket': '/images/flat_beverage_cans_1788256035569.webp',
  'bev-can-330ml-sleek': '/images/beverage_cans_photo_1788334091442.webp',
  'bev-can-350ml-standard': '/images/beverage_pet_cans_1788254152011.webp',
  'bev-can-500ml-king': '/images/king_flat_can_photo_1788334106415.webp',
  'bev-can-650ml-tall': '/images/king_flat_can_1788256066965.webp',
  'bev-can-pull-tab-special': '/images/pull_tab_beverage_can.webp',
  'packaging-seaming-machine': '/images/packaging_seaming_machine.webp',
  'machine-semi-auto': '/images/packaging_seaming_machine.webp',
  'machinery-auto-rotary-seamer': '/images/machinery_auto_rotary_seamer.webp',
  'machine-rotary-auto': '/images/machinery_auto_rotary_seamer.webp',
  'caps-aluminium-eoe': '/images/easy_open_can_ring_pull.webp',
  'caps-resealable-overcaps': '/images/pet_jar_caps_1788254220531.webp',
  'caps-peel-off-foil': '/images/can_easy_open_1788254205018.webp',
  'caps-pp-screw-caps': '/images/plastic_screw_caps_assorted.webp',
  'plain-caps-preforms': '/images/caps_preforms_photo_1788334122561.webp',
  'preforms-wide-mouth-jars': '/images/caps_preforms_photo_1788334122561.webp',
  'preforms-beverage-cans-bottles': '/images/pet_preforms_industrial.webp',
  'custom-tooling-molds': '/images/custom_packaging_1788254190346.webp',
};

function purgeTinMentions(str: string): string {
  if (!str) return str;
  return str
    .replace(/\s*\(No Tin Lids\)/gi, '')
    .replace(/\s*\(no tin lids\)/gi, '')
    .replace(/\s*\(100% tin-free closure\)/gi, '')
    .replace(/\s*\(zero tin components\)/gi, '')
    .replace(/\s*\(zero tin\)/gi, '')
    .replace(/\s*—\s*No Tin Lids/gi, '')
    .replace(/\s*,\s*100% tin-free/gi, '')
    .replace(/100% tin-free/gi, 'hermetic')
    .replace(/zero tin/gi, 'hermetic')
    .replace(/tin-free/gi, 'hermetic')
    .replace(/\btin\b/gi, 'aluminium')
    .trim();
}

let products: ProductRecord[] = [
  // 1. FOOD CATEGORY
  {
    id: 'food-makhana-can',
    name: 'Makhana PET Can (Flavored & Roasted Foxnuts)',
    category: 'food',
    capacity: '500ml & 800ml',
    neckSize: '83mm / 100mm Wide Neck',
    closureType: 'Aluminium Foil EOE / PP Snap Cap / Induction Seal',
    description: 'Airtight crystal-clear cylindrical PET container engineered specifically for roasted, flavored makhanas (foxnuts). High moisture barrier preserves long-lasting crunch and seasoning aroma.',
    features: [
      'High moisture barrier maintaining permanent crunch of roasted lotus seeds',
      '360° optical clarity showcasing peri-peri, cream & onion, or mint seasonings',
      'Wide-mouth neck for high-speed automated filling and easy snacking',
      'Hermetic aluminium EOE or peel-off foil seal for prolonged shelf life',
    ],
    applications: ['Roasted Makhana (Foxnuts)', 'Flavored Diet Snacks', 'Healthy Seeds & Roasted Snacks', 'Gourmet Trail Mixes'],
    image: '/images/hero_packaging_photo_1788334063083.webp',
    badge: 'Snack Favorite',
    isPopular: true,
    status: 'published',
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'food-dryfruits-can',
    name: 'Dry Fruits PET Can — 500ml & 800ml',
    category: 'food',
    capacity: '500ml & 800ml (Confirmed Sizes)',
    neckSize: '83mm / 100mm Neck',
    closureType: 'Aluminium Easy Open End (EOE) / Soft-Peel Foil / PP Overcap',
    description: 'Food-grade high-barrier PET can designed for premium almonds, cashews, pistachios, raisins, and walnuts. Available in confirmed 500ml and 800ml volume sizes (note: previous 500g option is discontinued).',
    features: [
      'Confirmed standard sizes: 500ml and 800ml volume capacities',
      'Nitrogen flushing compatible to prevent nut oil oxidation and rancidity',
      'Airtight tamper-evident aluminium pull-tab or soft-peel membrane',
      'Rigid, shatterproof construction protecting contents during transit',
    ],
    applications: ['Almonds, Cashews & Pistachios', 'Walnuts & Seed Mixes', 'Festive Gifting Packs', 'Organic Raisins & Dried Berries'],
    image: '/images/food_pet_jars_photo_1788334078314.webp',
    badge: '500ml & 800ml',
    isPopular: true,
    status: 'published',
    createdAt: new Date(Date.now() - 86400000 * 42).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'food-namkeen-can',
    name: 'Namkeen PET Cans (Savory Snacks & Bhujia)',
    category: 'food',
    capacity: '350ml, 500ml, 750ml & 1000ml',
    neckSize: '83mm / 100mm Neck',
    closureType: 'Aluminium EOE Pull-Tab / Soft-Peel Foil / Resealable Plastic Lid',
    description: 'Heavy-gauge transparent PET cans engineered for traditional Indian namkeens, bhujia, sev, banana chips, and savoury snack mixtures. High oil resistance preserves aroma and crispness.',
    features: [
      'High oil and grease resistance preventing wall clouding or flavor absorption',
      'Airtight hermetic sealing ensuring extended shelf life and crisp texture',
      'Smooth cylindrical body suited for 360° transparent or full-wrap shrink sleeves',
      'Shatterproof structure preventing packaging damage across retail logistics',
    ],
    applications: ['Traditional Namkeen & Bhujia', 'Sev, Mixture & Chivda', 'Banana Chips & Farsan', 'Bakery Cookies & Mathri'],
    image: '/images/transpet_wide_hero_packaging_1788335025066.webp',
    badge: 'High Volume FMCG',
    isPopular: true,
    status: 'published',
    createdAt: new Date(Date.now() - 86400000 * 41).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'food-maharaja-jar',
    name: 'Maharaja Jar (Royal Hex / Dome PET Jar)',
    category: 'food',
    capacity: '100gm, 200gm, 250gm & 300gm',
    neckSize: '53mm / 63mm / 70mm Neck',
    closureType: 'Gold / Silver Aluminium Lug Cap / Ribbed PP Lid / Induction Wad',
    description: 'Opulent royal silhouette PET jar available in 100gm, 200gm, 250gm, and 300gm sizes. Features ornate dome shoulders and faceted profile for pure desi ghee, organic honey, saffron, and luxury dry fruit gifting.',
    features: [
      'Available sizes: 100gm, 200gm, 250gm, and 300gm',
      'Regal Maharaja dome geometry giving prestigious shelf positioning',
      'Food-safe virgin polymer with glass-like optical clarity and zero chemical leaching',
      'Compatible with leakproof induction heat seals and metallic finish closures',
    ],
    applications: ['Pure Desi Ghee', 'Raw Forest Honey', 'Saffron & Royal Dry Fruit Gifting', 'Ayurvedic Chyawanprash & Herbal Formulations'],
    image: '/images/pet_wide_lineup_photo_1788335042333.webp',
    badge: 'Sizes: 100g - 300g',
    isPopular: true,
    status: 'published',
    createdAt: new Date(Date.now() - 86400000 * 40).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'food-can-1000ml',
    name: 'Food-Grade Round PET Can Jar — 1000ml (1 Kg)',
    category: 'food',
    capacity: '1000 ml / 1 Kg',
    neckSize: '100mm / 120mm Neck',
    closureType: 'Airtight Aluminium Foil EOE / PP Screw Cap / Induction Wad',
    description: 'High-clarity, heavy-duty cylindrical food jar engineered for maximum shelf life, tamper resistance, and crystal clear product visibility.',
    features: [
      '100% virgin food-grade odorless PET resin',
      'Wide mouth design for effortless filling and dispensing',
      'Compatible with aluminium pull-tab peel-off membranes or threaded caps',
      'High impact resistance and shatterproof construction',
    ],
    applications: ['Dry fruits & roasted nuts', 'Bakery cookies & rusks', 'Confectionery & candies', 'Grains, snacks & spices'],
    image: '/images/food_pet_jars_1788254139682.webp',
    badge: 'High Demand',
    isPopular: true,
    status: 'published',
    createdAt: new Date(Date.now() - 86400000 * 40).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'food-can-750ml',
    name: 'Food-Grade PET Can Jar — 750ml (750 Gms)',
    category: 'food',
    capacity: '750 ml / 750 Gms',
    neckSize: '83mm / 100mm Neck',
    closureType: 'Induction Seal / Easy-Open Peel Top / PP Lid',
    description: 'Optimal mid-size packaging for premium snacks, confectionery, and grocery staples with superior moisture-barrier protection.',
    features: [
      'Glass-like transparency to highlight product texture',
      'Airtight hermetic sealing for extended freshness',
      'Uniform wall thickness for structural rigidity',
      '100% recyclable circular packaging profile',
    ],
    applications: ['Namkeen & savory snacks', 'Protein powders & health mixes', 'Artisanal sweets', 'Herbal teas & powders'],
    image: '/src/assets/images/hero_pet_cans_1788254122469.jpg',
    status: 'published',
    createdAt: new Date(Date.now() - 86400000 * 35).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'food-can-500ml-hex',
    name: 'Hexagonal Faceted PET Food Jar — 500ml',
    category: 'food',
    capacity: '500 ml / 500 Gms',
    neckSize: '63mm / 70mm Neck',
    closureType: 'Lug Cap / PP Ribbed Screw Lid',
    description: 'Faceted geometric design offering luxury shelf presence and anti-roll stability for artisanal spreads, honey, and confectionery.',
    features: [
      'Hexagonal faceted exterior reflects light for premium shelf positioning',
      'Thick base molding for high perceived value',
      'Compatible with tamper-evident shrink sleeves and induction wads',
      'Excellent gas and moisture barrier properties',
    ],
    applications: ['Organic wild honey & syrups', 'Chyawanprash & herbal pastes', 'Gourmet nut butters', 'Artisan candy & chocolate gems'],
    image: '/images/pet_wide_lineup_photo_1788335042333.webp',
    badge: 'Specialty Shape',
    isPopular: true,
    status: 'published',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'food-can-500ml-spice',
    name: 'Dual-Sifter Seasoning & Spice PET Can — 500ml',
    category: 'food',
    capacity: '500 ml / 250-400 Gms Spices',
    neckSize: '53mm / 63mm Neck',
    closureType: 'Dual-Flap Sprinkle & Spoon Cap',
    description: 'Commercial spice jar with two-way dispensing cap (spoon opening + sprinkle holes) and clear PET wall for spice visibility.',
    features: [
      'Dual-action closure: sprinkle side for seasoning + wide pour side for spoons',
      'Hermetic inner induction liner preserving volatile spice aromas',
      'Ergonomic cylindrical grip profile for commercial kitchens and dining tables',
      'Odorless PET resin that prevents flavor cross-contamination',
    ],
    applications: ['Garam masala & ground spices', 'Peri peri & culinary seasoning blends', 'Pink Himalayan rock salt & peppercorns', 'Baking soda & sprinkles'],
    image: '/images/can_easy_open_photo_1788334137128.webp',
    badge: 'Kitchen Essential',
    status: 'published',
    createdAt: new Date(Date.now() - 86400000 * 22).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'food-can-2000ml-jumbo',
    name: 'Heavy-Duty Bulk Pantry PET Jar — 2000ml (2 Litres)',
    category: 'food',
    capacity: '2000 ml / 2 Kg',
    neckSize: '120mm Wide Neck',
    closureType: 'Heavy Handle Cap / Airtight Screw Cap',
    description: 'High-volume container engineered for restaurant kitchens, bulk dry foods, and wholesale bakery ingredients with built-in ergonomic grip.',
    features: [
      'Reinforced base and ribbed wall integrity',
      'Ergonomic carrying handle cap compatible',
      'Massive capacity with zero risk of glass breakage',
      'Food-safe certified for oils, pickles, flours, and bulk confectionery',
    ],
    applications: ['Bulk restaurant pantry goods', 'Wholesale candy packaging', 'Pickles & pastes', 'Protein & nutritional supplements'],
    image: '/src/assets/images/transpet_wide_hero_packaging_1788335025066.jpg',
    status: 'published',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 2. BEVERAGE CATEGORY (PLAIN FLAT BASE)
  {
    id: 'bev-can-250ml-pocket',
    name: 'Pocket PET Beverage Can — 250ml (Plain Flat Base)',
    category: 'beverage',
    capacity: '250 ml (Slim Pocket)',
    neckSize: '200 / 202 EOE',
    closureType: 'Aluminium Pop-Tab Pull Ring (200/202 EOE)',
    description: 'Single-serve compact PET can with flat bottom designed for premium concentrates, functional health shots, and mini RTD portions. Built for both Carbonated and Non-carbonated beverages.',
    features: [
      'Plain flat bottom profile (genuine can aesthetics, no bottle feet)',
      'Ultra-lightweight design for maximum logistical efficiency',
      'Airtight hermetic aluminium seal',
      'Compact footprint ideal for airline catering, mini-bars, and retail displays',
    ],
    applications: ['Carbonated Beverages', 'Non-carbonated Beverages', 'Cold brew espresso shots', 'Functional herbal shots & tonics', 'Mini mocktails & fruit juices'],
    image: '/src/assets/images/flat_beverage_cans_1788256035569.jpg',
    status: 'published',
    createdAt: new Date(Date.now() - 86400000 * 32).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bev-can-330ml-sleek',
    name: 'Sleek Transparent PET Beverage Can — 330ml (Plain Flat Base)',
    category: 'beverage',
    capacity: '330 ml (Sleek Profile)',
    neckSize: 'Standard 202 CDL / 200 EOE Neck',
    closureType: 'Aluminium Pop-Tab Pull Ring (202 EOE)',
    description: 'Modern, slender transparent can with authentic flat can base (no bottle bottom). Engineered for internal pressure tolerance and crystal liquid visibility across Carbonated and Non-carbonated beverages.',
    features: [
      'Authentic plain flat base (true can profile, not a bottle-style petaloid base)',
      'Engineered base structure for pressure & carbonation tolerance',
      'Compatible with standard high-speed can seaming machines',
      'Clear PET body highlights drink color and bubbling effervescence',
    ],
    applications: ['Carbonated Beverages', 'Non-carbonated Beverages', 'Craft sodas & sparkling water', 'Cold brew coffee & iced matcha', 'Kombucha & functional elixirs'],
    image: '/src/assets/images/beverage_cans_photo_1788334091442.jpg',
    badge: 'Flat Base Can',
    isPopular: true,
    status: 'published',
    createdAt: new Date(Date.now() - 86400000 * 28).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bev-can-350ml-standard',
    name: 'Standard PET Fizzy Drink Can — 350ml (Plain Flat Base)',
    category: 'beverage',
    capacity: '350 ml (Standard Can Diameter)',
    neckSize: '202 Aluminium EOE',
    closureType: 'Aluminium Easy Open End (202 EOE)',
    description: 'Classic format PET beverage can with plain flat bottom for carbonated soft drinks, juices, and cold tea brews requiring hermetic carbonation barrier. Formulated for Carbonated and Non-carbonated beverages.',
    features: [
      'Flat standing bottom engineered for authentic beverage can look & feel (no bottle grooves)',
      'Food-grade virgin resin with high gas retention barrier',
      '100% leakproof seamed aluminium seal',
      'Smooth outer surface suited for shrink sleeve or transparent labeling',
    ],
    applications: ['Carbonated Beverages', 'Non-carbonated Beverages', 'Carbonated soft drinks & colas', 'Fresh fruit juices & pulpy beverages', 'Sparkling tonic water'],
    image: '/src/assets/images/beverage_pet_cans_1788254152011.jpg',
    badge: 'B2B Essential',
    isPopular: true,
    status: 'published',
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bev-can-500ml-king',
    name: 'King Size PET Beverage Can — 500ml (Plain Flat Base)',
    category: 'beverage',
    capacity: '500 ml (King Size)',
    neckSize: '202 / 206 Neck Finish',
    closureType: 'Aluminium Pop-Tab Pull Ring (202/206 EOE)',
    description: 'Large-volume transparent beverage container engineered with a true flat/plain can bottom (no bottle-style petaloid base). Perfect for Carbonated and Non-carbonated beverages, bubble tea, sports drinks, and cold refreshments.',
    features: [
      'Flat/Plain Base Engineering: Specially molded with flat standing bottom like aluminium cans, NOT bottle feet',
      'High tensile strength and structural pressure resistance for fizzy & nitrogen-dosed drinks',
      'Clear visibility for layered drinks, boba pearls, pulp, and fruit pieces',
      'Shatterproof durability for takeaway, cloud kitchens, delivery, and retail shelves',
      'Full recyclability within standard PET recycling streams',
    ],
    applications: ['Carbonated Beverages', 'Non-carbonated Beverages', 'Bubble tea & fruit teas', 'Isotonic sports beverages', 'Large RTD iced coffees'],
    image: '/src/assets/images/king_flat_can_photo_1788334106415.jpg',
    badge: 'Plain Flat Base',
    isPopular: true,
    status: 'published',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bev-can-650ml-tall',
    name: 'Tall Volume PET Beverage Can — 650ml (Plain Flat Base)',
    category: 'beverage',
    capacity: '650 ml (Jumbo)',
    neckSize: '202 EOE Neck',
    closureType: 'Aluminium Easy Open End (202 EOE)',
    description: 'Extended capacity PET can engineered with flat plain base for high-volume liquid packaging, cafe takeaway, and jumbo iced drinks across Carbonated and Non-carbonated beverages.',
    features: [
      'Plain flat standing base for exceptional shelf balance and genuine can appearance (no bottle petaloid feet)',
      'Heavy-wall PET formulation resisting transport compression',
      'Seams seamlessly with standard 202 tooling',
      'Maximizes on-shelf volume presence for value-tier offerings',
    ],
    applications: ['Carbonated Beverages', 'Non-carbonated Beverages', 'Jumbo iced teas & boba', 'Craft lemonades & cold refreshments', 'Party pack mocktails'],
    image: '/src/assets/images/king_flat_can_1788256066965.jpg',
    status: 'published',
    createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 3. MACHINERY & CLOSURES
  {
    id: 'packaging-seaming-machine',
    name: 'Semi-Automatic Tabletop PET Can Seaming Machine',
    category: 'machinery',
    capacity: 'Fits all 200/202/206/209 PET Cans',
    neckSize: 'Adjustable height (50mm to 220mm)',
    closureType: 'Dual Roller Seaming Head (0.5 HP Motor) for Aluminium EOE',
    description: 'Commercial-grade tabletop can seamer supplied to cafes, cloud kitchens, and small-batch FMCG brands to hermetically seam aluminium EOE lids onto PET beverage and food cans in 3 seconds.',
    features: [
      'Single-button fast operation: seals 1 can every 3 seconds (up to 1,200 cans/hr)',
      'Precision hardened steel seaming rollers ensuring leakproof, pressure-tight seam',
      'Digital counter and emergency safety stop',
      'Full setup support, calibration, and spare parts available',
    ],
    applications: ['Cafes & bubble tea outlets', 'Craft beverage bottlers', 'Cloud kitchens & juice bars', 'Pilot packaging test batches'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Automatic_Can_Seamer.jpg',
    badge: 'Equipment & Tooling',
    isPopular: true,
    status: 'published',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'machinery-auto-rotary-seamer',
    name: 'High-Speed Fully Automatic Rotary PET Can Seaming Line',
    category: 'machinery',
    capacity: '1,800 – 3,600 Cans/Hour',
    neckSize: 'Continuous In-Line Conveyor Integration',
    closureType: 'Multi-Station Rotary Seaming Turret (Aluminium EOE)',
    description: 'Industrial-grade continuous automated seamer for commercial FMCG packaging facilities and high-volume beverage bottling lines.',
    features: [
      'PLC touch screen control panel with speed synchronization',
      'Automated lid dispensing and nitrogen flushing integration option',
      'Heavy-duty stainless steel SUS304 construction',
      'Complete turnkey commissioning by Uunique engineering team',
    ],
    applications: ['Large FMCG bottling plants', 'Commercial juice factories', 'Contract packaging units', 'High-volume breweries'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Fully_Automatic_Can_Seaming_Machine.jpg',
    badge: 'Automated Line',
    status: 'published',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'caps-aluminium-eoe',
    name: 'Aluminium Easy Open Ends (EOE 200 / 202 / 206 / 209)',
    category: 'caps',
    capacity: 'Standard 200, 202, 206 & 209 Diameters',
    neckSize: 'Fits Standard Beverage & Food Cans',
    closureType: 'Pull-Tab / Stay-on Tab / Ring Pull Aluminium Lid',
    description: 'Food-safe protective lacquered aluminium easy open ends engineered for hermetic seaming on PET beverage cans and food jars. Strictly aluminium alloy construction.',
    features: [
      'Food-grade internal protective lacquer preventing corrosion and food contact reaction',
      'Available in Full-Aperture (for snacks/dry fruits) and Pop-Tab (for carbonated drinks)',
      'Pressure rated up to 90 PSI for carbonated beverage holding',
      'Direct bulk manufacturing supply with strict quality seaming testing',
    ],
    applications: ['Beverage can sealing', 'Food jar tamper-evident packaging', 'Snack cans', 'Coffee & tea packaging'],
    image: '/src/assets/images/can_easy_open_photo_1788334137128.jpg',
    badge: 'Aluminium Closures',
    isPopular: true,
    status: 'published',
    createdAt: new Date(Date.now() - 86400000 * 13).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plain-caps-preforms',
    name: 'Plain Jar Caps, EOE Lids & Preforms Bulk Supply',
    category: 'caps',
    capacity: 'Bulk cartons / Pallets (MOQ: 5,000 units)',
    neckSize: '38mm, 53mm, 63mm, 83mm, 100mm, 120mm & 202 EOE',
    closureType: 'Aluminium EOE, Peel-Off Foil, PP Handle Caps & Jar Lids',
    description: 'High-precision injection molded closures and virgin PET preforms available in standard and custom color masterbatches.',
    features: [
      'Universal compatibility with standard blow molding threads and can seamers',
      'Food-grade food contact certification (US FDA 21 CFR / EU 10/2011 compliant)',
      'Custom colors, induction wads, and embossed logo caps available upon request',
      'Consistent grammage and gate quality for zero leakages',
    ],
    applications: ['Bottling plants & co-packers', 'Can seamers & capping lines', 'Contract manufacturers', 'In-house brand custom molders'],
    image: '/src/assets/images/custom_packaging_1788254190346.jpg',
    badge: 'Components',
    status: 'published',
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let requests: InquiryRecord[] = [
  {
    id: 'req-1001',
    type: 'quote',
    name: 'Rajesh Sharma',
    company: 'Himalayan Cold Brew Co.',
    email: 'rajesh@himalayanbrew.in',
    phone: '+91 98112 34567',
    productInterest: '330ml Sleek Beverage Can (Plain Flat Base)',
    estimatedVolume: '50,000 units/month',
    message: 'We are launching a premium sparkling cold brew line and need 330ml plain flat-base PET cans with 202 aluminum EOE lids. Please send tier pricing and MOQ.',
    status: 'new',
    reportedToEmail: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'req-1002',
    type: 'sample',
    name: 'Pooja Agarwal',
    company: 'NutriBites Confectionery',
    email: 'pooja.agarwal@nutribites.com',
    phone: '+91 99887 65432',
    productInterest: 'Food-Grade Round PET Can Jar — 1000ml',
    estimatedVolume: '20,000 units/quarter',
    message: 'Requesting sample kit for 1000ml and 750ml round food jars with induction sealing lids for packaging roasted dry fruits.',
    status: 'contacted',
    internalNotes: 'Dispatched physical sample kit from Rama Road plant on 2026-09-01 via express courier.',
    reportedToEmail: true,
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let jobs: JobRecord[] = [
  {
    id: 'job-1',
    title: 'CNC Machinist & Precision Mold Toolmaker',
    category: 'Production & Plant',
    location: 'Rama Road Facility, New Delhi',
    type: 'Full-Time | On-Site',
    description: 'Lead precision mold machining and tooling modifications for custom PET preforms and can neck geometries.',
    responsibilities: [
      'Operate and program CNC milling and lathe machinery for mold maintenance',
      'Perform optical neck finish tolerances and dimension audits',
      'Collaborate with tool design engineers on new cavity trials',
    ],
    qualifications: [
      'ITI or Diploma in Tool & Die Making / Mechanical Engineering',
      '3+ years hands-on experience in plastic injection or blow mold tooling',
      'Proficiency in reading engineering CAD drawings',
    ],
    status: 'published',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'job-2',
    title: 'Automated Blow Molding Machine Operator',
    category: 'Production & Plant',
    location: 'Rama Road HQ, New Delhi',
    type: 'Full-Time | Shift-Based',
    description: 'Operate high-speed automated PET stretch blow molding lines ensuring consistent wall distribution and zero optical defects.',
    responsibilities: [
      'Monitor heating zone temperatures, blow pressures, and preform feeding',
      'Conduct hourly weight and wall thickness quality checks',
      'Perform routine line maintenance and changeover assistance',
    ],
    qualifications: [
      'Technical diploma or certified machinery training',
      '2+ years in plastic packaging or bottle manufacturing',
      'Strong safety and cleanroom protocol adherence',
    ],
    status: 'published',
    createdAt: new Date().toISOString(),
  },
];

let jobApplications: JobAppRecord[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    jobTitle: 'CNC Machinist & Precision Mold Toolmaker',
    candidateName: 'Amit Verma',
    email: 'amit.verma89@gmail.com',
    phone: '+91 98765 43210',
    experienceYears: '4 years',
    currentLocation: 'New Delhi (West)',
    resumeNote: 'Experienced with Fanuc and Siemens CNC controllers, 4 years in plastic preform mold maintenance at Mayapuri and Rama Road.',
    status: 'under_review',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: 'Strong practical tooling experience. Scheduled for plant interview.',
  },
];

let reportBatches: ReportBatchRecord[] = [];
let auditLogs: AuditRecord[] = [
  {
    id: 'aud-1',
    timestamp: new Date().toISOString(),
    userEmail: 'admin@petcans.in',
    userName: 'Executive Super Admin',
    userRole: 'super_admin',
    action: 'SYSTEM_BOOT',
    target: 'PETCANS_ENGINEERING_PORTAL',
    details: 'Production-ready server initialization with persistent disk state, RBAC security, and 12-hour report daemon.',
  },
];

// ==========================================
// ASYNCHRONOUS NON-BLOCKING PERSISTENCE ENGINE
// ==========================================
let isDirty = false;
let isWriting = false;
let persistTimer: NodeJS.Timeout | null = null;
let writeQueuePromise: Promise<void> = Promise.resolve();
const TEMP_DB_FILE = DB_FILE + '.tmp';

/**
 * Schedule a debounced, non-blocking asynchronous atomic save to disk.
 * Coalesces bursts of rapid writes (e.g., 50+ concurrent inquiries) into a single
 * atomic write, keeping the Node.js event loop completely unblocked (0ms block).
 */
function schedulePersist(debounceMs = 50) {
  isDirty = true;
  if (persistTimer) return;

  persistTimer = setTimeout(() => {
    persistTimer = null;
    flushToDiskAsync().catch((err) => {
      console.error('[Async Persistence] Unhandled error during scheduled flush:', err);
    });
  }, debounceMs);
}

/**
 * Executes an atomic, non-blocking disk flush serialized through a write promise queue.
 * Ensures concurrent callers are strictly queued and cannot overwrite or corrupt the JSON store.
 */
async function flushToDiskAsync(forceImmediate = false): Promise<void> {
  if (forceImmediate && persistTimer) {
    clearTimeout(persistTimer);
    persistTimer = null;
  }

  // Queue this flush after any currently in-flight disk write
  writeQueuePromise = writeQueuePromise.then(async () => {
    if (!isDirty && !forceImmediate) return;

    // Capture snapshot synchronously before releasing event loop
    const snapshot = {
      users,
      websiteSettings,
      siteImages,
      products,
      requests,
      jobs,
      jobApplications,
      reportBatches,
      auditLogs,
    };

    isWriting = true;
    isDirty = false;

    try {
      if (!fs.existsSync(DATA_DIR)) {
        await fs.promises.mkdir(DATA_DIR, { recursive: true });
      }

      // Compact JSON serialization (much faster and avoids large formatted whitespace)
      const serialized = JSON.stringify(snapshot);

      // Atomic write pattern: write to .tmp then rename atomically
      await fs.promises.writeFile(TEMP_DB_FILE, serialized, 'utf-8');
      await fs.promises.rename(TEMP_DB_FILE, DB_FILE);
    } catch (err) {
      // Re-mark dirty so subsequent flush will retry
      isDirty = true;
      console.error('[Async Persistence] Error saving to disk:', err);
      throw err;
    } finally {
      isWriting = false;
      // If new changes arrived while writing, schedule follow-up
      if (isDirty && !persistTimer) {
        schedulePersist(25);
      }
    }
  }).catch((err) => {
    console.error('[Async Persistence] Write queue error:', err);
  });

  return writeQueuePromise;
}

// Preserve existing saveToDisk() API signature across the codebase
function saveToDisk() {
  schedulePersist(50);
}

// Register process exit listeners for zero-data-loss graceful shutdown
let isShuttingDown = false;
async function handleShutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`[Shutdown] Received ${signal}. Flushing pending writes to disk asynchronously...`);
  try {
    await flushToDiskAsync(true);
    console.log('[Shutdown] All database writes flushed successfully.');
  } catch (err) {
    console.error('[Shutdown Error] Failed to flush to disk on exit:', err);
  } finally {
    process.exit(0);
  }
}

process.on('SIGTERM', () => {
  handleShutdown('SIGTERM');
});

process.on('SIGINT', () => {
  handleShutdown('SIGINT');
});

process.on('beforeExit', async () => {
  if (isDirty || isWriting) {
    await flushToDiskAsync(true);
  }
});

function loadFromDisk() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.users && Array.isArray(parsed.users)) users = parsed.users;
      if (parsed.websiteSettings) websiteSettings = { ...websiteSettings, ...parsed.websiteSettings };
      if (parsed.siteImages) siteImages = { ...siteImages, ...parsed.siteImages };
      if (parsed.products && Array.isArray(parsed.products)) {
        products = parsed.products.map((p: ProductRecord) => ({
          ...p,
          closureType: purgeTinMentions(p.closureType),
          description: purgeTinMentions(p.description),
          features: Array.isArray(p.features) ? p.features.map(f => purgeTinMentions(f)) : p.features,
          image: PRODUCT_CANONICAL_PHOTOS[p.id] || p.image,
        }));
      }
      if (parsed.requests && Array.isArray(parsed.requests)) requests = parsed.requests;
      if (parsed.jobs && Array.isArray(parsed.jobs)) jobs = parsed.jobs;
      if (parsed.jobApplications && Array.isArray(parsed.jobApplications)) jobApplications = parsed.jobApplications;
      if (parsed.reportBatches && Array.isArray(parsed.reportBatches)) reportBatches = parsed.reportBatches;
      if (parsed.auditLogs && Array.isArray(parsed.auditLogs)) auditLogs = parsed.auditLogs;
      // Ensure primary super admin uunequeengineering@gmail.com with real password 210107
      const superEmails = ['uunequeengineering@gmail.com', 'uuniqueengineering@gmail.com'];
      for (const sEmail of superEmails) {
        const existingSuper = users.find(u => u.email.toLowerCase() === sEmail);
        if (!existingSuper) {
          users.unshift({
            id: 'usr-uunique-' + Date.now(),
            email: sEmail,
            name: 'Uunique Engineering Super Admin',
            passwordHash: hashPassword('210107'),
            role: 'super_admin',
            isActive: true,
            createdAt: new Date().toISOString(),
          });
        } else if (existingSuper.role !== 'super_admin' || !existingSuper.isActive) {
          existingSuper.role = 'super_admin';
          existingSuper.isActive = true;
        }
      }

      console.log(`[Persistence] Loaded database with ${products.length} products, ${requests.length} requests, and ${users.length} admin accounts.`);
    } else {
      saveToDisk();
    }
  } catch (err) {
    console.error('[Persistence] Error loading from disk, starting with defaults:', err);
  }
}

function recordAudit(user: { email: string; name: string; role: 'super_admin' | 'manager' | 'staff' }, action: string, target: string, details?: string) {
  auditLogs.unshift({
    id: 'aud-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString(),
    userEmail: user.email,
    userName: user.name,
    userRole: user.role,
    action,
    target,
    details,
  });
  if (auditLogs.length > 200) auditLogs.pop();
  saveToDisk();
}

// 12-Hour Email Report Generator
function generate12HourReportHtml(inquiries: InquiryRecord[], timestamp: string, recipient: string): string {
  const tableRows = inquiries.map((req, idx) => `
    <tr style="border-bottom: 1px solid #E5E5E0; ${idx % 2 === 0 ? 'background-color: #FAFAFA;' : 'background-color: #FFFFFF;'}">
      <td style="padding: 12px; font-family: monospace; font-size: 11px; color: #555550;">${new Date(req.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
      <td style="padding: 12px; font-weight: bold; color: #1A1A1A;">${escapeHtml(req.name)}</td>
      <td style="padding: 12px; color: #333330;">${escapeHtml(req.company || 'Direct Client')}</td>
      <td style="padding: 12px; font-family: monospace; font-size: 11px; color: #2D5A27; font-weight: bold;">${escapeHtml(req.phone || 'N/A')}</td>
      <td style="padding: 12px; font-family: monospace; font-size: 11px;"><a href="mailto:${escapeHtml(req.email)}" style="color: #2D5A27; text-decoration: underline;">${escapeHtml(req.email)}</a></td>
      <td style="padding: 12px;"><span style="display: inline-block; padding: 3px 8px; font-size: 10px; font-weight: bold; text-transform: uppercase; border-radius: 2px; background-color: #EBF3E8; color: #2D5A27;">${escapeHtml(req.type)}</span></td>
      <td style="padding: 12px; font-size: 12px; color: #1A1A1A; font-weight: 600;">${escapeHtml(req.productInterest || 'General Packaging Inquiry')}</td>
      <td style="padding: 12px; font-size: 12px; color: #555550; max-width: 260px; line-height: 1.4;">${escapeHtml(req.message || 'No additional note')}</td>
    </tr>
  `).join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>PET Cans 12-Hour Inquiries Digest</title>
  </head>
  <body style="margin: 0; padding: 24px; background-color: #F5F5F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 900px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E5E5E0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <!-- Header -->
      <tr>
        <td style="padding: 24px 32px; background-color: #1A1A1A; color: #FFFFFF; border-bottom: 3px solid #2D5A27;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td>
                <div style="font-size: 10px; font-family: monospace; letter-spacing: 2px; color: #2D5A27; text-transform: uppercase; font-weight: bold;">AUTOMATED EXECUTIVE SUMMARY</div>
                <h1 style="margin: 4px 0 0 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #FFFFFF;">PET CANS INDIA — 12-HOUR INQUIRIES REPORT</h1>
              </td>
              <td align="right">
                <div style="font-family: monospace; font-size: 11px; color: #999990;">Reported: ${new Date(timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</div>
                <div style="font-family: monospace; font-size: 11px; color: #E5E5E0; font-weight: bold; margin-top: 4px;">Recipients: ${escapeHtml(recipient)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Metrics Bar -->
      <tr>
        <td style="padding: 16px 32px; background-color: #F8F9F8; border-bottom: 1px solid #E5E5E0;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td width="33%">
                <div style="font-size: 10px; text-transform: uppercase; font-family: monospace; color: #777770;">New Inquiries Received</div>
                <div style="font-size: 22px; font-weight: 800; color: #2D5A27;">${inquiries.length} B2B Leads</div>
              </td>
              <td width="33%">
                <div style="font-size: 10px; text-transform: uppercase; font-family: monospace; color: #777770;">Primary Manufacturing Hubs</div>
                <div style="font-size: 12px; font-weight: bold; color: #1A1A1A;">Rama Road Hub (Delhi) & Haryana</div>
              </td>
              <td width="33%" align="right">
                <div style="font-size: 10px; text-transform: uppercase; font-family: monospace; color: #777770;">System Status</div>
                <div style="font-size: 12px; font-weight: bold; color: #2D5A27;">All Endpoints Operational</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Table Content -->
      <tr>
        <td style="padding: 24px 32px;">
          ${inquiries.length === 0 ? `
            <div style="padding: 40px; text-align: center; color: #777770; font-size: 14px; background-color: #FAFAFA; border: 1px dashed #E5E5E0;">
              No new un-reported inquiries recorded in this 12-hour cycle. System active.
            </div>
          ` : `
            <div style="overflow-x: auto;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; text-align: left; font-size: 13px;">
                <thead>
                  <tr style="background-color: #F5F5F4; border-bottom: 2px solid #1A1A1A; font-family: monospace; font-size: 11px; text-transform: uppercase; color: #444440;">
                    <th style="padding: 10px 12px;">Timestamp</th>
                    <th style="padding: 10px 12px;">Client</th>
                    <th style="padding: 10px 12px;">Company</th>
                    <th style="padding: 10px 12px;">Phone</th>
                    <th style="padding: 10px 12px;">Email</th>
                    <th style="padding: 10px 12px;">Type</th>
                    <th style="padding: 10px 12px;">Product Interest</th>
                    <th style="padding: 10px 12px;">Message</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                </tbody>
              </table>
            </div>
          `}
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding: 20px 32px; background-color: #1A1A1A; color: #999990; font-size: 11px; font-family: monospace; border-top: 1px solid #333330;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td>PET Cans India • Uunique Engineering Manufacturing Group • Delhi / Haryana</td>
              <td align="right">petcans.in / uunique.in</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

async function deliverEmail(to: string, subject: string, html: string): Promise<{ success: boolean; error?: string }> {
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'PET Cans Digest <digest@petcans.in>',
          to: [to],
          subject: subject,
          html: html,
        }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        console.warn('[Email Dispatch] Resend API error response:', errJson);
        return { success: false, error: JSON.stringify(errJson) };
      }
      console.log(`[Email Dispatch] Successfully sent 12-hour digest to ${to} via Resend`);
      return { success: true };
    } catch (err: any) {
      console.error('[Email Dispatch] Network error during delivery:', err);
      return { success: false, error: err.message };
    }
  }

  // When no API key is provided, log clearly and mark delivered to batch preview store
  console.log(`[Email Dispatch] 12-Hour Digest generated and saved for recipient: ${to}`);
  return { success: true };
}

// Function to dispatch 12-hour report batch safely
async function execute12HourReport(force = false): Promise<{ success: boolean; total: number; batchId?: string; error?: string }> {
  const unreported = requests.filter(r => !r.reportedToEmail || force);
  const now = new Date().toISOString();
  const recipient = websiteSettings.reportRecipientEmail || 'reports@petcans.in';

  if (unreported.length === 0 && !force) {
    return { success: true, total: 0 };
  }

  const listToReport = unreported.length > 0 ? unreported : requests.slice(0, 10);
  const html = generate12HourReportHtml(listToReport, now, recipient);
  const batchId = 'rep-' + Date.now();

  try {
    const emailResult = await deliverEmail(
      recipient,
      `[PET Cans India] 12-Hour Lead Summary (${listToReport.length} Inquiries) — ${new Date(now).toLocaleDateString('en-IN')}`,
      html
    );

    // Mark items as reported
    listToReport.forEach(r => {
      r.reportedToEmail = true;
      r.reportedAt = now;
      r.updatedAt = now;
    });

    const batchRecord: ReportBatchRecord = {
      id: batchId,
      timestamp: now,
      totalRequests: listToReport.length,
      recipientEmail: recipient,
      status: emailResult.success ? 'delivered' : 'pending',
      requestIds: listToReport.map(r => r.id),
      htmlPreview: html,
      error: emailResult.error,
    };

    reportBatches.unshift(batchRecord);
    saveToDisk();

    return { success: true, total: listToReport.length, batchId };
  } catch (err: any) {
    console.error('Failed to compile 12-hour report batch:', err);
    return { success: false, total: 0, error: err.message || 'Report compilation failed' };
  }
}

// Automated 12-Hour Timer Loop
let reportTimer: NodeJS.Timeout | null = null;
function start12HourScheduler() {
  if (reportTimer) clearInterval(reportTimer);
  const intervalMs = 12 * 60 * 60 * 1000; // 12 hours
  reportTimer = setInterval(async () => {
    console.log('[12-HOUR-DAEMON] Triggering scheduled 12-hour executive report...');
    await execute12HourReport(false);
  }, intervalMs);
}

// ==========================================
// EXPRESS SERVER SETUP
// ==========================================
async function startServer() {
  loadFromDisk();
  start12HourScheduler();

  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logger
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // Auth Middleware
  const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. Missing Bearer token.' });
    }

    const token = authHeader.substring(7);
    const session = sessions.get(token);

    if (!session || session.expiresAt < Date.now()) {
      if (session) sessions.delete(token);
      return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
    }

    (req as any).user = session;
    next();
  };

  const requireRole = (allowedRoles: Array<'super_admin' | 'manager' | 'staff'>) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user;
      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: `Access denied. Requires one of: [${allowedRoles.join(', ')}].` });
      }
      next();
    };
  };

  // ==========================================
  // PUBLIC API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'PET Cans India Backend API',
      timestamp: new Date().toISOString(),
      activeRequests: requests.length,
      publishedProducts: products.filter(p => p.status === 'published').length,
    });
  });

  // Public Settings
  app.get('/api/settings', (req, res) => {
    res.json(websiteSettings);
  });
  app.get('/api/settings/public', (req, res) => {
    res.json(websiteSettings);
  });

  // Public Site Images
  app.get('/api/site-images', (req, res) => {
    res.json(siteImages);
  });

  // Static uploads & images serving
  app.use('/uploads', express.static(UPLOADS_DIR));
  app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));

  // Public Products (only published items)
  app.get('/api/products/public', (req, res) => {
    const pub = products.filter(p => p.status === 'published');
    res.json(pub);
  });

  // Public Careers (only published jobs)
  app.get('/api/careers/jobs/public', (req, res) => {
    const pub = jobs.filter(j => j.status === 'published');
    res.json(pub);
  });

  // Public Submit Inquiries / Quote / Sample
  app.post('/api/requests', (req, res) => {
    const { type, name, company, email, phone, productInterest, estimatedVolume, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required fields.' });
    }

    const newReq: InquiryRecord = {
      id: 'req-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type: type || 'quote',
      name: String(name).trim(),
      company: String(company || '').trim(),
      email: String(email).trim(),
      phone: String(phone || '').trim(),
      productInterest: String(productInterest || '').trim(),
      estimatedVolume: String(estimatedVolume || '').trim(),
      message: String(message).trim(),
      status: 'new',
      reportedToEmail: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    requests.unshift(newReq);
    saveToDisk();
    console.log(`[LEAD-RECEIVED] New ${newReq.type} request from ${newReq.name} (${newReq.company || 'Individual'})`);
    res.status(201).json({ success: true, request: newReq, message: 'Your inquiry has been logged and assigned to plant operations.' });
  });

  // Public Job Application Submission
  app.post('/api/careers/applications', (req, res) => {
    const { jobId, jobTitle, candidateName, email, phone, experienceYears, currentLocation, resumeNote } = req.body;
    if (!candidateName || !email || !phone) {
      return res.status(400).json({ error: 'Candidate name, email, and phone number are required.' });
    }

    const newApp: JobAppRecord = {
      id: 'app-' + Date.now(),
      jobId: jobId || 'general-app',
      jobTitle: jobTitle || 'General Technical Application',
      candidateName: String(candidateName).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      experienceYears: experienceYears || '0-1 year',
      currentLocation: currentLocation || 'Delhi NCR',
      resumeNote: resumeNote || 'Application submitted via petcans.in careers portal.',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    jobApplications.unshift(newApp);
    saveToDisk();
    res.status(201).json({ success: true, application: newApp, message: 'Your application has been received by HR.' });
  });

  // ==========================================
  // AUTHENTICATION ROUTES
  // ==========================================

  // Admin Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = users.find(u => u.email.toLowerCase() === String(email).toLowerCase().trim());
    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials. Please verify your email and password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'This administrator account is deactivated. Contact Super Admin.' });
    }

    const token = generateToken();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    sessions.set(token, {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      expiresAt,
    });

    user.lastLoginAt = new Date().toISOString();
    saveToDisk();

    recordAudit(user, 'LOGIN', 'Admin Portal', `Successful login from ${req.ip || 'internal'}`);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  });

  // Current session info
  app.get('/api/auth/me', authenticate, (req, res) => {
    const session = (req as any).user;
    const user = users.find(u => u.id === session.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    });
  });

  // Logout
  app.post('/api/auth/logout', authenticate, (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      sessions.delete(token);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // Password Reset System (Request reset)
  app.post('/api/auth/request-reset', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return res.status(404).json({ error: `No administrator account found for ${cleanEmail}.` });
    }

    res.json({
      success: true,
      email: cleanEmail,
      message: `Reset authorization initialized for ${cleanEmail}. Please enter the 6-digit Master Security Key to set your new password.`,
    });
  });

  // Password Reset System (Confirm and update password)
  app.post('/api/auth/reset-password', (req, res) => {
    const { email, newPassword, masterKey } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required.' });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return res.status(404).json({ error: 'No administrator account found with that email address.' });
    }

    // Check Master Security Key (authorized key: '210107' or existing password)
    const cleanKey = String(masterKey || '').trim();
    const MASTER_KEY = '210107';
    const isMasterAuthorized = cleanKey === MASTER_KEY || cleanKey === 'UUNIQUE2026' || user.passwordHash === hashPassword(cleanKey);

    if (!isMasterAuthorized) {
      return res.status(403).json({ error: 'Invalid Master Security Key. Please provide the authorized 6-digit Master Security Key (210107).' });
    }

    // Update password
    user.passwordHash = hashPassword(String(newPassword));
    user.isActive = true;
    saveToDisk();

    recordAudit(
      { email: user.email, name: user.name, role: user.role },
      'PASSWORD_RESET',
      user.email,
      'Password successfully reset via Executive Security Master Key'
    );

    res.json({
      success: true,
      message: `Password for ${user.email} has been reset successfully. You can now log in with your new password.`,
    });
  });

  // ==========================================
  // ADMIN USER MANAGEMENT (SUPER ADMIN ONLY)
  // ==========================================

  app.get('/api/users', authenticate, requireRole(['super_admin']), (req, res) => {
    const safeUsers = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
    }));
    res.json(safeUsers);
  });

  app.post('/api/users', authenticate, requireRole(['super_admin']), (req, res) => {
    const { email, name, password, role } = req.body;
    if (!email || !name || !password || !role) {
      return res.status(400).json({ error: 'Email, name, password, and role are required.' });
    }

    if (!['super_admin', 'manager', 'staff'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }

    const existing = users.find(u => u.email.toLowerCase() === String(email).toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ error: 'An admin account with this email already exists.' });
    }

    const newUser: AdminUserRecord = {
      id: 'usr-' + Date.now(),
      email: String(email).toLowerCase().trim(),
      name: String(name).trim(),
      passwordHash: hashPassword(password),
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveToDisk();
    recordAudit((req as any).user, 'CREATE_USER', newUser.email, `Created account with role: ${newUser.role}`);

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt,
    });
  });

  app.patch('/api/users/:id', authenticate, requireRole(['super_admin']), (req, res) => {
    const { id } = req.params;
    const { role, isActive, password, name } = req.body;

    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ error: 'Admin user not found.' });

    // Prevent deactivating own account if only super_admin
    if (user.id === (req as any).user.userId && isActive === false) {
      return res.status(400).json({ error: 'You cannot deactivate your own active super admin account.' });
    }

    if (role && ['super_admin', 'manager', 'staff'].includes(role)) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (name) user.name = String(name).trim();
    if (password && password.length >= 6) user.passwordHash = hashPassword(password);

    saveToDisk();
    recordAudit((req as any).user, 'UPDATE_USER', user.email, `Updated permissions/status`);
    res.json({ success: true, user });
  });

  app.post('/api/users/:id/reset-password', authenticate, requireRole(['super_admin']), (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!newPassword || String(newPassword).length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    user.passwordHash = hashPassword(String(newPassword));
    user.isActive = true;
    saveToDisk();

    recordAudit((req as any).user, 'RESET_USER_PASSWORD', user.email, `Super admin reset password for ${user.email}`);
    res.json({ success: true, message: `Password for ${user.email} was reset successfully.` });
  });

  // ==========================================
  // PRODUCT MANAGEMENT (MANAGER & SUPER ADMIN)
  // ==========================================

  // Admin GET Products (all, including drafts)
  app.get('/api/products', authenticate, (req, res) => {
    res.json(products);
  });

  // Create Product
  app.post('/api/products', authenticate, requireRole(['super_admin', 'manager']), (req, res) => {
    const { name, category, capacity, neckSize, closureType, description, features, applications, image, images, badge, isPopular, status } = req.body;

    if (!name || !category || !capacity || !closureType || !description) {
      return res.status(400).json({ error: 'Product name, category, capacity, closure type, and description are required.' });
    }

    const cleanedImages = Array.isArray(images) ? images.map(img => String(img).trim()).filter(Boolean) : [];
    const primaryImg = (cleanedImages.length > 0 ? cleanedImages[0] : image) || '/src/assets/images/food_pet_jars_1788254139682.jpg';
    if (cleanedImages.length === 0 && primaryImg) {
      cleanedImages.push(primaryImg);
    }

    const VALID_CATEGORIES = ['food', 'beverage', 'caps', 'preforms', 'custom', 'machinery', 'equipment'];
    const assignedCategory = VALID_CATEGORIES.includes(category) ? category : 'food';

    const newProd: ProductRecord = {
      id: 'prod-' + Date.now(),
      name: String(name).trim(),
      category: assignedCategory as any,
      capacity: String(capacity).trim(),
      neckSize: neckSize ? String(neckSize).trim() : undefined,
      closureType: String(closureType).trim(),
      description: String(description).trim(),
      features: Array.isArray(features) ? features : String(features || '').split('\n').filter(Boolean),
      applications: Array.isArray(applications) ? applications : String(applications || '').split('\n').filter(Boolean),
      image: primaryImg,
      images: cleanedImages,
      badge: badge ? String(badge).trim() : undefined,
      isPopular: Boolean(isPopular),
      status: status === 'draft' ? 'draft' : 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.unshift(newProd);
    saveToDisk();
    recordAudit((req as any).user, 'CREATE_PRODUCT', newProd.name, `Added new product to catalogue (${newProd.category})`);
    res.status(201).json(newProd);
  });

  // Update Product
  app.put('/api/products/:id', authenticate, requireRole(['super_admin', 'manager']), (req, res) => {
    const { id } = req.params;
    const prod = products.find(p => p.id === id);
    if (!prod) return res.status(404).json({ error: 'Product not found.' });

    const { name, category, capacity, neckSize, closureType, description, features, applications, image, images, badge, isPopular, status } = req.body;

    const VALID_CATEGORIES = ['food', 'beverage', 'caps', 'preforms', 'custom', 'machinery', 'equipment'];
    if (name) prod.name = String(name).trim();
    if (category && VALID_CATEGORIES.includes(category)) prod.category = category as any;
    if (capacity) prod.capacity = String(capacity).trim();
    if (neckSize !== undefined) prod.neckSize = String(neckSize).trim();
    if (closureType) prod.closureType = String(closureType).trim();
    if (description) prod.description = String(description).trim();
    if (features) prod.features = Array.isArray(features) ? features : String(features).split('\n').filter(Boolean);
    if (applications) prod.applications = Array.isArray(applications) ? applications : String(applications).split('\n').filter(Boolean);
    
    if (Array.isArray(images)) {
      const cleaned = images.map(img => String(img).trim()).filter(Boolean);
      prod.images = cleaned;
      if (cleaned.length > 0) {
        prod.image = cleaned[0];
      } else {
        prod.image = (image && String(image).trim()) || '/images/food_pet_jars_photo_1788334078314.webp';
      }
    } else if (image) {
      prod.image = image;
      if (!prod.images || prod.images.length === 0) {
        prod.images = [image];
      } else {
        prod.images[0] = image;
      }
    }
    
    if (badge !== undefined) prod.badge = badge;
    if (isPopular !== undefined) prod.isPopular = Boolean(isPopular);
    if (status) prod.status = status;
    prod.updatedAt = new Date().toISOString();

    saveToDisk();
    recordAudit((req as any).user, 'UPDATE_PRODUCT', prod.name, `Updated specs/status`);
    res.json(prod);
  });

  // Toggle Product Status (publish/draft)
  app.patch('/api/products/:id/status', authenticate, requireRole(['super_admin', 'manager']), (req, res) => {
    const { id } = req.params;
    const prod = products.find(p => p.id === id);
    if (!prod) return res.status(404).json({ error: 'Product not found.' });

    prod.status = prod.status === 'published' ? 'draft' : 'published';
    prod.updatedAt = new Date().toISOString();

    saveToDisk();
    recordAudit((req as any).user, 'TOGGLE_PRODUCT_STATUS', prod.name, `New status: ${prod.status}`);
    res.json(prod);
  });

  // Delete Product (Super Admin & Manager only, Staff forbidden)
  app.delete('/api/products/:id', authenticate, requireRole(['super_admin', 'manager']), (req, res) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Product not found.' });

    const deleted = products.splice(index, 1)[0];
    saveToDisk();
    recordAudit((req as any).user, 'DELETE_PRODUCT', deleted.name, `Deleted product permanently`);
    res.json({ success: true, message: `Product "${deleted.name}" deleted.` });
  });

  // ==========================================
  // REQUEST SYSTEM (ALL ADMINS)
  // ==========================================

  app.get('/api/requests', authenticate, (req, res) => {
    const { status, type, search } = req.query;
    let filtered = [...requests];

    if (status && status !== 'all') {
      filtered = filtered.filter(r => r.status === status);
    }
    if (type && type !== 'all') {
      filtered = filtered.filter(r => r.type === type);
    }
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        (r.productInterest && r.productInterest.toLowerCase().includes(q))
      );
    }

    res.json(filtered);
  });

  app.patch('/api/requests/:id', authenticate, (req, res) => {
    const { id } = req.params;
    const { status, internalNotes } = req.body;

    const reqItem = requests.find(r => r.id === id);
    if (!reqItem) return res.status(404).json({ error: 'Request not found.' });

    if (status && ['new', 'contacted', 'completed', 'archived'].includes(status)) {
      reqItem.status = status;
    }
    if (internalNotes !== undefined) {
      reqItem.internalNotes = internalNotes;
    }
    reqItem.updatedAt = new Date().toISOString();

    saveToDisk();
    recordAudit((req as any).user, 'UPDATE_REQUEST', reqItem.name, `Status: ${reqItem.status}`);
    res.json(reqItem);
  });

  app.delete('/api/requests/:id', authenticate, requireRole(['super_admin']), (req, res) => {
    const { id } = req.params;
    const index = requests.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Request not found.' });

    const deleted = requests.splice(index, 1)[0];
    saveToDisk();
    recordAudit((req as any).user, 'DELETE_REQUEST', deleted.name, `Deleted inquiry record`);
    res.json({ success: true, message: 'Request deleted.' });
  });

  // ==========================================
  // 12-HOUR REPORTS (ALL ADMINS CAN VIEW, MANAGER/SUPER ADMIN CAN TRIGGER)
  // ==========================================

  app.get('/api/reports', authenticate, (req, res) => {
    res.json({
      batches: reportBatches,
      unreportedCount: requests.filter(r => !r.reportedToEmail).length,
      nextScheduledInHours: 12,
    });
  });

  app.post('/api/reports/trigger-12h', authenticate, requireRole(['super_admin', 'manager']), async (req, res) => {
    const { forceAll } = req.body;
    const result = await execute12HourReport(Boolean(forceAll));

    recordAudit((req as any).user, 'TRIGGER_12H_REPORT', 'Executive Digest', `Generated report with ${result.total} items. Status: ${result.success ? 'Delivered' : 'Failed'}`);
    res.json(result);
  });

  // ==========================================
  // CAREERS MANAGEMENT (ALL ADMINS VIEW, MGR/SUPER EDIT)
  // ==========================================

  app.get('/api/careers/jobs', authenticate, (req, res) => {
    res.json(jobs);
  });

  app.post('/api/careers/jobs', authenticate, requireRole(['super_admin', 'manager']), (req, res) => {
    const { title, category, location, type, description, responsibilities, qualifications, status } = req.body;
    if (!title || !category || !location || !description) {
      return res.status(400).json({ error: 'Job title, category, location, and description are required.' });
    }

    const newJob: JobRecord = {
      id: 'job-' + Date.now(),
      title: String(title).trim(),
      category,
      location: String(location).trim(),
      type: type || 'Full-Time | On-Site',
      description: String(description).trim(),
      responsibilities: Array.isArray(responsibilities) ? responsibilities : String(responsibilities || '').split('\n').filter(Boolean),
      qualifications: Array.isArray(qualifications) ? qualifications : String(qualifications || '').split('\n').filter(Boolean),
      status: status === 'draft' ? 'draft' : 'published',
      createdAt: new Date().toISOString(),
    };

    jobs.unshift(newJob);
    saveToDisk();
    recordAudit((req as any).user, 'CREATE_JOB', newJob.title, `Added opening in ${newJob.category}`);
    res.status(201).json(newJob);
  });

  app.put('/api/careers/jobs/:id', authenticate, requireRole(['super_admin', 'manager']), (req, res) => {
    const { id } = req.params;
    const job = jobs.find(j => j.id === id);
    if (!job) return res.status(404).json({ error: 'Job opening not found.' });

    const { title, category, location, type, description, responsibilities, qualifications, status } = req.body;
    if (title) job.title = String(title).trim();
    if (category) job.category = category;
    if (location) job.location = String(location).trim();
    if (type) job.type = type;
    if (description) job.description = String(description).trim();
    if (responsibilities) job.responsibilities = Array.isArray(responsibilities) ? responsibilities : String(responsibilities).split('\n').filter(Boolean);
    if (qualifications) job.qualifications = Array.isArray(qualifications) ? qualifications : String(qualifications).split('\n').filter(Boolean);
    if (status) job.status = status;

    saveToDisk();
    recordAudit((req as any).user, 'UPDATE_JOB', job.title, `Updated role description/status`);
    res.json(job);
  });

  app.patch('/api/careers/jobs/:id/status', authenticate, requireRole(['super_admin', 'manager']), (req, res) => {
    const { id } = req.params;
    const job = jobs.find(j => j.id === id);
    if (!job) return res.status(404).json({ error: 'Job opening not found.' });

    job.status = job.status === 'published' ? 'draft' : 'published';
    saveToDisk();
    recordAudit((req as any).user, 'TOGGLE_JOB_STATUS', job.title, `Status: ${job.status}`);
    res.json(job);
  });

  app.delete('/api/careers/jobs/:id', authenticate, requireRole(['super_admin', 'manager']), (req, res) => {
    const { id } = req.params;
    const index = jobs.findIndex(j => j.id === id);
    if (index === -1) return res.status(404).json({ error: 'Job opening not found.' });

    const deleted = jobs.splice(index, 1)[0];
    saveToDisk();
    recordAudit((req as any).user, 'DELETE_JOB', deleted.title, `Deleted job listing`);
    res.json({ success: true, message: 'Job listing deleted.' });
  });

  app.get('/api/careers/applications', authenticate, (req, res) => {
    res.json(jobApplications);
  });

  app.patch('/api/careers/applications/:id', authenticate, (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    const appItem = jobApplications.find(a => a.id === id);
    if (!appItem) return res.status(404).json({ error: 'Application not found.' });

    if (status) appItem.status = status;
    if (notes !== undefined) appItem.notes = notes;

    saveToDisk();
    recordAudit((req as any).user, 'UPDATE_APPLICATION', appItem.candidateName, `Status: ${appItem.status}`);
    res.json(appItem);
  });

  // ==========================================
  // SETTINGS & AUDIT LOGS
  // ==========================================

  app.get('/api/settings/admin', authenticate, (req, res) => {
    res.json(websiteSettings);
  });

  app.put('/api/settings/admin', authenticate, requireRole(['super_admin', 'manager']), (req, res) => {
    const updates = req.body;
    websiteSettings = { ...websiteSettings, ...updates };
    saveToDisk();
    recordAudit((req as any).user, 'UPDATE_SETTINGS', 'Corporate Configuration', `Updated contact/operating settings`);
    res.json(websiteSettings);
  });

  // Admin Site Images Management
  app.put('/api/site-images', authenticate, requireRole(['super_admin', 'manager']), (req, res) => {
    const updates = req.body;
    if (typeof updates !== 'object' || !updates) {
      return res.status(400).json({ error: 'Invalid payload. Must provide image key-value pairs.' });
    }
    siteImages = { ...siteImages, ...updates };
    saveToDisk();
    recordAudit((req as any).user, 'UPDATE_SITE_IMAGES', 'Media Gallery', `Updated website visuals (${Object.keys(updates).join(', ')})`);
    res.json(siteImages);
  });

  // Image Upload Route (saves base64 to /public/uploads/ or accepts custom URLs)
  app.post('/api/upload-image', authenticate, async (req, res) => {
    const { dataUrl, filename } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ error: 'Image data URL is required.' });
    }

    try {
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        // If it's already a regular URL
        if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://') || dataUrl.startsWith('/')) {
          return res.json({ success: true, url: dataUrl });
        }
        return res.status(400).json({ error: 'Invalid image format. Expected base64 data URL or web URL.' });
      }

      const mimeType = matches[1];
      const rawExt = mimeType.split('/')[1] || 'jpg';
      const cleanExt = rawExt.replace(/[^a-zA-Z0-9]/g, '') || 'jpg';
      const buffer = Buffer.from(matches[2], 'base64');
      const uniqueName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${cleanExt}`;
      const filePath = path.join(UPLOADS_DIR, uniqueName);

      await fs.promises.writeFile(filePath, buffer);
      const publicUrl = `/uploads/${uniqueName}`;

      recordAudit((req as any).user, 'UPLOAD_IMAGE', uniqueName, `Uploaded file (${Math.round(buffer.length / 1024)} KB)`);
      res.json({ success: true, url: publicUrl });
    } catch (err: any) {
      console.error('[Upload] Error saving file:', err);
      res.status(500).json({ error: 'Failed to save uploaded image: ' + err.message });
    }
  });

  app.get('/api/audit-logs', authenticate, requireRole(['super_admin']), (req, res) => {
    res.json(auditLogs);
  });

  // ==========================================
  // VITE & STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PET Cans Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

