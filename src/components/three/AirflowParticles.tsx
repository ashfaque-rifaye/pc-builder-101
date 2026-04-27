import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AirflowParticlesProps {
  visible?: boolean;
  /** Cooling type drives flow pattern */
  coolingType?: 'aio' | 'air' | 'none';
  /** Number of particles */
  count?: number;
}

/**
 * Visualizes airflow paths inside the PC case.
 * - Front fans = blue cool intake (→ inward)
 * - Top/rear fans = red warm exhaust (→ outward)
 * - AIO: stronger top exhaust flow
 * - Air cooler: front-to-back horizontal flow
 */
export default function AirflowParticles({
  visible = true,
  coolingType = 'aio',
  count = 200,
}: AirflowParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    const intakeCount = Math.floor(count * 0.5);

    // Intake particles (front → inside, blue)
    for (let i = 0; i < intakeCount; i++) {
      const idx = i * 3;
      pos[idx] = (Math.random() - 0.5) * 0.6;     // x spread
      pos[idx + 1] = (Math.random() - 0.5) * 1.5;  // y inside case
      pos[idx + 2] = -0.35 + Math.random() * 0.1;   // z near front panel

      // Blue = cool intake
      col[idx] = 0.2;
      col[idx + 1] = 0.6 + Math.random() * 0.3;
      col[idx + 2] = 1.0;

      // Move forward into case
      vel[idx] = (Math.random() - 0.5) * 0.002;
      vel[idx + 1] = (Math.random() - 0.3) * 0.001;
      vel[idx + 2] = 0.003 + Math.random() * 0.003;
    }

    // Exhaust particles (inside → top/rear, red-orange)
    for (let i = intakeCount; i < count; i++) {
      const idx = i * 3;
      const isTopExhaust = coolingType === 'aio' ? Math.random() > 0.3 : Math.random() > 0.6;

      if (isTopExhaust) {
        // Top exhaust
        pos[idx] = (Math.random() - 0.5) * 0.6;
        pos[idx + 1] = 0.8 + Math.random() * 0.4;
        pos[idx + 2] = (Math.random() - 0.5) * 0.5;

        vel[idx] = (Math.random() - 0.5) * 0.001;
        vel[idx + 1] = 0.003 + Math.random() * 0.004;
        vel[idx + 2] = (Math.random() - 0.5) * 0.001;
      } else {
        // Rear exhaust
        pos[idx] = (Math.random() - 0.5) * 0.6;
        pos[idx + 1] = (Math.random() - 0.5) * 1.0;
        pos[idx + 2] = 0.35 + Math.random() * 0.1;

        vel[idx] = (Math.random() - 0.5) * 0.001;
        vel[idx + 1] = Math.random() * 0.002;
        vel[idx + 2] = 0.003 + Math.random() * 0.003;
      }

      // Warm exhaust: orange to red gradient
      col[idx] = 1.0;
      col[idx + 1] = 0.2 + Math.random() * 0.3;
      col[idx + 2] = 0.1;
    }

    return { positions: pos, colors: col, velocities: vel };
  }, [count, coolingType]);

  // Bounds for particle recycling (case interior)
  const bounds = { x: 0.45, yMin: -1.3, yMax: 1.35, z: 0.42 };

  useFrame(() => {
    if (!pointsRef.current || !visible) return;

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      arr[idx] += velocities[idx];
      arr[idx + 1] += velocities[idx + 1];
      arr[idx + 2] += velocities[idx + 2];

      // Recycle particles that leave bounds
      const oob =
        Math.abs(arr[idx]) > bounds.x ||
        arr[idx + 1] < bounds.yMin ||
        arr[idx + 1] > bounds.yMax + 0.3 ||
        Math.abs(arr[idx + 2]) > bounds.z + 0.3;

      if (oob) {
        const isIntake = i < count * 0.5;
        if (isIntake) {
          arr[idx] = (Math.random() - 0.5) * 0.6;
          arr[idx + 1] = (Math.random() - 0.5) * 1.5;
          arr[idx + 2] = -0.35;
        } else {
          arr[idx] = (Math.random() - 0.5) * 0.4;
          arr[idx + 1] = (Math.random() - 0.3) * 1.0;
          arr[idx + 2] = (Math.random() - 0.5) * 0.3;
        }
      }
    }

    posAttr.needsUpdate = true;
  });

  if (!visible) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}
