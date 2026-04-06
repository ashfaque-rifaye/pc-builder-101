import { useBuilderStore } from '../../store/builderStore';

export default function CompatibilityChecker() {
  const { compatibilityIssues, selectedComponents } = useBuilderStore();

  const componentCount = Object.keys(selectedComponents).length;
  const errors = compatibilityIssues.filter((i) => i.type === 'error');
  const warnings = compatibilityIssues.filter((i) => i.type === 'warning');

  if (componentCount === 0) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        <div className="text-3xl mb-2">🔧</div>
        Add components to check compatibility
      </div>
    );
  }

  if (compatibilityIssues.length === 0) {
    return (
      <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-green-900/20 border border-green-500/25">
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-green-400">All Compatible</p>
          <p className="text-xs text-slate-500">No issues detected with your build</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {errors.length > 0 && (
        <div className="rounded-xl border border-red-500/25 overflow-hidden">
          <div className="px-3 py-2 bg-red-900/20 flex items-center gap-2">
            <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-semibold text-red-400">
              {errors.length} Error{errors.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="divide-y divide-white/5">
            {errors.map((issue, i) => (
              <div key={i} className="px-3 py-2">
                <p className="text-xs text-slate-300">{issue.message}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {issue.components.map((c) => (
                    <span key={c} className="text-[10px] bg-red-900/30 text-red-400 px-1.5 py-0.5 rounded">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="rounded-xl border border-yellow-500/25 overflow-hidden">
          <div className="px-3 py-2 bg-yellow-900/20 flex items-center gap-2">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-semibold text-yellow-400">
              {warnings.length} Warning{warnings.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="divide-y divide-white/5">
            {warnings.map((issue, i) => (
              <div key={i} className="px-3 py-2">
                <p className="text-xs text-slate-300">{issue.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
