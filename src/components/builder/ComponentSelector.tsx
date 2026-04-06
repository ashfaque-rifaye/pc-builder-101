import type { AnyPCComponent, ComponentCategory } from '../../types';
import { CATEGORY_LABELS, CATEGORY_ICONS, allComponents } from '../../data/components';
import { useBuilderStore } from '../../store/builderStore';

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
      <span className="text-xs text-slate-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ComponentSelector({ category, onSelect }: ComponentSelectorProps) {
  const { selectedComponents, setComponent, removeComponent } = useBuilderStore();
  const components = allComponents[category] ?? [];
  const selected = selectedComponents[category];

  function handleSelect(component: AnyPCComponent) {
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
        <h3 className="text-base font-semibold text-white">{CATEGORY_LABELS[category]}</h3>
        <span className="ml-auto text-xs text-slate-500">{components.length} options</span>
      </div>

      <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
        {components.map((component) => {
          const isSelected = selected?.id === component.id;
          return (
            <div
              key={component.id}
              onClick={() => handleSelect(component)}
              className={`group relative rounded-xl p-3 cursor-pointer transition-all duration-200 border ${
                isSelected
                  ? 'bg-blue-900/30 border-cyan-400/50 shadow-lg shadow-cyan-500/10'
                  : 'card-bg card-bg-hover border-white/5 hover:border-blue-500/30'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              <div className="flex items-start gap-3">
                {/* Component image placeholder */}
                <div className="w-12 h-12 rounded-lg bg-slate-800 flex-shrink-0 overflow-hidden border border-white/5">
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
                    <div>
                      <p className="text-xs text-slate-500">{component.brand}</p>
                      <p className={`text-sm font-medium truncate ${isSelected ? 'text-cyan-400' : 'text-white'}`}>
                        {component.name}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${isSelected ? 'text-cyan-400' : 'text-white'}`}>
                        ${component.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <StarRating rating={component.rating} />

                  {/* Key specs */}
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {Object.entries(component.specs)
                      .slice(0, 2)
                      .map(([key, value]) => (
                        <span
                          key={key}
                          className="text-[10px] text-slate-400 bg-slate-800/50 px-1.5 py-0.5 rounded"
                        >
                          {value}
                        </span>
                      ))}
                  </div>

                  {/* Tags */}
                  <div className="mt-1 flex flex-wrap gap-1">
                    {component.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-blue-400/70 bg-blue-900/20 px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Purchase link */}
              <a
                href={component.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/20'
                    : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Buy on Amazon
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          );
        })}

        {components.length === 0 && (
          <p className="text-center text-slate-500 py-8 text-sm">No components available</p>
        )}
      </div>
    </div>
  );
}
