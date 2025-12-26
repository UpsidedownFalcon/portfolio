import { motion } from 'framer-motion';
import { Rocket, Lightbulb, Target, Users } from 'lucide-react';

const missionItems = [
  {
    icon: Rocket,
    title: 'Mission Driven',
    description: 'On a mission to change the world through engineering and innovation.',
  },
  {
    icon: Lightbulb,
    title: 'Problem Solver',
    description: 'Inventing devices to prevent injuries and accelerate rehabilitation.',
  },
  {
    icon: Target,
    title: 'Impact Focused',
    description: 'Tackling humanity\'s most pressing challenges with technology.',
  },
  {
    icon: Users,
    title: 'Team Builder',
    description: 'Bringing together the greatest minds to solve real problems.',
  },
];

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative">
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
            About Me
            <span className="text-muted-foreground">/&gt;</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              I am on a mission to change the world. My vision is to make the world 
              a better place by bringing together some of the greatest minds to 
              tackle humanity's most pressing challenges.
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Here are some of the most significant things I have done so far:
            </p>
            <ul className="space-y-3 text-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-mono">→</span>
                <span>Inventing a device to prevent career-ending knee injuries</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-mono">→</span>
                <span>Inventing a device to reduce rehabilitation time for stroke patients</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-mono">→</span>
                <span>Developing an AI app to predict COVID-19 spread</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-mono">→</span>
                <span>Raised $642,000 in venture capital and angel funding</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {missionItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-mono font-semibold mb-2 text-sm">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
