import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LAPTOP_CATEGORY_LABELS,
  LAPTOP_CATEGORY_ICONS,
  UPGRADEABLE_LAPTOP_CATEGORIES,
  LAPTOP_UPGRADE_GUIDE,
  LAPTOP_COMPAT_TIPS,
  allLaptopComponents,
  type LaptopCompatTip,
} from '../data/laptopComponents';
import { useUiStore } from '../store/uiStore';
import { formatPrice, buildAffiliateUrl } from '../data/regions';
import type { LaptopCategory, AnyLaptopComponent } from '../types';

type TabId = 'components' | 'guide' | 'tips';

function UpgradeGuideCard({ entry }: { entry: typeof LAPTOP_UPGRADE_GUIDE[number] }) {
  const icon = LAPTOP_CATEGORY_ICONS[entry.category];
  const difficultyColor: Record<string, string> = {
    easy: '#4ade80',
    medium: '#fbbf24',
    hard: '#f87171',
    not_recommended: '#f87171',
  };
  const difficultyLabel: Record<string, string> = {
    easy: '✓ Easy',
    medium: '⚡ Medium',
    hard: '⚠ Hard',
    not_recommended: '✕ Not Recommended',
  };

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${entry.upgradeable ? 'color-mix(in srgb, #16a34a 25%, transparent)' : 'color-mix(in srgb, #dc2626 25%, transparent)'}`,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {entry.title}
            </h3>
            <span
              className="text-[10px] font-semibold"
              style={{ color: difficultyColor[entry.difficulty] }}
            >
              {difficultyLabel[entry.difficulty]}
            </span>
          </div>
        </div>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0"
          style={entry.upgradeable ? {
            background: 'color-mix(in srgb, #16a34a 15%, transparent)',
            color: '#4ade80',
          } : {
            background: 'color-mix(in srgb, #dc2626 15%, transparent)',
            color: '#f87171',
          }}
        >
          {entry.upgradeable ? '⬆ Upgradeable' : '🔒 Locked'}
        </span>
      </div>
      <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
        {entry.note}
      </p>
    </div>
  );
}

function CompatTipCard({ tip }: { tip: LaptopCompatTip }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: 'color-mix(in srgb, var(--accent-1) 8%, transparent)',
        border: '1px solid color-mix(in srgb, var(--accent-1) 20%, transparent)',
      }}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg mt-0.5">💡</span>
        <div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--neon-primary)' }}>
            {tip.title}
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {tip.detail}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {tip.applies_to.map((cat) => (
              <span
                key={cat}
                className="text-[10px] px-1.5 py-0.5 rounded"
                style={{
                  background: 'color-mix(in srgb, var(--neon-secondary) 12%, transparent)',
                  color: 'var(--neon-secondary)',
                }}
              >
                {LAPTOP_CATEGORY_ICONS[cat]} {LAPTOP_CATEGORY_LABELS[cat]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ComponentCard({
  component,
  isSelected,
  onSelect,
  region,
}: {
  component: AnyLaptopComponent;
  isSelected: boolean;
  onSelect: () => void;
  region: import('../data/regions').RegionCode;
}) {
  const isUpgradeable = (component.specs as Record<string, string>)['upgradeable'] !== 'no — soldered BGA';
  const purchaseUrl = component.affiliateUrl || buildAffiliateUrl(`${component.brand} ${component.name}`, region);

  return (
    <div
      onClick={isUpgradeable ? onSelect : undefined}
      className="rounded-xl p-3 transition-all duration-200 border"
      style={{
        background: isSelected ? 'color-mix(in srgb, var(--accent-1) 15%, transparent)' : 'var(--bg-card)',
        borderColor: isSelected ? 'color-mix(in srgb, var(--neon-primary) 50%, transparent)' : 'var(--border-subtle)',
        cursor: isUpgradeable ? 'pointer' : 'default',
        opacity: !isUpgradeable ? 0.7 : 1,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-subtle)' }}>
          <img
            src={component.image}
            alt={component.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="%231e293b"%3E%3Crect width="40" height="40"/%3E%3C/svg%3E';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{component.brand}</p>
              <p className="text-sm font-medium" style={{ color: isSelected ? 'var(--neon-primary)' : 'var(--text-primary)' }}>
                {component.name}
              </p>
            </div>
            <div className="text-right">
              {component.price > 0 ? (
                <p className="text-sm font-bold" style={{ color: isSelected ? 'var(--neon-primary)' : 'var(--text-primary)' }}>
                  {formatPrice(component.price, region)}
                </p>
              ) : (
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-card-hover)', color: 'var(--text-muted)' }}>
                  ref only
                </span>
              )}
            </div>
          </div>

          <div className="mt-1 flex flex-wrap gap-1">
            {Object.entries(component.specs).slice(0, 2).map(([, v]) => (
              <span key={v} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-card-hover)', color: 'var(--text-secondary)' }}>
                {v}
              </span>
            ))}
          </div>

          {!isUpgradeable && (
            <span className="mt-1 inline-block text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'color-mix(in srgb, #dc2626 10%, transparent)', color: '#f87171' }}>
              🔒 Soldered — not upgradeable
            </span>
          )}
        </div>
      </div>

      {isUpgradeable && component.price > 0 && (
        <a
          href={purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-xs font-medium transition-all border"
          style={{
            background: 'color-mix(in srgb, white 5%, transparent)',
            color: 'var(--text-secondary)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Buy Upgrade
        </a>
      )}
    </div>
  );
}

export default function LaptopBuilder() {
  const { region } = useUiStore();
  const [activeTab, setActiveTab] = useState<TabId>('components');
  const [activeCategory, setActiveCategory] = useState<LaptopCategory>('laptop-ram');
  const [selected, setSelected] = useState<Partial<Record<LaptopCategory, AnyLaptopComponent>>>({});

  const totalPrice = Object.values(selected).reduce((s, c) => s + (c?.price ?? 0), 0);
  const components = allLaptopComponents[activeCategory] ?? [];

  const tabs: { id: TabId; label: string; emoji: string }[] = [
    { id: 'components', label: 'Upgrade Parts', emoji: '⚙️' },
    { id: 'guide', label: 'Upgrade Guide', emoji: '📖' },
    { id: 'tips', label: 'Compatibility Tips', emoji: '💡' },
  ];

  const upgradeableCategories: LaptopCategory[] = UPGRADEABLE_LAPTOP_CATEGORIES;

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div
        className="border-b sticky top-16 z-30"
        style={{ background: 'color-mix(in srgb, var(--bg-dark) 80%, transparent)', backdropFilter: 'blur(12px)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">💻</span>
            <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Laptop Upgrade Builder
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'color-mix(in srgb, var(--neon-green) 15%, transparent)', color: 'var(--neon-green)' }}>
              Global
            </span>
          </div>
          {totalPrice > 0 && (
            <span className="text-sm font-bold gradient-text">
              {formatPrice(totalPrice, region)} in upgrades
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Intro banner */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 15%, transparent), color-mix(in srgb, var(--accent-2) 8%, transparent))',
            border: '1px solid color-mix(in srgb, var(--accent-1) 25%, transparent)',
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Upgrade Your Existing Laptop 🚀
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Can't afford a new laptop? Upgrade what you already have! Add more RAM, faster SSD storage,
                or a higher-quality display — all without buying a new machine. Our guide explains exactly
                what you can and can't upgrade on modern laptops.
              </p>
            </div>
            <Link
              to="/builder"
              className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold text-white text-center flex-shrink-0"
            >
              Build a Desktop PC →
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2.5 text-sm font-medium transition-all rounded-t-lg relative"
              style={{
                color: activeTab === tab.id ? 'var(--neon-primary)' : 'var(--text-muted)',
                borderBottom: activeTab === tab.id ? '2px solid var(--neon-primary)' : '2px solid transparent',
              }}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Components */}
        {activeTab === 'components' && (
          <div className="grid md:grid-cols-[240px_1fr_280px] gap-6">
            {/* Left: Category sidebar */}
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-1" style={{ color: 'var(--text-muted)' }}>
                Upgradeable Components
              </p>
              {upgradeableCategories.map((cat) => {
                const sel = selected[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
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
                    <span className="text-lg">{LAPTOP_CATEGORY_ICONS[cat]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{LAPTOP_CATEGORY_LABELS[cat]}</p>
                      {sel && (
                        <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                          {sel.name.split(' ').slice(0, 3).join(' ')}
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
                CPU / GPU (reference)
              </p>
              {(['laptop-cpu', 'laptop-display'] as LaptopCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 border"
                  style={activeCategory === cat ? {
                    background: 'color-mix(in srgb, var(--accent-2) 15%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--neon-secondary) 30%, transparent)',
                    color: 'var(--neon-secondary)',
                  } : {
                    color: 'var(--text-muted)',
                    borderColor: 'transparent',
                  }}
                >
                  <span className="text-lg">{LAPTOP_CATEGORY_ICONS[cat]}</span>
                  <p className="text-xs font-medium">{LAPTOP_CATEGORY_LABELS[cat]}</p>
                </button>
              ))}
            </div>

            {/* Center: Component list */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{LAPTOP_CATEGORY_ICONS[activeCategory]}</span>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {LAPTOP_CATEGORY_LABELS[activeCategory]}
                </h3>
                <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
                  {components.length} options
                </span>
              </div>
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {components.map((comp) => (
                  <ComponentCard
                    key={comp.id}
                    component={comp}
                    isSelected={selected[activeCategory]?.id === comp.id}
                    onSelect={() => {
                      setSelected((prev) =>
                        prev[activeCategory]?.id === comp.id
                          ? { ...prev, [activeCategory]: undefined }
                          : { ...prev, [activeCategory]: comp }
                      );
                    }}
                    region={region}
                  />
                ))}
                {components.length === 0 && (
                  <div className="text-center py-12">
                    <span className="text-4xl">🔒</span>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                      This component is typically soldered in modern laptops and cannot be user-upgraded.
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      See the Upgrade Guide tab for alternatives.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Summary */}
            <div className="space-y-4">
              <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  📋 Upgrade Plan
                </h3>
                {Object.keys(selected).length === 0 ? (
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Select components from the list to build your upgrade plan.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {(Object.entries(selected) as [LaptopCategory, AnyLaptopComponent][]).filter(([, v]) => v).map(([cat, comp]) => (
                      <div key={cat} className="flex items-center gap-2 text-xs">
                        <span>{LAPTOP_CATEGORY_ICONS[cat]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium" style={{ color: 'var(--text-primary)' }}>{comp.name}</p>
                        </div>
                        <span className="font-semibold" style={{ color: 'var(--neon-primary)' }}>
                          {formatPrice(comp.price, region)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 mt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <div className="flex justify-between text-sm font-bold">
                        <span style={{ color: 'var(--text-secondary)' }}>Total Upgrade Cost</span>
                        <span className="gradient-text">{formatPrice(totalPrice, region)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  🌍 Region Info
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Prices shown in your selected currency. Availability varies by region.
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Change region/currency using the globe icon in the navigation bar.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Upgrade Guide */}
        {activeTab === 'guide' && (
          <div>
            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
              Not all laptop components are replaceable. Here's a quick guide on what you can and can't upgrade, with difficulty ratings.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {LAPTOP_UPGRADE_GUIDE.map((entry) => (
                <UpgradeGuideCard key={entry.category} entry={entry} />
              ))}
            </div>
          </div>
        )}

        {/* Tab: Compatibility Tips */}
        {activeTab === 'tips' && (
          <div>
            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
              Essential compatibility information to avoid purchasing the wrong upgrade components.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {LAPTOP_COMPAT_TIPS.map((tip) => (
                <CompatTipCard key={tip.id} tip={tip} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
