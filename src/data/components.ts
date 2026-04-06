import type {
  CPUComponent,
  GPUComponent,
  MotherboardComponent,
  RAMComponent,
  StorageComponent,
  PSUComponent,
  CaseComponent,
  CoolingComponent,
  PCComponent,
  AnyPCComponent,
  ComponentCategory,
  Build,
} from '../types';

// ─── CPUs ──────────────────────────────────────────────────────────────────────
export const cpus: CPUComponent[] = [
  {
    id: 'cpu-001',
    name: 'Ryzen 9 9950X',
    brand: 'AMD',
    category: 'cpu',
    price: 649,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    rating: 4.9,
    reviews: 1204,
    inStock: true,
    tags: ['flagship', 'workstation', 'streaming'],
    affiliateUrl: 'https://www.amazon.com/s?k=AMD+Ryzen+9+9950X',
    specs: {
      cores: '16',
      threads: '32',
      baseClock: '4.3 GHz',
      boostClock: '5.7 GHz',
      tdp: '170W',
      socket: 'AM5',
      architecture: 'Zen 5',
    },
  },
  {
    id: 'cpu-002',
    name: 'Ryzen 7 9700X',
    brand: 'AMD',
    category: 'cpu',
    price: 329,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    rating: 4.8,
    reviews: 3560,
    inStock: true,
    tags: ['gaming', 'best-value', 'mid-range'],
    affiliateUrl: 'https://www.amazon.com/s?k=AMD+Ryzen+7+9700X',
    specs: {
      cores: '8',
      threads: '16',
      baseClock: '3.8 GHz',
      boostClock: '5.5 GHz',
      tdp: '65W',
      socket: 'AM5',
      architecture: 'Zen 5',
    },
  },
  {
    id: 'cpu-003',
    name: 'Core Ultra 9 285K',
    brand: 'Intel',
    category: 'cpu',
    price: 589,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    rating: 4.7,
    reviews: 876,
    inStock: true,
    tags: ['flagship', 'gaming', 'intel'],
    affiliateUrl: 'https://www.amazon.com/s?k=Intel+Core+Ultra+9+285K',
    specs: {
      cores: '24',
      threads: '24',
      baseClock: '3.2 GHz',
      boostClock: '5.7 GHz',
      tdp: '125W',
      socket: 'LGA1851',
      architecture: 'Arrow Lake',
    },
  },
  {
    id: 'cpu-004',
    name: 'Core Ultra 5 245K',
    brand: 'Intel',
    category: 'cpu',
    price: 309,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    rating: 4.6,
    reviews: 1450,
    inStock: true,
    tags: ['gaming', 'mid-range', 'intel'],
    affiliateUrl: 'https://www.amazon.com/s?k=Intel+Core+Ultra+5+245K',
    specs: {
      cores: '14',
      threads: '14',
      baseClock: '3.6 GHz',
      boostClock: '5.2 GHz',
      tdp: '125W',
      socket: 'LGA1851',
      architecture: 'Arrow Lake',
    },
  },
  {
    id: 'cpu-005',
    name: 'Ryzen 5 8600G',
    brand: 'AMD',
    category: 'cpu',
    price: 179,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    rating: 4.5,
    reviews: 2890,
    inStock: true,
    tags: ['budget', 'integrated-gpu', 'office'],
    affiliateUrl: 'https://www.amazon.com/s?k=AMD+Ryzen+5+8600G',
    specs: {
      cores: '6',
      threads: '12',
      baseClock: '4.3 GHz',
      boostClock: '5.0 GHz',
      tdp: '65W',
      socket: 'AM5',
      architecture: 'Zen 4 + RDNA 3',
    },
  },
  {
    id: 'cpu-006',
    name: 'Threadripper PRO 7995WX',
    brand: 'AMD',
    category: 'cpu',
    price: 5499,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    rating: 5.0,
    reviews: 145,
    inStock: true,
    tags: ['workstation', 'professional', 'extreme'],
    affiliateUrl: 'https://www.amazon.com/s?k=AMD+Threadripper+PRO+7995WX',
    specs: {
      cores: '96',
      threads: '192',
      baseClock: '2.5 GHz',
      boostClock: '5.1 GHz',
      tdp: '350W',
      socket: 'sWRX9',
      architecture: 'Zen 4',
    },
  },
];

// ─── GPUs ──────────────────────────────────────────────────────────────────────
export const gpus: GPUComponent[] = [
  {
    id: 'gpu-001',
    name: 'GeForce RTX 5090',
    brand: 'NVIDIA',
    category: 'gpu',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
    rating: 5.0,
    reviews: 643,
    inStock: true,
    tags: ['flagship', '8k-gaming', 'ai'],
    affiliateUrl: 'https://www.amazon.com/s?k=NVIDIA+RTX+5090',
    specs: {
      vram: '32GB GDDR7',
      coreClock: '2.01 GHz',
      boostClock: '2.41 GHz',
      tdp: '575W',
      outputs: '3x DP 2.1, 1x HDMI 2.1',
      pciSlot: '336mm',
    },
  },
  {
    id: 'gpu-002',
    name: 'GeForce RTX 5080',
    brand: 'NVIDIA',
    category: 'gpu',
    price: 999,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
    rating: 4.9,
    reviews: 1233,
    inStock: true,
    tags: ['high-end', '4k-gaming', 'ray-tracing'],
    affiliateUrl: 'https://www.amazon.com/s?k=NVIDIA+RTX+5080',
    specs: {
      vram: '16GB GDDR7',
      coreClock: '2.30 GHz',
      boostClock: '2.62 GHz',
      tdp: '360W',
      outputs: '3x DP 2.1, 1x HDMI 2.1',
      pciSlot: '305mm',
    },
  },
  {
    id: 'gpu-003',
    name: 'GeForce RTX 4090',
    brand: 'NVIDIA',
    category: 'gpu',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
    rating: 4.9,
    reviews: 8765,
    inStock: true,
    tags: ['flagship', '4k-gaming', 'content-creation'],
    affiliateUrl: 'https://www.amazon.com/s?k=NVIDIA+RTX+4090',
    specs: {
      vram: '24GB GDDR6X',
      coreClock: '2.23 GHz',
      boostClock: '2.52 GHz',
      tdp: '450W',
      outputs: '3x DP 1.4a, 1x HDMI 2.1',
      pciSlot: '336mm',
    },
  },
  {
    id: 'gpu-004',
    name: 'Radeon RX 9070 XT',
    brand: 'AMD',
    category: 'gpu',
    price: 599,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
    rating: 4.8,
    reviews: 2109,
    inStock: true,
    tags: ['gaming', '4k-capable', 'best-value'],
    affiliateUrl: 'https://www.amazon.com/s?k=AMD+Radeon+RX+9070+XT',
    specs: {
      vram: '16GB GDDR6',
      coreClock: '2.21 GHz',
      boostClock: '2.97 GHz',
      tdp: '304W',
      outputs: '2x DP 2.1, 1x HDMI 2.1',
      pciSlot: '280mm',
    },
  },
  {
    id: 'gpu-005',
    name: 'GeForce RTX 4060 Ti',
    brand: 'NVIDIA',
    category: 'gpu',
    price: 399,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
    rating: 4.5,
    reviews: 4321,
    inStock: true,
    tags: ['mid-range', '1440p-gaming', 'dlss3'],
    affiliateUrl: 'https://www.amazon.com/s?k=NVIDIA+RTX+4060+Ti',
    specs: {
      vram: '16GB GDDR6',
      coreClock: '2.31 GHz',
      boostClock: '2.54 GHz',
      tdp: '165W',
      outputs: '3x DP 1.4a, 1x HDMI 2.1',
      pciSlot: '240mm',
    },
  },
  {
    id: 'gpu-006',
    name: 'Radeon RX 7600',
    brand: 'AMD',
    category: 'gpu',
    price: 269,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
    rating: 4.3,
    reviews: 3100,
    inStock: true,
    tags: ['budget', '1080p-gaming', 'fsr3'],
    affiliateUrl: 'https://www.amazon.com/s?k=AMD+Radeon+RX+7600',
    specs: {
      vram: '8GB GDDR6',
      coreClock: '1.72 GHz',
      boostClock: '2.62 GHz',
      tdp: '165W',
      outputs: '3x DP 2.1, 1x HDMI 2.1',
      pciSlot: '200mm',
    },
  },
];

// ─── Motherboards ───────────────────────────────────────────────────────────────
export const motherboards: MotherboardComponent[] = [
  {
    id: 'mb-001',
    name: 'ROG Crosshair X870E Hero',
    brand: 'ASUS',
    category: 'motherboard',
    price: 699,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    rating: 4.9,
    reviews: 432,
    inStock: true,
    tags: ['flagship', 'am5', 'overclocking'],
    affiliateUrl: 'https://www.amazon.com/s?k=ASUS+ROG+Crosshair+X870E+Hero',
    specs: {
      socket: 'AM5',
      formFactor: 'ATX',
      chipset: 'X870E',
      memorySlots: '4',
      maxMemory: '256GB DDR5',
      m2Slots: '5',
    },
  },
  {
    id: 'mb-002',
    name: 'MPG B650 Carbon WiFi',
    brand: 'MSI',
    category: 'motherboard',
    price: 269,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    rating: 4.7,
    reviews: 1890,
    inStock: true,
    tags: ['gaming', 'am5', 'wifi6e'],
    affiliateUrl: 'https://www.amazon.com/s?k=MSI+MPG+B650+Carbon+WiFi',
    specs: {
      socket: 'AM5',
      formFactor: 'ATX',
      chipset: 'B650',
      memorySlots: '4',
      maxMemory: '192GB DDR5',
      m2Slots: '3',
    },
  },
  {
    id: 'mb-003',
    name: 'ROG Maximus Z890 Apex',
    brand: 'ASUS',
    category: 'motherboard',
    price: 899,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    rating: 4.9,
    reviews: 234,
    inStock: true,
    tags: ['flagship', 'lga1851', 'overclocking'],
    affiliateUrl: 'https://www.amazon.com/s?k=ASUS+ROG+Maximus+Z890+Apex',
    specs: {
      socket: 'LGA1851',
      formFactor: 'ATX',
      chipset: 'Z890',
      memorySlots: '4',
      maxMemory: '256GB DDR5',
      m2Slots: '6',
    },
  },
  {
    id: 'mb-004',
    name: 'Z790 Aorus Elite AX',
    brand: 'Gigabyte',
    category: 'motherboard',
    price: 299,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    rating: 4.6,
    reviews: 2350,
    inStock: true,
    tags: ['gaming', 'lga1700', 'wifi6e'],
    affiliateUrl: 'https://www.amazon.com/s?k=Gigabyte+Z790+Aorus+Elite+AX',
    specs: {
      socket: 'LGA1700',
      formFactor: 'ATX',
      chipset: 'Z790',
      memorySlots: '4',
      maxMemory: '192GB DDR5',
      m2Slots: '4',
    },
  },
];

// ─── RAM ───────────────────────────────────────────────────────────────────────
export const rams: RAMComponent[] = [
  {
    id: 'ram-001',
    name: 'Trident Z5 RGB 32GB',
    brand: "G.Skill",
    category: 'ram',
    price: 149,
    image: 'https://images.unsplash.com/photo-1601666819413-7dd6e8f95bc0?w=400',
    rating: 4.8,
    reviews: 5670,
    inStock: true,
    tags: ['gaming', 'rgb', 'ddr5'],
    affiliateUrl: 'https://www.amazon.com/s?k=GSkill+Trident+Z5+RGB+32GB+DDR5',
    specs: {
      capacity: '32GB',
      speed: 'DDR5-6400',
      type: 'DDR5',
      cas: 'CL32',
      modules: '2x16GB',
    },
  },
  {
    id: 'ram-002',
    name: 'Vengeance DDR5 64GB',
    brand: 'Corsair',
    category: 'ram',
    price: 219,
    image: 'https://images.unsplash.com/photo-1601666819413-7dd6e8f95bc0?w=400',
    rating: 4.7,
    reviews: 3240,
    inStock: true,
    tags: ['workstation', 'content-creation', 'ddr5'],
    affiliateUrl: 'https://www.amazon.com/s?k=Corsair+Vengeance+DDR5+64GB',
    specs: {
      capacity: '64GB',
      speed: 'DDR5-5600',
      type: 'DDR5',
      cas: 'CL40',
      modules: '2x32GB',
    },
  },
  {
    id: 'ram-003',
    name: 'Fury Beast 32GB',
    brand: 'Kingston',
    category: 'ram',
    price: 89,
    image: 'https://images.unsplash.com/photo-1601666819413-7dd6e8f95bc0?w=400',
    rating: 4.5,
    reviews: 8900,
    inStock: true,
    tags: ['budget', 'ddr5', 'overclocking'],
    affiliateUrl: 'https://www.amazon.com/s?k=Kingston+Fury+Beast+32GB+DDR5',
    specs: {
      capacity: '32GB',
      speed: 'DDR5-5200',
      type: 'DDR5',
      cas: 'CL40',
      modules: '2x16GB',
    },
  },
];

// ─── Storage ───────────────────────────────────────────────────────────────────
export const storages: StorageComponent[] = [
  {
    id: 'ssd-001',
    name: '990 Pro 2TB',
    brand: 'Samsung',
    category: 'storage',
    price: 179,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    rating: 4.9,
    reviews: 12340,
    inStock: true,
    tags: ['nvme', 'flagship', 'fast'],
    affiliateUrl: 'https://www.amazon.com/s?k=Samsung+990+Pro+2TB',
    specs: {
      capacity: '2TB',
      type: 'NVMe SSD',
      interface: 'PCIe 4.0 x4',
      readSpeed: '7,450 MB/s',
      writeSpeed: '6,900 MB/s',
    },
  },
  {
    id: 'ssd-002',
    name: 'WD Black SN850X 2TB',
    brand: 'Western Digital',
    category: 'storage',
    price: 159,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    rating: 4.8,
    reviews: 8760,
    inStock: true,
    tags: ['nvme', 'gaming', 'fast'],
    affiliateUrl: 'https://www.amazon.com/s?k=WD+Black+SN850X+2TB',
    specs: {
      capacity: '2TB',
      type: 'NVMe SSD',
      interface: 'PCIe 4.0 x4',
      readSpeed: '7,300 MB/s',
      writeSpeed: '6,600 MB/s',
    },
  },
  {
    id: 'ssd-003',
    name: 'KC3000 4TB',
    brand: 'Kingston',
    category: 'storage',
    price: 299,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    rating: 4.7,
    reviews: 2340,
    inStock: true,
    tags: ['high-capacity', 'nvme', 'workstation'],
    affiliateUrl: 'https://www.amazon.com/s?k=Kingston+KC3000+4TB',
    specs: {
      capacity: '4TB',
      type: 'NVMe SSD',
      interface: 'PCIe 4.0 x4',
      readSpeed: '7,000 MB/s',
      writeSpeed: '7,000 MB/s',
    },
  },
  {
    id: 'hdd-001',
    name: 'Barracuda 8TB',
    brand: 'Seagate',
    category: 'storage',
    price: 129,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    rating: 4.4,
    reviews: 23450,
    inStock: true,
    tags: ['storage', 'hdd', 'budget'],
    affiliateUrl: 'https://www.amazon.com/s?k=Seagate+Barracuda+8TB',
    specs: {
      capacity: '8TB',
      type: 'HDD',
      interface: 'SATA III',
      readSpeed: '190 MB/s',
      writeSpeed: '190 MB/s',
    },
  },
];

// ─── PSUs ──────────────────────────────────────────────────────────────────────
export const psus: PSUComponent[] = [
  {
    id: 'psu-001',
    name: 'HX1500i',
    brand: 'Corsair',
    category: 'psu',
    price: 449,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
    rating: 4.9,
    reviews: 1234,
    inStock: true,
    tags: ['flagship', '1500w', 'platinum'],
    affiliateUrl: 'https://www.amazon.com/s?k=Corsair+HX1500i',
    specs: {
      wattage: '1500',
      efficiency: '80+ Platinum',
      modular: 'Fully Modular',
      formFactor: 'ATX',
    },
  },
  {
    id: 'psu-002',
    name: 'Supernova 1000 G7',
    brand: 'EVGA',
    category: 'psu',
    price: 219,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
    rating: 4.8,
    reviews: 5670,
    inStock: true,
    tags: ['gaming', '1000w', 'gold'],
    affiliateUrl: 'https://www.amazon.com/s?k=EVGA+Supernova+1000+G7',
    specs: {
      wattage: '1000',
      efficiency: '80+ Gold',
      modular: 'Fully Modular',
      formFactor: 'ATX',
    },
  },
  {
    id: 'psu-003',
    name: 'Toughpower GF3 850W',
    brand: 'Thermaltake',
    category: 'psu',
    price: 139,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
    rating: 4.7,
    reviews: 3450,
    inStock: true,
    tags: ['mid-range', '850w', 'gold'],
    affiliateUrl: 'https://www.amazon.com/s?k=Thermaltake+Toughpower+GF3+850W',
    specs: {
      wattage: '850',
      efficiency: '80+ Gold',
      modular: 'Fully Modular',
      formFactor: 'ATX',
    },
  },
  {
    id: 'psu-004',
    name: 'Focus GX-650',
    brand: 'Seasonic',
    category: 'psu',
    price: 109,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
    rating: 4.8,
    reviews: 7890,
    inStock: true,
    tags: ['budget', '650w', 'gold'],
    affiliateUrl: 'https://www.amazon.com/s?k=Seasonic+Focus+GX-650',
    specs: {
      wattage: '650',
      efficiency: '80+ Gold',
      modular: 'Fully Modular',
      formFactor: 'ATX',
    },
  },
];

// ─── Cases ─────────────────────────────────────────────────────────────────────
export const cases: CaseComponent[] = [
  {
    id: 'case-001',
    name: 'O11D XL-E',
    brand: 'Lian Li',
    category: 'case',
    price: 249,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
    rating: 4.9,
    reviews: 5670,
    inStock: true,
    tags: ['flagship', 'e-atx', 'glass'],
    affiliateUrl: 'https://www.amazon.com/s?k=Lian+Li+O11D+XL-E',
    specs: {
      formFactor: 'E-ATX / ATX',
      material: 'Aluminum + Tempered Glass',
      fans: '9x 120mm',
      maxGpuLength: '420',
      maxCoolerHeight: '167',
      rgb: 'Yes',
    },
  },
  {
    id: 'case-002',
    name: 'Meshify 2 XL',
    brand: 'Fractal Design',
    category: 'case',
    price: 199,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
    rating: 4.8,
    reviews: 8900,
    inStock: true,
    tags: ['airflow', 'atx', 'minimalist'],
    affiliateUrl: 'https://www.amazon.com/s?k=Fractal+Design+Meshify+2+XL',
    specs: {
      formFactor: 'ATX',
      material: 'Steel + Mesh',
      fans: '3x 140mm',
      maxGpuLength: '461',
      maxCoolerHeight: '185',
      rgb: 'No',
    },
  },
  {
    id: 'case-003',
    name: 'H9 Flow',
    brand: 'NZXT',
    category: 'case',
    price: 179,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
    rating: 4.7,
    reviews: 6780,
    inStock: true,
    tags: ['dual-chamber', 'airflow', 'clean'],
    affiliateUrl: 'https://www.amazon.com/s?k=NZXT+H9+Flow',
    specs: {
      formFactor: 'ATX',
      material: 'Steel + Tempered Glass',
      fans: '4x 120mm',
      maxGpuLength: '435',
      maxCoolerHeight: '185',
      rgb: 'No',
    },
  },
  {
    id: 'case-004',
    name: 'Commander C34 ARGB',
    brand: 'Phanteks',
    category: 'case',
    price: 129,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
    rating: 4.6,
    reviews: 4560,
    inStock: true,
    tags: ['budget', 'rgb', 'mid-tower'],
    affiliateUrl: 'https://www.amazon.com/s?k=Phanteks+Commander+C34+ARGB',
    specs: {
      formFactor: 'ATX',
      material: 'Steel + Tempered Glass',
      fans: '3x 120mm ARGB',
      maxGpuLength: '380',
      maxCoolerHeight: '175',
      rgb: 'Yes',
    },
  },
];

// ─── Cooling ───────────────────────────────────────────────────────────────────
export const coolers: CoolingComponent[] = [
  {
    id: 'cool-001',
    name: 'Kraken Elite 360 RGB',
    brand: 'NZXT',
    category: 'cooling',
    price: 299,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
    rating: 4.8,
    reviews: 2345,
    inStock: true,
    tags: ['aio', '360mm', 'rgb'],
    affiliateUrl: 'https://www.amazon.com/s?k=NZXT+Kraken+Elite+360+RGB',
    specs: {
      type: 'AIO Liquid Cooler',
      socket: 'AM5, AM4, LGA1851, LGA1700, LGA1200',
      tdp: '350W+',
      noise: '21-36 dBA',
      rgb: 'Yes',
    },
  },
  {
    id: 'cool-002',
    name: 'Cooler Master H500M 240',
    brand: 'Cooler Master',
    category: 'cooling',
    price: 149,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
    rating: 4.6,
    reviews: 4567,
    inStock: true,
    tags: ['aio', '240mm', 'budget'],
    affiliateUrl: 'https://www.amazon.com/s?k=Cooler+Master+MasterLiquid+240',
    specs: {
      type: 'AIO Liquid Cooler',
      socket: 'AM5, AM4, LGA1700, LGA1200',
      tdp: '250W',
      noise: '6-25 dBA',
      rgb: 'Yes',
    },
  },
  {
    id: 'cool-003',
    name: 'Noctua NH-D15 chromax',
    brand: 'Noctua',
    category: 'cooling',
    price: 109,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
    rating: 4.9,
    reviews: 18900,
    inStock: true,
    tags: ['air-cooler', 'silent', 'premium'],
    affiliateUrl: 'https://www.amazon.com/s?k=Noctua+NH-D15+chromax',
    specs: {
      type: 'Air Cooler',
      socket: 'AM5, AM4, LGA1851, LGA1700',
      tdp: '250W',
      noise: '19.2-24.6 dBA',
      rgb: 'No',
    },
  },
];

// ─── Monitors ──────────────────────────────────────────────────────────────────
export const monitors: PCComponent[] = [
  {
    id: 'mon-001',
    name: 'ASUS ROG Swift OLED PG34WCDM',
    brand: 'ASUS',
    category: 'monitor',
    price: 1099,
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400',
    rating: 4.9,
    reviews: 1234,
    inStock: true,
    tags: ['ultrawide', 'oled', '240hz', 'gaming'],
    affiliateUrl: 'https://www.amazon.com/s?k=ASUS+ROG+Swift+OLED+PG34WCDM',
    specs: {
      size: '34"',
      resolution: '3440x1440',
      refreshRate: '240Hz',
      panel: 'OLED',
      responseTime: '0.03ms',
      hdr: 'OLED HDR',
    },
  },
  {
    id: 'mon-002',
    name: 'LG UltraGear 27GS95QE',
    brand: 'LG',
    category: 'monitor',
    price: 799,
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400',
    rating: 4.8,
    reviews: 2345,
    inStock: true,
    tags: ['27-inch', 'oled', '240hz', 'gaming'],
    affiliateUrl: 'https://www.amazon.com/s?k=LG+UltraGear+27GS95QE',
    specs: {
      size: '27"',
      resolution: '2560x1440',
      refreshRate: '240Hz',
      panel: 'OLED',
      responseTime: '0.03ms',
      hdr: 'VESA DisplayHDR True Black 400',
    },
  },
  {
    id: 'mon-003',
    name: 'Dell Alienware AW3225QF',
    brand: 'Dell',
    category: 'monitor',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400',
    rating: 4.9,
    reviews: 876,
    inStock: true,
    tags: ['4k', 'oled', '240hz', 'ultrawide'],
    affiliateUrl: 'https://www.amazon.com/s?k=Dell+Alienware+AW3225QF',
    specs: {
      size: '32"',
      resolution: '3840x2160',
      refreshRate: '240Hz',
      panel: 'QD-OLED',
      responseTime: '0.03ms',
      hdr: 'VESA DisplayHDR True Black 400',
    },
  },
];

// ─── Keyboards ────────────────────────────────────────────────────────────────
export const keyboards: PCComponent[] = [
  {
    id: 'kb-001',
    name: 'Wooting 60HE+',
    brand: 'Wooting',
    category: 'keyboard',
    price: 199,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
    rating: 4.9,
    reviews: 4560,
    inStock: true,
    tags: ['mechanical', 'hall-effect', 'gaming'],
    affiliateUrl: 'https://www.amazon.com/s?k=Wooting+60HE+plus+keyboard',
    specs: {
      layout: '60%',
      switches: 'Lekker (Hall Effect)',
      connectivity: 'USB-C',
      backlight: 'RGB',
      hotSwap: 'Yes',
    },
  },
  {
    id: 'kb-002',
    name: 'Q1 Max QMK',
    brand: 'Keychron',
    category: 'keyboard',
    price: 199,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
    rating: 4.8,
    reviews: 3456,
    inStock: true,
    tags: ['mechanical', 'wireless', 'qmk', 'premium'],
    affiliateUrl: 'https://www.amazon.com/s?k=Keychron+Q1+Max+QMK',
    specs: {
      layout: '75%',
      switches: 'Keychron K Pro Brown',
      connectivity: 'USB-C / Bluetooth 5.1',
      backlight: 'RGB',
      hotSwap: 'Yes',
    },
  },
];

// ─── Mice ─────────────────────────────────────────────────────────────────────
export const mice: PCComponent[] = [
  {
    id: 'mouse-001',
    name: 'DeathAdder V3 HyperSpeed',
    brand: 'Razer',
    category: 'mouse',
    price: 159,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    rating: 4.9,
    reviews: 6780,
    inStock: true,
    tags: ['wireless', 'gaming', 'esports'],
    affiliateUrl: 'https://www.amazon.com/s?k=Razer+DeathAdder+V3+HyperSpeed',
    specs: {
      dpi: '30,000 DPI',
      connectivity: '2.4GHz Wireless',
      weight: '55g',
      battery: '300 hours',
      sensor: 'Focus Pro 30K',
    },
  },
  {
    id: 'mouse-002',
    name: 'G Pro X Superlight 2',
    brand: 'Logitech',
    category: 'mouse',
    price: 159,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    rating: 4.9,
    reviews: 9870,
    inStock: true,
    tags: ['wireless', 'gaming', 'ultralight'],
    affiliateUrl: 'https://www.amazon.com/s?k=Logitech+G+Pro+X+Superlight+2',
    specs: {
      dpi: '44,000 DPI',
      connectivity: 'LIGHTSPEED Wireless',
      weight: '60g',
      battery: '95 hours',
      sensor: 'Hero 25K',
    },
  },
];

// ─── Headsets ─────────────────────────────────────────────────────────────────
export const headsets: PCComponent[] = [
  {
    id: 'hs-001',
    name: 'Arctis Nova Pro Wireless',
    brand: 'SteelSeries',
    category: 'headset',
    price: 349,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    rating: 4.8,
    reviews: 4560,
    inStock: true,
    tags: ['wireless', 'noise-cancelling', 'premium'],
    affiliateUrl: 'https://www.amazon.com/s?k=SteelSeries+Arctis+Nova+Pro+Wireless',
    specs: {
      driver: '40mm',
      connectivity: 'Dual Wireless (2.4GHz + Bluetooth)',
      battery: '22 hours + hot swap',
      mic: 'AI-powered noise cancellation',
      surround: 'Sonar Hi-Res',
    },
  },
];

// ─── All Components Registry ───────────────────────────────────────────────────
export const allComponents: Record<ComponentCategory, AnyPCComponent[]> = {
  cpu: cpus,
  gpu: gpus,
  motherboard: motherboards,
  ram: rams,
  storage: storages,
  psu: psus,
  case: cases,
  cooling: coolers,
  monitor: monitors,
  keyboard: keyboards,
  mouse: mice,
  headset: headsets,
};

// ─── Preset Builds ─────────────────────────────────────────────────────────────
export const presetBuilds: Build[] = [
  {
    id: 'build-001',
    name: 'Ultimate Gaming Beast',
    description:
      'The pinnacle of gaming performance. No compromises, no limitations. Dominate every game at 4K/240Hz with the very best components.',
    useCase: 'gaming',
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600',
    totalPrice: 0,
    components: {
      cpu: cpus[0],    // Ryzen 9 9950X
      gpu: gpus[0],    // RTX 5090
      motherboard: motherboards[0], // ROG Crosshair X870E
      ram: rams[0],    // G.Skill 32GB DDR5
      storage: storages[0], // Samsung 990 Pro 2TB
      psu: psus[0],    // Corsair HX1500i
      case: cases[0],  // Lian Li O11D XL
      cooling: coolers[0], // NZXT Kraken Elite 360
      monitor: monitors[2], // Alienware AW3225QF
      keyboard: keyboards[0], // Wooting 60HE+
      mouse: mice[1],  // Logitech G Pro X
    },
  },
  {
    id: 'build-002',
    name: 'Creator / Workstation',
    description:
      '96-core beast for video editing, 3D rendering, and scientific computing. Handle any professional workload with ease.',
    useCase: 'workstation',
    image: 'https://images.unsplash.com/photo-1593640408182-31c228e15b4e?w=600',
    totalPrice: 0,
    components: {
      cpu: cpus[5],    // Threadripper PRO 7995WX
      gpu: gpus[2],    // RTX 4090
      motherboard: motherboards[0],
      ram: rams[1],    // 64GB DDR5
      storage: storages[2], // Kingston 4TB
      psu: psus[0],    // Corsair HX1500i
      case: cases[1],  // Fractal Meshify 2 XL
      cooling: coolers[0],
      monitor: monitors[0], // ASUS ROG Swift OLED
    },
  },
  {
    id: 'build-003',
    name: 'Budget Gaming Champion',
    description:
      'Best bang for buck. Excellent 1080p/1440p gaming performance without breaking the bank.',
    useCase: 'budget',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600',
    totalPrice: 0,
    components: {
      cpu: cpus[1],    // Ryzen 7 9700X
      gpu: gpus[4],    // RTX 4060 Ti
      motherboard: motherboards[1], // MSI B650
      ram: rams[2],    // Kingston 32GB
      storage: storages[1], // WD Black SN850X 2TB
      psu: psus[3],    // Seasonic 650W
      case: cases[3],  // Phanteks Commander
      cooling: coolers[2], // Noctua NH-D15
      monitor: monitors[1], // LG UltraGear 27"
    },
  },
  {
    id: 'build-004',
    name: 'Home Office Pro',
    description:
      'Silent, efficient, and powerful enough for all professional tasks. Perfect for working from home.',
    useCase: 'office',
    image: 'https://images.unsplash.com/photo-1593640408182-31c228e15b4e?w=600',
    totalPrice: 0,
    components: {
      cpu: cpus[4],    // Ryzen 5 8600G (integrated GPU)
      motherboard: motherboards[1],
      ram: rams[2],    // 32GB DDR5
      storage: storages[0], // Samsung 990 Pro 2TB
      psu: psus[3],    // 650W
      case: cases[2],  // NZXT H9
      cooling: coolers[2], // Noctua (silent)
      keyboard: keyboards[1], // Keychron Q1 Max
      mouse: mice[0],
    },
  },
  {
    id: 'build-005',
    name: 'Streaming Studio',
    description:
      'Powerful enough to game AND stream simultaneously at 1440p. Multi-core performance meets GPU excellence.',
    useCase: 'streaming',
    image: 'https://images.unsplash.com/photo-1590987337591-c26e4de4ee4f?w=600',
    totalPrice: 0,
    components: {
      cpu: cpus[0],    // Ryzen 9 9950X
      gpu: gpus[3],    // RX 9070 XT
      motherboard: motherboards[1],
      ram: rams[1],    // 64GB DDR5
      storage: storages[0],
      psu: psus[1],    // 1000W
      case: cases[2],  // NZXT H9
      cooling: coolers[1], // 240mm AIO
      monitor: monitors[0],
      keyboard: keyboards[1],
      mouse: mice[0],
      headset: headsets[0],
    },
  },
  {
    id: 'build-006',
    name: 'Mid-Range Sweet Spot',
    description:
      'Perfect balance of performance and value. Intel platform with RTX power for 1440p gaming.',
    useCase: 'gaming',
    image: 'https://images.unsplash.com/photo-1596239936890-fb9736c38ea6?w=600',
    totalPrice: 0,
    components: {
      cpu: cpus[3],    // Core Ultra 5 245K
      gpu: gpus[4],    // RTX 4060 Ti
      motherboard: motherboards[3], // Z790 Aorus
      ram: rams[0],    // G.Skill 32GB
      storage: storages[1],
      psu: psus[2],    // Thermaltake 850W
      case: cases[2],  // NZXT H9
      cooling: coolers[1], // 240mm AIO
      monitor: monitors[1],
    },
  },
];

// Calculate preset totals
presetBuilds.forEach((build) => {
  build.totalPrice = Object.values(build.components).reduce(
    (sum, c) => sum + (c?.price ?? 0),
    0
  );
});

export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  cpu: 'CPU / Processor',
  gpu: 'Graphics Card',
  motherboard: 'Motherboard',
  ram: 'Memory (RAM)',
  storage: 'Storage',
  psu: 'Power Supply',
  case: 'PC Case',
  cooling: 'CPU Cooler',
  monitor: 'Monitor',
  keyboard: 'Keyboard',
  mouse: 'Mouse',
  headset: 'Headset',
};

export const CATEGORY_ICONS: Record<ComponentCategory, string> = {
  cpu: '⚡',
  gpu: '🎮',
  motherboard: '🔲',
  ram: '💾',
  storage: '💿',
  psu: '🔋',
  case: '🖥️',
  cooling: '❄️',
  monitor: '📺',
  keyboard: '⌨️',
  mouse: '🖱️',
  headset: '🎧',
};

export const REQUIRED_CATEGORIES: ComponentCategory[] = [
  'cpu',
  'gpu',
  'motherboard',
  'ram',
  'storage',
  'psu',
  'case',
  'cooling',
];

export const PERIPHERAL_CATEGORIES: ComponentCategory[] = [
  'monitor',
  'keyboard',
  'mouse',
  'headset',
];
