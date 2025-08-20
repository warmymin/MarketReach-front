import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MarketReach - 위치 기반 마케팅 플랫폼",
  description: "위치 기반 마케팅 캠페인을 관리하고 모니터링하는 플랫폼",
  keywords: "마케팅, 위치기반, 캠페인, 타겟팅, 발송",
  authors: [{ name: "MarketReach Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
}
