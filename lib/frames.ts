export type FrameRender =
  | { kind: "conic"; stops: [number, string][] }
  | { kind: "segments"; colors: string[]; n: number }
  | { kind: "pattern"; name: "wood" | "brick" | "tile" | "concrete" | "alum" | "iron" | "tire" };

export type Frame = {
  id: string;
  name: string;
  category: "all" | "simple" | "season" | "cute" | "texture" | "gradient";
  ring: string;
  ring2?: string;
  splitDir?: "tb" | "lr";
  render?: FrameRender;
  emblem: string;
  emblemBg: string;
};

export const FRAMES: Frame[] = [
  // simple
  { id: "none",         name: "なし",            category: "simple",  ring: "",        emblem: "", emblemBg: "transparent" },
  { id: "simple-white", name: "白",              category: "simple",  ring: "#e5e7eb", emblem: "", emblemBg: "transparent" },
  { id: "simple-black", name: "黒",              category: "simple",  ring: "#1a1a1a", emblem: "", emblemBg: "transparent" },
  { id: "simple-gray",  name: "グレー",          category: "simple",  ring: "#9ca3af", emblem: "", emblemBg: "transparent" },
  { id: "simple-pink",  name: "ピンク",          category: "simple",  ring: "#f9a8d4", emblem: "", emblemBg: "transparent" },
  { id: "simple-blue",  name: "ブルー",          category: "simple",  ring: "#60a5fa", emblem: "", emblemBg: "transparent" },
  { id: "simple-mint",  name: "ミント",          category: "simple",  ring: "#34d399", emblem: "", emblemBg: "transparent" },
  { id: "split-lr",     name: "２色（左右）",    category: "simple",  ring: "#E4000F", ring2: "#1a1a1a", splitDir: "lr", emblem: "", emblemBg: "transparent" },
  { id: "split-tb",     name: "２色（上下）",    category: "simple",  ring: "#E4000F", ring2: "#1a1a1a", splitDir: "tb", emblem: "", emblemBg: "transparent" },
  // season
  { id: "spring",       name: "春（桜）",        category: "season",  ring: "#fda4af", emblem: "🌸", emblemBg: "#fda4af" },
  { id: "summer",       name: "夏（海）",        category: "season",  ring: "#38bdf8", emblem: "🌊", emblemBg: "#0369a1" },
  { id: "autumn",       name: "秋（もみじ）",    category: "season",  ring: "#f97316", emblem: "🍂", emblemBg: "#c2410c" },
  { id: "winter",       name: "冬（雪）",        category: "season",  ring: "#bae6fd", emblem: "❄",  emblemBg: "#0284c7" },
  // cute
{ id: "star",         name: "スター",          category: "cute",    ring: "#fbbf24", emblem: "⭐", emblemBg: "#d97706" },
  { id: "heart",        name: "ハート",          category: "cute",    ring: "#f43f5e", emblem: "♥",  emblemBg: "#e11d48" },
  { id: "crown",        name: "クラウン",        category: "cute",    ring: "#fcd34d", emblem: "♛",  emblemBg: "#b45309" },
  // gradient
  {
    id: "gd-sunset", name: "サンセット", category: "gradient", ring: "#ff6b6b", emblem: "", emblemBg: "transparent",
    render: { kind: "conic", stops: [[0,"#ff6b6b"],[0.25,"#ff8e53"],[0.5,"#ff6b9d"],[0.75,"#ff4757"],[1,"#ff6b6b"]] },
  },
  {
    id: "gd-ocean", name: "オーシャン", category: "gradient", ring: "#48cae4", emblem: "", emblemBg: "transparent",
    render: { kind: "conic", stops: [[0,"#667eea"],[0.33,"#48cae4"],[0.66,"#0096c7"],[1,"#667eea"]] },
  },
  {
    id: "gd-aurora", name: "オーロラ", category: "gradient", ring: "#43b89c", emblem: "", emblemBg: "transparent",
    render: { kind: "conic", stops: [[0,"#43b89c"],[0.2,"#67e8a9"],[0.4,"#38bdf8"],[0.6,"#818cf8"],[0.8,"#a78bfa"],[1,"#43b89c"]] },
  },
  {
    id: "gd-neon", name: "ネオン", category: "gradient", ring: "#ff0080", emblem: "", emblemBg: "transparent",
    render: { kind: "conic", stops: [[0,"#ff0080"],[0.25,"#ff8c00"],[0.5,"#00ff80"],[0.75,"#0080ff"],[1,"#ff0080"]] },
  },
  {
    id: "gd-gold", name: "ゴールド", category: "gradient", ring: "#f7c948", emblem: "", emblemBg: "transparent",
    render: { kind: "conic", stops: [[0,"#f7c948"],[0.2,"#c9970f"],[0.4,"#ffd970"],[0.6,"#e8b820"],[0.8,"#f0c030"],[1,"#f7c948"]] },
  },
  {
    id: "gd-cherry", name: "チェリー", category: "gradient", ring: "#ff6fa8", emblem: "", emblemBg: "transparent",
    render: { kind: "conic", stops: [[0,"#ff6fa8"],[0.3,"#ffadd2"],[0.6,"#ff4081"],[0.9,"#ff8fb1"],[1,"#ff6fa8"]] },
  },
  {
    id: "gd-midnight", name: "ミッドナイト", category: "gradient", ring: "#1a1a4e", emblem: "", emblemBg: "transparent",
    render: { kind: "conic", stops: [[0,"#1a1a4e"],[0.25,"#4a1a8e"],[0.5,"#1a3a7e"],[0.75,"#6d28d9"],[1,"#1a1a4e"]] },
  },
  {
    id: "gd-lavender", name: "ラベンダー", category: "gradient", ring: "#c084fc", emblem: "", emblemBg: "transparent",
    render: { kind: "conic", stops: [[0,"#c084fc"],[0.33,"#f0abfc"],[0.66,"#818cf8"],[1,"#c084fc"]] },
  },
  // texture
  { id: "tx-wood",     name: "木",       category: "texture", ring: "#8B4513", emblem: "",   emblemBg: "transparent", render: { kind: "pattern", name: "wood" } },
  { id: "tx-brick",    name: "レンガ",   category: "texture", ring: "#B85C38", emblem: "",   emblemBg: "transparent", render: { kind: "pattern", name: "brick" } },
  { id: "tx-tile",     name: "タイル",   category: "texture", ring: "#90caf9", emblem: "",   emblemBg: "transparent", render: { kind: "pattern", name: "tile" } },
  { id: "tx-concrete", name: "コンクリ", category: "texture", ring: "#9e9e9e", emblem: "",   emblemBg: "transparent", render: { kind: "pattern", name: "concrete" } },
  { id: "tx-alum",     name: "アルミ",   category: "texture", ring: "#c0c0c0", emblem: "",   emblemBg: "transparent", render: { kind: "pattern", name: "alum" } },
  { id: "tx-iron",     name: "鉄",       category: "texture", ring: "#4a4a4a", emblem: "",   emblemBg: "transparent", render: { kind: "pattern", name: "iron" } },
  {
    id: "tx-crystal", name: "クリスタル", category: "texture", ring: "#a8d8ff", emblem: "", emblemBg: "transparent",
    render: { kind: "conic", stops: [[0,"#ff88aa"],[0.14,"#ffbb55"],[0.28,"#aaff88"],[0.42,"#55aaff"],[0.57,"#aa88ff"],[0.71,"#ff55cc"],[0.85,"#ff8844"],[1,"#ff88aa"]] },
  },
  {
    id: "tx-stars", name: "星", category: "texture", ring: "#ffd700", emblem: "⭐", emblemBg: "#b8860b",
    render: { kind: "segments", colors: ["#ffd700","#ffa500","#ffe44d","#e8960a"], n: 8 },
  },
  {
    id: "tx-vine", name: "ツタ", category: "texture", ring: "#2d6a27", emblem: "🌿", emblemBg: "#1a4a18",
    render: { kind: "segments", colors: ["#2d6a27","#1a4a18","#3d8a37","#234d1e"], n: 12 },
  },
  { id: "tx-tire", name: "タイヤ", category: "texture", ring: "#1a1a1a", emblem: "", emblemBg: "transparent", render: { kind: "pattern", name: "tire" } },
];

export const CATEGORIES = [
  { id: "all",     label: "すべて" },
  { id: "simple",  label: "シンプル" },
  { id: "season",  label: "季節" },
  { id: "cute",    label: "かわいい" },
  { id: "gradient", label: "グラデ" },
  { id: "texture",  label: "テクスチャ" },
] as const;

export function getFrame(id: string): Frame {
  return FRAMES.find((f) => f.id === id) ?? FRAMES[0];
}
