import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Builder from './pages/Builder';
import BuildView from './pages/BuildView';
import Viewer from './pages/Viewer';
import Presets from './pages/Presets';
import LaptopBuilder from './pages/LaptopBuilder';
import CompareBuilds from './pages/CompareBuilds';
import { useUiStore } from './store/uiStore';

export default function App() {
  const { theme } = useUiStore();

  // Apply theme on mount and whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-theme-dark">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/build" element={<BuildView />} />
            <Route path="/compare" element={<CompareBuilds />} />
            <Route path="/laptop" element={<LaptopBuilder />} />
            <Route path="/viewer" element={<Viewer />} />
            <Route path="/presets" element={<Presets />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
