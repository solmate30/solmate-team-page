"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PLACEHOLDER = (seed: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Ccircle cx='200' cy='200' r='200' fill='%23e2e8f0'/%3E%3Ctext x='200' y='220' text-anchor='middle' font-size='140' font-family='sans-serif' fill='%2394a3b8'%3E${encodeURIComponent(seed)}%3C/text%3E%3C/svg%3E`;

const SLIDE_INTERVAL_MS = 3500;
const TRANSITION_MS = 500;

type Member = {
  id: string;
  nickname: string;
  name: string;
  career1: string;
  career2: string;
  photoUrl: string;
};

function TeamCard({ member }: { member: Member }) {
  const photo = member.photoUrl || PLACEHOLDER(member.nickname.charAt(0).toUpperCase());

  return (
    <div className="flex flex-col items-center text-center px-4 py-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#1152d4]/20 transition-all h-full">
      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-slate-50 shrink-0">
        <img src={photo} alt={member.name} className="w-full h-full object-cover" />
      </div>
      <p className="text-[10px] font-bold text-[#1152d4] uppercase tracking-[0.2em] mb-1">
        {member.nickname}
      </p>
      <h4 className="text-sm font-bold text-slate-900 mb-3 leading-tight">
        {member.name}
      </h4>
      <div className="w-8 h-px bg-slate-200 mb-3" />
      <ul className="space-y-1.5">
        <li className="text-xs text-slate-500 leading-snug">{member.career1}</li>
        <li className="text-xs text-slate-500 leading-snug">{member.career2}</li>
      </ul>
    </div>
  );
}

function useCardsPerSlide() {
  const [count, setCount] = useState(4);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 640) setCount(1);
      else if (w < 900) setCount(2);
      else if (w < 1200) setCount(3);
      else setCount(4);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

export function TeamMarquee({ members }: { members: Member[] }) {
  const perSlide = useCardsPerSlide();
  const totalPages = Math.max(1, Math.ceil(members.length / perSlide));

  // 원형 인덱싱으로 모든 페이지를 perSlide 개수로 꽉 채움
  const pages = Array.from({ length: totalPages }, (_, i) =>
    Array.from({ length: perSlide }, (_, j) => members[(i * perSlide + j) % members.length])
  );

  // [clone of last] [real 0] [real 1] ... [real N-1] [clone of first]
  // index 0 = clone of last → 전환 후 index=totalPages 로 무음 점프
  // index totalPages+1 = clone of first → 전환 후 index=1 로 무음 점프
  const slides = [pages[totalPages - 1], ...pages, pages[0]];

  const [index, setIndex] = useState(1);
  const [animated, setAnimated] = useState(true);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 무한 루프: 클론 슬라이드 도착 후 실제 위치로 무음 점프
  useEffect(() => {
    if (index !== 0 && index !== totalPages + 1) return;
    const snapTo = index === 0 ? totalPages : 1;
    const t = setTimeout(() => {
      setAnimated(false);
      setIndex(snapTo);
    }, TRANSITION_MS);
    return () => clearTimeout(t);
  }, [index, totalPages]);

  // animated=false 적용 후 다음 렌더에서 다시 켜기
  useEffect(() => {
    if (animated) return;
    const t = setTimeout(() => setAnimated(true), 20);
    return () => clearTimeout(t);
  }, [animated]);

  // perSlide 변경 시 인덱스 리셋
  useEffect(() => {
    setAnimated(false);
    setIndex(1);
  }, [perSlide]);

  const goTo = useCallback((next: number) => {
    setAnimated(true);
    setIndex(next);
  }, []);

  // 자동 슬라이드
  useEffect(() => {
    if (paused || totalPages <= 1) return;
    timerRef.current = setTimeout(() => goTo(index + 1), SLIDE_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, paused, totalPages, goTo]);

  // 현재 실제 페이지 (0-based, dot 표시용)
  const realPage =
    index === 0 ? totalPages - 1 : index === totalPages + 1 ? 0 : index - 1;

  if (members.length === 0) {
    return (
      <p className="text-center text-slate-400 text-sm py-8">
        등록된 크루 멤버가 없습니다.
      </p>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-6 md:px-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative">
        {/* 화살표 */}
        {totalPages > 1 && (
          <>
            <button
              onClick={() => goTo(index - 1)}
              className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 hover:border-[#1152d4]/30 transition-all"
              aria-label="이전"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button
              onClick={() => goTo(index + 1)}
              className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 hover:border-[#1152d4]/30 transition-all"
              aria-label="다음"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </>
        )}

        {/* 슬라이드 트랙 */}
        <div className="overflow-hidden">
          <div
            className="flex"
            style={{
              transform: `translateX(-${index * 100}%)`,
              transition: animated ? `transform ${TRANSITION_MS}ms ease-in-out` : "none",
            }}
          >
            {slides.map((pageItems, slideIdx) => (
              <div
                key={slideIdx}
                className="shrink-0 w-full grid gap-4"
                style={{ gridTemplateColumns: `repeat(${perSlide}, minmax(0, 1fr))` }}
              >
                {pageItems.map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 닷 인디케이터 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i + 1)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === realPage
                  ? "bg-[#1152d4] w-5"
                  : "bg-slate-300 hover:bg-slate-400 w-2"
              }`}
              aria-label={`${i + 1}번째 슬라이드`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
