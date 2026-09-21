import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Education } from '@/components/Education';
import { Experience } from '@/components/Experience';
import { Projects } from '@/components/Projects';
import { Certifications } from '@/components/Certifications';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { PortfolioEditor } from '@/components/PortfolioEditor';
import { SectionDivider } from '@/components/SectionDivider';
import { BackToTop } from '@/components/BackToTop';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <SectionDivider id="separator-about" />
      <About />
      <SectionDivider id="separator-skills" />
      <Skills />
      <SectionDivider id="separator-education" />
      <Education />
      <SectionDivider id="separator-experience" />
      <Experience />
      <SectionDivider id="separator-projects" />
      <Projects />
      <SectionDivider id="separator-certifications" />
      <Certifications />
      <SectionDivider id="separator-contact" />
      <Contact />
      <SectionDivider id="separator-footer" />
      <Footer />
      <PortfolioEditor />
      <BackToTop />
    </main>
  );
}
