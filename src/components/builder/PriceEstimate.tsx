import { useBuilderStore } from '../../store/builderStore';
import { CATEGORY_LABELS, CATEGORY_ICONS, REQUIRED_CATEGORIES } from '../../data/components';
import type { ComponentCategory } from '../../types';

export default function PriceEstimate() {
  const { selectedComponents, totalPrice, compatibilityIssues } = useBuilderStore();

  const hasErrors = compatibilityIssues.some((i) => i.type === 'error');
  const requiredMissing = REQUIRED_CATEGORIES.filter((c) => !selectedComponents[c]);
  const readyToBuy = requiredMissing.length === 0 && !hasErrors;

  const allSelectedEntries = Object.entries(selectedComponents) as [
    ComponentCategory,
    NonNullable<(typeof selectedComponents)[ComponentCategory]>
  ][];

  // Build Amazon search URL for all components
  const allAmazonLinks = allSelectedEntries.map(([, comp]) => comp.affiliateUrl);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="rounded-xl card-bg border border-white/5 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white">Build Summary</h4>
          <span className="text-xs text-slate-500">
            {allSelectedEntries.length} / 12 components
          </span>
        </div>

        <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
          {allSelectedEntries.length === 0 ? (
            <p className="text-center text-slate-500 text-xs py-6">No components selected</p>
          ) : (
            allSelectedEntries.map(([category, component]) => (
              <div key={category} className="px-4 py-2.5 flex items-center gap-2">
                <span className="text-base flex-shrink-0">{CATEGORY_ICONS[category]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 truncate">{CATEGORY_LABELS[category]}</p>
                  <p className="text-xs font-medium text-white truncate">{component.name}</p>
                </div>
                <span className="text-xs font-semibold text-cyan-400 flex-shrink-0">
                  ${component.price.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Missing required */}
      {requiredMissing.length > 0 && (
        <div className="px-3 py-2.5 rounded-lg bg-slate-800/50 border border-white/5">
          <p className="text-xs text-slate-400 mb-1.5">Missing required components:</p>
          <div className="flex flex-wrap gap-1">
            {requiredMissing.map((c) => (
              <span key={c} className="text-[10px] text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded">
                {CATEGORY_ICONS[c]} {CATEGORY_LABELS[c]}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Total */}
      <div
        className={`rounded-xl p-4 border ${
          readyToBuy
            ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/20 border-blue-500/30'
            : 'card-bg border-white/5'
        }`}
      >
        <div className="flex items-end justify-between mb-1">
          <span className="text-sm text-slate-400">Estimated Total</span>
          {readyToBuy && (
            <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full">
              ✓ Build Complete
            </span>
          )}
        </div>
        <p className="text-3xl font-black gradient-text">${totalPrice.toLocaleString()}</p>
        <p className="text-xs text-slate-500 mt-1">
          * Prices are approximate. Click Buy to check current pricing.
        </p>
      </div>

      {/* Buy All / Individual purchase */}
      {allSelectedEntries.length > 0 && (
        <div className="space-y-2">
          <a
            href={allAmazonLinks[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full btn-primary py-3 rounded-xl text-sm font-semibold text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Shop Components
          </a>

          {allSelectedEntries.length > 1 && (
            <div className="grid grid-cols-2 gap-1.5">
              {allSelectedEntries.slice(0, 4).map(([category, component]) => (
                <a
                  key={category}
                  href={component.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 btn-secondary py-1.5 px-2 rounded-lg text-xs text-slate-300 hover:text-white"
                >
                  <span>{CATEGORY_ICONS[category]}</span>
                  <span className="truncate">{component.brand}</span>
                  <svg className="w-2.5 h-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
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
