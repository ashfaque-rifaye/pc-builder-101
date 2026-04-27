import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Group } from 'three';
import type { AnyPCComponent, ComponentCategory } from '../../types';
import AirflowParticles from './AirflowParticles';

interface AssembledPCProps {
  components: Partial<Record<ComponentCategory, AnyPCComponent>>;
  highlightedComponent: ComponentCategory | null;
  exploded?: boolean;
  scale?: number;
  /** RGB glow color override */
  glowColor?: string;
  /** Which categories are visible (for assembly animation). If undefined, show all. */
  visibleCategories?: Set<ComponentCategory>;
  /** Category currently being animated in */
  animatingCategory?: ComponentCategory | null;
  /** 0-1 progress of assembling the animating category */
  animationProgress?: number;
  /** Show airflow particles */
  showAirflow?: boolean;
}

// ─── Material factory ────────────────────────────────────────────────────────
function makeMat(color: string, opts?: Partial<THREE.MeshStandardMaterialParameters>) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.7, ...opts });
}

function makeGlow(color: string, intensity = 1.2) {
  return new THREE.MeshStandardMaterial({
    color, emissive: color, emissiveIntensity: intensity,
    roughness: 0.1, metalness: 0.5, transparent: true, opacity: 0.95,
  });
}

// ─── Spec helpers ────────────────────────────────────────────────────────────
function getSpec(comp: AnyPCComponent | undefined, key: string): string {
  if (!comp) return '';
  return (comp.specs as Record<string, string>)[key] ?? '';
}

function parseNum(s: string): number {
  return parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
}

/** GPU length class from pciSlot spec (e.g. "336mm") */
function gpuSizeClass(comp?: AnyPCComponent): 'compact' | 'mid' | 'large' {
  const len = parseNum(getSpec(comp, 'pciSlot'));
  if (len > 0 && len <= 220) return 'compact';
  if (len > 220 && len <= 280) return 'mid';
  return 'large';
}

/** Motherboard scale from formFactor */
function moboScale(comp?: AnyPCComponent): number {
  const ff = getSpec(comp, 'formFactor').toLowerCase();
  if (ff.includes('itx') || ff.includes('mini')) return 0.6;
  if (ff.includes('matx') || ff.includes('micro')) return 0.8;
  if (ff.includes('eatx') || ff.includes('e-atx') || ff.includes('xl')) return 1.1;
  return 1.0; // ATX default
}

/** Number of RAM sticks from modules spec */
function ramStickCount(comp?: AnyPCComponent): number {
  const m = getSpec(comp, 'modules');
  const match = m.match(/^(\d)/);
  return match ? parseInt(match[1]) : 2;
}

/** PSU scale factor from wattage */
function psuScale(comp?: AnyPCComponent): number {
  const w = parseNum(getSpec(comp, 'wattage'));
  if (w >= 1200) return 1.15;
  if (w >= 850) return 1.05;
  if (w <= 550) return 0.85;
  return 1.0;
}

/** Is this a SATA HDD/SSD vs NVMe M.2 */
function storageType(comp?: AnyPCComponent): 'nvme' | 'sata_ssd' | 'hdd' {
  const iface = getSpec(comp, 'interface').toLowerCase();
  const type = getSpec(comp, 'type').toLowerCase();
  if (type.includes('hdd')) return 'hdd';
  if (iface.includes('sata')) return 'sata_ssd';
  return 'nvme';
}



// ─── GPU Model ───────────────────────────────────────────────────────────────
function GPUModel({ highlighted, exploded, sizeClass, rgbColor }: { highlighted: boolean; exploded: boolean; sizeClass: 'compact' | 'mid' | 'large'; rgbColor: string }) {
  const ref = useRef<Group>(null);
  const glowC = highlighted ? '#00ff88' : rgbColor;
  const bodyMat = useMemo(() => makeMat(highlighted ? '#1a3a6a' : '#0d1a2e', { metalness: 0.9 }), [highlighted]);
  const backMat = useMemo(() => makeMat('#1a1a2a', { metalness: 0.95, roughness: 0.15 }), []);
  const fanMat = useMemo(() => makeMat('#0a0a14', { roughness: 0.5 }), []);
  const glowMat = useMemo(() => makeGlow(glowC, highlighted ? 2 : 0.8), [highlighted, glowC]);

  // Scale GPU based on size class
  const gpuWidth = sizeClass === 'compact' ? 0.45 : sizeClass === 'mid' ? 0.6 : 0.7;
  const gpuDepth = sizeClass === 'compact' ? 0.25 : sizeClass === 'mid' ? 0.30 : 0.35;
  const fanPositions = sizeClass === 'compact' ? [0] : sizeClass === 'mid' ? [-0.12, 0.12] : [-0.17, 0, 0.17];
  const fanRadius = sizeClass === 'compact' ? 0.09 : 0.12;

  const yOff = exploded ? -1.5 : 0;

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, -0.55 + yOff, 0.05);
    }
  });

  return (
    <group ref={ref} position={[0.15, -0.55, 0]}>
      {/* Main body */}
      <mesh material={bodyMat} castShadow>
        <boxGeometry args={[gpuWidth, 0.12, gpuDepth]} />
      </mesh>
      {/* Backplate */}
      <mesh material={backMat} position={[0, 0.07, 0]}>
        <boxGeometry args={[gpuWidth, 0.015, gpuDepth]} />
      </mesh>
      {/* Fans — count based on size class */}
      {fanPositions.map((x, i) => (
        <group key={i}>
          <mesh material={fanMat} position={[x, -0.065, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[fanRadius, fanRadius, 0.02, 24]} />
          </mesh>
          <mesh material={glowMat} position={[x, -0.065, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[fanRadius * 0.83, 0.008, 8, 24]} />
          </mesh>
        </group>
      ))}
      {/* Heat pipes */}
      {[-0.1, 0, 0.1].map((z, i) => (
        <mesh key={i} material={makeMat('#8b6914', { metalness: 0.95, roughness: 0.1 })} position={[0, 0.01, z]}>
          <cylinderGeometry args={[0.008, 0.008, gpuWidth * 0.93, 8]} />
        </mesh>
      ))}
      {/* Power connector */}
      <mesh material={fanMat} position={[gpuWidth / 2 + 0.02, 0.02, 0]}>
        <boxGeometry args={[0.04, 0.05, 0.12]} />
      </mesh>
      {/* RGB strip */}
      <mesh material={glowMat} position={[0, -0.069, gpuDepth / 2 + 0.005]}>
        <boxGeometry args={[gpuWidth * 0.93, 0.008, 0.005]} />
      </mesh>
      {/* Display outputs */}
      {[-0.12, -0.04, 0.04, 0.12].map((z, i) => (
        <mesh key={i} material={fanMat} position={[-gpuWidth / 2 - 0.005, 0, z]}>
          <boxGeometry args={[0.01, 0.04, 0.05]} />
        </mesh>
      ))}
    </group>
  );
}

// ─── CPU Model ───────────────────────────────────────────────────────────────
function CPUModel({ highlighted, exploded, rgbColor }: { highlighted: boolean; exploded: boolean; rgbColor: string }) {
  const ref = useRef<Group>(null);
  const ihsMat = useMemo(() => makeMat(highlighted ? '#c0c0c0' : '#8a8a8a', { metalness: 0.95, roughness: 0.1 }), [highlighted]);
  const subsMat = useMemo(() => makeMat('#1a5a2a', { roughness: 0.6, metalness: 0.3 }), []);
  const glowMat = useMemo(() => makeGlow(highlighted ? '#ffaa00' : rgbColor, highlighted ? 1.5 : 0.4), [highlighted, rgbColor]);
  const yOff = exploded ? 1.2 : 0;

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 0.42 + yOff, 0.05);
    }
  });

  return (
    <group ref={ref} position={[0.15, 0.42, 0]}>
      {/* IHS (Integrated Heat Spreader) */}
      <mesh material={ihsMat} castShadow>
        <boxGeometry args={[0.16, 0.02, 0.16]} />
      </mesh>
      {/* Substrate */}
      <mesh material={subsMat} position={[0, -0.015, 0]}>
        <boxGeometry args={[0.18, 0.01, 0.18]} />
      </mesh>
      {/* Corner markers */}
      {[[-0.08, -0.08], [0.08, -0.08], [0.08, 0.08], [-0.08, 0.08]].map(([x, z], i) => (
        <mesh key={i} material={glowMat} position={[x, 0.012, z]}>
          <sphereGeometry args={[0.008, 8, 8]} />
        </mesh>
      ))}
      {/* Text engraving (decorative line) */}
      <mesh material={glowMat} position={[0, 0.012, 0]}>
        <boxGeometry args={[0.1, 0.002, 0.002]} />
      </mesh>
    </group>
  );
}

// ─── Cooler Model ────────────────────────────────────────────────────────────
function CoolerModel({ highlighted, exploded, isAIO, rgbColor }: { highlighted: boolean; exploded: boolean; isAIO: boolean; rgbColor: string }) {
  const ref = useRef<Group>(null);
  const metalMat = useMemo(() => makeMat('#2a2a3a', { metalness: 0.85 }), []);
  const finMat = useMemo(() => makeMat('#3a3a4a', { metalness: 0.9, roughness: 0.2 }), []);
  const glowMat = useMemo(() => makeGlow(highlighted ? '#ff44ff' : rgbColor, highlighted ? 1.5 : 0.6), [highlighted, rgbColor]);
  const hoseMat = useMemo(() => makeMat('#1a1a1a', { roughness: 0.8, metalness: 0.2 }), []);
  const yOff = exploded ? 2 : 0;

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 0.52 + yOff, 0.05);
    }
  });

  if (isAIO) {
    return (
      <group ref={ref} position={[0.15, 0.52, 0]}>
        {/* Pump head */}
        <mesh material={metalMat} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 24]} />
        </mesh>
        <mesh material={glowMat} position={[0, 0.022, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.005, 24]} />
        </mesh>
        {/* Hoses */}
        <mesh material={hoseMat} position={[0.05, 0.02, 0.08]} rotation={[0.5, 0, 0.3]}>
          <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
        </mesh>
        <mesh material={hoseMat} position={[-0.05, 0.02, 0.08]} rotation={[0.5, 0, -0.3]}>
          <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
        </mesh>
        {/* Radiator (at top of case) */}
        <group position={[0, 0.6, 0.1]}>
          <mesh material={finMat}>
            <boxGeometry args={[0.5, 0.04, 0.2]} />
          </mesh>
          {/* Radiator fans */}
          {[-0.15, 0, 0.15].map((x, i) => (
            <group key={i}>
              <mesh material={metalMat} position={[x, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
              </mesh>
              <mesh material={glowMat} position={[x, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.05, 0.005, 6, 16]} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    );
  }

  // Air cooler
  return (
    <group ref={ref} position={[0.15, 0.52, 0]}>
      {/* Base plate */}
      <mesh material={metalMat} castShadow>
        <boxGeometry args={[0.12, 0.02, 0.12]} />
      </mesh>
      {/* Heat fins tower */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} material={finMat} position={[0, 0.03 + i * 0.015, 0]}>
          <boxGeometry args={[0.14, 0.008, 0.1]} />
        </mesh>
      ))}
      {/* Heat pipes */}
      {[-0.03, 0, 0.03].map((z, i) => (
        <mesh key={i} material={makeMat('#b87333', { metalness: 0.95, roughness: 0.1 })} position={[0, 0.1, z]}>
          <cylinderGeometry args={[0.008, 0.008, 0.2, 8]} />
        </mesh>
      ))}
      {/* Fan */}
      <mesh material={metalMat} position={[0.09, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
      </mesh>
      <mesh material={glowMat} position={[0.09, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.065, 0.005, 6, 16]} />
      </mesh>
    </group>
  );
}

// ─── Motherboard Model ───────────────────────────────────────────────────────
function MotherboardModel({ highlighted, exploded, scale: moboSf, rgbColor }: { highlighted: boolean; exploded: boolean; scale: number; rgbColor: string }) {
  const ref = useRef<Group>(null);
  const pcbMat = useMemo(() => makeMat(highlighted ? '#0a2e0a' : '#0a1a0a', { roughness: 0.6, metalness: 0.3 }), [highlighted]);
  const slotMat = useMemo(() => makeMat('#1a1a2a'), []);
  const chipMat = useMemo(() => makeMat('#2a2a3a', { metalness: 0.85 }), []);
  const glowMat = useMemo(() => makeGlow(highlighted ? '#00ff44' : rgbColor, highlighted ? 1 : 0.3), [highlighted, rgbColor]);
  const yOff = exploded ? 0.5 : 0;

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 0.1 + yOff, 0.05);
    }
  });

  return (
    <group ref={ref} position={[0, 0.1, 0]} scale={[moboSf, 1, moboSf]}>
      {/* PCB */}
      <mesh material={pcbMat} receiveShadow>
        <boxGeometry args={[0.85, 0.02, 0.75]} />
      </mesh>
      {/* CPU Socket */}
      <mesh material={slotMat} position={[0.15, 0.015, 0.12]}>
        <boxGeometry args={[0.2, 0.01, 0.2]} />
      </mesh>
      {/* RAM slots */}
      {[0.1, 0.14, 0.18, 0.22].map((z, i) => (
        <mesh key={i} material={slotMat} position={[0.35, 0.015, z]}>
          <boxGeometry args={[0.04, 0.008, 0.01]} />
        </mesh>
      ))}
      {/* PCIe x16 slot */}
      <mesh material={slotMat} position={[0.15, 0.015, -0.15]}>
        <boxGeometry args={[0.35, 0.008, 0.02]} />
      </mesh>
      {/* Chipset heatsink */}
      <mesh material={chipMat} position={[-0.1, 0.03, -0.1]}>
        <boxGeometry args={[0.1, 0.04, 0.1]} />
      </mesh>
      <mesh material={glowMat} position={[-0.1, 0.052, -0.1]}>
        <boxGeometry args={[0.08, 0.003, 0.08]} />
      </mesh>
      {/* VRM heatsinks */}
      <mesh material={chipMat} position={[-0.05, 0.025, 0.35]}>
        <boxGeometry args={[0.6, 0.03, 0.04]} />
      </mesh>
      <mesh material={chipMat} position={[-0.38, 0.025, 0.1]}>
        <boxGeometry args={[0.04, 0.03, 0.45]} />
      </mesh>
      {/* I/O shield area */}
      <mesh material={chipMat} position={[-0.43, 0.04, 0.15]}>
        <boxGeometry args={[0.02, 0.06, 0.35]} />
      </mesh>
      {/* M.2 slot */}
      <mesh material={slotMat} position={[0, 0.015, -0.05]}>
        <boxGeometry args={[0.08, 0.005, 0.025]} />
      </mesh>
      {/* PCB traces (decorative) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} material={glowMat} position={[-0.15 + i * 0.08, 0.012, 0]}>
          <boxGeometry args={[0.002, 0.001, 0.6]} />
        </mesh>
      ))}
      {/* Mounting holes */}
      {[[-0.38, 0.3], [0.38, 0.3], [-0.38, -0.3], [0.38, -0.3], [0, 0.3], [0, -0.3]].map(([x, z], i) => (
        <mesh key={i} material={chipMat} position={[x, 0.012, z]}>
          <cylinderGeometry args={[0.015, 0.015, 0.005, 12]} />
        </mesh>
      ))}
    </group>
  );
}

// ─── RAM Model ───────────────────────────────────────────────────────────────
function RAMModel({ highlighted, exploded, stickCount, rgbColor }: { highlighted: boolean; exploded: boolean; stickCount: number; rgbColor: string }) {
  const ref = useRef<Group>(null);
  const heatMat = useMemo(() => makeMat(highlighted ? '#3a3a5a' : '#1a1a2e', { metalness: 0.85 }), [highlighted]);
  const glowMat = useMemo(() => makeGlow(highlighted ? '#ff00ff' : rgbColor, highlighted ? 1.5 : 0.6), [highlighted, rgbColor]);
  const yOff = exploded ? 1.5 : 0;

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 0.2 + yOff, 0.05);
    }
  });

  // Render `stickCount` sticks (1-4)
  const sticks = Array.from({ length: Math.min(stickCount, 4) }, (_, i) => i * 0.04);

  return (
    <group ref={ref} position={[0.35, 0.2, 0.14]}>
      {sticks.map((z, i) => (
        <group key={i} position={[0, 0, z]}>
          {/* PCB */}
          <mesh material={makeMat('#0a3a0a', { roughness: 0.7 })} position={[0, 0, 0]}>
            <boxGeometry args={[0.04, 0.25, 0.015]} />
          </mesh>
          {/* Heat spreader */}
          <mesh material={heatMat}>
            <boxGeometry args={[0.04, 0.28, 0.018]} />
          </mesh>
          {/* RGB strip on top */}
          <mesh material={glowMat} position={[0, 0.145, 0]}>
            <boxGeometry args={[0.038, 0.01, 0.016]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Storage Model ───────────────────────────────────────────────────────────
function StorageModel({ highlighted, exploded, driveType }: { highlighted: boolean; exploded: boolean; driveType: 'nvme' | 'sata_ssd' | 'hdd' }) {
  const ref = useRef<Group>(null);
  const chipMat = useMemo(() => makeMat('#1a1a2a', { metalness: 0.8 }), []);
  const labelMat = useMemo(() => makeMat(highlighted ? '#4a4a6a' : '#2a2a3a'), [highlighted]);
  const caseMat = useMemo(() => makeMat(highlighted ? '#2a2a4a' : '#1a1a2a', { metalness: 0.9 }), [highlighted]);
  const yOff = exploded ? -0.8 : 0;

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 0.14 + yOff, 0.05);
    }
  });

  if (driveType === 'hdd') {
    // 3.5" HDD
    return (
      <group ref={ref} position={[0, 0.14, -0.05]}>
        <mesh material={caseMat} castShadow>
          <boxGeometry args={[0.15, 0.035, 0.1]} />
        </mesh>
        {/* Spindle label */}
        <mesh material={labelMat} position={[0, 0.019, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.002, 16]} />
        </mesh>
        {/* SATA connector */}
        <mesh material={chipMat} position={[0.077, -0.01, 0]}>
          <boxGeometry args={[0.008, 0.015, 0.04]} />
        </mesh>
      </group>
    );
  }

  if (driveType === 'sata_ssd') {
    // 2.5" SSD
    return (
      <group ref={ref} position={[0, 0.14, -0.05]}>
        <mesh material={caseMat} castShadow>
          <boxGeometry args={[0.1, 0.012, 0.07]} />
        </mesh>
        <mesh material={labelMat} position={[0, 0.007, 0]}>
          <boxGeometry args={[0.09, 0.001, 0.06]} />
        </mesh>
        <mesh material={chipMat} position={[0.052, -0.003, 0]}>
          <boxGeometry args={[0.006, 0.008, 0.03]} />
        </mesh>
      </group>
    );
  }

  // NVMe M.2 (default)
}

// ─── PSU Model ───────────────────────────────────────────────────────────────
function PSUModel({ highlighted, exploded, psuSf, rgbColor }: { highlighted: boolean; exploded: boolean; psuSf: number; rgbColor: string }) {
  const ref = useRef<Group>(null);
  const bodyMat = useMemo(() => makeMat(highlighted ? '#2a2a3a' : '#0d0d14', { metalness: 0.85 }), [highlighted]);
  const grillMat = useMemo(() => makeMat('#1a1a2a', { roughness: 0.4 }), []);
  const glowMat = useMemo(() => makeGlow(highlighted ? '#00ff88' : rgbColor, highlighted ? 1 : 0.2), [highlighted, rgbColor]);
  const yOff = exploded ? -2.5 : 0;

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, -1.05 + yOff, 0.05);
    }
  });

  return (
    <group ref={ref} position={[0, -1.05, 0]} scale={[psuSf, psuSf, psuSf]}>
      {/* Main body */}
      <mesh material={bodyMat} castShadow>
        <boxGeometry args={[0.5, 0.28, 0.35]} />
      </mesh>
      {/* Fan grill */}
      <mesh material={grillMat} position={[0, -0.142, 0]}>
        <boxGeometry args={[0.45, 0.005, 0.3]} />
      </mesh>
      {/* Fan circle */}
      <mesh material={grillMat} position={[0, -0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.005, 8, 24]} />
      </mesh>
      {/* Power switch */}
      <mesh material={glowMat} position={[-0.25, 0.05, 0.17]}>
        <boxGeometry args={[0.01, 0.03, 0.02]} />
      </mesh>
      {/* Cable outputs */}
      {[-0.1, -0.03, 0.03, 0.1].map((z, i) => (
        <mesh key={i} material={grillMat} position={[0.255, 0.06, z]}>
          <boxGeometry args={[0.01, 0.04, 0.05]} />
        </mesh>
      ))}
      {/* Label */}
      <mesh material={makeMat('#1a1a2e')} position={[0, 0, 0.176]}>
        <boxGeometry args={[0.35, 0.15, 0.001]} />
      </mesh>
    </group>
  );
}

// ─── Case Shell ──────────────────────────────────────────────────────────────
function CaseShell({ highlighted, rgbColor }: { highlighted: boolean; rgbColor: string }) {
  const caseMat = useMemo(() => makeMat(highlighted ? '#1a2240' : '#0d1526', { metalness: 0.9, roughness: 0.25 }), [highlighted]);
  const glassMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#88ccff', roughness: 0.05, metalness: 0.1,
    transparent: true, opacity: 0.15, side: THREE.DoubleSide,
  }), []);
  const frameMat = useMemo(() => makeMat('#1a2a4a', { metalness: 0.85, roughness: 0.3 }), []);
  const glowMat = useMemo(() => makeGlow(highlighted ? '#00ffaa' : rgbColor, 0.6), [highlighted, rgbColor]);

  return (
    <group>
      {/* Back panel */}
      <mesh material={caseMat} position={[-0.45, 0, 0]}>
        <boxGeometry args={[0.02, 2.6, 0.8]} />
      </mesh>
      {/* Top panel */}
      <mesh material={frameMat} position={[0, 1.32, 0]}>
        <boxGeometry args={[0.92, 0.02, 0.82]} />
      </mesh>
      {/* Bottom panel */}
      <mesh material={frameMat} position={[0, -1.32, 0]}>
        <boxGeometry args={[0.92, 0.02, 0.82]} />
      </mesh>
      {/* Glass side panel */}
      <mesh material={glassMat} position={[0.46, 0, 0]}>
        <planeGeometry args={[0.82, 2.58]} />
      </mesh>
      {/* Frame edges */}
      <mesh material={frameMat} position={[0.46, 1.3, 0]}>
        <boxGeometry args={[0.02, 0.04, 0.82]} />
      </mesh>
      <mesh material={frameMat} position={[0.46, -1.3, 0]}>
        <boxGeometry args={[0.02, 0.04, 0.82]} />
      </mesh>
      <mesh material={frameMat} position={[0.46, 0, 0.4]}>
        <boxGeometry args={[0.02, 2.6, 0.04]} />
      </mesh>
      <mesh material={frameMat} position={[0.46, 0, -0.4]}>
        <boxGeometry args={[0.02, 2.6, 0.04]} />
      </mesh>
      {/* Front panel */}
      <mesh material={caseMat} position={[0, 0, -0.4]}>
        <boxGeometry args={[0.9, 2.6, 0.02]} />
      </mesh>
      {/* Rear panel (with IO cutout) */}
      <mesh material={caseMat} position={[0, 0, 0.4]}>
        <boxGeometry args={[0.9, 2.6, 0.02]} />
      </mesh>
      {/* PSU shroud */}
      <mesh material={frameMat} position={[0, -0.85, 0]}>
        <boxGeometry args={[0.88, 0.02, 0.78]} />
      </mesh>
      {/* RGB strip front */}
      <mesh material={glowMat} position={[0.05, 0, -0.41]}>
        <boxGeometry args={[0.02, 2.2, 0.005]} />
      </mesh>
      {/* RGB strip top */}
      <mesh material={glowMat} position={[0, 1.33, 0]}>
        <boxGeometry args={[0.85, 0.005, 0.02]} />
      </mesh>
      {/* Front magnetic-strip vents */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} material={frameMat} position={[-0.2, 0.8 - i * 0.2, -0.41]}>
          <boxGeometry args={[0.5, 0.015, 0.005]} />
        </mesh>
      ))}
      {/* Feet */}
      {[[-0.3, -1.35, -0.25], [0.3, -1.35, -0.25], [-0.3, -1.35, 0.25], [0.3, -1.35, 0.25]].map(([x, y, z], i) => (
        <mesh key={i} material={frameMat} position={[x, y, z]}>
          <boxGeometry args={[0.12, 0.06, 0.08]} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Main Assembled PC ──────────────────────────────────────────────────────
export default function AssembledPC({
  components,
  highlightedComponent,
  exploded = false,
  scale = 1,
  glowColor = '#00ccff',
  visibleCategories,
  animatingCategory: _animatingCategory,
  animationProgress: _animationProgress = 1,
  showAirflow = false,
}: AssembledPCProps) {
  const groupRef = useRef<Group>(null);

  const hasGPU = !!components.gpu;
  const hasCPU = !!components.cpu;
  const hasCooling = !!components.cooling;
  const hasMobo = !!components.motherboard;
  const hasRAM = !!components.ram;
  const hasStorage = !!components.storage;
  const hasPSU = !!components.psu;
  const isAIO = hasCooling && (components.cooling!.specs as Record<string, string>).type?.toLowerCase().includes('aio');

  // Visibility (for assembly animation)
  const isVisible = (cat: ComponentCategory) =>
    !visibleCategories || visibleCategories.has(cat);

  // Component-aware scaling
  const gpuSize = gpuSizeClass(components.gpu);
  const mbScale = moboScale(components.motherboard);
  const ramCount = ramStickCount(components.ram);
  const psuSf = psuScale(components.psu);
  const stType = storageType(components.storage);
  const coolingTypeStr = isAIO ? 'aio' as const : 'air' as const;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {isVisible('case') && <CaseShell highlighted={highlightedComponent === 'case'} rgbColor={glowColor} />}
      {hasMobo && isVisible('motherboard') && <MotherboardModel highlighted={highlightedComponent === 'motherboard'} exploded={exploded} scale={mbScale} rgbColor={glowColor} />}
      {hasCPU && isVisible('cpu') && <CPUModel highlighted={highlightedComponent === 'cpu'} exploded={exploded} rgbColor={glowColor} />}
      {hasCooling && isVisible('cooling') && <CoolerModel highlighted={highlightedComponent === 'cooling'} exploded={exploded} isAIO={!!isAIO} rgbColor={glowColor} />}
      {hasGPU && isVisible('gpu') && <GPUModel highlighted={highlightedComponent === 'gpu'} exploded={exploded} sizeClass={gpuSize} rgbColor={glowColor} />}
      {hasRAM && isVisible('ram') && <RAMModel highlighted={highlightedComponent === 'ram'} exploded={exploded} stickCount={ramCount} rgbColor={glowColor} />}
      {hasStorage && isVisible('storage') && <StorageModel highlighted={highlightedComponent === 'storage'} exploded={exploded} driveType={stType} />}
      {hasPSU && isVisible('psu') && <PSUModel highlighted={highlightedComponent === 'psu'} exploded={exploded} psuSf={psuSf} rgbColor={glowColor} />}

      {/* Airflow visualization */}
      <AirflowParticles visible={showAirflow} coolingType={coolingTypeStr} count={150} />
    </group>
  );
}
