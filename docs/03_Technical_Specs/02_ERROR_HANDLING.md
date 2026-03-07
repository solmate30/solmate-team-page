# 02_ERROR_HANDLING
> Created: 2026-03-07
> Last Updated: 2026-03-07

## 1. 개요
에러 처리 및 사용자 피드백 패턴을 정의합니다. 404, 런타임 에러, API 에러, 폼 피드백을 일관되게 처리합니다.

---

## 2. 404 (Not Found)

### 구현
- **파일**: `src/app/not-found.tsx`
- **동작**: 존재하지 않는 경로 접근 시 자동 렌더링
- **UI**: Solmate 브랜딩 유지, "홈으로" / "AI 챗봇 체험" 링크 제공

### 패턴
- Server Component (기본)
- 사용자 안내 메시지 + 명확한 CTA

---

## 3. 에러 바운더리

### 구현
- **파일**: `src/app/error.tsx`
- **동작**: 해당 세그먼트 내 런타임 에러 발생 시 표시
- **UI**: "다시 시도" 버튼 (`reset`), "홈으로" 링크

### 패턴
- `'use client'` 필수 (error boundary는 클라이언트 컴포넌트)
- `reset()` 호출 시 세그먼트 재렌더 시도
- 개발 환경에서만 `console.error`로 에러 로깅

---

## 4. Toast (Sonner)

### 라이브러리
| 항목 | 내용 |
|---|---|
| 패키지 | `sonner` |
| 설정 위치 | `src/app/layout.tsx` — `<Toaster position="top-center" richColors closeButton />` |

### 사용처
| 위치 | 용도 | 예시 |
|---|---|---|
| Chat API 에러 | API 4xx/5xx 시 사용자 안내 | `toast.error(message)` |
| Contact 폼 | 폼 제출 피드백 (백엔드 미연동) | `toast.info("문의 기능 준비 중입니다.")` |

### API
```ts
import { toast } from "sonner";

toast.success("완료되었습니다.");
toast.error("오류가 발생했습니다.");
toast.info("안내 메시지");
toast.promise(promise, { loading: "...", success: "...", error: "..." });
```

### 원칙
- 일시적 피드백에 사용. 중요한 에러는 에러 바운더리 또는 전용 UI 병행.
- 동일 에러의 과도한 중복 표시 방지.

---

## 5. API 에러 처리

### Chat API (`/api/chat`)

#### 서버 응답
| HTTP | 상황 | 응답 Body |
|---|---|---|
| 503 | API 키 미설정 | `{ error: "AI 서비스 설정이 완료되지 않았습니다." }` |
| 400 | JSON 파싱/스키마 검증 실패 | `{ error: "잘못된 요청 형식입니다." }` 등 |
| 500 | OpenAI 호출 실패 | `{ error: "AI 응답 생성 중 오류가 발생했습니다." }` |

#### 클라이언트 처리 (chat/page.tsx)
1. `res.ok === false` 시 `res.json()` 파싱 시도
2. `data.error` 존재 시 `toast.error(data.error)` 호출
3. 에러 메시지를 채팅 버블에도 표시 (API 메시지 또는 기본 문구)
4. 네트워크 에러 등 기술 메시지는 사용자 친화적 문구로 대체

---

## 6. Related Documents
* **Technical_Specs**: [Development Principles](./00_DEVELOPMENT_PRINCIPLES.md) - 기술 스택, 디렉터리 구조
* **Technical_Specs**: [API Integration](./01_API_INTEGRATION.md) - API 연동 상세
