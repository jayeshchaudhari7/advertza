import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import SEOHead from "@/components/SEOHead";

const Contact = () => {
  return (
    <>
      <SEOHead
        title="Contact Advertza — Free Marketing Audit"
        description="Get a free, no-obligation marketing audit from Advertza. Schedule a consultation call with our experts. Offices in Surat, India & UK."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Advertza",
          "url": "https://advertza.com/contact",
        }}
      />
      <Header />
      <main>
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Contact Us</p>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-4xl font-extrabold text-foreground md:text-5xl">
                Let's Grow Together
              </motion.h1>
              <p className="text-muted-foreground">Get your free, no-obligation audit. We'll respond within 24 hours.</p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-5">
              {/* Consultation Form */}
              <div className="lg:col-span-3">
                <ConsultationForm className="border-0 p-0 shadow-none" />
              </div>

              {/* Info */}
              <div className="space-y-8 lg:col-span-2">
                <div className="rounded-xl border border-border p-6">
                  <h3 className="mb-4 text-lg font-bold text-foreground">Get In Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">India</p>
                        <p className="text-sm text-muted-foreground">16, Sai Baba Society, Pandesara, Surat</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">UK</p>
                        <p className="text-sm text-muted-foreground">United Kingdom</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <a href="tel:+919725487887" className="block text-sm text-muted-foreground hover:text-primary">🇮🇳 +91 97254 87887</a>
                        <a href="tel:+447442193744" className="block text-sm text-muted-foreground hover:text-primary">🇬🇧 +44 7442 193744</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 shrink-0 text-primary" />
                      <a href="mailto:hello@advertza.com" className="text-sm text-muted-foreground hover:text-primary">hello@advertza.com</a>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-charcoal p-6">
                  <h3 className="mb-2 text-lg font-bold text-primary-foreground">Free Audit Includes:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ Campaign performance review</li>
                    <li>✓ Competitor analysis</li>
                    <li>✓ Growth opportunity report</li>
                    <li>✓ Custom strategy recommendations</li>
                    <li>✓ 30-minute consultation call</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
