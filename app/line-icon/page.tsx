import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LINEアイコンの作り方【無料】丸く切り抜いてフレーム付きで作成 | まるアイコン",
  description: "LINEのプロフィール画像（アイコン）を無料で作る方法を解説。写真を丸く切り抜いてフレームでデコるだけ。登録不要・スマホ対応。推奨サイズ・設定方法も紹介。",
  alternates: { canonical: "https://maru-icon.com/line-icon/" },
};

export default function LineIconPage() {
  return (
    <article className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-400 mb-4">
        <Link href="/">まるアイコン</Link> &gt; LINEアイコンの作り方
      </nav>

      <h1 className="text-2xl font-black text-gray-900 mb-2">
        LINEアイコンの作り方【無料】<br />
        丸く切り抜いてフレーム付きで作成
      </h1>
      <p className="text-xs text-gray-400 mb-6">更新日: 2025年1月</p>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-bold text-red-700 mb-1">📱 まるアイコンで無料作成</p>
        <p className="text-xs text-red-600">写真をアップロードするだけでLINEアイコンが完成。登録不要・完全無料。</p>
        <Link href="/" className="inline-block mt-2 bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
          アイコンを作る →
        </Link>
      </div>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">LINEのプロフィール画像の推奨サイズ</h2>
          <p className="text-sm leading-relaxed">LINEのプロフィール画像は<strong>640×640px</strong>の正方形が推奨サイズです。アプリ上での表示は丸くトリミングされるため、顔や被写体を中央に配置した画像を用意しましょう。</p>
          <div className="bg-gray-50 rounded-xl p-4 text-sm mt-3">
            <ul className="space-y-1.5 text-gray-600">
              <li>📐 推奨サイズ: 640×640px（正方形）</li>
              <li>📁 対応形式: JPG・PNG</li>
              <li>📦 ファイルサイズ: 3MB以下</li>
              <li>🔵 表示形状: 円形（自動でトリミング）</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">まるアイコンを使ったLINEアイコンの作り方</h2>
          <ol className="space-y-4">
            {[
              { step: "1", title: "写真をアップロード", desc: "「まるアイコン」を開き、「写真を選ぶ」をタップして使いたい写真を選びます。スマホのカメラロールから直接選択できます。" },
              { step: "2", title: "フレームを選ぶ", desc: "シンプルな白・黒フレームや、ゲームキャラ・季節フレームなど20種類以上から選択。フレームなしの場合は「シンプル（白）」を選びましょう。" },
              { step: "3", title: "位置・ズームを調整", desc: "写真をドラッグして顔の位置を調整し、スライダーでズームを調整します。プレビューを見ながらリアルタイムで確認できます。" },
              { step: "4", title: "画像を保存", desc: "「画像を保存する」ボタンをタップすると、512×512pxのPNGが端末に保存されます。LINEのアイコンとして最適なサイズです。" },
            ].map(({ step, title, desc }) => (
              <li key={step} className="flex gap-3">
                <span className="w-7 h-7 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{step}</span>
                <div>
                  <p className="font-bold text-sm">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">LINEプロフィール画像の設定方法</h2>
          <ol className="text-sm space-y-1.5 text-gray-600">
            <li>1. LINEアプリを開き、画面下の「ホーム」をタップ</li>
            <li>2. 画面上部のプロフィールアイコンをタップ</li>
            <li>3. 「プロフィール画像」をタップ</li>
            <li>4. 「写真を選択」→ 保存した画像を選ぶ</li>
            <li>5. トリミングして「完了」をタップ</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">よくある質問</h2>
          <div className="space-y-3">
            {[
              { q: "スマホから使えますか？", a: "はい。iPhone・Androidどちらでも、ブラウザから無料で使えます。アプリのインストール不要です。" },
              { q: "画像データはサーバーに保存されますか？", a: "いいえ。すべての処理はブラウザ内で完結します。写真がサーバーにアップロードされることはありません。" },
              { q: "商用利用できますか？", a: "個人利用は完全無料です。作成したアイコンはSNSのプロフィール画像などに自由にお使いいただけます。" },
            ].map(({ q, a }) => (
              <div key={q} className="bg-gray-50 rounded-xl p-3">
                <p className="text-sm font-bold text-gray-800">Q: {q}</p>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">A: {a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 bg-red-500 rounded-2xl p-5 text-center text-white">
        <p className="font-black text-lg mb-1">今すぐ無料で作成</p>
        <p className="text-xs text-red-100 mb-3">登録不要・スマホ対応・完全無料</p>
        <Link href="/" className="inline-block bg-white text-red-500 font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-red-50 transition-colors">
          まるアイコンを使う →
        </Link>
      </div>
    </article>
  );
}
