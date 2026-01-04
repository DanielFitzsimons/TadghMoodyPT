import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import RecordStrip from "@/components/RecordStrip";
import StandardCards from "@/components/StandardCards";
import HowCoachingWorks from "@/components/HowCoachingWorks";
import FitFilter from "@/components/FitFilter";
import ProofOrbit from "@/components/ProofOrbit";
import ApplyCTA from "@/components/ApplyCTA";

export default function HomePage() {
  return (
    <main className="min-h-screen grain">
      <SiteHeader />
      <Hero />
      <RecordStrip />
      <StandardCards />
      <HowCoachingWorks />
      <FitFilter />
      <ProofOrbit />
      <ApplyCTA />
      <footer className="border-t border-white/10 py-10 text-center text-xs text-white/50">
        © {new Date().getFullYear()} THE STANDARD. Application-only.
      </footer>
    </main>
  );
}
