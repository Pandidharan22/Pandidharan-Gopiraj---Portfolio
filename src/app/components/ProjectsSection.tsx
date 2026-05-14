import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Github, Zap, Shield, Gauge } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  impact: string[];
  tags: string[];
  problem: string;
  approach: string;
  features: string[];
  results: string[];
  researchFocus?: string;
  demoLink?: string;
  demoLinkLabel?: string;
  demoNote?: string;
  githubLink?: string;
}

const projects: Project[] = [
  {
    id: 'self-reflective-rag',
    title: 'Self-Reflective RAG Platform: Heuristic Hallucination Mitigation',
    impact: [
      'Full-stack RAG platform featuring a Heuristic Guardrail Engine.',
      'Autonomously detects and mitigates LLM hallucinations.',
      'Impact: Successfully blocked 86% of adversarial out-of-domain traps.'
    ],
    tags: ['Python 3.11', 'FastAPI', 'React 18', 'Tailwind v4', 'Docker', 'FAISS'],
    problem: 'Standard "Naive RAG" architectures suffer from a critical flaw: they blindly pass retrieved vector chunks to a Large Language Model regardless of semantic relevance, leading to confident hallucinations on out-of-domain queries.',
    approach: 'Introduced an intermediate deterministic layer—the Heuristic Guardrail Engine—which mathematically evaluates the quality of the vector search before LLM inference occurs, calculating a Risk Score based on mean similarity and score spread.',
    features: [
      'Heuristic Guardrail Engine that evaluates vector search quality before LLM inference',
      'Self-Reflection Loop that autonomously executes a secondary vector search with expanded context if Risk Score exceeds threshold',
      'Ultra-Low Latency Inference utilizing Llama-3.1-8b-instant on Groq LPU architecture',
      'Vector Memory & Ingestion using persistent FAISS-CPU IndexFlatIP and sentence-transformers',
      'Strict prompt-engineering protocols forcing LLM refusals for adversarial out-of-domain queries',
      'Containerized deployment architecture using Docker, Docker Compose, and Cloudflare Tunnels for Zero Trust Ingress'
    ],
    results: [
      'Empirically evaluated against a strict 50-query dataset including in-domain fact retrieval, multi-hop queries, and out-of-domain adversarial traps',
      'Triggered autonomous self-reflection correctly on 34% (17/50) of high-risk queries during benchmarking',
      'Achieved a competitive average end-to-end latency of ~5.6 seconds for complex self-reflective multi-hop routing',
      'Successfully refused 13 out of 15 adversarial out-of-domain hallucination traps'
    ],
    researchFocus: 'Empirical benchmarks revealed that while dynamic context expansion (Self-Reflection) successfully rescues low-confidence, in-domain queries, it introduces semantic noise when applied to purely out-of-domain adversarial queries. Future iterations will decouple "In-Domain Low Confidence" and "Out-of-Domain Detection" to optimize the expansion trigger.',
    demoLink: 'https://self-reflective-rag.pandidharan.dev',
    demoLinkLabel: 'Live Application',
    demoNote: '✨ This application is securely hosted and served directly from my Project Nexus homelab infrastructure.',
    githubLink: 'https://github.com/Pandidharan22/Heuristic-Self-Reflective-RAG',
  },
  {
    id: 'project-nexus',
    title: 'Project Nexus — Personal Cloud & Automated Portfolio Homelab',
    impact: [
      'Production-grade self-hosted homelab infrastructure.',
      'Combines a secure private cloud platform and an automated deployment server.',
      'Impact: This very portfolio and my Self-Reflective RAG platform are hosted here!'
    ],
    tags: ['Docker', 'Cloudflare Zero Trust', 'Nextcloud', 'Nginx', 'GitHub Actions', 'WSL2'],
    problem: 'Traditional self-hosting requires exposing local network ports to the internet, creating significant security risks. The goal was to build a dual-purpose server architecture on a local Windows machine providing secure global access to self-hosted services without exposing local machine ports.',
    approach: 'Implemented a Zero-Surface-Area security architecture using outbound-only encrypted Cloudflare Tunnel routing. Designed a fully containerized infrastructure with Docker Compose, handling both a private Nextcloud instance and an automated CI/CD pipeline for a real-time Nginx web server.',
    features: [
      'Zero-Surface-Area security architecture with no open inbound ports',
      'Outbound-only encrypted Cloudflare Tunnel routing',
      'Self-hosted cloud storage platform using Nextcloud and MariaDB',
      'High-performance Nginx static hosting optimized for heavy 3D frontend workloads',
      'Automated build and deployment pipeline triggered via GitHub Actions self-hosted runner',
      'Fully containerized infrastructure using Docker Compose with isolated service architecture',
      'Docker bind mounts for direct physical disk ownership and data sovereignty'
    ],
    results: [
      'Demonstrates practical DevOps, self-hosting, networking, and infrastructure engineering skills',
      'Built a secure alternative to traditional cloud storage platforms with full data ownership',
      'Eliminated dependency on exposed router ports through Zero Trust tunneling architecture',
      'Established a production-style CI/CD workflow for automated frontend deployment',
      'Currently hosting this portfolio and the Self-Reflective RAG platform securely and reliably'
    ],
    githubLink: 'https://github.com/Pandidharan22/Nexus---Personal-Cloud-and-Automated-Portfolio-Homelab',
    demoNote: '✨ Live Demo? You are looking at it! Both this portfolio and the Self-Reflective RAG platform are hosted on Nexus.',
  },
  {
    id: 'lokesh-portfolio',
    title: 'Lokesh — Photographer Portfolio Website',
    impact: [
      'Premium cinematic portfolio website for a professional photographer.',
      'Features immersive visuals, smooth animations, and interactive UX.',
      'Impact: Delivered as a paid freelance project that elevated the client’s brand.'
    ],
    tags: ['React', 'Three.js', 'Tailwind CSS', 'Framer Motion'],
    problem: 'Built a fully responsive showcase platform focused on visual storytelling, portfolio presentation, and client engagement for a freelance photography business.',
    approach: 'Leveraged modern frontend tooling to build a cinematic UI/UX with smooth scrolling, immersive animations, and an optimized component-based architecture aligned with the client\'s premium creative brand.',
    features: [
      'Cinematic UI/UX with smooth scroll and motion-based interactions',
      'Responsive gallery and portfolio presentation across devices',
      'Interactive animations using Framer Motion and modern frontend tooling',
      'Optimized image rendering and performance-focused frontend architecture',
      'Clean, premium visual identity aligned with the client\'s creative brand',
      'Modular component-based frontend structure for scalability and maintainability'
    ],
    results: [
      'Successfully delivered as a paid freelance project worth ₹10,000',
      'Helped establish a stronger digital presence for the client\'s photography brand',
      'Demonstrated ability to build production-ready, client-focused creative web experiences',
      'Showcases real-world project execution, design communication, and delivery capability'
    ],
    demoLink: 'https://lokesh-portfolio-beryl.vercel.app/',
    demoLinkLabel: 'View Portfolio',
    githubLink: 'https://github.com/Pandidharan22/Lokesh-Photographer-Portfolio',
  },
  {
    id: 'loan-risk-scoring',
    title: 'AI-Powered Loan Eligibility & Risk Scoring System',
    impact: [
      'End-to-end ML system for loan default risk prediction.',
      'Deployed FastAPI backend with real-time inference pipeline.',
      'Impact: Improved minority-class detection for financial risk assessment.'
    ],
    tags: ['Python', 'FastAPI', 'Scikit-learn', 'SHAP', 'Docker', 'Hugging Face'],
    problem: 'Traditional loan approval systems often struggle with imbalanced datasets where default cases are rare, causing models to achieve misleadingly high accuracy while failing to identify high-risk applicants effectively.',
    approach: 'Designed a complete ML engineering pipeline focused on imbalanced binary classification, advanced feature engineering, threshold optimization, interpretability, and production deployment for real-time inference.',
    features: [
      'Advanced feature engineering for low-signal financial datasets',
      'Imbalanced classification handling using class weights and threshold tuning',
      'Production-ready FastAPI backend with modular service architecture',
      'Real-time prediction API with integrated frontend interface',
      'SHAP-based model interpretability and feature contribution analysis',
      'End-to-end preprocessing pipeline with serialized inference workflow',
      'Dockerized deployment on Hugging Face Spaces',
      'Structured ML system architecture with reusable preprocessing and prediction services'
    ],
    results: [
      'Achieved ROC-AUC of ~0.75, F1 Score ~0.36, Precision ~0.32, Recall ~0.41 with optimized decision threshold at 0.20',
      'Improved minority-class detection significantly through threshold tuning and recall optimization',
      'Demonstrated that feature engineering had greater impact than model complexity in low-signal datasets (selected Gradient Boosting)',
      'Fully deployed ML system with real-time inference support on Hugging Face Spaces',
      'Built a scalable inference workflow separating preprocessing, prediction services, and API layers'
    ],
    demoLink: 'https://huggingface.co/spaces/Pandidharan22/loan-risk-scoring-api',
    githubLink: 'https://github.com/Pandidharan22/AI-Powered-Loan-Eligibility-Risk-Scoring-System-API',
  },
];

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const modal = selectedProject ? (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="project-modal-overlay fixed inset-0 z-[80] flex items-start justify-center pt-20 pb-6 px-4 bg-black/80 backdrop-blur-sm"
        onClick={() => setSelectedProject(null)}
        onWheel={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="bg-surface/50 rounded-2xl max-w-4xl w-full max-h-[calc(100vh-7rem)] overflow-y-auto themed-scrollbar allow-touch-scroll touch-pan-y border border-border shadow-2xl"
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
              <ul className="list-disc pl-5 space-y-1 text-base md:text-lg text-foreground font-medium">
                {selectedProject.impact.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
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

            {/* Research Focus */}
            {selectedProject.researchFocus && (
              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-foreground font-semibold" />
                  Research Focus
                </h4>
                <p className="text-foreground/80 leading-relaxed font-medium bg-foreground/5 p-4 rounded-lg border border-border">
                  {selectedProject.researchFocus}
                </p>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {selectedProject.demoLink && (
                <a
                  href={selectedProject.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-foreground text-background border border-transparent rounded-lg hover:bg-background hover:text-foreground hover:border-foreground transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{selectedProject.demoLinkLabel || 'View Demo'}</span>
                </a>
              )}
              {selectedProject.githubLink && (
                <a
                  href={selectedProject.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 border border-foreground text-foreground font-semibold rounded-lg hover:bg-foreground hover:text-background transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>View Code</span>
                </a>
              )}
              {selectedProject.demoNote && (
                <p className="text-sm font-medium italic text-foreground/80 px-2 transition-all duration-300 hover:text-foreground hover:[text-shadow:0_0_8px_currentColor] cursor-default">
                  {selectedProject.demoNote}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  ) : null;

  return (
    <>
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
                <ul className="list-disc pl-5 text-sm text-foreground/70 mb-4 space-y-1.5">
                  {project.impact.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
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
      </section>

      {typeof document !== 'undefined' && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
