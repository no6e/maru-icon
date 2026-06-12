import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "まるアイコンの使い方【完全ガイド】プロフィール画像を丸く無料で作成 | まるアイコン",
  description: "まるアイコンの使い方を画像付きで解説。写真のアップロード・フレーム選択・位置調整・ダウンロードまで4ステップで完了。LINE・X・Instagram対応。",
  alternates: { canonical: "https://maru-icon.com/how-to/" },
};

export default function HowToPage() {
  return (
    <article className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-400 mb-4">
        <Link href="/">まるアイコン</Link> &gt; 使い方
      </nav>

      <h1 className="text-2xl font-black text-gray-900 mb-2">
        まるアイコンの使い方
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        4ステップでプロフィール画像を丸く切り抜いてダウンロードできます。登録不要・完全無料。
      </p>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
        <p className="text-sm font-bold text-red-700 mb-1">📱 今すぐ試してみる</p>
        <p className="text-xs text-red-600 mb-2">実際に使いながら確認するのが一番早いです。</p>
        <Link href="/" className="inline-block bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
          アイコンを作る →
        </Link>
      </div>

      {/* ステップ解説 */}
      <div className="space-y-8">
        {[
          {
            step: "1",
            color: "bg-red-500",
            title: "写真をアップロード",
            desc: "画面上部の「写真を選ぶ」エリアをタップ（またはクリック）して、使いたい写真を選びます。",
            tips: [
              "スマホのカメラロールから直接選択できます",
              "JPG・PNG・WEBPに対応",
              "ドラッグ＆ドロップも使えます（PC）",
              "顔や被写体が中央に写っている写真が仕上がりきれいです",
            ],
          },
          {
            step: "2",
            color: "bg-blue-500",
            title: "フレームを選ぶ",
            desc: "カテゴリから好きなフレームを選びます。シンプルな丸フレームから、季節・かわいい系まで22種類。",
            tips: [
              "「シンプル（白）」はどんな写真にも合います",
              "LINEアイコンにはシンプル系がおすすめ",
              "季節・行事に合わせて「季節」カテゴリが人気",
              "フレームなしにしたい場合は「なし」を選んでください",
            ],
          },
          {
            step: "3",
            color: "bg-green-500",
            title: "位置・サイズを調整",
            desc: "プレビューを見ながら写真の位置とズームを調整します。",
            tips: [
              "写真を直接ドラッグして位置を動かせます",
              "スライダーでズームイン・アウト",
              "矢印ボタン（↑↓←→）でも細かく調整できます",
              "背景色も7色から選べます",
            ],
          },
          {
            step: "4",
            color: "bg-amber-500",
            title: "画像を保存する",
            desc: "「画像を保存する」ボタンをタップするとダウンロードが始まります。",
            tips: [
              "512×512pxの高解像度PNG形式で保存",
              "スマホの場合は「写真に保存」を選んでください",
              "そのままLINEやXのアイコンに設定できます",
              "何度でも作り直せます（「もう一度つくる」ボタン）",
            ],
          },
        ].map(({ step, color, title, desc, tips }) => (
          <section key={step} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <span className={`w-8 h-8 rounded-full ${color} text-white text-sm font-black flex items-center justify-center flex-shrink-0`}>
                {step}
              </span>
              <h2 className="font-black text-base text-gray-900">{title}</h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-gray-700 mb-3">{desc}</p>
              <ul className="space-y-1.5">
                {tips.map((tip) => (
                  <li key={tip} className="flex gap-2 text-xs text-gray-500">
                    <span className="text-red-400 flex-shrink-0">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-lg font-black text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            {
              q: "スマホで使えますか？",
              a: "はい、iPhone・Androidどちらでもブラウザから使えます。アプリのインストールは不要です。",
            },
            {
              q: "写真データはどこかに保存されますか？",
              a: "いいえ。すべての処理はお使いのブラウザ内で完結します。写真が外部サーバーに送られることはありません。",
            },
            {
              q: "作ったアイコンはどこに使えますか？",
              a: "LINE・X（Twitter）・Instagram・Discord・Slack・YouTubeなど主要SNSのプロフィール画像に使えます。512×512pxなのでどのSNSでも高画質で表示されます。",
            },
            {
              q: "何度でも作り直せますか？",
              a: "はい、「もう一度つくる」ボタンで何度でもやり直せます。回数制限はありません。",
            },
            {
              q: "背景を透明にできますか？",
              a: "現在は白・黒などの単色背景のみ対応しています。透明背景（透過PNG）への対応は今後追加予定です。",
            },
            {
              q: "保存できるサイズは？",
              a: "512×512pxのPNG形式で保存されます。LINE・X・Instagramなどすべての主要SNSの推奨サイズを満たしています。",
            },
          ].map(({ q, a }) => (
            <div key={q} className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-sm font-bold text-gray-800 mb-1">Q. {q}</p>
              <p className="text-xs text-gray-600 leading-relaxed">A. {a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 各SNS設定リンク */}
      <section className="mt-10">
        <h2 className="text-lg font-black text-gray-900 mb-4">SNS別・設定方法</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: "LINEアイコンの設定方法", href: "/line-icon/", desc: "推奨サイズ・設定手順を解説" },
            { name: "フレーム一覧", href: "/frame/", desc: "全22種類のフレームを確認" },
          ].map(({ name, href, desc }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-100 hover:border-red-200"
            >
              <p className="text-sm font-bold text-gray-800">{name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              <p className="text-xs text-red-500 mt-1">詳しく見る →</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-10 bg-red-500 rounded-2xl p-5 text-center text-white">
        <p className="font-black text-lg mb-1">さっそく作ってみる</p>
        <p className="text-xs text-red-100 mb-3">登録不要・スマホ対応・完全無料</p>
        <Link href="/" className="inline-block bg-white text-red-500 font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-red-50 transition-colors">
          まるアイコンを使う →
        </Link>
      </div>
    </article>
  );
}
