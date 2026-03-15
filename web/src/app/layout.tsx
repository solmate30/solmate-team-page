import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Solmate — 따뜻한 기술로 사회의 빈칸을 채우다",
  description:
    "Solmate는 AI 감성 케어 챗봇과 Web3 기반 빈집 재생 플랫폼으로 독거인 소외 문제와 유휴 공간 방치를 해결하는 소셜 임팩트 스타트업입니다.",
  keywords: ["solmate", "빈집재생", "독거노인", "AI챗봇", "소셜임팩트", "Web3", "블록체인"],
  openGraph: {
    title: "Solmate — 따뜻한 기술로 사회의 빈칸을 채우다",
    description:
      "AI, Web3, 블록체인으로 독거인 소외와 빈집 방치 문제를 해결하는 소셜 임팩트 플랫폼",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("font-sans", inter.variable)}>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
