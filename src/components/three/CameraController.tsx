import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type CameraPreset =
  | 'overview'
  | 'interior'
  | 'gpu'
  | 'cooling'
  | 'back'
  | 'top'
  | 'front'
  | 'psu'
  | 'ram';

interface PresetConfig {
  position: [number, number, number];
  target: [number, number, number];
  label: string;
  icon: string;
}

export const CAMERA_PRESETS: Record<CameraPreset, PresetConfig> = {
  overview: { position: [4, 3, 8], target: [0, 0, 0], label: 'Overview', icon: '🔭' },
  interior: { position: [1.8, 0.3, 0.5], target: [0, 0, 0], label: 'Interior', icon: '🔍' },
  gpu: { position: [1.5, -0.5, 2.5], target: [0.15, -0.55, 0], label: 'GPU Closeup', icon: '🎮' },
  cooling: { position: [2, 2.5, 2], target: [0.15, 0.6, 0], label: 'Cooling', icon: '❄️' },
  ram: { position: [2, 0.8, 1.5], target: [0.35, 0.2, 0.1], label: 'RAM', icon: '📊' },
  psu: { position: [1.5, -1.5, 2.5], target: [0, -1, 0], label: 'PSU', icon: '⚡' },
  back: { position: [-4, 1, 0], target: [0, 0, 0], label: 'Back Panel', icon: '🔙' },
  top: { position: [0, 8, 0.1], target: [0, 0, 0], label: 'Top Down', icon: '⬆️' },
  front: { position: [0, 0.5, 6], target: [0, 0, 0], label: 'Front', icon: '🖼️' },
};

interface CameraControllerProps {
  preset: CameraPreset;
  /** Set to true to animate to the preset. Becomes false when done. */
  active: boolean;
  onReached?: () => void;
  speed?: number;
}

/**
 * Smoothly animates the camera toward a preset position.
 * Disables while OrbitControls is being used (active=false).
 */
export default function CameraController({
  preset,
  active,
  onReached,
  speed = 0.04,
}: CameraControllerProps) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const animating = useRef(false);

  useEffect(() => {
    if (active) {
      const cfg = CAMERA_PRESETS[preset];
      targetPos.current.set(...cfg.position);
      targetLook.current.set(...cfg.target);
      animating.current = true;
    } else {
      animating.current = false;
    }
  }, [preset, active]);

  useFrame(() => {
    if (!animating.current) return;

    camera.position.lerp(targetPos.current, speed);

    // Smooth look-at by interpolating a dummy
    const currentLook = new THREE.Vector3();
    camera.getWorldDirection(currentLook);
    currentLook.multiplyScalar(5).add(camera.position);
    currentLook.lerp(targetLook.current, speed * 1.5);
    camera.lookAt(currentLook);

    if (camera.position.distanceTo(targetPos.current) < 0.15) {
      animating.current = false;
      onReached?.();
    }
  });

  return null;
}
