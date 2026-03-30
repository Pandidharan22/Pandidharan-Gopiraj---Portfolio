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
  {
    id: 'complaint-management',
    title: 'AI Complaint Management System',
    impact: 'Automated classification and routing of 10,000+ customer complaints monthly',
    tags: ['NLP', 'BERT', 'React', 'FastAPI', 'Redis'],
    problem: 'Customer support teams were overwhelmed with manually categorizing and routing thousands of complaints, leading to slow response times and customer dissatisfaction.',
    approach: 'Developed an NLP-powered system using fine-tuned BERT models to automatically classify complaints into 15+ categories, extract key entities, and route to appropriate departments.',
    features: [
      'Multi-label classification with BERT',
      'Named entity recognition for key information',
      'Sentiment analysis for priority scoring',
      'Auto-routing to relevant departments',
      'Dashboard for tracking and analytics',
    ],
    results: [
      '95% classification accuracy',
      '70% faster routing time',
      '3x increase in complaint resolution speed',
      'Improved customer satisfaction by 35%',
    ],
    demoLink: '#',
    githubLink: '#',
  },
  {
    id: 'temperature-prediction',
    title: 'Temperature Prediction Model',
    impact: 'Achieved 98% accuracy in predicting temperature trends for climate research',
    tags: ['Python', 'TensorFlow', 'Time Series', 'Pandas', 'Scikit-learn'],
    problem: 'Climate researchers needed accurate temperature predictions to model long-term environmental changes, but existing models struggled with irregular patterns.',
    approach: 'Built a hybrid model combining LSTM networks with traditional statistical methods (ARIMA) to capture both short-term fluctuations and long-term trends.',
    features: [
      'LSTM-ARIMA hybrid architecture',
      'Multi-variate time series analysis',
      'Seasonal decomposition',
      'Uncertainty quantification',
      'Interactive visualization dashboard',
    ],
    results: [
      '98% prediction accuracy',
      '25% better than baseline models',
      'Handles 50+ years of historical data',
      'Used by 3 research institutions',
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
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Projects</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-accent to-glow rounded-full mb-12" />
        </motion.div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer p-6 rounded-xl bg-surface border border-border hover:border-accent transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 hover:scale-[1.02]"
            >
              <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-foreground/70 mb-4">{project.impact}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-accent/10 text-accent border border-accent/20"
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
              className="bg-surface rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-accent/20 shadow-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 bg-surface border-b border-border p-6 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">{selectedProject.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full bg-accent/10 text-accent border border-accent/20"
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
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <p className="text-lg text-accent font-medium">{selectedProject.impact}</p>
                </div>

                {/* Problem Statement */}
                <div>
                  <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent" />
                    Problem Statement
                  </h4>
                  <p className="text-foreground/80 leading-relaxed">{selectedProject.problem}</p>
                </div>

                {/* Approach */}
                <div>
                  <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-accent" />
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
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Results */}
                <div>
                  <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-accent" />
                    Results & Impact
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selectedProject.results.map((result, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-surface border border-border"
                      >
                        <p className="text-sm font-medium text-glow">{result}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-4 pt-4">
                  {selectedProject.demoLink && (
                    <a
                      href={selectedProject.demoLink}
                      className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Demo</span>
                    </a>
                  )}
                  {selectedProject.githubLink && (
                    <a
                      href={selectedProject.githubLink}
                      className="flex items-center gap-2 px-6 py-3 border border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition-colors"
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
