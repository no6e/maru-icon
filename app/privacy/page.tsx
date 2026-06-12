import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー | まるアイコン",
  description: "まるアイコンのプライバシーポリシー。Cookie・アクセス解析・広告配信に関する情報を掲載しています。",
  alternates: { canonical: "https://maru-icon.com/privacy/" },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <article className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-400 mb-4">
        <Link href="/">まるアイコン</Link> &gt; プライバシーポリシー
      </nav>

      <h1 className="text-2xl font-black text-gray-900 mb-2">プライバシーポリシー</h1>
      <p className="text-xs text-gray-400 mb-8">最終更新日: 2026年6月12日</p>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">基本方針</h2>
          <p>
            まるアイコン（以下「当サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。
            当サービスはブラウザ上で動作するツールであり、アップロードされた写真を外部サーバーに送信・保存することは一切ありません。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">収集する情報</h2>
          <p className="mb-2">当サービスでは、以下の情報を収集することがあります。</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>アクセスログ（IPアドレス、ブラウザ種別、OS、参照元URL、アクセス日時）</li>
            <li>Cookie および類似技術を通じたアクセス情報</li>
          </ul>
          <p className="mt-2">
            写真・画像データはすべてお使いのブラウザ内でのみ処理されます。外部に送信されることはありません。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Cookieの利用</h2>
          <p className="mb-2">
            当サービスでは、サービス改善・広告配信を目的としてCookieを使用することがあります。
            ブラウザの設定からCookieを無効にすることができますが、一部機能が利用できなくなる場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">アクセス解析（Google Analytics）</h2>
          <p className="mb-2">
            当サービスでは、アクセス状況を把握するためにGoogle LLC提供の「Google Analytics」を使用しています。
            Google Analyticsはトラフィックデータ収集のためにCookieを使用します。このデータは匿名で収集されており、個人を特定するものではありません。
          </p>
          <p>
            Google Analyticsの利用規約・プライバシーポリシーについては
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline mx-1">Google プライバシーポリシー</a>
            をご確認ください。
            また、Google Analyticsによるデータ収集を無効にしたい場合は
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline mx-1">Google Analytics オプトアウトアドオン</a>
            をご利用ください。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">広告配信（Google AdSense）</h2>
          <p className="mb-2">
            当サービスでは、Google LLC提供の「Google AdSense」を利用した広告を掲載することがあります。
            Google AdSenseはCookieを使用して、ユーザーの興味・関心に基づいた広告を表示します。
          </p>
          <p>
            広告のパーソナライズを無効にしたい場合は
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline mx-1">Google 広告設定</a>
            からご変更いただけます。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">第三者へのデータ提供</h2>
          <p>
            当サービスは、法令に基づく場合を除き、ユーザーの個人情報を第三者に提供することはありません。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">免責事項</h2>
          <p>
            当サービスは無料で提供しており、サービスの内容・機能について予告なく変更・停止することがあります。
            当サービスの利用により生じたいかなる損害についても、運営者は責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">プライバシーポリシーの変更</h2>
          <p>
            当サービスは、必要に応じてプライバシーポリシーを改定することがあります。
            変更後のポリシーはこのページに掲載した時点で効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">お問い合わせ</h2>
          <p>
            当サービスに関するお問い合わせは、下記メールアドレスまでご連絡ください。
          </p>
          <p className="mt-2 font-mono text-gray-600">ze6kova［at］gmail.com</p>
        </section>

      </div>

      <div className="mt-10 text-center">
        <Link href="/" className="text-sm text-red-500 hover:underline">← トップページへ戻る</Link>
      </div>
    </article>
  );
}
