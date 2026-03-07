import type { KosisResult } from "@/lib/kosisApi";
import { IMPACT_STATS } from "@/lib/constants";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ImpactCounters } from "@/components/features/ImpactCounters";

interface ImpactSectionProps {
  kosisData: KosisResult;
}

export function ImpactSection({ kosisData }: ImpactSectionProps) {
  const { total, middleAgedRate, year, isMock } = kosisData;

  const stats = [
    {
      value: IMPACT_STATS.VACANT_HOUSES_COUNT,
      suffix: "만+",
      label: "전국 방치 빈집",
      sublabel: "국토교통부 통계",
    },
    {
      value: total,
      suffix: "명",
      label: "연간 고독사",
      sublabel: `${year}년 행정안전부`,
      highlight: true,
    },
    {
      value: middleAgedRate,
      suffix: "%",
      label: "50·60대 비율",
      sublabel: "중장년층 고독사",
      highlight: true,
    },
    {
      value: IMPACT_STATS.AI_CARE_HOURS,
      suffix: "/7",
      label: "AI 케어",
      sublabel: `${IMPACT_STATS.AI_CARE_DAYS}일 상시 운영`,
    },
  ];

  return (
    <div className="bg-[#1152d4] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <AnimatedSection className="text-center mb-14">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3">
            Why It Matters
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            숫자로 보는 문제의 크기
          </h2>
        </AnimatedSection>

        <ImpactCounters stats={stats} isMock={isMock} />
      </div>
    </div>
  );
}
