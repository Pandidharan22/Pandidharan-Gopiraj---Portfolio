import { useEffect, useState } from 'react';
import { Moon, Sun, Download } from 'lucide-react';
import { motion } from 'motion/react';

interface NavigationProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function Navigation({ theme, onThemeToggle }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Insights', href: '#insights' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-lg border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="text-xl font-bold text-foreground hover:opacity-70 transition-opacity">
            AI.Engineer
          </a>

          {/* Nav Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-sm text-foreground/80 hover:text-foreground transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-foreground after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-foreground text-background border border-transparent rounded-lg hover:bg-background hover:text-foreground hover:border-foreground transition-all duration-300">
              <Download className="w-4 h-4" />
              <span className="text-sm">Resume</span>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
