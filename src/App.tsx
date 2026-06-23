import { BrowserRouter, Routes, Route } from 'react-router-dom';

function Portfolio() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-sans tracking-tighter uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground outline-text">
        Vo Khoi <span className="text-accent inline-block">.</span>
      </h1>
      <p className="mt-4 text-muted-foreground text-xl font-mono">Visual Storyteller & Cinematic Editor</p>
      
      <div className="mt-12 p-6 border border-border border-l-4 border-l-accent uppercase max-w-lg text-sm tracking-widest bg-card">
        <p>Phase 1 Setup Complete</p>
        <p className="mt-2 text-muted-foreground lowercase opacity-50 block">ready to build components...</p>
      </div>
    </main>
  );
}

function Admin() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-mono">
      <h1 className="text-2xl text-accent">Dashboard / Admin</h1>
      <p className="text-muted-foreground mt-4">Local JSON Editor will be built here.</p>
    </div>
  );
}

function App() {
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
