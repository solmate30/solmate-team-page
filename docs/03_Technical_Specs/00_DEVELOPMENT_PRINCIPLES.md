# 00_DEVELOPMENT_PRINCIPLES
> Created: 2026-03-07 02:46
> Last Updated: 2026-03-07 (문서 검토 반영)

## 1. Tech Stack (기술 스택)
* **Frontend Framework**: Next.js 16 (App Router), React 19
* **Styling**: Tailwind CSS v4 + shadcn/ui 기반 컴포넌트
* **Animation**: Framer Motion — 스크롤 진입 애니메이션(`useInView`), hover 효과, Hero 초기 진입 애니메이션
* **State Management**:
  * 로컬 상태: React `useState`, `useRef`
  * 서버 데이터 패칭/캐싱: Next.js 자체 `fetch` API 및 App Router 캐싱 활용
* **Feedback**: Sonner — Toast (에러, 정보 안내 등)
* **AI Layer**: OpenAI SDK (`openai` npm) — `gpt-4o-mini`, 서버 사이드 스트리밍
* **Public Data**: 공공데이터포털(data.go.kr) — 한국농어촌공사 농촌마을현황 API; KOSIS — 통계청 고독사 연령별 통계
* **Package Manager**: npm
* **Validation & Date**: Zod (스키마/타입 검증, API 요청 검증 필수), Luxon (날짜/시간 필수)

## 2. Directory Structure (폴더 구조)
```
web/src/
├── app/
│   ├── page.tsx                  # 랜딩 페이지
│   ├── layout.tsx                # 전역 레이아웃 + SEO 메타데이터, Toaster
│   ├── globals.css
│   ├── not-found.tsx             # 404 페이지
│   ├── error.tsx                 # 에러 바운더리
│   ├── chat/
│   │   └── page.tsx              # AI 챗봇 페이지 ('use client')
│   └── api/
│       └── chat/
│           └── route.ts          # OpenAI 스트리밍 API Route (서버)
├── components/
│   ├── ui/
│   │   ├── button.tsx            # shadcn/ui
│   │   ├── card.tsx              # shadcn/ui
│   │   ├── AnimatedSection.tsx   # 스크롤 진입 애니메이션 래퍼 ('use client')
│   │   └── AgeBarChart.tsx       # 연령별 막대 차트 (SocialDataSection용)
│   └── features/
│       ├── HeroSection.tsx       # 랜딩 Hero + 고정 네비게이션 ('use client')
│       ├── MissionTechSection.tsx # 미션/기술 소개 ('use client')
│       ├── ImpactSection.tsx     # 공공통계 기반 임팩트 지표 ('use client')
│       ├── ImpactCounters.tsx    # ImpactSection 하위 카운터 컴포넌트
│       ├── SocialDataSection.tsx # KOSIS 고독사 연령별 통계 (Server Component)
│       ├── VacantHousesSection.tsx # 공공API 빈집 현황 (Server Component)
│       ├── ProjectsEcosystemSection.tsx
│       └── TeamContactSection.tsx
└── lib/
    ├── utils.ts
    ├── constants.ts              # 공개 통계 상수 (IMPACT_STATS 등)
    ├── schemas/
    │   └── chat.ts               # Chat API 요청 Zod 스키마
    ├── villageApi.ts             # 농촌마을 공공API 호출 + Mock fallback
    └── kosisApi.ts               # KOSIS 고독사 통계 API 호출 + Mock fallback
```

## 3. Coding Standards & Patterns (코딩 표준)
* **Next.js App Router 패턴**:
  * 기본적으로 Server Component를 우선 사용 (SEO, 성능 병목 최소화).
  * 훅(Hook), 이벤트 리스너(onClick 등), 클라이언트 전용 상태, Framer Motion이 필요한 경우에만 `'use client'` 선언.
* **API Route (서버)**:
  * 외부 API 키(`OPENAI_API_KEY`, `DATA_GO_KR_API_KEY`, `DATA_GO_KR_API_KEY_DECODED`, `KOSIS_API_KEY`)는 서버 사이드에서만 사용.
  * OpenAI 스트리밍은 `ReadableStream`으로 클라이언트에 청크 전달.
  * 공공 API 캐시: 농촌마을 `revalidate: 3600` (1시간), KOSIS `revalidate: 86400` (24시간).
* **Mock Fallback 패턴**:
  * 외부 API 장애 또는 키 미설정 시 `lib/villageApi.ts`, `lib/kosisApi.ts` 내 MOCK 데이터로 자동 폴백.
  * UI에 "샘플 데이터 / 실시간 연동" 배지로 상태 명시.
* **타입스크립트 (TypeScript)**:
  * Strict 모드 유지. `any` 사용 금지. 명확한 인터페이스(`Village`, `Message` 등) 정의.
* **Tailwind CSS 규칙**:
  * 복잡한 커스텀 클래스 대신 Tailwind Utility Class 사용.
  * 디자인 토큰: Primary `#1152d4`, Background `#FAFAFA`, Text `slate-900/600`.
* **에러 처리**:
  * 404: `not-found.tsx`. API 에러: `toast.error()`. 런타임 에러: `error.tsx` 바운더리.
  * 상세: [Error Handling](./02_ERROR_HANDLING.md) 참조.

## 4. Environment & Safety (환경 및 보안)
* `.env.local`은 절대 커밋하지 않는다 (`.gitignore` 필수 점검).
* 현재 사용 중인 환경변수:
  ```
  OPENAI_API_KEY=...              # OpenAI API 키 (서버 전용)
  DATA_GO_KR_API_KEY_DECODED=...  # 공공데이터포털 인증키 1순위 (일반 인코딩, 서버 전용)
  DATA_GO_KR_API_KEY=...          # 공공데이터포털 인증키 2순위 (Encoding 키, 서버 전용)
  KOSIS_API_KEY=...               # KOSIS 통계청 API 키 (서버 전용)
  ```
* `NEXT_PUBLIC_` 접두사는 브라우저 노출이 필요한 변수에만 사용. 현재 해당 없음.
* 외부 API 호출 시 반드시 try/catch + fallback 처리.

## 5. Git & Commit Convention
* `type(scope): subject` 포맷 유지. (예: `feat(chat): AI 챗봇 스트리밍 구현`)
* 설명은 한글로, 변경 사유 및 영향을 최소 3줄 이상 상세히 기록.

## 6. Related Documents
* **Concept_Design**: [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md) - 연관 기능 요구사항
* **Technical_Specs**: [API Integration](./01_API_INTEGRATION.md) - 외부 API 연동 상세
* **Technical_Specs**: [Error Handling](./02_ERROR_HANDLING.md) - 404, 에러 바운더리, Toast 패턴
