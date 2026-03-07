"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AlertCircle } from "lucide-react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  highlight?: boolean;
}

function Counter({ target, isInView }: { target: number; isInView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1400;
    const startTime = Date.now();

    function tick() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView, target]);

  return <>{count.toLocaleString()}</>;
}

export function ImpactCounters({
  stats,
  isMock,
}: {
  stats: Stat[];
  isMock: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <>
      <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {stats.map((stat, i) => (
          <AnimatedSection key={i} delay={i * 0.1}>
            <div
              className={`rounded-2xl p-6 md:p-8 text-center border transition-colors ${
                stat.highlight
                  ? "bg-white/20 border-white/30"
                  : "bg-white/10 border-white/10 hover:bg-white/15"
              }`}
            >
              <p className="text-4xl md:text-5xl font-extrabold text-white mb-2 tabular-nums">
                <Counter target={stat.value} isInView={isInView} />
                <span>{stat.suffix}</span>
              </p>
              <p className="text-white font-semibold text-base md:text-lg mb-1">
                {stat.label}
              </p>
              <p className="text-blue-200 text-xs">{stat.sublabel}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {isMock && (
        <p className="flex items-center justify-center gap-1.5 text-xs text-blue-200 mt-6">
          <AlertCircle className="w-3.5 h-3.5" />
          일부 수치는 최신 공공데이터 기반 샘플입니다
        </p>
      )}
    </>
  );
}
