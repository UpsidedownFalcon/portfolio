import { motion } from 'framer-motion';

const skillCategories = [
  {
    title: '[ CAD / CAM / EDA ]',
    skills: ['Fusion 360', 'SolidWorks', 'OnShape', 'KiCad', 'DipTrace', 'Cura', 'Slic3r', 'InkScape'],
  },
  {
    title: '{ Fabrication }',
    skills: ['Metal Working', 'Engineering Drawings', 'Precision Machining', 'Soldering', 'Rapid Prototyping'],
  },
  {
    title: '/ Programming /',
    skills: ['Verilog', 'Python', 'C', 'C++', 'MATLAB', 'G Code', 'M Code', 'HTML', 'CSS', 'JavaScript'],
  },
];

const experienceItems = [
  {
    role: 'Co-Founder & CTO',
    company: 'Hippos Exoskeleton',
    description: "Led the company's R&D to raise $642,000 in venture capital and angel funding",
  },
  {
    role: 'Sergeant Major',
    company: 'Combined Cadet Force',
    description: 'Spent 5+ years and led 80+ Cadets through military-style and weapons training',
  },
  {
    role: 'President',
    company: 'UCL Fleming Society',
    description: 'Led 20+ committee members to organise events for 800+ students',
  },
];

const educationItems = [
  {
    degree: 'MEng 1st Class with Honours',
    field: 'Electronic and Electrical Engineering with Computer Science',
    institution: 'University College London (UCL)',
  },
];

export const SkillsSection = () => {
  return (
    <section id="skills" className="py-24 relative">
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
            Skills & Experience
            <span className="text-muted-foreground">/&gt;</span>
          </h2>
        </motion.div>

        {/* Technical Skills */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300"
            >
              <h3 className="font-mono text-primary font-semibold mb-4">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Experience & Education Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Experience */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="font-mono text-xl font-semibold mb-6">
              <span className="text-primary">{'{'}</span> Leadership Experience <span className="text-primary">{'}'}</span>
            </h3>
            <div className="space-y-6">
              {experienceItems.map((item, index) => (
                <motion.div
                  key={item.role}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border-l-2 border-primary/30 pl-6 hover:border-primary transition-colors"
                >
                  <h4 className="font-mono font-semibold text-foreground">{item.role}</h4>
                  <p className="text-primary text-sm mb-2">@ {item.company}</p>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="font-mono text-xl font-semibold mb-6">
              <span className="text-primary">{'<'}</span> Education <span className="text-primary">{'>'}</span>
            </h3>
            <div className="space-y-6">
              {educationItems.map((item, index) => (
                <motion.div
                  key={item.degree}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300"
                >
                  <h4 className="font-mono font-semibold text-foreground mb-1">{item.degree}</h4>
                  <p className="text-primary text-sm mb-2">{item.field}</p>
                  <p className="text-muted-foreground text-sm">{item.institution}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
