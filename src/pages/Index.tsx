import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Projects from "@/components/site/Projects";
import Services from "@/components/site/Services";
import Testimonials from "@/components/site/Testimonials";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import { useReveal } from "@/hooks/useReveal";

const Index = () => {
  useReveal();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
