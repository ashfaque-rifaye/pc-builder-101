import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Builder from './pages/Builder';
import Viewer from './pages/Viewer';
import Presets from './pages/Presets';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-dark)' }}>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/viewer" element={<Viewer />} />
            <Route path="/presets" element={<Presets />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
