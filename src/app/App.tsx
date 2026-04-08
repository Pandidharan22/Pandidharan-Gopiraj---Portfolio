import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import AppScene from './components/Scene';
import { Navigation } from './components/Navigation';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

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

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background text-foreground transition-colors duration-500 ease-in-out">
      {/* Restore the original Top Navigation UI */}
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-auto">
        <Navigation theme={theme} onThemeToggle={toggleTheme} />
      </div>
      
      {/* 3D Scene handles all sections now */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
          <AppScene />
        </Canvas>
      </div>
    </div>
  );
}

