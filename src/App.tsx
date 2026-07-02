import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Portfolio from './pages/Portfolio';
import Admin from './pages/Admin';
import { usePerfTier } from './hooks/usePerfTier';

function App() {
  const tier = usePerfTier();

  // `backdrop-filter` (used by .glass / .glass-light) is one of the most
  // GPU/VRAM-expensive things a browser can do — it has to continuously
  // re-blur everything behind it, which is brutal when what's behind it is
  // an animated starfield. On phones/low-end devices, swap it for a plain
  // solid panel (still looks like a dark glass surface, just not a live
  // blur) via a single class toggle on <html> — see `.perf-lite` in index.css.
  useEffect(() => {
    document.documentElement.classList.toggle('perf-lite', tier === 'lite');
  }, [tier]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
