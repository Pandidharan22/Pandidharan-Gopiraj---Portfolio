import { useState, useEffect, useRef, useCallback, type WheelEvent as ReactWheelEvent, type TouchEvent as ReactTouchEvent } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'motion/react';
import AppScene from './components/Scene';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ContactSection } from './components/ContactSection';
import { LoadingScreen } from './components/LoadingScreen';

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
  const [isLoadingCycleComplete, setIsLoadingCycleComplete] = useState(false);
  const [isLoadingVisible, setIsLoadingVisible] = useState(true);
  const [isLoadingClosing, setIsLoadingClosing] = useState(false);
  const [isInterfaceVisible, setIsInterfaceVisible] = useState(false);
  const sectionShellRef = useRef<HTMLDivElement>(null);
  const sectionInnerRef = useRef<HTMLDivElement>(null);
  const navigationRequestId = useRef(0);
  const sectionNavigationLockUntil = useRef(0);
  const sectionTouchStartY = useRef<number | null>(null);

  const sectionTopGap = 74;

  const getSectionId = useCallback((sectionIndex: number) => {
    if (sectionIndex === 0) {
      return 'hero';
    }
    if (sectionIndex === 1) {
      return 'about';
    }
    if (sectionIndex === 2) {
      return 'projects';
    }
    if (sectionIndex === 3) {
      return 'skills';
    }
    return 'contact';
  }, []);

  const isExpectedSectionMounted = useCallback((sectionIndex: number) => {
    const inner = sectionInnerRef.current;
    if (!inner) {
      return false;
    }
    const sectionEl = inner.querySelector('section') as HTMLElement | null;
    return !!sectionEl && sectionEl.id === getSectionId(sectionIndex);
  }, [getSectionId]);

  useEffect(() => {
    // Dark mode is the default entry theme.
    document.documentElement.classList.add('dark');
    // Prevent the body itself from scrolling the page
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
  }, []);

  useEffect(() => {
    // Keep the single loading state on screen long enough to read comfortably.
    const cycleDoneTimer = window.setTimeout(() => setIsLoadingCycleComplete(true), 3000);

    return () => {
      window.clearTimeout(cycleDoneTimer);
    };
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

  useEffect(() => {
    if (!isLoadingCycleComplete || !isLoadingVisible) {
      return;
    }

    let removeLoaderTimer: number | null = null;
    const hideLoaderTimer = window.setTimeout(() => {
      navigateToSection(0);
      setIsInterfaceVisible(true);
      setIsLoadingClosing(true);
      removeLoaderTimer = window.setTimeout(() => {
        setIsLoadingVisible(false);
      }, 760);
    }, 220);

    return () => {
      window.clearTimeout(hideLoaderTimer);
      if (removeLoaderTimer !== null) {
        window.clearTimeout(removeLoaderTimer);
      }
    };
  }, [isLoadingCycleComplete, isLoadingVisible, navigateToSection]);

  const measureSectionScale = useCallback(() => {
    if (activeSection === 0) {
      setSectionScale(1);
      setLayoutTier('normal');
      return;
    }

    // Use native section scrolling instead of shrinking content to fit every viewport.
    setSectionScale(1);
    setLayoutTier('normal');
  }, [activeSection]);

  const tryNavigateFromSectionBoundary = useCallback((direction: 1 | -1) => {
    if (activeSection === 0) {
      return false;
    }

    const now = performance.now();
    if (now < sectionNavigationLockUntil.current) {
      return false;
    }

    const nextSection = Math.max(0, Math.min(4, activeSection + direction));
    if (nextSection === activeSection) {
      return false;
    }

    sectionNavigationLockUntil.current = now + 700;
    navigateToSection(nextSection);
    return true;
  }, [activeSection, navigateToSection]);

  const handleSectionWheel = useCallback((event: ReactWheelEvent<HTMLDivElement>) => {
    const shell = event.currentTarget;
    const atTop = shell.scrollTop <= 2;
    const atBottom = shell.scrollTop + shell.clientHeight >= shell.scrollHeight - 2;

    if (event.deltaY > 0 && atBottom) {
      if (tryNavigateFromSectionBoundary(1)) {
        event.preventDefault();
      }
      return;
    }

    if (event.deltaY < 0 && atTop) {
      if (tryNavigateFromSectionBoundary(-1)) {
        event.preventDefault();
      }
    }
  }, [tryNavigateFromSectionBoundary]);

  const handleSectionTouchStart = useCallback((event: ReactTouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) {
      sectionTouchStartY.current = null;
      return;
    }
    sectionTouchStartY.current = event.touches[0]?.clientY ?? null;
  }, []);

  const handleSectionTouchEnd = useCallback((event: ReactTouchEvent<HTMLDivElement>) => {
    const startY = sectionTouchStartY.current;
    sectionTouchStartY.current = null;

    if (typeof startY !== 'number' || event.changedTouches.length !== 1) {
      return;
    }

    const endY = event.changedTouches[0]?.clientY;
    if (typeof endY !== 'number') {
      return;
    }

    const shell = event.currentTarget;
    const atTop = shell.scrollTop <= 2;
    const atBottom = shell.scrollTop + shell.clientHeight >= shell.scrollHeight - 2;

    const deltaY = endY - startY;
    const swipeThreshold = 52;

    if (deltaY < -swipeThreshold && atBottom) {
      tryNavigateFromSectionBoundary(1);
      return;
    }

    if (deltaY > swipeThreshold && atTop) {
      tryNavigateFromSectionBoundary(-1);
    }
  }, [tryNavigateFromSectionBoundary]);

  useEffect(() => {
    const raf = requestAnimationFrame(measureSectionScale);
    window.addEventListener('resize', measureSectionScale);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measureSectionScale);
    };
  }, [measureSectionScale]);

  useEffect(() => {
    if (activeSection === 0) {
      return;
    }

    let raf = 0;
    let attempts = 0;
    const delayedMeasures: number[] = [];

    const measureUntilMounted = () => {
      attempts += 1;
      measureSectionScale();

      if (isExpectedSectionMounted(activeSection) || attempts >= 36) {
        return;
      }

      raf = requestAnimationFrame(measureUntilMounted);
    };

    raf = requestAnimationFrame(measureUntilMounted);
    delayedMeasures.push(window.setTimeout(measureSectionScale, 220));
    delayedMeasures.push(window.setTimeout(measureSectionScale, 460));

    return () => {
      cancelAnimationFrame(raf);
      delayedMeasures.forEach((timer) => window.clearTimeout(timer));
    };
  }, [activeSection, isExpectedSectionMounted, measureSectionScale]);

  useEffect(() => {
    if (activeSection === 0) {
      return;
    }

    const shell = sectionShellRef.current;
    const inner = sectionInnerRef.current;
    if (!shell || !inner || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => {
      measureSectionScale();
    });

    observer.observe(shell);
    observer.observe(inner);

    const sectionEl = inner.querySelector('section') as HTMLElement | null;
    if (sectionEl) {
      observer.observe(sectionEl);
    }

    return () => {
      observer.disconnect();
    };
  }, [activeSection, measureSectionScale]);

  const renderSectionOverlay = () => {
    const sectionKey = getSectionId(activeSection);
    const sectionShellClasses = `w-screen h-screen overflow-y-auto bg-transparent px-4 sm:px-6 md:px-8 pointer-events-auto section-fit-shell section-scrollable allow-touch-scroll themed-scrollbar section-${sectionKey} layout-${layoutTier}`;
    const sectionShellStyle = { paddingTop: `${sectionTopGap}px`, paddingBottom: '1rem' };

    if (activeSection === 0) {
      return (
        <div className="w-screen h-screen overflow-hidden bg-transparent px-4 sm:px-6 md:px-8 flex items-center justify-center pointer-events-auto">
          <HeroSection onNavigate={navigateToSection} />
        </div>
      );
    }

    const sectionContent =
      activeSection === 1
        ? <AboutSection />
        : activeSection === 2
          ? <ProjectsSection />
          : activeSection === 3
            ? <SkillsSection />
            : <ContactSection />;

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={sectionKey}
          className="w-screen h-screen"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          onAnimationComplete={() => {
            measureSectionScale();
          }}
        >
          <div
            ref={sectionShellRef}
            className={sectionShellClasses}
            style={sectionShellStyle}
            onWheel={handleSectionWheel}
            onTouchStart={handleSectionTouchStart}
            onTouchEnd={handleSectionTouchEnd}
          >
            <div ref={sectionInnerRef} className="section-fit-inner" style={{ transform: `scale(${sectionScale})` }}>
              {sectionContent}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background text-foreground transition-colors duration-500 ease-in-out">
      {/* Restore the original Top Navigation UI */}
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-opacity duration-500 ${isInterfaceVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <Navigation theme={theme} onThemeToggle={toggleTheme} onNavigate={navigateToSection} />
      </div>
      
      {/* 3D scene boots immediately behind the loading screen. */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
          <AppScene
            onActiveSectionChange={setActiveSection}
            navigationRequest={navigationRequest}
            interactionEnabled={isInterfaceVisible}
          />
        </Canvas>
      </div>

      {/* Soft contrast veil keeps text readable while preserving the 3D atmosphere */}
      <div className="absolute inset-0 z-10 pointer-events-none atmospheric-veil" />

      {/* DOM overlay for section content so it never disappears with camera frustum */}
      <div
        className={`absolute inset-0 z-20 pointer-events-none content-contrast transition-opacity duration-500 ${isInterfaceVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {isInterfaceVisible ? renderSectionOverlay() : null}
      </div>

      <LoadingScreen visible={isLoadingVisible} closing={isLoadingClosing} />
    </div>
  );
}

