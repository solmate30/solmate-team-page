export interface Village {
  villId: string;
  villNm: string;
  sidoNm: string;
  sggNm: string;
  emdNm: string;
  villHouseTotCnt: number;
  villHouseEmpty: number;
  villHouseSlate: number;
  legalCode: string;
}

export interface VillageApiResult {
  items: Village[];
  totalCount: number;
  isMock: boolean;
}

const MOCK_VILLAGES: Village[] = [
  { villId: "M001", villNm: "송계마을", sidoNm: "경상북도", sggNm: "의성군", emdNm: "단촌면", villHouseTotCnt: 87, villHouseEmpty: 24, villHouseSlate: 31, legalCode: "4726025021" },
  { villId: "M002", villNm: "하평마을", sidoNm: "전라남도", sggNm: "고흥군", emdNm: "풍양면", villHouseTotCnt: 63, villHouseEmpty: 19, villHouseSlate: 22, legalCode: "4622031024" },
  { villId: "M003", villNm: "용두마을", sidoNm: "충청남도", sggNm: "청양군", emdNm: "화성면", villHouseTotCnt: 112, villHouseEmpty: 17, villHouseSlate: 28, legalCode: "4418025014" },
  { villId: "M004", villNm: "원당마을", sidoNm: "강원특별자치도", sggNm: "영월군", emdNm: "주천면", villHouseTotCnt: 74, villHouseEmpty: 15, villHouseSlate: 19, legalCode: "5175031021" },
  { villId: "M005", villNm: "매화마을", sidoNm: "경상남도", sggNm: "합천군", emdNm: "묘산면", villHouseTotCnt: 58, villHouseEmpty: 13, villHouseSlate: 17, legalCode: "4880034022" },
  { villId: "M006", villNm: "반월마을", sidoNm: "전라북도", sggNm: "임실군", emdNm: "삼계면", villHouseTotCnt: 91, villHouseEmpty: 21, villHouseSlate: 33, legalCode: "4538034011" },
];

const BASE_URL = "https://apis.data.go.kr/B552149/raiseRuralVill/infoVill";

async function tryFetch(serviceKey: string, numOfRows: number) {
  const params = new URLSearchParams({
    pageNo: "1",
    numOfRows: String(numOfRows),
    dataType: "json",
  });

  const res = await fetch(`${BASE_URL}?serviceKey=${serviceKey}&${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();

  // 공공API 오류 코드 체크
  const resultCode = json?.header?.resultCode ?? json?.response?.header?.resultCode;
  if (resultCode && resultCode !== "00" && resultCode !== "0000") {
    throw new Error(`API error: ${resultCode}`);
  }

  const raw = json?.body?.items?.item ?? [];
  const items: Village[] = Array.isArray(raw) ? raw : [raw];
  items.sort((a, b) => (b.villHouseEmpty ?? 0) - (a.villHouseEmpty ?? 0));

  return { items, totalCount: json?.body?.totalCount ?? items.length };
}

export async function fetchVillages(numOfRows = 12): Promise<VillageApiResult> {
  const decodedKey = process.env.DATA_GO_KR_API_KEY_DECODED;
  const encodedKey = process.env.DATA_GO_KR_API_KEY;

  // 1순위: Decoding 키
  if (decodedKey) {
    try {
      const result = await tryFetch(encodeURIComponent(decodedKey), numOfRows);
      return { ...result, isMock: false };
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("[villageApi] 농촌마을 API 실패:", err);
      }
    }
  }

  // 2순위: Encoding 키 (이미 인코딩된 값을 그대로 URL에 삽입)
  if (encodedKey) {
    try {
      const result = await tryFetch(encodedKey, numOfRows);
      return { ...result, isMock: false };
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("[villageApi] Encoding 키 실패:", err);
      }
    }
  }

  return { items: MOCK_VILLAGES, totalCount: MOCK_VILLAGES.length, isMock: true };
}
