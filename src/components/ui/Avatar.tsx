import { useState } from 'react';
import { cn } from '../../lib/utils';

interface Props {
  src?: string;
  name: string;
  size?: number;
  className?: string;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');
}

/**
 * Circular personal photo for the navbar. Falls back to a monogram badge
 * (matching the site's accent/glass treatment) when no photo has been set
 * yet, or if the image fails to load — so it never shows a broken image.
 */
export function Avatar({ src, name, size = 38, className }: Props) {
  const [errored, setErrored] = useState(false);
  const showImage = Boolean(src) && !errored;

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden shrink-0 glass-light',
        'ring-1 ring-white/15 hover:ring-accent/60 transition-all duration-300',
        className
      )}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          onError={() => setErrored(true)}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-mono font-semibold text-accent"
          style={{ fontSize: size * 0.34, background: 'var(--color-space-surface)' }}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}
