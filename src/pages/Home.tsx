import { Link } from 'react-router-dom';
import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import PCScene from '../components/three/PCScene';

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const features = [
  { icon: '🎮', title: '3D Interactive Viewer', desc: 'Explore every component with our real-time 3D renderer. Rotate, zoom, and inspect your build from every angle.', gradient: 'from-cyan-500/20 to-blue-600/20' },
  { icon: '⚡', title: 'Smart Compatibility', desc: 'Real-time validation ensures your CPU, motherboard, RAM, and cooling all work together perfectly.', gradient: 'from-purple-500/20 to-pink-600/20' },
  { icon: '🛒', title: 'Multi-Retailer Links', desc: 'Direct product links to Amazon, Newegg, BestBuy, Flipkart, and more — exact products, not search pages.', gradient: 'from-orange-500/20 to-red-600/20' },
  { icon: '📐', title: 'Build Estimator', desc: 'Instant multi-currency price estimates as you add components. See where your money is going in real time.', gradient: 'from-green-500/20 to-emerald-600/20' },
  { icon: '🏆', title: 'Expert Presets', desc: 'Start with expert-curated presets for gaming, workstation, streaming, or budget builds.', gradient: 'from-yellow-500/20 to-amber-600/20' },
  { icon: '🌍', title: '9 Region Support', desc: 'US, UK, EU, India, Australia, Japan, Canada, Singapore, and UAE with local pricing and retailers.', gradient: 'from-teal-500/20 to-cyan-600/20' },
];

const stats = [
  { value: 50, suffix: '+', label: 'Components' },
  { value: 6, suffix: '', label: 'Preset Builds' },
  { value: 9, suffix: '', label: 'Regions' },
  { value: 13, suffix: '', label: 'Retailers' },
];

const showcaseSteps = [
  { num: '01', title: 'Select Components', desc: 'Choose from 50+ curated PC components across CPUs, GPUs, RAM, storage, and more.', icon: '🔧' },
  { num: '02', title: 'Check Compatibility', desc: 'Our smart engine validates socket types, DDR generations, PSU wattage, and cooler clearance.', icon: '✅' },
  { num: '03', title: 'Visualize in 3D', desc: 'See your complete build rendered in real-time 3D with assembly animations and RGB customization.', icon: '🖥️' },
  { num: '04', title: 'Purchase Directly', desc: 'Buy every component from verified retailers with region-aware pricing and direct product links.', icon: '🛍️' },
];

/* ─── Hooks ────────────────────────────────────────────────────────────────── */
function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useParallax() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return offset;
}

function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const startTime = performance.now();
        const animate = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Component ────────────────────────────────────────────────────────────── */
export default function Home() {
  const scrollY = useParallax();
  const featuresReveal = useScrollReveal(0.08);
  const stepsReveal = useScrollReveal(0.08);
  const statsReveal = useScrollReveal(0.15);
  const ctaReveal = useScrollReveal(0.15);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const heroTextY = useCallback(() => scrollY * 0.3, [scrollY]);
  const heroOpacity = useCallback(() => Math.max(0, 1 - scrollY / 600), [scrollY]);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-dark)' }}>

      {/* ═══════════════════ HERO — Full-viewport cinematic ═══════════════════ */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 40%, color-mix(in srgb, var(--accent-1) 12%, transparent), transparent),
                         radial-gradient(ellipse 60% 50% at 80% 60%, color-mix(in srgb, var(--accent-2) 8%, transparent), transparent),
                         linear-gradient(to bottom, transparent 70%, var(--bg-dark))`
          }} />
        </div>

        {/* Floating orbs with parallax */}
        <div className="absolute orb" style={{ top: '15%', left: '10%', width: '500px', height: '500px', background: 'color-mix(in srgb, var(--accent-1) 6%, transparent)', transform: `translateY(${scrollY * -0.15}px)` }} />
        <div className="absolute orb" style={{ bottom: '15%', right: '10%', width: '400px', height: '400px', background: 'color-mix(in srgb, var(--accent-2) 6%, transparent)', animationDelay: '-3s', transform: `translateY(${scrollY * -0.1}px)` }} />
        <div className="absolute orb" style={{ top: '50%', left: '40%', width: '300px', height: '300px', background: 'color-mix(in srgb, var(--neon-primary) 4%, transparent)', animationDelay: '-6s' }} />

        {/* Hero content with parallax */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12 grid lg:grid-cols-2 items-center gap-12 w-full"
          style={{ transform: `translateY(${heroTextY()}px)`, opacity: heroOpacity() }}>

          {/* Left — Copy */}
          <div className="space-y-8">
            <div className={`transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '200ms' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium"
                style={{ background: 'color-mix(in srgb, var(--accent-1) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--accent-1) 25%, transparent)', color: 'var(--neon-primary)' }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--neon-primary)' }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--neon-primary)' }} />
                </span>
                Next-Gen 3D PC Builder — Now Live
              </div>
            </div>

            <h1 className={`transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '400ms' }}>
              <span className="block text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Build Your
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight gradient-text animate-text-shimmer"
                style={{ backgroundImage: 'linear-gradient(90deg, var(--gradient-text-start), var(--gradient-text-end), var(--gradient-text-start))', backgroundSize: '200% auto' }}>
                Dream PC
              </span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.2] mt-2" style={{ color: 'var(--text-secondary)' }}>
                in Immersive 3D
              </span>
            </h1>

            <p className={`text-lg leading-relaxed max-w-lg transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ color: 'var(--text-secondary)', transitionDelay: '600ms' }}>
              The world's most immersive PC configurator. Select components, validate compatibility in real-time, visualize your build in cinematic 3D, and purchase from verified retailers worldwide.
            </p>

            <div className={`flex flex-wrap gap-4 transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '800ms' }}>
              <Link to="/builder"
                className="group relative px-8 py-4 rounded-2xl text-base font-bold text-white overflow-hidden hover-lift">
                <div className="absolute inset-0 btn-primary" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(135deg, var(--gradient-btn-end), var(--gradient-btn-start))' }} />
                <span className="relative flex items-center gap-2">
                  Start Building
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link to="/presets"
                className="btn-secondary px-8 py-4 rounded-2xl text-base font-medium inline-flex items-center gap-2 hover-lift"
                style={{ color: 'var(--text-secondary)' }}>
                View Presets
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right — 3D Scene */}
          <div className={`h-[500px] lg:h-[620px] rounded-3xl overflow-hidden relative transition-all duration-1200 ${heroLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ transitionDelay: '500ms' }}>
            <div className="absolute inset-0 rounded-3xl pointer-events-none z-10"
              style={{ border: '1px solid var(--border-subtle)', background: 'linear-gradient(to bottom, transparent 50%, var(--bg-dark))' }} />
            <div className="absolute inset-0 rounded-3xl pointer-events-none z-10 animated-border" />
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--bg-card)' }}>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--neon-primary)', borderTopColor: 'transparent' }} />
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading 3D…</span>
                </div>
              </div>
            }>
              <PCScene glowColor="#00f5ff" showPeripherals showMonitor autoRotateCase={false} orbitControlsEnabled />
            </Suspense>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
              <span className="text-xs px-4 py-1.5 rounded-full"
                style={{ color: 'var(--text-muted)', background: 'color-mix(in srgb, var(--bg-dark) 85%, transparent)', backdropFilter: 'blur(8px)' }}>
                🖱️ Drag to rotate · Scroll to zoom
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: heroOpacity() }}>
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--text-muted)' }}>Scroll to explore</span>
          <div className="w-5 h-9 rounded-full border-2 flex justify-center pt-2" style={{ borderColor: 'var(--text-muted)' }}>
            <div className="w-1 h-2.5 rounded-full animate-bounce" style={{ background: 'var(--neon-primary)' }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS BAR — Animated counters ═══════════════════ */}
      <section ref={statsReveal.ref} className="relative py-8 border-y" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="absolute inset-0" style={{ background: 'color-mix(in srgb, var(--accent-1) 3%, var(--bg-dark))' }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={s.label}
                className={`text-center transition-all duration-700 ${statsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${i * 150}ms` }}>
                <p className="text-3xl sm:text-4xl font-black gradient-text">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </p>
                <p className="text-xs mt-1 uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS — Cinematic steps ═══════════════════ */}
      <section ref={stepsReveal.ref} className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--accent-1), transparent)' }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className={`text-center mb-20 transition-all duration-800 ${stepsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-sm font-bold uppercase tracking-[0.25em] mb-4" style={{ color: 'var(--neon-primary)' }}>How It Works</p>
            <h2 className="text-3xl sm:text-5xl font-black" style={{ color: 'var(--text-primary)' }}>
              Four Steps to Your <span className="gradient-text">Perfect Build</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {showcaseSteps.map((step, i) => (
              <div key={step.num}
                className={`group relative rounded-2xl p-6 border transition-all duration-700 hover-lift ${stepsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-subtle)',
                  transitionDelay: `${300 + i * 150}ms`,
                }}>
                {/* Step number */}
                <div className="absolute -top-4 -left-2 text-7xl font-black opacity-[0.04] pointer-events-none"
                  style={{ color: 'var(--neon-primary)' }}>{step.num}</div>

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                    style={{ background: 'color-mix(in srgb, var(--accent-1) 12%, transparent)' }}>
                    {step.icon}
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--neon-primary)' }}>
                    Step {step.num}
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                </div>

                {/* Connector line (not on last) */}
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px" style={{ background: 'var(--border-subtle)' }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--neon-primary)' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURES — Premium cards ═══════════════════════ */}
      <section className="py-28 relative" ref={featuresReveal.ref}>
        <div className="absolute inset-0" style={{ background: 'color-mix(in srgb, var(--accent-2) 2%, var(--bg-dark))' }} />
        <div className="absolute inset-0 grid-pattern opacity-15" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`text-center mb-16 transition-all duration-800 ${featuresReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-sm font-bold uppercase tracking-[0.25em] mb-4" style={{ color: 'var(--neon-primary)' }}>
              Powerful Features
            </p>
            <h2 className="text-3xl sm:text-5xl font-black mb-5" style={{ color: 'var(--text-primary)' }}>
              Everything You Need to <span className="gradient-text">Build Smart</span>
            </h2>
            <p className="max-w-xl mx-auto text-base" style={{ color: 'var(--text-secondary)' }}>
              From selecting components to placing your order — powerful tools and a stunning 3D interface.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={f.title}
                className={`group glow-card rounded-2xl p-7 border transition-all duration-700 ${featuresReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)', transitionDelay: `${200 + i * 100}ms` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-all duration-500 group-hover:scale-110"
                  style={{ background: 'color-mix(in srgb, var(--accent-1) 12%, transparent)' }}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 transition-colors" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA — Final call to action ═══════════════════════ */}
      <section className="py-28 relative" ref={ctaReveal.ref}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className={`relative rounded-3xl p-14 overflow-hidden border transition-all duration-800 ${ctaReveal.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ borderColor: 'color-mix(in srgb, var(--accent-1) 25%, transparent)', background: 'var(--bg-card)' }}>
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 10%, transparent), color-mix(in srgb, var(--accent-2) 10%, transparent))' }} />
            <div className="absolute inset-0 grid-pattern opacity-15" />

            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full animate-glow-pulse"
              style={{ background: 'color-mix(in srgb, var(--accent-1) 10%, transparent)', filter: 'blur(50px)' }} />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full animate-glow-pulse"
              style={{ background: 'color-mix(in srgb, var(--accent-2) 10%, transparent)', filter: 'blur(50px)', animationDelay: '1.5s' }} />

            <div className="relative">
              <h2 className="text-3xl sm:text-5xl font-black mb-5" style={{ color: 'var(--text-primary)' }}>
                Ready to Build Your <span className="gradient-text">Dream Setup?</span>
              </h2>
              <p className="mb-10 max-w-xl mx-auto text-base" style={{ color: 'var(--text-secondary)' }}>
                Whether you're building a gaming rig, content creation powerhouse, or home office workstation — start here.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/builder"
                  className="group btn-primary px-10 py-4 rounded-2xl font-bold text-white text-base hover-lift inline-flex items-center gap-2">
                  Open PC Builder
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link to="/viewer"
                  className="btn-secondary px-10 py-4 rounded-2xl font-medium text-base hover-lift"
                  style={{ color: 'var(--text-secondary)' }}>
                  View 3D Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
