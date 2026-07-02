import { useEffect, useRef } from 'react';
import { usePerfTier } from '../../hooks/usePerfTier';

/**
 * ENVIRONMENT — PHASE 1 (v2: glow mạnh hơn + sao chổi)
 * OPTIMIZED:
 *  - Pre-bake star sprites lên OffscreenCanvas → không gọi shadowBlur mỗi frame
 *  - Dùng drawImage thay vì arc + shadow mỗi sao
 *  - Throttle mousemove 60fps
 *  - CSS custom prop chỉ update khi thực sự thay đổi
 *  - Giới hạn tối đa 1 comet cùng lúc
 *  - DPR cap ở 1.5 thay vì 2 (tiết kiệm ~44% pixel fill)
 *  - `willReadFrequently: false` để GPU path không bị fallback
 */

interface Star {
    x: number;
    y: number;
    r: number;
    baseAlpha: number;
    twinkleSpeed: number;
    twinklePhase: number;
    driftAmp: number;
    driftSpeed: number;
    driftPhase: number;
    hue: 'white' | 'blue' | 'accent';
    // Pre-baked sprite (set sau khi bakeSprites chạy)
    sprite?: OffscreenCanvas;
    spriteHalf?: number; // bán kính sprite để căn giữa khi drawImage
}

interface LayerConfig {
    count: number;
    rRange: [number, number];
    alphaRange: [number, number];
    parallax: number;
    blur: number;
    driftAmp: [number, number];
    twinkleSpeedRange: [number, number];
    tintChance: number;
}

const LAYERS: LayerConfig[] = [
    {
        count: 140,          // giảm từ 160 → 140
        rRange: [0.5, 1.3],
        alphaRange: [0.4, 1],
        parallax: 5,
        blur: 4,
        driftAmp: [2, 5],
        twinkleSpeedRange: [0.4, 1.1],
        tintChance: 0.06,
    },
    {
        count: 55,           // giảm từ 70 → 55
        rRange: [1.1, 2.2],
        alphaRange: [0.5, 1],
        parallax: 16,
        blur: 10,
        driftAmp: [4, 10],
        twinkleSpeedRange: [0.25, 0.8],
        tintChance: 0.15,
    },
    {
        count: 15,           // giảm từ 18 → 15
        rRange: [2.0, 3.8],
        alphaRange: [0.45, 0.8],
        parallax: 34,
        blur: 22,            // giảm từ 26 → 22
        driftAmp: [8, 20],
        twinkleSpeedRange: [0.12, 0.35],
        tintChance: 0.4,
    },
];

function seededRandom(seed: number) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

function colorRGB(hue: Star['hue']) {
    if (hue === 'accent') return '255,150,100';
    if (hue === 'blue') return '160,190,255';
    return '240,245,255';
}

/**
 * Bake một sprite sao lên OffscreenCanvas (1 lần duy nhất, không mỗi frame).
 * Sprite luôn alpha=1 (full); ta sẽ set globalAlpha khi drawImage để thay đổi độ sáng.
 */
function bakeStarSprite(star: Star, blur: number): void {
    const haloR = star.r * 2.4;
    const padding = blur + haloR + 4;
    const size = Math.ceil((haloR + padding) * 2);
    const half = size / 2;

    const oc = new OffscreenCanvas(size, size);
    const cx = oc.getContext('2d') as OffscreenCanvasRenderingContext2D;
    if (!cx) return;

    const rgb = colorRGB(star.hue);

    // Halo
    cx.shadowBlur = blur + star.r * 3;
    cx.shadowColor = `rgba(${rgb},0.55)`;
    cx.fillStyle = `rgba(${rgb},0.55)`;
    cx.beginPath();
    cx.arc(half, half, haloR, 0, Math.PI * 2);
    cx.fill();

    // Lõi
    cx.shadowBlur = blur * 0.5;
    cx.shadowColor = `rgba(${rgb},1)`;
    cx.fillStyle = `rgba(${rgb},1)`;
    cx.beginPath();
    cx.arc(half, half, star.r, 0, Math.PI * 2);
    cx.fill();

    star.sprite = oc;
    star.spriteHalf = half;
}

function buildLayer(config: LayerConfig, seedOffset: number): Star[] {
    const rand = seededRandom(9973 + seedOffset);
    const stars = Array.from({ length: config.count }, () => {
        const tinted = rand() < config.tintChance;
        const star: Star = {
            x: rand(),
            y: rand(),
            r: config.rRange[0] + rand() * (config.rRange[1] - config.rRange[0]),
            baseAlpha: config.alphaRange[0] + rand() * (config.alphaRange[1] - config.alphaRange[0]),
            twinkleSpeed: config.twinkleSpeedRange[0] + rand() * (config.twinkleSpeedRange[1] - config.twinkleSpeedRange[0]),
            twinklePhase: rand() * Math.PI * 2,
            driftAmp: config.driftAmp[0] + rand() * (config.driftAmp[1] - config.driftAmp[0]),
            driftSpeed: 0.05 + rand() * 0.09,
            driftPhase: rand() * Math.PI * 2,
            hue: tinted ? (rand() > 0.5 ? 'accent' : 'blue') : 'white',
        };
        bakeStarSprite(star, config.blur);
        return star;
    });
    return stars;
}

// Lite variant — same look, fewer stars + smaller halos, for touch/low-end
// devices where GPU fill-rate (not CPU) is the actual bottleneck.
const LAYERS_LITE: LayerConfig[] = LAYERS.map((cfg) => ({
  ...cfg,
  count: Math.round(cfg.count * 0.45),
  blur: Math.round(cfg.blur * 0.6),
}));

// Built lazily (inside the component, once) instead of at module load —
// so a "lite" device never pays to bake sprites for the "full" star count.
function buildStarLayers(tierLayers: LayerConfig[]) {
  return tierLayers.map((cfg, i) => ({ cfg, stars: buildLayer(cfg, i * 977) }));
}

// ── Dust (CSS-only, không thay đổi) ──────────────────────────
const DUST = Array.from({ length: 30 }, (_, i) => ({   // giảm từ 40 → 30
    id: i,
    left: `${(i * 2.3 + Math.sin(i) * 30 + 50) % 100}%`,
    size: `${0.8 + (i % 5) * 0.4}px`,
    delay: `${(i * 0.47) % 20}s`,
    duration: `${13 + (i % 9) * 2}s`,
    opacity: 0.12 + (i % 6) * 0.06,
    driftX: `${((i % 7) - 3) * 18}px`,
}));

// ── Comet ─────────────────────────────────────────────────────
interface Comet {
    x: number; y: number;
    vx: number; vy: number;
    life: number; maxLife: number;
    len: number; size: number;
    hue: Star['hue'];
}

function spawnComet(width: number): Comet {
    const startX = Math.random() * width * 0.7 - width * 0.05;
    const startY = -60 - Math.random() * 80;
    const angleDeg = 35 + Math.random() * 25;
    const angle = (angleDeg * Math.PI) / 180;
    const speed = 850 + Math.random() * 550;
    const hues: Star['hue'][] = ['white', 'white', 'blue', 'accent'];
    return {
        x: startX, y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.9 + Math.random() * 0.6,
        len: 110 + Math.random() * 90,
        size: 1.8 + Math.random() * 1.4,
        hue: hues[Math.floor(Math.random() * hues.length)],
    };
}

function colorFor(hue: Star['hue'], alpha: number) {
    return `rgba(${colorRGB(hue)},${alpha})`;
}

export default function Scene() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lightRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);
    const tier = usePerfTier();
    const isLite = tier === 'lite';

    useEffect(() => {
        const canvas = canvasRef.current;
        // `alpha: true` để dùng được composite mode, không cần willReadFrequently
        const ctx = canvas?.getContext('2d', { alpha: true }) as CanvasRenderingContext2D | null;
        if (!canvas || !ctx) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Sao được build ở đây (không phải module scope) — máy "lite" không
        // bao giờ tốn công bake sprite cho số lượng sao của bản "full".
        const STAR_LAYERS = buildStarLayers(isLite ? LAYERS_LITE : LAYERS);
        const MAX_COMETS = isLite ? 0 : 2;

        let width = window.innerWidth;
        let height = window.innerHeight;

        // DPR: 1 trên máy lite (giảm ~55% pixel fill so với 1.5), 1.5 trên máy full.
        const DPR = isLite ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.round(width * DPR);
            canvas.height = Math.round(height * DPR);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);

        // ── Throttled mouse (không cần update 500fps) ──────────
        let targetX = 0.5, targetY = 0.5;
        let curX = 0.5, curY = 0.5;
        let lastMouseUpdate = 0;

        const onMove = (e: MouseEvent) => {
            const now = performance.now();
            if (now - lastMouseUpdate < 16) return;  // ~60fps cap
            lastMouseUpdate = now;
            targetX = e.clientX / window.innerWidth;
            targetY = e.clientY / window.innerHeight;
        };
        window.addEventListener('mousemove', onMove, { passive: true });

        const start = performance.now();
        let lastTs = start;

        // ── Mouse light — moved via transform, NOT a repainted gradient ──
        // Rewriting a radial-gradient's center position (the old approach,
        // via a `--mouse-x/--mouse-y` CSS var) forces the browser to repaint
        // a full-viewport layer on every update — up to 60x/sec. A fixed-size
        // glow element that's *translated* instead costs the compositor
        // almost nothing (GPU just re-uses the already-rasterized layer).
        const LIGHT_HALF = 700; // matches --frame-radius in CSS below
        let prevLx = -9999, prevLy = -9999;
        const updateMouseLight = (cx: number, cy: number) => {
            const lx = cx * width;
            const ly = cy * height;
            if (Math.abs(lx - prevLx) > 1 || Math.abs(ly - prevLy) > 1) {
                if (lightRef.current) {
                    lightRef.current.style.transform = `translate3d(${lx - LIGHT_HALF}px, ${ly - LIGHT_HALF}px, 0)`;
                }
                prevLx = lx; prevLy = ly;
            }
        };

        // ── Comet state ────────────────────────────────────────
        let comets: Comet[] = [];
        let cometTimer = 0;
        let nextCometIn = 3 + Math.random() * 3;

        // ── drawStars — dùng drawImage, KHÔNG shadowBlur runtime ──
        const drawStars = (t: number, offsetX: number, offsetY: number) => {
            STAR_LAYERS.forEach(({ cfg, stars }) => {
                for (const s of stars) {
                    if (!s.sprite || s.spriteHalf === undefined) continue;

                    const drift = prefersReducedMotion ? 0 : Math.sin(t * s.driftSpeed + s.driftPhase) * s.driftAmp;
                    const px = s.x * width + offsetX * cfg.parallax + drift * 0.4;
                    const py = s.y * height + offsetY * cfg.parallax * 0.6 + drift;
                    const twinkle = prefersReducedMotion ? 1 : 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
                    const alpha = s.baseAlpha * twinkle;

                    // 1 drawImage thay cho 2× (arc + shadowBlur + fill)
                    ctx.globalAlpha = Math.min(1, alpha * 1.2);
                    ctx.drawImage(s.sprite, px - s.spriteHalf, py - s.spriteHalf);
                }
            });
            ctx.globalAlpha = 1;
        };

        // ── drawComets ─────────────────────────────────────────
        const drawComets = (dt: number) => {
            if (prefersReducedMotion || MAX_COMETS === 0) return;

            cometTimer += dt;
            if (cometTimer >= nextCometIn && comets.length < MAX_COMETS) {
                comets.push(spawnComet(width));
                cometTimer = 0;
                nextCometIn = 5 + Math.random() * 8;
            }

            comets = comets.filter(c => c.life < c.maxLife && c.y < height + 100 && c.x < width + 100);

            for (const c of comets) {
                c.x += c.vx * dt;
                c.y += c.vy * dt;
                c.life += dt;

                const lifeT = c.life / c.maxLife;
                const fade = lifeT < 0.12 ? lifeT / 0.12 : 1 - (lifeT - 0.12) / 0.88;
                const alpha = Math.max(0, fade);
                if (alpha <= 0) continue;

                const speed = Math.hypot(c.vx, c.vy);
                const dx = c.vx / speed;
                const dy = c.vy / speed;
                const tailX = c.x - dx * c.len;
                const tailY = c.y - dy * c.len;

                const grad = ctx.createLinearGradient(tailX, tailY, c.x, c.y);
                grad.addColorStop(0, colorFor(c.hue, 0));
                grad.addColorStop(1, colorFor(c.hue, alpha));

                // Giảm shadowBlur comet từ 16→10, 22→14
                ctx.shadowBlur = 10;
                ctx.shadowColor = colorFor(c.hue, alpha);
                ctx.strokeStyle = grad;
                ctx.lineWidth = c.size;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(c.x, c.y);
                ctx.stroke();

                ctx.shadowBlur = 14;
                ctx.fillStyle = colorFor('white', alpha);
                ctx.beginPath();
                ctx.arc(c.x, c.y, c.size * 1.4, 0, Math.PI * 2);
                ctx.fill();

                ctx.shadowBlur = 0;
            }
        };

        // ── Main loop ──────────────────────────────────────────
        const tick = (ts: number) => {
            const dt = Math.min((ts - lastTs) / 1000, 0.05);
            lastTs = ts;
            const t = (ts - start) / 1000;

            curX += (targetX - curX) * 0.035;
            curY += (targetY - curY) * 0.035;
            if (!isLite) updateMouseLight(curX, curY);

            const offsetX = (curX - 0.5) * 2;
            const offsetY = (curY - 0.5) * 2;

            ctx.clearRect(0, 0, width, height);

            ctx.globalCompositeOperation = 'lighter';
            drawStars(t, offsetX, offsetY);
            drawComets(dt);
            ctx.globalCompositeOperation = 'source-over';

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        // ── Pause when the tab isn't visible ────────────────────
        // Keeps the exact same animation when the tab IS visible;
        // simply stops burning GPU/CPU cycles rendering a canvas
        // nobody is looking at (background tabs, minimized window).
        const onVisibilityChange = () => {
            if (document.hidden) {
                cancelAnimationFrame(rafRef.current);
            } else {
                lastTs = performance.now();
                rafRef.current = requestAnimationFrame(tick);
            }
        };
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMove);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            cancelAnimationFrame(rafRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLite]);

    return (
        <div className="env-canvas" aria-hidden="true">
            <div className="env-sky" />
            <canvas ref={canvasRef} className="env-stars" />
            <div className="env-fog" />
            {!isLite && <div className="env-light-beams" />}
            <div className="env-dust">
                {(isLite ? DUST.slice(0, 12) : DUST).map((p) => (
                    <span
                        key={p.id}
                        className="dust-particle"
                        style={{
                            left: p.left,
                            width: p.size,
                            height: p.size,
                            opacity: p.opacity,
                            animationDelay: p.delay,
                            animationDuration: p.duration,
                            '--drift-x': p.driftX,
                        } as React.CSSProperties}
                    />
                ))}
            </div>
            {!isLite && <div ref={lightRef} className="env-mouse-light" />}
            <div className="env-noise" />
            <div className="env-vignette" />
        </div>
    );
}