import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Group } from 'three';

interface MonitorProps {
  autoRotate?: boolean;
  scale?: number;
}

export default function Monitor({ autoRotate = false, scale = 1 }: MonitorProps) {
  const groupRef = useRef<Group>(null);

  const screenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#001133',
        emissive: '#0033aa',
        emissiveIntensity: 0.4,
        roughness: 0.05,
        metalness: 0.1,
      }),
    []
  );

  const frameMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0a0a14',
        roughness: 0.3,
        metalness: 0.8,
      }),
    []
  );

  const glowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#00f5ff',
        emissive: '#00f5ff',
        emissiveIntensity: 1.5,
      }),
    []
  );

  const standMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#111827',
        roughness: 0.4,
        metalness: 0.7,
      }),
    []
  );

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Monitor frame */}
      <mesh material={frameMat} position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[3.2, 1.95, 0.1]} />
      </mesh>

      {/* Screen bezel inner */}
      <mesh material={frameMat} position={[0, 0.8, 0.045]}>
        <boxGeometry args={[3.05, 1.8, 0.02]} />
      </mesh>

      {/* Screen display */}
      <mesh material={screenMat} position={[0, 0.8, 0.055]}>
        <boxGeometry args={[2.95, 1.7, 0.01]} />
      </mesh>

      {/* Screen glow scanline effect (horizontal strip) */}
      <mesh material={glowMat} position={[0, 1.5, 0.065]}>
        <boxGeometry args={[2.9, 0.01, 0.005]} />
      </mesh>

      {/* Back panel vents */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} material={frameMat} position={[i * 0.3 - 0.6, 0.8, -0.055]}>
          <boxGeometry args={[0.02, 1.6, 0.02]} />
        </mesh>
      ))}

      {/* Stand neck */}
      <mesh material={standMat} position={[0, -0.15, 0]}>
        <boxGeometry args={[0.12, 0.85, 0.08]} />
      </mesh>

      {/* Stand base */}
      <mesh material={standMat} position={[0, -0.58, 0.18]}>
        <boxGeometry args={[1.1, 0.06, 0.55]} />
      </mesh>

      {/* Curved stand brace */}
      <mesh material={standMat} position={[0, -0.34, 0.09]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.1, 0.3, 0.06]} />
      </mesh>

      {/* Logo LED on back */}
      <mesh material={glowMat} position={[0, 0.8, -0.055]}>
        <circleGeometry args={[0.07, 16]} />
      </mesh>

      {/* Bottom bezel LED strip */}
      <mesh material={glowMat} position={[0, -0.08, 0.052]}>
        <boxGeometry args={[3.0, 0.015, 0.01]} />
      </mesh>
    </group>
  );
}
