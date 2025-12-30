import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Linkedin, Github, Download } from 'lucide-react';

const contactLinks = [
  {
    icon: Mail,
    label: 'Email',
    value: 'bhavy.metakar.work@gmail.com',
    href: 'mailto:bhavy.metakar.work@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+44 7368 395718',
    href: 'https://wa.link/xvj6p3',
  },
];

const socialLinks = [
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/bhavy-metakar',
  },
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com/UpsidedownFalcon',
  },
];

export const ContactSection = () => {
  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4">
            <span className="text-muted-foreground">&lt;</span>
            Get in Touch
            <span className="text-muted-foreground">/&gt;</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Interested in collaborating on deep tech projects or discussing innovative ideas?
            Let's connect.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-lg p-8 mb-8"
          >
            <div className="space-y-6">
              {contactLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <link.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-mono text-sm text-muted-foreground">{link.label}</p>
                    <p className="font-mono text-foreground group-hover:text-primary transition-colors">
                      {link.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  aria-label={link.label}
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <Button variant="hero" size="lg" asChild>
              <a href="Curriculum%20Vitae_BhavyM.pdf" target="_blank" rel="noopener noreferrer">
                Download CV
                <Download className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
