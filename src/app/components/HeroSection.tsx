import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onNavigate?: (sectionIndex: number) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-6">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 text-foreground hero-title-glow"
          >
            Pandidharan Gopiraj
          </motion.h1>

          {/* Role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-foreground mb-4 sm:mb-6 font-semibold hero-role-glow"
          >
            AI Engineer | ML Engineer | Data Analyst
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-foreground mb-8 sm:mb-12 max-w-3xl leading-relaxed font-medium hero-tagline-glow"
          >
            Designing AI systems that don't just predict — they validate, adapt, and self-heal.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <button
              type="button"
              onClick={() => onNavigate?.(2)}
              className="group px-6 sm:px-8 py-3 sm:py-4 bg-foreground text-background border border-transparent rounded-lg hover:bg-background hover:text-foreground hover:border-foreground transition-all duration-300 flex items-center gap-2"
            >
              <span>View Projects</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-foreground/50 rounded-full flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-foreground rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
