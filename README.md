# PC Builder 101 — 3D PC Configurator

> The world's most immersive PC builder. Select components, check compatibility, visualize in real-time 3D, and purchase everything in one place.

![PC Builder 101 Homepage](https://github.com/user-attachments/assets/bfa1bf85-7dfb-4779-a96b-6208749a3579)

## ✨ Features

- **Interactive 3D Viewer** — Real-time 3D rendering of your PC setup (case, monitor, keyboard, mouse) using Three.js + React Three Fiber. Drag to rotate, scroll to zoom.
- **PC Component Builder** — Choose from 50+ components across 12 categories (CPU, GPU, RAM, Motherboard, Storage, PSU, Case, Cooling, Monitor, Keyboard, Mouse, Headset).
- **Compatibility Checker** — Real-time validation of CPU↔Motherboard socket, PSU wattage, GPU fit, and cooling compatibility.
- **Price Estimator** — Live cost tracking as you add components.
- **Purchase Links** — Every component links to Amazon for easy purchasing.
- **6 Preset Builds** — Expert-curated builds: Ultimate Gaming Beast, Creator/Workstation, Budget Gaming Champion, Home Office Pro, Streaming Studio, Mid-Range Sweet Spot.
- **Persistent State** — Your build is saved to localStorage automatically.

## 🖥️ Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Hero landing page with live 3D scene and feature overview |
| PC Builder | `/builder` | Component selector with compatibility + price panels |
| 3D Viewer | `/viewer` | Full-screen interactive 3D PC model with color controls |
| Preset Builds | `/presets` | 6 expert preset configurations to load and customize |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| 3D Rendering | Three.js + React Three Fiber + Drei |
| Styling | Tailwind CSS v4 |
| State | Zustand (with localStorage persistence) |
| Routing | React Router v7 |

## 📁 Project Structure

```
src/
├── components/
│   ├── builder/          # ComponentSelector, CompatibilityChecker, PriceEstimate
│   ├── layout/           # Navbar, Footer
│   └── three/            # PCCase, Monitor, Peripherals, ParticleField, PCScene
├── data/
│   └── components.ts     # Full component database (50+ items)
├── pages/
│   ├── Home.tsx
│   ├── Builder.tsx
│   ├── Viewer.tsx
│   └── Presets.tsx
├── store/
│   └── builderStore.ts   # Zustand store + compatibility logic
└── types/
    └── index.ts          # TypeScript types
```

## 📝 Notes

- All purchase links are Amazon affiliate search links. Prices are approximate.
- The 3D scene uses procedural geometry (no external model files required).
- WebGL is required for the 3D viewer. A graceful fallback is shown on unsupported browsers.
