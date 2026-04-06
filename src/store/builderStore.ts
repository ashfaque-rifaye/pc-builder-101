import type {
  AnyPCComponent,
  ComponentCategory,
  CompatibilityIssue,
  Build,
} from '../types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DDR5_CHIPSETS } from '../data/components';

interface BuilderState {
  selectedComponents: Partial<Record<ComponentCategory, AnyPCComponent>>;
  activeCategory: ComponentCategory;
  activeBuild: Build | null;
  sidebarOpen: boolean;
  totalPrice: number;
  compatibilityIssues: CompatibilityIssue[];

  setComponent: (category: ComponentCategory, component: AnyPCComponent) => void;
  removeComponent: (category: ComponentCategory) => void;
  setActiveCategory: (category: ComponentCategory) => void;
  loadBuild: (build: Build) => void;
  clearBuild: () => void;
  toggleSidebar: () => void;
  getCompatibilityIssues: () => CompatibilityIssue[];
}

function getSpec(component: AnyPCComponent, key: string): string {
  return (component.specs as Record<string, string>)[key] ?? '';
}

function checkCompatibility(
  components: Partial<Record<ComponentCategory, AnyPCComponent>>
): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];

  const cpu = components['cpu'];
  const motherboard = components['motherboard'];
  const ram = components['ram'];
  const psu = components['psu'];
  const pcCase = components['case'];
  const gpu = components['gpu'];
  const cooling = components['cooling'];

  // CPU-Motherboard socket compatibility
  if (cpu && motherboard) {
    const cpuSocket = getSpec(cpu, 'socket');
    const mbSocket = getSpec(motherboard, 'socket');
    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      issues.push({
        type: 'error',
        message: `CPU socket (${cpuSocket}) is not compatible with motherboard socket (${mbSocket})`,
        components: ['cpu', 'motherboard'],
      });
    }
  }

  // RAM type compatibility
  if (ram && motherboard) {
    const ramType = getSpec(ram, 'type');
    const mbMemType = getSpec(motherboard, 'chipset');
    if (ramType === 'DDR5' && mbMemType) {
      const ddr5Chipsets = DDR5_CHIPSETS;
      const compatible = ddr5Chipsets.some((c) => mbMemType.includes(c));
      if (!compatible) {
        issues.push({
          type: 'warning',
          message: `Verify DDR5 RAM compatibility with motherboard chipset (${mbMemType})`,
          components: ['ram', 'motherboard'],
        });
      }
    }
  }

  // PSU wattage check
  if (psu && gpu && cpu) {
    const psuWatts = parseInt(getSpec(psu, 'wattage') || '0');
    const gpuTdp = parseInt(getSpec(gpu, 'tdp') || '0');
    const cpuTdp = parseInt(getSpec(cpu, 'tdp') || '0');
    const estimated = gpuTdp + cpuTdp + 150;
    if (psuWatts < estimated) {
      issues.push({
        type: 'error',
        message: `PSU (${psuWatts}W) may be insufficient. Estimated system draw: ~${estimated}W`,
        components: ['psu', 'gpu', 'cpu'],
      });
    } else if (psuWatts < estimated + 100) {
      issues.push({
        type: 'warning',
        message: `PSU headroom is low. Consider a higher-wattage PSU for stability.`,
        components: ['psu'],
      });
    }
  }

  // Cooling compatibility with CPU socket
  if (cooling && cpu) {
    const coolerSockets = getSpec(cooling, 'socket');
    const cpuSocket = getSpec(cpu, 'socket');
    if (coolerSockets && cpuSocket && !coolerSockets.includes(cpuSocket)) {
      issues.push({
        type: 'error',
        message: `CPU cooler does not support CPU socket (${cpuSocket})`,
        components: ['cooling', 'cpu'],
      });
    }
  }

  // Case compatibility with GPU length
  if (pcCase && gpu) {
    const maxGpuLen = parseInt(getSpec(pcCase, 'maxGpuLength') || '400');
    const gpuLenStr = getSpec(gpu, 'pciSlot').replace('mm', '').trim();
    const gpuLen = parseInt(gpuLenStr || '0');
    if (gpuLen > maxGpuLen) {
      issues.push({
        type: 'error',
        message: `GPU may not fit in case. Max GPU length: ${maxGpuLen}mm`,
        components: ['case', 'gpu'],
      });
    }
  }

  return issues;
}

function calculateTotal(components: Partial<Record<ComponentCategory, AnyPCComponent>>): number {
  return Object.values(components).reduce((sum, c) => sum + (c?.price ?? 0), 0);
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      selectedComponents: {},
      activeCategory: 'cpu',
      activeBuild: null,
      sidebarOpen: true,
      totalPrice: 0,
      compatibilityIssues: [],

      setComponent: (category, component) => {
        set((state) => {
          const updated = { ...state.selectedComponents, [category]: component };
          return {
            selectedComponents: updated,
            totalPrice: calculateTotal(updated),
            compatibilityIssues: checkCompatibility(updated),
          };
        });
      },

      removeComponent: (category) => {
        set((state) => {
          const updated = { ...state.selectedComponents };
          delete updated[category];
          return {
            selectedComponents: updated,
            totalPrice: calculateTotal(updated),
            compatibilityIssues: checkCompatibility(updated),
          };
        });
      },

      setActiveCategory: (category) => set({ activeCategory: category }),

      loadBuild: (build) => {
        set({
          selectedComponents: build.components as Partial<Record<ComponentCategory, AnyPCComponent>>,
          activeBuild: build,
          totalPrice: calculateTotal(
            build.components as Partial<Record<ComponentCategory, AnyPCComponent>>
          ),
          compatibilityIssues: checkCompatibility(
            build.components as Partial<Record<ComponentCategory, AnyPCComponent>>
          ),
        });
      },

      clearBuild: () => {
        set({
          selectedComponents: {},
          activeBuild: null,
          totalPrice: 0,
          compatibilityIssues: [],
        });
      },

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      getCompatibilityIssues: () => {
        return checkCompatibility(get().selectedComponents);
      },
    }),
    {
      name: 'pc-builder-storage',
      partialize: (state) => ({
        selectedComponents: state.selectedComponents,
        totalPrice: state.totalPrice,
      }),
    }
  )
);
