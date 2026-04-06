import type { RegionCode } from '../data/regions';

export type ComponentCategory =
  | 'cpu'
  | 'gpu'
  | 'motherboard'
  | 'ram'
  | 'storage'
  | 'psu'
  | 'case'
  | 'cooling'
  | 'monitor'
  | 'keyboard'
  | 'mouse'
  | 'headset';

export type LaptopCategory =
  | 'laptop-cpu'
  | 'laptop-ram'
  | 'laptop-storage'
  | 'laptop-display'
  | 'laptop-gpu'
  | 'laptop-battery'
  | 'laptop-chassis';

export type AnyCategory = ComponentCategory | LaptopCategory;

export type StockStatus = 'in_stock' | 'out_of_stock' | 'limited' | 'preorder';

export interface PCComponent {
  id: string;
  name: string;
  brand: string;
  category: AnyCategory;
  price: number;          // USD base price
  image: string;
  specs: Record<string, string>;
  tags: string[];
  affiliateUrl: string;   // default (US) Amazon URL
  /** Region-specific affiliate URLs override */
  regionalUrls?: Partial<Record<RegionCode, string>>;
  /** Regions where this product is available; empty/undefined = all regions */
  availableIn?: RegionCode[];
  inStock: boolean;
  stockStatus?: StockStatus;
  /** Region-specific stock status overrides */
  regionalStock?: Partial<Record<RegionCode, StockStatus>>;
  rating: number;
  reviews: number;
}

export interface CPUComponent extends PCComponent {
  category: 'cpu';
  specs: {
    cores: string;
    threads: string;
    baseClock: string;
    boostClock: string;
    tdp: string;
    socket: string;
    architecture: string;
  };
}

export interface GPUComponent extends PCComponent {
  category: 'gpu';
  specs: {
    vram: string;
    coreClock: string;
    boostClock: string;
    tdp: string;
    outputs: string;
    pciSlot: string;
  };
}

export interface MotherboardComponent extends PCComponent {
  category: 'motherboard';
  specs: {
    socket: string;
    formFactor: string;
    chipset: string;
    memorySlots: string;
    maxMemory: string;
    m2Slots: string;
  };
}

export interface RAMComponent extends PCComponent {
  category: 'ram';
  specs: {
    capacity: string;
    speed: string;
    type: string;
    cas: string;
    modules: string;
  };
}

export interface StorageComponent extends PCComponent {
  category: 'storage';
  specs: {
    capacity: string;
    type: string;
    interface: string;
    readSpeed: string;
    writeSpeed: string;
  };
}

export interface PSUComponent extends PCComponent {
  category: 'psu';
  specs: {
    wattage: string;
    efficiency: string;
    modular: string;
    formFactor: string;
  };
}

export interface CaseComponent extends PCComponent {
  category: 'case';
  specs: {
    formFactor: string;
    material: string;
    fans: string;
    maxGpuLength: string;
    maxCoolerHeight: string;
    rgb: string;
  };
}

export interface CoolingComponent extends PCComponent {
  category: 'cooling';
  specs: {
    type: string;
    socket: string;
    tdp: string;
    noise: string;
    rgb: string;
  };
}

/** Laptop-specific component types */
export interface LaptopCPUComponent extends PCComponent {
  category: 'laptop-cpu';
  specs: {
    cores: string;
    threads: string;
    baseClock: string;
    boostClock: string;
    tdp: string;
    socket: string;
    architecture: string;
    upgradeable: string; // 'yes' | 'no' | 'bga' (soldered)
  };
}

export interface LaptopRAMComponent extends PCComponent {
  category: 'laptop-ram';
  specs: {
    capacity: string;
    speed: string;
    type: string;       // DDR4/DDR5 SODIMM or LPDDR5
    formFactor: string; // 'SO-DIMM' | 'Soldered'
    modules: string;
    upgradeable: string;
  };
}

export interface LaptopStorageComponent extends PCComponent {
  category: 'laptop-storage';
  specs: {
    capacity: string;
    type: string;
    interface: string;
    readSpeed: string;
    writeSpeed: string;
    formFactor: string; // 'M.2 2242' | 'M.2 2280' | '2.5" SATA'
  };
}

export interface LaptopDisplayComponent extends PCComponent {
  category: 'laptop-display';
  specs: {
    size: string;
    resolution: string;
    refreshRate: string;
    panel: string; // IPS/OLED/TN
    brightness: string;
    upgradeable: string;
  };
}

export type AnyLaptopComponent =
  | LaptopCPUComponent
  | LaptopRAMComponent
  | LaptopStorageComponent
  | LaptopDisplayComponent
  | PCComponent;

export type AnyPCComponent =
  | CPUComponent
  | GPUComponent
  | MotherboardComponent
  | RAMComponent
  | StorageComponent
  | PSUComponent
  | CaseComponent
  | CoolingComponent
  | PCComponent;

export type AnyComponent = AnyPCComponent | AnyLaptopComponent;

export interface Build {
  id: string;
  name: string;
  description: string;
  useCase: 'gaming' | 'workstation' | 'budget' | 'office' | 'streaming' | 'custom';
  components: Partial<Record<ComponentCategory, AnyPCComponent>>;
  totalPrice: number;
  image: string;
}

export interface LaptopBuild {
  id: string;
  name: string;
  description: string;
  components: Partial<Record<LaptopCategory, AnyLaptopComponent>>;
  totalPrice: number;
  upgradeable: boolean;
}

export interface CompatibilityIssue {
  type: 'error' | 'warning' | 'tip';
  message: string;
  components: AnyCategory[];
}

