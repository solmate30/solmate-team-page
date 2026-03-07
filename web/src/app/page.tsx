import { HeroSection } from "@/components/features/HeroSection";
import { MissionTechSection } from "@/components/features/MissionTechSection";
import { ImpactSection } from "@/components/features/ImpactSection";
import { SocialDataSection } from "@/components/features/SocialDataSection";
import { VacantHousesSection } from "@/components/features/VacantHousesSection";
import { ProjectsEcosystemSection } from "@/components/features/ProjectsEcosystemSection";
import { TeamContactSection } from "@/components/features/TeamContactSection";
import { fetchKosisData } from "@/lib/kosisApi";

export default async function Home() {
  const kosisData = await fetchKosisData();

  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <MissionTechSection />
      <ImpactSection kosisData={kosisData} />
      <SocialDataSection kosisData={kosisData} />
      <VacantHousesSection />
      <ProjectsEcosystemSection />
      <TeamContactSection />
    </main>
  );
}
