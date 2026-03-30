import { motion } from 'motion/react';

interface Skill {
  name: string;
  category: 'ai-ml' | 'data-engineering' | 'backend-systems' | 'tools';
}

const skills: Skill[] = [
  // AI / ML
  { name: 'Python', category: 'ai-ml' },
  { name: 'TensorFlow', category: 'ai-ml' },
  { name: 'PyTorch', category: 'ai-ml' },
  { name: 'Scikit-learn', category: 'ai-ml' },
  { name: 'BERT', category: 'ai-ml' },
  { name: 'LLaMA', category: 'ai-ml' },
  { name: 'GPT', category: 'ai-ml' },
  { name: 'Hugging Face', category: 'ai-ml' },
  { name: 'LangChain', category: 'ai-ml' },
  { name: 'Computer Vision', category: 'ai-ml' },
  { name: 'NLP', category: 'ai-ml' },
  { name: 'Time Series', category: 'ai-ml' },
  
  // Data Engineering
  { name: 'SQL', category: 'data-engineering' },
  { name: 'PostgreSQL', category: 'data-engineering' },
  { name: 'MongoDB', category: 'data-engineering' },
  { name: 'Apache Spark', category: 'data-engineering' },
  { name: 'Pandas', category: 'data-engineering' },
  { name: 'NumPy', category: 'data-engineering' },
  { name: 'ETL Pipelines', category: 'data-engineering' },
  { name: 'Data Warehousing', category: 'data-engineering' },
  
  // Backend / Systems
  { name: 'FastAPI', category: 'backend-systems' },
  { name: 'Django', category: 'backend-systems' },
  { name: 'Node.js', category: 'backend-systems' },
  { name: 'Redis', category: 'backend-systems' },
  { name: 'Docker', category: 'backend-systems' },
  { name: 'Kubernetes', category: 'backend-systems' },
  { name: 'AWS', category: 'backend-systems' },
  { name: 'GCP', category: 'backend-systems' },
  { name: 'CI/CD', category: 'backend-systems' },
  
  // Tools
  { name: 'Git', category: 'tools' },
  { name: 'MLflow', category: 'tools' },
  { name: 'Weights & Biases', category: 'tools' },
  { name: 'Jupyter', category: 'tools' },
  { name: 'Linux', category: 'tools' },
  { name: 'Airflow', category: 'tools' },
  { name: 'Grafana', category: 'tools' },
  { name: 'Prometheus', category: 'tools' },
];

const categories = [
  { id: 'ai-ml', label: 'AI / ML', color: 'from-blue-500 to-cyan-500' },
  { id: 'data-engineering', label: 'Data Engineering', color: 'from-purple-500 to-pink-500' },
  { id: 'backend-systems', label: 'Backend / Systems', color: 'from-green-500 to-emerald-500' },
  { id: 'tools', label: 'Tools', color: 'from-orange-500 to-yellow-500' },
];

export function SkillsSection() {
  return (
    <section id="skills" className="relative py-24 px-6 bg-surface/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Skills & Technologies</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-accent to-glow rounded-full mb-12" />
        </motion.div>

        <div className="space-y-12">
          {categories.map((category, catIndex) => {
            const categorySkills = skills.filter((s) => s.category === category.id);
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
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
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: catIndex * 0.1 + skillIndex * 0.02 }}
                      whileHover={{ scale: 1.05 }}
                      className={`px-4 py-2 rounded-lg bg-surface border border-border hover:border-accent/50 transition-all cursor-default shadow-sm hover:shadow-lg hover:shadow-accent/10`}
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
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 p-8 rounded-xl bg-gradient-to-r from-accent/10 to-glow/10 border border-accent/20"
        >
          <p className="text-lg text-center text-foreground/80">
            Constantly learning and adapting to new technologies in the rapidly evolving AI landscape.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
