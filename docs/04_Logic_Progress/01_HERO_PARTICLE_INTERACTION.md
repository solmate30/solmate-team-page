# 01_HERO_PARTICLE_INTERACTION
> Created: 2026-03-09 00:00
> Last Updated: 2026-03-09 00:00

## 1. 배경 및 목적

### 왜 만들었는가

Solmate 랜딩 페이지 Hero 섹션의 타이틀 "따뜻한 기술로 사회의 빈칸을 채우다"가 정적 텍스트로만 존재해 방문자에게 플랫폼의 감성과 미션을 즉각적으로 전달하지 못했다.

3D 인터랙티브 배경을 도입해 다음 두 가지를 시각 언어로 표현하는 것이 목표였다.

| 미션 | 시각 표현 |
|---|---|
| 빈집 재생 (유휴 공간 활성화) | 차갑게 흩어진 파티클이 연결되며 따뜻해지는 과정 |
| 독거인 고립 해소 (연결) | 마우스 근접 시 파티클 간 연결선 생성, 온기 전파 |

---

## 2. 이터레이션 기록

### Iteration 1 — 집 와이어프레임 (폐기)

**시도**: React Three Fiber로 BoxGeometry + ConeGeometry 조합의 집 모양 와이어프레임 15개를 공중에 부유시킴. EdgesGeometry로 깔끔한 선 렌더링 적용.

**결과**: 집 형태가 시각적으로 조악하게 보임. 제네릭 3D 도형 수준에 그쳐 Solmate의 감성과 맞지 않는다는 판단.

**결정**: 집 와이어프레임 전면 폐기. 추후 직접 제작한 고품질 `.glb` 모델이 준비되면 파티클 위에 레이어로 추가하는 방식으로 재검토.

---

### Iteration 2 — 파티클 시스템 도입 (채택)

**시도**: 집 지오메트리 대신 `THREE.Points` 기반 파티클 120개로 교체. 소프트 원형 텍스처 적용.

**채택 이유**:
- 추상적 입자 → "흩어진 개인/공간" 메타포로 더 적합
- 연결선 생성 시 "고립 → 연결"의 내러티브가 자연스럽게 구현됨
- 성능상 유리 (단일 드로우콜)
- 향후 집 모델과 병행 렌더링 가능한 구조 유지

---

### Iteration 3 — 마우스 인터랙션 방향 결정

**검토한 옵션**:

| 옵션 | 효과 | 기각 이유 |
|---|---|---|
| 모이는 방향 | 커서가 파티클을 흡수하는 느낌 | 마우스 이동 시 파티클이 한곳에 집중되어 화면 공백 발생. "빨아들이는" 이미지가 플랫폼 메시지와 반대 |
| 흩어지는 방향 | 커서가 온기를 내뿜는 느낌 | 채택 |

**채택 이유**:
- "기술이 온기를 퍼뜨린다"는 Solmate 메시지와 시각적으로 일치
- 커서가 지나간 자리에 따뜻한 파티클이 남아 여운을 줌
- 마우스를 빠르게 움직일수록 더 역동적인 시각 효과 생성

---

### Iteration 4 — 반발력 튜닝

초기 파라미터(`REPULSION_FORCE: 0.11`)가 너무 약해 인터랙션이 체감되지 않았다.

| 파라미터 | 초기값 | 최종값 | 변경 이유 |
|---|---|---|---|
| `REPULSION_FORCE` | 0.11 | 0.28 | 체감 반발이 너무 미약 |
| `DAMPING` | 0.88 | 0.91 | 밀려난 상태를 더 오래 유지해 인터랙션 잔상 강화 |
| `MAX_OFFSET` | 2.2 | 4.0 | 강해진 반발력에 맞춰 이탈 한계 확장 |

---

### Iteration 5 — 마우스 이벤트 버그 수정

**발견된 문제**: 화면 가장자리에서는 반발이 정상 작동하지만, 중앙 텍스트 영역에서는 작동하지 않음.

**원인 분석**:

```
z-stack:
  [HouseScene div — z-0]  ← onMouseMove 등록 위치
  [section 텍스트  — z-10] ← 마우스 이벤트 가로챔
```

`z-10`으로 올라온 `<section>` DOM 요소가 중앙 영역의 마우스 이벤트를 소비해 HouseScene div의 `onMouseMove`가 발동되지 않는 구조적 문제.

**해결**:
`div`의 React `onMouseMove` 핸들러를 제거하고 `useEffect` 내 `window.addEventListener('mousemove')`로 대체. `window` 레벨 리스너는 어떤 DOM 요소가 위에 있든 항상 이벤트를 수신한다.

좌표 변환 기준(`getBoundingClientRect`)은 `containerRef`를 유지해 NDC 계산 정확도를 보존.

---

## 3. 현재 동작 요약

```
파티클 기본 상태
  → sin/cos 기반 부드러운 유영 (각 파티클 고유 속도 및 위상)

마우스 반경(3.4 unit) 진입 시
  → 반발력 적용 (REPULSION_FORCE = 0.28, 거리 비례)
  → warmth 1.0으로 수렴 → 색상 #94a3b8 → #f97316 전환
  → 인접 파티클(2.8 unit 내)에 warmth 0.42 전파 (체인 반응)
  → 따뜻한 파티클 쌍 사이에 연결선 생성 (거리 반비례 opacity)

마우스 이탈 시
  → offset * 0.91 감쇠로 자연 복귀
  → warmth 0으로 수렴 → 색상 냉각
  → 연결선 소멸
```

---

## 4. 미결 과제 및 다음 스텝

| 항목 | 우선순위 | 내용 |
|---|---|---|
| 집 3D 모델 통합 | Medium | 직접 제작한 `.glb` 파일 준비 후 `useGLTF`로 로드, 파티클 위에 레이어 추가 |
| 모바일 터치 지원 | Low | `touchmove` 이벤트 추가 |
| 스크롤 전환 효과 | Low | 스크롤 시 파티클이 분산되는 연출 (Framer Motion scroll progress 연동) |
| 성능 프로파일링 | Low | 저사양 디바이스 N값 동적 조정 (예: 모바일 N=60) |

---

## 5. Related Documents

- **Technical_Specs**: [Hero Particle System](../03_Technical_Specs/03_HERO_PARTICLE_SYSTEM.md) - 구현 상세 명세 (파라미터, 알고리즘, 버퍼 구조)
- **Technical_Specs**: [Development Principles](../03_Technical_Specs/00_DEVELOPMENT_PRINCIPLES.md) - Three.js/R3F 스택 추가 내역
- **Concept_Design**: [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md) - 랜딩 페이지 기능 요구사항
- **Concept_Design**: [Vision Core](../01_Concept_Design/01_VISION_CORE.md) - 빈집 재생 및 독거인 케어 미션
