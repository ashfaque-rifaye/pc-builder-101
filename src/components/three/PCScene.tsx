import { Suspense, Component } from 'react';
import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import PCCase from './PCCase';
import Monitor from './Monitor';
import Peripherals from './Peripherals';
import ParticleField from './ParticleField';

class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#0d1526] rounded-2xl">
            <span className="text-4xl">🖥️</span>
            <p className="text-slate-400 text-sm">3D viewer unavailable in this environment</p>
            <p className="text-slate-600 text-xs">WebGL required</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

interface PCSceneProps {
  glowColor?: string;
  showPeripherals?: boolean;
  showMonitor?: boolean;
  autoRotateCase?: boolean;
  orbitControlsEnabled?: boolean;
  compact?: boolean;
}

function SceneContent({
  glowColor = '#00f5ff',
  showPeripherals = true,
  showMonitor = true,
  autoRotateCase = false,
  compact = false,
}: Omit<PCSceneProps, 'orbitControlsEnabled'>) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" />
      <pointLight position={[-5, 3, -2]} intensity={1.5} color="#3366ff" />
      <pointLight position={[0, -3, 3]} intensity={1.2} color={glowColor} />
      <pointLight position={[3, 0, -4]} intensity={1.0} color="#ff44aa" />
      <spotLight
        position={[0, 8, 0]}
        intensity={3}
        angle={0.4}
        penumbra={0.8}
        color="#ffffff"
        castShadow
      />

      {/* Particles */}
      <ParticleField count={compact ? 150 : 280} />

      {/* Grid floor */}
      <gridHelper
        args={[30, 30, '#1e3a5f', '#0d2040']}
        position={[0, compact ? -2.5 : -3.2, 0]}
      />

      {/* PC Case */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.15}>
        <group position={compact ? [-1.2, 0, 0] : [-3.5, 0.3, 0]}>
          <PCCase
            glowColor={glowColor}
            autoRotate={autoRotateCase}
            scale={compact ? 1.3 : 1.8}
          />
        </group>
      </Float>

      {/* Monitor */}
      {showMonitor && (
        <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
          <group position={compact ? [1.2, 0.2, 0] : [1.0, 0.8, -1]}>
            <Monitor scale={compact ? 0.55 : 0.75} />
          </group>
        </Float>
      )}

      {/* Peripherals */}
      {showPeripherals && !compact && (
        <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.08}>
          <group position={[1.0, -1.9, 0.5]}>
            <Peripherals scale={0.75} />
          </group>
        </Float>
      )}

      {/* Shadows */}
      <ContactShadows
        position={[0, compact ? -2.4 : -3.1, 0]}
        opacity={0.5}
        scale={20}
        blur={2}
        far={10}
      />
    </>
  );
}

export default function PCScene({
  glowColor = '#00f5ff',
  showPeripherals = true,
  showMonitor = true,
  autoRotateCase = false,
  orbitControlsEnabled = true,
  compact = false,
}: PCSceneProps) {
  return (
    <SceneErrorBoundary>
      <Canvas
        shadows
        camera={{ position: [0, 2, compact ? 8 : 12], fov: compact ? 50 : 45 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <SceneContent
            glowColor={glowColor}
            showPeripherals={showPeripherals}
            showMonitor={showMonitor}
            autoRotateCase={autoRotateCase}
            compact={compact}
          />
        </Suspense>
        {orbitControlsEnabled && (
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={compact ? 4 : 6}
            maxDistance={compact ? 14 : 22}
            maxPolarAngle={Math.PI * 0.75}
            autoRotate={!autoRotateCase}
            autoRotateSpeed={0.5}
          />
        )}
      </Canvas>
    </SceneErrorBoundary>
  );
}
