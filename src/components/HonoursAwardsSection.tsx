import { motion } from "framer-motion";

type Link = { label: string; href: string };

type Item = {
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  links?: Link[];
};

const patents: Item[] = [
  {
    title: "Smart Knee Brace",
    subtitle: "USPTO Granted | PCT Pending",
    date: "2025",
    description:
      "Wearable injury-prevention device to detect and predict acute knee injuries, and inflate an airbag in 10s of milliseconds to prevent the injury.",
    links: [
      { label: "Patent Document", href: "https://data.uspto.gov/patent-file-wrapper/search/details/19172601/application-data" },
    ],
  },
];

const publications: Item[] = [
  {
    title: "High-Tech Fidget Spinner: Open-Source 3-Axis IMU Turntable",
    subtitle: "ACM UbiComp Companion",
    date: "2025",
    description:
      "Democraticising IMU validation and characterisation in wearable devices by designing a 3D printed turntable with 10x the necessary resolution and 1000x more cost effective than commercial 5 to 6-figure turntables.",
    links: [
      { label: "All Materials", href: "https://github.com/UpsidedownFalcon/IMU-Turntable/tree/main" },
    ],
  },
];

const media: Item[] = [
  {
    title: "Sky News",
    subtitle: "",
    date: "2024",
    description:
      "",
    links: [
      { label: "Clip", href: "/public/videos/sky-news.mp4" },
    ],
  },

  {
    title: "Daily Mail",
    subtitle: "",
    date: "2024",
    description:
      "", 
    links: [
      { label: "Article", href: "https://www.dailymail.co.uk/sport/football/article-13883387/Football-revolutionary-air-bag-knee-injuries-Rodri.html" }, 
    ], 
  },

  {
    title: "Sports Business Journal", 
    subtitle: "", 
    date: "2025", 
    description: 
      "", 
    links: [
      { label: "Article", href: "https://www.sportsbusinessjournal.com/Articles/2025/04/11/hippos-exoskeleton-will-soon-launch-a-knee-brace-with-air-bags-to-prevent-acl-injuries/" }, 
    ],
  },

  {
    title: "Tech Crunch", 
    subtitle: "", 
    date: "2024", 
    description: 
      "", 
    links: [
      { label: "Article", href: "https://techcrunch.com/2024/11/19/former-basketball-hopeful-wants-to-prevent-acl-tears-with-airbags-for-knees/" }
    ], 
  }, 

  {
    title: "Machinery and Manufacturing", 
    subtitle: "", 
    date: "2023", 
    description: 
      "", 
    links: [
      { label: "Article", href: "https://machineryandmanufacturing.com/4942-2/" }
    ], 
  }, 
];

const awards: Item[] = [
  {
    title: "Arkwright",
    subtitle: "",
    date: "",
    description:
      "In the >80th percentile to secure funding from ~1500 nationally.",
  },

  {
    title: "TDI Nationals",
    subtitle: "",
    date: "",
    description:
      "In the 95th percentile to secure funding nationally.",
  },

  {
    title: "IET <> Costain Sponsorship",
    subtitle: "",
    date: "",
    description:
      "In the >90th percentile to secure funding among 2000+ nationally.",
  }, 

  {
    title: "BPho Nationals",
    subtitle: "",
    date: "",
    description:
      "In the 85th percentile among 5000+ nationally.",
  }, 

  {
    title: "Judge at HackLondon", 
    subtitle: "", 
    date: "", 
    description: 
      "Invited to judge one of London's largest Hackathon by JetBrains and Bending Spoons." 
  }, 
];

const SectionCard = ({
  heading,
  bracketLeft,
  bracketRight,
  items,
}: {
  heading: string;
  bracketLeft: string;
  bracketRight: string;
  items: Item[];
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
    >
      <h3 className="font-mono text-lg font-semibold mb-6">
        <span className="text-primary">{bracketLeft}</span>{" "}
        <span className="text-foreground">{heading}</span>{" "}
        <span className="text-primary">{bracketRight}</span>
      </h3>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.title}
            className="border-l-2 border-primary/30 pl-5 hover:border-primary transition-colors"
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h4 className="font-mono font-semibold text-foreground">{item.title}</h4>
              {item.date && (
                <span className="text-xs font-mono text-muted-foreground">({item.date})</span>
              )}
            </div>

            {item.subtitle && (
              <p className="text-primary text-sm font-mono mt-1">{item.subtitle}</p>
            )}

            {item.description && (
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                {item.description}
              </p>
            )}

            {item.links && item.links.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {item.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-mono text-primary hover:underline underline-offset-4"
                  >
                    {link.label} →
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const HonoursAwardsSection = () => {
  return (
    <section id="honours" className="py-24 relative">
      <div className="container mx-auto px-6 relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4">
            <span className="text-muted-foreground">&lt;</span>
            Honours &amp; Awards
            <span className="text-muted-foreground">/&gt;</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <SectionCard
            heading="Patents"
            bracketLeft="["
            bracketRight="]"
            items={patents}
          />
          <SectionCard
            heading="Academic Publications"
            bracketLeft="<"
            bracketRight=">"
            items={publications}
          />
          <SectionCard
            heading="Media"
            bracketLeft="{"
            bracketRight="}"
            items={media}
          />
          <SectionCard
            heading="Awards and Industry Recognition"
            bracketLeft="/"
            bracketRight="/"
            items={awards}
          />
        </div>
      </div>
    </section>
  );
};
