import { db } from "@/db";
import { crewMembers } from "@/db/schema";
import { asc } from "drizzle-orm";
import { TeamMarquee } from "./TeamMarquee";
import { ContactForm } from "./ContactForm";
import { DateTime } from "luxon";

export async function TeamContactSection() {
  const members = await db
    .select()
    .from(crewMembers)
    .orderBy(asc(crewMembers.sortOrder), asc(crewMembers.createdAt));

  return (
    <>
      <div id="team" className="bg-[#FAFAFA] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-14">
          <h3 className="text-sm font-semibold text-[#1152d4] tracking-wider uppercase mb-3">
            Solmate Crew
          </h3>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            빈칸을 채우는 사람들
          </h2>
        </div>

        <TeamMarquee members={members} />
      </div>

      <ContactForm />

      <footer className="bg-slate-950 py-12 text-center text-slate-500 text-sm">
        <p>© {DateTime.now().year} Solmate. All rights reserved.</p>
      </footer>
    </>
  );
}
