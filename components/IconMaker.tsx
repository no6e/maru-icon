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
      const er = size * 0.1;
      const ey = cy - (size / 2 - ringW * 0.45);
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

  const download = () => {
    const SIZE = 512;
    const oc = offscreenRef.current;
    if (!oc) return;
    oc.width = SIZE;
    oc.height = SIZE;
    const ctx = oc.getContext("2d");
    if (!ctx) return;
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
      const er = SIZE * 0.1;
      const ey = cy - (SIZE / 2 - ringW * 0.45);
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

    oc.toBlob(async (blob) => {
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
    }, "image/png");
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

    if (frame.render?.kind === "segments") {
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
