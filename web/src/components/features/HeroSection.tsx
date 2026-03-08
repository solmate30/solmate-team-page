"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

const HouseScene = dynamic(
  () => import("./HouseScene").then(m => ({ default: m.HouseScene })),
  { ssr: false }
);

export function HeroSection() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#FAFAFA]">
      <HouseScene />
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between px-6 md:px-12 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1152d4] text-white font-bold">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Solmate</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#mission" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Mission</Link>
          <Link href="#tech" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Tech</Link>
          <Link href="#projects" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Projects</Link>
          <Link href="#ecosystem" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Ecosystem</Link>
          <Link href="#team" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Team</Link>
          <Link href="/chat" className="text-sm font-medium text-white bg-[#1152d4] hover:bg-blue-700 px-4 py-2 rounded-full transition-colors">AI Chat</Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden text-slate-600 p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-drawer"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <nav id="mobile-nav-drawer" aria-label="모바일 메뉴" className="fixed inset-0 z-40 bg-white pt-20 px-6 flex flex-col gap-6 md:hidden">
          {["mission", "tech", "projects", "ecosystem", "team"].map((id) => (
            <Link
              key={id}
              href={`#${id}`}
              className="text-lg font-medium text-slate-700 capitalize border-b border-slate-100 pb-4"
              onClick={() => setMobileOpen(false)}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </Link>
          ))}
          <Link href="/chat" onClick={() => setMobileOpen(false)}>
            <Button className="w-full bg-[#1152d4] rounded-full">AI Chat 체험하기</Button>
          </Link>
        </nav>
      )}

      {/* Hero Content */}
      <section className="relative z-10 pt-40 pb-20 md:pt-56 md:pb-32 px-6 md:px-12 flex flex-col items-center text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-50 text-[#1152d4] text-sm font-semibold border border-blue-100">
            AI + Web3 × Social Impact
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            따뜻한 기술로<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#1152d4] to-blue-400">
              사회의 빈칸
            </span>을 채우다
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Solmate는 AI, Web3, 블록체인 기술을 활용하여 독거인 소외 문제와 유휴 공간 방치 등 파편화된 사회 문제를 실질적으로 해결합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <Link href="#projects" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="h-14 px-8 text-base w-full bg-[#1152d4] hover:bg-blue-700 rounded-full sm:w-auto"
              >
                프로젝트 알아보기
              </Button>
            </Link>
            <Link href="/chat" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base rounded-full border-slate-300 text-slate-700 hover:bg-slate-50 w-full sm:w-auto"
              >
                AI 반려 챗봇 체험
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
