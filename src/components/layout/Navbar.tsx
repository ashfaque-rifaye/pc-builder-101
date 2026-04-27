import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ThemeSwitcher from '../ui/ThemeSwitcher';
import RegionSelector from '../ui/RegionSelector';

const navLinks = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/builder', label: 'PC Builder', icon: '🔧' },
  { to: '/build', label: '3D Build', icon: '🖥️' },
  { to: '/laptop', label: 'Laptop', icon: '💻' },
  { to: '/viewer', label: '3D Viewer', icon: '🎮' },
  { to: '/presets', label: 'Presets', icon: '🏆' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? 'color-mix(in srgb, var(--bg-dark) 85%, transparent)'
          : 'color-mix(in srgb, var(--bg-dark) 40%, transparent)',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'blur(8px)',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.2)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
            style={{ background: 'linear-gradient(135deg, var(--neon-primary), var(--neon-secondary))' }}>
            PC
          </div>
          <span className="font-bold text-base tracking-tight">
            <span className="gradient-text">PC Builder</span>
            <span className="text-xs ml-1 font-medium" style={{ color: 'var(--text-muted)' }}>101</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => {
            const active = pathname === link.to;
            return (
              <Link key={link.to} to={link.to}
                className="relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group"
                style={{ color: active ? 'var(--neon-primary)' : 'var(--text-secondary)' }}>
                {active && (
                  <div className="absolute inset-0 rounded-xl transition-all"
                    style={{ background: 'color-mix(in srgb, var(--accent-1) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--neon-primary) 25%, transparent)' }} />
                )}
                <span className="relative">{link.label}</span>
                {active && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: 'var(--neon-primary)' }} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <RegionSelector />
            <ThemeSwitcher />
          </div>
          <Link to="/builder"
            className="hidden md:inline-flex btn-primary px-4 py-2 rounded-xl text-sm font-bold text-white hover-lift">
            Build →
          </Link>
          <button
            className="lg:hidden p-2 rounded-xl transition-all duration-300"
            style={{ color: 'var(--text-secondary)', background: menuOpen ? 'color-mix(in srgb, white 8%, transparent)' : 'transparent' }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu">
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
      <div className={`lg:hidden overflow-hidden transition-all duration-500 ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ background: 'color-mix(in srgb, var(--bg-dark) 95%, transparent)', backdropFilter: 'blur(20px)' }}>
        <div className="px-4 py-3 space-y-1 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={pathname === link.to ? {
                background: 'color-mix(in srgb, var(--accent-1) 15%, transparent)',
                color: 'var(--neon-primary)',
              } : { color: 'var(--text-secondary)' }}>
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-3 pb-1 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <RegionSelector />
            <ThemeSwitcher />
          </div>
          <Link to="/builder" onClick={() => setMenuOpen(false)}
            className="block btn-primary mt-2 px-4 py-3 rounded-xl text-sm font-bold text-white text-center">
            Start Building →
          </Link>
        </div>
      </div>
    </nav>
  );
}
