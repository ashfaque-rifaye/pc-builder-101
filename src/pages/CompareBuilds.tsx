import { useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useBuilderStore } from '../store/builderStore';
import { useUiStore } from '../store/uiStore';
import { presetBuilds, CATEGORY_LABELS, CATEGORY_ICONS } from '../data/components';
import { formatPrice, getRegion } from '../data/regions';
import BuildScene from '../components/three/BuildScene';
import type { ComponentCategory } from '../types';

export default function CompareBuilds() {
  const { selectedComponents, totalPrice } = useBuilderStore();
  const { region } = useUiStore();
  const regionConfig = getRegion(region);

  // Build A = current build
  const buildA = {
    name: 'Your Build',
    components: selectedComponents,
    totalPrice,
  };

  // Build B = selected preset
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const preset = presetBuilds[selectedPresetIdx];
  const buildB = {
    name: preset?.name ?? 'Preset',
    components: preset?.components ?? {},
    totalPrice: preset?.totalPrice ?? 0,
  };

  const allCategories = new Set<ComponentCategory>();
  for (const cat of Object.keys(buildA.components)) allCategories.add(cat as ComponentCategory);
  for (const cat of Object.keys(buildB.components)) allCategories.add(cat as ComponentCategory);
  const categories = [...allCategories].sort();

  return (
    <div className="min-h-screen pt-16 bg-theme-dark">
      {/* Header */}
      <div
        className="border-b sticky top-16 z-30"
        style={{
          background: 'color-mix(in srgb, var(--bg-dark) 85%, transparent)',
          backdropFilter: 'blur(16px)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/build"
              className="flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              ← Back to Build
            </Link>
            <span className="w-px h-4" style={{ background: 'var(--border-subtle)' }} />
            <h1 className="text-base font-bold gradient-text">⚖️ Compare Builds</h1>
          </div>
          <select
            value={selectedPresetIdx}
            onChange={(e) => setSelectedPresetIdx(Number(e.target.value))}
            className="text-xs px-3 py-1.5 rounded-lg border"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            {presetBuilds.map((p, i) => (
              <option key={p.id} value={i}>
                Compare with: {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3D Side-by-Side */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Build A */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)', height: '400px' }}>
            <div className="px-4 py-2 border-b flex items-center justify-between"
              style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="text-sm font-bold" style={{ color: 'var(--neon-primary)' }}>🟢 Your Build</span>
              <span className="text-sm font-bold gradient-text">
                {regionConfig.currencySymbol}{Math.round(buildA.totalPrice * regionConfig.usdRate).toLocaleString()}
              </span>
            </div>
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin w-8 h-8 rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--neon-primary)' }} />
              </div>
            }>
              <BuildScene
                components={buildA.components}
                highlightedComponent={null}
                exploded={false}
              />
            </Suspense>
          </div>

          {/* Build B */}
          <div className="rounded-2xl overflow-hidden border"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)', height: '400px' }}>
            <div className="px-4 py-2 border-b flex items-center justify-between"
              style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="text-sm font-bold" style={{ color: 'var(--neon-secondary)' }}>🟣 {buildB.name}</span>
              <span className="text-sm font-bold gradient-text">
                {regionConfig.currencySymbol}{Math.round(buildB.totalPrice * regionConfig.usdRate).toLocaleString()}
              </span>
            </div>
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin w-8 h-8 rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--neon-secondary)' }} />
              </div>
            }>
              <BuildScene
                components={buildB.components}
                highlightedComponent={null}
                exploded={false}
                glowColor="#aa44ff"
              />
            </Suspense>
          </div>
        </div>

        {/* Spec Comparison Table */}
        <div className="rounded-2xl border overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Component Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--bg-card-hover)' }}>
                  <th className="px-4 py-2 text-left text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Category</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold" style={{ color: 'var(--neon-primary)' }}>Your Build</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold" style={{ color: 'var(--neon-secondary)' }}>{buildB.name}</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => {
                  const compA = buildA.components[cat];
                  const compB = buildB.components[cat];
                  return (
                    <tr key={cat} className="border-t" style={{ borderColor: 'color-mix(in srgb, var(--border-subtle) 50%, transparent)' }}>
                      <td className="px-4 py-2.5">
                        <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                          {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        {compA ? (
                          <div>
                            <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{compA.brand} {compA.name}</p>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{formatPrice(compA.price, region)}</p>
                          </div>
                        ) : (
                          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        {compB ? (
                          <div>
                            <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{compB.brand} {compB.name}</p>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{formatPrice(compB.price, region)}</p>
                          </div>
                        ) : (
                          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {/* Total row */}
                <tr className="border-t-2" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card-hover)' }}>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Total</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-black gradient-text">
                      {regionConfig.currencySymbol}
                      {Math.round(buildA.totalPrice * regionConfig.usdRate).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-black gradient-text">
                      {regionConfig.currencySymbol}
                      {Math.round(buildB.totalPrice * regionConfig.usdRate).toLocaleString()}
                    </span>
                  </td>
                </tr>
                {/* Price difference */}
                <tr style={{ background: 'color-mix(in srgb, var(--accent-1) 10%, var(--bg-card))' }}>
                  <td className="px-4 py-2">
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Difference</span>
                  </td>
                  <td colSpan={2} className="px-4 py-2 text-center">
                    {(() => {
                      const diff = buildA.totalPrice - buildB.totalPrice;
                      const absDiff = Math.abs(Math.round(diff * regionConfig.usdRate));
                      return (
                        <span className="text-sm font-bold" style={{ color: diff < 0 ? '#4ade80' : diff > 0 ? '#f87171' : 'var(--text-muted)' }}>
                          {diff < 0 ? `Your build is ${regionConfig.currencySymbol}${absDiff} cheaper` :
                           diff > 0 ? `Your build is ${regionConfig.currencySymbol}${absDiff} more expensive` :
                           'Same price'}
                        </span>
                      );
                    })()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
