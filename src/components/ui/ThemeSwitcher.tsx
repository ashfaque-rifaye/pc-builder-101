import { useState } from 'react';
import { useUiStore } from '../../store/uiStore';
import { THEMES } from '../../data/regions';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useUiStore();
  const [open, setOpen] = useState(false);
  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-secondary flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium"
        title="Change theme"
        aria-label="Change theme"
      >
        <span>{current.emoji}</span>
        <span className="hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>{current.label}</span>
        <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 z-50 rounded-xl border p-2 shadow-2xl min-w-[160px]"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider px-2 pb-2" style={{ color: 'var(--text-muted)' }}>
              Themes
            </p>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-all"
                style={{
                  background: theme === t.id ? `color-mix(in srgb, ${t.accent} 15%, transparent)` : 'transparent',
                  color: theme === t.id ? t.accent : 'var(--text-secondary)',
                  border: theme === t.id ? `1px solid color-mix(in srgb, ${t.accent} 30%, transparent)` : '1px solid transparent',
                }}
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0 ring-1 ring-white/20"
                  style={{ background: t.accent }}
                />
                <span>{t.emoji} {t.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
