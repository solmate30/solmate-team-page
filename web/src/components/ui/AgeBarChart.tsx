"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { AgeData } from "@/lib/kosisApi";

const HIGHLIGHT = ["05", "06"]; // 50대, 60대

export function AgeBarChart({ data }: { data: AgeData[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const max = Math.max(...data.map((d) => d.count));

  return (
    <div ref={ref} className="space-y-3">
      {data.map((item, i) => {
        const isHighlight = HIGHLIGHT.includes(item.ageCode);
        const pct = max > 0 ? (item.count / max) * 100 : 0;

        return (
          <div key={item.ageCode} className="flex items-center gap-3">
            <span
              className={`text-sm w-16 shrink-0 ${
                isHighlight ? "font-bold text-[#1152d4]" : "text-slate-400"
              }`}
            >
              {item.age}
            </span>

            <div className="flex-1 bg-slate-100 rounded-full h-7 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: `${pct}%` } : {}}
                transition={{
                  duration: 0.9,
                  delay: i * 0.07,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className={`h-full rounded-full flex items-center justify-end pr-3 ${
                  isHighlight ? "bg-[#1152d4]" : "bg-slate-300"
                }`}
              >
                {pct > 20 && (
                  <span
                    className={`text-xs font-semibold ${
                      isHighlight ? "text-white" : "text-slate-500"
                    }`}
                  >
                    {item.count.toLocaleString()}
                  </span>
                )}
              </motion.div>
            </div>

            <span
              className={`text-sm font-semibold w-16 text-right shrink-0 ${
                isHighlight ? "text-[#1152d4]" : "text-slate-500"
              }`}
            >
              {pct <= 20 ? item.count.toLocaleString() : ""}
              {pct > 20 ? "" : "명"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
