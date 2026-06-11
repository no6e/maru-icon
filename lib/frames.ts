export type Frame = {
  id: string;
  name: string;
  category: "all" | "cool" | "simple" | "season" | "cute";
  ring: string;
  emblem: string;
  emblemBg: string;
};

export const FRAMES: Frame[] = [
  // cool（ゲーム・ポップ系イメージのオリジナルフレーム）
  { id: "hero-red",     name: "レッドヒーロー",      category: "cool",   ring: "#E4000F", emblem: "★", emblemBg: "#E4000F" },
  { id: "hero-green",   name: "グリーンヒーロー",    category: "cool",   ring: "#3a8c3f", emblem: "★", emblemBg: "#3a8c3f" },
  { id: "princess",     name: "プリンセス",          category: "cool",   ring: "#f472b6", emblem: "♔", emblemBg: "#e879a0" },
  { id: "forest",       name: "フォレスト",          category: "cool",   ring: "#8B6914", emblem: "🍃", emblemBg: "#8B6914" },
  { id: "raccoon",      name: "たぬき",              category: "cool",   ring: "#5c3d1e", emblem: "🦝", emblemBg: "#5c3d1e" },
  { id: "splash-pur",   name: "スプラッシュ（紫）",  category: "cool",   ring: "#7c3aed", emblem: "✸", emblemBg: "#7c3aed" },
  { id: "splash-grn",   name: "スプラッシュ（緑）",  category: "cool",   ring: "#65a30d", emblem: "✸", emblemBg: "#65a30d" },
  { id: "golden-crest", name: "ゴールデンクレスト",  category: "cool",   ring: "#1e3a5f", emblem: "✦", emblemBg: "#b45309" },
  // simple
  { id: "simple-white", name: "シンプル（白）",      category: "simple", ring: "#e5e7eb", emblem: "",  emblemBg: "transparent" },
  { id: "simple-black", name: "シンプル（黒）",      category: "simple", ring: "#1a1a1a", emblem: "",  emblemBg: "transparent" },
  { id: "simple-gray",  name: "シンプル（グレー）",  category: "simple", ring: "#9ca3af", emblem: "",  emblemBg: "transparent" },
  { id: "simple-pink",  name: "シンプル（ピンク）",  category: "simple", ring: "#f9a8d4", emblem: "",  emblemBg: "transparent" },
  { id: "simple-blue",  name: "シンプル（ブルー）",  category: "simple", ring: "#60a5fa", emblem: "",  emblemBg: "transparent" },
  { id: "simple-mint",  name: "シンプル（ミント）",  category: "simple", ring: "#34d399", emblem: "",  emblemBg: "transparent" },
  // season
  { id: "spring",       name: "春（桜）",            category: "season", ring: "#fda4af", emblem: "🌸", emblemBg: "#fda4af" },
  { id: "summer",       name: "夏（海）",            category: "season", ring: "#38bdf8", emblem: "🌊", emblemBg: "#0369a1" },
  { id: "autumn",       name: "秋（もみじ）",        category: "season", ring: "#f97316", emblem: "🍂", emblemBg: "#c2410c" },
  { id: "winter",       name: "冬（雪）",            category: "season", ring: "#bae6fd", emblem: "❄", emblemBg: "#0284c7" },
  // cute
  { id: "rainbow",      name: "レインボー",          category: "cute",   ring: "#f472b6", emblem: "🌈", emblemBg: "#7c3aed" },
  { id: "star",         name: "スター",              category: "cute",   ring: "#fbbf24", emblem: "⭐", emblemBg: "#d97706" },
  { id: "heart",        name: "ハート",              category: "cute",   ring: "#f43f5e", emblem: "♥", emblemBg: "#e11d48" },
  { id: "crown",        name: "クラウン",            category: "cute",   ring: "#fcd34d", emblem: "♛", emblemBg: "#b45309" },
];

export const CATEGORIES = [
  { id: "all",    label: "すべて" },
  { id: "cool",   label: "クール" },
  { id: "simple", label: "シンプル" },
  { id: "season", label: "季節" },
  { id: "cute",   label: "かわいい" },
] as const;

export function getFrame(id: string): Frame {
  return FRAMES.find((f) => f.id === id) ?? FRAMES[0];
}
