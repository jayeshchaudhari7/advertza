import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import WhatsAppButton from "./components/WhatsAppButton";

// Eagerly load homepage for fast FCP
import Index from "./pages/Index";

// Lazy load all other pages
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Services = lazy(() => import("./pages/Services"));
const Industries = lazy(() => import("./pages/Industries"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Service pages
const GoogleAds = lazy(() => import("./pages/services/GoogleAds"));
const MetaAds = lazy(() => import("./pages/services/MetaAds"));
const TikTokAds = lazy(() => import("./pages/services/TikTokAds"));
const AmazonAds = lazy(() => import("./pages/services/AmazonAds"));
const MarketplaceAds = lazy(() => import("./pages/services/MarketplaceAds"));
const Shopify = lazy(() => import("./pages/services/Shopify"));
const WooCommerce = lazy(() => import("./pages/services/WooCommerce"));
const BigCommerce = lazy(() => import("./pages/services/BigCommerce"));
const Magento = lazy(() => import("./pages/services/Magento"));
const Analytics = lazy(() => import("./pages/services/Analytics"));
const EmailMarketing = lazy(() => import("./pages/services/EmailMarketing"));
const Creative = lazy(() => import("./pages/services/Creative"));
const CRO = lazy(() => import("./pages/services/CRO"));
const Influencer = lazy(() => import("./pages/services/Influencer"));

// Industry pages
const Fashion = lazy(() => import("./pages/industries/Fashion"));
const Beauty = lazy(() => import("./pages/industries/Beauty"));
const HomeGarden = lazy(() => import("./pages/industries/HomeGarden"));
const Electronics = lazy(() => import("./pages/industries/Electronics"));
const HealthWellness = lazy(() => import("./pages/industries/HealthWellness"));
const FoodBeverage = lazy(() => import("./pages/industries/FoodBeverage"));
const PetSupplies = lazy(() => import("./pages/industries/PetSupplies"));
const Jewelry = lazy(() => import("./pages/industries/Jewelry"));
const SportingGoods = lazy(() => import("./pages/industries/SportingGoods"));
const Custom = lazy(() => import("./pages/industries/Custom"));

// Admin pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));
const AdminInquiries = lazy(() => import("./pages/admin/AdminInquiries"));

// Admin providers (small, eager)
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import AdminLayout from "./components/admin/AdminLayout";

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ============ PUBLIC ROUTES ============ */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/services/google-ads" element={<GoogleAds />} />
            <Route path="/services/meta-ads" element={<MetaAds />} />
            <Route path="/services/tiktok-ads" element={<TikTokAds />} />
            <Route path="/services/amazon-ads" element={<AmazonAds />} />
            <Route path="/services/marketplace-ads" element={<MarketplaceAds />} />
            <Route path="/services/shopify" element={<Shopify />} />
            <Route path="/services/woocommerce" element={<WooCommerce />} />
            <Route path="/services/bigcommerce" element={<BigCommerce />} />
            <Route path="/services/magento" element={<Magento />} />
            <Route path="/services/analytics" element={<Analytics />} />
            <Route path="/services/email-marketing" element={<EmailMarketing />} />
            <Route path="/services/creative" element={<Creative />} />
            <Route path="/services/cro" element={<CRO />} />
            <Route path="/services/influencer" element={<Influencer />} />
            <Route path="/industries/fashion" element={<Fashion />} />
            <Route path="/industries/beauty" element={<Beauty />} />
            <Route path="/industries/home-garden" element={<HomeGarden />} />
            <Route path="/industries/electronics" element={<Electronics />} />
            <Route path="/industries/health-wellness" element={<HealthWellness />} />
            <Route path="/industries/food-beverage" element={<FoodBeverage />} />
            <Route path="/industries/pet-supplies" element={<PetSupplies />} />
            <Route path="/industries/jewelry" element={<Jewelry />} />
            <Route path="/industries/sporting-goods" element={<SportingGoods />} />
            <Route path="/industries/custom" element={<Custom />} />

            {/* ============ ADMIN ROUTES ============ */}
            <Route
              path="/admin/login"
              element={
                <AdminAuthProvider>
                  <AdminLogin />
                </AdminAuthProvider>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminAuthProvider>
                  <AdminLayout />
                </AdminAuthProvider>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="inquiries" element={<AdminInquiries />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
