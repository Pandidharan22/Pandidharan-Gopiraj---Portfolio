import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, Zap, Shield, Gauge } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  impact: string;
  tags: string[];
  problem: string;
  approach: string;
  features: string[];
  results: string[];
  demoLink?: string;
  githubLink?: string;
}

const projects: Project[] = [
  {
    id: 'llm-ops',
    title: 'Self-Healing LLM Ops Platform',
    impact: 'Reduced model failures by 85% through automated monitoring and recovery',
    tags: ['Python', 'LLM', 'MLOps', 'FastAPI', 'PostgreSQL'],
    problem: 'Large language models in production often fail silently or produce unreliable outputs without proper monitoring and validation systems in place.',
    approach: 'Built an end-to-end monitoring platform that validates LLM outputs using custom trust scoring, automatically detects anomalies, and triggers self-healing mechanisms when quality degrades.',
    features: [
      'Real-time output validation with semantic similarity scoring',
      'Automated model rollback on quality degradation',
      'Trust score calculation for each prediction',
      'Anomaly detection using statistical methods',
      'Auto-scaling based on load patterns',
    ],
    results: [
      '85% reduction in model failures',
      '60% faster incident detection',
      '40% improvement in output quality',
      'Saved 20+ hours/week in manual monitoring',
    ],
    demoLink: '#',
    githubLink: '#',
  },

];

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Projects</h2>
          <div className="h-1 w-20 bg-foreground rounded-full mb-12" />
        </motion.div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer p-6 rounded-xl bg-surface/50 border border-border hover:border-foreground transition-all duration-300 hover:shadow-2xl hover:shadow-black/5 dark:shadow-white/5 hover:scale-[1.02]"
            >
              <h3 className="text-xl font-semibold mb-3 group-hover:text-foreground font-semibold transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-foreground/70 mb-4">{project.impact}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-foreground/10 text-foreground font-semibold border border-border"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="px-3 py-1 text-xs rounded-full bg-muted text-foreground/60">
                    +{project.tags.length - 3}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 bg-surface/50 border-b border-border p-6 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">{selectedProject.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full bg-foreground/10 text-foreground font-semibold border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* Impact */}
                <div className="p-4 rounded-lg bg-foreground/5 border border-border">
                  <p className="text-lg text-foreground font-semibold font-medium">{selectedProject.impact}</p>
                </div>

                {/* Problem Statement */}
                <div>
                  <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-foreground font-semibold" />
                    Problem Statement
                  </h4>
                  <p className="text-foreground/80 leading-relaxed">{selectedProject.problem}</p>
                </div>

                {/* Approach */}
                <div>
                  <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-foreground font-semibold" />
                    Approach
                  </h4>
                  <p className="text-foreground/80 leading-relaxed">{selectedProject.approach}</p>
                </div>

                {/* Key Features */}
                <div>
                  <h4 className="text-xl font-semibold mb-4">Key Features</h4>
                  <ul className="space-y-2">
                    {selectedProject.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 flex-shrink-0" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Results */}
                <div>
                  <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-foreground font-semibold" />
                    Results & Impact
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selectedProject.results.map((result, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-surface/50 border border-border"
                      >
                        <p className="text-sm font-medium text-foreground/80">{result}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-4 pt-4">
                  {selectedProject.demoLink && (
                    <a
                      href={selectedProject.demoLink}
                      className="flex items-center gap-2 px-6 py-3 bg-foreground text-background border border-transparent rounded-lg hover:bg-background hover:text-foreground hover:border-foreground transition-all duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Demo</span>
                    </a>
                  )}
                  {selectedProject.githubLink && (
                    <a
                      href={selectedProject.githubLink}
                      className="flex items-center gap-2 px-6 py-3 border border-foreground text-foreground font-semibold rounded-lg hover:bg-foreground hover:text-background transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>View Code</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
