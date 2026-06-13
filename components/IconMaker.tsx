"use client";

import { CATEGORIES, FRAMES, getFrame, type Frame } from "@/lib/frames";
import { useCallback, useEffect, useRef, useState } from "react";

const BG_COLORS = [
  { color: "#ffffff", label: "白" },
  { color: "#1a1a1a", label: "黒" },
  { color: "#9ca3af", label: "グレー" },
  { color: "#f472b6", label: "ピンク" },
  { color: "#60a5fa", label: "ブルー" },
  { color: "#34d399", label: "ミント" },
  { color: "#fbbf24", label: "イエロー" },
];

const FILTERS = [
  { id: "none", name: "なし", css: "" },
  { id: "sepia", name: "セピア", css: "sepia(0.9)" },
  { id: "mono", name: "モノクロ", css: "grayscale(1)" },
  {
    id: "vintage",
    name: "ヴィンテージ",
    css: "sepia(0.45) contrast(0.85) brightness(1.1) saturate(0.75)",
  },
  {
    id: "warm",
    name: "ウォーム",
    css: "sepia(0.3) saturate(1.5) brightness(1.05)",
  },
  {
    id: "cool",
    name: "クール",
    css: "saturate(0.85) brightness(1.08) hue-rotate(15deg)",
  },
  {
    id: "fade",
    name: "フェード",
    css: "contrast(0.8) brightness(1.2) saturate(0.6)",
  },
  { id: "vivid", name: "ビビッド", css: "saturate(2) contrast(1.1)" },
  {
    id: "drama",
    name: "ドラマ",
    css: "contrast(1.5) brightness(0.85) saturate(0.9)",
  },
];

const RING_PRESETS = [
  "#E4000F",
  "#f97316",
  "#fbbf24",
  "#34d399",
  "#60a5fa",
  "#7c3aed",
  "#f472b6",
  "#1a1a1a",
  "#ffffff",
  "#9ca3af",
];

// SVG paths (100×100 viewBox, center 50,50) for each Pokemon type icon
const POKEMON_TYPE_PATHS: Record<string, string> = {
  normal:   "M88,50 A38,38 0 1 0 12,50 A38,38 0 1 0 88,50 Z M72,50 A22,22 0 1 0 28,50 A22,22 0 1 0 72,50 Z",
  fire:     "M50,8 C55,18 66,18 64,32 C74,24 72,40 65,48 C76,40 80,54 72,64 C66,74 56,78 50,80 C44,78 34,74 28,64 C20,54 24,40 35,48 C28,40 26,24 36,32 C34,18 45,18 50,8 Z",
  water:    "M50,8 C50,8 18,46 18,62 A32,32 0 0 0 82,62 C82,46 50,8 50,8 Z",
  electric: "M62,8 L32,52 L52,52 L38,92 L72,46 L50,46 Z",
  grass:    "M50,10 C74,10 86,28 86,48 C86,66 74,80 60,86 L50,92 L40,86 C26,80 14,66 14,48 C14,28 26,10 50,10 Z",
  ice:      "M50,10 L59,34 L85,30 L68,50 L85,70 L59,66 L50,90 L41,66 L15,70 L32,50 L15,30 L41,34 Z",
  fighting: "M14,44 C14,36 20,28 30,28 L44,28 C50,28 52,35 52,44 L52,74 C52,80 50,88 44,88 L30,88 C20,88 14,82 14,74 Z M52,44 C52,35 54,28 60,28 L70,28 C80,28 86,36 86,44 L86,74 C86,82 80,88 70,88 L58,88 C54,88 52,80 52,74 Z",
  poison:   "M50,15 C65,15 78,26 78,42 C78,53 72,62 62,65 L64,76 C65,80 62,84 58,84 L53,84 L50,90 L47,84 L42,84 C38,84 35,80 36,76 L38,65 C28,62 22,53 22,42 C22,26 35,15 50,15 Z M45,42 A7,7 0 1 0 31,42 A7,7 0 1 0 45,42 Z M69,42 A7,7 0 1 0 55,42 A7,7 0 1 0 69,42 Z",
  ground:   "M10,38 C22,28 38,48 50,38 C62,28 78,48 90,38 L90,52 C78,62 62,42 50,52 C38,62 22,42 10,52 Z M10,60 C22,50 38,70 50,60 C62,50 78,70 90,60 L90,74 C78,84 62,64 50,74 C38,84 22,64 10,74 Z",
  flying:   "M50,55 C36,34 12,28 8,44 C4,57 26,66 50,55 Z M50,55 C64,34 88,28 92,44 C96,57 74,66 50,55 Z M46,56 L44,75 L50,68 L56,75 L54,56 Z",
  psychic:  "M50,8 L54,28 L72,18 L64,36 L84,32 L72,46 L90,50 L72,54 L84,68 L64,64 L72,82 L54,72 L50,92 L46,72 L28,82 L36,64 L16,68 L28,54 L10,50 L28,46 L16,32 L36,36 L28,18 L46,28 Z",
  bug:      "M50,40 C65,40 75,51 75,64 C75,77 65,87 50,87 C35,87 25,77 25,64 C25,51 35,40 50,40 Z M43,64 A7,7 0 1 0 29,64 A7,7 0 1 0 43,64 Z M71,64 A7,7 0 1 0 57,64 A7,7 0 1 0 71,64 Z M36,42 L24,14 L28,10 L40,38 Z M64,42 L76,14 L72,10 L60,38 Z",
  rock:     "M18,78 L38,35 L52,57 L64,28 L82,78 Z",
  ghost:    "M24,44 C24,28 36,18 50,18 C64,18 76,28 76,44 L76,80 L67,72 L60,80 L53,72 L47,80 L40,72 L33,80 L24,72 Z M45,44 A7,7 0 1 0 31,44 A7,7 0 1 0 45,44 Z M69,44 A7,7 0 1 0 55,44 A7,7 0 1 0 69,44 Z",
  dragon:   "M20,65 C20,40 36,18 58,22 C78,26 90,46 86,68 C82,84 68,92 54,89 C36,86 20,78 20,65 Z M58,22 C63,9 78,7 82,18 L76,22 C72,14 63,14 58,22 Z",
  dark:     "M50,18 C74,18 88,36 88,56 C88,74 74,88 57,90 L50,94 L43,90 C26,88 12,74 12,56 C12,36 26,18 50,18 Z M36,46 L43,54 L36,62 L29,54 Z M64,46 L71,54 L64,62 L57,54 Z M36,72 C40,80 46,84 50,84 C54,84 60,80 64,72 C60,68 54,70 50,70 C46,70 40,68 36,72 Z",
  steel:    "M50,12 L75,27 L75,57 L50,72 L25,57 L25,27 Z M50,22 L67,32 L67,52 L50,62 L33,52 L33,32 Z",
  fairy:    "M50,10 L57,33 L78,22 L67,43 L90,50 L67,57 L78,78 L57,67 L50,90 L43,67 L22,78 L33,57 L10,50 L33,43 L22,22 L43,33 Z",
};

function drawTypeIcon(
  ctx: CanvasRenderingContext2D,
  pathStr: string,
  cx: number,
  cy: number,
  r: number,
  color = "#ffffff"
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(r / 50, r / 50);
  ctx.translate(-50, -50);
  const p = new Path2D(pathStr);
  ctx.fillStyle = color;
  ctx.fill(p, "evenodd");
  ctx.restore();
}

const patternTileCache = new Map<string, HTMLCanvasElement>();

function createPatternCanvas(name: string): HTMLCanvasElement | null {
  const hit = patternTileCache.get(name);
  if (hit) return hit;

  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  if (!ctx) return null;

  switch (name) {
    case "wood": {
      const TW = 200,
        TH = 60;
      c.width = TW;
      c.height = TH;

      let prng = 0xf1d2c3b4;
      const rng = () => {
        prng ^= prng << 13;
        prng ^= prng >>> 17;
        prng ^= prng << 5;
        return (prng >>> 0) / 0x100000000;
      };

      // Smooth value noise (bilinear interpolated random grid)
      const makeNoise = (
        scale: number,
        amp: number,
        ox = 0,
        oy = 0
      ): Float32Array => {
        const GW = Math.ceil(TW / scale) + 2;
        const GH = Math.ceil(TH / scale) + 2;
        const g = new Float32Array(GW * GH);
        for (let i = 0; i < g.length; i++) g[i] = rng();
        const out = new Float32Array(TW * TH);
        for (let y = 0; y < TH; y++) {
          for (let x = 0; x < TW; x++) {
            const sx = (x + ox) / scale,
              sy = (y + oy) / scale;
            const gx0 = Math.min(Math.floor(sx), GW - 2),
              gy0 = Math.min(Math.floor(sy), GH - 2);
            const fx = sx - gx0,
              fy = sy - gy0;
            const ux = fx * fx * (3 - 2 * fx),
              uy = fy * fy * (3 - 2 * fy);
            out[y * TW + x] =
              ((g[gy0 * GW + gx0] * (1 - ux) + g[gy0 * GW + gx0 + 1] * ux) *
                (1 - uy) +
                (g[(gy0 + 1) * GW + gx0] * (1 - ux) +
                  g[(gy0 + 1) * GW + gx0 + 1] * ux) *
                  uy) *
                2 *
                amp -
              amp;
          }
        }
        return out;
      };

      // Organic flowing grain — no board joints, one prominent knot
      const disp1 = makeNoise(55, 6); // large bow ±6px
      const disp2 = makeNoise(20, 3); // medium ±3px
      const disp3 = makeNoise(8, 1.2); // fine ±1.2px
      const colorN = makeNoise(40, 1.3, 80, 40); // amber tonal range

      ctx.fillStyle = "#BA8840";
      ctx.fillRect(0, 0, TW, TH);
      const img = ctx.getImageData(0, 0, TW, TH);
      const d = img.data;

      // Single prominent knot near center
      const knots = [{ x: 105, y: 30, r: 9 }];

      for (let y = 0; y < TH; y++) {
        for (let x = 0; x < TW; x++) {
          const ni = y * TW + x;

          // Knot: dark center + light halo + strong grain wrap
          let kDisp = 0,
            kDark = 0;
          for (const k of knots) {
            const dx = x - k.x,
              dy = y - k.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const kf = Math.max(0, 1 - dist / (k.r * 4.5));
            if (kf > 0) {
              kDisp += kf * k.r * Math.sin(Math.atan2(dy, dx)) * 3.0;
              if (dist < k.r) {
                kDark += (1 - dist / k.r) * 95; // very dark center
              } else if (dist < k.r * 2) {
                kDark -= Math.max(0, 1 - (dist - k.r) / k.r) * 18; // light halo
              }
            }
          }

          const gY = y + disp1[ni] + disp2[ni] + disp3[ni] + kDisp;
          const period = 5;
          const t = (((gY % period) + period) % period) / period;

          // Earlywood / latewood — moderate contrast
          const late = t > 0.58 ? (t - 0.58) / 0.42 : 0;
          const grain = late * late * 48;
          const boundary = Math.max(0, 1 - Math.min(t, 1 - t) * 9) * 14;

          const fine = (rng() * 14 - 7) | 0;
          const cv = colorN[ni];

          // Warm amber-honey brown
          const dark = grain + boundary + kDark;
          d[ni * 4] = Math.max(
            5,
            Math.min(255, (190 + cv * 24 - dark + fine) | 0)
          );
          d[ni * 4 + 1] = Math.max(
            3,
            Math.min(255, (145 + cv * 18 - dark * 0.83 + fine) | 0)
          );
          d[ni * 4 + 2] = Math.max(
            0,
            Math.min(210, (65 + cv * 9 - dark * 0.52 + fine) | 0)
          );
          d[ni * 4 + 3] = 255;
        }
      }

      ctx.putImageData(img, 0, 0);
      break;
    }
    case "brick": {
      // 4-row tile with per-pixel smooth noise for natural irregularity
      const TW = 120,
        TH = 44;
      c.width = TW;
      c.height = TH;

      let prng = 0xd3b07a5f;
      const rng = () => {
        prng ^= prng << 13;
        prng ^= prng >>> 17;
        prng ^= prng << 5;
        return (prng >>> 0) / 0x100000000;
      };

      // Pre-generate smooth value noise (bilinear-interpolated random grid)
      const makeNoise = (
        scale: number,
        amp: number,
        ox = 0,
        oy = 0
      ): Float32Array => {
        const GW = Math.ceil(TW / scale) + 2;
        const GH = Math.ceil(TH / scale) + 2;
        const g = new Float32Array(GW * GH);
        for (let i = 0; i < g.length; i++) g[i] = rng();
        const out = new Float32Array(TW * TH);
        for (let y = 0; y < TH; y++) {
          for (let x = 0; x < TW; x++) {
            const sx = (x + ox) / scale,
              sy = (y + oy) / scale;
            const gx0 = Math.floor(sx),
              gy0 = Math.floor(sy);
            const fx = sx - gx0,
              fy = sy - gy0;
            const ux = fx * fx * (3 - 2 * fx),
              uy = fy * fy * (3 - 2 * fy);
            out[y * TW + x] =
              ((g[gy0 * GW + gx0] * (1 - ux) + g[gy0 * GW + gx0 + 1] * ux) *
                (1 - uy) +
                (g[(gy0 + 1) * GW + gx0] * (1 - ux) +
                  g[(gy0 + 1) * GW + gx0 + 1] * ux) *
                  uy) *
                2 *
                amp -
              amp;
          }
        }
        return out;
      };

      // Two octaves of smooth noise for surface variation
      const largeN = makeNoise(14, 38); // big tonal blobs ±38
      const medN = makeNoise(5, 20, 47, 31); // medium variation ±20

      // Light cream mortar
      ctx.fillStyle = "#c8b8a8";
      ctx.fillRect(0, 0, TW, TH);

      const img = ctx.getImageData(0, 0, TW, TH);
      const d = img.data;

      // Mortar texture via noise
      const mortarN = makeNoise(4, 10, 90, 60);
      for (let i = 0; i < TW * TH; i++) {
        const n = mortarN[i] | 0;
        d[i * 4] = Math.max(0, Math.min(255, d[i * 4] + n));
        d[i * 4 + 1] = Math.max(0, Math.min(255, d[i * 4 + 1] + n));
        d[i * 4 + 2] = Math.max(
          0,
          Math.min(255, d[i * 4 + 2] + ((n * 0.9) | 0))
        );
      }

      // Pale terracotta / salmon tones — light and stylish
      const brickPalette: [number, number, number][] = [
        [222, 162, 138], // dusty salmon
        [235, 178, 155], // light peach-coral
        [210, 148, 122], // medium terracotta
        [242, 192, 170], // very pale peach
        [218, 158, 132], // warm salmon
        [200, 138, 112], // deeper dusty rose
        [238, 185, 162], // soft apricot
        [226, 170, 145], // classic pale brick
      ];

      // Layout: 4 rows, each row has 4 bricks (30px unit), stagger odd rows by 15px
      const BW = 28,
        BH = 9;
      for (let row = 0; row < 4; row++) {
        const by = row * 11 + 1;
        const xOff = row % 2 === 1 ? -15 : 0;
        for (let col = 0; col < 4; col++) {
          const bx = 1 + col * 30 + xOff;
          const ci = (row * 4 + col) % 8;
          const [r0, g0, b0] = brickPalette[ci];
          // Per-brick tint variation ±22 (subtle, not harsh)
          const tint = (rng() * 44 - 22) | 0;
          const br = Math.max(140, Math.min(255, r0 + tint));
          const bg_ = Math.max(100, Math.min(240, g0 + ((tint * 0.7) | 0)));
          const bb = Math.max(70, Math.min(220, b0 + ((tint * 0.55) | 0)));

          for (let dy = 0; dy < BH; dy++) {
            for (let dx = 0; dx < BW; dx++) {
              const px = (((bx + dx) % TW) + TW) % TW;
              const py = by + dy;
              if (py < 0 || py >= TH) continue;

              const ni = py * TW + px;
              // Smooth noise + fine grain
              const smooth = (largeN[ni] * 0.7 + medN[ni]) | 0;
              const fine = (rng() * 22 - 11) | 0;
              // Horizontal layering (light kiln lines)
              const grain = (Math.sin(dx * 0.4 + ci * 1.6) * 7) | 0;
              // Soft edge depth
              const ex = Math.min(dx, BW - 1 - dx);
              const ey = Math.min(dy, BH - 1 - dy);
              const edgeDark =
                Math.min(ex, ey) < 1 ? 22 : Math.min(ex, ey) < 2 ? 8 : 0;
              const bottomDark =
                dy >= BH - 2 ? (BH - 1 - dy === 0 ? 22 : 10) : 0;
              const topLight = dy === 1 ? 10 : 0;

              const delta =
                smooth + fine + grain + topLight - edgeDark - bottomDark;
              const pi = ni * 4;
              d[pi] = Math.max(120, Math.min(255, br + delta));
              d[pi + 1] = Math.max(
                90,
                Math.min(250, bg_ + ((delta * 0.75) | 0))
              );
              d[pi + 2] = Math.max(60, Math.min(230, bb + ((delta * 0.6) | 0)));
              d[pi + 3] = 255;
            }
          }
        }
      }

      ctx.putImageData(img, 0, 0);
      break;
    }
    case "tile": {
      c.width = 24;
      c.height = 24;
      ctx.fillStyle = "#8eaec8";
      ctx.fillRect(0, 0, 24, 24);
      const colors = ["#d6eaf8", "#aed6f1", "#e8f4fc", "#c5dff0"];
      [
        [0, 0, 0],
        [1, 0, 1],
        [0, 1, 2],
        [1, 1, 3],
      ].forEach(([col, row, ci]) => {
        ctx.fillStyle = colors[ci];
        ctx.fillRect(col * 12 + 1, row * 12 + 1, 10, 10);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillRect(col * 12 + 1, row * 12 + 1, 10, 1);
      });
      break;
    }
    case "concrete": {
      const TW = 200, TH = 200;
      c.width = TW;
      c.height = TH;

      let prng = 0xa3b7c9d1;
      const rng = () => {
        prng ^= prng << 13;
        prng ^= prng >>> 17;
        prng ^= prng << 5;
        return (prng >>> 0) / 0x100000000;
      };

      const makeNoise = (scale: number): Float32Array => {
        const GW = Math.ceil(TW / scale) + 2;
        const GH = Math.ceil(TH / scale) + 2;
        const g = new Float32Array(GW * GH);
        for (let i = 0; i < g.length; i++) g[i] = rng();
        const out = new Float32Array(TW * TH);
        for (let y = 0; y < TH; y++) {
          for (let x = 0; x < TW; x++) {
            const sx = x / scale, sy = y / scale;
            const gx0 = Math.min(Math.floor(sx), GW - 2);
            const gy0 = Math.min(Math.floor(sy), GH - 2);
            const fx = sx - gx0, fy = sy - gy0;
            const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
            out[y * TW + x] =
              g[gy0 * GW + gx0] * (1 - ux) * (1 - uy) +
              g[gy0 * GW + gx0 + 1] * ux * (1 - uy) +
              g[(gy0 + 1) * GW + gx0] * (1 - ux) * uy +
              g[(gy0 + 1) * GW + gx0 + 1] * ux * uy;
          }
        }
        return out;
      };

      const n1 = makeNoise(70); // 大きなトーン変化
      const n2 = makeNoise(22); // 中スケール
      const n3 = makeNoise(7);  // 細粒

      // 地肌：淡いクールグレー + ピクセル粒子ノイズ
      const img = ctx.createImageData(TW, TH);
      for (let y = 0; y < TH; y++) {
        for (let x = 0; x < TW; x++) {
          const ni = y * TW + x;
          const v = 0.76 + n1[ni] * 0.07 + n2[ni] * 0.04 + n3[ni] * 0.025;
          const grain = (rng() - 0.5) * 14; // ピクセルレベルの細粒感
          const r = Math.round(Math.max(155, Math.min(228, v * 255 + grain)));
          const g8 = Math.round(Math.max(155, Math.min(228, v * 255 + grain - 2)));
          const b = Math.round(Math.max(160, Math.min(235, v * 255 + grain + 6)));
          img.data[ni * 4] = r;
          img.data[ni * 4 + 1] = g8;
          img.data[ni * 4 + 2] = b;
          img.data[ni * 4 + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);

      // 骨材（砂粒）: 極小 — 高密度
      for (let i = 0; i < 900; i++) {
        const px = rng() * TW, py = rng() * TH;
        const pr = 0.3 + rng() * 1.2;
        const dark = 0.12 + rng() * 0.42;
        const lum = Math.round(dark * 255);
        ctx.globalAlpha = 0.55 + rng() * 0.45;
        ctx.fillStyle = `rgb(${lum},${lum},${lum + 8})`;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      }

      // 骨材: 中サイズ — 不規則な楕円形
      for (let i = 0; i < 160; i++) {
        const px = rng() * TW, py = rng() * TH;
        const pr = 1.2 + rng() * 3.8;
        const dark = 0.15 + rng() * 0.40;
        const lum = Math.round(dark * 255);
        ctx.globalAlpha = 0.45 + rng() * 0.45;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(rng() * Math.PI);
        ctx.scale(1, 0.35 + rng() * 0.55);
        ctx.fillStyle = `rgb(${lum},${lum},${lum + 6})`;
        ctx.beginPath();
        ctx.arc(0, 0, pr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 骨材: 大粒 — 少数
      for (let i = 0; i < 35; i++) {
        const px = rng() * TW, py = rng() * TH;
        const pr = 3.5 + rng() * 5.5;
        const dark = 0.22 + rng() * 0.32;
        const lum = Math.round(dark * 255);
        ctx.globalAlpha = 0.35 + rng() * 0.40;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(rng() * Math.PI);
        ctx.scale(1, 0.3 + rng() * 0.5);
        ctx.fillStyle = `rgb(${lum},${lum},${lum + 5})`;
        ctx.beginPath();
        ctx.arc(0, 0, pr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      break;
    }
    case "alum": {
      // Brushed aluminum: diagonal scratch streaks (45°), multi-scale, seamlessly tiling
      // NSIZE = TW = TH ensures pos = (y-x) mod NSIZE tiles perfectly in both axes
      const TW = 200, TH = 200;
      c.width = TW;
      c.height = TH;

      let prng = 0xc4d3e2f1;
      const rng = () => {
        prng ^= prng << 13;
        prng ^= prng >>> 17;
        prng ^= prng << 5;
        return (prng >>> 0) / 0x100000000;
      };

      // 1D streak brightness table, period = NSIZE = TW = TH
      const NSIZE = 200;
      const streakTable = new Float32Array(NSIZE);
      for (let i = 0; i < NSIZE; i++) streakTable[i] = rng();

      const sampleStreak = (t: number): number => {
        const p = ((t % NSIZE) + NSIZE) % NSIZE;
        const i0 = Math.floor(p) % NSIZE;
        const i1 = (i0 + 1) % NSIZE;
        const f = p - Math.floor(p);
        const u = f * f * (3 - 2 * f);
        return streakTable[i0] * (1 - u) + streakTable[i1] * u;
      };

      // 2D warp noise, periodic over TW×TH (8×8 grid)
      const WG = 8;
      const warpTable = new Float32Array(WG * WG);
      for (let i = 0; i < WG * WG; i++) warpTable[i] = rng() * 2 - 1;

      const sampleWarp = (wx: number, wy: number): number => {
        const ix = ((Math.floor(wx) % WG) + WG) % WG;
        const iy = ((Math.floor(wy) % WG) + WG) % WG;
        const fx = wx - Math.floor(wx), fy = wy - Math.floor(wy);
        const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
        return (
          warpTable[iy * WG + ix] * (1 - ux) * (1 - uy) +
          warpTable[iy * WG + (ix + 1) % WG] * ux * (1 - uy) +
          warpTable[((iy + 1) % WG) * WG + ix] * (1 - ux) * uy +
          warpTable[((iy + 1) % WG) * WG + (ix + 1) % WG] * ux * uy
        );
      };

      const img = ctx.createImageData(TW, TH);
      for (let y = 0; y < TH; y++) {
        for (let x = 0; x < TW; x++) {
          const ni = y * TW + x;
          // Gentle warp for soft waviness
          const warp = sampleWarp((x / TW) * WG, (y / TH) * WG) * 5;
          const pos = ((y - x + warp) % NSIZE + NSIZE) % NSIZE;
          // Low frequencies dominate → gradient feel, fine lines barely visible
          const s_broad = sampleStreak(pos * 0.014 + 10);  // ~70px 広いグラデ帯
          const s_mid   = sampleStreak(pos * 0.055 + 70);  // ~18px 中帯
          const s_fine  = sampleStreak(pos * 0.18  + 140); // ~6px  うっすら質感
          const v = 0.52 + s_broad * 0.28 + s_mid * 0.12 + s_fine * 0.05;
          const lum = Math.round(Math.max(128, Math.min(248, v * 255)));
          img.data[ni * 4]     = lum;
          img.data[ni * 4 + 1] = lum;
          img.data[ni * 4 + 2] = Math.min(255, lum + 16); // 青みシルバー
          img.data[ni * 4 + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      break;
    }
    case "iron": {
      // Riveted iron plate (リベット鉄板)
      const TW = 24, TH = 24;
      c.width = TW;
      c.height = TH;

      // Dark plate base
      ctx.fillStyle = "#242424";
      ctx.fillRect(0, 0, TW, TH);

      // Plate section grooves
      ctx.fillStyle = "#141414";
      ctx.fillRect(0, 0, TW, 1);
      ctx.fillRect(0, 0, 1, TH);
      ctx.fillRect(0, 12, TW, 1);
      ctx.fillRect(12, 0, 1, TH);

      // Subtle plate surface sheen
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      ctx.fillRect(1, 1, 11, 11);
      ctx.fillRect(13, 13, 11, 11);

      // Rivets at each quadrant center
      for (const [rx, ry] of [[6, 6], [18, 6], [6, 18], [18, 18]]) {
        // Shadow
        ctx.fillStyle = "#0e0e0e";
        ctx.beginPath();
        ctx.arc(rx + 0.8, ry + 0.8, 3.5, 0, Math.PI * 2);
        ctx.fill();
        // Body
        ctx.fillStyle = "#383838";
        ctx.beginPath();
        ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
        ctx.fill();
        // Top highlight
        ctx.fillStyle = "#5a5a5a";
        ctx.beginPath();
        ctx.arc(rx - 1, ry - 1, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "tire": {
      c.width = 16;
      c.height = 16;
      ctx.fillStyle = "#111111";
      ctx.fillRect(0, 0, 16, 16);
      ctx.strokeStyle = "#2d2d2d";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-2, 10);
      ctx.lineTo(6, -2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(6, 18);
      ctx.lineTo(18, 6);
      ctx.stroke();
      ctx.strokeStyle = "#262626";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-2, 14);
      ctx.lineTo(2, -2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(14, 18);
      ctx.lineTo(18, 14);
      ctx.stroke();
      ctx.strokeStyle = "#383838";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 16);
      ctx.lineTo(16, 0);
      ctx.stroke();
      break;
    }
    case "glitter-pink":
    case "glitter-gold":
    case "glitter-silver":
    case "glitter-holo": {
      const TW = 200,
        TH = 200;
      c.width = TW;
      c.height = TH;
      const baseCols: Record<string, string> = {
        "glitter-pink": "#FFE0F0",
        "glitter-gold": "#FFF8D0",
        "glitter-silver": "#F0F0F4",
        "glitter-holo": "#F0EEFF",
      };
      ctx.fillStyle = baseCols[name];
      ctx.fillRect(0, 0, TW, TH);
      let prng = 0xf1e2d3c4;
      const rng = () => {
        prng ^= prng << 13;
        prng ^= prng >>> 17;
        prng ^= prng << 5;
        return (prng >>> 0) / 0x100000000;
      };
      const sparkleColors: Record<string, string[]> = {
        "glitter-pink": ["#FF69B4", "#FF1493", "#FFB6D9", "#FFFFFF", "#FF85C8"],
        "glitter-gold": ["#FFD700", "#FFA500", "#FFE55C", "#FFFFFF", "#D4AF37"],
        "glitter-silver": [
          "#C0C0C0",
          "#A8A8A8",
          "#E8E8E8",
          "#FFFFFF",
          "#888888",
        ],
        "glitter-holo": [
          "#FF69B4",
          "#00CED1",
          "#FFD700",
          "#FFFFFF",
          "#AA88FF",
          "#FF6347",
          "#7CFC00",
        ],
      };
      const cols = sparkleColors[name];
      for (let i = 0; i < 220; i++) {
        const x = rng() * TW,
          y = rng() * TH;
        const sz = 0.8 + rng() * 2.8;
        const col = cols[Math.floor(rng() * cols.length)];
        ctx.fillStyle = col;
        ctx.globalAlpha = 0.5 + rng() * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, sz, 0, Math.PI * 2);
        ctx.fill();
        // cross sparkle on larger dots
        if (sz > 2) {
          ctx.lineWidth = 0.6;
          ctx.strokeStyle = col;
          ctx.beginPath();
          ctx.moveTo(x - sz * 2, y);
          ctx.lineTo(x + sz * 2, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, y - sz * 2);
          ctx.lineTo(x, y + sz * 2);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      break;
    }
    default:
      return null;
  }
  patternTileCache.set(name, c);
  return c;
}

function drawRing(
  ctx: CanvasRenderingContext2D,
  f: Frame,
  size: number,
  color1: string,
  color2?: string,
  ringPct = 8.5
) {
  if (!color1 && !f.render) return;
  const ringW = size * (ringPct / 100);
  const cx = size / 2,
    cy = size / 2;
  const r = size / 2 - ringW / 2 - 1;
  ctx.lineWidth = ringW;

  // ── Realistic tire: direct ring draw with arc text ──
  if (f.render?.kind === "pattern" && f.render.name === "tire") {
    const ro = size / 2 - 2;
    const ri = ro - ringW + 1;
    const tRi = ri + ringW * 0.44; // tread inner boundary

    // Dark rubber base
    ctx.beginPath();
    ctx.arc(cx, cy, ro, 0, Math.PI * 2, false);
    ctx.arc(cx, cy, ri, 0, Math.PI * 2, true);
    ctx.fillStyle = "#191919";
    ctx.fill();

    // Tread zone (outer 56%)
    ctx.beginPath();
    ctx.arc(cx, cy, ro, 0, Math.PI * 2, false);
    ctx.arc(cx, cy, tRi, 0, Math.PI * 2, true);
    ctx.fillStyle = "#202020";
    ctx.fill();

    // Circumferential grooves
    const gw = Math.max(1, ringW * 0.055);
    ctx.strokeStyle = "#0f0f0f";
    ctx.lineWidth = gw;
    [
      tRi,
      tRi + (ro - tRi) * 0.34,
      tRi + (ro - tRi) * 0.67,
      ro - gw * 0.6,
    ].forEach((rad) => {
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Lateral tread cuts (alternating slant)
    const nCuts = Math.round((2 * Math.PI * (tRi + ro)) / 2 / (ringW * 0.58));
    ctx.lineWidth = Math.max(0.5, ringW * 0.028);
    for (let i = 0; i < nCuts; i++) {
      const a = (2 * Math.PI * i) / nCuts;
      const sl = ringW * 0.04 * (i % 2 === 0 ? 1 : -1);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.moveTo(tRi, sl);
      ctx.lineTo(ro, -sl * 0.5);
      ctx.strokeStyle = "#0f0f0f";
      ctx.stroke();
      ctx.restore();
    }

    // Inner shoulder highlight
    ctx.beginPath();
    ctx.arc(cx, cy, tRi - gw * 0.4, 0, Math.PI * 2);
    ctx.strokeStyle = "#2c2c2c";
    ctx.lineWidth = gw * 1.4;
    ctx.stroke();

    // ── Brand text "MARU  ICON" ──
    const textR = ri + ringW * 0.19;
    const fs = Math.max(3, ringW * 0.27);
    ctx.font = `900 ${fs}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const brand = "MARU  ICON  "; // 12 chars × 15° = 180° per rep
    const ca = Math.PI / brand.length;

    for (let rep = 0; rep < 2; rep++) {
      for (let i = 0; i < brand.length; i++) {
        const a = rep * Math.PI + i * ca;
        // Emboss shadow
        ctx.fillStyle = "#0e0e0e";
        ctx.save();
        ctx.translate(cx + 0.5, cy + 0.5);
        ctx.rotate(a);
        ctx.translate(0, -textR);
        ctx.fillText(brand[i], 0, 0);
        ctx.restore();
        // Raised face
        ctx.fillStyle = "#484848";
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(a);
        ctx.translate(0, -textR);
        ctx.fillText(brand[i], 0, 0);
        ctx.restore();
      }
    }

    // ── Sub text "SNS  ICON  " (model line) ──
    const subR = ri + ringW * 0.36;
    const sfs = Math.max(2, ringW * 0.15);
    ctx.font = `700 ${sfs}px Arial, sans-serif`;
    const sub = "SNS  ICON   ";
    const sca = Math.PI / sub.length;
    for (let rep = 0; rep < 2; rep++) {
      for (let i = 0; i < sub.length; i++) {
        const a = rep * Math.PI + Math.PI / 8 + i * sca;
        ctx.fillStyle = "#2e2e2e";
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(a);
        ctx.translate(0, -subR);
        ctx.fillText(sub[i], 0, 0);
        ctx.restore();
      }
    }

    return;
  }

  if (f.render?.kind === "pattern") {
    const tile = createPatternCanvas(f.render.name);
    if (!tile) return;
    const ro = r + ringW / 2;
    const ri = r - ringW / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, ro, 0, Math.PI * 2);
    ctx.arc(cx, cy, ri, 0, Math.PI * 2);
    ctx.clip("evenodd");
    const tw = tile.width,
      th = tile.height;
    for (let ty = 0; ty < size; ty += th) {
      for (let tx = 0; tx < size; tx += tw) {
        ctx.drawImage(tile, tx, ty);
      }
    }
    ctx.restore();
    return;
  }

  if (f.render?.kind === "segments") {
    const { colors, n } = f.render;
    const seg = (2 * Math.PI) / n;
    const start = -Math.PI / 2;
    const gap = 0.003;
    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, start + i * seg - gap, start + (i + 1) * seg + gap);
      ctx.strokeStyle = colors[i % colors.length];
      ctx.stroke();
    }
    return;
  }

  if (f.render?.kind === "conic") {
    const g = ctx.createConicGradient(-Math.PI / 2, cx, cy);
    f.render.stops.forEach(([offset, color]) => g.addColorStop(offset, color));
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = g;
    ctx.stroke();
    return;
  }

  const c2 = color2 ?? f.ring2;
  if (c2 && f.splitDir) {
    if (f.splitDir === "tb") {
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
      ctx.strokeStyle = color1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI);
      ctx.strokeStyle = c2;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI / 2, (3 * Math.PI) / 2);
      ctx.strokeStyle = color1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2);
      ctx.strokeStyle = c2;
      ctx.stroke();
    }
  } else {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = color1;
    ctx.stroke();
  }
}

export default function IconMaker() {
  const [selectedFrameId, setSelectedFrameId] = useState("hero-red");
  const [category, setCategory] = useState("simple");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [zoom, setZoom] = useState(100);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDragHint, setShowDragHint] = useState(false);
  const dragHintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const resetConfirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [filterId, setFilterId] = useState("none");
  const [customRingColor, setCustomRingColor] = useState<string | null>(null);
  const [customRingColor2, setCustomRingColor2] = useState<string | null>(null);
  const [ringPct, setRingPct] = useState(8.5);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const previewRef = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const frame = getFrame(selectedFrameId);
  const filteredFrames =
    category === "all" ? FRAMES : FRAMES.filter((f) => f.category === category);

  const drawPreview = useCallback(() => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const size = Math.round(canvas.width / dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const f = getFrame(selectedFrameId);
    const cx = size / 2;
    const cy = size / 2;
    const ringW = size * (ringPct / 100);
    const innerR = size / 2 - ringW + 1;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
    if (photoRef.current) {
      const scale = zoom / 100;
      const imgW = size * scale;
      const imgH =
        (photoRef.current.naturalHeight / photoRef.current.naturalWidth) * imgW;
      const filterCss = FILTERS.find((fi) => fi.id === filterId)?.css ?? "";
      ctx.filter = filterCss || "none";
      ctx.drawImage(
        photoRef.current,
        cx - imgW / 2 + offsetX,
        cy - imgH / 2 + offsetY,
        imgW,
        imgH
      );
      ctx.filter = "none";
    }
    ctx.restore();

    const ringC1 = customRingColor ?? f.ring;
    const ringC2 = customRingColor2 ?? undefined;
    drawRing(ctx, f, size, ringC1, ringC2, ringPct);

    {
      const typeName = f.id.startsWith("pk-") ? f.id.slice(3) : null;
      const typePath = typeName ? POKEMON_TYPE_PATHS[typeName] : null;
      if (f.emblem || typePath) {
        const er = Math.min(size * 0.1, ringW * 0.44);
        const ey = cy - (size / 2 - ringW * 0.5);
        ctx.beginPath();
        ctx.arc(cx, ey, er, 0, Math.PI * 2);
        ctx.fillStyle = typePath ? (customRingColor ?? f.ring) : f.emblemBg;
        ctx.fill();
        if (typePath) {
          drawTypeIcon(ctx, typePath, cx, ey, er * 0.85);
        } else {
          ctx.font = `bold ${er * 1.1}px sans-serif`;
          ctx.fillStyle = "#fff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(f.emblem, cx, ey);
        }
      }
    }
  }, [
    selectedFrameId,
    bgColor,
    zoom,
    offsetX,
    offsetY,
    customRingColor,
    customRingColor2,
    ringPct,
    filterId,
  ]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      const size = canvas.offsetWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      drawPreview();
    });
    ro.observe(canvas);
    const dpr = window.devicePixelRatio || 1;
    const size = canvas.offsetWidth || 280;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    drawPreview();
    return () => ro.disconnect();
  }, [drawPreview]);

  const loadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      setZoom(100);
      setOffsetX(0);
      setOffsetY(0);
      const img = new Image();
      img.onload = () => {
        photoRef.current = img;
        drawPreview();
        if (dragHintTimer.current) clearTimeout(dragHintTimer.current);
        setShowDragHint(true);
        dragHintTimer.current = setTimeout(() => setShowDragHint(false), 2500);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!imageSrc) return;
    setShowDragHint(false);
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      ox: offsetX,
      oy: offsetY,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setOffsetX(dragStart.current.ox + e.clientX - dragStart.current.x);
    setOffsetY(dragStart.current.oy + e.clientY - dragStart.current.y);
  };
  const onPointerUp = () => setIsDragging(false);

  const renderIcon = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const SIZE = 512;
      const oc = offscreenRef.current;
      if (!oc) {
        reject(new Error("no canvas"));
        return;
      }
      oc.width = SIZE;
      oc.height = SIZE;
      const ctx = oc.getContext("2d");
      if (!ctx) {
        reject(new Error("no context"));
        return;
      }
      const f = getFrame(selectedFrameId);
      const cx = SIZE / 2,
        cy = SIZE / 2;
      const ringW = SIZE * (ringPct / 100);
      const innerR = SIZE / 2 - ringW + 1;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, SIZE, SIZE);
      if (photoRef.current) {
        const scale = zoom / 100;
        const dpr = window.devicePixelRatio || 1;
        const ratio = previewRef.current ? previewRef.current.width / dpr / SIZE : 1;
        const imgW = SIZE * scale;
        const imgH =
          (photoRef.current.naturalHeight / photoRef.current.naturalWidth) *
          imgW;
        const filterCss = FILTERS.find((fi) => fi.id === filterId)?.css ?? "";
        ctx.filter = filterCss || "none";
        ctx.drawImage(
          photoRef.current,
          cx - imgW / 2 + offsetX / ratio,
          cy - imgH / 2 + offsetY / ratio,
          imgW,
          imgH
        );
        ctx.filter = "none";
      }
      ctx.restore();

      const ringC1 = customRingColor ?? f.ring;
      const ringC2 = customRingColor2 ?? undefined;
      drawRing(ctx, f, SIZE, ringC1, ringC2, ringPct);

      {
        const typeName = f.id.startsWith("pk-") ? f.id.slice(3) : null;
        const typePath = typeName ? POKEMON_TYPE_PATHS[typeName] : null;
        if (f.emblem || typePath) {
          const er = Math.min(SIZE * 0.1, ringW * 0.44);
          const ey = cy - (SIZE / 2 - ringW * 0.5);
          ctx.beginPath();
          ctx.arc(cx, ey, er, 0, Math.PI * 2);
          ctx.fillStyle = typePath ? (customRingColor ?? f.ring) : f.emblemBg;
          ctx.fill();
          if (typePath) {
            drawTypeIcon(ctx, typePath, cx, ey, er * 0.85);
          } else {
            ctx.font = `bold ${er * 1.1}px sans-serif`;
            ctx.fillStyle = "#fff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(f.emblem, cx, ey);
          }
        }
      }

      oc.toBlob((blob) => {
        if (!blob) {
          reject(new Error("blob failed"));
          return;
        }
        resolve(blob);
      }, "image/png");
    });
  };

  const download = async () => {
    const blob = await renderIcon().catch(() => null);
    if (!blob) return;
    const file = new File([blob], "maru-icon.png", { type: "image/png" });
    const isMobile = /iP(hone|ad|od)|Android/i.test(navigator.userAgent);
    if (isMobile && navigator.canShare?.({ files: [file] })) {
      await navigator
        .share({ files: [file], title: "まるアイコン" })
        .catch(() => {});
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = "maru-icon.png";
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const shareToLine = async () => {
    const isMobile = /iP(hone|ad|od)|Android/i.test(navigator.userAgent);
    if (isMobile) {
      const blob = await renderIcon().catch(() => null);
      if (!blob) return;
      const file = new File([blob], "maru-icon.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator
          .share({
            files: [file],
            title: "まるアイコン",
            text: "プロフィール画像を作ったよ🎉",
            url: "https://maru-icon.com",
          })
          .catch(() => {});
        return;
      }
    }
    window.open(
      "https://social-plugins.line.me/lineit/share?url=" +
        encodeURIComponent("https://maru-icon.com"),
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareToX = async () => {
    const isMobile = /iP(hone|ad|od)|Android/i.test(navigator.userAgent);
    if (isMobile) {
      const blob = await renderIcon().catch(() => null);
      if (blob) {
        const file = new File([blob], "maru-icon.png", { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator
            .share({
              files: [file],
              title: "まるアイコン",
              text: "プロフィール画像を作ったよ🎉 #まるアイコン",
              url: "https://maru-icon.com",
            })
            .catch(() => {});
          return;
        }
      }
    }
    window.open(
      "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent("プロフィール画像を作ったよ🎉 #まるアイコン") +
        "&url=" +
        encodeURIComponent("https://maru-icon.com"),
      "_blank",
      "noopener,noreferrer"
    );
  };

  const selectFrame = (id: string) => {
    setSelectedFrameId(id);
    setCustomRingColor(null);
    setCustomRingColor2(null);
  };

  const ringC1 = customRingColor ?? frame.ring;
  const ringC2 = customRingColor2 ?? frame.ring2;

  return (
    <div className="max-w-5xl mx-auto px-3 py-4 md:py-8">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_280px] gap-4">
        {/* 左カラム */}
        <div className="flex flex-col gap-4">
          {/* Step1: アップロード */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="flex items-center gap-2 px-4 pt-4 pb-2">
              <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                1
              </span>
              <span className="font-bold text-sm">写真をアップロード</span>
            </div>
            <div className="px-4 pb-4">
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  imageSrc
                    ? "border-green-400 bg-green-50"
                    : "border-gray-200 hover:border-red-400 hover:bg-red-50"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files[0];
                  if (f) loadFile(f);
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) loadFile(f);
                  }}
                />
                {imageSrc ? (
                  <>
                    <img
                      src={imageSrc}
                      className="w-16 h-16 object-cover rounded-lg mx-auto mb-2"
                      alt="preview"
                    />
                    <p className="text-xs font-bold text-green-600">
                      ✓ アップロード完了
                    </p>
                    <p className="text-xs text-gray-400 mt-1">タップして変更</p>
                  </>
                ) : (
                  <>
                    <div className="text-3xl mb-2">🖼️</div>
                    <p className="text-sm font-semibold text-gray-700">
                      写真を選ぶ
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      またはドラッグ&ドロップ
                    </p>
                    <p className="text-xs text-gray-400">
                      JPG / PNG / WEBP 対応
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Step2: フレーム */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="flex items-center gap-2 px-4 pt-4 pb-2">
              <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                2
              </span>
              <span className="font-bold text-sm">フレームを選ぶ</span>
            </div>
            <div className="px-4 pb-4">
              {/* 現在選択中 */}
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded-xl mb-3">
                <FrameThumb
                  frame={frame}
                  size={36}
                  color1={ringC1}
                  color2={ringC2}
                />
                <span className="text-sm font-bold flex-1">{frame.name}</span>
              </div>
              {/* カテゴリタブ */}
              <div className="flex gap-1.5 flex-wrap mb-3">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${
                      category === c.id
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              {/* フレームグリッド */}
              <div className="grid grid-cols-4 gap-1.5">
                {filteredFrames.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => selectFrame(f.id)}
                    className={`p-1.5 rounded-xl text-center transition-all border-2 ${
                      f.id === selectedFrameId
                        ? "border-red-500 bg-red-50"
                        : "border-transparent bg-gray-50 hover:border-red-200"
                    }`}
                  >
                    <FrameThumb frame={f} size={40} />
                    <p className="text-[9px] font-semibold text-gray-700 mt-1 leading-tight">
                      {f.name}
                    </p>
                  </button>
                ))}
              </div>

              {/* 太さ */}
              {frame.id !== "none" && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-gray-500">
                      フレームの太さ
                    </p>
                    <span className="text-xs text-gray-400">
                      {Math.round(ringPct)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={20}
                    step={0.5}
                    value={ringPct}
                    onChange={(e) => setRingPct(Number(e.target.value))}
                    className="w-full accent-red-500"
                  />
                </div>
              )}

              {/* カラーカスタマイズ（テクスチャ・なし以外） */}
              {frame.id !== "none" && !frame.render && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    {frame.splitDir ? "カラーA（左 / 上）" : "フレームカラー"}
                  </p>
                  <div className="flex gap-1.5 flex-wrap items-center">
                    {RING_PRESETS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCustomRingColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition-all flex-shrink-0 ${
                          ringC1 === c
                            ? "border-red-500 scale-110"
                            : "border-gray-200"
                        }`}
                        style={{ background: c }}
                        title={c}
                      />
                    ))}
                    <input
                      type="color"
                      value={ringC1 || "#E4000F"}
                      onChange={(e) => setCustomRingColor(e.target.value)}
                      className="w-6 h-6 rounded-full cursor-pointer border border-gray-200 p-0"
                      title="カスタムカラー"
                    />
                  </div>
                  {frame.splitDir && (
                    <>
                      <p className="text-xs font-semibold text-gray-500 mt-3 mb-2">
                        カラーB（右 / 下）
                      </p>
                      <div className="flex gap-1.5 flex-wrap items-center">
                        {RING_PRESETS.map((c) => (
                          <button
                            key={c}
                            onClick={() => setCustomRingColor2(c)}
                            className={`w-6 h-6 rounded-full border-2 transition-all flex-shrink-0 ${
                              ringC2 === c
                                ? "border-red-500 scale-110"
                                : "border-gray-200"
                            }`}
                            style={{ background: c }}
                            title={c}
                          />
                        ))}
                        <input
                          type="color"
                          value={ringC2 || "#1a1a1a"}
                          onChange={(e) => setCustomRingColor2(e.target.value)}
                          className="w-6 h-6 rounded-full cursor-pointer border border-gray-200 p-0"
                          title="カスタムカラー"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 中央: プレビュー */}
        <div className="bg-white rounded-2xl shadow">
          <p className="text-center font-bold text-sm py-3 border-b border-gray-100">
            プレビュー
          </p>
          <div className="flex justify-center items-center p-6 bg-red-50">
            <div className="relative w-full max-w-[280px] aspect-square">
              {showDragHint && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <span
                    style={{
                      fontSize: "2.5rem",
                      animation: "hint-drag 1.2s ease-in-out infinite",
                    }}
                  >
                    👆
                  </span>
                </div>
              )}
              <canvas
                ref={previewRef}
                className="w-full h-full rounded-full cursor-grab active:cursor-grabbing"
                style={{ touchAction: "none" }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
              />
            </div>
          </div>
          {/* ズーム */}
          <div className="px-5 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-sm">🔍</span>
              <input
                type="range"
                min={50}
                max={200}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-red-500"
              />
              <span className="text-sm">🔍</span>
              <button
                onClick={() => {
                  setOffsetX(0);
                  setOffsetY(0);
                  setZoom(100);
                }}
                className="flex-shrink-0 px-2 py-1 text-xs font-bold border border-gray-200 rounded-lg hover:border-red-400 text-gray-500 transition-colors"
              >
                ↺
              </button>
            </div>
            <p className="text-center text-xs text-gray-400">
              スライダーでズーム・プレビューをドラッグで移動
            </p>
          </div>
          {/* フィルター */}
          <div className="px-5 pb-3 border-t border-gray-100 pt-3">
            <p className="text-xs text-gray-400 mb-2">フィルター</p>
            <div className="flex gap-2 flex-nowrap overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0">
              {FILTERS.map((fi) => (
                <button
                  key={fi.id}
                  onClick={() => setFilterId(fi.id)}
                  className={`flex-shrink-0 text-center transition-opacity ${
                    filterId === fi.id
                      ? "opacity-100"
                      : "opacity-50 hover:opacity-75"
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-full border-2 mx-auto mb-1 ${
                      filterId === fi.id ? "border-red-500" : "border-gray-200"
                    }`}
                    style={{
                      background:
                        "linear-gradient(135deg, #f9a8d4, #fbbf24, #34d399, #60a5fa)",
                      filter: fi.css || undefined,
                    }}
                  />
                  <p className="text-[9px] text-gray-600 leading-tight">
                    {fi.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* 背景色 */}
          <div className="px-5 pb-5 border-t border-gray-100 pt-3">
            <p className="text-xs text-gray-400 mb-1">背景色</p>
            <p className="text-[10px] text-gray-300 mb-2">
              透過PNG（ロゴ・イラスト等）で有効
            </p>
            <div className="flex gap-2 flex-wrap">
              {BG_COLORS.map(({ color, label }) => (
                <button
                  key={color}
                  title={label}
                  onClick={() => setBgColor(color)}
                  className={`w-8 h-8 rounded-full transition-all border-2 ${
                    bgColor === color
                      ? "border-red-500 scale-110"
                      : "border-gray-200"
                  }`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 右カラム */}
        <div className="flex flex-col gap-4">
          {/* Step3: ダウンロード */}
          <div className="bg-white rounded-2xl shadow">
            <div className="flex items-center gap-2 px-4 pt-4 pb-3">
              <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                3
              </span>
              <span className="font-bold text-sm">ダウンロード</span>
            </div>
            <div className="px-4 pb-4 flex flex-col gap-2">
              <button
                onClick={download}
                disabled={!imageSrc}
                className="w-full py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                ⬇ 画像を保存する
              </button>
              <div className="flex gap-2">
                <button
                  onClick={shareToLine}
                  disabled={!imageSrc}
                  className="flex-1 py-2.5 text-xs font-bold bg-[#06C755] hover:bg-[#05aa4a] disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.477 2 2 6.036 2 11.073c0 4.49 3.164 8.244 7.467 9.01.327.064.773.197.886.453.101.233.066.598.032.835l-.144.857c-.044.253-.202 1.01.887.55 1.089-.46 5.878-3.459 8.02-5.922C20.627 15.29 22 13.306 22 11.073 22 6.036 17.523 2 12 2z" />
                  </svg>
                  LINE
                </button>
                <button
                  onClick={shareToX}
                  disabled={!imageSrc}
                  className="flex-1 py-2.5 text-xs font-bold bg-black hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X でシェア
                </button>
              </div>
              {resetConfirm ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      photoRef.current = null;
                      setImageSrc(null);
                      setZoom(100);
                      setOffsetX(0);
                      setOffsetY(0);
                      setResetConfirm(false);
                      if (resetConfirmTimer.current)
                        clearTimeout(resetConfirmTimer.current);
                      drawPreview();
                    }}
                    className="flex-1 py-2.5 text-xs font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                  >
                    リセットする
                  </button>
                  <button
                    onClick={() => {
                      setResetConfirm(false);
                      if (resetConfirmTimer.current)
                        clearTimeout(resetConfirmTimer.current);
                    }}
                    className="flex-1 py-2.5 text-xs font-bold border border-gray-200 rounded-xl hover:border-gray-400 text-gray-500 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (!imageSrc) {
                      setZoom(100);
                      setOffsetX(0);
                      setOffsetY(0);
                      return;
                    }
                    setResetConfirm(true);
                    if (resetConfirmTimer.current)
                      clearTimeout(resetConfirmTimer.current);
                    resetConfirmTimer.current = setTimeout(
                      () => setResetConfirm(false),
                      3000
                    );
                  }}
                  className="w-full py-2.5 text-xs font-bold border border-gray-200 rounded-xl hover:border-gray-400 text-gray-500 transition-colors"
                >
                  ↺ もう一度つくる
                </button>
              )}
              {!imageSrc && (
                <p className="text-center text-xs text-gray-400">
                  写真をアップロードすると保存できます
                </p>
              )}
            </div>
          </div>

          {/* SNS用途説明 */}
          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-xs font-bold text-gray-600 mb-2">
              💡 こんな用途に
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>✓ LINE プロフィール画像</li>
              <li>✓ X（Twitter）アイコン</li>
              <li>✓ Instagram プロフィール</li>
              <li>✓ Discord・Slack アバター</li>
              <li>✓ YouTube チャンネルアイコン</li>
            </ul>
            <p className="text-xs text-gray-400 mt-2">
              512×512px のPNG形式で保存
            </p>
          </div>
        </div>
      </div>

      <canvas ref={offscreenRef} className="hidden" />
    </div>
  );
}

function FrameThumb({
  frame,
  size,
  color1,
  color2,
}: {
  frame: Frame;
  size: number;
  color1?: string;
  color2?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const cx = size / 2,
      cy = size / 2,
      r = size / 2 - 2;
    ctx.clearRect(0, 0, size, size);

    const lw = size * 0.15;
    ctx.lineWidth = lw;

    if (!frame.ring && !frame.render && !color1) {
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "#d1d5db";
      ctx.stroke();
      ctx.setLineDash([]);
      return;
    }

    if (frame.render?.kind === "pattern") {
      const tile = createPatternCanvas(frame.render.name);
      if (tile) {
        const ro = r + lw / 2;
        const ri = r - lw / 2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, ro, 0, Math.PI * 2);
        ctx.arc(cx, cy, ri, 0, Math.PI * 2);
        ctx.clip("evenodd");
        const tw = tile.width,
          th = tile.height;
        for (let ty = 0; ty < size; ty += th) {
          for (let tx = 0; tx < size; tx += tw) {
            ctx.drawImage(tile, tx, ty);
          }
        }
        ctx.restore();
      }
    } else if (frame.render?.kind === "segments") {
      const { colors, n } = frame.render;
      const seg = (2 * Math.PI) / n;
      const start = -Math.PI / 2;
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, start + i * seg, start + (i + 1) * seg + 0.01);
        ctx.strokeStyle = colors[i % colors.length];
        ctx.stroke();
      }
    } else if (frame.render?.kind === "conic") {
      const g = ctx.createConicGradient(-Math.PI / 2, cx, cy);
      frame.render.stops.forEach(([offset, color]) =>
        g.addColorStop(offset, color)
      );
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = g;
      ctx.stroke();
    } else {
      const c1 = color1 ?? frame.ring;
      const c2 = color2 ?? frame.ring2;
      if (c2 && frame.splitDir) {
        if (frame.splitDir === "tb") {
          ctx.beginPath();
          ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
          ctx.strokeStyle = c1;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI);
          ctx.strokeStyle = c2;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(cx, cy, r, Math.PI / 2, (3 * Math.PI) / 2);
          ctx.strokeStyle = c1;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2);
          ctx.strokeStyle = c2;
          ctx.stroke();
        }
      } else {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = c1;
        ctx.stroke();
      }
    }

    {
      const typeName = frame.id.startsWith("pk-") ? frame.id.slice(3) : null;
      const typePath = typeName ? POKEMON_TYPE_PATHS[typeName] : null;
      if (frame.emblem || typePath) {
        if (typePath) {
          drawTypeIcon(ctx, typePath, cx, cy, size * 0.3, frame.ring);
        } else {
          ctx.font = `bold ${size * 0.3}px sans-serif`;
          ctx.fillStyle = frame.ring;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(frame.emblem, cx, cy);
        }
      }
    }
  }, [frame, size, color1, color2]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="rounded-full mx-auto"
      style={{ width: size, height: size }}
    />
  );
}
