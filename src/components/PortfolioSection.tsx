import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'Hippos Exoskeleton',
    category: 'MedTech / Wearables',
    description: 'Co-founded to prevent career-ending knee injuries in elite athletes. Developed analog sensing and predictive ML techniques with integrated airbags. Raised $642,000 in pre-seed funding.',
    image: 'https://bhavymetakar.com/Images/HipposExoskeleton1.png',
    tags: ['Hardware', 'ML', 'Funding'],
  },
  {
    title: 'Bionic Arm Brace',
    category: 'Rehabilitation',
    description: 'Exoskeletal arm brace and glove to speed up stroke patient recovery using EMG sensors. Approved by 15+ physiotherapists and trialled by 40+ patients.',
    image: 'https://bhavymetakar.com/Images/UplandsRehabilitationCentre1.png',
    tags: ['EMG', 'Medical', 'Hardware'],
  },
  {
    title: 'AI Motion Capture',
    category: 'Computer Vision',
    description: 'Motion capture system with 1.5mm resolution using computer vision and optical flow techniques. Saved £10,000s compared to professional VFX studios.',
    image: 'https://bhavymetakar.com/Images/AIMoCap1.png',
    tags: ['AI', 'Vision', 'Robotics'],
  },
  {
    title: 'Autonomous Utility Robot',
    category: 'Defence',
    description: 'Utility robot for soldiers sponsored by Leonardo. Tank tracks for rough terrain, autonomous navigation via IR sensors, and manual control capability.',
    image: 'https://bhavymetakar.com/Images/AutonomousUtilityRobot1.png',
    tags: ['Robotics', 'Defence', 'Autonomous'],
  },
  {
    title: 'Cardboard 3D Printer',
    category: 'Manufacturing',
    description: '5x more economical than commercial printers with similar quality. Uses Marlin firmware with Arduino Mega-based controller.',
    image: 'https://bhavymetakar.com/Images/Cardboard3DPrinter1.png',
    tags: ['3D Printing', 'DIY', 'Arduino'],
  },
  {
    title: 'FPGA Descrambler',
    category: 'Signals',
    description: 'FPGA-based descrambling device using DE0-Nano. Applies various descrambling techniques including inverse Hilbert Transform.',
    image: 'https://bhavymetakar.com/Images/AudioDescrambler1.png',
    tags: ['FPGA', 'DSP', 'Hardware'],
  },
];

export const PortfolioSection = () => {
  return (
    <section id="portfolio" className="py-24 relative">
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
            Portfolio
            <span className="text-muted-foreground">/&gt;</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-500"
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="font-mono text-primary text-xs mb-2">{project.category}</p>
                <h3 className="font-mono font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
