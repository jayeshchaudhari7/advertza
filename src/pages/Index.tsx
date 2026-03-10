import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import ProblemSection from "@/components/home/ProblemSection";
import ServicesGrid from "@/components/home/ServicesGrid";
import ProcessSection from "@/components/home/ProcessSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import BlogSection from "@/components/home/BlogSection";
import CTASection from "@/components/home/CTASection";
import SEOHead from "@/components/SEOHead";

const Index = () => (
  <>
    <SEOHead
      title="Advertza — Performance Marketing Agency | UK & India"
      description="Advertza is a performance-driven digital marketing agency helping brands scale profitably across Google, Meta, TikTok, Amazon & more. Offices in UK & India."
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Advertza — Performance Marketing Agency",
        "description": "Full-funnel digital marketing across Google, Meta, TikTok, Amazon & more.",
        "url": "https://advertza.com/",
      }}
    />
    <Header />
    <main>
      <HeroSection />
      <ProblemSection />
      <ServicesGrid />
      <ProcessSection />
      <TestimonialsSection />
      <FAQSection />
      <BlogSection />
      <CTASection />
    </main>
    <Footer />
  </>
);

export default Index;
