import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader, VideoOff, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLenisInstance } from '../../hooks/useLenis';

interface Props {
  isOpen: boolean;
  videoUrl: string | null;
  onClose: () => void;
}

// Extract the numeric TikTok post id from any well-formed video URL,
// e.g. https://www.tiktok.com/@user/video/7123456789012345678?query=...
function extractId(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : null;
}

export function TikTokLightbox({ isOpen, videoUrl, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lenis = useLenisInstance();

  const videoId = extractId(videoUrl);
  const hasVideo = Boolean(videoId);


  // Lock/unlock the *real* scroll engine. Lenis hijacks native scrolling,
  // so toggling `body.style.overflow` alone leaves the page scrollable
  // behind the backdrop — we have to talk to Lenis directly.
  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
      // Move focus into the dialog for keyboard/screen-reader users.
      closeBtnRef.current?.focus();
    } else {
      lenis?.start();
      document.body.style.overflow = '';
      setLoading(true);
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
    };
  }, [isOpen, lenis]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Video preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md p-4 md:p-12"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            ref={closeBtnRef}
            className="absolute top-6 right-6 z-[110] text-foreground hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 rounded-full"
            onClick={onClose}
            aria-label="Close video preview"
          >
            <X size={48} strokeWidth={1} />
          </button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm aspect-[9/16] bg-card overflow-hidden shadow-2xl border border-border depth-3 media-frame"
            onClick={(e) => e.stopPropagation()}
          >
            {hasVideo ? (
              <>
                {loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-muted-foreground bg-muted z-10">
                    <Loader className="animate-spin text-accent" size={32} />
                    <span className="font-mono text-sm tracking-widest uppercase">Connecting...</span>
                  </div>
                )}

                {/*
                  Official TikTok Embed Player (developers.tiktok.com/doc/embed-player).
                  Plays the real video inline, muted-autoplay + loop, no local video
                  file is ever hosted — view counts still credit the TikTok account.
                */}
                <iframe
                  key={videoId}
                  ref={iframeRef}
                  className={cn(
                    'w-full h-full border-0 absolute inset-0 transition-opacity duration-700',
                    loading ? 'opacity-0' : 'opacity-100'
                  )}
                  src={`https://www.tiktok.com/player/v1/${videoId}?autoplay=1&loop=1&music_info=0&description=0&rel=0&closed_caption=0`}
                  onLoad={() => setLoading(false)}
                  allow="autoplay; fullscreen; encrypted-media"
                  allowFullScreen
                  loading="lazy"
                  title="TikTok video player"
                />

                {/* Drives the genuine view/engagement back to the TikTok post */}
                <a
                  href={videoUrl ?? undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 glass px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-foreground/80 hover:text-accent transition-colors duration-300"
                >
                  Open on TikTok <ExternalLink size={11} />
                </a>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-4 bg-muted">
                <VideoOff className="text-accent" size={32} strokeWidth={1.5} />
                <p className="font-mono tracking-widest uppercase text-sm">Video Coming Soon</p>
                <p className="text-muted-foreground text-xs font-mono leading-relaxed">
                  This project doesn't have a TikTok link yet. Add a valid /video/ URL in the admin dashboard to enable preview.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
