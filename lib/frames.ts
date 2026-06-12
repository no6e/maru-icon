export type FrameRender =
  | { kind: "conic"; stops: [number, string][] }
  | { kind: "segments"; colors: string[]; n: number };

export type Frame = {
  id: string;
  name: string;
  category: "all" | "cool" | "simple" | "season" | "cute" | "texture";
  ring: string;
  ring2?: string;
  splitDir?: "tb" | "lr";
  render?: FrameRender;
  emblem: string;
  emblemBg: string;
};

export const FRAMES: Frame[] = [
  // cool
  { id: "hero-red",     name: "レッドヒーロー",   category: "cool",    ring: "#E4000F", emblem: "★", emblemBg: "#E4000F" },
  { id: "hero-green",   name: "グリーンヒーロー", category: "cool",    ring: "#3a8c3f", emblem: "★", emblemBg: "#3a8c3f" },
  { id: "princess",     name: "プリンセス",       category: "cool",    ring: "#f472b6", emblem: "♔", emblemBg: "#e879a0" },
  { id: "forest",       name: "フォレスト",       category: "cool",    ring: "#8B6914", emblem: "🍃", emblemBg: "#8B6914" },
  { id: "raccoon",      name: "たぬき",           category: "cool",    ring: "#5c3d1e", emblem: "🦝", emblemBg: "#5c3d1e" },
  { id: "splash-pur",   name: "スプラッシュ紫",   category: "cool",    ring: "#7c3aed", emblem: "✸", emblemBg: "#7c3aed" },
  { id: "splash-grn",   name: "スプラッシュ緑",   category: "cool",    ring: "#65a30d", emblem: "✸", emblemBg: "#65a30d" },
  { id: "golden-crest", name: "ゴールデン",       category: "cool",    ring: "#1e3a5f", emblem: "✦", emblemBg: "#b45309" },
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
  { id: "rainbow",      name: "レインボー",      category: "cute",    ring: "#f472b6", emblem: "🌈", emblemBg: "#7c3aed" },
  { id: "star",         name: "スター",          category: "cute",    ring: "#fbbf24", emblem: "⭐", emblemBg: "#d97706" },
  { id: "heart",        name: "ハート",          category: "cute",    ring: "#f43f5e", emblem: "♥",  emblemBg: "#e11d48" },
  { id: "crown",        name: "クラウン",        category: "cute",    ring: "#fcd34d", emblem: "♛",  emblemBg: "#b45309" },
  // texture
  {
    id: "tx-wood", name: "木", category: "texture", ring: "#8B4513", emblem: "", emblemBg: "transparent",
    render: { kind: "conic", stops: [[0,"#8B4513"],[0.1,"#A0522D"],[0.2,"#5C2E0A"],[0.35,"#A0522D"],[0.5,"#7B3B10"],[0.65,"#C07040"],[0.8,"#6B3410"],[0.9,"#A0522D"],[1,"#8B4513"]] },
  },
  {
    id: "tx-brick", name: "レンガ", category: "texture", ring: "#B85C38", emblem: "", emblemBg: "transparent",
    render: { kind: "segments", colors: ["#B85C38","#8B3A22","#C4724A","#7A2E18"], n: 16 },
  },
  {
    id: "tx-tile", name: "タイル", category: "texture", ring: "#90caf9", emblem: "", emblemBg: "transparent",
    render: { kind: "segments", colors: ["#e3f2fd","#5b9bd5","#e3f2fd","#2a7abd"], n: 12 },
  },
  {
    id: "tx-concrete", name: "コンクリ", category: "texture", ring: "#9e9e9e", emblem: "", emblemBg: "transparent",
    render: { kind: "conic", stops: [[0,"#9e9e9e"],[0.15,"#bdbdbd"],[0.3,"#7a7a7a"],[0.45,"#adadad"],[0.6,"#888888"],[0.75,"#c0c0c0"],[0.9,"#7e7e7e"],[1,"#9e9e9e"]] },
  },
  {
    id: "tx-alum", name: "アルミ", category: "texture", ring: "#c0c0c0", emblem: "", emblemBg: "transparent",
    render: { kind: "conic", stops: [[0,"#b0b0b0"],[0.15,"#e8e8e8"],[0.3,"#a0a0a0"],[0.45,"#f0f0f0"],[0.6,"#a8a8a8"],[0.75,"#e0e0e0"],[0.9,"#a0a0a0"],[1,"#b0b0b0"]] },
  },
  {
    id: "tx-iron", name: "鉄", category: "texture", ring: "#4a4a4a", emblem: "", emblemBg: "transparent",
    render: { kind: "conic", stops: [[0,"#3a3a3a"],[0.2,"#606060"],[0.4,"#2a2a2a"],[0.6,"#555555"],[0.8,"#303030"],[1,"#3a3a3a"]] },
  },
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
  {
    id: "tx-tire", name: "タイヤ", category: "texture", ring: "#1a1a1a", emblem: "", emblemBg: "transparent",
    render: { kind: "segments", colors: ["#1a1a1a","#3a3a3a","#222222","#444444"], n: 20 },
  },
];

export const CATEGORIES = [
  { id: "all",     label: "すべて" },
  { id: "cool",    label: "クール" },
  { id: "simple",  label: "シンプル" },
  { id: "season",  label: "季節" },
  { id: "cute",    label: "かわいい" },
  { id: "texture", label: "テクスチャ" },
] as const;

export function getFrame(id: string): Frame {
  return FRAMES.find((f) => f.id === id) ?? FRAMES[0];
}
