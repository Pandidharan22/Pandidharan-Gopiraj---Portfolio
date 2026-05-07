import { motion } from 'motion/react';

interface Skill {
  name: string;
  category: 'ai-ml' | 'data-engineering' | 'backend-systems' | 'frontend' | 'devops-tools';
}

const skills: Skill[] = [
  // AI / ML
  { name: 'Python', category: 'ai-ml' },
  { name: 'Agentic AI', category: 'ai-ml' },
  { name: 'PyTorch', category: 'ai-ml' },
  { name: 'Scikit-learn', category: 'ai-ml' },
  { name: 'Hugging Face', category: 'ai-ml' },
  { name: 'LangChain', category: 'ai-ml' },
  { name: 'RAG', category: 'ai-ml' },
  { name: 'LLMOps', category: 'ai-ml' },
  { name: 'SHAP', category: 'ai-ml' },
  { name: 'FAISS', category: 'ai-ml' },
  { name: 'NLP', category: 'ai-ml' },
  
  // Data Engineering
  { name: 'SQL', category: 'data-engineering' },
  { name: 'MongoDB', category: 'data-engineering' },
  { name: 'Pandas', category: 'data-engineering' },
  { name: 'NumPy', category: 'data-engineering' },
  { name: 'ETL Pipelines', category: 'data-engineering' },
  
  // Backend / Systems
  { name: 'FastAPI', category: 'backend-systems' },
  { name: 'Nginx', category: 'backend-systems' },
  { name: 'Nextcloud', category: 'backend-systems' },

  // Frontend
  { name: 'React', category: 'frontend' },
  { name: 'Three.js', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend' },
  { name: 'Framer Motion', category: 'frontend' },
  { name: 'Streamlit', category: 'frontend' },
  
  // DevOps & Tools
  { name: 'Git', category: 'devops-tools' },
  { name: 'Docker', category: 'devops-tools' },
  { name: 'CI/CD Pipelines', category: 'devops-tools' },
  { name: 'GitHub Actions', category: 'devops-tools' },
  { name: 'Cloudflare Zero Trust', category: 'devops-tools' },
  { name: 'Linux', category: 'devops-tools' },
  { name: 'WSL2', category: 'devops-tools' },
  { name: 'Jupyter', category: 'devops-tools' },
];

const categories = [
  { id: 'ai-ml', label: 'AI & Machine Learning', color: 'from-blue-500 to-cyan-500' },
  { id: 'data-engineering', label: 'Data Engineering', color: 'from-purple-500 to-pink-500' },
  { id: 'backend-systems', label: 'Backend & Systems', color: 'from-green-500 to-emerald-500' },
  { id: 'frontend', label: 'Frontend Development', color: 'from-yellow-400 to-orange-500' },
  { id: 'devops-tools', label: 'DevOps & Tools', color: 'from-red-500 to-rose-500' },
];

export function SkillsSection() {
  return (
    <section id="skills" className="relative py-24 px-6 bg-surface/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Skills & Technologies</h2>
          <div className="h-1 w-20 bg-foreground rounded-full mb-12" />
        </motion.div>

        <div className="space-y-12">
          {categories.map((category, catIndex) => {
            const categorySkills = skills.filter((s) => s.category === category.id);
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`h-8 w-1 rounded-full bg-gradient-to-b ${category.color}`} />
                  <h3 className="text-2xl font-semibold">{category.label}</h3>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {categorySkills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: catIndex * 0.1 + skillIndex * 0.02 }}
                      whileHover={{ scale: 1.05 }}
                      className={`px-4 py-2 rounded-lg bg-surface/50 border border-border hover:border-foreground/50 transition-all cursor-default shadow-sm hover:shadow-lg hover:shadow-black/5 dark:shadow-white/5`}
                    >
                      <span className="text-sm font-medium">{skill.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 p-8 rounded-xl bg-surface/50 border border-border"
        >
          <p className="text-lg text-center text-foreground/80">
            Constantly learning and adapting to new technologies in the rapidly evolving AI landscape.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
