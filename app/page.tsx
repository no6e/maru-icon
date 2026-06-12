import type { Metadata } from "next";
import IconMaker from "@/components/IconMaker";

export const metadata: Metadata = {
  title: "まるアイコン - プロフィール画像を丸く無料で作成 | LINEアイコンも簡単",
  description: "写真をアップロードするだけでプロフィール画像を丸く切り抜いて無料で作成。LINEアイコン・X・Instagram・Discordに対応。フレーム付きで可愛くデコれる。登録不要・スマホ対応。",
};

export default function Home() {
  return (
    <>
      <div className="bg-gradient-to-b from-red-50 to-gray-100 py-6 px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
          プロフィール画像を<br className="md:hidden" />
          <span className="text-red-500">丸く</span>して無料で作成
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          写真をアップロードするだけ。LINEアイコン・X・Instagram・Discordに対応。
          登録不要・完全無料。
        </p>
        <div className="flex justify-center gap-3 mt-3 text-xs text-gray-400">
          <span>✓ 登録不要</span>
          <span>✓ 完全無料</span>
          <span>✓ スマホ対応</span>
          <span>✓ 512px高解像度</span>
        </div>
      </div>

      <IconMaker />

      {/* SEOコンテンツ */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: "📱", title: "SNSにぴったり", desc: "LINE・X・Instagram・Discordなど主要SNSのプロフィール画像サイズに対応。512×512pxの高解像度PNG。" },
            { icon: "🔒", title: "登録不要・無料", desc: "アカウント登録なし、メールアドレス不要。すぐに作成してダウンロードできます。" },
            { icon: "🎨", title: "フレームでデコ", desc: "ゲームキャラ・シンプル・季節・かわいい系など20種類以上のフレームから選べます。" },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-5 shadow">
              <div className="text-2xl mb-2">{icon}</div>
              <h2 className="font-bold text-sm mb-1">{title}</h2>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="font-bold text-base mb-3">プロフィール画像を丸く作る方法</h2>
          <ol className="text-sm text-gray-600 space-y-2">
            <li><span className="font-bold text-red-500">①</span> 「写真を選ぶ」から画像をアップロード（JPG・PNG・WEBP対応）</li>
            <li><span className="font-bold text-red-500">②</span> 好きなフレームを選ぶ（シンプルな丸フレームも選べます）</li>
            <li><span className="font-bold text-red-500">③</span> 写真の位置やズームを調整してプレビューを確認</li>
            <li><span className="font-bold text-red-500">④</span> 「画像を保存する」でPNGをダウンロード</li>
          </ol>
          <p className="text-xs text-gray-400 mt-3">
            ダウンロードした画像はLINEのプロフィール画像・X（Twitter）・Instagramなどのアイコンにそのまま使えます。
          </p>
        </div>
      </section>
    </>
  );
}
