import type { Metadata } from "next";
import Link from "next/link";
import { FRAMES, CATEGORIES } from "@/lib/frames";

export const metadata: Metadata = {
  title: "アイコンフレーム一覧【無料】SNSプロフィール画像をデコ | まるアイコン",
  description: "SNSアイコン用フレーム一覧。ゲームキャラ・シンプル・季節・かわいい系など20種類以上。プロフィール画像に無料でフレームを付けて作成できます。",
  alternates: { canonical: "https://maru-icon.com/frame/" },
};

export default function FramePage() {
  return (
    <article className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-400 mb-4">
        <Link href="/">まるアイコン</Link> &gt; フレーム一覧
      </nav>

      <h1 className="text-2xl font-black text-gray-900 mb-2">
        アイコンフレーム一覧【無料】
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        SNSのプロフィール画像に使えるフレームを{FRAMES.length}種類以上収録。すべて無料でご利用いただけます。
      </p>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-bold text-red-700 mb-1">🎨 全フレームを無料で使える</p>
        <p className="text-xs text-red-600">まるアイコンで写真をアップロードしてフレームを選ぶだけ。</p>
        <Link href="/" className="inline-block mt-2 bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
          フレームを選んでアイコンを作る →
        </Link>
      </div>

      {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
        const frames = FRAMES.filter((f) => f.category === cat.id);
        return (
          <section key={cat.id} className="mb-8">
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-5 bg-red-500 rounded-full inline-block" />
              {cat.label}フレーム
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {frames.map((f) => (
                <Link
                  key={f.id}
                  href="/"
                  className="bg-white rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-red-200"
                >
                  <div
                    className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold"
                    style={{
                      border: `6px solid ${f.ring}`,
                      color: f.ring,
                    }}
                  >
                    {f.emblem || "○"}
                  </div>
                  <p className="text-xs font-bold text-gray-800">{f.name}</p>
                  <p className="text-xs text-red-500 mt-1">無料で使う →</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <div className="bg-gray-50 rounded-2xl p-5 mt-4">
        <h2 className="font-bold text-sm mb-2">フレームの使い方</h2>
        <p className="text-xs text-gray-600 leading-relaxed">
          まるアイコンで写真をアップロード後、カテゴリから好きなフレームを選ぶだけです。
          シンプルな白・黒フレームはLINEやX（Twitter）のプロフィール画像に、
          ゲームキャラフレームはゲーマーのDiscordアバターにおすすめです。
        </p>
      </div>
    </article>
  );
}
