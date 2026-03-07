import Image from "next/image";
import { Button } from "@/components/ui/button";

export function ProjectsEcosystemSection() {
    const projects = [
        {
            title: "AI Companion Chatbot",
            category: "Social Care",
            description: "고립감을 느끼는 독거인들을 위해 자연스럽고 공감하는 대화 기반의 24시간 정서 케어 시스템입니다.",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f1f5f9'/%3E%3Cpath d='M400,200c-88.4,0-160,71.6-160,160c0,88.4,71.6,160,160,160s160-71.6,160-160C560,271.6,488.4,200,400,200z M350,330c-16.6,0-30-13.4-30-30s13.4-30,30-30s30,13.4,30,30S366.6,330,350,330z M450,330c-16.6,0-30-13.4-30-30s13.4-30,30-30s30,13.4,30,30S466.6,330,450,330z M400,430c-38.7,0-70-31.3-70-70h140C470,398.7,438.7,430,400,430z' fill='%2394a3b8'/%3E%3C/svg%3E",
            link: "/chat"
        },
        {
            title: "Web3 Empty House Regen",
            category: "Space Regeneration",
            description: "빈집 리모델링과 청년 주거 매칭 과정의 자금 조달 및 집행 내역을 투명하게 공개하는 블록체인 플랫폼입니다.",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f8fafc'/%3E%3Cpath d='M400,150l-200,150h50v200h300V300h50L400,150z M350,450v-100h100v100H350z' fill='%2394a3b8'/%3E%3C/svg%3E",
            link: "#"
        }
    ];

    const ecosystemLogos = [
        { name: "OpenAI", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='40' viewBox='0 0 100 40'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='bold' fill='%2364748b'%3EOpenAI%3C/text%3E%3C/svg%3E" },
        { name: "Creditcoin", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='40' viewBox='0 0 100 40'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='bold' fill='%2364748b'%3ECreditcoin%3C/text%3E%3C/svg%3E" },
        { name: "BondBase", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='40' viewBox='0 0 100 40'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='bold' fill='%2364748b'%3EBondBase%3C/text%3E%3C/svg%3E" },
        { name: "Next.js", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='40' viewBox='0 0 100 40'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='bold' fill='%2364748b'%3ENext.js%3C/text%3E%3C/svg%3E" },
        { name: "React", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='40' viewBox='0 0 100 40'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='bold' fill='%2364748b'%3EReact%3C/text%3E%3C/svg%3E" }
    ];

    return (
        <>
            <div id="projects" className="bg-[#FAFAFA] py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-[#1152d4] tracking-wider uppercase mb-3">Key Projects</h3>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">도전과 해결의 기록</h2>
                        </div>
                        <p className="text-slate-600 max-w-lg md:text-right">
                            실질적인 가치를 창출하기 위해 기획되고 운영 중인 솔루션들입니다.
                        </p>
                    </div>

                    {/* Project Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {projects.map((project) => (
                            <div key={project.title} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full">
                                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-100">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-8 sm:p-10 flex flex-col grow">
                                    <span className="text-sm font-semibold text-[#1152d4] tracking-wider uppercase mb-3">{project.category}</span>
                                    <h4 className="text-2xl font-bold text-slate-900 mb-4">{project.title}</h4>
                                    <p className="text-slate-600 leading-relaxed mb-8 grow">{project.description}</p>
                                    <a href={project.link} className="w-fit">
                                        <Button variant="outline" className="w-full border-slate-300 rounded-full hover:bg-slate-50 text-slate-700">
                                            상세 보기
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ecosystem Section */}
            <div id="ecosystem" className="bg-white py-20 border-y border-slate-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-10">Powered by Modern Ecosystem</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
                        {ecosystemLogos.map((logo) => (
                            <div key={logo.name} className="relative h-10 w-28 md:w-36 grayscale hover:grayscale-0 transition-all duration-300">
                                <Image
                                    src={logo.logo}
                                    alt={logo.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
