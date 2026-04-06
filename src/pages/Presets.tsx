import { Link } from 'react-router-dom';
import { presetBuilds } from '../data/components';
import { useBuilderStore } from '../store/builderStore';
import type { Build } from '../types';
import { CATEGORY_ICONS } from '../data/components';

const USE_CASE_BADGE: Record<Build['useCase'], { label: string; color: string }> = {
  gaming: { label: '🎮 Gaming', color: 'bg-purple-900/40 text-purple-300 border-purple-500/30' },
  workstation: {
    label: '🖥️ Workstation',
    color: 'bg-blue-900/40 text-blue-300 border-blue-500/30',
  },
  budget: { label: '💰 Budget', color: 'bg-green-900/40 text-green-300 border-green-500/30' },
  office: { label: '🏢 Office', color: 'bg-slate-800 text-slate-300 border-slate-600/30' },
  streaming: {
    label: '📺 Streaming',
    color: 'bg-red-900/40 text-red-300 border-red-500/30',
  },
  custom: { label: '⚙️ Custom', color: 'bg-cyan-900/40 text-cyan-300 border-cyan-500/30' },
};

function PresetCard({ build }: { build: Build }) {
  const { loadBuild } = useBuilderStore();
  const badge = USE_CASE_BADGE[build.useCase];
  const componentList = Object.entries(build.components).slice(0, 6);

  return (
    <div className="card-bg rounded-2xl border border-white/5 overflow-hidden hover:border-blue-500/25 transition-all duration-300 group flex flex-col">
      {/* Image */}
      <div className="h-44 relative overflow-hidden bg-slate-900">
        <img
          src={build.image}
          alt={build.name}
          className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="176" fill="%230d1526"%3E%3Crect width="600" height="176"/%3E%3C/svg%3E';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1526] to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${badge.color}`}>
            {badge.label}
          </span>
          <span className="text-xl font-black gradient-text">
            ${build.totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
          {build.name}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">{build.description}</p>

        {/* Component preview */}
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Components
          </p>
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-3">
            {componentList.map(([category, component]) => (
              <div key={category} className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm">{CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]}</span>
                <span className="text-xs text-slate-400 truncate">
                  {(component as { name: string })?.name?.split(' ').slice(0, 3).join(' ')}
                </span>
              </div>
            ))}
            {Object.keys(build.components).length > 6 && (
              <span className="text-xs text-slate-600 col-span-2">
                +{Object.keys(build.components).length - 6} more…
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <Link
            to="/builder"
            onClick={() => loadBuild(build)}
            className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-semibold text-white text-center"
          >
            Load Build →
          </Link>
          <Link
            to="/viewer"
            onClick={() => loadBuild(build)}
            className="btn-secondary px-3.5 py-2.5 rounded-xl text-sm text-slate-300"
            title="View in 3D"
          >
            3D
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Presets() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-500/25 text-xs text-purple-400 mb-4">
            Expert Curated Builds
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Preset <span className="gradient-text">Build Configurations</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Hand-picked builds for every use case. Click "Load Build" to customize any preset in
            the PC Builder, then purchase your components.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {presetBuilds.map((build) => (
            <PresetCard key={build.id} build={build} />
          ))}
        </div>

        {/* Custom build CTA */}
        <div className="mt-12 text-center">
          <div className="inline-block card-bg rounded-2xl p-8 border border-white/5 max-w-lg">
            <div className="text-4xl mb-3">⚙️</div>
            <h3 className="text-lg font-bold text-white mb-2">Build from Scratch</h3>
            <p className="text-sm text-slate-400 mb-5">
              Don't like the presets? Start with a blank slate and handpick every component for
              your unique requirements.
            </p>
            <Link
              to="/builder"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
            >
              Open Custom Builder →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
