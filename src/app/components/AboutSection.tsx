import { motion } from 'motion/react';
import { Brain, Database, Cpu, TrendingUp, Server, Layout } from 'lucide-react';

export function AboutSection() {
  const focusAreas = [
    { icon: Brain, title: 'Applied AI & Data Science', color: 'text-blue-500' },
    { icon: TrendingUp, title: 'MLOps & Reliability', color: 'text-cyan-500' },
    { icon: Server, title: 'Infrastructure & DevOps', color: 'text-purple-500' },
    { icon: Layout, title: 'UI/UX Systems Design', color: 'text-green-500' },
  ];

  const differentiators = [
    {
      title: 'End-to-End System Thinking',
      description: 'Architecting complete technical solutions by seamlessly bridging intelligent ML pipelines with scalable, secure infrastructures.',
    },
    {
      title: 'AI-Accelerated Engineering',
      description: 'Pairing deep AI & Data Science expertise with AI-assisted development to rapidly design and deliver full-stack systems.',
    },
    {
      title: 'Built for Reliability',
      description: 'Prioritizing resilient, fault-tolerant architectures across all deployments—from self-healing AI pipelines to Zero Trust networks.',
    },
  ];

  return (
    <section id="about" className="relative py-24 px-6 bg-surface/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">About</h2>
          <div className="h-1 w-20 bg-foreground rounded-full mb-12" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Bio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-base md:text-lg text-foreground/80 leading-relaxed mb-6 md:mb-8">
              I'm an AI Engineer and Data Scientist specializing in building production-ready machine learning systems, spanning from predictive modeling to NLP. Beyond AI, I maintain a strong theoretical foundation in architecture design across DevOps, cloud infrastructure, and modern web development.
            </p>
            <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
              While AI and Data Science are my core technical strengths where I write code from the ground up, I leverage AI-assisted tools to help implement my theoretical designs for frontend interfaces and self-hosted infrastructure. This pragmatic approach allows me to deliver complete, well-architected systems—from robust ML pipelines to the web applications and secure servers that host them—without over-exaggerating my manual coding scope outside of AI.
            </p>
          </motion.div>

          {/* Right: Focus Areas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-2xl font-semibold mb-6">Focus Areas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {focusAreas.map((area, index) => (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-surface/50 border border-border hover:border-foreground/50 transition-colors"
                >
                  <area.icon className={`w-6 h-6 ${area.color} flex-shrink-0 mt-1`} />
                  <span className="text-sm font-medium">{area.title}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* What I Do Differently */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-semibold mb-8">What I Do Differently</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {differentiators.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="p-6 rounded-lg bg-surface/50 border border-border hover:border-foreground/50 transition-all hover:shadow-lg hover:shadow-black/5 dark:shadow-white/5"
              >
                <h4 className="font-semibold mb-3 text-foreground font-semibold">{item.title}</h4>
                <p className="text-sm text-foreground/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
