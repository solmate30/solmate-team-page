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

export interface ProvinceStats {
  sidoNm: string;
  totalEmpty: number;
  totalHouses: number;
  villageCount: number;
}

export interface VillageApiResult {
  items: ProvinceStats[];
  totalCount: number;
  totalEmpty: number;
  totalHouses: number;
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

const FETCH_BATCH = 1000;
const CACHE_OPTIONS = { next: { revalidate: 3600 } } as const;

async function fetchPage(
  serviceKey: string,
  pageNo: number,
  numOfRows: number
): Promise<{ items: Village[]; totalCount: number }> {
  const params = new URLSearchParams({
    pageNo: String(pageNo),
    numOfRows: String(numOfRows),
    dataType: "json",
  });

  const res = await fetch(`${BASE_URL}?serviceKey=${serviceKey}&${params}`, CACHE_OPTIONS);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();
  const resultCode = json?.header?.resultCode ?? json?.response?.header?.resultCode;
  if (resultCode && resultCode !== "00" && resultCode !== "0000") {
    throw new Error(`API error: ${resultCode}`);
  }

  const body = json?.body ?? json?.response?.body ?? {};
  const raw = body?.items?.item ?? [];
  const items: Village[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const totalCount = body?.totalCount ?? 0;
  return { items, totalCount };
}

async function tryFetch(serviceKey: string) {
  const all: Village[] = [];
  let totalCount = 0;
  let pageNo = 1;

  while (true) {
    const { items, totalCount: tc } = await fetchPage(serviceKey, pageNo, FETCH_BATCH);
    if (tc > 0) totalCount = tc;
    if (items.length === 0) break;
    all.push(...items);
    if (items.length < FETCH_BATCH) break;
    pageNo++;
  }

  const totalEmpty = all.reduce((s, v) => s + (v.villHouseEmpty ?? 0), 0);
  const totalHouses = all.reduce((s, v) => s + (v.villHouseTotCnt ?? 0), 0);

  const bySido = new Map<string, { empty: number; houses: number; count: number }>();
  for (const v of all) {
    const key = v.sidoNm ?? "기타";
    const cur = bySido.get(key) ?? { empty: 0, houses: 0, count: 0 };
    cur.empty += v.villHouseEmpty ?? 0;
    cur.houses += v.villHouseTotCnt ?? 0;
    cur.count += 1;
    bySido.set(key, cur);
  }

  const items: ProvinceStats[] = Array.from(bySido.entries()).map(([sidoNm, data]) => ({
    sidoNm,
    totalEmpty: data.empty,
    totalHouses: data.houses,
    villageCount: data.count,
  }));

  items.sort((a, b) => b.totalEmpty - a.totalEmpty);

  return { items, totalCount, totalEmpty, totalHouses };
}

export async function fetchVillages(): Promise<VillageApiResult> {
  const decodedKey = process.env.DATA_GO_KR_API_KEY_DECODED;
  const encodedKey = process.env.DATA_GO_KR_API_KEY;

  if (decodedKey) {
    try {
      const result = await tryFetch(encodeURIComponent(decodedKey));
      return { ...result, isMock: false };
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("[villageApi] 농촌마을 API 실패:", err);
      }
    }
  }

  if (encodedKey) {
    try {
      const result = await tryFetch(encodedKey);
      return { ...result, isMock: false };
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("[villageApi] Encoding 키 실패:", err);
      }
    }
  }

  const mockEmpty = MOCK_VILLAGES.reduce((s, v) => s + v.villHouseEmpty, 0);
  const mockHouses = MOCK_VILLAGES.reduce((s, v) => s + v.villHouseTotCnt, 0);
  const mockBySido = new Map<string, { empty: number; houses: number; count: number }>();
  for (const v of MOCK_VILLAGES) {
    const cur = mockBySido.get(v.sidoNm) ?? { empty: 0, houses: 0, count: 0 };
    cur.empty += v.villHouseEmpty;
    cur.houses += v.villHouseTotCnt;
    cur.count += 1;
    mockBySido.set(v.sidoNm, cur);
  }
  const mockItems: ProvinceStats[] = Array.from(mockBySido.entries()).map(([sidoNm, data]) => ({
    sidoNm,
    totalEmpty: data.empty,
    totalHouses: data.houses,
    villageCount: data.count,
  }));
  mockItems.sort((a, b) => b.totalEmpty - a.totalEmpty);

  return {
    items: mockItems,
    totalCount: MOCK_VILLAGES.length,
    totalEmpty: mockEmpty,
    totalHouses: mockHouses,
    isMock: true,
  };
}
