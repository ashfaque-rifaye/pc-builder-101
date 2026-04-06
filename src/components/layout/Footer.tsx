import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white font-black text-xs">
                PC
              </div>
              <span className="font-bold gradient-text">PC Builder 101</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              The world's most advanced 3D PC configurator. Build, visualize, and purchase your dream setup.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
              <li><Link to="/builder" className="hover:text-cyan-400 transition-colors">PC Builder</Link></li>
              <li><Link to="/viewer" className="hover:text-cyan-400 transition-colors">3D Viewer</Link></li>
              <li><Link to="/presets" className="hover:text-cyan-400 transition-colors">Preset Builds</Link></li>
            </ul>
          </div>

          {/* Components */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Components</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/builder" className="hover:text-cyan-400 transition-colors">CPUs & Processors</Link></li>
              <li><Link to="/builder" className="hover:text-cyan-400 transition-colors">Graphics Cards</Link></li>
              <li><Link to="/builder" className="hover:text-cyan-400 transition-colors">Motherboards</Link></li>
              <li><Link to="/builder" className="hover:text-cyan-400 transition-colors">Memory & Storage</Link></li>
              <li><Link to="/builder" className="hover:text-cyan-400 transition-colors">Peripherals</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Information</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><span className="text-xs bg-cyan-400/10 text-cyan-400 px-2 py-0.5 rounded-full">Open Source</span></li>
              <li className="pt-1">Built with React + Three.js</li>
              <li>Real-time 3D rendering</li>
              <li>Compatibility checking</li>
              <li>Purchase via affiliate links</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} PC Builder 101. Affiliate links support development. Prices are approximate.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
