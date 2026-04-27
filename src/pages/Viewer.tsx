import { Suspense, useState } from 'react';
import PCScene from '../components/three/PCScene';

const glowOptions = [
  { label: 'Cyan', value: '#00f5ff' },
  { label: 'Purple', value: '#b400ff' },
  { label: 'Green', value: '#00ff88' },
  { label: 'Orange', value: '#ff6b00' },
  { label: 'Pink', value: '#ff0088' },
  { label: 'White', value: '#ffffff' },
];

export default function Viewer() {
  const [glowColor, setGlowColor] = useState('#00f5ff');
  const [showPeripherals, setShowPeripherals] = useState(true);
  const [showMonitor, setShowMonitor] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);

  return (
    <div className="min-h-screen pt-16 flex flex-col page-enter" style={{ background: 'var(--bg-dark)' }}>
      {/* Header */}
      <div className="border-b px-4 sm:px-6 py-4" style={{ borderColor: 'var(--border-subtle)', background: 'color-mix(in srgb, var(--bg-dark) 80%, transparent)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              3D <span className="gradient-text">PC Viewer</span>
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Interactive 3D model of your PC setup. Drag to rotate, scroll to zoom.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Glow color */}
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Glow:</span>
              <div className="flex gap-1">
                {glowOptions.map((opt) => (
                  <button
                    key={opt.value}
                    title={opt.label}
                    onClick={() => setGlowColor(opt.value)}
                    className={`w-5 h-5 rounded-full border-2 transition-transform ${
                      glowColor === opt.value ? 'border-white scale-125' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: opt.value }}
                  />
                ))}
              </div>
            </div>

            <div className="w-px h-5" style={{ background: 'var(--border-subtle)' }} />

            {/* Toggles */}
            {[
              { label: 'Monitor', value: showMonitor, set: setShowMonitor },
              { label: 'Peripherals', value: showPeripherals, set: setShowPeripherals },
              { label: 'Auto-Rotate Case', value: autoRotate, set: setAutoRotate },
            ].map(({ label, value, set }) => (
              <button
                key={label}
                onClick={() => set(!value)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
                style={value ? {
                  background: 'color-mix(in srgb, var(--accent-1) 20%, transparent)',
                  color: 'var(--neon-primary)',
                  borderColor: 'color-mix(in srgb, var(--neon-primary) 30%, transparent)',
                } : {
                  background: 'var(--bg-card)',
                  color: 'var(--text-muted)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Scene (full height) */}
      <div className="flex-1 relative" style={{ minHeight: '600px' }}>
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0">
          <Suspense
            fallback={
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--neon-primary)', borderTopColor: 'transparent' }} />
                  <p className="text-sm animate-pulse" style={{ color: 'var(--text-muted)' }}>Initializing 3D renderer…</p>
              </div>
            }
          >
            <PCScene
              glowColor={glowColor}
              showPeripherals={showPeripherals}
              showMonitor={showMonitor}
              autoRotateCase={autoRotate}
              orbitControlsEnabled={true}
              compact={false}
            />
          </Suspense>
        </div>

        {/* Overlay tips */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-10">
          <div className="flex items-center gap-4 glass rounded-full px-4 py-2 border" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              Drag to orbit
            </span>
            <span className="w-px h-3" style={{ background: 'var(--border-subtle)' }} />
            <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              Scroll to zoom
            </span>
            <span className="w-px h-3" style={{ background: 'var(--border-subtle)' }} />
            <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Right-drag to pan
            </span>
          </div>
        </div>
      </div>

      {/* Info panel */}
      <div className="border-t" style={{ borderColor: 'var(--border-subtle)', background: 'color-mix(in srgb, var(--bg-dark) 80%, transparent)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: '🎨',
                title: 'Real-time Rendering',
                desc: 'Built with Three.js & React Three Fiber for smooth 60fps interactive 3D.',
              },
              {
                icon: '💡',
                title: 'Dynamic Lighting',
                desc: 'Realistic PBR materials with environment lighting, reflections and glow effects.',
              },
              {
                icon: '⚙️',
                title: 'Customize Colors',
                desc: 'Change glow and RGB colors to match your dream setup aesthetic.',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
