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

export interface PCComponent {
  id: string;
  name: string;
  brand: string;
  category: ComponentCategory;
  price: number;
  image: string;
  specs: Record<string, string>;
  tags: string[];
  affiliateUrl: string;
  inStock: boolean;
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

export interface Build {
  id: string;
  name: string;
  description: string;
  useCase: 'gaming' | 'workstation' | 'budget' | 'office' | 'streaming' | 'custom';
  components: Partial<Record<ComponentCategory, AnyPCComponent>>;
  totalPrice: number;
  image: string;
}

export interface CompatibilityIssue {
  type: 'error' | 'warning';
  message: string;
  components: ComponentCategory[];
}
