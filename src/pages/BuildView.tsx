import { useState, useEffect, Suspense, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBuilderStore } from '../store/builderStore';
import { useUiStore } from '../store/uiStore';
import { CATEGORY_LABELS, CATEGORY_ICONS, REQUIRED_CATEGORIES } from '../data/components';
import { formatPrice, getRegion } from '../data/regions';
import { getProductUrls, getPurchaseLinks, scrapeProduct, checkApiHealth } from '../services/api';
import type { ScrapedProduct } from '../services/api';
import type { ComponentCategory, AnyPCComponent } from '../types';
import BuildScene from '../components/three/BuildScene';
import { useAssemblyAnimation } from '../hooks/useAssemblyAnimation';
import type { CameraPreset } from '../components/three/CameraController';
import { CAMERA_PRESETS } from '../components/three/CameraController';

type LivePrices = Partial<Record<ComponentCategory, ScrapedProduct>>;

const RGB_COLORS = [
  { label: 'Cyan', color: '#00ccff' },
  { label: 'Purple', color: '#aa44ff' },
  { label: 'Green', color: '#00ff88' },
  { label: 'Orange', color: '#ff8800' },
  { label: 'Pink', color: '#ff44aa' },
  { label: 'White', color: '#ffffff' },
  { label: 'Red', color: '#ff2244' },
  { label: 'Gold', color: '#ffcc00' },
];

export default function BuildView() {
  const { selectedComponents, totalPrice, compatibilityIssues } = useBuilderStore();
  const { region } = useUiStore();
  const navigate = useNavigate();
  const regionConfig = getRegion(region);

  const [highlightedComponent, setHighlightedComponent] = useState<ComponentCategory | null>(null);
  const [exploded, setExploded] = useState(false);
  const [livePrices, setLivePrices] = useState<LivePrices>({});
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [activeDetail, setActiveDetail] = useState<ComponentCategory | null>(null);

  // New feature states
  const [glowColor, setGlowColor] = useState('#00ccff');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [cameraActive, setCameraActive] = useState(false);
  const [showAirflow, setShowAirflow] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const allEntries = Object.entries(selectedComponents) as [ComponentCategory, AnyPCComponent][];
  const requiredMissing = REQUIRED_CATEGORIES.filter((c) => !selectedComponents[c]);
  const hasErrors = compatibilityIssues.some((i) => i.type === 'error');

  // Assembly animation
  const availableCategories = allEntries.map(([cat]) => cat);
  const [assemblyState, assemblyControls] = useAssemblyAnimation(availableCategories);

  // Redirect if no components selected
  useEffect(() => {
    if (allEntries.length === 0) {
      navigate('/builder');
    }
  }, [allEntries.length, navigate]);

  // Check API health & fetch live prices
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const healthy = await checkApiHealth();
      if (cancelled) return;
      setApiAvailable(healthy);

      if (healthy && allEntries.length > 0) {
        setLoadingPrices(true);
        const prices: LivePrices = {};

        for (const [category, component] of allEntries) {
          const productUrls = (component as AnyPCComponent & { productUrls?: Record<string, string> }).productUrls;
          if (!productUrls) continue;

          const urls = getProductUrls(productUrls, region);
          if (urls.length > 0) {
            const result = await scrapeProduct(urls[0].url);
            if (result && !cancelled) {
              prices[category] = result;
            }
          }
        }

        if (!cancelled) {
          setLivePrices(prices);
          setLoadingPrices(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [region]); // eslint-disable-line react-hooks/exhaustive-deps

  const getComponentUrl = useCallback((component: AnyPCComponent): { url: string; retailer: string } | null => {
    const comp = component as AnyPCComponent & { productUrls?: Record<string, string> };
    if (comp.productUrls) {
      const purchaseLinks = getPurchaseLinks(comp.productUrls, region, `${component.brand} ${component.name}`);
      if (purchaseLinks.length > 0) {
        return { url: purchaseLinks[0].url, retailer: purchaseLinks[0].retailer.name };
      }
    }
    const fallbackUrl = component.regionalUrls?.[region] ?? component.affiliateUrl;
    return { url: fallbackUrl, retailer: regionConfig.amazonDomain };
  }, [region, regionConfig.amazonDomain]);

  const getAllRetailerUrls = useCallback((component: AnyPCComponent) => {
    const comp = component as AnyPCComponent & { productUrls?: Record<string, string> };
    if (comp.productUrls) {
      return getPurchaseLinks(comp.productUrls, region, `${component.brand} ${component.name}`);
    }
    return [];
  }, [region]);

  // Camera preset handler
  const handleCameraPreset = useCallback((preset: CameraPreset) => {
    setCameraPreset(preset);
    setCameraActive(true);
  }, []);

  // Screenshot capture
  const handleScreenshot = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `pc-build-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, []);

  // Export build as JSON
  const handleExport = useCallback(() => {
    const buildData = {
      components: allEntries.map(([cat, comp]) => ({
        category: cat,
        brand: comp.brand,
        name: comp.name,
        price: comp.price,
        specs: comp.specs,
      })),
      totalPrice,
      region,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(buildData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `pc-build-${Date.now()}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [allEntries, totalPrice, region]);

  if (allEntries.length === 0) return null;

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
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/builder"
              className="flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Builder
            </Link>
            <span className="w-px h-4" style={{ background: 'var(--border-subtle)' }} />
            <h1 className="text-base font-bold gradient-text">Your Build</h1>
            {apiAvailable && (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                style={{ color: '#4ade80', background: 'color-mix(in srgb, #16a34a 15%, transparent)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live Pricing
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExploded(!exploded)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                exploded ? 'border-cyan-500/30' : 'border-transparent'
              }`}
              style={exploded
                ? { color: 'var(--neon-primary)', background: 'color-mix(in srgb, var(--neon-primary) 15%, transparent)' }
                : { color: 'var(--text-secondary)', background: 'color-mix(in srgb, white 5%, transparent)' }
              }
            >
              {exploded ? '🔩 Assembled' : '💥 Exploded View'}
            </button>

            <button
              onClick={() => assemblyState.phase === 'idle' ? assemblyControls.play() : assemblyControls.reset()}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border border-transparent"
              style={{
                color: assemblyState.phase !== 'idle' ? 'var(--neon-secondary)' : 'var(--text-secondary)',
                background: assemblyState.phase !== 'idle'
                  ? 'color-mix(in srgb, var(--neon-secondary) 15%, transparent)'
                  : 'color-mix(in srgb, white 5%, transparent)',
              }}
            >
              {assemblyState.phase !== 'idle' ? '⏹ Stop Assembly' : '🔨 Assembly Animation'}
            </button>

            <Link
              to="/compare"
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border border-transparent"
              style={{ color: 'var(--text-secondary)', background: 'color-mix(in srgb, white 5%, transparent)' }}
            >
              ⚖️ Compare
            </Link>

            <span className="text-lg font-black gradient-text">
              {regionConfig.currencySymbol}
              {Math.round(totalPrice * regionConfig.usdRate).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── 3D Viewer (Main) ────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div
              className="rounded-2xl overflow-hidden border relative"
              style={{
                borderColor: 'var(--border-subtle)',
                background: 'radial-gradient(ellipse at center, color-mix(in srgb, var(--accent-1) 5%, var(--bg-dark)), var(--bg-dark))',
                height: 'calc(100vh - 180px)',
                minHeight: '500px',
              }}
            >
              <Suspense
                fallback={
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    <div className="w-14 h-14 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: 'var(--neon-primary)', borderTopColor: 'transparent' }} />
                    <p className="text-sm animate-pulse" style={{ color: 'var(--text-muted)' }}>
                      Building your PC in 3D…
                    </p>
                  </div>
                }
              >
                <BuildScene
                  components={selectedComponents}
                  highlightedComponent={highlightedComponent}
                  exploded={exploded}
                  glowColor={glowColor}
                  cameraPreset={cameraPreset}
                  cameraActive={cameraActive}
                  onCameraReached={() => setCameraActive(false)}
                  visibleCategories={assemblyState.phase !== 'idle' ? assemblyState.visibleCategories : undefined}
                  animatingCategory={assemblyState.activeCategory}
                  animationProgress={assemblyState.stepProgress}
                  showAirflow={showAirflow}
                />
              </Suspense>

              {/* Controls overlay */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none z-10">
                <div className="flex items-center gap-4 rounded-full px-4 py-2 border"
                  style={{ background: 'color-mix(in srgb, var(--bg-dark) 80%, transparent)', backdropFilter: 'blur(12px)', borderColor: 'var(--border-subtle)' }}>
                  <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>🖱️ Drag to orbit</span>
                  <span className="w-px h-3" style={{ background: 'var(--border-subtle)' }} />
                  <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>🔍 Scroll to zoom</span>
                  <span className="w-px h-3" style={{ background: 'var(--border-subtle)' }} />
                  <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>🎯 Hover components</span>
                </div>
              </div>

              {/* Component count badge */}
              <div className="absolute top-4 left-4 z-10">
                <div className="rounded-xl px-3 py-2 border"
                  style={{ background: 'color-mix(in srgb, var(--bg-dark) 85%, transparent)', backdropFilter: 'blur(12px)', borderColor: 'var(--border-subtle)' }}>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Components</p>
                  <p className="text-lg font-black gradient-text">{allEntries.length} / 12</p>
                </div>
              </div>

              {/* ── Floating Control Panel (top right) ──────────────── */}
              <div className="absolute top-4 right-4 z-10 space-y-2">
                <button
                  onClick={() => setShowControls(!showControls)}
                  className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all"
                  style={{ background: 'color-mix(in srgb, var(--bg-dark) 85%, transparent)', backdropFilter: 'blur(12px)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                >
                  ⚙️ {showControls ? 'Hide' : 'Show'} Controls
                </button>

                {showControls && (
                  <div className="rounded-xl border p-3 space-y-3 w-56"
                    style={{ background: 'color-mix(in srgb, var(--bg-dark) 90%, transparent)', backdropFilter: 'blur(16px)', borderColor: 'var(--border-subtle)' }}>

                    {/* RGB Color Picker */}
                    <div>
                      <p className="text-[10px] uppercase tracking-wider mb-1.5 font-semibold" style={{ color: 'var(--text-muted)' }}>🎨 RGB Color</p>
                      <div className="flex flex-wrap gap-1.5">
                        {RGB_COLORS.map(({ label, color }) => (
                          <button
                            key={color}
                            onClick={() => setGlowColor(color)}
                            className="w-6 h-6 rounded-full border-2 transition-all hover:scale-110"
                            style={{
                              background: color,
                              borderColor: glowColor === color ? '#fff' : 'transparent',
                              boxShadow: glowColor === color ? `0 0 8px ${color}` : 'none',
                            }}
                            title={label}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Camera Presets */}
                    <div>
                      <p className="text-[10px] uppercase tracking-wider mb-1.5 font-semibold" style={{ color: 'var(--text-muted)' }}>📷 Camera</p>
                      <div className="grid grid-cols-3 gap-1">
                        {(Object.entries(CAMERA_PRESETS) as [CameraPreset, { label: string; icon: string }][]).map(([key, { label, icon }]) => (
                          <button
                            key={key}
                            onClick={() => handleCameraPreset(key)}
                            className="px-1.5 py-1 rounded text-[10px] font-medium border transition-all hover:scale-105"
                            style={{
                              background: cameraPreset === key ? 'color-mix(in srgb, var(--neon-primary) 20%, transparent)' : 'color-mix(in srgb, white 5%, transparent)',
                              borderColor: cameraPreset === key ? 'var(--neon-primary)' : 'var(--border-subtle)',
                              color: cameraPreset === key ? 'var(--neon-primary)' : 'var(--text-muted)',
                            }}
                          >
                            {icon} {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>🛠️ Visualization</p>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={showAirflow} onChange={(e) => setShowAirflow(e.target.checked)}
                          className="w-3.5 h-3.5 rounded accent-cyan-500" />
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>💨 Airflow</span>
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5">
                      <button onClick={handleScreenshot}
                        className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-medium border transition-all hover:scale-105"
                        style={{ background: 'color-mix(in srgb, white 5%, transparent)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                        📸 Screenshot
                      </button>
                      <button onClick={handleExport}
                        className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-medium border transition-all hover:scale-105"
                        style={{ background: 'color-mix(in srgb, white 5%, transparent)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                        📥 Export
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Assembly Animation Bar (bottom) ─────────────────── */}
              {assemblyState.phase !== 'idle' && (
                <div className="absolute bottom-16 left-4 right-4 z-10">
                  <div className="rounded-xl border px-4 py-3"
                    style={{ background: 'color-mix(in srgb, var(--bg-dark) 90%, transparent)', backdropFilter: 'blur(16px)', borderColor: 'var(--border-subtle)' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        {assemblyState.currentStepIndex >= 0 && assemblyState.currentStepIndex < assemblyState.steps.length
                          ? `${assemblyState.steps[assemblyState.currentStepIndex].icon} ${assemblyState.steps[assemblyState.currentStepIndex].label}`
                          : '✅ Assembly Complete'}
                      </p>
                      <span className="text-[10px] ml-auto" style={{ color: 'var(--text-muted)' }}>
                        Step {Math.min(assemblyState.currentStepIndex + 1, assemblyState.steps.length)}/{assemblyState.steps.length}
                      </span>
                    </div>
                    {/* Progress dots */}
                    <div className="flex gap-1 mb-2">
                      {assemblyState.steps.map((step, i) => (
                        <button
                          key={step.category}
                          onClick={() => assemblyControls.jumpTo(i)}
                          className="flex-1 h-1.5 rounded-full transition-all cursor-pointer"
                          style={{
                            background: i < assemblyState.currentStepIndex
                              ? 'var(--neon-primary)'
                              : i === assemblyState.currentStepIndex
                              ? `linear-gradient(90deg, var(--neon-primary) ${assemblyState.stepProgress * 100}%, var(--bg-card-hover) ${assemblyState.stepProgress * 100}%)`
                              : 'var(--bg-card-hover)',
                          }}
                          title={step.label}
                        />
                      ))}
                    </div>
                    {/* Controls */}
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={assemblyControls.prevStep} className="p-1 rounded hover:bg-white/10 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                        ⏮
                      </button>
                      {assemblyState.phase === 'playing' ? (
                        <button onClick={assemblyControls.pause}
                          className="px-3 py-1 rounded-lg text-xs font-bold" style={{ background: 'var(--neon-primary)', color: '#000' }}>
                          ⏸ Pause
                        </button>
                      ) : (
                        <button onClick={assemblyControls.play}
                          className="px-3 py-1 rounded-lg text-xs font-bold" style={{ background: 'var(--neon-primary)', color: '#000' }}>
                          ▶ {assemblyState.phase === 'complete' ? 'Replay' : 'Play'}
                        </button>
                      )}
                      <button onClick={assemblyControls.nextStep} className="p-1 rounded hover:bg-white/10 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                        ⏭
                      </button>
                      <button onClick={assemblyControls.reset} className="p-1 rounded hover:bg-white/10 transition-colors text-xs"  style={{ color: 'var(--text-muted)' }}>
                        ↩ Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right Panel ─────────────────────────────────────────── */}
          <div className="w-full lg:w-[420px] flex-shrink-0 space-y-4">

            {/* Warnings */}
            {(requiredMissing.length > 0 || hasErrors) && (
              <div className="rounded-xl p-3 border"
                style={{ background: 'color-mix(in srgb, #dc2626 8%, var(--bg-card))', borderColor: 'color-mix(in srgb, #dc2626 20%, transparent)' }}>
                {requiredMissing.length > 0 && (
                  <p className="text-xs" style={{ color: '#fca5a5' }}>
                    ⚠️ Missing: {requiredMissing.map(c => CATEGORY_LABELS[c]).join(', ')}
                  </p>
                )}
                {hasErrors && (
                  <p className="text-xs mt-1" style={{ color: '#fca5a5' }}>
                    ❌ Compatibility issues detected — <Link to="/builder" className="underline">fix in builder</Link>
                  </p>
                )}
              </div>
            )}

            {/* Component List */}
            <div className="rounded-2xl border overflow-hidden"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
              <div className="px-4 py-3 border-b flex items-center justify-between"
                style={{ borderColor: 'var(--border-subtle)' }}>
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Build Components</h3>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {regionConfig.flag} {regionConfig.currency}
                  {loadingPrices && <span className="ml-1 animate-pulse">⏳</span>}
                </span>
              </div>

              <div className="max-h-[calc(100vh-420px)] overflow-y-auto divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                {allEntries.map(([category, component]) => {
                  const live = livePrices[category];
                  const isHighlighted = highlightedComponent === category;
                  const isExpanded = activeDetail === category;
                  const retailerUrls = getAllRetailerUrls(component);

                  return (
                    <div key={category} className="border-b" style={{ borderColor: 'color-mix(in srgb, var(--border-subtle) 50%, transparent)' }}>
                      <div
                        className="px-4 py-3 flex items-center gap-3 cursor-pointer transition-all group"
                        onMouseEnter={() => setHighlightedComponent(category)}
                        onMouseLeave={() => setHighlightedComponent(null)}
                        onClick={() => setActiveDetail(isExpanded ? null : category)}
                        style={isHighlighted ? {
                          background: 'color-mix(in srgb, var(--neon-primary) 8%, transparent)',
                        } : undefined}
                      >
                        <span className="text-lg flex-shrink-0">{CATEGORY_ICONS[category]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                            {CATEGORY_LABELS[category]}
                          </p>
                          <p className="text-sm font-medium truncate" style={{ color: isHighlighted ? 'var(--neon-primary)' : 'var(--text-primary)' }}>
                            {component.brand} {component.name}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {live?.price ? (
                            <div>
                              <p className="text-sm font-bold" style={{ color: '#4ade80' }}>
                                {live.price}
                              </p>
                              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>live</p>
                            </div>
                          ) : (
                            <p className="text-sm font-semibold" style={{ color: 'var(--neon-primary)' }}>
                              {formatPrice(component.price, region)}
                            </p>
                          )}
                        </div>
                        <svg className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          style={{ color: 'var(--text-muted)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <div className="px-4 pb-3 space-y-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                          {/* Specs */}
                          <div className="grid grid-cols-2 gap-1.5 pt-2">
                            {Object.entries(component.specs).map(([key, value]) => (
                              <div key={key} className="text-xs px-2 py-1 rounded"
                                style={{ background: 'var(--bg-card-hover)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>{key}: </span>
                                <span style={{ color: 'var(--text-secondary)' }}>{value}</span>
                              </div>
                            ))}
                          </div>

                          {/* Product Image */}
                          {(live?.image || component.image) && (
                            <div className="flex justify-center">
                              <img
                                src={live?.image || component.image}
                                alt={component.name}
                                className="h-24 w-auto rounded-lg object-contain"
                                style={{ background: 'var(--bg-card-hover)' }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            </div>
                          )}

                          {/* Retailer Links */}
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-semibold uppercase tracking-wider"
                              style={{ color: 'var(--text-muted)' }}>Buy from</p>
                            {retailerUrls.length > 0 ? (
                              <div className="grid grid-cols-1 gap-1.5">
                                {retailerUrls.map(({ retailer, url }) => (
                                  <a
                                    key={retailer.domain}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border hover:scale-[1.02]"
                                    style={{
                                      background: 'color-mix(in srgb, var(--bg-card-hover) 80%, transparent)',
                                      borderColor: 'var(--border-subtle)',
                                      color: 'var(--text-secondary)',
                                    }}
                                  >
                                    <span>{retailer.logo}</span>
                                    <span className="flex-1">{retailer.name}</span>
                                    {live?.price && retailerUrls[0]?.retailer.domain === retailer.domain && (
                                      <span className="font-bold" style={{ color: '#4ade80' }}>{live.price}</span>
                                    )}
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <a
                                href={component.affiliateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border"
                                style={{
                                  background: 'color-mix(in srgb, var(--bg-card-hover) 80%, transparent)',
                                  borderColor: 'var(--border-subtle)',
                                  color: 'var(--text-secondary)',
                                }}
                              >
                                🛒 <span>Search on {regionConfig.amazonDomain}</span>
                                <svg className="w-3 h-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total & Actions */}
            <div className="rounded-2xl border p-5"
              style={{
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 15%, var(--bg-card)), color-mix(in srgb, var(--accent-2) 10%, var(--bg-card)))',
                borderColor: 'color-mix(in srgb, var(--accent-1) 30%, transparent)',
              }}>
              <div className="flex items-end justify-between mb-1">
                <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Total Estimated Price
                </span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {regionConfig.flag} {regionConfig.currency}
                </span>
              </div>
              <p className="text-4xl font-black gradient-text mb-1">
                {regionConfig.currencySymbol}
                {Math.round(totalPrice * regionConfig.usdRate).toLocaleString()}
              </p>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                ≈ ${totalPrice.toLocaleString()} USD
                {apiAvailable && ' · Live prices where available'}
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    // Open all product pages
                    allEntries.forEach(([_, comp]) => {
                      const url = getComponentUrl(comp);
                      if (url) window.open(url.url, '_blank');
                    });
                  }}
                  className="w-full btn-primary py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Buy All Components
                </button>
                <Link
                  to="/builder"
                  className="w-full btn-secondary py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  ✏️ Modify Build
                </Link>
              </div>
            </div>

            {/* API Status */}
            <div className="rounded-xl p-3 border text-xs"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
              <p className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${apiAvailable ? 'bg-green-400' : 'bg-yellow-400'}`} />
                {apiAvailable
                  ? 'Real-time pricing active — prices scraped from live retailer sites'
                  : 'Showing estimated prices — start the backend server for live pricing'
                }
              </p>
              {!apiAvailable && (
                <p className="mt-1 font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  cd server && npm install && npm start
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
