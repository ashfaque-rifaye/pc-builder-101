import { Suspense, Component } from 'react';
import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import AssembledPC from './AssembledPC';
import ParticleField from './ParticleField';
import CameraController from './CameraController';
import type { CameraPreset } from './CameraController';
import type { AnyPCComponent, ComponentCategory } from '../../types';

class BuildSceneErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ background: 'var(--bg-dark)' }}>
          <span className="text-5xl">🖥️</span>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">3D viewer unavailable</p>
          <p style={{ color: 'var(--text-muted)' }} className="text-xs">WebGL required</p>
        </div>
      );
    }
    return this.props.children;
  }
}

interface BuildSceneProps {
  components: Partial<Record<ComponentCategory, AnyPCComponent>>;
  highlightedComponent: ComponentCategory | null;
  exploded?: boolean;
  /** RGB glow color */
  glowColor?: string;
  /** Camera preset to animate to */
  cameraPreset?: CameraPreset;
  cameraActive?: boolean;
  onCameraReached?: () => void;
  /** Assembly animation */
  visibleCategories?: Set<ComponentCategory>;
  animatingCategory?: ComponentCategory | null;
  animationProgress?: number;
  /** Show airflow particles */
  showAirflow?: boolean;
  /** Ref to capture screenshot */
  onScreenshot?: (dataUrl: string) => void;
  screenshotRequested?: boolean;
}

function BuildSceneContent({
  components,
  highlightedComponent,
  exploded,
  glowColor = '#00ccff',
  cameraPreset = 'overview',
  cameraActive = false,
  onCameraReached,
  visibleCategories,
  animatingCategory,
  animationProgress,
  showAirflow = false,
}: Omit<BuildSceneProps, 'onScreenshot' | 'screenshotRequested'>) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={3} color="#ffffff" castShadow />
      <pointLight position={[-5, 3, -3]} intensity={2} color="#3366ff" />
      <pointLight position={[0, -3, 4]} intensity={1.5} color={glowColor} />
      <pointLight position={[3, 1, -4]} intensity={1.2} color="#ff44aa" />
      <spotLight
        position={[0, 10, 0]}
        intensity={4}
        angle={0.35}
        penumbra={0.9}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight
        position={[-6, 4, 2]}
        intensity={2}
        angle={0.3}
        penumbra={0.8}
        color={glowColor}
      />

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* Camera controller for presets */}
      <CameraController
        preset={cameraPreset}
        active={cameraActive}
        onReached={onCameraReached}
      />

      {/* Particles */}
      <ParticleField count={400} />

      {/* Grid floor */}
      <gridHelper
        args={[40, 40, '#1e3a5f', '#0d2040']}
        position={[0, -3.5, 0]}
      />

      {/* Assembled PC */}
      <group position={[0, 0.2, 0]}>
        <AssembledPC
          components={components}
          highlightedComponent={highlightedComponent}
          exploded={exploded}
          scale={1.8}
          glowColor={glowColor}
          visibleCategories={visibleCategories}
          animatingCategory={animatingCategory}
          animationProgress={animationProgress}
          showAirflow={showAirflow}
        />
      </group>

      {/* Shadows */}
      <ContactShadows
        position={[0, -3.4, 0]}
        opacity={0.6}
        scale={25}
        blur={2.5}
        far={12}
      />
    </>
  );
}

export default function BuildScene({
  components,
  highlightedComponent,
  exploded = false,
  glowColor = '#00ccff',
  cameraPreset = 'overview',
  cameraActive = false,
  onCameraReached,
  visibleCategories,
  animatingCategory,
  animationProgress,
  showAirflow = false,
}: BuildSceneProps) {
  return (
    <BuildSceneErrorBoundary>
      <Canvas
        shadows
        camera={{ position: [4, 3, 8], fov: 42 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true, toneMapping: 3, preserveDrawingBuffer: true }}
      >
        <Suspense fallback={null}>
          <BuildSceneContent
            components={components}
            highlightedComponent={highlightedComponent}
            exploded={exploded}
            glowColor={glowColor}
            cameraPreset={cameraPreset}
            cameraActive={cameraActive}
            onCameraReached={onCameraReached}
            visibleCategories={visibleCategories}
            animatingCategory={animatingCategory}
            animationProgress={animationProgress}
            showAirflow={showAirflow}
          />
        </Suspense>
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={4}
          maxDistance={25}
          maxPolarAngle={Math.PI * 0.8}
          autoRotate={false}
          autoRotateSpeed={0.3}
          enabled={!cameraActive}
        />
      </Canvas>
    </BuildSceneErrorBoundary>
  );
}
