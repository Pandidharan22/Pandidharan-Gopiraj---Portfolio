import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import AppScene from './components/Scene';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ContactSection } from './components/ContactSection';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeSection, setActiveSection] = useState(0);

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

  const renderSectionOverlay = () => {
    if (activeSection === 0) {
      return (
        <div className="w-screen h-screen overflow-hidden bg-transparent px-4 sm:px-6 md:px-8 flex items-center justify-center pointer-events-auto">
          <HeroSection />
        </div>
      );
    }

    if (activeSection === 1) {
      return (
        <div className="w-screen h-screen overflow-hidden bg-transparent px-4 sm:px-6 md:px-8 pointer-events-auto">
          <AboutSection />
        </div>
      );
    }

    if (activeSection === 2) {
      return (
        <div className="w-screen h-screen overflow-hidden bg-transparent px-4 sm:px-6 md:px-8 pointer-events-auto">
          <ProjectsSection />
        </div>
      );
    }

    if (activeSection === 3) {
      return (
        <div className="w-screen h-screen overflow-hidden bg-transparent px-4 sm:px-6 md:px-8 pointer-events-auto">
          <SkillsSection />
        </div>
      );
    }

    return (
      <div className="w-screen h-screen overflow-hidden bg-transparent px-4 sm:px-6 md:px-8 pointer-events-auto">
        <ContactSection />
      </div>
    );
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background text-foreground transition-colors duration-500 ease-in-out">
      {/* Restore the original Top Navigation UI */}
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-auto">
        <Navigation theme={theme} onThemeToggle={toggleTheme} />
      </div>
      
      {/* 3D Scene handles all sections now */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
          <AppScene onActiveSectionChange={setActiveSection} />
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

