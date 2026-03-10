import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useBlogStore } from "@/hooks/useBlogStore";

const BlogPost = () => {
  const { slug } = useParams();
  const { publishedPosts } = useBlogStore();
  const post = publishedPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <>
        <Header />
        <main className="py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Post not found</h1>
          <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">
            ← Back to Blog
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  // Content is stored as newline-separated text; split for rendering
  const contentBlocks = post.content.split("\n").filter(Boolean);

  return (
    <>
      <Header />
      <main>
        <article className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <Link
                to="/blog"
                className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Blog
              </Link>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {post.category}
                </span>
                <h1 className="mb-4 text-3xl font-extrabold leading-tight text-foreground md:text-4xl lg:text-5xl">
                  {post.title}
                </h1>
                <p className="mb-8 text-sm text-muted-foreground">
                  {post.date} · {post.readTime}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="prose prose-lg max-w-none"
              >
                {contentBlocks.map((block, i) => {
                  if (block.startsWith("## ")) {
                    return (
                      <h2 key={i} className="mb-4 mt-10 text-xl font-bold text-foreground md:text-2xl">
                        {block.replace("## ", "")}
                      </h2>
                    );
                  }
                  return (
                    <p key={i} className="mb-5 leading-relaxed text-muted-foreground">
                      {block}
                    </p>
                  );
                })}
              </motion.div>

              {/* Related Posts */}
              <div className="mt-16 border-t border-border pt-10">
                <h3 className="mb-6 text-xl font-bold text-foreground">Related Articles</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {publishedPosts
                    .filter((p) => p.slug !== post.slug && p.category === post.category)
                    .slice(0, 2)
                    .map((related) => (
                      <Link
                        key={related.slug}
                        to={`/blog/${related.slug}`}
                        className="group rounded-xl border border-border bg-background p-5 transition-shadow hover:shadow-lg"
                      >
                        <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {related.category}
                        </span>
                        <h4 className="mb-1 text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {related.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{related.date} · {related.readTime}</p>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default BlogPost;
