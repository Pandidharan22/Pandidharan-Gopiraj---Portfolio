import { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import AppScene from './components/Scene';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ContactSection } from './components/ContactSection';

type LayoutTier = 'normal' | 'compact' | 'dense' | 'micro';
type NavigationRequest = {
  sectionIndex: number;
  requestId: number;
};

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeSection, setActiveSection] = useState(0);
  const [navigationRequest, setNavigationRequest] = useState<NavigationRequest | null>(null);
  const [sectionScale, setSectionScale] = useState(1);
  const [layoutTier, setLayoutTier] = useState<LayoutTier>('normal');
  const sectionShellRef = useRef<HTMLDivElement>(null);
  const sectionInnerRef = useRef<HTMLDivElement>(null);
  const navigationRequestId = useRef(0);

  const sectionTopGap = layoutTier === 'micro' ? 56 : layoutTier === 'dense' ? 62 : layoutTier === 'compact' ? 68 : 74;

  useEffect(() => {
    // Restore dark mode functionality
    document.documentElement.classList.add('dark');
    // Prevent the body itself from scrolling the page
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navigateToSection = useCallback((sectionIndex: number) => {
    const clampedSection = Math.max(0, Math.min(4, sectionIndex));
    navigationRequestId.current += 1;
    setNavigationRequest({
      sectionIndex: clampedSection,
      requestId: navigationRequestId.current,
    });
  }, []);

  const measureSectionScale = useCallback(() => {
    if (activeSection === 0) {
      setSectionScale(1);
      setLayoutTier('normal');
      return;
    }

    const shell = sectionShellRef.current;
    const inner = sectionInnerRef.current;
    if (!shell || !inner) {
      return;
    }

    const sectionEl = inner.querySelector('section') as HTMLElement | null;

    const availableHeight = shell.clientHeight;
    const availableWidth = shell.clientWidth;
    const contentHeight = sectionEl?.scrollHeight ?? inner.scrollHeight;
    const contentWidth = sectionEl?.scrollWidth ?? inner.scrollWidth;

    let nextTier: LayoutTier = 'normal';
    if (availableHeight < 540 || (availableWidth < 430 && availableHeight < 900)) {
      nextTier = 'micro';
    } else if (availableHeight < 680 || availableWidth < 520) {
      nextTier = 'dense';
    } else if (availableHeight < 860 || availableWidth < 760) {
      nextTier = 'compact';
    }
    setLayoutTier(nextTier);

    const scaleY = Math.max(1, availableHeight - sectionTopGap) / Math.max(1, contentHeight);
    const scaleX = availableWidth / Math.max(1, contentWidth);
    const nextScale = Math.min(1, scaleX, scaleY) * 0.995;

    // Always fit (no clipping), while layout tiers keep text as readable as possible.
    setSectionScale(Math.max(0.2, Math.min(1, nextScale)));
  }, [activeSection, sectionTopGap]);

  useEffect(() => {
    const raf = requestAnimationFrame(measureSectionScale);
    window.addEventListener('resize', measureSectionScale);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measureSectionScale);
    };
  }, [measureSectionScale]);

  const renderSectionOverlay = () => {
    const sectionKey =
      activeSection === 1
        ? 'about'
        : activeSection === 2
          ? 'projects'
          : activeSection === 3
            ? 'skills'
            : 'contact';
    const sectionShellClasses = `w-screen h-screen overflow-hidden bg-transparent px-4 sm:px-6 md:px-8 pointer-events-auto section-fit-shell section-${sectionKey} layout-${layoutTier}`;
    const sectionShellStyle = { paddingTop: `${sectionTopGap}px` };

    if (activeSection === 0) {
      return (
        <div className="w-screen h-screen overflow-hidden bg-transparent px-4 sm:px-6 md:px-8 flex items-center justify-center pointer-events-auto">
          <HeroSection onNavigate={navigateToSection} />
        </div>
      );
    }

    if (activeSection === 1) {
      return (
        <div ref={sectionShellRef} className={sectionShellClasses} style={sectionShellStyle}>
          <div ref={sectionInnerRef} className="section-fit-inner" style={{ transform: `scale(${sectionScale})` }}>
            <AboutSection />
          </div>
        </div>
      );
    }

    if (activeSection === 2) {
      return (
        <div ref={sectionShellRef} className={sectionShellClasses} style={sectionShellStyle}>
          <div ref={sectionInnerRef} className="section-fit-inner" style={{ transform: `scale(${sectionScale})` }}>
            <ProjectsSection />
          </div>
        </div>
      );
    }

    if (activeSection === 3) {
      return (
        <div ref={sectionShellRef} className={sectionShellClasses} style={sectionShellStyle}>
          <div ref={sectionInnerRef} className="section-fit-inner" style={{ transform: `scale(${sectionScale})` }}>
            <SkillsSection />
          </div>
        </div>
      );
    }

    return (
      <div ref={sectionShellRef} className={sectionShellClasses} style={sectionShellStyle}>
        <div ref={sectionInnerRef} className="section-fit-inner" style={{ transform: `scale(${sectionScale})` }}>
          <ContactSection />
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background text-foreground transition-colors duration-500 ease-in-out">
      {/* Restore the original Top Navigation UI */}
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-auto">
        <Navigation theme={theme} onThemeToggle={toggleTheme} onNavigate={navigateToSection} />
      </div>
      
      {/* 3D Scene handles all sections now */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
          <AppScene onActiveSectionChange={setActiveSection} navigationRequest={navigationRequest} />
        </Canvas>
      </div>

      {/* Soft contrast veil keeps text readable while preserving the 3D atmosphere */}
      <div className="absolute inset-0 z-10 pointer-events-none atmospheric-veil" />

      {/* DOM overlay for section content so it never disappears with camera frustum */}
      <div className="absolute inset-0 z-20 pointer-events-none content-contrast">
        {renderSectionOverlay()}
      </div>
    </div>
  );
}

