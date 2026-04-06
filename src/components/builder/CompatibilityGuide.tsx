import { useBuilderStore } from '../../store/builderStore';
import { allComponents } from '../../data/components';
import type { AnyPCComponent } from '../../types';

interface Suggestion {
  emoji: string;
  text: string;
  componentId?: string;
  component?: AnyPCComponent;
  category?: string;
}

function getSpec(c: AnyPCComponent, key: string): string {
  return (c.specs as Record<string, string>)[key] ?? '';
}

export default function CompatibilityGuide() {
  const { selectedComponents, setComponent, setActiveCategory } = useBuilderStore();
  const { cpu, motherboard, ram, gpu, psu, cooling } = selectedComponents;

  const suggestions: Suggestion[] = [];

  // ── CPU → Motherboard recommendations
  if (cpu && !motherboard) {
    const socket = getSpec(cpu, 'socket');
    const compatMBs = (allComponents['motherboard'] ?? []).filter(
      (mb) => getSpec(mb, 'socket') === socket
    );
    if (compatMBs.length > 0) {
      suggestions.push({
        emoji: '🔲',
        text: `Your ${cpu.name} (${socket}) works with ${compatMBs.length} motherboard(s). Top pick: ${compatMBs[0].brand} ${compatMBs[0].name}`,
        component: compatMBs[0],
        category: 'motherboard',
      });
    }
  }

  // ── Motherboard → CPU recommendations
  if (motherboard && !cpu) {
    const socket = getSpec(motherboard, 'socket');
    const compatCPUs = (allComponents['cpu'] ?? []).filter(
      (c) => getSpec(c, 'socket') === socket
    );
    if (compatCPUs.length > 0) {
      suggestions.push({
        emoji: '⚡',
        text: `This motherboard (${socket}) supports ${compatCPUs.length} CPU(s). Recommended: ${compatCPUs[0].brand} ${compatCPUs[0].name}`,
        component: compatCPUs[0],
        category: 'cpu',
      });
    }
  }

  // ── CPU TDP → Cooling recommendation
  if (cpu && !cooling) {
    const tdp = parseInt(getSpec(cpu, 'tdp'));
    const socket = getSpec(cpu, 'socket');
    const compatCoolers = (allComponents['cooling'] ?? []).filter((c) => {
      const coolerTdp = parseInt(getSpec(c, 'tdp'));
      const coolerSocket = getSpec(c, 'socket');
      return coolerTdp >= tdp && coolerSocket.includes(socket);
    });
    if (compatCoolers.length > 0) {
      suggestions.push({
        emoji: '❄️',
        text: `Your ${cpu.name} (${tdp}W TDP) needs adequate cooling. Best match: ${compatCoolers[0].brand} ${compatCoolers[0].name}`,
        component: compatCoolers[0],
        category: 'cooling',
      });
    } else if (tdp > 0) {
      suggestions.push({
        emoji: '❄️',
        text: `Your ${cpu.name} has a ${tdp}W TDP. Choose a cooler rated for ${tdp}W+ with socket ${socket} support.`,
      });
    }
  }

  // ── GPU TDP + CPU TDP → PSU recommendation
  if (gpu && cpu && !psu) {
    const gpuTdp = parseInt(getSpec(gpu, 'tdp'));
    const cpuTdp = parseInt(getSpec(cpu, 'tdp'));
    const minWatts = gpuTdp + cpuTdp + 150;
    const recommendedWatts = minWatts + 150; // 150W headroom
    const compatPSUs = (allComponents['psu'] ?? []).filter((p) => {
      const watts = parseInt(getSpec(p, 'wattage'));
      return watts >= recommendedWatts;
    });
    if (compatPSUs.length > 0) {
      suggestions.push({
        emoji: '🔋',
        text: `Your build needs ~${minWatts}W. Recommended: ${compatPSUs[0].name} (${getSpec(compatPSUs[0], 'wattage')}W)`,
        component: compatPSUs[0],
        category: 'psu',
      });
    }
  }

  // ── RAM type + motherboard
  if (motherboard && !ram) {
    const chipset = getSpec(motherboard, 'chipset');
    const ddr5Chipsets = ['X670', 'X670E', 'B650', 'B650E', 'Z790', 'B760', 'Z890', 'B860'];
    const isDDR5 = ddr5Chipsets.some((c) => chipset.includes(c));
    const compatRAMs = (allComponents['ram'] ?? []).filter((r) => {
      const type = getSpec(r, 'type');
      return isDDR5 ? type === 'DDR5' : type === 'DDR4';
    });
    if (compatRAMs.length > 0) {
      suggestions.push({
        emoji: '💾',
        text: `${motherboard.name} uses ${isDDR5 ? 'DDR5' : 'DDR4'} RAM. Best option: ${compatRAMs[0].brand} ${compatRAMs[0].name}`,
        component: compatRAMs[0],
        category: 'ram',
      });
    }
  }

  // General tips based on use case tags
  if (cpu && gpu) {
    const cpuTags = cpu.tags;
    const gpuTags = gpu.tags;
    const isCpuWorkstation = cpuTags.includes('workstation') || cpuTags.includes('professional');
    const isGpuGaming = gpuTags.includes('gaming') || gpuTags.includes('flagship');
    if (isCpuWorkstation && isGpuGaming) {
      suggestions.push({
        emoji: '💡',
        text: 'Great combo for video editing + gaming. Consider 64GB+ RAM and fast NVMe storage for best workflow performance.',
      });
    }
  }

  if (suggestions.length === 0 && Object.keys(selectedComponents).length === 0) {
    return (
      <div className="text-center py-4">
        <span className="text-2xl">🔧</span>
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          Select a component to see compatibility recommendations
        </p>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-3">
        <span className="text-xl">✅</span>
        <p className="text-xs mt-1.5" style={{ color: '#4ade80' }}>
          Looking good! No issues detected.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {suggestions.map((s, i) => (
        <div
          key={i}
          className="rounded-lg p-2.5 text-xs"
          style={{
            background: 'color-mix(in srgb, var(--accent-1) 8%, transparent)',
            border: '1px solid color-mix(in srgb, var(--accent-1) 20%, transparent)',
          }}
        >
          <p style={{ color: 'var(--text-secondary)' }}>
            <span className="mr-1">{s.emoji}</span>
            {s.text}
          </p>
          {s.component && s.category && (
            <button
              onClick={() => {
                const cat = s.category as import('../../types').ComponentCategory;
                setComponent(cat, s.component!);
                setActiveCategory(cat);
              }}
              className="mt-1.5 text-[10px] font-semibold px-2 py-1 rounded transition-all"
              style={{
                color: 'var(--neon-primary)',
                background: 'color-mix(in srgb, var(--neon-primary) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--neon-primary) 25%, transparent)',
              }}
            >
              + Add {s.component.brand} {s.component.name.split(' ').slice(0, 2).join(' ')}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
