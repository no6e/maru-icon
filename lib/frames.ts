export type FrameRender =
  | { kind: "conic"; stops: [number, string][] }
  | { kind: "segments"; colors: string[]; n: number }
  | { kind: "pattern"; name: "wood" | "brick" | "tile" | "concrete" | "alum" | "iron" | "tire" | "glitter-pink" | "glitter-gold" | "glitter-silver" | "glitter-holo" | "soccer-ball" | "baseball-ball" | "basketball-ball" | "tennis-ball" | "swim-goggles" };

export type Frame = {
  id: string;
  name: string;
  category: "all" | "simple" | "season" | "cute" | "texture" | "gradient" | "pokemon" | "country" | "sports";
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
  // pastel
  { id: "pastel-sky",   name: "パステルブルー",  category: "simple",  ring: "#bfdbfe", emblem: "", emblemBg: "transparent" },
  { id: "pastel-lav",   name: "ラベンダー",      category: "simple",  ring: "#ddd6fe", emblem: "", emblemBg: "transparent" },
  { id: "pastel-lemon", name: "レモン",          category: "simple",  ring: "#fef08a", emblem: "", emblemBg: "transparent" },
  { id: "pastel-blush", name: "ブラッシュ",      category: "simple",  ring: "#fbcfe8", emblem: "", emblemBg: "transparent" },
  { id: "pastel-mint",  name: "パステルミント",  category: "simple",  ring: "#bbf7d0", emblem: "", emblemBg: "transparent" },
  { id: "pastel-peach", name: "ピーチ",          category: "simple",  ring: "#fed7aa", emblem: "", emblemBg: "transparent" },
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
  { id: "tx-wood",     name: "木",         category: "texture", ring: "#8B4513", emblem: "",   emblemBg: "transparent", render: { kind: "pattern", name: "wood" } },
  { id: "tx-brick",    name: "レンガ",     category: "texture", ring: "#B85C38", emblem: "",   emblemBg: "transparent", render: { kind: "pattern", name: "brick" } },
  { id: "tx-tile",     name: "タイル",     category: "texture", ring: "#90caf9", emblem: "",   emblemBg: "transparent", render: { kind: "pattern", name: "tile" } },
  { id: "tx-concrete", name: "コンクリ",   category: "texture", ring: "#9e9e9e", emblem: "",   emblemBg: "transparent", render: { kind: "pattern", name: "concrete" } },
  { id: "tx-alum",     name: "アルミ",     category: "texture", ring: "#c0c0c0", emblem: "",   emblemBg: "transparent", render: { kind: "pattern", name: "alum" } },
  { id: "tx-iron",     name: "鉄",         category: "texture", ring: "#4a4a4a", emblem: "",   emblemBg: "transparent", render: { kind: "pattern", name: "iron" } },
  {
    id: "tx-crystal", name: "レインボー", category: "texture", ring: "#a8d8ff", emblem: "", emblemBg: "transparent",
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
  { id: "tx-tire",   name: "タイヤ",       category: "texture", ring: "#1a1a1a", emblem: "", emblemBg: "transparent", render: { kind: "pattern", name: "tire" } },
  // vehicle (cute に統合)
  { id: "vh-car",   name: "車",     category: "cute", ring: "#E4000F", emblem: "🚗", emblemBg: "#B00000" },
  { id: "vh-train", name: "電車",   category: "cute", ring: "#1a5fa8", emblem: "🚆", emblemBg: "#0d3d7a" },
  { id: "vh-plane", name: "飛行機", category: "cute", ring: "#87ceeb", emblem: "✈",  emblemBg: "#4a90d9" },
  { id: "vh-bike",  name: "バイク", category: "cute", ring: "#2a2a2a", emblem: "🏍", emblemBg: "#1a1a1a" },
  { id: "vh-ship",  name: "船",     category: "cute", ring: "#1a3a6e", emblem: "🚢", emblemBg: "#0d2550" },
  { id: "vh-bus",   name: "バス",   category: "cute", ring: "#f5a623", emblem: "🚌", emblemBg: "#c07800" },
  // pokemon
  { id: "pk-normal",   name: "ノーマル",   category: "pokemon", ring: "#A8A878", emblem: "",   emblemBg: "#A8A878" },
  { id: "pk-fire",     name: "ほのお",     category: "pokemon", ring: "#F08030", emblem: "🔥", emblemBg: "#C85020" },
  { id: "pk-water",    name: "みず",       category: "pokemon", ring: "#6890F0", emblem: "💧", emblemBg: "#4060C0" },
  { id: "pk-grass",    name: "くさ",       category: "pokemon", ring: "#78C850", emblem: "🌿", emblemBg: "#4A8A20" },
  { id: "pk-electric", name: "でんき",     category: "pokemon", ring: "#F8D030", emblem: "⚡", emblemBg: "#C8A808" },
  { id: "pk-ice",      name: "こおり",     category: "pokemon", ring: "#98D8D8", emblem: "❄",  emblemBg: "#60A8A8" },
  { id: "pk-fighting", name: "かくとう",   category: "pokemon", ring: "#C03028", emblem: "👊", emblemBg: "#A01018" },
  { id: "pk-poison",   name: "どく",       category: "pokemon", ring: "#A040A0", emblem: "☠",  emblemBg: "#802080" },
  { id: "pk-ground",   name: "じめん",     category: "pokemon", ring: "#E0C068", emblem: "⛰",  emblemBg: "#B89038" },
  { id: "pk-flying",   name: "ひこう",     category: "pokemon", ring: "#A890F0", emblem: "🕊",  emblemBg: "#7860C0" },
  { id: "pk-psychic",  name: "エスパー",   category: "pokemon", ring: "#F85888", emblem: "🔮", emblemBg: "#C82858" },
  { id: "pk-bug",      name: "むし",       category: "pokemon", ring: "#A8B820", emblem: "🐛", emblemBg: "#788808" },
  { id: "pk-rock",     name: "いわ",       category: "pokemon", ring: "#B8A038", emblem: "🪨", emblemBg: "#887018" },
  { id: "pk-ghost",    name: "ゴースト",   category: "pokemon", ring: "#705898", emblem: "👻", emblemBg: "#504878" },
  { id: "pk-dragon",   name: "ドラゴン",   category: "pokemon", ring: "#7038F8", emblem: "🐉", emblemBg: "#5028C8" },
  { id: "pk-dark",     name: "あく",       category: "pokemon", ring: "#705848", emblem: "🌙", emblemBg: "#504030" },
  { id: "pk-steel",    name: "はがね",     category: "pokemon", ring: "#B8B8D0", emblem: "⚙",  emblemBg: "#888898" },
  { id: "pk-fairy",    name: "フェアリー", category: "pokemon", ring: "#EE99AC", emblem: "✨", emblemBg: "#BE6980" },
  // country
  { id: "ct-japan",  name: "日本",         category: "country", ring: "#BC002D", emblem: "🇯🇵", emblemBg: "#BC002D" },
  { id: "ct-usa",    name: "アメリカ",     category: "country", ring: "#3C3B6E", emblem: "🇺🇸", emblemBg: "#3C3B6E",
    render: { kind: "segments", colors: ["#3C3B6E","#B22234","#FFFFFF"], n: 6 } },
  { id: "ct-korea",  name: "韓国",         category: "country", ring: "#CD2E3A", emblem: "🇰🇷", emblemBg: "#CD2E3A",
    render: { kind: "conic", stops: [[0,"#CD2E3A"],[0.5,"#003478"],[1,"#CD2E3A"]] } },
  { id: "ct-china",  name: "中国",         category: "country", ring: "#DE2910", emblem: "🇨🇳", emblemBg: "#DE2910" },
  { id: "ct-france", name: "フランス",     category: "country", ring: "#0055A4", emblem: "🇫🇷", emblemBg: "#0055A4",
    render: { kind: "segments", colors: ["#0055A4","#FFFFFF","#EF4135"], n: 3 } },
  { id: "ct-italy",  name: "イタリア",     category: "country", ring: "#009246", emblem: "🇮🇹", emblemBg: "#009246",
    render: { kind: "segments", colors: ["#009246","#FFFFFF","#CE2B37"], n: 3 } },
  { id: "ct-germany",name: "ドイツ",       category: "country", ring: "#000000", emblem: "🇩🇪", emblemBg: "#222222",
    render: { kind: "segments", colors: ["#000000","#DD0000","#FFCE00"], n: 3 } },
  { id: "ct-brazil", name: "ブラジル",     category: "country", ring: "#009C3B", emblem: "🇧🇷", emblemBg: "#007A2F",
    render: { kind: "conic", stops: [[0,"#009C3B"],[0.25,"#FEDD00"],[0.5,"#009C3B"],[0.75,"#FEDD00"],[1,"#009C3B"]] } },
  { id: "ct-uk",     name: "イギリス",     category: "country", ring: "#012169", emblem: "🇬🇧", emblemBg: "#012169",
    render: { kind: "conic", stops: [[0,"#012169"],[0.2,"#C8102E"],[0.4,"#FFFFFF"],[0.6,"#C8102E"],[0.8,"#012169"],[1,"#012169"]] } },
  { id: "ct-spain",  name: "スペイン",     category: "country", ring: "#AA151B", emblem: "🇪🇸", emblemBg: "#AA151B",
    render: { kind: "segments", colors: ["#AA151B","#F1BF00","#AA151B"], n: 3 } },
  { id: "ct-aus",    name: "オーストラリア", category: "country", ring: "#003087", emblem: "🇦🇺", emblemBg: "#003087",
    render: { kind: "conic", stops: [[0,"#003087"],[0.33,"#CF142B"],[0.5,"#FFFFFF"],[0.66,"#003087"],[1,"#003087"]] } },
  // sports
  { id: "sp-soccer",     name: "サッカー", category: "sports", ring: "#2d7a2d", emblem: "", emblemBg: "transparent", render: { kind: "pattern", name: "soccer-ball" } },
  { id: "sp-baseball",   name: "野球",     category: "sports", ring: "#C8A87A", emblem: "", emblemBg: "transparent", render: { kind: "pattern", name: "baseball-ball" } },
  { id: "sp-basketball", name: "バスケ",   category: "sports", ring: "#C0703C", emblem: "", emblemBg: "transparent", render: { kind: "pattern", name: "basketball-ball" } },
  { id: "sp-tennis",     name: "テニス",   category: "sports", ring: "#D7E84A", emblem: "", emblemBg: "transparent", render: { kind: "pattern", name: "tennis-ball" } },
  { id: "sp-swimming",   name: "水泳",     category: "sports", ring: "#0077BE", emblem: "", emblemBg: "transparent", render: { kind: "pattern", name: "swim-goggles" } },
  { id: "sp-athletics",  name: "陸上",     category: "sports", ring: "#D05A10", emblem: "🏃", emblemBg: "#A03A00" },
  { id: "sp-volleyball", name: "バレー",   category: "sports", ring: "#1560BD", emblem: "🏐", emblemBg: "#0A3A8A" },
  { id: "sp-golf",       name: "ゴルフ",   category: "sports", ring: "#4A8C2A", emblem: "⛳", emblemBg: "#2A6A0A" },
  // glitter (texture に統合)
  { id: "gt-pink",   name: "ラメピンク",     category: "texture", ring: "#FF69B4", emblem: "", emblemBg: "transparent", render: { kind: "pattern", name: "glitter-pink" } },
  { id: "gt-gold",   name: "ラメゴールド",   category: "texture", ring: "#FFD700", emblem: "", emblemBg: "transparent", render: { kind: "pattern", name: "glitter-gold" } },
  { id: "gt-silver", name: "ラメシルバー",   category: "texture", ring: "#C0C0C0", emblem: "", emblemBg: "transparent", render: { kind: "pattern", name: "glitter-silver" } },
  { id: "gt-holo",   name: "ホログラム",     category: "texture", ring: "#aa88ff", emblem: "", emblemBg: "transparent", render: { kind: "pattern", name: "glitter-holo" } },
];

export const CATEGORIES = [
  { id: "all",      label: "すべて" },
  { id: "simple",   label: "シンプル" },
  { id: "gradient", label: "グラデ" },
  { id: "season",   label: "季節" },
  { id: "cute",     label: "かわいい" },
  { id: "texture",  label: "テクスチャ" },
  { id: "pokemon",  label: "属性" },
  { id: "country",  label: "国" },
  { id: "sports",   label: "スポーツ" },
] as const;

export function getFrame(id: string): Frame {
  return FRAMES.find((f) => f.id === id) ?? FRAMES[0];
}
