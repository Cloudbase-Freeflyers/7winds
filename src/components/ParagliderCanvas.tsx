"use client";

import { useEffect, useRef } from "react";

interface Glider {
  x: number;
  y: number;
  /** half-width of the canopy */
  r: number;
  speed: number;
  opacity: number;
  phase: number;
  /** base colour string, WITHOUT the closing paren, e.g. "rgba(26,187,239," */
  color: string;
}

const COLORS = [
  "rgba(255,255,255,",    // white
  "rgba(26,187,239,",     // brand-sky
  "rgba(139,196,65,",     // brand-green
  "rgba(253,214,42,",     // brand-yellow
];

function spawn(canvasW: number, canvasH: number, startRight = false): Glider {
  const r = 14 + Math.random() * 44; // 14–58 px half-width
  const depth = r / 58; // 0 = tiny/far, 1 = big/close
  return {
    x: startRight ? Math.random() * canvasW : canvasW + r * 2.5,
    y: canvasH * 0.06 + Math.random() * canvasH * 0.82,
    r,
    // bigger gliders are closer → move faster; scale to ~0.3–1.1 px/frame
    speed: 0.28 + depth * 0.85,
    opacity: 0.08 + depth * 0.32,
    phase: Math.random() * Math.PI * 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}

/**
 * Draw a single paraglider silhouette.
 * Origin (gx, gy) is the centre of the canopy leading edge.
 */
function draw(ctx: CanvasRenderingContext2D, g: Glider, time: number) {
  const { x: gx, r, opacity, color, phase } = g;
  // gentle vertical sway simulating thermals
  const gy = g.y + Math.sin(time * 0.55 + phase) * r * 0.18;

  const canopyH = r * 0.42;
  const riserGap = r * 0.16;
  const pilotY = gy + r * 0.68;

  ctx.save();
  ctx.globalAlpha = opacity;

  // ── canopy fill ──────────────────────────────────────────────
  ctx.beginPath();
  ctx.ellipse(gx, gy, r, canopyH, 0, Math.PI, 0);
  ctx.fillStyle = color + (opacity * 0.55).toFixed(2) + ")";
  ctx.fill();

  // ── canopy edge / outline ────────────────────────────────────
  ctx.beginPath();
  ctx.ellipse(gx, gy, r, canopyH, 0, Math.PI, 0);
  ctx.strokeStyle = color + "0.9)";
  ctx.lineWidth = Math.max(0.8, r * 0.04);
  ctx.stroke();

  // ── internal cell lines (give depth to the wing) ────────────
  ctx.strokeStyle = color + "0.45)";
  ctx.lineWidth = Math.max(0.5, r * 0.025);
  for (let i = 1; i <= 5; i++) {
    const t = i / 6;
    const cx = gx - r + r * 2 * t;
    const relX = (cx - gx) / r;
    const cellH = canopyH * Math.sqrt(Math.max(0, 1 - relX * relX));
    ctx.beginPath();
    ctx.moveTo(cx, gy);
    ctx.lineTo(cx, gy - cellH);
    ctx.stroke();
  }

  // ── risers / lines ───────────────────────────────────────────
  ctx.strokeStyle = color + "0.65)";
  ctx.lineWidth = Math.max(0.5, r * 0.022);
  const riserAnchors = [-r * 0.62, -r * 0.22, r * 0.22, r * 0.62];
  const pilotAnchors = [-riserGap, -riserGap * 0.4, riserGap * 0.4, riserGap];
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(gx + riserAnchors[i], gy);
    ctx.lineTo(gx + pilotAnchors[i], pilotY);
    ctx.stroke();
  }

  // ── pilot body (small ellipse) ───────────────────────────────
  ctx.beginPath();
  ctx.ellipse(gx, pilotY + r * 0.10, r * 0.09, r * 0.15, 0, 0, Math.PI * 2);
  ctx.fillStyle = color + "0.85)";
  ctx.fill();

  ctx.restore();
}

export default function ParagliderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    let rafId: number;
    let gliders: Glider[] = [];

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function init() {
      const count = Math.round((canvas.width * canvas.height) / 55000) + 7;
      gliders = Array.from({ length: count }, () =>
        spawn(canvas.width, canvas.height, true)
      );
    }

    let prev = 0;
    function frame(now: number) {
      const dt = Math.min((now - prev) / 1000, 0.05); // cap delta to 50 ms
      prev = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < gliders.length; i++) {
        draw(ctx, gliders[i], now / 1000);
        gliders[i].x -= gliders[i].speed * dt * 60;
        if (gliders[i].x < -gliders[i].r * 2.5) {
          gliders[i] = spawn(canvas.width, canvas.height, false);
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
