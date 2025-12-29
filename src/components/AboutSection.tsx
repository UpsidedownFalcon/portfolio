import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "[ CAD / CAM / EDA ]",
    skills: ["Fusion 360", "SolidWorks", "OnShape", "KiCad", "DipTrace", "Cura", "Slic3r", "NI Multisim", "LT Spice", "RoboDK", "Blender"],
  },
  {
    title: "{ Fabrication }",
    skills: ["Hot and Cold Metal Working", "Precision Machining", "Soldering", "FDM / SLA / SLM Printing", "CNC Machining"],
  },
  {
    title: "/ Programming and Machine Learning /",
    skills: ["Verilog", "Python", "C", "C++", "MATLAB", "G Code", "M Code", "HTML", "CSS", "JavaScript", "Keras", "PyTorch", "Tensorflow", "OpenCV"],
  },
  {
    title: "< System infrastructure >",
    skills: ["Linux", "Ubuntu", "Git", "Docker", "CI/CD", "ProxMox", "TrueNas Scale", "Pterodactyl", "Wings", "Mosquitto"],
  },
];


export const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="relative z-10">
        {/* Title stays centered and aligned with container */}
        <div className="container mx-auto px-6">
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
        </div>

        {/* Full-width row so image can touch the left edge */}
        <div className="flex flex-col md:flex-row gap-12 items-stretch mb-16">
          {/* LEFT: Image flush to the left edge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-start"
          >
            <div className="w-full max-w-[670px]">
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-black">
                <img
                  src="/images/profile-image.png"
                  alt="Portrait"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Text + Skills (bottom-right) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="w-full container mx-auto px-6">
              {/* About copy */}
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                I’m here to change the world - not as a slogan, but as a job description.
              </p>

              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                I build engineering and AI systems to improve human health:
              </p>

              <ul className="space-y-3 text-foreground mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-mono">→</span>
                  <span>
                    Patented injury-prevention technology in a Smart Knee Brace that prevents acute knee injuries in real-time such as ACL tears.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-primary font-mono">→</span>
                  <span>
                    Invented a bionic arm brace and rehabilitation glove for stroke patients to speed up recovery time.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-primary font-mono">→</span>
                  <span>
                    Developed a Covid-19 app to predict spread and PPE demand to save lives.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-primary font-mono">→</span>
                  <span>
                    Raised $642,000 in venture capital and angel funding to turn the mission into real, testable technology.
                  </span>
                </li>
              </ul>

              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                I co-founded Hippos Exoskeleton with the vision of eradicating physical injury. We do this using advanced soft-exoskeleton wearables to form an invisible suit of armour around you which only deploys when you need it. We&apos;re starting with the knee joint to prevent ACL tears then expanding into the rest of the body.
              </p>

              {/* -------------------- */}
              {/* Skills (bottom-right) */}
              {/* -------------------- */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="w-full"
              >

                {/* Cards aligned toward the bottom-right */}
                <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-fr gap-4">
                  {skillCategories.map((category, index) => (
                    <motion.div
                      key={category.title}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: index * 0.08 }}
                      viewport={{ once: true }}
                      className="h-full bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all duration-300"
                    >
                      <h4 className="font-mono text-primary font-semibold mb-3 text-sm">
                        {category.title}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-xs font-mono"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
