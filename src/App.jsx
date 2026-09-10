import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import EducationBand from "./components/EducationBand";
import Hero from "./components/Hero";
import ProfileSection from "./components/ProfileSection";
import SectionRail from "./components/SectionRail";
import SiteFooter from "./components/SiteFooter";
import SkillsSection from "./components/SkillsSection";
import SpecBand from "./components/SpecBand";
import TopBar from "./components/TopBar";
import WorksSection from "./components/WorksSection";
import useActiveSection from "./hooks/useActiveSection";

const SECTION_IDS = ["home", "works", "skills", "about", "contact"];

export default function App() {
  const activeId = useActiveSection(SECTION_IDS);

  return (
    <div className="site-shell">
      <a className="u-skip" href="#main">
        跳到主要内容
      </a>

      <TopBar activeId={activeId} />

      <main id="main">
        <Hero />
        <SpecBand />
        <ProfileSection />
        <EducationBand />
        <WorksSection />
        <SkillsSection />
        <AboutSection />
        <ContactSection />
      </main>

      <SectionRail activeId={activeId} />
      <SiteFooter />
    </div>
  );
}
