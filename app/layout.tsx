import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "まるアイコン - プロフィール画像を丸く無料で作成",
  description:
    "写真をアップロードするだけで、LINEやX（Twitter）・Instagramのプロフィール画像を丸く切り抜いてフレームでデコれる無料ツール。登録不要・スマホ対応。",
  keywords:
    "プロフィール画像,丸く,無料,LINEアイコン,SNSアイコン,アイコン作成,丸く切り抜き",
  openGraph: {
    title: "まるアイコン - プロフィール画像を丸く無料で作成",
    description:
      "写真をアップロードするだけでSNSアイコンが完成。無料・登録不要。",
    url: "https://maru-icon.com",
    siteName: "まるアイコン",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://maru-icon.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "まるアイコン - プロフィール画像を丸く無料で作成",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "まるアイコン - プロフィール画像を丸く無料で作成",
    description:
      "写真をアップロードするだけでSNSアイコンが完成。無料・登録不要。",
    images: ["https://maru-icon.com/og-image.png"],
  },
  alternates: {
    canonical: "https://maru-icon.com",
  },
  other: {
    "google-adsense-account": "ca-pub-4661946188646786",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4661946188646786"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-WS13N4WMN9"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-WS13N4WMN9');
      `}</Script>
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white border-b-2 border-red-500 sticky top-0 z-50 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl">⭕</span>
              <div>
                <span className="font-black text-gray-900 text-lg leading-none block">
                  まるアイコン
                </span>
                <span className="text-[10px] text-gray-400 leading-none">
                  プロフィール画像を丸く無料で作成
                </span>
              </div>
            </a>
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <a
                href="/line-icon/"
                className="text-gray-500 hover:text-red-500 font-medium transition-colors"
              >
                LINEアイコン
              </a>
              <a
                href="/frame/"
                className="text-gray-500 hover:text-red-500 font-medium transition-colors"
              >
                フレーム一覧
              </a>
              <a
                href="/how-to/"
                className="text-gray-500 hover:text-red-500 font-medium transition-colors"
              >
                使い方
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-white border-t border-gray-100 mt-12 py-8">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <p className="font-black text-gray-800 mb-1">⭕ まるアイコン</p>
            <p className="text-xs text-gray-400">
              プロフィール画像を丸く無料で作成できるツール
            </p>
            <div className="flex justify-center gap-4 mt-3 text-xs text-gray-400">
              <a href="/line-icon/" className="hover:text-gray-600">
                LINEアイコンの作り方
              </a>
              <a href="/frame/" className="hover:text-gray-600">
                フレーム一覧
              </a>
              <a href="/how-to/" className="hover:text-gray-600">
                使い方
              </a>
              <a href="/privacy/" className="hover:text-gray-600">
                プライバシーポリシー
              </a>
            </div>
            <p className="text-xs text-gray-300 mt-4">© 2026 まるアイコン</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
