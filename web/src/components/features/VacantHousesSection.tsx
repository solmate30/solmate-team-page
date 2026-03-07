import { fetchVillages } from "@/lib/villageApi";
import { fetchNationalVacancyRate } from "@/lib/kosisApi";
import { MapPin, AlertCircle } from "lucide-react";

export async function VacantHousesSection() {
  const [
    { items, totalCount, totalEmpty, totalHouses, isMock },
    vacancyRate,
  ] = await Promise.all([fetchVillages(), fetchNationalVacancyRate()]);

  const avgRate = totalHouses > 0 ? Math.round((totalEmpty / totalHouses) * 100) : 0;

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-sm font-semibold text-[#1152d4] tracking-wider uppercase mb-3">
              Live Data · 한국농어촌공사
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              농촌 빈집 현황
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {isMock ? (
              <span className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                <AlertCircle className="w-3.5 h-3.5" />
                API 연결 준비 중 · 샘플 데이터
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                실시간 공공데이터 연동
              </span>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "조회 마을", value: `${totalCount.toLocaleString()}개` },
            { label: "총 빈집", value: `${totalEmpty.toLocaleString()}채` },
            { label: "농촌마을 빈집률", value: `${avgRate}%` },
            {
              label: `전국 빈집률 (KOSIS ${vacancyRate.year}년${vacancyRate.isFallback ? " · 추정" : ""})`,
              value: `${vacancyRate.rate}%`,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-50 rounded-2xl p-5 text-center border border-slate-100"
            >
              <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Province Cards (시도 단위) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((province) => {
            const rate =
              province.totalHouses > 0
                ? Math.min(100, Math.round((province.totalEmpty / province.totalHouses) * 100))
                : 0;
            const severity =
              rate >= 30 ? "text-red-500 bg-red-50 border-red-100"
              : rate >= 15 ? "text-amber-500 bg-amber-50 border-amber-100"
              : "text-emerald-600 bg-emerald-50 border-emerald-100";

            return (
              <div
                key={province.sidoNm}
                className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col gap-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-slate-900 text-lg">{province.sidoNm}</p>
                    <p className="flex items-center gap-1 text-sm text-slate-400 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      농촌마을 {province.villageCount.toLocaleString()}개
                    </p>
                  </div>
                  <span className={`text-sm font-bold px-2.5 py-1 rounded-full border ${severity}`}>
                    {rate}%
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>빈집 {province.totalEmpty.toLocaleString()}채</span>
                    <span>전체 {province.totalHouses.toLocaleString()}채</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        rate >= 30 ? "bg-red-400" : rate >= 15 ? "bg-amber-400" : "bg-emerald-400"
                      }`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          출처: 한국농어촌공사 농산어촌지역개발 농촌마을현황 (data.go.kr), KOSIS e-지방지표 빈집비율 · 재생 가능 주거 매칭 대상 선별에 활용됩니다
        </p>
      </div>
    </section>
  );
}
