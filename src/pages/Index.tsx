import { ConstellationBackground } from '@/components/ConstellationBackground';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { HonoursAwardsSection } from '../components/HonoursAwardsSection';
import { PortfolioSection } from '@/components/PortfolioSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <ConstellationBackground />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <HonoursAwardsSection />
        <PortfolioSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
