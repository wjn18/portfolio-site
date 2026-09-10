import { useCallback, useState } from "react";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Hero from "./components/Hero";
import Preloader from "./components/Preloader";
import SiteFooter from "./components/SiteFooter";
import TopBar from "./components/TopBar";
import WorksSection from "./components/WorksSection";
import useActiveSection from "./hooks/useActiveSection";

const SECTION_IDS = ["home", "works", "about", "contact"];

export default function App() {
  const [ready, setReady] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);
  const handleLoaded = useCallback(() => setReady(true), []);

  return (
    <div className={`site-shell ${ready ? "is-ready" : "is-booting"}`}>
      {!ready && <Preloader onDone={handleLoaded} />}

      <a className="u-skip" href="#main">
        跳到主要内容
      </a>

      <TopBar activeId={activeId} />

      <main id="main">
        <Hero />
        <WorksSection />
        <AboutSection />
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  );
}
