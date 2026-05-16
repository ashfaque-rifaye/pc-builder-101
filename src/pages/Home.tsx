import { Suspense, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Float, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Lenis from 'lenis';

// Import our 3D components
import PCCase from '../components/three/PCCase';
import ParticleField from '../components/three/ParticleField';

/* ─── 3D SCENE RIG ──────────────────────────────────────────────────────── */

function PCModelRig() {
  const group = useRef<THREE.Group>(null);
  const scroll = useScroll();

  useFrame((_state, delta) => {
    if (!group.current) return;
    
    // scroll.offset goes from 0 (top) to 1 (bottom)
    const r1 = scroll.range(0, 1 / 4);     // Intro -> The Brain
    const r2 = scroll.range(1 / 4, 1 / 4); // The Brain -> GPU
    const r3 = scroll.range(2 / 4, 1 / 4); // GPU -> Cooling

    // Intro (Hero): Centered, slightly rotated
    let targetX = 0;
    let targetY = -0.5;
    let targetZ = 0;
    let targetRotY = Math.PI * 0.15;
    let targetRotX = 0;
    let scale = 1.2;

    // 1. The Brain (CPU focus)
    if (scroll.offset > 0 && scroll.offset <= 0.33) {
      targetX = THREE.MathUtils.lerp(0, 2, r1); // Move right
      targetY = THREE.MathUtils.lerp(-0.5, -1, r1); // Move down
      targetRotY = THREE.MathUtils.lerp(Math.PI * 0.15, -Math.PI * 0.1, r1);
      targetRotX = THREE.MathUtils.lerp(0, 0.2, r1);
      scale = THREE.MathUtils.lerp(1.2, 1.8, r1);
    }
    // 2. The Graphics (GPU focus)
    else if (scroll.offset > 0.33 && scroll.offset <= 0.66) {
      targetX = THREE.MathUtils.lerp(2, -2, r2); // Move left
      targetY = THREE.MathUtils.lerp(-1, 0.5, r2); // Move up
      targetRotY = THREE.MathUtils.lerp(-Math.PI * 0.1, Math.PI * 0.25, r2);
      targetRotX = THREE.MathUtils.lerp(0.2, -0.1, r2);
      scale = THREE.MathUtils.lerp(1.8, 1.9, r2);
    }
    // 3. Cooling & Masterpiece (Full view)
    else if (scroll.offset > 0.66) {
      targetX = THREE.MathUtils.lerp(-2, 0, r3); // Center
      targetY = THREE.MathUtils.lerp(0.5, -0.5, r3); // Reset
      targetRotY = THREE.MathUtils.lerp(Math.PI * 0.25, Math.PI * 2.15, r3); // Spin around
      targetRotX = THREE.MathUtils.lerp(-0.1, 0, r3);
      scale = THREE.MathUtils.lerp(1.9, 1.3, r3);
    }

    // Apply smooth damping
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX, 4, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, 4, delta);
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, targetZ, 4, delta);
    
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRotY, 4, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetRotX, 4, delta);
    
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, scale, 4, delta));
  });

  return (
    <group ref={group}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <PCCase glowColor="var(--neon-primary)" autoRotate={false} />
      </Float>
    </group>
  );
}

function AnimatedScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" />
      <pointLight position={[-5, 3, -2]} intensity={1.5} color="#00f5ff" />
      <pointLight position={[0, -3, 3]} intensity={1.5} color="#ff00f5" />
      <spotLight position={[0, 10, 0]} intensity={3} angle={0.5} penumbra={1} castShadow />
      
      <Environment preset="city" />
      <ParticleField count={300} />

      <PCModelRig />

      <ContactShadows position={[0, -3, 0]} opacity={0.6} scale={20} blur={2.5} far={10} color="#00f5ff" />
    </>
  );
}

/* ─── HTML OVERLAYS ─────────────────────────────────────────────────────── */

export default function Home() {
  // We apply Lenis globally so that scrolling the body is buttery smooth
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like easing
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="w-screen h-screen relative bg-black font-sans text-white overflow-hidden">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 35 }} gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={['#050811']} />
        
        {/* We use 5 pages of scroll distance for the cinematic scrubbing effect */}
        <ScrollControls pages={5} damping={0.25} maxSpeed={0.5}>
          
          <Suspense fallback={null}>
            <AnimatedScene />
          </Suspense>

          <Scroll html style={{ width: '100vw' }}>
            
            {/* 1. HERO SECTION */}
            <section className="h-screen flex flex-col justify-center items-center text-center px-6 relative z-10">
              <p className="text-cyan-400 font-bold uppercase tracking-[0.3em] mb-4 text-sm md:text-base animate-pulse">
                The Future of PC Building
              </p>
              <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none mb-6 drop-shadow-2xl">
                DREAM. <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">BUILD.</span> PLAY.
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed mb-10">
                Experience the world's most immersive, globally-accessible 3D PC configurator. See every part before you buy.
              </p>
              <div className="flex gap-4 mt-4">
                <Link to="/builder" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                  Start Building
                </Link>
                <div className="flex flex-col items-center justify-center opacity-50 ml-6">
                  <span className="text-[10px] uppercase tracking-widest mb-2">Scroll</span>
                  <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
                </div>
              </div>
            </section>

            {/* 2. THE BRAIN (CPU) */}
            <section className="h-screen flex flex-col justify-center items-start px-10 md:px-24 w-full max-w-7xl mx-auto pointer-events-none">
              <div className="max-w-md pointer-events-auto">
                <p className="text-cyan-400 font-bold uppercase tracking-[0.2em] mb-2 text-sm">The Processor</p>
                <h2 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  The Brain <br/>of the Machine.
                </h2>
                <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed">
                  We check compatibility instantly. Whether you choose Intel or AMD, we make sure your motherboard and RAM are perfectly matched, so you never buy the wrong parts.
                </p>
              </div>
            </section>

            {/* 3. THE GRAPHICS (GPU) */}
            <section className="h-screen flex flex-col justify-center items-end px-10 md:px-24 w-full max-w-7xl mx-auto pointer-events-none text-right">
              <div className="max-w-md pointer-events-auto">
                <p className="text-purple-400 font-bold uppercase tracking-[0.2em] mb-2 text-sm">The Visual Engine</p>
                <h2 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  Stunning <br/>Graphics.
                </h2>
                <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed">
                  See how massive your graphics card actually is. Our true-to-scale 3D models ensure your GPU physically fits inside your chosen case before you spend a dime.
                </p>
              </div>
            </section>

            {/* 4. COOLING & RGB */}
            <section className="h-screen flex flex-col justify-center items-start px-10 md:px-24 w-full max-w-7xl mx-auto pointer-events-none">
              <div className="max-w-md pointer-events-auto">
                <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] mb-2 text-sm">Thermals & Light</p>
                <h2 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  Stay Cool. <br/>Look Incredible.
                </h2>
                <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed">
                  Visualize airflow patterns and customize your RGB lighting in real-time. Build a PC that doesn't just perform well, but looks like a masterpiece.
                </p>
              </div>
            </section>

            {/* 5. OUTRO / CTA */}
            <section className="h-screen flex flex-col justify-center items-center text-center px-6 relative z-10">
              <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent pointer-events-none" />
              <h2 className="font-heading text-6xl md:text-8xl font-black mb-8 drop-shadow-lg">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Build?</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed mb-12">
                Buy directly from Amazon, Newegg, Best Buy, and local retailers worldwide with our AI-powered product finder.
              </p>
              <div className="flex gap-6">
                <Link to="/builder" className="px-10 py-5 bg-white text-black text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(0,245,255,0.3)]">
                  Enter PC Builder
                </Link>
                <Link to="/presets" className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 text-lg font-bold rounded-full hover:bg-white/20 transition-all">
                  View Expert Presets
                </Link>
              </div>
            </section>
            
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
