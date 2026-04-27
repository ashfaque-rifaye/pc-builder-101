import type { AnyPCComponent, ComponentCategory, StockStatus } from '../../types';
import { CATEGORY_LABELS, CATEGORY_ICONS, allComponents } from '../../data/components';
import { useBuilderStore } from '../../store/builderStore';
import { useUiStore } from '../../store/uiStore';
import { formatPrice, buildAffiliateUrl, getRegion } from '../../data/regions';
import { getPreferredPurchaseUrl, getPurchaseLinks, type ProductLink } from '../../services/api';

interface ComponentSelectorProps {
  category: ComponentCategory;
  onSelect?: (component: AnyPCComponent) => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-slate-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>{rating.toFixed(1)}</span>
    </div>
  );
}

function StockBadge({ status, regionCode }: { status: StockStatus; regionCode: string }) {
  if (status === 'in_stock') {
    return (
      <span className="badge-instock text-[10px] px-1.5 py-0.5 rounded-full font-medium">
        ✓ In Stock
      </span>
    );
  }
  if (status === 'limited') {
    return (
      <span className="badge-limited text-[10px] px-1.5 py-0.5 rounded-full font-medium">
        ⚡ Low Stock
      </span>
    );
  }
  if (status === 'preorder') {
    return (
      <span className="badge-limited text-[10px] px-1.5 py-0.5 rounded-full font-medium">
        📦 Pre-order
      </span>
    );
  }
  return (
    <span className="badge-outofstock text-[10px] px-1.5 py-0.5 rounded-full font-medium">
      ✕ Out of Stock in {regionCode}
    </span>
  );
}

export default function ComponentSelector({ category, onSelect }: ComponentSelectorProps) {
  const { selectedComponents, setComponent, removeComponent } = useBuilderStore();
  const { region } = useUiStore();
  const regionConfig = getRegion(region);
  const components = allComponents[category] ?? [];
  const selected = selectedComponents[category];

  // Determine effective stock status for current region
  function getStockStatus(component: AnyPCComponent): StockStatus {
    const regionalOverride = component.regionalStock?.[region];
    if (regionalOverride) return regionalOverride;
    return component.inStock ? 'in_stock' : 'out_of_stock';
  }

  // Check if component is available in selected region
  function isAvailableInRegion(component: AnyPCComponent): boolean {
    if (!component.availableIn || component.availableIn.length === 0) return true;
    return component.availableIn.includes(region);
  }

  // Get purchase URL for current region (prefers direct product URLs)
  function getPurchaseUrl(component: AnyPCComponent): string {
    const comp = component as AnyPCComponent & { productUrls?: Record<string, string> };
    if (comp.productUrls) {
      const preferredUrl = getPreferredPurchaseUrl(
        comp.productUrls,
        region,
        `${component.brand} ${component.name}`
      );
      if (preferredUrl) return preferredUrl;
    }
    const regionalUrl = component.regionalUrls?.[region];
    if (regionalUrl) return regionalUrl;
    return buildAffiliateUrl(`${component.brand} ${component.name}`, region);
  }

  // Get all retailer links for a component
  function getRetailerLinks(component: AnyPCComponent): ProductLink[] {
    const comp = component as AnyPCComponent & { productUrls?: Record<string, string> };
    if (comp.productUrls) {
      return getPurchaseLinks(comp.productUrls, region, `${component.brand} ${component.name}`);
    }
    return [];
  }

  // Alternative region URLs when out of stock
  function getAlternativeLinks(component: AnyPCComponent): Array<{ region: string; flag: string; url: string }> {
    if (getStockStatus(component) !== 'out_of_stock') return [];
    const alternatives = [
      { code: 'US', flag: '🇺🇸' },
      { code: 'UK', flag: '🇬🇧' },
      { code: 'EU', flag: '🇪🇺' },
      { code: 'CA', flag: '🇨🇦' },
    ].filter((r) => r.code !== region);
    return alternatives.slice(0, 2).map((r) => ({
      region: r.code,
      flag: r.flag,
      url: buildAffiliateUrl(`${component.brand} ${component.name}`, r.code as import('../../data/regions').RegionCode),
    }));
  }

  function handleSelect(component: AnyPCComponent) {
    const stockStatus = getStockStatus(component);
    // Prevent selection if out of stock OR not available in this region
    if (stockStatus === 'out_of_stock') return;
    if (!isAvailableInRegion(component)) return;
    if (selected?.id === component.id) {
      removeComponent(category);
    } else {
      setComponent(category, component);
      onSelect?.(component);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{CATEGORY_ICONS[category]}</span>
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          {CATEGORY_LABELS[category]}
        </h3>
        <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
          {components.length} options · {regionConfig.flag} {regionConfig.currency}
        </span>
      </div>

      <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
        {components.map((component) => {
          const isSelected = selected?.id === component.id;
          const stockStatus = getStockStatus(component);
          const available = isAvailableInRegion(component);
          const isOutOfStock = stockStatus === 'out_of_stock';
          const altLinks = getAlternativeLinks(component);
          const purchaseUrl = getPurchaseUrl(component);

          return (
            <div
              key={component.id}
              onClick={() => handleSelect(component)}
              className={`group relative rounded-xl p-3 transition-all duration-200 border ${
                isSelected
                  ? 'border-[var(--neon-primary)]/50 shadow-lg'
                  : isOutOfStock || !available
                  ? 'border-white/5 opacity-60 cursor-not-allowed'
                  : 'card-bg card-bg-hover border-white/5 cursor-pointer hover:border-blue-500/30'
              }`}
              style={isSelected ? {
                background: 'color-mix(in srgb, var(--accent-1) 15%, transparent)',
                boxShadow: '0 4px 20px color-mix(in srgb, var(--neon-primary) 10%, transparent)',
              } : undefined}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--neon-primary)' }}>
                  <svg className="w-3 h-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              <div className="flex items-start gap-3">
                {/* Component image */}
                <div className="w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden border" style={{ background: 'var(--bg-card-hover)', borderColor: 'var(--border-subtle)' }}>
                  <img
                    src={component.image}
                    alt={component.name}
                    className="w-full h-full object-cover opacity-80"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="%231e293b"%3E%3Crect width="48" height="48"/%3E%3C/svg%3E';
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{component.brand}</p>
                      <p className={`text-sm font-medium truncate`} style={{ color: isSelected ? 'var(--neon-primary)' : 'var(--text-primary)' }}>
                        {component.name}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold`} style={{ color: isSelected ? 'var(--neon-primary)' : 'var(--text-primary)' }}>
                        {formatPrice(component.price, region)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating rating={component.rating} />
                    <StockBadge status={stockStatus} regionCode={regionConfig.flag} />
                  </div>

                  {/* Key specs */}
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {Object.entries(component.specs).slice(0, 2).map(([key, value]) => (
                      <span key={key} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-card-hover)', color: 'var(--text-secondary)' }}>
                        {value}
                      </span>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="mt-1 flex flex-wrap gap-1">
                    {component.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: 'var(--neon-secondary)', background: 'color-mix(in srgb, var(--neon-secondary) 10%, transparent)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Out of stock message + alternatives */}
              {isOutOfStock && (
                <div className="mt-2 rounded-lg px-3 py-2 text-xs" style={{ background: 'color-mix(in srgb, #dc2626 10%, transparent)', border: '1px solid color-mix(in srgb, #dc2626 25%, transparent)' }}>
                  <p className="text-red-400 font-medium mb-1">Not available in {regionConfig.label}</p>
                  {altLinks.length > 0 && (
                    <div className="flex gap-2">
                      <span style={{ color: 'var(--text-muted)' }}>Try: </span>
                      {altLinks.map((alt) => (
                        <a
                          key={alt.region}
                          href={alt.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          {alt.flag} {alt.region}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Purchase links - multi-retailer */}
              {!isOutOfStock && (() => {
                const retailers = getRetailerLinks(component);
                return retailers.length > 1 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {retailers.slice(0, 4).map((r) => (
                      <a
                        key={r.retailer.domain}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-all border"
                        style={isSelected ? {
                          background: 'color-mix(in srgb, var(--neon-primary) 10%, transparent)',
                          color: 'var(--neon-primary)',
                          borderColor: 'color-mix(in srgb, var(--neon-primary) 30%, transparent)',
                        } : {
                          background: 'color-mix(in srgb, white 5%, transparent)',
                          color: 'var(--text-secondary)',
                          borderColor: 'var(--border-subtle)',
                        }}
                      >
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {r.retailer.name}
                      </a>
                    ))}
                  </div>
                ) : (
                  <a
                    href={purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-xs font-medium transition-all border"
                    style={isSelected ? {
                      background: 'color-mix(in srgb, var(--neon-primary) 10%, transparent)',
                      color: 'var(--neon-primary)',
                      borderColor: 'color-mix(in srgb, var(--neon-primary) 30%, transparent)',
                    } : {
                      background: 'color-mix(in srgb, white 5%, transparent)',
                      color: 'var(--text-secondary)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Buy on {regionConfig.flag} {regionConfig.amazonDomain}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                );
              })()}
            </div>
          );
        })}

        {components.length === 0 && (
          <p className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>No components available</p>
        )}
      </div>
    </div>
  );
}
