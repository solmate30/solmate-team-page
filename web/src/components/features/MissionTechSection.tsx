"use client";

import { BrainCircuit, Link2, Code2 } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const technologies = [
  {
    icon: <BrainCircuit className="h-8 w-8 text-[#1152d4]" />,
    title: "Emotional AI",
    description:
      "물리적 한계를 넘어 공감과 온기를 전하는 24/7 AI 반려 챗봇으로 정서적 고립을 해소합니다.",
  },
  {
    icon: <Link2 className="h-8 w-8 text-[#1152d4]" />,
    title: "Web3 & Blockchain",
    description:
      "블록체인 네트워크를 통해 프로젝트 자금 흐름과 사회적 임팩트를 투명하게 증명합니다.",
  },
  {
    icon: <Code2 className="h-8 w-8 text-[#1152d4]" />,
    title: "Scalable Engineering",
    description:
      "모던 스택(Next.js, React)을 기반으로 누구나 쉽게 접근할 수 있는 빠르고 안정적인 소프트웨어를 구축합니다.",
  },
];

export function MissionTechSection() {
  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-60px" });

  return (
    <div className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Our Mission */}
        <AnimatedSection id="mission" className="max-w-3xl mx-auto text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-8">
            우리의 비전은 연결에 있습니다
          </h2>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-normal">
            현대 사회의 가장 큰 문제는 &apos;단절&apos;입니다.<br className="hidden md:block" />
            버려진 빈집이라는 <strong>공간의 단절</strong>, 외롭게 살아가는 독거인이라는{" "}
            <strong>관계의 단절</strong>.<br />
            Solmate는 기술이 이 끊어진 선들을 다시 이을 수 있다고 믿습니다.
          </p>
        </AnimatedSection>

        {/* Core Tech */}
        <div id="tech" className="pt-12">
          <AnimatedSection className="text-center mb-16">
            <h3 className="text-sm font-semibold text-[#1152d4] tracking-wider uppercase mb-3">
              Core Expertise
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              문제 해결을 위한 3가지 기술
            </h2>
          </AnimatedSection>

          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 32 }}
                animate={cardsInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: index * 0.12,
                }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-[#FAFAFA] border border-slate-100 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow cursor-default"
              >
                <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm inline-block">
                  {tech.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-4">{tech.title}</h4>
                <p className="text-slate-600 leading-relaxed">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
