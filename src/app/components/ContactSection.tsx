import { motion } from 'motion/react';
import { Mail, Linkedin, Github, Send, Download } from 'lucide-react';

export function ContactSection() {
  const contactLinks = [
    {
      icon: Mail,
      label: 'Email',
      value: 'pandidharan7@gmail.com',
      href: 'mailto:pandidharan7@gmail.com',
      color: 'hover:text-green-500',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/in/pandi-dharan-g-r',
      href: 'https://linkedin.com/in/pandi-dharan-g-r',
      color: 'hover:text-blue-600',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'github.com/Pandidharan22',
      href: 'https://github.com/Pandidharan22',
      color: 'hover:text-purple-500',
    },
  ];

  return (
    <section id="contact" className="relative py-24 px-6 bg-surface/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's Connect</h2>
          <div className="h-1 w-20 bg-foreground rounded-full mb-8 mx-auto" />
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-4 font-medium">
            Let's build something impactful.
          </p>
          <p className="text-lg text-foreground/70 mb-12">
            I'm always interested in discussing new projects, opportunities, or collaborations in AI and machine learning.
          </p>

          {/* Contact Links */}
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {contactLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group p-6 rounded-xl bg-surface border border-border hover:border-foreground transition-all duration-300 hover:shadow-xl hover:shadow-black/5 dark:shadow-white/5 ${link.color}`}
              >
                <link.icon className="w-8 h-8 mx-auto mb-4 transition-transform group-hover:scale-110" />
                <h3 className="font-semibold mb-2">{link.label}</h3>
                <p className="text-sm text-foreground/60 break-all">{link.value}</p>
              </motion.a>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="mailto:pandidharan7@gmail.com"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-3 px-8 py-4 bg-foreground text-background border border-transparent rounded-lg hover:bg-background hover:text-foreground hover:border-foreground transition-all duration-300 group"
            >
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span className="font-medium">Send a Message</span>
            </a>
            <button className="w-full sm:w-auto inline-flex justify-center items-center gap-3 px-8 py-4 border border-foreground text-foreground rounded-lg hover:bg-foreground hover:text-background transition-all duration-300 group">
              <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              <span className="font-medium">Download Resume</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-24 pt-8 border-t border-border text-center text-sm text-foreground/60"
        >
          <p>© 2026 Pandidharan Gopiraj. Building the future of AI, one system at a time.</p>
        </motion.div>
      </div>
    </section>
  );
}
