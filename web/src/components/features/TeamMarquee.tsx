"use client";

const PLACEHOLDER = (seed: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Ccircle cx='200' cy='200' r='200' fill='%23e2e8f0'/%3E%3Ctext x='200' y='220' text-anchor='middle' font-size='140' font-family='sans-serif' fill='%2394a3b8'%3E${encodeURIComponent(seed)}%3C/text%3E%3C/svg%3E`;

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
    <div className="flex-shrink-0 w-[220px] flex flex-col items-center text-center px-4 py-6 mx-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#1152d4]/20 transition-all">
      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-slate-50">
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

export function TeamMarquee({ members }: { members: Member[] }) {
  if (members.length === 0) {
    return (
      <p className="text-center text-slate-400 text-sm py-8">
        등록된 크루 멤버가 없습니다.
      </p>
    );
  }

  const MIN_VISIBLE = 6;
  const copyCount = Math.ceil((MIN_VISIBLE * 2) / members.length);
  const baseItems = Array.from({ length: copyCount }, () => members).flat();
  const marqueeItems = [...baseItems, ...baseItems];

  return (
    <div
      className="relative w-full"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <div className="flex animate-marquee">
        {marqueeItems.map((member, i) => (
          <TeamCard key={`${member.id}-${i}`} member={member} />
        ))}
      </div>
    </div>
  );
}
