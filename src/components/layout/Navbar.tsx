import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import ThemeSwitcher from '../ui/ThemeSwitcher';
import RegionSelector from '../ui/RegionSelector';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/builder', label: 'PC Builder' },
  { to: '/laptop', label: 'Laptop' },
  { to: '/viewer', label: '3D Viewer' },
  { to: '/presets', label: 'Presets' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--neon-primary)] to-[var(--neon-secondary)] flex items-center justify-center text-white font-black text-xs shadow-lg">
            PC
          </div>
          <span className="font-bold text-base tracking-tight">
            <span className="gradient-text">PC Builder</span>
            <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>101</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === link.to
                  ? 'bg-blue-600/20 border'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
              style={pathname === link.to ? {
                color: 'var(--neon-primary)',
                borderColor: 'color-mix(in srgb, var(--neon-primary) 30%, transparent)',
              } : { color: 'var(--text-secondary)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <RegionSelector />
            <ThemeSwitcher />
          </div>
          <Link
            to="/builder"
            className="hidden md:inline-flex btn-primary px-3 py-1.5 rounded-lg text-sm font-semibold text-white"
          >
            Build →
          </Link>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden glass border-t px-4 py-3 space-y-1" style={{ borderColor: 'var(--border-subtle)' }}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all`}
              style={pathname === link.to ? {
                background: 'color-mix(in srgb, var(--accent-1) 20%, transparent)',
                color: 'var(--neon-primary)',
              } : { color: 'var(--text-secondary)' }}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2 pb-1">
            <RegionSelector />
            <ThemeSwitcher />
          </div>
          <Link
            to="/builder"
            onClick={() => setMenuOpen(false)}
            className="block btn-primary mt-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white text-center"
          >
            Start Building →
          </Link>
        </div>
      )}
    </nav>
  );
}
