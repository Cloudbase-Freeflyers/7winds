"use client";

import { useEffect, useRef } from "react";

// Focal / vanishing point ratios (relative to canvas size)
const FX = 0.5;   // horizontal centre
const FY = 0.28;  // upper third — the "horizon"

const COLORS = [
  "rgba(255,255,255,",
  "rgba(26,187,239,",
  "rgba(139,196,65,",
  "rgba(253,214,42,",
];

interface Glider {
  /** spawn position, jittered slightly around the focal point */
  ox: number;
  oy: number;
  /** direction the glider flies outward from the focal point */
  angle: number;
  /** 0→1 lifecycle progress */
  t: number;
  speed: number;
  /** canopy half-width at t = 1 */
  maxR: number;
  /** peak opacity */
  maxAlpha: number;
  /** oscillation phase for thermal sway */
  phase: number;
  color: string;
}

function createGlider(W: number, H: number, stagger = false): Glider {
  // spawn jittered around the vanishing point
  const jitter = Math.min(W, H) * 0.07;
  const ox = W * FX + (Math.random() - 0.5) * jitter * 2;
  const oy = H * FY + (Math.random() - 0.5) * jitter;

  // bias angles downward so most gliders fly toward the lower viewport
  // range: roughly -100° to +280° centred on "down" (90°)
  const angle = (Math.random() - 0.5) * Math.PI * 1.6 + Math.PI * 0.5;

  return {
    ox, oy, angle,
    t: stagger ? Math.random() * 0.85 : 0,
    speed: 0.0028 + Math.random() * 0.0032,
    maxR: 36 + Math.random() * 56,
    maxAlpha: 0.18 + Math.random() * 0.38,
    phase: Math.random() * Math.PI * 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}

function drawGlider(
  ctx: CanvasRenderingContext2D,
  g: Glider,
  W: number,
  H: number,
  timeSec: number,
) {
  const { ox, oy, angle, t, maxR, maxAlpha, color, phase } = g;

  // Canopy radius grows with t
  const r = maxR * t;
  if (r < 1) return;

  // Travel distance from focal point
  const dist = t * Math.max(W, H) * 0.9;
  const cx = ox + Math.cos(angle) * dist;
  const cy = oy + Math.sin(angle) * dist;

  // Bell-curve opacity: fade in fast, hold, fade out gently
  const alpha = Math.sin(Math.min(t * Math.PI, Math.PI)) * maxAlpha;
  if (alpha < 0.008) return;

  // Thermal sway — amplitude scales with size (bigger = more sway)
  const sway = Math.sin(timeSec * 0.65 + phase) * r * 0.10;
  const gy = cy + sway;

  // Slight banking tilt in the direction of sway
  const tiltRad = (sway / r) * 0.22;

  const canopyH = r * 0.40;
  const riserGap = r * 0.15;
  const pilotY = gy + r * 0.66;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, gy);
  ctx.rotate(tiltRad);
  ctx.translate(-cx, -gy);

  // ── canopy fill ────────────────────────────────────────
  ctx.beginPath();
  ctx.ellipse(cx, gy, r, canopyH, 0, Math.PI, 0);
  ctx.fillStyle = color + (alpha * 0.5).toFixed(2) + ")";
  ctx.fill();

  // ── canopy edge ────────────────────────────────────────
  ctx.beginPath();
  ctx.ellipse(cx, gy, r, canopyH, 0, Math.PI, 0);
  ctx.strokeStyle = color + "0.95)";
  ctx.lineWidth = Math.max(0.6, r * 0.038);
  ctx.stroke();

  // ── internal cell lines ────────────────────────────────
  ctx.strokeStyle = color + "0.4)";
  ctx.lineWidth = Math.max(0.4, r * 0.022);
  for (let i = 1; i <= 5; i++) {
    const frac = i / 6;
    const cellX = cx - r + r * 2 * frac;
    const relX = (cellX - cx) / r;
    const cellH = canopyH * Math.sqrt(Math.max(0, 1 - relX * relX));
    ctx.beginPath();
    ctx.moveTo(cellX, gy);
    ctx.lineTo(cellX, gy - cellH);
    ctx.stroke();
  }

  // ── risers ────────────────────────────────────────────
  ctx.strokeStyle = color + "0.6)";
  ctx.lineWidth = Math.max(0.4, r * 0.020);
  const wingAnchors = [-r * 0.60, -r * 0.20, r * 0.20, r * 0.60];
  const harnessAnchors = [-riserGap, -riserGap * 0.35, riserGap * 0.35, riserGap];
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(cx + wingAnchors[i], gy);
    ctx.lineTo(cx + harnessAnchors[i], pilotY);
    ctx.stroke();
  }

  // ── pilot body ────────────────────────────────────────
  ctx.beginPath();
  ctx.ellipse(cx, pilotY + r * 0.09, r * 0.085, r * 0.14, 0, 0, Math.PI * 2);
  ctx.fillStyle = color + "0.85)";
  ctx.fill();

  ctx.restore();
}

export default function ParagliderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let gliders: Glider[] = [];

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function init() {
      // 10–14 gliders; stagger their progress so the screen isn't empty at start
      const count = Math.max(10, Math.round((canvas.width * canvas.height) / 60000));
      gliders = Array.from({ length: count }, () =>
        createGlider(canvas.width, canvas.height, true),
      );
    }

    let prev = 0;
    function frame(now: number) {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const W = canvas.width;
      const H = canvas.height;

      for (let i = 0; i < gliders.length; i++) {
        drawGlider(ctx, gliders[i], W, H, now / 1000);
        gliders[i].t += gliders[i].speed * dt * 60;
        if (gliders[i].t >= 1) {
          gliders[i] = createGlider(W, H, false);
        }
      }

      rafId = requestAnimationFrame(frame);
    }

    const ro = new ResizeObserver(() => {
      resize();
      init();
    });
    ro.observe(canvas);
    resize();
    init();
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      aria-hidden
    />
  );
}
