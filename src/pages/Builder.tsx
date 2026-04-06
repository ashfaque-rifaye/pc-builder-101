import { useState, Suspense } from 'react';
import { useBuilderStore } from '../store/builderStore';
import ComponentSelector from '../components/builder/ComponentSelector';
import CompatibilityChecker from '../components/builder/CompatibilityChecker';
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

  const hasErrors = compatibilityIssues.some((i) => i.type === 'error');
  const selectedCount = Object.keys(selectedComponents).length;
  const progress = Math.round((selectedCount / ALL_CATEGORIES.length) * 100);

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#080c14]/80 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-base font-bold text-white">PC Builder</h1>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-slate-500">
                {selectedCount}/{ALL_CATEGORIES.length} selected
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {totalPrice > 0 && (
              <span className="text-sm font-bold gradient-text">${totalPrice.toLocaleString()}</span>
            )}
            {hasErrors && (
              <span className="flex items-center gap-1 text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                Compatibility Issue
              </span>
            )}
            <button
              onClick={() => setShowScene(!showScene)}
              className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 flex items-center gap-1.5"
            >
              {showScene ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  List View
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  3D View
                </>
              )}
            </button>
            <button
              onClick={clearBuild}
              className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-[280px_1fr_300px] gap-6">

          {/* ── Left: Category Sidebar ──────────────────────────── */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
              Core Components
            </p>
            {REQUIRED_CATEGORIES.map((cat) => {
              const sel = selectedComponents[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                    activeCategory === cat
                      ? 'bg-blue-900/30 border border-cyan-400/30 text-cyan-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{CATEGORY_LABELS[cat]}</p>
                    {sel && (
                      <p className="text-[10px] text-slate-500 truncate">{sel.brand} {sel.name.split(' ').slice(0, 2).join(' ')}</p>
                    )}
                  </div>
                  {sel ? (
                    <span className="w-4 h-4 bg-cyan-400 rounded-full flex-shrink-0 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                  )}
                </button>
              );
            })}

            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-5 mb-3 px-1">
              Peripherals
            </p>
            {PERIPHERAL_CATEGORIES.map((cat) => {
              const sel = selectedComponents[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                    activeCategory === cat
                      ? 'bg-purple-900/30 border border-purple-400/30 text-purple-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{CATEGORY_LABELS[cat]}</p>
                    {sel && (
                      <p className="text-[10px] text-slate-500 truncate">{sel.name}</p>
                    )}
                  </div>
                  {sel && (
                    <span className="w-4 h-4 bg-purple-400 rounded-full flex-shrink-0 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Center: Component list or 3D ──────────────────── */}
          <div>
            {showScene ? (
              <div className="rounded-2xl overflow-hidden border border-white/5 h-[600px]">
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center bg-[#0d1526]">
                      <p className="text-slate-500 animate-pulse">Loading 3D scene…</p>
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
              <div className="card-bg rounded-2xl border border-white/5 p-5">
                <ComponentSelector
                  category={activeCategory}
                  onSelect={() => {/* category auto-advances */}}
                />
              </div>
            )}
          </div>

          {/* ── Right: Summary sidebar ────────────────────────── */}
          <div className="space-y-4">
            <div className="card-bg rounded-2xl border border-white/5 p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Compatibility
              </h3>
              <CompatibilityChecker />
            </div>

            <div className="card-bg rounded-2xl border border-white/5 p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
}
