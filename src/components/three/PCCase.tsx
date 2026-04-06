import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Mesh, Group } from 'three';

interface PCCaseProps {
  color?: string;
  glowColor?: string;
  autoRotate?: boolean;
  scale?: number;
}

export default function PCCase({
  color = '#0d1526',
  glowColor = '#00f5ff',
  autoRotate = true,
  scale = 1,
}: PCCaseProps) {
  const groupRef = useRef<Group>(null);
  const glowRef = useRef<Mesh>(null);

  // Emissive glow material
  const glowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: glowColor,
        emissive: glowColor,
        emissiveIntensity: 1.2,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.9,
      }),
    [glowColor]
  );

  const caseMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.25,
        metalness: 0.9,
      }),
    [color]
  );

  const glassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#88ccff',
        roughness: 0.05,
        metalness: 0.1,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      }),
    []
  );

  const accentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a2a4a',
        roughness: 0.3,
        metalness: 0.85,
      }),
    []
  );

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
    }
    if (glowRef.current) {
      const t = Date.now() * 0.002;
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.8 + Math.sin(t) * 0.4;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Main case body */}
      <mesh material={caseMat} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 2.6, 0.55]} />
      </mesh>

      {/* Top panel accent */}
      <mesh material={accentMat} position={[0, 1.35, 0]}>
        <boxGeometry args={[1.22, 0.08, 0.57]} />
      </mesh>

      {/* Bottom panel accent */}
      <mesh material={accentMat} position={[0, -1.35, 0]}>
        <boxGeometry args={[1.22, 0.08, 0.57]} />
      </mesh>

      {/* Glass side panel */}
      <mesh material={glassMat} position={[0.615, 0, 0]}>
        <planeGeometry args={[0.58, 2.55]} />
      </mesh>

      {/* Front panel mesh cutout (decorative) */}
      <mesh material={accentMat} position={[-0.605, 0, 0]}>
        <boxGeometry args={[0.04, 2.55, 0.53]} />
      </mesh>

      {/* Power button */}
      <mesh material={glowMat} position={[0.4, 1.1, 0.28]} ref={glowRef}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
      </mesh>

      {/* Front I/O panel */}
      <mesh material={accentMat} position={[0.1, 1.05, 0.28]}>
        <boxGeometry args={[0.4, 0.12, 0.04]} />
      </mesh>

      {/* USB ports */}
      {[-0.12, -0.02, 0.08].map((x, i) => (
        <mesh key={i} material={accentMat} position={[x, 1.05, 0.3]}>
          <boxGeometry args={[0.055, 0.04, 0.02]} />
        </mesh>
      ))}

      {/* RGB strip – front */}
      <mesh material={glowMat} position={[-0.59, 0, 0.28]}>
        <boxGeometry args={[0.02, 2.0, 0.02]} />
      </mesh>

      {/* RGB strip – top */}
      <mesh material={glowMat} position={[0, 1.32, 0]}>
        <boxGeometry args={[1.1, 0.02, 0.02]} />
      </mesh>

      {/* Ventilation slots front */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} material={accentMat} position={[-0.58, 0.6 - i * 0.22, 0.15]}>
          <boxGeometry args={[0.04, 0.04, 0.55]} />
        </mesh>
      ))}

      {/* CPU Cooler fans (visible through glass) */}
      <mesh material={accentMat} position={[0.2, 0.3, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 24]} />
      </mesh>
      <mesh material={glowMat} position={[0.2, 0.3, 0]}>
        <torusGeometry args={[0.18, 0.015, 8, 24]} />
      </mesh>

      {/* GPU strip */}
      <mesh material={glowMat} position={[0.2, -0.6, 0]}>
        <boxGeometry args={[0.6, 0.03, 0.04]} />
      </mesh>
      <mesh material={accentMat} position={[0.2, -0.6, 0]}>
        <boxGeometry args={[0.65, 0.2, 0.35]} />
      </mesh>

      {/* Motherboard traces (visible detail) */}
      <mesh material={accentMat} position={[0.05, 0.6, 0]}>
        <boxGeometry args={[0.85, 1.4, 0.02]} />
      </mesh>

      {/* RAM sticks */}
      {[0.05, 0.15, 0.25, 0.35].map((x, i) => (
        <mesh key={i} material={glowMat} position={[x - 0.05, 0.9, 0.04]}>
          <boxGeometry args={[0.06, 0.6, 0.02]} />
        </mesh>
      ))}

      {/* Feet */}
      {[-0.45, 0.45].map((x, i) => (
        <mesh key={i} material={accentMat} position={[x, -1.38, 0]}>
          <boxGeometry args={[0.18, 0.06, 0.5]} />
        </mesh>
      ))}
    </group>
  );
}
