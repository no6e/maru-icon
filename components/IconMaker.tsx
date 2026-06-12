"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { FRAMES, CATEGORIES, getFrame, type Frame } from "@/lib/frames";

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
  { id: "none",    name: "なし",       css: "" },
  { id: "sepia",   name: "セピア",     css: "sepia(0.9)" },
  { id: "mono",    name: "モノクロ",   css: "grayscale(1)" },
  { id: "vintage", name: "ヴィンテージ", css: "sepia(0.45) contrast(0.85) brightness(1.1) saturate(0.75)" },
  { id: "warm",    name: "ウォーム",   css: "sepia(0.3) saturate(1.5) brightness(1.05)" },
  { id: "cool",    name: "クール",     css: "saturate(0.85) brightness(1.08) hue-rotate(15deg)" },
  { id: "fade",    name: "フェード",   css: "contrast(0.8) brightness(1.2) saturate(0.6)" },
  { id: "vivid",   name: "ビビッド",   css: "saturate(2) contrast(1.1)" },
  { id: "drama",   name: "ドラマ",     css: "contrast(1.5) brightness(0.85) saturate(0.9)" },
];

const RING_PRESETS = [
  "#E4000F", "#f97316", "#fbbf24", "#34d399",
  "#60a5fa", "#7c3aed", "#f472b6", "#1a1a1a",
  "#ffffff", "#9ca3af",
];

function createPatternCanvas(name: string): HTMLCanvasElement | null {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  if (!ctx) return null;

  switch (name) {
    case "wood": {
      const TW = 200, TH = 60;
      c.width = TW; c.height = TH;

      let prng = 0xF1D2C3B4;
      const rng = () => {
        prng ^= prng << 13; prng ^= prng >>> 17; prng ^= prng << 5;
        return (prng >>> 0) / 0x100000000;
      };

      // Smooth value noise (bilinear interpolated random grid)
      const makeNoise = (scale: number, amp: number, ox = 0, oy = 0): Float32Array => {
        const GW = Math.ceil(TW / scale) + 2;
        const GH = Math.ceil(TH / scale) + 2;
        const g = new Float32Array(GW * GH);
        for (let i = 0; i < g.length; i++) g[i] = rng();
        const out = new Float32Array(TW * TH);
        for (let y = 0; y < TH; y++) {
          for (let x = 0; x < TW; x++) {
            const sx = (x + ox) / scale, sy = (y + oy) / scale;
            const gx0 = Math.min(Math.floor(sx), GW - 2), gy0 = Math.min(Math.floor(sy), GH - 2);
            const fx = sx - gx0, fy = sy - gy0;
            const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
            out[y * TW + x] = (
              (g[gy0*GW+gx0]*(1-ux) + g[gy0*GW+gx0+1]*ux) * (1-uy) +
              (g[(gy0+1)*GW+gx0]*(1-ux) + g[(gy0+1)*GW+gx0+1]*ux) * uy
            ) * 2 * amp - amp;
          }
        }
        return out;
      };

      // Organic flowing grain — no board joints, one prominent knot
      const disp1 = makeNoise(55, 6);    // large bow ±6px
      const disp2 = makeNoise(20, 3);    // medium ±3px
      const disp3 = makeNoise(8, 1.2);   // fine ±1.2px
      const colorN = makeNoise(40, 1.3, 80, 40);  // amber tonal range

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
          let kDisp = 0, kDark = 0;
          for (const k of knots) {
            const dx = x - k.x, dy = y - k.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const kf = Math.max(0, 1 - dist / (k.r * 4.5));
            if (kf > 0) {
              kDisp += kf * k.r * Math.sin(Math.atan2(dy, dx)) * 3.0;
              if (dist < k.r) {
                kDark += (1 - dist / k.r) * 95;       // very dark center
              } else if (dist < k.r * 2) {
                kDark -= Math.max(0, 1 - (dist - k.r) / k.r) * 18; // light halo
              }
            }
          }

          const gY = y + disp1[ni] + disp2[ni] + disp3[ni] + kDisp;
          const period = 5;
          const t = ((gY % period) + period) % period / period;

          // Earlywood / latewood — moderate contrast
          const late = t > 0.58 ? (t - 0.58) / 0.42 : 0;
          const grain = late * late * 48;
          const boundary = Math.max(0, 1 - Math.min(t, 1 - t) * 9) * 14;

          const fine = (rng() * 14 - 7) | 0;
          const cv = colorN[ni];

          // Warm amber-honey brown
          const dark = grain + boundary + kDark;
          d[ni*4]   = Math.max(5, Math.min(255, (190 + cv * 24 - dark + fine) | 0));
          d[ni*4+1] = Math.max(3, Math.min(255, (145 + cv * 18 - dark * 0.83 + fine) | 0));
          d[ni*4+2] = Math.max(0, Math.min(210, (65  + cv * 9  - dark * 0.52 + fine) | 0));
          d[ni*4+3] = 255;
        }
      }

      ctx.putImageData(img, 0, 0);
      break;
    }
    case "brick": {
      // 4-row tile with per-pixel smooth noise for natural irregularity
      const TW = 120, TH = 44;
      c.width = TW; c.height = TH;

      let prng = 0xD3B07A5F;
      const rng = () => {
        prng ^= prng << 13; prng ^= prng >>> 17; prng ^= prng << 5;
        return (prng >>> 0) / 0x100000000;
      };

      // Pre-generate smooth value noise (bilinear-interpolated random grid)
      const makeNoise = (scale: number, amp: number, ox = 0, oy = 0): Float32Array => {
        const GW = Math.ceil(TW / scale) + 2;
        const GH = Math.ceil(TH / scale) + 2;
        const g = new Float32Array(GW * GH);
        for (let i = 0; i < g.length; i++) g[i] = rng();
        const out = new Float32Array(TW * TH);
        for (let y = 0; y < TH; y++) {
          for (let x = 0; x < TW; x++) {
            const sx = (x + ox) / scale, sy = (y + oy) / scale;
            const gx0 = Math.floor(sx), gy0 = Math.floor(sy);
            const fx = sx - gx0, fy = sy - gy0;
            const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
            out[y * TW + x] = (
              (g[gy0*GW+gx0]*(1-ux) + g[gy0*GW+gx0+1]*ux) * (1-uy) +
              (g[(gy0+1)*GW+gx0]*(1-ux) + g[(gy0+1)*GW+gx0+1]*ux) * uy
            ) * 2 * amp - amp;
          }
        }
        return out;
      };

      // Two octaves of smooth noise for surface variation
      const largeN = makeNoise(14, 38);        // big tonal blobs ±38
      const medN   = makeNoise(5, 20, 47, 31); // medium variation ±20

      // Light cream mortar
      ctx.fillStyle = "#c8b8a8";
      ctx.fillRect(0, 0, TW, TH);

      const img = ctx.getImageData(0, 0, TW, TH);
      const d = img.data;

      // Mortar texture via noise
      const mortarN = makeNoise(4, 10, 90, 60);
      for (let i = 0; i < TW * TH; i++) {
        const n = mortarN[i] | 0;
        d[i*4]   = Math.max(0, Math.min(255, d[i*4]   + n));
        d[i*4+1] = Math.max(0, Math.min(255, d[i*4+1] + n));
        d[i*4+2] = Math.max(0, Math.min(255, d[i*4+2] + ((n * 0.9) | 0)));
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
      const BW = 28, BH = 9;
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
          const bb  = Math.max(70,  Math.min(220, b0 + ((tint * 0.55) | 0)));

          for (let dy = 0; dy < BH; dy++) {
            for (let dx = 0; dx < BW; dx++) {
              const px = ((bx + dx) % TW + TW) % TW;
              const py = by + dy;
              if (py < 0 || py >= TH) continue;

              const ni = py * TW + px;
              // Smooth noise + fine grain
              const smooth = ((largeN[ni] * 0.7 + medN[ni]) ) | 0;
              const fine   = (rng() * 22 - 11) | 0;
              // Horizontal layering (light kiln lines)
              const grain  = (Math.sin(dx * 0.4 + ci * 1.6) * 7) | 0;
              // Soft edge depth
              const ex = Math.min(dx, BW - 1 - dx);
              const ey = Math.min(dy, BH - 1 - dy);
              const edgeDark = Math.min(ex, ey) < 1 ? 22 : Math.min(ex, ey) < 2 ? 8 : 0;
              const bottomDark = dy >= BH - 2 ? (BH - 1 - dy) === 0 ? 22 : 10 : 0;
              const topLight   = dy === 1 ? 10 : 0;

              const delta = smooth + fine + grain + topLight - edgeDark - bottomDark;
              const pi = ni * 4;
              d[pi]   = Math.max(120, Math.min(255, br  + delta));
              d[pi+1] = Math.max(90,  Math.min(250, bg_ + ((delta * 0.75) | 0)));
              d[pi+2] = Math.max(60,  Math.min(230, bb  + ((delta * 0.6)  | 0)));
              d[pi+3] = 255;
            }
          }
        }
      }

      ctx.putImageData(img, 0, 0);
      break;
    }
    case "tile": {
      c.width = 24; c.height = 24;
      ctx.fillStyle = "#8eaec8";
      ctx.fillRect(0, 0, 24, 24);
      const colors = ["#d6eaf8", "#aed6f1", "#e8f4fc", "#c5dff0"];
      [[0,0,0],[1,0,1],[0,1,2],[1,1,3]].forEach(([col, row, ci]) => {
        ctx.fillStyle = colors[ci];
        ctx.fillRect(col * 12 + 1, row * 12 + 1, 10, 10);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillRect(col * 12 + 1, row * 12 + 1, 10, 1);
      });
      break;
    }
    case "concrete": {
      c.width = 20; c.height = 20;
      ctx.fillStyle = "#9e9e9e";
      ctx.fillRect(0, 0, 20, 20);
      const spots = [[2,3,3,"rgba(0,0,0,0.12)"],[7,1,2,"rgba(255,255,255,0.1)"],[12,8,4,"rgba(0,0,0,0.08)"],[4,14,3,"rgba(255,255,255,0.08)"],[16,4,2,"rgba(0,0,0,0.15)"],[1,17,3,"rgba(255,255,255,0.12)"],[10,13,2,"rgba(0,0,0,0.1)"],[17,15,2,"rgba(255,255,255,0.07)"]];
      spots.forEach(([x, y, s, col]) => {
        ctx.fillStyle = col as string;
        ctx.fillRect(x as number, y as number, s as number, s as number);
      });
      break;
    }
    case "alum": {
      c.width = 2; c.height = 40;
      const alumStripes = [
        [0,2,"#c8c8c8"],[2,1,"#e8e8e8"],[3,2,"#b8b8b8"],[5,1,"#f0f0f0"],
        [6,3,"#c0c0c0"],[9,1,"#d8d8d8"],[10,2,"#a8a8a8"],[12,1,"#ececec"],
        [13,3,"#bebebe"],[16,2,"#d0d0d0"],[18,1,"#f4f4f4"],[19,2,"#b0b0b0"],
        [21,1,"#e4e4e4"],[22,3,"#c4c4c4"],[25,2,"#a4a4a4"],[27,1,"#e8e8e8"],
        [28,3,"#bcbcbc"],[31,1,"#f0f0f0"],[32,2,"#c8c8c8"],[34,1,"#d4d4d4"],
        [35,3,"#b4b4b4"],[38,2,"#e0e0e0"],
      ] as [number, number, string][];
      alumStripes.forEach(([y, h, color]) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, y, 2, h);
      });
      break;
    }
    case "iron": {
      c.width = 6; c.height = 6;
      ctx.fillStyle = "#484848";
      ctx.fillRect(0, 0, 6, 6);
      ctx.fillStyle = "#606060"; ctx.fillRect(0, 0, 3, 1);
      ctx.fillStyle = "#303030"; ctx.fillRect(3, 0, 3, 1);
      ctx.fillStyle = "#383838"; ctx.fillRect(0, 2, 2, 2);
      ctx.fillStyle = "#585858"; ctx.fillRect(2, 2, 4, 2);
      ctx.fillStyle = "#505050"; ctx.fillRect(0, 4, 6, 1);
      ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fillRect(0, 0, 1, 6);
      break;
    }
    case "tire": {
      c.width = 16; c.height = 16;
      ctx.fillStyle = "#111111";
      ctx.fillRect(0, 0, 16, 16);
      ctx.strokeStyle = "#2d2d2d"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-2, 10); ctx.lineTo(6, -2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(6, 18); ctx.lineTo(18, 6); ctx.stroke();
      ctx.strokeStyle = "#262626"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-2, 14); ctx.lineTo(2, -2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(14, 18); ctx.lineTo(18, 14); ctx.stroke();
      ctx.strokeStyle = "#383838"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, 16); ctx.lineTo(16, 0); ctx.stroke();
      break;
    }
    default: return null;
  }
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
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - ringW / 2 - 1;
  ctx.lineWidth = ringW;

  // ── Realistic tire: direct ring draw with arc text ──
  if (f.render?.kind === "pattern" && f.render.name === "tire") {
    const ro = size / 2 - 2;
    const ri = ro - ringW + 1;
    const tRi = ri + ringW * 0.44;  // tread inner boundary

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
    [tRi, tRi + (ro - tRi) * 0.34, tRi + (ro - tRi) * 0.67, ro - gw * 0.6].forEach(rad => {
      ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.stroke();
    });

    // Lateral tread cuts (alternating slant)
    const nCuts = Math.round(2 * Math.PI * (tRi + ro) / 2 / (ringW * 0.58));
    ctx.lineWidth = Math.max(0.5, ringW * 0.028);
    for (let i = 0; i < nCuts; i++) {
      const a = (2 * Math.PI * i) / nCuts;
      const sl = ringW * 0.04 * (i % 2 === 0 ? 1 : -1);
      ctx.save();
      ctx.translate(cx, cy); ctx.rotate(a);
      ctx.beginPath();
      ctx.moveTo(tRi, sl); ctx.lineTo(ro, -sl * 0.5);
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

    const brand = "MARU  ICON  ";  // 12 chars × 15° = 180° per rep
    const ca = Math.PI / brand.length;

    for (let rep = 0; rep < 2; rep++) {
      for (let i = 0; i < brand.length; i++) {
        const a = rep * Math.PI + i * ca;
        // Emboss shadow
        ctx.fillStyle = "#0e0e0e";
        ctx.save();
        ctx.translate(cx + 0.5, cy + 0.5); ctx.rotate(a);
        ctx.translate(0, -textR); ctx.fillText(brand[i], 0, 0);
        ctx.restore();
        // Raised face
        ctx.fillStyle = "#484848";
        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(a);
        ctx.translate(0, -textR); ctx.fillText(brand[i], 0, 0);
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
        ctx.translate(cx, cy); ctx.rotate(a);
        ctx.translate(0, -subR); ctx.fillText(sub[i], 0, 0);
        ctx.restore();
      }
    }

    return;
  }

  if (f.render?.kind === "pattern") {
    const tile = createPatternCanvas(f.render.name);
    if (!tile) return;
    const pattern = ctx.createPattern(tile, "repeat");
    if (!pattern) return;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = pattern;
    ctx.stroke();
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
      ctx.arc(cx, cy, r, Math.PI / 2, 3 * Math.PI / 2);
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
  const [category, setCategory] = useState("all");
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
  const filteredFrames = category === "all" ? FRAMES : FRAMES.filter((f) => f.category === category);

  const drawPreview = useCallback(() => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const size = canvas.width;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);

    const f = getFrame(selectedFrameId);
    const cx = size / 2;
    const cy = size / 2;
    const ringW = size * (ringPct / 100);
    const innerR = size / 2 - ringW - 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
    if (photoRef.current) {
      const scale = zoom / 100;
      const imgW = innerR * 2 * scale;
      const imgH = (photoRef.current.naturalHeight / photoRef.current.naturalWidth) * imgW;
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

    if (f.emblem) {
      const er = Math.min(size * 0.1, ringW * 0.44);
      const ey = cy - (size / 2 - ringW * 0.5);
      ctx.beginPath();
      ctx.arc(cx, ey, er, 0, Math.PI * 2);
      ctx.fillStyle = f.emblemBg;
      ctx.fill();
      ctx.font = `bold ${er * 1.1}px sans-serif`;
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(f.emblem, cx, ey);
    }
  }, [selectedFrameId, bgColor, zoom, offsetX, offsetY, customRingColor, customRingColor2, ringPct, filterId]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      const size = canvas.offsetWidth;
      canvas.width = size;
      canvas.height = size;
      drawPreview();
    });
    ro.observe(canvas);
    const size = canvas.offsetWidth || 280;
    canvas.width = size;
    canvas.height = size;
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
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offsetX, oy: offsetY };
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
      if (!oc) { reject(new Error("no canvas")); return; }
      oc.width = SIZE;
      oc.height = SIZE;
      const ctx = oc.getContext("2d");
      if (!ctx) { reject(new Error("no context")); return; }
      const f = getFrame(selectedFrameId);
      const cx = SIZE / 2, cy = SIZE / 2;
      const ringW = SIZE * (ringPct / 100);
      const innerR = SIZE / 2 - ringW - 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, SIZE, SIZE);
      if (photoRef.current) {
        const scale = zoom / 100;
        const ratio = previewRef.current ? previewRef.current.width / SIZE : 1;
        const imgW = innerR * 2 * scale;
        const imgH = (photoRef.current.naturalHeight / photoRef.current.naturalWidth) * imgW;
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

      if (f.emblem) {
        const er = Math.min(SIZE * 0.1, ringW * 0.44);
        const ey = cy - (SIZE / 2 - ringW * 0.5);
        ctx.beginPath();
        ctx.arc(cx, ey, er, 0, Math.PI * 2);
        ctx.fillStyle = f.emblemBg;
        ctx.fill();
        ctx.font = `bold ${er * 1.1}px sans-serif`;
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(f.emblem, cx, ey);
      }

      oc.toBlob((blob) => {
        if (!blob) { reject(new Error("blob failed")); return; }
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
      await navigator.share({ files: [file], title: "まるアイコン" }).catch(() => {});
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
        await navigator.share({
          files: [file],
          title: "まるアイコン",
          text: "プロフィール画像を作ったよ🎉",
          url: "https://maru-icon.com",
        }).catch(() => {});
        return;
      }
    }
    window.open(
      "https://social-plugins.line.me/lineit/share?url=" + encodeURIComponent("https://maru-icon.com"),
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
              <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
              <span className="font-bold text-sm">写真をアップロード</span>
            </div>
            <div className="px-4 pb-4">
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${imageSrc ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-red-400 hover:bg-red-50"}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); }}
                />
                {imageSrc ? (
                  <>
                    <img src={imageSrc} className="w-16 h-16 object-cover rounded-lg mx-auto mb-2" alt="preview" />
                    <p className="text-xs font-bold text-green-600">✓ アップロード完了</p>
                    <p className="text-xs text-gray-400 mt-1">タップして変更</p>
                  </>
                ) : (
                  <>
                    <div className="text-3xl mb-2">🖼️</div>
                    <p className="text-sm font-semibold text-gray-700">写真を選ぶ</p>
                    <p className="text-xs text-gray-400 mt-1">またはドラッグ&ドロップ</p>
                    <p className="text-xs text-gray-400">JPG / PNG / WEBP 対応</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Step2: フレーム */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="flex items-center gap-2 px-4 pt-4 pb-2">
              <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
              <span className="font-bold text-sm">フレームを選ぶ</span>
            </div>
            <div className="px-4 pb-4">
              {/* 現在選択中 */}
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded-xl mb-3">
                <FrameThumb frame={frame} size={36} color1={ringC1} color2={ringC2} />
                <span className="text-sm font-bold flex-1">{frame.name}</span>
              </div>
              {/* カテゴリタブ */}
              <div className="flex gap-1.5 flex-wrap mb-3">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${category === c.id ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
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
                    className={`p-1.5 rounded-xl text-center transition-all border-2 ${f.id === selectedFrameId ? "border-red-500 bg-red-50" : "border-transparent bg-gray-50 hover:border-red-200"}`}
                  >
                    <FrameThumb frame={f} size={40} />
                    <p className="text-[9px] font-semibold text-gray-700 mt-1 leading-tight">{f.name}</p>
                  </button>
                ))}
              </div>

              {/* 太さ */}
              {frame.id !== "none" && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-gray-500">フレームの太さ</p>
                    <span className="text-xs text-gray-400">{Math.round(ringPct)}%</span>
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
                        className={`w-6 h-6 rounded-full border-2 transition-all flex-shrink-0 ${ringC1 === c ? "border-red-500 scale-110" : "border-gray-200"}`}
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
                      <p className="text-xs font-semibold text-gray-500 mt-3 mb-2">カラーB（右 / 下）</p>
                      <div className="flex gap-1.5 flex-wrap items-center">
                        {RING_PRESETS.map((c) => (
                          <button
                            key={c}
                            onClick={() => setCustomRingColor2(c)}
                            className={`w-6 h-6 rounded-full border-2 transition-all flex-shrink-0 ${ringC2 === c ? "border-red-500 scale-110" : "border-gray-200"}`}
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
          <p className="text-center font-bold text-sm py-3 border-b border-gray-100">プレビュー</p>
          <div className="flex justify-center items-center p-6 bg-red-50">
            <div className="relative w-full max-w-[280px] aspect-square">
              {showDragHint && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <span style={{ fontSize: "2.5rem", animation: "hint-drag 1.2s ease-in-out infinite" }}>👆</span>
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
            </div>
            <p className="text-center text-xs text-gray-600">写真をドラッグして位置を調整できます</p>
            <div className="flex justify-center gap-2 mt-3">
              {[["↑", 0, -8], ["←", -8, 0], ["↓", 0, 8], ["→", 8, 0]].map(([label, dx, dy]) => (
                <button
                  key={label as string}
                  onClick={() => { setOffsetX((x) => x + (dx as number)); setOffsetY((y) => y + (dy as number)); }}
                  className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-700 transition-colors"
                >
                  {label as string}
                </button>
              ))}
            </div>
          </div>
          {/* フィルター */}
          <div className="px-5 pb-3 border-t border-gray-100 pt-3">
            <p className="text-xs text-gray-400 mb-2">フィルター</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {FILTERS.map((fi) => (
                <button
                  key={fi.id}
                  onClick={() => setFilterId(fi.id)}
                  className={`flex-shrink-0 text-center transition-opacity ${filterId === fi.id ? "opacity-100" : "opacity-50 hover:opacity-75"}`}
                >
                  <div
                    className={`w-11 h-11 rounded-full border-2 mx-auto mb-1 ${filterId === fi.id ? "border-red-500" : "border-gray-200"}`}
                    style={{
                      background: "linear-gradient(135deg, #f9a8d4, #fbbf24, #34d399, #60a5fa)",
                      filter: fi.css || undefined,
                    }}
                  />
                  <p className="text-[9px] text-gray-600 leading-tight">{fi.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 背景色 */}
          <div className="px-5 pb-5 border-t border-gray-100 pt-3">
            <p className="text-xs text-gray-400 mb-2">背景色</p>
            <div className="flex gap-2 flex-wrap">
              {BG_COLORS.map(({ color, label }) => (
                <button
                  key={color}
                  title={label}
                  onClick={() => setBgColor(color)}
                  className={`w-8 h-8 rounded-full transition-all border-2 ${bgColor === color ? "border-red-500 scale-110" : "border-gray-200"}`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 右カラム */}
        <div className="flex flex-col gap-4">
          {/* Step3 */}
          <div className="bg-white rounded-2xl shadow">
            <div className="flex items-center gap-2 px-4 pt-4 pb-3">
              <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
              <span className="font-bold text-sm">プレビューを確認</span>
            </div>
            <div className="px-4 pb-4 grid grid-cols-2 gap-2">
              <button onClick={() => setZoom((z) => Math.min(200, z + 10))} className="py-2 text-xs font-bold border border-gray-200 rounded-xl hover:border-red-400 transition-colors">🔍 拡大</button>
              <button onClick={() => setZoom((z) => Math.max(50, z - 10))} className="py-2 text-xs font-bold border border-gray-200 rounded-xl hover:border-red-400 transition-colors">🔎 縮小</button>
              <button onClick={() => { setOffsetX(0); setOffsetY(0); setZoom(100); }} className="col-span-2 py-2 text-xs font-bold border border-gray-200 rounded-xl hover:border-red-400 transition-colors">↺ リセット</button>
            </div>
          </div>

          {/* Step4: ダウンロード */}
          <div className="bg-white rounded-2xl shadow">
            <div className="flex items-center gap-2 px-4 pt-4 pb-3">
              <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">4</span>
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
              <button
                onClick={shareToLine}
                disabled={!imageSrc}
                className="w-full py-2.5 text-xs font-bold bg-[#06C755] hover:bg-[#05aa4a] disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.036 2 11.073c0 4.49 3.164 8.244 7.467 9.01.327.064.773.197.886.453.101.233.066.598.032.835l-.144.857c-.044.253-.202 1.01.887.55 1.089-.46 5.878-3.459 8.02-5.922C20.627 15.29 22 13.306 22 11.073 22 6.036 17.523 2 12 2z"/></svg>
                LINE で共有
              </button>
              {resetConfirm ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      photoRef.current = null;
                      setImageSrc(null);
                      setZoom(100); setOffsetX(0); setOffsetY(0);
                      setResetConfirm(false);
                      if (resetConfirmTimer.current) clearTimeout(resetConfirmTimer.current);
                      drawPreview();
                    }}
                    className="flex-1 py-2.5 text-xs font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                  >
                    リセットする
                  </button>
                  <button
                    onClick={() => { setResetConfirm(false); if (resetConfirmTimer.current) clearTimeout(resetConfirmTimer.current); }}
                    className="flex-1 py-2.5 text-xs font-bold border border-gray-200 rounded-xl hover:border-gray-400 text-gray-500 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (!imageSrc) { setZoom(100); setOffsetX(0); setOffsetY(0); return; }
                    setResetConfirm(true);
                    if (resetConfirmTimer.current) clearTimeout(resetConfirmTimer.current);
                    resetConfirmTimer.current = setTimeout(() => setResetConfirm(false), 3000);
                  }}
                  className="w-full py-2.5 text-xs font-bold border border-gray-200 rounded-xl hover:border-gray-400 text-gray-500 transition-colors"
                >
                  ↺ もう一度つくる
                </button>
              )}
              {!imageSrc && (
                <p className="text-center text-xs text-gray-400">写真をアップロードすると保存できます</p>
              )}
            </div>
          </div>

          {/* SNS用途説明 */}
          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-xs font-bold text-gray-600 mb-2">💡 こんな用途に</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>✓ LINE プロフィール画像</li>
              <li>✓ X（Twitter）アイコン</li>
              <li>✓ Instagram プロフィール</li>
              <li>✓ Discord・Slack アバター</li>
              <li>✓ YouTube チャンネルアイコン</li>
            </ul>
            <p className="text-xs text-gray-400 mt-2">512×512px のPNG形式で保存</p>
          </div>
        </div>
      </div>

      <canvas ref={offscreenRef} className="hidden" />

    </div>
  );
}

function FrameThumb({ frame, size, color1, color2 }: {
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
    const cx = size / 2, cy = size / 2, r = size / 2 - 2;
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
        const pattern = ctx.createPattern(tile, "repeat");
        if (pattern) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = pattern;
          ctx.stroke();
        }
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
      frame.render.stops.forEach(([offset, color]) => g.addColorStop(offset, color));
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = g;
      ctx.stroke();
    } else {
      const c1 = color1 ?? frame.ring;
      const c2 = color2 ?? frame.ring2;
      if (c2 && frame.splitDir) {
        if (frame.splitDir === "tb") {
          ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI); ctx.strokeStyle = c1; ctx.stroke();
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI); ctx.strokeStyle = c2; ctx.stroke();
        } else {
          ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI / 2, 3 * Math.PI / 2); ctx.strokeStyle = c1; ctx.stroke();
          ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2); ctx.strokeStyle = c2; ctx.stroke();
        }
      } else {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = c1;
        ctx.stroke();
      }
    }

    if (frame.emblem) {
      ctx.font = `bold ${size * 0.3}px sans-serif`;
      ctx.fillStyle = frame.ring;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(frame.emblem, cx, cy);
    }
  }, [frame, size, color1, color2]);

  return <canvas ref={canvasRef} width={size} height={size} className="rounded-full mx-auto" style={{ width: size, height: size }} />;
}
