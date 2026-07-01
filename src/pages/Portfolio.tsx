import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/sections/Hero';
import { FeaturedWork } from '../components/sections/FeaturedWork';
import { MoreWorks } from '../components/sections/MoreWorks';
import { About } from '../components/sections/About';
import { Contact } from '../components/sections/Contact';
import { TikTokLightbox } from '../components/ui/TikTokLightbox';
import { SectionDivider } from '../components/animations/SectionDivider';
import Scene from '../components/background/Scene';
import { useLenis } from '../hooks/useLenis';
import data from '../data/data.json';

export default function Portfolio() {
  useLenis();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  const openLightbox = (url: string) => {
    setCurrentVideoUrl(url);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Living environment — renders behind everything */}
      <Scene />

      <Navbar />
      <main className="overflow-hidden relative z-10">
        <Hero onPlay={() => openLightbox(data.hero.showreelVideoTiktokUrl)} />
        <FeaturedWork onPlay={(url) => openLightbox(url)} />
        <SectionDivider />
        <MoreWorks onPlay={(url) => openLightbox(url)} />
        <SectionDivider />
        <About />
        <SectionDivider accent />
        <Contact />
      </main>
      <TikTokLightbox
        isOpen={lightboxOpen}
        videoUrl={currentVideoUrl}
        onClose={() => setLightboxOpen(false)}
      />
      <Footer />
    </>
  );
}