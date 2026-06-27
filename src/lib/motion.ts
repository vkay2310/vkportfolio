/**
 * MOTION SYSTEM — Một ngôn ngữ animation duy nhất cho toàn bộ site.
 * Mọi component animation (FadeInUp, TextReveal, SectionTransition, hover...)
 * đều import từ đây để đảm bảo cùng "feel" cinematic, không bị lệch easing.
 */

// Easing chính — "cinematic settle": bắt đầu nhanh, kết thúc cực mượt, không bounce.
export const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const;

// Easing phụ — dùng cho tương tác nhanh (hover, tap, micro-interaction).
export const EASE_SNAP = [0.4, 0, 0.2, 1] as const;

export const DURATION = {
  fast: 0.25,
  base: 0.6,
  slow: 0.85,
  cinematic: 1.2,
} as const;

// ── Entrance variants (Phase 5) ──────────────────────────────

export const fadeInUp = {
  initial: { opacity: 0, y: 32, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: DURATION.slow, ease: EASE_CINEMATIC },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: DURATION.base, ease: EASE_CINEMATIC },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: DURATION.base, ease: EASE_CINEMATIC },
};

// Section-level entrance — nặng hơn item-level, dùng cho mỗi <section>.
export const sectionEnter = {
  initial: { opacity: 0, y: 48, scale: 0.985, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  transition: { duration: DURATION.cinematic, ease: EASE_CINEMATIC },
};

export const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

// ── Hover language (Phase 5) ─────────────────────────────────

export const hoverLift = {
  whileHover: { y: -6, transition: { duration: DURATION.fast, ease: EASE_SNAP } },
  whileTap: { y: -2, scale: 0.98, transition: { duration: 0.12, ease: EASE_SNAP } },
};

export const hoverScale = {
  whileHover: { scale: 1.04, transition: { duration: DURATION.fast, ease: EASE_SNAP } },
  whileTap: { scale: 0.97 },
};
