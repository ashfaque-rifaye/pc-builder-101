import type { LaptopCategory, AnyLaptopComponent, LaptopRAMComponent, LaptopStorageComponent, LaptopDisplayComponent, LaptopCPUComponent } from '../types';
import { buildAffiliateUrl } from './regions';

// ─── Laptop component data ────────────────────────────────────────────────────

export const LAPTOP_CATEGORY_LABELS: Record<LaptopCategory, string> = {
  'laptop-cpu': 'Processor',
  'laptop-ram': 'Memory (RAM)',
  'laptop-storage': 'Storage',
  'laptop-display': 'Display',
  'laptop-gpu': 'Graphics',
  'laptop-battery': 'Battery',
  'laptop-chassis': 'Chassis / Base Laptop',
};

export const LAPTOP_CATEGORY_ICONS: Record<LaptopCategory, string> = {
  'laptop-cpu': '⚡',
  'laptop-ram': '💾',
  'laptop-storage': '💿',
  'laptop-display': '📺',
  'laptop-gpu': '🎮',
  'laptop-battery': '🔋',
  'laptop-chassis': '💻',
};

/** Upgradeable categories (user can swap these in most laptops) */
export const UPGRADEABLE_LAPTOP_CATEGORIES: LaptopCategory[] = ['laptop-ram', 'laptop-storage'];
/** Usually soldered / not user-upgradeable */
export const SOLDERED_LAPTOP_CATEGORIES: LaptopCategory[] = ['laptop-cpu', 'laptop-gpu', 'laptop-battery'];

// ── Upgrade guide entries ─────────────────────────────────────────────────────
export interface UpgradeGuideEntry {
  category: LaptopCategory;
  title: string;
  upgradeable: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'not_recommended';
  note: string;
}

export const LAPTOP_UPGRADE_GUIDE: UpgradeGuideEntry[] = [
  {
    category: 'laptop-ram',
    title: 'RAM Upgrade',
    upgradeable: true,
    difficulty: 'easy',
    note: 'Most mid-range and business laptops have 1-2 SO-DIMM slots. Check your laptop model for supported speeds (DDR4/DDR5) and max capacity before buying.',
  },
  {
    category: 'laptop-storage',
    title: 'Storage Upgrade',
    upgradeable: true,
    difficulty: 'easy',
    note: 'Most laptops support M.2 NVMe SSD upgrades. Ensure you buy the right form factor (2280, 2242) and check if a second slot is available.',
  },
  {
    category: 'laptop-display',
    title: 'Display Replacement',
    upgradeable: true,
    difficulty: 'medium',
    note: 'Displays can be replaced, but require exact panel compatibility. Recommended for cracked screens or resolution upgrades on compatible models.',
  },
  {
    category: 'laptop-cpu',
    title: 'CPU Upgrade',
    upgradeable: false,
    difficulty: 'not_recommended',
    note: 'Most modern laptop CPUs (especially AMD Ryzen 6000+ and Intel 12th gen+) are soldered (BGA) to the motherboard. Upgrade requires full motherboard replacement.',
  },
  {
    category: 'laptop-gpu',
    title: 'GPU Upgrade',
    upgradeable: false,
    difficulty: 'not_recommended',
    note: 'Laptop GPUs are soldered directly to the motherboard in nearly all modern laptops. An eGPU via Thunderbolt 4 is the alternative for gaming performance boosts.',
  },
  {
    category: 'laptop-battery',
    title: 'Battery Replacement',
    upgradeable: true,
    difficulty: 'medium',
    note: 'Batteries can be replaced after 2-3 years of heavy use. Use OEM or high-quality third-party batteries. Some models require professional service.',
  },
];

// ── SO-DIMM RAM ───────────────────────────────────────────────────────────────
const laptopRam: LaptopRAMComponent[] = [
  {
    id: 'lram-001',
    name: 'Vengeance SO-DIMM 32GB',
    brand: 'Corsair',
    category: 'laptop-ram',
    price: 89,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=96&h=96&fit=crop',
    affiliateUrl: buildAffiliateUrl('Corsair Vengeance DDR5 SO-DIMM 32GB', 'US'),
    inStock: true,
    rating: 4.7,
    reviews: 892,
    tags: ['ddr5', 'sodimm', 'laptop'],
    specs: {
      capacity: '32GB (2×16GB)',
      speed: 'DDR5-5200',
      type: 'DDR5',
      formFactor: 'SO-DIMM',
      modules: '2',
      upgradeable: 'yes',
    },
  },
  {
    id: 'lram-002',
    name: 'Impact DDR5 64GB',
    brand: 'Kingston',
    category: 'laptop-ram',
    price: 159,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=96&h=96&fit=crop',
    affiliateUrl: buildAffiliateUrl('Kingston Impact DDR5 SO-DIMM 64GB', 'US'),
    inStock: true,
    rating: 4.8,
    reviews: 421,
    tags: ['ddr5', 'sodimm', 'high-capacity'],
    specs: {
      capacity: '64GB (2×32GB)',
      speed: 'DDR5-4800',
      type: 'DDR5',
      formFactor: 'SO-DIMM',
      modules: '2',
      upgradeable: 'yes',
    },
  },
  {
    id: 'lram-003',
    name: 'Fury Impact 32GB',
    brand: 'Kingston',
    category: 'laptop-ram',
    price: 65,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=96&h=96&fit=crop',
    affiliateUrl: buildAffiliateUrl('Kingston Fury Impact DDR4 SO-DIMM 32GB', 'US'),
    inStock: true,
    rating: 4.6,
    reviews: 1230,
    tags: ['ddr4', 'sodimm', 'best-value'],
    specs: {
      capacity: '32GB (2×16GB)',
      speed: 'DDR4-3200',
      type: 'DDR4',
      formFactor: 'SO-DIMM',
      modules: '2',
      upgradeable: 'yes',
    },
  },
  {
    id: 'lram-004',
    name: 'Crucial 16GB',
    brand: 'Crucial',
    category: 'laptop-ram',
    price: 35,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=96&h=96&fit=crop',
    affiliateUrl: buildAffiliateUrl('Crucial 16GB DDR4 SO-DIMM 3200MHz', 'US'),
    inStock: true,
    rating: 4.5,
    reviews: 3420,
    tags: ['ddr4', 'sodimm', 'budget'],
    availableIn: ['US', 'UK', 'EU', 'CA', 'AU', 'IN', 'GLOBAL'],
    specs: {
      capacity: '16GB',
      speed: 'DDR4-3200',
      type: 'DDR4',
      formFactor: 'SO-DIMM',
      modules: '1',
      upgradeable: 'yes',
    },
  },
];

// ── Laptop Storage ────────────────────────────────────────────────────────────
const laptopStorage: LaptopStorageComponent[] = [
  {
    id: 'lstor-001',
    name: 'SN850X 2TB M.2',
    brand: 'WD Black',
    category: 'laptop-storage',
    price: 149,
    image: 'https://images.unsplash.com/photo-1597953601374-1ff2d5640c85?w=96&h=96&fit=crop',
    affiliateUrl: buildAffiliateUrl('WD Black SN850X 2TB M.2 NVMe', 'US'),
    inStock: true,
    rating: 4.9,
    reviews: 2100,
    tags: ['nvme', 'm2', 'high-speed'],
    specs: {
      capacity: '2TB',
      type: 'NVMe SSD',
      interface: 'PCIe 4.0 x4',
      readSpeed: '7300 MB/s',
      writeSpeed: '6600 MB/s',
      formFactor: 'M.2 2280',
    },
  },
  {
    id: 'lstor-002',
    name: '990 Pro 1TB M.2',
    brand: 'Samsung',
    category: 'laptop-storage',
    price: 99,
    image: 'https://images.unsplash.com/photo-1597953601374-1ff2d5640c85?w=96&h=96&fit=crop',
    affiliateUrl: buildAffiliateUrl('Samsung 990 Pro 1TB M.2 NVMe', 'US'),
    inStock: true,
    rating: 4.8,
    reviews: 3650,
    tags: ['nvme', 'm2', 'samsung'],
    specs: {
      capacity: '1TB',
      type: 'NVMe SSD',
      interface: 'PCIe 4.0 x4',
      readSpeed: '7450 MB/s',
      writeSpeed: '6900 MB/s',
      formFactor: 'M.2 2280',
    },
  },
  {
    id: 'lstor-003',
    name: 'T500 500GB M.2',
    brand: 'Crucial',
    category: 'laptop-storage',
    price: 49,
    image: 'https://images.unsplash.com/photo-1597953601374-1ff2d5640c85?w=96&h=96&fit=crop',
    affiliateUrl: buildAffiliateUrl('Crucial T500 500GB M.2 NVMe', 'US'),
    inStock: true,
    rating: 4.5,
    reviews: 890,
    tags: ['nvme', 'm2', 'budget'],
    availableIn: ['US', 'UK', 'EU', 'CA', 'IN', 'AU', 'GLOBAL'],
    specs: {
      capacity: '500GB',
      type: 'NVMe SSD',
      interface: 'PCIe 4.0 x4',
      readSpeed: '7400 MB/s',
      writeSpeed: '5500 MB/s',
      formFactor: 'M.2 2280',
    },
  },
  {
    id: 'lstor-004',
    name: 'P3 2TB M.2 2242',
    brand: 'Crucial',
    category: 'laptop-storage',
    price: 89,
    image: 'https://images.unsplash.com/photo-1597953601374-1ff2d5640c85?w=96&h=96&fit=crop',
    affiliateUrl: buildAffiliateUrl('Crucial P3 2TB M.2 2242 NVMe', 'US'),
    inStock: true,
    rating: 4.3,
    reviews: 540,
    tags: ['nvme', 'm2-2242', 'compact'],
    specs: {
      capacity: '2TB',
      type: 'NVMe SSD',
      interface: 'PCIe 3.0 x4',
      readSpeed: '3500 MB/s',
      writeSpeed: '3000 MB/s',
      formFactor: 'M.2 2242',
    },
  },
];

// ── Laptop Display ────────────────────────────────────────────────────────────
const laptopDisplays: LaptopDisplayComponent[] = [
  {
    id: 'ldisp-001',
    name: 'FHD IPS 144Hz 15.6"',
    brand: 'BOE',
    category: 'laptop-display',
    price: 79,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=96&h=96&fit=crop',
    affiliateUrl: buildAffiliateUrl('15.6 inch FHD IPS 144Hz laptop screen replacement', 'US'),
    inStock: true,
    rating: 4.4,
    reviews: 620,
    tags: ['fhd', 'ips', '144hz', 'replacement'],
    specs: {
      size: '15.6"',
      resolution: '1920×1080 FHD',
      refreshRate: '144Hz',
      panel: 'IPS',
      brightness: '300 nits',
      upgradeable: 'yes (with matching connector)',
    },
  },
  {
    id: 'ldisp-002',
    name: 'QHD OLED 120Hz 14"',
    brand: 'Samsung',
    category: 'laptop-display',
    price: 299,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=96&h=96&fit=crop',
    affiliateUrl: buildAffiliateUrl('14 inch QHD OLED 120Hz laptop panel replacement', 'US'),
    inStock: true,
    rating: 4.9,
    reviews: 180,
    tags: ['qhd', 'oled', '120hz', 'premium'],
    specs: {
      size: '14"',
      resolution: '2560×1600 QHD+',
      refreshRate: '120Hz',
      panel: 'OLED',
      brightness: '600 nits (HDR)',
      upgradeable: 'yes (professional installation recommended)',
    },
  },
  {
    id: 'ldisp-003',
    name: '4K UHD IPS 60Hz 15.6"',
    brand: 'LG',
    category: 'laptop-display',
    price: 189,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=96&h=96&fit=crop',
    affiliateUrl: buildAffiliateUrl('15.6 inch 4K UHD IPS laptop display replacement', 'US'),
    inStock: true,
    rating: 4.6,
    reviews: 310,
    tags: ['4k', 'ips', 'content-creation'],
    specs: {
      size: '15.6"',
      resolution: '3840×2160 4K UHD',
      refreshRate: '60Hz',
      panel: 'IPS',
      brightness: '400 nits',
      upgradeable: 'yes (professional installation recommended)',
    },
  },
];

// ── Laptop CPUs (for reference / pre-built selection) ────────────────────────
const laptopCPUs: LaptopCPUComponent[] = [
  {
    id: 'lcpu-001',
    name: 'Ryzen 7 8845HS',
    brand: 'AMD',
    category: 'laptop-cpu',
    price: 0,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=96&h=96&fit=crop',
    affiliateUrl: buildAffiliateUrl('laptop with AMD Ryzen 7 8845HS', 'US'),
    inStock: true,
    rating: 4.8,
    reviews: 940,
    tags: ['amd', 'laptop-gaming', 'rdna3-igpu'],
    specs: {
      cores: '8',
      threads: '16',
      baseClock: '3.8 GHz',
      boostClock: '5.1 GHz',
      tdp: '45W (cTDP)',
      socket: 'FP8 (BGA — soldered)',
      architecture: 'Zen 4',
      upgradeable: 'no — soldered BGA',
    },
  },
  {
    id: 'lcpu-002',
    name: 'Core Ultra 7 165H',
    brand: 'Intel',
    category: 'laptop-cpu',
    price: 0,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=96&h=96&fit=crop',
    affiliateUrl: buildAffiliateUrl('laptop with Intel Core Ultra 7 165H', 'US'),
    inStock: true,
    rating: 4.7,
    reviews: 720,
    tags: ['intel', 'meteor-lake', 'ai-pc'],
    specs: {
      cores: '16 (6P+8E+2LPE)',
      threads: '22',
      baseClock: '1.4 GHz',
      boostClock: '5.0 GHz',
      tdp: '28W (PBP)',
      socket: 'FCBGA1744 (BGA — soldered)',
      architecture: 'Meteor Lake',
      upgradeable: 'no — soldered BGA',
    },
  },
  {
    id: 'lcpu-003',
    name: 'Ryzen AI 9 HX 370',
    brand: 'AMD',
    category: 'laptop-cpu',
    price: 0,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=96&h=96&fit=crop',
    affiliateUrl: buildAffiliateUrl('laptop with AMD Ryzen AI 9 HX 370', 'US'),
    inStock: true,
    rating: 4.9,
    reviews: 380,
    tags: ['amd', 'strix-halo', 'ai-npú', 'flagship'],
    specs: {
      cores: '12',
      threads: '24',
      baseClock: '2.0 GHz',
      boostClock: '5.1 GHz',
      tdp: '45W',
      socket: 'FP8 (BGA — soldered)',
      architecture: 'Zen 5',
      upgradeable: 'no — soldered BGA',
    },
  },
];

// ── All laptop components ─────────────────────────────────────────────────────
export const allLaptopComponents: Partial<Record<LaptopCategory, AnyLaptopComponent[]>> = {
  'laptop-ram': laptopRam,
  'laptop-storage': laptopStorage,
  'laptop-display': laptopDisplays,
  'laptop-cpu': laptopCPUs,
};

// ── Compatibility tips between laptop components ──────────────────────────────
export interface LaptopCompatTip {
  id: string;
  title: string;
  detail: string;
  applies_to: LaptopCategory[];
}

export const LAPTOP_COMPAT_TIPS: LaptopCompatTip[] = [
  {
    id: 'sodimm-check',
    title: 'Check SO-DIMM Slots',
    detail: 'Before buying RAM, verify your laptop model has user-accessible SO-DIMM slots. Ultra-thin laptops (e.g., MacBooks, Surface) use LPDDR RAM soldered to the board.',
    applies_to: ['laptop-ram'],
  },
  {
    id: 'm2-size',
    title: 'M.2 Form Factor Matters',
    detail: 'Most laptops use M.2 2280 (22mm × 80mm). Some compact models use 2242. Check your laptop specs before purchasing. Also verify the drive is NVMe/PCIe, not SATA-only.',
    applies_to: ['laptop-storage'],
  },
  {
    id: 'display-connector',
    title: 'Display Connector Compatibility',
    detail: 'Laptop displays use 30-pin or 40-pin eDP connectors. The exact model number of the panel matters for a successful replacement. Check iFixit guides for your specific laptop.',
    applies_to: ['laptop-display'],
  },
  {
    id: 'ddr-gen',
    title: 'DDR4 vs DDR5 SODIMM',
    detail: 'DDR4 and DDR5 SO-DIMMs are NOT interchangeable. Check your laptop\'s memory spec: AMD Ryzen 7000+ and Intel 12th gen+ platforms typically support DDR5, while older models use DDR4.',
    applies_to: ['laptop-ram'],
  },
  {
    id: 'egpu-tip',
    title: 'eGPU for Graphics Boost',
    detail: 'If you want better GPU performance, an eGPU dock via Thunderbolt 4 is the only viable option. Works with laptops that have Thunderbolt 4/USB4 ports.',
    applies_to: ['laptop-gpu'],
  },
];
