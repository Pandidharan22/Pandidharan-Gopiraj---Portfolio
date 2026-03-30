import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { BackgroundAnimation } from './components/BackgroundAnimation';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { InsightsSection } from './components/InsightsSection';
import { ContactSection } from './components/ContactSection';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Set initial theme to dark
    document.documentElement.classList.add('dark');
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

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500 ease-in-out">
      {/* Background Animation */}
      <BackgroundAnimation />

      {/* Navigation */}
      <Navigation theme={theme} onThemeToggle={toggleTheme} />

      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <InsightsSection />
        <ContactSection />
      </main>
    </div>
  );
}
