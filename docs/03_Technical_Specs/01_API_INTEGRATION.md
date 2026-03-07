# 01_API_INTEGRATION
> Created: 2026-03-07 04:30
> Last Updated: 2026-03-07 (문서 검토 반영)

## 1. OpenAI API (AI 챗봇)

### 개요
`/chat` 페이지의 AI 감성 동반자 '솔이' 구현에 사용.

### 연동 방식
| 항목 | 내용 |
|---|---|
| 패키지 | `openai` npm SDK |
| 모델 | `gpt-4o-mini` |
| 방식 | 서버 사이드 스트리밍 (`ReadableStream`) |
| 라우트 | `src/app/api/chat/route.ts` |
| 환경변수 | `OPENAI_API_KEY` (서버 전용) |

### 시스템 프롬프트 (솔이 페르소나)
- 따뜻하고 공감 능력이 넘치는 AI 감성 동반자
- 부드러운 존댓말, 이모지 적절 활용
- 판단하지 않고 상대방의 페이스 존중
- `temperature: 0.85`, `max_tokens: 500`

### 스트리밍 구조
```
Client (chat/page.tsx)
  └─ POST /api/chat { messages: [...] }
       └─ API Route (route.ts)
            └─ OpenAI stream → ReadableStream chunk 전달
                 └─ Client reads chunk by chunk → 실시간 타이핑 효과
```

---

## 2. 한국농어촌공사 농촌마을현황 API (빈집 데이터)

### 개요
공공데이터포털(data.go.kr) 승인 API. 전국 농촌마을의 빈집 현황 데이터 제공.

### 연동 정보
| 항목 | 내용 |
|---|---|
| 제공기관 | 한국농어촌공사 |
| End Point | `https://apis.data.go.kr/B552149/raiseRuralVill/infoVill` |
| 데이터포맷 | JSON |
| 환경변수 | `DATA_GO_KR_API_KEY_DECODED` (1순위, 일반 인코딩 키) / `DATA_GO_KR_API_KEY` (2순위, Encoding 키) — 서버 전용 |
| 캐시 | `revalidate: 3600` (1시간) |
| 일일 트래픽 한도 | 10,000건 |
| 활용기간 | 2026-03-07 ~ 2028-03-07 |

### 사용 엔드포인트
| 경로 | 설명 | 사용 여부 |
|---|---|---|
| `/infoVill` | 농촌마을 기본정보 (빈집 수, 가구 수, 인구 등) | ✅ 사용 중 |
| `/resourceVill` | 마을 자원정보 (농산물, 자연자원 등) | 미사용 |

### 주요 응답 필드
| 필드명 | 설명 |
|---|---|
| `villId` | 마을 고유 ID |
| `villNm` | 마을명 |
| `sidoNm` | 시도명 |
| `sggNm` | 시군구명 |
| `emdNm` | 읍면동명 |
| `villHouseTotCnt` | 총 주택 수 |
| `villHouseEmpty` | **빈집 수** |
| `villHouseSlate` | 슬레이트 주택 수 |
| `legalCode` | 법정동코드 |

### Mock Fallback
API 미응답 또는 키 미설정 시 `src/lib/villageApi.ts` 내 `MOCK_VILLAGES` 데이터로 자동 폴백.
UI에 "샘플 데이터" 배지 표시로 사용자에게 상태 안내.

### 구현 파일
- `src/lib/villageApi.ts` — API 호출 로직, 인터페이스 정의, Mock 데이터
- `src/components/features/VacantHousesSection.tsx` — 데이터 표시 Server Component

---

## 3. KOSIS 통계정보 API (고독사 현황)

### 개요
통계청 KOSIS(Korean Statistical Information Service) Open API. 전국 고독사(독거인 사망) 연령별 통계 데이터 제공. SocialDataSection에서 50·60대 비중 강조에 활용.

### 연동 정보
| 항목 | 내용 |
|---|---|
| 제공기관 | 통계청 (KOSIS) |
| End Point | `https://kosis.kr/openapi/Param/statisticsParameterData.do` |
| 데이터포맷 | JSON |
| 환경변수 | `KOSIS_API_KEY` (서버 전용) |
| 캐시 | `revalidate: 86400` (24시간) |
| 상태 | 연동 구현 완료 (키 설정 시 실데이터, 미설정 시 Mock 폴백) |

### 활용 데이터
| 항목 | 설명 |
|---|---|
| `tblId` | DT_117111_A002 (행정안전부 고독사 통계) |
| 표시 | 연령별 고독사 수, 50·60대 비중, AgeBarChart 막대 차트 |

### Mock Fallback
API 미응답 또는 키 미설정 시 `src/lib/kosisApi.ts` 내 `MOCK_RESULT` 데이터로 자동 폴백.
UI에 "샘플" 배지 표시로 사용자에게 상태 안내.

### 구현 파일
- `src/lib/kosisApi.ts` — API 호출 로직, 인터페이스 정의, Mock 데이터
- `src/components/features/SocialDataSection.tsx` — 데이터 표시 Server Component
- `src/components/ui/AgeBarChart.tsx` — 연령별 막대 차트

---

## 4. 향후 연동 예정 API

| API | 제공기관 | 목적 | 상태 |
|---|---|---|---|
| 국토부 빈집정보 | 국토교통부 | 도심 빈집 데이터 추가 | 미신청 |
| 열린재정 | 기획재정부 | Web3 투명성 섹션 실데이터 | 미신청 |

## 5. Related Documents
- **Technical_Specs**: [Development Principles](./00_DEVELOPMENT_PRINCIPLES.md)
- **Technical_Specs**: [Error Handling](./02_ERROR_HANDLING.md) - Chat API 에러 처리 흐름
- **Concept_Design**: [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md)
