import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useBlogStore } from "@/hooks/useBlogStore";
import SEOHead from "@/components/SEOHead";

const categories = ["All", "Google Ads", "Meta Ads", "E-commerce", "Email Marketing", "Analytics", "TikTok Ads"];

const Blog = () => {
  const { publishedPosts } = useBlogStore();
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? publishedPosts : publishedPosts.filter(p => p.category === activeCategory);

  return (
    <>
      <SEOHead title="Blog — Digital Marketing Insights | Advertza" description="Read the latest insights on Google Ads, Meta Ads, e-commerce marketing, SEO, and more from Advertza's team of certified experts." />
      <Header />
      <main>
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Blog</p>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-4xl font-extrabold text-foreground md:text-5xl">
                Insights & Resources
              </motion.h1>
              <p className="text-muted-foreground">Expert strategies, case studies, and tips to grow your e-commerce brand.</p>
            </div>

            <div className="mx-auto mb-10 flex max-w-3xl flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-gold"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post, i) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex flex-col rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-lg"
                >
                  <span className="mb-3 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {post.category}
                  </span>
                  <h2 className="mb-2 text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs text-muted-foreground">{post.date} · {post.readTime}</span>
                    <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                      Read More <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
