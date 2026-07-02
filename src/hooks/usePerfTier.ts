import { useEffect, useState } from 'react';

/**
 * PERF TIER — quyết định 1 lần khi load trang xem máy/trình duyệt của
 * người xem có nên nhận "full" hiệu ứng (sao, comet, backdrop-blur nặng...)
 * hay bản "lite" (ít sao hơn, không backdrop-filter, không comet).
 *
 * Không đo FPS runtime (phức tạp, dễ giật lúc đo) — chỉ dùng các tín hiệu
 * rẻ, có sẵn ngay từ đầu:
 *  - prefers-reduced-motion: người dùng chủ động tắt animation
 *  - pointer: coarse: gần như luôn là điện thoại/tablet (GPU yếu hơn desktop)
 *  - deviceMemory / hardwareConcurrency thấp: máy cấu hình thấp
 *  - màn hình nhỏ: thường đi kèm GPU di động
 */
export type PerfTier = 'full' | 'lite';

function detectTier(): PerfTier {
  if (typeof window === 'undefined') return 'full';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return 'lite';

  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const isNarrow = window.innerWidth < 820;

  // Not all browsers expose these — treat "unknown" as fine, not as a signal.
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
  const lowCores = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;

  // Mobile/touch is the strongest single signal (real-world GPU/VRAM budget
  // on phones is a fraction of a desktop's, regardless of CPU core count).
  if (isCoarsePointer && isNarrow) return 'lite';
  if (lowMemory && lowCores) return 'lite';

  return 'full';
}

export function usePerfTier(): PerfTier {
  const [tier, setTier] = useState<PerfTier>(() => detectTier());

  useEffect(() => {
    // Re-check once after mount too (some UA data isn't reliable pre-hydration).
    setTier(detectTier());
  }, []);

  return tier;
}
