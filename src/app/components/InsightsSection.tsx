import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Tag } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  readTime: string;
  date: string;
  content: {
    sections: {
      heading: string;
      content: string;
    }[];
  };
}

const articles: Article[] = [
  {
    id: 'trust-scoring',
    title: 'Building Trust Scoring Systems for LLMs in Production',
    summary: 'Learn how to validate LLM outputs at scale using semantic similarity and confidence metrics.',
    tags: ['LLMs', 'MLOps', 'Production'],
    readTime: '8 min',
    date: 'March 15, 2026',
    content: {
      sections: [
        {
          heading: 'The Challenge',
          content: 'Large language models are powerful but unpredictable. In production, you need mechanisms to validate outputs before they reach users.',
        },
        {
          heading: 'Trust Score Architecture',
          content: 'We built a multi-layer validation system that combines semantic similarity checking, statistical analysis, and custom business rules to generate trust scores for each LLM output.',
        },
        {
          heading: 'Implementation',
          content: 'Using sentence transformers and cosine similarity, we compare outputs against known good examples. Scores below threshold trigger human review or fallback responses.',
        },
        {
          heading: 'Results',
          content: 'This approach reduced customer complaints by 65% and increased confidence in automated responses.',
        },
      ],
    },
  },

  {
    id: 'data-validation',
    title: 'Automated Data Validation in ML Pipelines',
    summary: 'Catching data quality issues before they corrupt your models.',
    tags: ['Data Quality', 'Validation', 'Pipelines'],
    readTime: '7 min',
    date: 'February 12, 2026',
    content: {
      sections: [
        {
          heading: 'The Hidden Problem',
          content: 'Bad data is the #1 cause of ML model failures in production, yet it is often the least monitored part of the pipeline.',
        },
        {
          heading: 'Validation Framework',
          content: 'Implement schema validation, statistical checks (distribution shifts, outliers), and business logic constraints at every data ingestion point.',
        },
        {
          heading: 'Tools & Techniques',
          content: 'Use libraries like Great Expectations, custom Pydantic validators, and SQL constraints to catch issues early.',
        },
        {
          heading: 'Impact',
          content: 'Automated validation reduced data-related incidents by 90% and saved countless hours of debugging time.',
        },
      ],
    },
  },
  {
    id: 'model-optimization',
    title: 'Optimizing ML Models for Edge Deployment',
    summary: 'Techniques for running models on resource-constrained devices without sacrificing accuracy.',
    tags: ['Optimization', 'Edge AI', 'Performance'],
    readTime: '11 min',
    date: 'February 5, 2026',
    content: {
      sections: [
        {
          heading: 'Edge Constraints',
          content: 'Edge devices have limited CPU, memory, and battery. Models must be small, fast, and efficient while maintaining acceptable accuracy.',
        },
        {
          heading: 'Quantization Strategies',
          content: 'Convert float32 to int8, use dynamic quantization for inference, and leverage hardware accelerators like ARM NEON.',
        },
        {
          heading: 'Pruning & Distillation',
          content: 'Remove unnecessary weights, distill knowledge from large models to smaller ones, and use techniques like lottery ticket hypothesis.',
        },
        {
          heading: 'Results',
          content: 'Achieved 4x speedup and 75% model size reduction with less than 2% accuracy loss.',
        },
      ],
    },
  },
];

const allTags = Array.from(new Set(articles.flatMap((a) => a.tags)));

export function InsightsSection() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filteredArticles =
    activeFilter === 'All'
      ? articles
      : articles.filter((article) => article.tags.includes(activeFilter));

  return (
    <section id="insights" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Technical Insights</h2>
          <div className="h-1 w-20 bg-foreground rounded-full mb-8" />
          <p className="text-lg text-foreground/70 mb-12 max-w-3xl">
            Thoughts and learnings from building AI systems in production.
          </p>
        </motion.div>

        {/* Filter Tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          <button
            onClick={() => setActiveFilter('All')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === 'All'
                ? 'bg-foreground text-background border border-transparent hover:bg-background hover:text-foreground hover:border-foreground transition-all shadow-lg shadow-black/10 dark:shadow-white/10'
                : 'bg-surface border border-border hover:border-foreground/50'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === tag
                  ? 'bg-foreground text-background border border-transparent hover:bg-background hover:text-foreground hover:border-foreground transition-all shadow-lg shadow-black/10 dark:shadow-white/10'
                  : 'bg-surface border border-border hover:border-foreground/50'
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedArticle(article)}
              className="group cursor-pointer p-6 rounded-xl bg-surface border border-border hover:border-foreground transition-all duration-300 hover:shadow-2xl hover:shadow-black/5 dark:shadow-white/5 hover:scale-[1.02]"
            >
              {/* Date & Read Time */}
              <div className="flex items-center gap-4 text-xs text-foreground/60 mb-4">
                <span>{article.date}</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold mb-3 group-hover:text-foreground font-semibold transition-colors line-clamp-2">
                {article.title}
              </h3>

              {/* Summary */}
              <p className="text-sm text-foreground/70 mb-4 line-clamp-3">{article.summary}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-foreground/10 text-foreground font-semibold border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-2xl my-8"
            >
              {/* Header */}
              <div className="sticky top-0 bg-surface border-b border-border p-6 flex items-start justify-between z-10">
                <div className="flex-1 pr-4">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{selectedArticle.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60">
                    <span>{selectedArticle.date}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedArticle.readTime}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedArticle.tags.map((tag) => (
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
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="prose prose-lg max-w-none">
                  {selectedArticle.content.sections.map((section, index) => (
                    <div key={index} className="mb-8">
                      <h4 className="text-xl font-semibold mb-4 text-foreground font-semibold">
                        {section.heading}
                      </h4>
                      <p className="text-foreground/80 leading-relaxed">{section.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
