import { Link } from 'react-router-dom';
import { Suspense } from 'react';
import PCScene from '../components/three/PCScene';

const features = [
  {
    icon: '🎮',
    title: '3D Interactive Viewer',
    desc: 'Explore every component with our real-time 3D renderer. Rotate, zoom, and inspect your build from every angle.',
  },
  {
    icon: '⚡',
    title: 'Compatibility Checking',
    desc: 'Real-time compatibility validation ensures your CPU, motherboard, RAM, and cooling all work together.',
  },
  {
    icon: '🛒',
    title: 'Buy Any Component',
    desc: 'Every component links directly to Amazon. Compare prices and purchase your entire build in minutes.',
  },
  {
    icon: '📐',
    title: 'Build Estimator',
    desc: 'Get an instant price estimate as you add components. See where your money is going in real time.',
  },
  {
    icon: '🏆',
    title: 'Expert Presets',
    desc: 'Start with an expert-curated preset for gaming, workstation, streaming, or budget builds.',
  },
  {
    icon: '🌍',
    title: 'Global Components',
    desc: 'CPUs, GPUs, RAM, and more from AMD, Intel, NVIDIA, Corsair, ASUS, and all major brands worldwide.',
  },
];

const stats = [
  { value: '50+', label: 'Components' },
  { value: '6', label: 'Preset Builds' },
  { value: '100%', label: 'Free to Use' },
  { value: '3D', label: 'Real-time View' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080c14] via-transparent to-[#080c14]" />

        {/* Glows */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12 grid lg:grid-cols-2 items-center gap-12 w-full">
          {/* Left – Copy */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/30 border border-blue-500/25 text-xs text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Futuristic 3D PC Builder — Now Live
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
              Build Your
              <br />
              <span className="gradient-text">Dream PC</span>
              <br />
              <span className="text-slate-300">in 3D</span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
              The world's most immersive PC configurator. Select components, check compatibility,
              visualize in real-time 3D, and purchase everything in one place.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/builder"
                className="btn-primary px-6 py-3 rounded-xl text-base font-semibold text-white inline-flex items-center gap-2"
              >
                Start Building
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/presets"
                className="btn-secondary px-6 py-3 rounded-xl text-base font-medium text-slate-300 inline-flex items-center gap-2"
              >
                View Presets
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 pt-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-xl sm:text-2xl font-black gradient-text">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right – 3D Scene */}
          <div className="h-[500px] lg:h-[600px] rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 rounded-2xl border border-white/5 bg-gradient-to-b from-transparent to-[#080c14]/60 pointer-events-none z-10" />
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-slate-500 text-sm animate-pulse">Loading 3D View…</div>
                </div>
              }
            >
              <PCScene
                glowColor="#00f5ff"
                showPeripherals
                showMonitor
                autoRotateCase={false}
                orbitControlsEnabled={true}
              />
            </Suspense>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
              <span className="text-xs text-slate-600 bg-black/40 px-3 py-1 rounded-full">
                🖱️ Drag to rotate · Scroll to zoom
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Everything You Need to{' '}
              <span className="gradient-text">Build Smart</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              From selecting components to placing your order — we've got every step covered with
              powerful tools and a stunning 3D interface.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="card-bg rounded-2xl p-6 border border-white/5 hover:border-blue-500/25 transition-all duration-300 group"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-base font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="relative rounded-2xl p-12 overflow-hidden border border-blue-500/20 gradient-border">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Ready to Build Your{' '}
                <span className="gradient-text">Dream Setup?</span>
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Whether you're building a gaming rig, a content creation powerhouse, or a home
                office workstation — start here.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to="/builder"
                  className="btn-primary px-8 py-3.5 rounded-xl font-semibold text-white text-base"
                >
                  Open PC Builder →
                </Link>
                <Link
                  to="/viewer"
                  className="btn-secondary px-8 py-3.5 rounded-xl font-medium text-slate-300 text-base"
                >
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
