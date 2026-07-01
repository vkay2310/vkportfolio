interface Props {
  /** Tints the blend toward the accent color instead of neutral fog —
   * use sparingly, e.g. right before Contact. */
  accent?: boolean;
}

/**
 * A thin, mostly-transparent strip placed between two sections. It carries
 * no content of its own — its only job is to soften the seam where one
 * section's background ends and the next begins, instead of an abrupt cut.
 */
export function SectionDivider({ accent = false }: Props) {
  return (
    <div
      aria-hidden="true"
      className="relative h-12 md:h-20 pointer-events-none"
      style={{
        background: accent
          ? 'linear-gradient(to bottom, transparent 0%, rgba(255,61,0,0.05) 50%, transparent 100%)'
          : 'linear-gradient(to bottom, transparent 0%, rgba(80,120,255,0.03) 50%, transparent 100%)',
      }}
    />
  );
}
