import { useState, Suspense } from 'react';
import { useBuilderStore } from '../store/builderStore';
import ComponentSelector from '../components/builder/ComponentSelector';
import CompatibilityChecker from '../components/builder/CompatibilityChecker';
import CompatibilityGuide from '../components/builder/CompatibilityGuide';
import PriceEstimate from '../components/builder/PriceEstimate';
import PCScene from '../components/three/PCScene';
import {
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  REQUIRED_CATEGORIES,
  PERIPHERAL_CATEGORIES,
} from '../data/components';
import type { ComponentCategory } from '../types';

const ALL_CATEGORIES: ComponentCategory[] = [...REQUIRED_CATEGORIES, ...PERIPHERAL_CATEGORIES];

export default function Builder() {
  const { activeCategory, setActiveCategory, clearBuild, totalPrice, selectedComponents, compatibilityIssues } =
    useBuilderStore();
  const [showScene, setShowScene] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileRightOpen, setMobileRightOpen] = useState(false);

  const hasErrors = compatibilityIssues.some((i) => i.type === 'error');
  const selectedCount = Object.keys(selectedComponents).length;
  const progress = Math.round((selectedCount / ALL_CATEGORIES.length) * 100);

  return (
    <div className="min-h-screen pt-16 bg-theme-dark">
      {/* Header */}
      <div className="border-b sticky top-16 z-30" style={{ background: 'color-mix(in srgb, var(--bg-dark) 80%, transparent)', backdropFilter: 'blur(12px)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Mobile sidebar toggle */}
            <button
              className="lg:hidden p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              aria-label="Toggle categories"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
            <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              PC Builder
            </h1>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-card-hover)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--neon-primary), var(--neon-secondary))' }}
                />
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {selectedCount}/{ALL_CATEGORIES.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalPrice > 0 && (
              <span className="text-sm font-bold gradient-text">
                ${totalPrice.toLocaleString()}
              </span>
            )}
            {hasErrors && (
              <span className="hidden sm:flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{ color: '#f87171', background: 'color-mix(in srgb, #dc2626 20%, transparent)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#f87171' }} />
                Issue
              </span>
            )}
            <button
              onClick={() => setMobileRightOpen(true)}
              className="lg:hidden btn-secondary px-2 py-1.5 rounded-lg text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Summary
            </button>
            <button
              onClick={() => setShowScene(!showScene)}
              className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showScene ? "M4 6h16M4 12h16M4 18h7" : "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"} />
              </svg>
              <span className="hidden sm:inline">{showScene ? 'List' : '3D'}</span>
            </button>
            <button
              onClick={clearBuild}
              className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ color: '#f87171' }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">

          {/* ── Left: Category Sidebar (hidden on mobile, shown via overlay) ── */}
          <div className={`${mobileSidebarOpen ? 'fixed inset-0 z-40 lg:static lg:z-auto' : 'hidden lg:block'} w-full lg:w-[260px] flex-shrink-0`}>
            {/* Mobile backdrop */}
            {mobileSidebarOpen && (
              <div className="absolute inset-0 bg-black/60 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
            )}
            <div
              className="relative z-10 h-full lg:h-auto overflow-y-auto space-y-1 p-4 lg:p-0"
              style={{ background: mobileSidebarOpen ? 'var(--bg-card)' : 'transparent', maxWidth: mobileSidebarOpen ? '280px' : 'none' }}
            >
              {mobileSidebarOpen && (
                <div className="flex items-center justify-between mb-4 lg:hidden">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Categories</h3>
                  <button onClick={() => setMobileSidebarOpen(false)} style={{ color: 'var(--text-muted)' }}>✕</button>
                </div>
              )}
              <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-1" style={{ color: 'var(--text-muted)' }}>
                Core Components
              </p>
              {REQUIRED_CATEGORIES.map((cat) => {
                const sel = selectedComponents[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setMobileSidebarOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 border"
                    style={activeCategory === cat ? {
                      background: 'color-mix(in srgb, var(--accent-1) 20%, transparent)',
                      borderColor: 'color-mix(in srgb, var(--neon-primary) 30%, transparent)',
                      color: 'var(--neon-primary)',
                    } : {
                      color: 'var(--text-secondary)',
                      borderColor: 'transparent',
                    }}
                  >
                    <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{CATEGORY_LABELS[cat]}</p>
                      {sel && (
                        <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                          {sel.brand} {sel.name.split(' ').slice(0, 2).join(' ')}
                        </p>
                      )}
                    </div>
                    {sel ? (
                      <span className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'var(--neon-primary)' }}>
                        <svg className="w-2.5 h-2.5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full border flex-shrink-0" style={{ borderColor: 'var(--text-muted)' }} />
                    )}
                  </button>
                );
              })}

              <p className="text-xs font-semibold uppercase tracking-wider mt-5 mb-3 px-1" style={{ color: 'var(--text-muted)' }}>
                Peripherals
              </p>
              {PERIPHERAL_CATEGORIES.map((cat) => {
                const sel = selectedComponents[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setMobileSidebarOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 border"
                    style={activeCategory === cat ? {
                      background: 'color-mix(in srgb, var(--accent-2) 20%, transparent)',
                      borderColor: 'color-mix(in srgb, var(--neon-secondary) 30%, transparent)',
                      color: 'var(--neon-secondary)',
                    } : {
                      color: 'var(--text-secondary)',
                      borderColor: 'transparent',
                    }}
                  >
                    <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{CATEGORY_LABELS[cat]}</p>
                      {sel && (
                        <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{sel.name}</p>
                      )}
                    </div>
                    {sel && (
                      <span className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'var(--neon-secondary)' }}>
                        <svg className="w-2.5 h-2.5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Center: Component list or 3D ──────────────────────── */}
          <div className="flex-1 min-w-0">
            {showScene ? (
              <div className="rounded-2xl overflow-hidden border h-[600px]" style={{ borderColor: 'var(--border-subtle)' }}>
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--bg-card)' }}>
                      <p className="text-sm animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading 3D scene…</p>
                    </div>
                  }
                >
                  <PCScene
                    compact={false}
                    glowColor="#00f5ff"
                    showPeripherals
                    showMonitor
                    orbitControlsEnabled
                  />
                </Suspense>
              </div>
            ) : (
              <div className="rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                <ComponentSelector
                  category={activeCategory}
                  onSelect={() => {/* category auto-advances */}}
                />
              </div>
            )}
          </div>

          {/* ── Right: Summary sidebar (hidden on mobile, shown via overlay) ── */}
          <div className={`${mobileRightOpen ? 'fixed inset-0 z-40 lg:static lg:z-auto' : 'hidden lg:block'} w-full lg:w-[300px] flex-shrink-0`}>
            {mobileRightOpen && (
              <div className="absolute inset-0 bg-black/60 lg:hidden" onClick={() => setMobileRightOpen(false)} />
            )}
            <div
              className="relative z-10 h-full lg:h-auto overflow-y-auto space-y-4 p-4 lg:p-0"
              style={{ background: mobileRightOpen ? 'var(--bg-card)' : 'transparent', marginLeft: mobileRightOpen ? 'auto' : '0', maxWidth: mobileRightOpen ? '320px' : 'none' }}
            >
              {mobileRightOpen && (
                <div className="flex items-center justify-between mb-2 lg:hidden">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Build Summary</h3>
                  <button onClick={() => setMobileRightOpen(false)} style={{ color: 'var(--text-muted)' }}>✕</button>
                </div>
              )}

              <div className="rounded-2xl border p-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Compatibility
                </h3>
                <CompatibilityChecker />
              </div>

              <div className="rounded-2xl border p-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  💡 Recommendations
                </h3>
                <CompatibilityGuide />
              </div>

              <div className="rounded-2xl border p-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--neon-primary)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Price Estimate
                </h3>
                <PriceEstimate />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
