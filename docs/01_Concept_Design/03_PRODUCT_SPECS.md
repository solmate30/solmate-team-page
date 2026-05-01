# 03_PRODUCT_SPECS
> Created: 2026-03-07 02:44
> Last Updated: 2026-03-07 (문서 검토 반영)

## 1. MVP Definition (최소 기능 제품)
Solmate MVP (v1.0)는 핵심 가치인 '투명한 빈집 재생'과 'AI를 통한 정서 케어'의 가능성을 검증하는 데 초점을 맞춥니다.

### Core Features 구현 현황

| 기능 | 상태 | 경로 | 비고 |
|---|:---:|---|---|
| Landing Page | ✅ 완료 | `/` | Hero, Mission, Impact, SocialData, 빈집현황, Projects, Team/Contact (총 7개 섹션) |
| AI Companion Chatbot | ✅ 완료 | `/chat` | OpenAI gpt-4o-mini, 스트리밍, 빠른 시작 칩 |
| Empty House Projects Showcase | ✅ 완료 | `/` (VacantHousesSection) | 공공API 실데이터 연동 + Mock fallback |
| Web3 Transparency Tracking | 🔲 예정 | `/` (향후 섹션) | Mock UI 또는 블록체인 연동 |

### 세부 구현 내역

#### 1. Landing Page (`/`)
- **HeroSection**: 고정 네비게이션(스크롤 시 backdrop-blur), Hero 텍스트 진입 애니메이션, 모바일 드로어 메뉴
- **MissionTechSection**: 스크롤 진입 fadeInUp + 카드 stagger 애니메이션, hover 시 카드 상승 효과
- **ImpactSection**: 공공통계 기반 숫자 4개 (13만+ 빈집 / 200만+ 독거노인 / 24/7 / 100%), 카운터 애니메이션
- **SocialDataSection**: KOSIS 고독사 연령별 통계, 50·60대 비중 강조, AgeBarChart 막대 차트, Server Component
- **VacantHousesSection**: 한국농어촌공사 공공API 실연동, 빈집률 색상 경보 시스템, Server Component
- **ProjectsEcosystemSection**: 프로젝트 카드 2종, 에코시스템 로고
- **TeamContactSection**: 팀 소개, 파트너 문의 폼, 푸터

#### 2. AI Companion Chatbot (`/chat`)
- OpenAI `gpt-4o-mini` 스트리밍 응답
- '솔이' 페르소나: 따뜻하고 공감하는 AI 동반자
- 빠른 시작 프롬프트 칩 (첫 메시지 전 표시)
- 타이핑 인디케이터 (점 3개 바운스 애니메이션)
- Enter 전송 / Shift+Enter 줄바꿈
- 자동 스크롤, textarea 자동 높이 조절

#### 3. VacantHousesSection (실데이터 연동)
- 공공데이터포털 승인 API 연동 (한국농어촌공사)
- 빈집 수, 총 가구 수, 빈집률 계산 및 시각화
- API 실패 시 Mock 데이터 자동 폴백
- 1시간 캐시 (`revalidate: 3600`)

## 2. Platform & Distribution Strategy
* **Output Format**: 반응형 웹 (Responsive Web). 데스크탑, 태블릿, 모바일 완전 대응.
* **Hosting**: Vercel 배포 예정 (Next.js App Router 최적화)
* **AI Chat Entry Point**: 랜딩 Hero CTA 버튼 및 네비게이션 "AI Chat" 버튼 → `/chat` 라우팅

## 3. Tech Stack Requirements (엔지니어링 전략)
* **Frontend**: Next.js 16 + React 19 + Tailwind CSS v4 + Framer Motion
* **AI Layer**: OpenAI API (`gpt-4o-mini`, 서버 사이드 스트리밍)
* **Public Data**: 공공데이터포털 REST API (한국농어촌공사 등)
* **Web3 Layer**: 블록체인 솔루션 — 향후 연동 예정
* **Backend/DB**: 초기 MVP는 외부 API + 서버 컴포넌트로 대체. 추후 SQLite/Turso 도입 검토.

## 4. UX & Performance Goals
* **스트리밍 응답**: AI 챗봇 타이핑 느낌 구현 (chunk-by-chunk 렌더링)
* **접근성**: 고령자 대비 넉넉한 여백, 직관적 UI, 큰 폰트
* **SEO**: `layout.tsx`에 title, description, keywords, OpenGraph 설정 완료
* **캐싱**: 공공API 응답 캐시 (농촌마을 1시간, KOSIS 24시간)로 불필요한 API 호출 최소화

## 5. Related Documents
- **Concept_Design**: [Vision Core](./01_VISION_CORE.md) - 전체 프로젝트 비전 및 타겟
- **Technical_Specs**: [Development Principles](../03_Technical_Specs/00_DEVELOPMENT_PRINCIPLES.md) - 기술 표준
- **Technical_Specs**: [API Integration](../03_Technical_Specs/01_API_INTEGRATION.md) - 외부 API 연동 상세
- **QA_Validation**: [QA Report](../05_QA_Validation/01_QA_REPORT.md) - 테스트 결과
