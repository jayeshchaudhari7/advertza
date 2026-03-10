import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";

const stats = [
  { value: "500+", label: "Campaigns Managed" },
  { value: "£12M+", label: "Ad Spend Managed" },
  { value: "3.8x", label: "Average ROAS" },
  { value: "200+", label: "Happy Clients" },
];

const HeroSection = () => (
  <section className="relative overflow-hidden bg-background">
    {/* Subtle background pattern */}
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
      backgroundSize: '40px 40px'
    }} />

    <div className="container relative py-16 md:py-24">
      <div className="grid items-start gap-10 lg:grid-cols-2">
        {/* Left — Copy */}
        <div className="flex flex-col justify-center pt-4 md:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm font-medium text-muted-foreground"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-primary" />
            Digital Marketing Agency — UK & India
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl"
          >
            Scale Your Revenue
            <br />
            <span className="text-gradient-gold">Not Just Your Ad Spend</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 max-w-lg text-lg text-muted-foreground"
          >
            We help eCommerce and D2C brands generate profitable growth through data-driven
            advertising across Google, Meta, TikTok, Amazon & more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-gold px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-gold transition-all hover:opacity-90"
            >
              Get Your Free Audit
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Our Services
            </Link>
          </motion.div>
        </div>

        {/* Right — Consultation Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ConsultationForm />
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-extrabold text-foreground md:text-4xl">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
