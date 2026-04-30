import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trophy } from "lucide-react";

type Project = {
  title: string;
  category: string;
  description: string;
  image: string;
  link: string;
  badge?: string;
  status?: string;
};

export function ProjectsEcosystemSection() {
  const projects: Project[] = [
    {
      title: "춘심 (Choonsim)",
      category: "AI · Emotional Companion",
      description:
        "X(Twitter) 팔로워 3.3만의 실제 K-pop 팬덤 IP를 기반으로 한 AI 가상 동반자 앱. 단순 챗봇을 넘어 특별한 대화를 NFT로 영구 각인하고, AI 에이전트가 감성적 상호작용을 지원합니다.",
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23fdf2f8'/%3E%3Ccircle cx='400' cy='260' r='100' fill='%23f9a8d4' opacity='0.4'/%3E%3Ccircle cx='400' cy='260' r='65' fill='%23ec4899' opacity='0.25'/%3E%3Cpath d='M370,230c0-16.6,13.4-30,30-30s30,13.4,30,30' stroke='%23db2777' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3Ccircle cx='378' cy='252' r='8' fill='%23db2777'/%3E%3Ccircle cx='422' cy='252' r='8' fill='%23db2777'/%3E%3Cpath d='M375,285 Q400,305 425,285' stroke='%23db2777' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3Crect x='200' y='380' width='180' height='60' rx='30' fill='%23fce7f3' stroke='%23f9a8d4' stroke-width='2'/%3E%3Crect x='420' y='380' width='180' height='60' rx='30' fill='%23ede9fe' stroke='%23c4b5fd' stroke-width='2'/%3E%3C/svg%3E",
      link: "https://choonsim-talk-sol.vercel.app/home",
      badge: "Colosseum Frontier 2026",
      status: "라이브",
    },
    {
      title: "Rural Rest",
      category: "Space Regeneration · Web3",
      description:
        "방치된 한국 시골 빈집을 한옥·농가 숙소로 재생해 글로벌 여행자와 연결하는 예약 플랫폼. 온체인 RWA 토큰화로 숙소 지분 투자 및 배당 수익을 가능하게 합니다.",
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f0fdf4'/%3E%3Cpath d='M400,150l-200,160h60v180h280V310h60z' fill='%2386efac' opacity='0.5'/%3E%3Cpath d='M400,150l-200,160h60v180h280V310h60z' fill='none' stroke='%2322c55e' stroke-width='3'/%3E%3Crect x='340' y='370' width='80' height='120' rx='4' fill='%2386efac' stroke='%2322c55e' stroke-width='2'/%3E%3Crect x='260' y='310' width='60' height='50' rx='4' fill='%23bbf7d0' stroke='%2322c55e' stroke-width='1.5'/%3E%3Crect x='480' y='310' width='60' height='50' rx='4' fill='%23bbf7d0' stroke='%2322c55e' stroke-width='1.5'/%3E%3C/svg%3E",
      link: "#",
      status: "개발 중",
    },
    {
      title: "MyDNA Insurance Agent",
      category: "Web3 · Privacy Tech",
      description:
        "유전자를 노출하지 않고 맞춤 보험을 추천받는 NEAR Protocol 기반 프라이버시 DApp. IronClaw TEE + Noir ZKP 3계층 프라이버시 아키텍처로 보험사에 유전자 수치를 전달하지 않습니다.",
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23eff6ff'/%3E%3Ccircle cx='400' cy='280' r='120' fill='none' stroke='%2393c5fd' stroke-width='3'/%3E%3Ccircle cx='400' cy='280' r='80' fill='none' stroke='%2360a5fa' stroke-width='3'/%3E%3Ccircle cx='400' cy='280' r='40' fill='%233b82f6' opacity='0.3'/%3E%3Cpath d='M370,200 Q400,240 370,280 Q400,320 370,360' stroke='%232563eb' stroke-width='3' fill='none'/%3E%3Cpath d='M430,200 Q400,240 430,280 Q400,320 430,360' stroke='%232563eb' stroke-width='3' fill='none'/%3E%3C/svg%3E",
      link: "https://buidl-2026-near.vercel.app/en",
      badge: "NEAR Buidl 2026 · 1위 수상",
      status: "Phase 2 진행 중",
    },
    {
      title: "Web3People",
      category: "Web3 · Content Platform",
      description:
        "Web3 생태계 주요 인물과 인터뷰를 탐색하는 차세대 매거진형 편집 플랫폼. Payload CMS 기반 어드민 콘텐츠 발행 시스템과 인물 프로필 · 인터뷰 Q&A 피드를 제공합니다.",
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23fafaf9'/%3E%3Crect x='180' y='160' width='180' height='280' rx='12' fill='%23e7e5e4'/%3E%3Crect x='200' y='180' width='140' height='16' rx='4' fill='%23a8a29e'/%3E%3Crect x='200' y='206' width='100' height='10' rx='3' fill='%23d6d3d1'/%3E%3Crect x='200' y='222' width='120' height='10' rx='3' fill='%23d6d3d1'/%3E%3Crect x='440' y='160' width='180' height='280' rx='12' fill='%23e7e5e4'/%3E%3Crect x='460' y='180' width='140' height='16' rx='4' fill='%23a8a29e'/%3E%3Crect x='460' y='206' width='100' height='10' rx='3' fill='%23d6d3d1'/%3E%3Crect x='460' y='222' width='120' height='10' rx='3' fill='%23d6d3d1'/%3E%3Ccircle cx='270' cy='350' r='30' fill='%23d6d3d1'/%3E%3Ccircle cx='530' cy='350' r='30' fill='%23d6d3d1'/%3E%3C/svg%3E",
      link: "#",
      status: "MVP · 출시 준비 중",
    },
  ];

  const ecosystemLogos: { name: string; src?: string }[] = [
    { name: "OpenAI" }, // inline SVG (removed from Simple Icons CDN)
    { name: "Claude",       src: "https://cdn.simpleicons.org/anthropic" },
    { name: "Gemini",       src: "https://cdn.simpleicons.org/googlegemini" },
    { name: "LangChain",    src: "https://cdn.simpleicons.org/langchain" },
    { name: "NEAR Protocol",src: "https://cdn.simpleicons.org/near" },
    { name: "Solana",       src: "https://cdn.simpleicons.org/solana" },
    { name: "Turso",        src: "https://cdn.simpleicons.org/turso" },
    { name: "Next.js",      src: "https://cdn.simpleicons.org/nextdotjs" },
    { name: "Vercel",       src: "https://cdn.simpleicons.org/vercel" },
    { name: "Payload CMS",  src: "https://cdn.simpleicons.org/payloadcms" },
  ];

  return (
    <>
      <div id="projects" className="bg-[#FAFAFA] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-[#1152d4] tracking-wider uppercase mb-3">
                Key Projects
              </h3>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                도전과 해결의 기록
              </h2>
            </div>
            <p className="text-slate-600 max-w-lg md:text-right">
              실질적인 가치를 창출하기 위해 기획되고 운영 중인 솔루션들입니다.
            </p>
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {projects.map((project) => (
              <div
                key={project.title}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full"
              >
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {project.badge && (
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      <Trophy className="w-3.5 h-3.5" />
                      {project.badge}
                    </div>
                  )}
                </div>
                <div className="p-8 sm:p-10 flex flex-col grow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-[#1152d4] tracking-wider uppercase">
                      {project.category}
                    </span>
                    {project.status && (
                      <span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                        {project.status}
                      </span>
                    )}
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-4">
                    {project.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed mb-8 grow">
                    {project.description}
                  </p>
                  <a
                    href={project.link}
                    target={project.link.startsWith("http") ? "_blank" : undefined}
                    rel={project.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="w-fit"
                  >
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-slate-300 rounded-full hover:bg-slate-50 text-slate-700"
                    >
                      상세 보기
                      {project.link.startsWith("http") && (
                        <ExternalLink className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ecosystem Section */}
      <div
        id="ecosystem"
        className="bg-white py-20 border-y border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-10">
            Powered by Modern Ecosystem
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {ecosystemLogos.map((logo) => (
              <div
                key={logo.name}
                title={logo.name}
                className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                {logo.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="h-7 w-auto"
                  />
                ) : (
                  /* OpenAI inline SVG */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-7 w-auto fill-slate-800"
                    aria-label="OpenAI"
                  >
                    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.368L15.115 7.2a.077.077 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
