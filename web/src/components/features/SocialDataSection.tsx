import type { KosisResult } from "@/lib/kosisApi";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AgeBarChart } from "@/components/ui/AgeBarChart";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

interface SocialDataSectionProps {
  kosisData: KosisResult;
}

export function SocialDataSection({ kosisData }: SocialDataSectionProps) {
  const { ageData, total, middleAged, middleAgedRate, year, isMock } = kosisData;

  return (
    <section className="bg-slate-50 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: 텍스트 + 수치 */}
          <AnimatedSection>
            <div className="flex items-center gap-2 mb-4">
              <p className="text-sm font-semibold text-[#1152d4] tracking-wider uppercase">
                고독사 현황 · KOSIS 행정안전부
              </p>
              {isMock ? (
                <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  <AlertCircle className="w-3 h-3" />
                  샘플
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  실시간
                </span>
              )}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              50·60대가
              <br />
              <span className="text-[#1152d4]">가장 위험합니다</span>
            </h2>

            <p className="text-lg text-slate-600 leading-relaxed mb-10">
              {year}년 전국 고독사{" "}
              <strong className="text-slate-900">
                {total.toLocaleString()}명
              </strong>{" "}
              중{" "}
              <strong className="text-[#1152d4]">{middleAgedRate}%</strong>가
              50·60대 중장년층입니다.
              <br className="hidden md:block" />
              은퇴 이후 사회적 연결이 끊어지는 시기, 솔이가 곁에 있습니다.
            </p>

            <div className="flex gap-10 mb-10">
              <div>
                <p className="text-4xl font-extrabold text-[#1152d4]">
                  {middleAged.toLocaleString()}
                  <span className="text-2xl">명</span>
                </p>
                <p className="text-sm text-slate-500 mt-1">50·60대 고독사</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-[#1152d4]">
                  {middleAgedRate}
                  <span className="text-2xl">%</span>
                </p>
                <p className="text-sm text-slate-500 mt-1">전체 비율</p>
              </div>
            </div>

            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-[#1152d4] hover:bg-blue-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors"
            >
              솔이와 대화 시작하기 →
            </Link>
          </AnimatedSection>

          {/* Right: 바 차트 */}
          <AnimatedSection delay={0.2}>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900">
                  연령대별 고독사 현황
                </h3>
                <span className="text-xs text-slate-400">{year}년 기준</span>
              </div>
              <AgeBarChart data={ageData} />
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#1152d4]" />
                  <span className="text-xs text-slate-500">
                    50·60대 (주요 대상)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <span className="text-xs text-slate-500">기타 연령대</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <p className="text-center text-xs text-slate-400 mt-12">
          출처: 행정안전부 고독사 발생 현황 (KOSIS, {year}) · Solmate AI 케어
          서비스 대상 선정에 활용됩니다
        </p>
      </div>
    </section>
  );
}
