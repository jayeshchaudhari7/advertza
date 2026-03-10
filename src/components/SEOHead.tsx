import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: object;
}

/**
 * SEOHead — Sets document title, meta description, canonical, and optional JSON-LD per page.
 * Usage: Drop <SEOHead title="..." description="..." /> at the top of any page component.
 */
const SEOHead = ({ title, description, canonical, ogImage, ogType = "website", jsonLd }: SEOHeadProps) => {
  const { pathname } = useLocation();
  const fullTitle = title.includes("Advertza") ? title : `${title} | Advertza`;
  const url = canonical || `https://advertza.com${pathname}`;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;

    // OG tags
    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta("og:title", fullTitle);
    setMeta("og:description", description);
    setMeta("og:url", url);
    setMeta("og:type", ogType);
    if (ogImage) setMeta("og:image", ogImage);

    // JSON-LD
    const existingScript = document.querySelector('script[data-seo-jsonld]');
    if (existingScript) existingScript.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "true");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [fullTitle, description, url, ogType, ogImage, jsonLd]);

  return null;
};

export default SEOHead;
