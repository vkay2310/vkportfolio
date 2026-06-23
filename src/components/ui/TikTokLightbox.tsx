import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  isOpen: boolean;
  videoUrl: string | null;
  onClose: () => void;
}

export function TikTokLightbox({ isOpen, videoUrl, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  // Get Lenis instance via hook, assuming hook returns the instance directly if stored globally, 
  // but since we initialize it in Portfolio, getting it here might not yield the same instance 
  // without a context. However, we can simply fallback to raw CSS overflow hidden.
  // The correct Lenis approach: standard `document.body.style.overflow = 'hidden'` is sufficient for 99% of setups.

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setLoading(true);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Extract typical Tiktok URL ID (e.g. https://www.tiktok.com/@user/video/7123456789)
  const extractId = (url: string) => {
    if (!url) return null;
    const match = url.match(/video\/(\d+)/);
    return match ? match[1] : null;
  };
  
  const videoId = videoUrl ? extractId(videoUrl) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md p-4 md:p-12"
          onClick={onClose}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 z-[110] text-foreground hover:text-accent transition-colors"
            onClick={onClose}
          >
            <X size={48} strokeWidth={1} />
          </button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="relative w-full max-w-sm aspect-[9/16] bg-card overflow-hidden shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {loading && videoId && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-muted-foreground bg-muted">
                <Loader className="animate-spin text-accent" size={32} />
                <span className="font-mono text-sm tracking-widest uppercase">Connecting...</span>
              </div>
            )}
            
            {videoId ? (
               <iframe
                 className={cn("w-full h-full border-0 absolute inset-0 transition-opacity duration-700", loading ? "opacity-0" : "opacity-100")}
                 src={`https://www.tiktok.com/embed/v2/${videoId}?lang=en-US`}
                 onLoad={() => setLoading(false)}
                 allow="autoplay; encrypted-media"
                 loading="lazy"
               />
            ) : (
               <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-4 bg-muted">
                 <p className="font-mono text-accent text-xl">X_X</p>
                 <p className="font-mono tracking-widest uppercase text-sm">Valid Link Missing</p>
                 <p className="text-muted-foreground text-xs font-mono">Please feed a correct TikTok /video/ URL in admin dashboard.</p>
               </div>
            )}
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
