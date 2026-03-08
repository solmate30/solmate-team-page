# 03_HERO_PARTICLE_SYSTEM
> Created: 2026-03-09 00:00
> Last Updated: 2026-03-09 00:00

## 1. 개요

Hero 섹션 배경에 구현된 인터랙티브 3D 파티클 시스템 명세.
"따뜻한 기술로 사회의 빈칸을 채우다" 타이틀 뒤에 렌더링되며, 마우스 인터랙션에 반응한다.

| 항목 | 내용 |
|---|---|
| 파일 | `web/src/components/features/HouseScene.tsx` |
| 연동 위치 | `web/src/components/features/HeroSection.tsx` |
| 렌더 방식 | Client-only (`dynamic({ ssr: false })`) |
| 레이어 | `absolute inset-0 z-0` — 콘텐츠 섹션은 `z-10` |

---

## 2. 추가 의존성

기존 프로젝트에 아래 패키지를 추가 설치했다.

```bash
npm install @react-three/fiber @react-three/drei three @types/three
```

| 패키지 | 버전 계열 | 역할 |
|---|---|---|
| `three` | ^0.x | WebGL 렌더링 엔진 |
| `@react-three/fiber` | ^8.x | Three.js React 렌더러 (R3F) |
| `@react-three/drei` | ^9.x | R3F 유틸리티 헬퍼 (현재 미사용, 확장 대비 설치) |
| `@types/three` | ^0.x | TypeScript 타입 정의 |

---

## 3. 컴포넌트 구조

```
HouseScene (exported)
├── useEffect — window 레벨 mousemove/mouseleave 리스너
├── containerRef — getBoundingClientRect 기준점
├── mouseNDC (ref) — 마우스 NDC 좌표 [-1, 1]
└── <Canvas> (R3F)
    └── Scene (internal)
        ├── configs (useMemo) — 파티클 초기 설정 N개
        ├── pGeo / pPosBuf / pColBuf — Points 버퍼
        ├── particleTex (useMemo) — 소프트 원형 텍스처
        ├── pMat — PointsMaterial
        ├── cGeo / cPosBuf / cColBuf — 연결선 버퍼
        ├── cMat — LineBasicMaterial (vertexColors)
        ├── curPos (ref) — 현재 프레임 파티클 위치
        ├── offsets (ref) — 반발력 누적 변위
        ├── warmth (ref) — 파티클별 온도 [0, 1]
        └── useFrame — 매 프레임 애니메이션 루프
```

---

## 4. 파티클 설정 (ParticleConfig)

```typescript
interface ParticleConfig {
  basePos: THREE.Vector3  // 기준 위치 (floating의 중심점)
  speed: number           // 유영 속도 계수
  phaseX: number          // X축 sin 위상 오프셋
  phaseY: number          // Y축 cos 위상 오프셋
  phaseZ: number          // Z축 sin 위상 오프셋
}
```

파티클은 `useMemo` 내에서 랜덤 생성되며, 컴포넌트 마운트 시 1회만 초기화된다.

---

## 5. 주요 상수

| 상수 | 값 | 설명 |
|---|---|---|
| `N` | 120 | 파티클 총 개수 |
| `CONN_DIST` | 2.8 | 연결선 생성 거리 (world unit) |
| `MOUSE_DIST` | 3.4 | 마우스 반응 반경 (world unit) |
| `REPULSION_FORCE` | 0.28 | 매 프레임 반발력 강도 |
| `DAMPING` | 0.91 | 반발 offset 감쇠 계수 |
| `MAX_OFFSET` | 4.0 | 최대 이탈 거리 (world unit) |
| `MAX_SEGS` | 700 | 연결선 최대 세그먼트 수 |
| Cold color | `#94a3b8` | 비활성 파티클 색상 (slate-400) |
| Warm color | `#f97316` | 활성 파티클 색상 (orange-500) |

카메라: `position: [0, 0, 14]`, `fov: 55`
파티클 분포: X `±11`, Y `±6.5`, Z `±2.5` (world unit)

---

## 6. useFrame 루프 알고리즘

매 프레임 아래 순서로 실행된다.

### 6-A. 마우스 월드 좌표 변환

```
NDC 좌표 → Raycaster → z=0 평면 교점 → mouseWorld (Vector3)
```

마우스가 화면 밖이면 `mouseWorld = (9999, 9999, 0)` 유지.

### 6-B. Floating 애니메이션

```
floatX = basePos.x + sin(t * speed + phaseX) * 0.6
floatY = basePos.y + cos(t * speed * 0.8 + phaseY) * 0.4
floatZ = basePos.z + sin(t * speed * 0.6 + phaseZ) * 0.25
```

### 6-C. 반발력 (Repulsion)

```
dist = distance(floatPos, mouseWorld)
if dist < MOUSE_DIST and dist > 0.01:
    strength = (1 - dist / MOUSE_DIST) * REPULSION_FORCE
    dir = normalize(floatPos - mouseWorld)
    offset += dir * strength
    if length(offset) > MAX_OFFSET: setLength(offset, MAX_OFFSET)

offset *= DAMPING   // 매 프레임 감쇠 → 자동 복귀
finalPos = floatPos + offset
```

### 6-D. Warmth 계산 및 색상 전환

```
for each particle i:
    nearMouse = dist(curPos[i], mouseWorld) < MOUSE_DIST

    connected = false
    if not nearMouse:
        for each particle j:
            if dist(i, j) < CONN_DIST and warmth[j] > 0.18:
                connected = true; break

    target = nearMouse ? 1.0 : connected ? 0.42 : 0.0
    warmth[i] += (target - warmth[i]) * 0.065   // lerp
    color[i] = lerp(COLD, WARM, warmth[i])
```

Warmth 전파는 1홉/프레임으로 자연스럽게 체인 반응을 구현한다.

### 6-E. 연결선 생성

```
for each pair (i, j), i < j:
    dist = distance(curPos[i], curPos[j])
    if dist < CONN_DIST:
        avgWarmth = (warmth[i] + warmth[j]) / 2
        if avgWarmth > 0.02:
            fade = 1 - dist / CONN_DIST
            lineColor = lerp(COLD, WARM, avgWarmth * fade)
            append segment to connBuffer
```

`setDrawRange(0, seg * 2)`로 미사용 버퍼 렌더링 방지.

---

## 7. 성능 설계

| 항목 | 방법 |
|---|---|
| 파티클 렌더링 | `THREE.Points` 단일 드로우콜 |
| 연결선 렌더링 | `THREE.LineSegments` 단일 드로우콜 |
| 버퍼 재할당 방지 | `Float32Array` + `BufferAttribute` 사전 할당, `needsUpdate = true`만 사용 |
| GC 압박 최소화 | `useFrame` 내 `new THREE.Color/Vector3` 생성 없음, `tmpColor` / `tmpVec` 재사용 |
| 텍스처 생성 | `useMemo` 1회 생성 (Canvas → CanvasTexture) |
| SSR 충돌 방지 | `dynamic({ ssr: false })`로 클라이언트 전용 로드 |

---

## 8. 마우스 이벤트 처리

### 문제

`HouseScene` div(`z-0`)가 배경에 있고, 텍스트 `<section>`이 `z-10`으로 위에 위치해
중앙 콘텐츠 영역에서 마우스 이벤트가 section에 가로채졌다.

### 해결

div의 `onMouseMove` 대신 `window` 레벨 이벤트 리스너로 변경.
좌표 변환 기준은 `containerRef.getBoundingClientRect()`를 유지해 Canvas NDC 계산 정확도를 보존한다.

```typescript
useEffect(() => {
  const onMove = (e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    mouseNDC.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouseNDC.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseleave', () => mouseNDC.current.set(999, 999))
  return () => { /* cleanup */ }
}, [])
```

---

## 9. 확장 포인트

- **3D 모델 통합**: `@react-three/drei`의 `useGLTF`로 `.glb` 집 모델 로드 후 파티클과 병행 렌더링 가능
- **터치 지원**: `touchmove` 이벤트 추가 시 모바일 인터랙션 확장 가능
- **파티클 수 조정**: `N` 상수 변경으로 밀도 조절 (권장 범위: 80–200)
- **물리 엔진 도입**: `@react-three/cannon`으로 파티클 간 충돌 물리 구현 가능

---

## 10. Related Documents

- **Technical_Specs**: [Development Principles](./00_DEVELOPMENT_PRINCIPLES.md) - 전체 기술 스택 및 코딩 원칙
- **Logic_Progress**: [Hero 파티클 인터랙션 의사결정](../04_Logic_Progress/01_HERO_PARTICLE_INTERACTION.md) - 설계 결정 및 이터레이션 기록
- **Concept_Design**: [Product Specs](../01_Concept_Design/03_PRODUCT_SPECS.md) - 랜딩 페이지 기능 요구사항
