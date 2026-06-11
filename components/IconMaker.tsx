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

export default function IconMaker() {
  const [selectedFrameId, setSelectedFrameId] = useState("mario-red");
  const [category, setCategory] = useState("all");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [zoom, setZoom] = useState(100);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const previewRef = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const frame = getFrame(selectedFrameId);
  const filteredFrames = category === "all" ? FRAMES : FRAMES.filter((f) => f.category === category);

  // Canvas描画
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
    const ringW = size * 0.085;
    const innerR = size / 2 - ringW - 2;

    // 背景 + クリップ
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
      ctx.drawImage(
        photoRef.current,
        cx - imgW / 2 + offsetX,
        cy - imgH / 2 + offsetY,
        imgW,
        imgH
      );
    }
    ctx.restore();

    // リング
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2 - ringW / 2 - 1, 0, Math.PI * 2);
    ctx.strokeStyle = f.ring;
    ctx.lineWidth = ringW;
    ctx.stroke();

    // エンブレム
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
  }, [selectedFrameId, bgColor, zoom, offsetX, offsetY]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // キャンバスサイズ
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

  // ファイル読み込み
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
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // ドラッグ
  const onPointerDown = (e: React.PointerEvent) => {
    if (!imageSrc) return;
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

  // ダウンロード
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
    const ringW = SIZE * 0.085;
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
      ctx.drawImage(
        photoRef.current,
        cx - imgW / 2 + offsetX / ratio,
        cy - imgH / 2 + offsetY / ratio,
        imgW,
        imgH
      );
    }
    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, SIZE / 2 - ringW / 2 - 1, 0, Math.PI * 2);
    ctx.strokeStyle = f.ring;
    ctx.lineWidth = ringW;
    ctx.stroke();

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

    const a = document.createElement("a");
    a.download = "maru-icon.png";
    a.href = oc.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-3 py-4 md:py-8">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_280px] gap-4">

        {/* 左カラム */}
        <div className="flex flex-col gap-4">

          {/* Step1: アップロード */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
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
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 pt-4 pb-2">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
              <span className="font-bold text-sm">フレームを選ぶ</span>
            </div>
            <div className="px-4 pb-4">
              {/* 現在選択中 */}
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl mb-3">
                <FrameThumb frame={frame} size={36} />
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
              <div className="grid grid-cols-3 gap-2">
                {filteredFrames.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFrameId(f.id)}
                    className={`p-2 rounded-xl text-center transition-all border-2 ${f.id === selectedFrameId ? "border-red-500 bg-red-50" : "border-transparent bg-gray-50 hover:border-red-200"}`}
                  >
                    <FrameThumb frame={f} size={48} />
                    <p className="text-[10px] font-semibold text-gray-700 mt-1 leading-tight">{f.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 中央: プレビュー */}
        <div className="bg-white rounded-2xl shadow-sm">
          <p className="text-center font-bold text-sm py-3 border-b border-gray-100">プレビュー</p>
          <div className="flex justify-center items-center p-6 bg-gray-50">
            <div className="relative w-full max-w-[280px] aspect-square">
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
            <p className="text-center text-xs text-gray-400">写真をドラッグして位置を調整できます</p>
            {/* 移動ボタン */}
            <div className="flex justify-center gap-2 mt-3">
              {[["↑", 0, -8], ["←", -8, 0], ["↓", 0, 8], ["→", 8, 0]].map(([label, dx, dy]) => (
                <button
                  key={label as string}
                  onClick={() => { setOffsetX((x) => x + (dx as number)); setOffsetY((y) => y + (dy as number)); }}
                  className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold transition-colors"
                >
                  {label as string}
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
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 px-4 pt-4 pb-3">
              <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
              <span className="font-bold text-sm">プレビューを確認</span>
            </div>
            <div className="px-4 pb-4 grid grid-cols-2 gap-2">
              <button onClick={() => setZoom((z) => Math.min(200, z + 10))} className="py-2 text-xs font-bold border border-gray-200 rounded-xl hover:border-red-400 transition-colors">🔍 拡大</button>
              <button onClick={() => setZoom((z) => Math.max(50, z - 10))} className="py-2 text-xs font-bold border border-gray-200 rounded-xl hover:border-red-400 transition-colors">🔎 縮小</button>
              <button onClick={() => { setOffsetX(0); setOffsetY(0); setZoom(100); }} className="col-span-2 py-2 text-xs font-bold border border-gray-200 rounded-xl hover:border-red-400 transition-colors">↺ リセット</button>
            </div>
          </div>

          {/* Step4: ダウンロード */}
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 px-4 pt-4 pb-3">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">4</span>
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
                onClick={() => { setImageSrc(null); photoRef.current = null; setZoom(100); setOffsetX(0); setOffsetY(0); }}
                className="w-full py-2.5 text-xs font-bold border border-gray-200 rounded-xl hover:border-gray-400 text-gray-500 transition-colors"
              >
                ↺ もう一度つくる
              </button>
              {!imageSrc && (
                <p className="text-center text-xs text-gray-400">写真をアップロードすると保存できます</p>
              )}
            </div>
          </div>

          {/* SNS用途説明 */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
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

// フレームサムネイルコンポーネント
function FrameThumb({ frame, size }: { frame: Frame; size: number }) {
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
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = frame.ring;
    ctx.lineWidth = size * 0.15;
    ctx.stroke();
    if (frame.emblem) {
      ctx.font = `bold ${size * 0.3}px sans-serif`;
      ctx.fillStyle = frame.ring;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(frame.emblem, cx, cy);
    }
  }, [frame, size]);

  return <canvas ref={canvasRef} width={size} height={size} className="rounded-full mx-auto" style={{ width: size, height: size }} />;
}
