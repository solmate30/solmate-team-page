# Technical Improvements Report
> 작성일: 2026-03-07

## 1. 개요
기술 부채 점검 결과를 반영하여 코드 품질 및 에러 처리를 개선했습니다.

---

## 2. 기술 부채 개선

### 2.1 API 검증 및 안전성
| 항목 | 내용 |
|---|---|
| Chat API Zod 검증 | 요청 body 스키마 검증 (`lib/schemas/chat.ts`) |
| API 키 검증 | 미설정 시 503 반환 |
| Chat 클라이언트 | `res.json()` 파싱 후 에러 메시지 활용 |

### 2.2 데이터 페칭
| 항목 | 내용 |
|---|---|
| KOSIS 중복 제거 | `page.tsx`에서 1회 호출 후 ImpactSection, SocialDataSection에 props 전달 |

### 2.3 의존성
| 항목 | 내용 |
|---|---|
| 추가 | `zod`, `luxon`, `sonner`, `@types/luxon` |
| 제거 | `zustand` (미사용) |

### 2.4 상수 및 문서
| 항목 | 내용 |
|---|---|
| `lib/constants.ts` | IMPACT_STATS 상수 분리 |
| mockData 문서 | Development Principles에서 `lib/villageApi.ts`, `lib/kosisApi.ts` 기반으로 정정 |

### 2.5 UX 및 접근성
| 항목 | 내용 |
|---|---|
| Contact 폼 | `type="submit"`, `onSubmit` 처리, Toast 피드백 |
| Chat handleKeyDown | 타입 캐스팅 제거, `handleSubmit(e?)` 시그니처 개선 |
| 리스트 key | `key={index}` → `key={id}` 또는 고유 식별자 |
| HeroSection 모바일 메뉴 | `aria-expanded`, `aria-controls`, `aria-label`, `nav` 시맨틱 |

### 2.6 API 에러 로깅
| 항목 | 내용 |
|---|---|
| villageApi | catch 시 개발 환경에서 `console.error` |
| kosisApi | catch 시 개발 환경에서 `console.error` |

---

## 3. 에러 처리 및 피드백

### 3.1 신규 파일
| 파일 | 용도 |
|---|---|
| `app/not-found.tsx` | 404 페이지 |
| `app/error.tsx` | 에러 바운더리 |

### 3.2 Toast (Sonner)
| 항목 | 내용 |
|---|---|
| 라이브러리 | `sonner` |
| 위치 | `layout.tsx`에 `<Toaster />` |
| Chat API 에러 | `toast.error(apiMessage)` |
| Contact 폼 | `toast.info("문의 기능 준비 중입니다.")` |

### 3.3 문서
| 파일 | 내용 |
|---|---|
| `03_Technical_Specs/02_ERROR_HANDLING.md` | 에러 처리 패턴 기술 문서 |

---

## 4. Related Documents
* **Technical_Specs**: [Development Principles](../03_Technical_Specs/00_DEVELOPMENT_PRINCIPLES.md)
* **Technical_Specs**: [Error Handling](../03_Technical_Specs/02_ERROR_HANDLING.md)
* **QA_Validation**: [QA Report](../05_QA_Validation/01_QA_REPORT.md)
