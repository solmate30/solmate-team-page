"use client";

import { useState, FormEvent } from "react";
import { DateTime } from "luxon";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function TeamContactSection() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "pending">("idle");
  const team = [
        {
            name: "Nam Hyeongseog",
            role: "AI / Tech Lead",
            avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Ccircle cx='200' cy='200' r='200' fill='%23e2e8f0'/%3E%3Cpath d='M200,100c-33.1,0-60,26.9-60,60s26.9,60,60,60s60-26.9,60-60S233.1,100,200,100z M200,250c-66.3,0-120,53.7-120,120h240C320,303.7,266.3,250,200,250z' fill='%2394a3b8'/%3E%3C/svg%3E",
        },
        {
            name: "Solmate Member",
            role: "Web3 / Blockchain Developer",
            avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Ccircle cx='200' cy='200' r='200' fill='%23e2e8f0'/%3E%3Cpath d='M200,100c-33.1,0-60,26.9-60,60s26.9,60,60,60s60-26.9,60-60S233.1,100,200,100z M200,250c-66.3,0-120,53.7-120,120h240C320,303.7,266.3,250,200,250z' fill='%2394a3b8'/%3E%3C/svg%3E",
        },
        {
            name: "Solmate Member",
            role: "Product Designer / Manager",
            avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Ccircle cx='200' cy='200' r='200' fill='%23e2e8f0'/%3E%3Cpath d='M200,100c-33.1,0-60,26.9-60,60s26.9,60,60,60s60-26.9,60-60S233.1,100,200,100z M200,250c-66.3,0-120,53.7-120,120h240C320,303.7,266.3,250,200,250z' fill='%2394a3b8'/%3E%3C/svg%3E",
        }
    ];

    return (
        <>
            <div id="team" className="bg-white py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                    <h3 className="text-sm font-semibold text-[#1152d4] tracking-wider uppercase mb-3">Meet The Team</h3>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16">빈칸을 채우는 사람들</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        {team.map((member) => (
                            <div key={`${member.name}-${member.role}`} className="flex flex-col items-center group">
                                <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-full overflow-hidden mb-6 border-4 border-slate-50 group-hover:border-[#1152d4]/10 transition-colors">
                                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h4>
                                <p className="text-sm font-medium text-[#1152d4] uppercase tracking-wide">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div id="contact" className="bg-slate-900 py-24 md:py-32 text-white">
                <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">함께 임팩트를 만들어갈 파트너를 찾습니다</h2>
                    <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
                        단순한 후원이나 일회성 협력을 넘어, 사회적 문제를 지속 가능하게 해결할 지자체 및 기업 파트너의 연락을 기다립니다.
                    </p>

                    <div className="bg-slate-800 p-8 md:p-12 rounded-3xl text-left border border-slate-700/50 relative overflow-hidden">
                        {/* Subtle glow effect */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#1152d4]/10 blur-3xl mix-blend-screen pointer-events-none"></div>

                        <form
                          className="flex flex-col gap-6 relative z-10"
                          onSubmit={(e: FormEvent) => {
                            e.preventDefault();
                            setSubmitStatus("pending");
                            toast.info("문의 기능 준비 중입니다. 곧 연동될 예정입니다.");
                          }}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-slate-300">이름 / 소속 기관</label>
                                    <input type="text" id="name" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-[#1152d4] focus:ring-1 focus:ring-[#1152d4] transition-all" placeholder="홍길동 (OO시청 복지과)" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-slate-300">회신 이메일</label>
                                    <input type="email" id="email" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-[#1152d4] focus:ring-1 focus:ring-[#1152d4] transition-all" placeholder="hello@solmate.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-slate-300">논의 안건</label>
                                <textarea id="message" rows={4} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-[#1152d4] focus:ring-1 focus:ring-[#1152d4] transition-all resize-none" placeholder="협업이나 도입 관련 문의 내용을 적어주세요."></textarea>
                            </div>
                            <Button type="submit" disabled={submitStatus === "pending"} className="w-full sm:w-auto self-start mt-2 px-8 py-3 bg-[#1152d4] hover:bg-blue-600 text-white rounded-xl text-base disabled:opacity-70">
                                {submitStatus === "pending" ? "연결 준비 중" : "메시지 보내기"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            <footer className="bg-slate-950 py-12 text-center text-slate-500 text-sm">
                <p>© {DateTime.now().year} Solmate. All rights reserved.</p>
            </footer>
        </>
    );
}
