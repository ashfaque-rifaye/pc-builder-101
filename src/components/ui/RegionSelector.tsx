import { useState } from 'react';
import { useUiStore } from '../../store/uiStore';
import { REGIONS } from '../../data/regions';

export default function RegionSelector() {
  const { region, setRegion } = useUiStore();
  const [open, setOpen] = useState(false);
  const current = REGIONS.find((r) => r.code === region) ?? REGIONS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-secondary flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium"
        title="Select region"
        aria-label="Select region"
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>
          {current.currency}
        </span>
        <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 z-50 rounded-xl border p-2 shadow-2xl min-w-[200px] max-h-80 overflow-y-auto"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider px-2 pb-2" style={{ color: 'var(--text-muted)' }}>
              Region / Currency
            </p>
            {REGIONS.map((r) => (
              <button
                key={r.code}
                onClick={() => { setRegion(r.code); setOpen(false); }}
                className="w-full flex items-center justify-between gap-2 px-2 py-2 rounded-lg text-sm transition-all"
                style={{
                  background: region === r.code ? 'color-mix(in srgb, var(--accent-1) 15%, transparent)' : 'transparent',
                  color: region === r.code ? 'var(--neon-primary)' : 'var(--text-secondary)',
                  border: region === r.code ? '1px solid color-mix(in srgb, var(--accent-1) 30%, transparent)' : '1px solid transparent',
                }}
              >
                <span className="flex items-center gap-2">
                  <span>{r.flag}</span>
                  <span>{r.label}</span>
                </span>
                <span className="text-xs opacity-60">{r.currencySymbol}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
