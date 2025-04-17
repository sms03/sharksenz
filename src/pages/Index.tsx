
import { FadeInStagger } from "@/components/ui/motion";
import MainLayout from "@/layouts/MainLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedModulesSection } from "@/components/home/FeaturedModulesSection";
import { DashboardWidgetsSection } from "@/components/home/DashboardWidgetsSection";
import { PitchSimulatorBanner } from "@/components/home/PitchSimulatorBanner";
import { FooterLinksSection } from "@/components/home/FooterLinksSection";

export default function Index() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl">
        <FadeInStagger>
          <HeroSection />
          <FeaturedModulesSection />
          <DashboardWidgetsSection />
          <PitchSimulatorBanner />
          <FooterLinksSection />
        </FadeInStagger>
      </div>
    </MainLayout>
  );
}
