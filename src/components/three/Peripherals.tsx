import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Group } from 'three';

export default function Peripherals({ scale = 1 }: { scale?: number }) {
  const groupRef = useRef<Group>(null);

  const keyboardMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0d1117',
        roughness: 0.3,
        metalness: 0.6,
      }),
    []
  );

  const keyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a2035',
        roughness: 0.5,
        metalness: 0.3,
      }),
    []
  );

  const glowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#b400ff',
        emissive: '#b400ff',
        emissiveIntensity: 0.8,
      }),
    []
  );

  const mouseMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0a0a14',
        roughness: 0.3,
        metalness: 0.8,
      }),
    []
  );

  useFrame(() => {
    if (groupRef.current) {
      // subtle bob
      groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.02;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* ── Keyboard ── */}
      <group position={[-0.3, 0, 0]}>
        {/* Base */}
        <mesh material={keyboardMat} position={[0, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[2.0, 0.06, 0.7]} />
        </mesh>
        {/* Slight angle (raise back) */}
        <mesh material={keyboardMat} position={[0, 0.035, -0.32]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[2.0, 0.012, 0.05]} />
        </mesh>

        {/* Key rows */}
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 14 }).map((_, col) => (
            <mesh
              key={`${row}-${col}`}
              material={keyMat}
              position={[-0.87 + col * 0.135, 0.04, -0.25 + row * 0.13]}
            >
              <boxGeometry args={[0.1, 0.025, 0.1]} />
            </mesh>
          ))
        )}

        {/* Spacebar */}
        <mesh material={keyMat} position={[0.05, 0.04, 0.27]}>
          <boxGeometry args={[0.7, 0.025, 0.1]} />
        </mesh>

        {/* RGB underglow strip */}
        <mesh material={glowMat} position={[0, -0.015, 0]}>
          <boxGeometry args={[1.98, 0.005, 0.68]} />
        </mesh>
      </group>

      {/* ── Mouse ── */}
      <group position={[1.35, 0, 0.05]}>
        <mesh material={mouseMat} castShadow>
          <capsuleGeometry args={[0.12, 0.3, 8, 16]} />
        </mesh>
        {/* Left click */}
        <mesh material={keyMat} position={[-0.06, 0.07, -0.08]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.2]} />
        </mesh>
        {/* Right click */}
        <mesh material={keyMat} position={[0.06, 0.07, -0.08]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.2]} />
        </mesh>
        {/* Scroll wheel */}
        <mesh material={glowMat} position={[0, 0.09, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.07, 12]} />
        </mesh>
        {/* DPI LED strip */}
        <mesh material={glowMat} position={[0, 0.05, 0.1]}>
          <boxGeometry args={[0.04, 0.01, 0.15]} />
        </mesh>
      </group>

      {/* ── Mouse pad ── */}
      <mesh
        material={
          new THREE.MeshStandardMaterial({ color: '#0a0d14', roughness: 0.9, metalness: 0.0 })
        }
        position={[0.45, -0.04, 0.05]}
        receiveShadow
      >
        <boxGeometry args={[2.8, 0.01, 1.0]} />
      </mesh>
    </group>
  );
}
