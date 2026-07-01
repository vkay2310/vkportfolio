import { Fragment } from 'react';

interface Props {
  items: string[];
}

/**
 * Infinite horizontal ticker. Purely atmospheric — no content of its own
 * beyond a handful of keywords — but it's the single cheapest way to make
 * a page feel like it's alive rather than a static screenshot. Pauses on
 * hover so it never fights someone trying to read it.
 */
export function Marquee({ items }: Props) {
  // Duplicate the list once so the track can loop seamlessly at -50%.
  const doubled = [...items, ...items];

  return (
    <div
      className="marquee-wrap relative w-full overflow-hidden border-y border-border/50 py-5"
      style={{
        background: 'rgba(6,7,12,0.55)',
        maskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <Fragment key={i}>
            <span className="font-display text-2xl md:text-4xl tracking-tight text-foreground/25 px-6 whitespace-nowrap">
              {item}
            </span>
            <span className="flex items-center px-2">
              <span className="w-2 h-2 rounded-full bg-accent/60 inline-block" style={{ boxShadow: '0 0 10px rgba(255,61,0,0.5)' }} />
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
