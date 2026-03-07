export interface AgeData {
  age: string;
  ageCode: string;
  count: number;
  year: string;
}

export interface KosisResult {
  ageData: AgeData[];
  total: number;
  middleAged: number;   // 50대 + 60대
  middleAgedRate: number;
  year: string;
  isMock: boolean;
}

// 실제 KOSIS 데이터 기반 Mock
const MOCK_RESULT: KosisResult = {
  ageData: [
    { age: "19세이하", ageCode: "01", count: 2,    year: "2024" },
    { age: "20대",    ageCode: "02", count: 45,   year: "2024" },
    { age: "30대",    ageCode: "03", count: 171,  year: "2024" },
    { age: "40대",    ageCode: "04", count: 509,  year: "2024" },
    { age: "50대",    ageCode: "05", count: 1197, year: "2024" },
    { age: "60대",    ageCode: "06", count: 1271, year: "2024" },
    { age: "70대",    ageCode: "07", count: 497,  year: "2024" },
    { age: "80대이상", ageCode: "08", count: 202,  year: "2024" },
  ],
  total: 3924,
  middleAged: 2468,
  middleAgedRate: 63,
  year: "2024",
  isMock: true,
};

const AGE_ORDER = ["01","02","03","04","05","06","07","08"];

export async function fetchKosisData(): Promise<KosisResult> {
  const apiKey = process.env.KOSIS_API_KEY;
  if (!apiKey) return MOCK_RESULT;

  try {
    const params = new URLSearchParams({
      method: "getList",
      apiKey,
      orgId: "117",
      tblId: "DT_117111_A002",
      objL1: "ALL",
      objL2: "ALL",
      itmId: "ALL",
      prdSe: "Y",
      newEstPrdCnt: "1",
      format: "json",
      jsonVD: "Y",
      useNm: "Y",
    });

    const res = await fetch(
      `https://kosis.kr/openapi/Param/statisticsParameterData.do?${params}`,
      { next: { revalidate: 86400 } } // 24시간 캐시
    );

    if (!res.ok) throw new Error(`KOSIS HTTP ${res.status}`);

    const raw: Record<string, string>[] = await res.json();
    if (!Array.isArray(raw) || raw[0]?.err) throw new Error("KOSIS API error");

    // 계(C1=0), 미상 제외한 연령별 필터
    const latest = raw[0]?.PRD_DE ?? "";
    const filtered = raw.filter(
      (d) => d.C1 === "0" && AGE_ORDER.includes(d.C2)
    );

    const ageData: AgeData[] = AGE_ORDER.map((code) => {
      const row = filtered.find((d) => d.C2 === code);
      return {
        age: row?.C2_NM ?? code,
        ageCode: code,
        count: Number(row?.DT ?? 0),
        year: latest,
      };
    });

    const total = ageData.reduce((s, d) => s + d.count, 0);
    const middleAged =
      (ageData.find((d) => d.ageCode === "05")?.count ?? 0) +
      (ageData.find((d) => d.ageCode === "06")?.count ?? 0);
    const middleAgedRate = total > 0 ? Math.round((middleAged / total) * 100) : 0;

    return { ageData, total, middleAged, middleAgedRate, year: latest, isMock: false };
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[kosisApi] KOSIS API 실패:", err);
    }
    return MOCK_RESULT;
  }
}
