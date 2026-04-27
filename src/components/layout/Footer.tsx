import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t mt-20" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs"
                style={{ background: 'linear-gradient(135deg, var(--neon-primary), var(--neon-secondary))' }}
              >
                PC
              </div>
              <span className="font-bold gradient-text">PC Builder 101</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              The world's most advanced 3D PC configurator. Build, visualize, and purchase your dream setup.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Platform</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <li><Link to="/" className="hover:opacity-80 transition-colors" style={{ color: 'var(--text-secondary)' }}>Home</Link></li>
              <li><Link to="/builder" className="hover:opacity-80 transition-colors" style={{ color: 'var(--text-secondary)' }}>PC Builder</Link></li>
              <li><Link to="/viewer" className="hover:opacity-80 transition-colors" style={{ color: 'var(--text-secondary)' }}>3D Viewer</Link></li>
              <li><Link to="/presets" className="hover:opacity-80 transition-colors" style={{ color: 'var(--text-secondary)' }}>Preset Builds</Link></li>
            </ul>
          </div>

          {/* Components */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Components</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <li><Link to="/builder" className="hover:opacity-80 transition-colors" style={{ color: 'var(--text-secondary)' }}>CPUs & Processors</Link></li>
              <li><Link to="/builder" className="hover:opacity-80 transition-colors" style={{ color: 'var(--text-secondary)' }}>Graphics Cards</Link></li>
              <li><Link to="/builder" className="hover:opacity-80 transition-colors" style={{ color: 'var(--text-secondary)' }}>Motherboards</Link></li>
              <li><Link to="/builder" className="hover:opacity-80 transition-colors" style={{ color: 'var(--text-secondary)' }}>Memory & Storage</Link></li>
              <li><Link to="/builder" className="hover:opacity-80 transition-colors" style={{ color: 'var(--text-secondary)' }}>Peripherals</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Information</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <li><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'color-mix(in srgb, var(--neon-primary) 12%, transparent)', color: 'var(--neon-primary)' }}>Open Source</span></li>
              <li className="pt-1">Built with React + Three.js</li>
              <li>Real-time 3D rendering</li>
              <li>Compatibility checking</li>
              <li>Purchase via affiliate links</li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border-subtle)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} PC Builder 101. Affiliate links support development. Prices are approximate.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse inline-block" style={{ background: 'var(--neon-green)' }} />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
