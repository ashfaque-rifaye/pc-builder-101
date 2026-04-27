import { useNavigate } from 'react-router-dom';
import { useBuilderStore } from '../../store/builderStore';
import { useUiStore } from '../../store/uiStore';
import { CATEGORY_LABELS, CATEGORY_ICONS, REQUIRED_CATEGORIES } from '../../data/components';
import { formatPrice, getRegion } from '../../data/regions';
import { getPreferredPurchaseUrl } from '../../services/api';
import type { ComponentCategory, AnyPCComponent } from '../../types';

export default function PriceEstimate() {
  const { selectedComponents, totalPrice, compatibilityIssues } = useBuilderStore();
  const { region } = useUiStore();
  const navigate = useNavigate();
  const regionConfig = getRegion(region);

  const hasErrors = compatibilityIssues.some((i) => i.type === 'error');
  const requiredMissing = REQUIRED_CATEGORIES.filter((c) => !selectedComponents[c]);
  const readyToBuild = requiredMissing.length === 0 && !hasErrors;

  const allSelectedEntries = Object.entries(selectedComponents) as [
    ComponentCategory,
    NonNullable<(typeof selectedComponents)[ComponentCategory]>
  ][];

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
    return component.affiliateUrl;
  }

  const localTotal = totalPrice * regionConfig.usdRate;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Build Summary</h4>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {regionConfig.flag} {regionConfig.currency} · {allSelectedEntries.length} / 12
          </span>
        </div>

        <div className="max-h-64 overflow-y-auto" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          {allSelectedEntries.length === 0 ? (
            <p className="text-center text-xs py-6" style={{ color: 'var(--text-muted)' }}>No components selected</p>
          ) : (
            allSelectedEntries.map(([category, component]) => (
              <div key={category} className="px-4 py-2.5 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="text-base flex-shrink-0">{CATEGORY_ICONS[category]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{CATEGORY_LABELS[category]}</p>
                  <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{component.name}</p>
                </div>
                <span className="text-xs font-semibold flex-shrink-0" style={{ color: 'var(--neon-primary)' }}>
                  {formatPrice(component.price, region)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Missing required */}
      {requiredMissing.length > 0 && (
        <div className="px-3 py-2.5 rounded-lg" style={{ background: 'color-mix(in srgb, var(--bg-card) 100%, transparent)', border: '1px solid var(--border-subtle)' }}>
          <p className="text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>Missing required components:</p>
          <div className="flex flex-wrap gap-1">
            {requiredMissing.map((c) => (
              <span key={c} className="text-[10px] px-2 py-0.5 rounded" style={{ color: 'var(--text-muted)', background: 'var(--bg-card-hover)' }}>
                {CATEGORY_ICONS[c]} {CATEGORY_LABELS[c]}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Total */}
      <div
        className="rounded-xl p-4"
        style={readyToBuild ? {
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 20%, transparent), color-mix(in srgb, var(--accent-2) 10%, transparent))',
          border: '1px solid color-mix(in srgb, var(--accent-1) 30%, transparent)',
        } : {
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-end justify-between mb-1">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Estimated Total · {regionConfig.currency}
          </span>
          {readyToBuild && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: '#4ade80', background: 'color-mix(in srgb, #16a34a 15%, transparent)' }}>
              ✓ Build Complete
            </span>
          )}
        </div>
        <p className="text-3xl font-black gradient-text">
          {regionConfig.currencySymbol}{Math.round(localTotal).toLocaleString()}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          ≈ ${totalPrice.toLocaleString()} USD · Prices are approximate
        </p>
      </div>

      {/* Build PC Button */}
      {readyToBuild && (
        <button
          onClick={() => navigate('/build')}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
            boxShadow: '0 0 20px color-mix(in srgb, var(--accent-1) 40%, transparent), 0 4px 15px rgba(0,0,0,0.3)',
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Build PC — View 3D Assembly →
        </button>
      )}

      {/* Buy / Individual purchase */}
      {allSelectedEntries.length > 0 && (
        <div className="space-y-2">
          <a
            href={getPurchaseUrl(allSelectedEntries[0][1])}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full btn-primary py-3 rounded-xl text-sm font-semibold text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Shop on {regionConfig.flag} {regionConfig.amazonDomain}
          </a>

          {allSelectedEntries.length > 1 && (
            <div className="grid grid-cols-2 gap-1.5">
              {allSelectedEntries.slice(0, 4).map(([category, component]) => (
                <a
                  key={category}
                  href={getPurchaseUrl(component)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 btn-secondary py-1.5 px-2 rounded-lg text-xs hover:opacity-80"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span>{CATEGORY_ICONS[category]}</span>
                  <span className="truncate">{component.brand}</span>
                  <svg className="w-2.5 h-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
