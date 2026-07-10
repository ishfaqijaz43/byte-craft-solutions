import React, { useState, useEffect } from "react";
import { 
  Code, 
  Server, 
  Zap, 
  Database, 
  Smartphone, 
  Laptop, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Mail, 
  Plus, 
  Minus, 
  Menu, 
  X, 
  DollarSign, 
  Clock, 
  Shield, 
  Activity, 
  TrendingUp, 
  ShoppingBag, 
  Award, 
  Sparkles, 
  Check, 
  Lock, 
  Coffee, 
  Terminal, 
  Sliders,
  ExternalLink,
  ThumbsUp,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { MadeWithDyad } from "@/components/made-with-dyad";

// Define mock menu items for the interactive restaurant app simulator
const RESTAURANT_MENU = [
  { id: "r1", name: "Gourmet Kabab Roll", price: 5.99, category: "Rolls", rating: 4.9, img: "🌯" },
  { id: "r2", name: "Double Beef Smash Burger", price: 7.99, category: "Burgers", rating: 4.8, img: "🍔" },
  { id: "r3", name: "Cheesy Hot Garlic Fries", price: 3.49, category: "Sides", rating: 4.7, img: "🍟" },
  { id: "r4", name: "Avocado Green Salad", price: 4.99, category: "Sides", rating: 4.6, img: "🥗" }
];

// Define Initial Orders in Admin Dashboard
const INITIAL_ORDERS = [
  { id: "1041", items: "1x Double Beef Smash Burger, 1x Cheesy Hot Garlic Fries", total: 11.48, status: "Pending", time: "2 mins ago" },
  { id: "1040", items: "2x Gourmet Kabab Roll", total: 11.98, status: "Cooking", time: "10 mins ago" },
];

export default function Index() {
  const { toast } = useToast();
  
  // Mobile menu open/close state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --------------------------------------------------------
  // 2. INTERACTIVE RESTAURANT PLATFORM SIMULATOR STATE & LOGIC
  // --------------------------------------------------------
  const [activeSimulatorTab, setActiveSimulatorTab] = useState<"customer" | "admin" | "metrics">("customer");
  
  // Customer Cart state
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [simulatorOrders, setSimulatorOrders] = useState<any[]>(INITIAL_ORDERS);
  const [totalRevenue, setTotalRevenue] = useState(1424.80);
  const [isOrdering, setIsOrdering] = useState(false);

  const updateCartQuantity = (id: string, amount: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = current + amount;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((acc, [id, qty]) => {
    const item = RESTAURANT_MENU.find(m => m.id === id);
    return acc + (item ? item.price * qty : 0);
  }, 0);

  const handlePlaceSimulatorOrder = () => {
    if (cartItemCount === 0) return;
    
    setIsOrdering(true);
    setTimeout(() => {
      // Build order description
      const orderItemsStr = Object.entries(cart).map(([id, qty]) => {
        const item = RESTAURANT_MENU.find(m => m.id === id);
        return `${qty}x ${item?.name}`;
      }).join(", ");

      const newOrder = {
        id: (1042 + simulatorOrders.length).toString(),
        items: orderItemsStr,
        total: parseFloat(cartTotal.toFixed(2)),
        status: "Pending",
        time: "Just now"
      };

      setSimulatorOrders(prev => [newOrder, ...prev]);
      setCart({});
      setIsOrdering(false);
      
      toast({
        title: "🍔 Simulator Order Sent!",
        description: "Switch to the 'Merchant Admin Panel' tab above to see and manage your live order!",
        className: "bg-emerald-950 text-emerald-100 border border-emerald-500 rounded-2xl"
      });
    }, 900);
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: string) => {
    setSimulatorOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        // If completing, add to simulated total revenue
        if (nextStatus === "Delivered") {
          setTotalRevenue(r => r + o.total);
          toast({
            title: "🎉 Simulated Order Completed!",
            description: `Added $${o.total} to merchant revenue tracker.`,
            className: "bg-cyan-950 text-cyan-100 border border-cyan-500 rounded-2xl"
          });
        }
        return { ...o, status: nextStatus };
      }
      return o;
    }));
  };

  // --------------------------------------------------------
  // 3. CONTACT FORM STATE & LOGIC
  // --------------------------------------------------------
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    projectType: "business",
    message: ""
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const [submissionStep, setSubmissionStep] = useState("");

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) errors.message = "Please tell us a bit about your project";
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({
        title: "⚠️ Validation Failed",
        description: "Please check the required fields in the form.",
        variant: "destructive",
        className: "rounded-2xl"
      });
      return;
    }

    // Trigger high-fidelity submission sequence simulator
    setFormSubmitting(true);
    setSubmissionProgress(10);
    setSubmissionStep("Analyzing request parameters...");

    const steps = [
      { progress: 35, text: "Mapping serverless deployment nodes..." },
      { progress: 65, text: "Allocating dedicated developer timeline slots..." },
      { progress: 90, text: "Generating custom quote and direct connection bridges..." },
      { progress: 100, text: "Secure handshake complete!" }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setSubmissionProgress(step.progress);
        setSubmissionStep(step.text);
        if (step.progress === 100) {
          setTimeout(() => {
            setFormSubmitting(false);
            setFormSubmitted(true);
            toast({
              title: "🚀 Inquiry Received Successfully!",
              description: "Our core engineering team will contact you within 2 hours.",
              className: "bg-emerald-950 text-emerald-100 border border-emerald-500 rounded-2xl"
            });
          }, 600);
        }
      }, (index + 1) * 800);
    });
  };

  // WhatsApp & Mailto Quick Links
  const WHATSAPP_LINK = `https://wa.me/923123220078?text=${encodeURIComponent(
    "Hello ByteCraft Solutions, I visited your website and I am interested in building a custom ultra-fast website for my business."
  )}`;

  const EMAIL_LINK = "mailto:Bytecraft05@gmail.com?subject=Website%20Inquiry%20-%20ByteCraft%20Solutions";

  return (
    <div className="dark bg-[#0a0d14] text-slate-100 min-h-screen font-sans selection:bg-emerald-500/30 selection:text-emerald-200 antialiased overflow-x-hidden">
      
      {/* BACKGROUND GRAPHICS (Sleek Grid & Ambient Lights - Avoid full screen gradient) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-45" />
      
      {/* Subtle Glowing Spotlights */}
      <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-10 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] left-10 w-[450px] h-[450px] bg-emerald-500/5 blur-[130px] rounded-full pointer-events-none" />

      {/* --------------------------------------------------------
          1. NAVBAR SECTION
         -------------------------------------------------------- */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0d14]/80 border-b border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => scrollToSection("home")}>
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border border-emerald-500/50 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300">
                <Terminal className="w-5 h-5 text-emerald-400 group-hover:text-cyan-400 transition-colors" />
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-20 blur-sm transition-opacity" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:text-emerald-400 transition-colors">
                ByteCraft Solutions<span className="text-emerald-400 group-hover:text-cyan-400 font-extrabold">.</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection("home")} className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">Home</button>
              <button onClick={() => scrollToSection("services")} className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">Services</button>
              <button onClick={() => scrollToSection("portfolio")} className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">Our Work</button>
              <button onClick={() => scrollToSection("contact")} className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">Contact</button>
            </div>

            {/* CTA Button & Hamburger */}
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => scrollToSection("contact")}
                className="hidden sm:inline-flex rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold border-0 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5 transition-all duration-300 px-6"
              >
                Get a Quote
              </Button>

              {/* Hamburger Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-slate-800 transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-[#0a0d14]/95 border-b border-slate-800/90 backdrop-blur-lg animate-in fade-in slide-in-from-top-5 duration-200">
            <div className="px-4 py-6 space-y-4">
              <button onClick={() => scrollToSection("home")} className="block w-full text-left py-2 px-3 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-800/40 font-medium transition-all">Home</button>
              <button onClick={() => scrollToSection("services")} className="block w-full text-left py-2 px-3 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-800/40 font-medium transition-all">Services</button>
              <button onClick={() => scrollToSection("portfolio")} className="block w-full text-left py-2 px-3 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-800/40 font-medium transition-all">Our Work</button>
              <button onClick={() => scrollToSection("contact")} className="block w-full text-left py-2 px-3 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-800/40 font-medium transition-all">Contact</button>
              <div className="pt-2">
                <Button 
                  onClick={() => scrollToSection("contact")}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold border-0"
                >
                  Get a Quote
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* --------------------------------------------------------
          2. HERO SECTION
         -------------------------------------------------------- */}
      <section id="home" className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left z-10">
            
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.1)] mx-auto lg:mx-0 animate-pulse">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Premium Web Engineering & Architecture</span>
            </div>

            {/* Title / Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
              We Build <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(16,185,129,0.2)]">Ultra-Fast</span> Custom Web Solutions for Growing Businesses.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Blazing-fast loading speeds, custom admin dashboards, and <strong className="text-emerald-400 font-semibold">zero monthly hosting overhead</strong>. Tailored perfectly to your business needs without WordPress bloat or vendor lock-in.
            </p>

            {/* Dynamic Features Tickbar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 text-slate-400 text-sm">
              <span className="flex items-center gap-1.5 font-medium"><CheckCircle2 className="w-4.5 h-4.5 text-cyan-400" /> 100/100 Core Web Vitals</span>
              <span className="flex items-center gap-1.5 font-medium"><CheckCircle2 className="w-4.5 h-4.5 text-cyan-400" /> Zero Platform Fees</span>
              <span className="flex items-center gap-1.5 font-medium"><CheckCircle2 className="w-4.5 h-4.5 text-cyan-400" /> Complete Ownership</span>
            </div>

            {/* CTA Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a 
                href={WHATSAPP_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all duration-300 shadow-[0_4px_25px_rgba(16,185,129,0.35)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.5)] transform hover:-translate-y-1"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                Chat on WhatsApp
              </a>
              <button 
                onClick={() => scrollToSection("portfolio")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-100 font-semibold border border-slate-700 hover:border-slate-500 transition-all duration-300 transform hover:-translate-y-1"
              >
                <span>View Our Work</span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>

          </div>

          {/* Right Immersive Illustration/Graphics Column */}
          <div className="lg:col-span-5 relative w-full h-[320px] sm:h-[400px] lg:h-[480px] flex items-center justify-center z-10">
            
            {/* High Tech Animated Grid/Circuits Mock Container */}
            <div className="relative w-full max-w-md aspect-square bg-slate-950/60 border border-emerald-500/20 rounded-3xl overflow-hidden p-6 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl group">
              
              {/* Internal Glowing Lines */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent" />
              <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-400/50 to-transparent" />

              {/* Interactive Dashboard / Performance Ring Mockup */}
              <div className="relative w-full h-full flex flex-col justify-between space-y-4">
                
                {/* Simulated Server Info Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">ByteCraft Engine Live</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                    <span>US-EAST-1 Edge</span>
                  </div>
                </div>

                {/* Main Visual: Pulsing Performance Score */}
                <div className="flex-1 flex flex-col items-center justify-center relative my-4">
                  
                  {/* Glowing core circles */}
                  <div className="absolute w-44 h-44 rounded-full border border-dashed border-emerald-500/20 animate-spin" style={{ animationDuration: '40s' }} />
                  <div className="absolute w-36 h-36 rounded-full border border-dashed border-cyan-500/30 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
                  
                  <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-950 to-cyan-950 border border-emerald-500/50 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <span className="text-3xl font-black font-mono text-emerald-300">100</span>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono">Performance</span>
                  </div>

                  {/* Tiny Orbiting Icons */}
                  <div className="absolute top-4 left-6 p-2 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-emerald-400 shadow-md">
                    <Zap className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="absolute bottom-6 right-6 p-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-cyan-400 shadow-md">
                    <Server className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="absolute top-12 right-4 p-2 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-emerald-400 shadow-md">
                    <Database className="w-4 h-4" />
                  </div>

                </div>

                {/* Real-time stats ticker at the bottom */}
                <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                    <span>First Contentful Paint</span>
                    <span className="text-emerald-400 font-bold">0.18s</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full w-[95%] rounded-full" />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>Serverless TTFB</span>
                    <span className="text-cyan-400 font-semibold">24ms (Ultra Edge)</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Absolute Decorative Floating Elements */}
            <div className="absolute top-4 right-1/4 bg-slate-900 border border-slate-800/80 text-slate-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>React Router & Next.js Specs</span>
            </div>
            
          </div>

        </div>
      </section>

      {/* --------------------------------------------------------
          3. SERVICES SECTION
         -------------------------------------------------------- */}
      <section id="services" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0d14] border-t border-slate-900">
        
        {/* Glowing Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <Badge className="px-3 py-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15 border border-emerald-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
              WHAT WE DO BEST
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Crafting Digital Solutions That Drive Exponential Growth
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mx-auto" />
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              Our engineering philosophy prioritizes performance, security, and developer craftsmanship. No bloat, no overhead, just speed and utility.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            
            {/* Card 1 */}
            <Card className="bg-slate-900/40 border-slate-800/80 hover:border-emerald-500/50 backdrop-blur-md rounded-3xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] group flex flex-col justify-between overflow-hidden">
              <CardHeader className="p-8 pb-4 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-bl-3xl transition-opacity duration-300" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Code className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Custom Web Applications
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm leading-relaxed pt-2">
                  We build lightweight web systems utilizing React, Next.js, and serverless stacks. Optimized for unparalleled speeds, maximum component reuse, and future-proof design systems.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 flex-1">
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> SPA and Headless Solutions</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> High-fidelity UI using Tailwind CSS</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Real-time state management & data streams</li>
                </ul>
              </CardContent>
              <CardFooter className="p-8 pt-0 border-t border-slate-800/50 mt-auto flex items-center justify-between">
                <button
                  onClick={() => scrollToSection("starter-package")}
                  className="text-xs font-semibold text-emerald-400 hover:text-cyan-400 flex items-center gap-1.5 group/btn"
                >
                  Request custom app proposal <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <div className="flex gap-1.5">
                  <Badge variant="outline" className="bg-slate-950 text-slate-400 text-[10px] py-0 px-2 rounded-md border-slate-800">React</Badge>
                  <Badge variant="outline" className="bg-slate-950 text-slate-400 text-[10px] py-0 px-2 rounded-md border-slate-800">NextJS</Badge>
                </div>
              </CardFooter>
            </Card>

            {/* Card 2 */}
            <Card className="bg-slate-900/40 border-slate-800/80 hover:border-cyan-500/50 backdrop-blur-md rounded-3xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)] group flex flex-col justify-between overflow-hidden">
              <CardHeader className="p-8 pb-4 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-bl-3xl transition-opacity duration-300" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/10 to-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Laptop className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Dedicated Admin Dashboards
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm leading-relaxed pt-2">
                  Gain complete power over your metrics, inventory, data, and user bases with fully bespoke responsive admin management suites. Tailored specifically to align with internal workflows.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 flex-1">
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Direct inventory & customer tracking</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Secure user role hierarchies</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Integrated dynamic reports & CSV exports</li>
                </ul>
              </CardContent>
              <CardFooter className="p-8 pt-0 border-t border-slate-800/50 mt-auto flex items-center justify-between">
                <button
                  onClick={() => scrollToSection("starter-package")}
                  className="text-xs font-semibold text-cyan-400 hover:text-emerald-400 flex items-center gap-1.5 group/btn"
                >
                  Request custom dashboard proposal <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <div className="flex gap-1.5">
                  <Badge variant="outline" className="bg-slate-950 text-slate-400 text-[10px] py-0 px-2 rounded-md border-slate-800">Admin</Badge>
                  <Badge variant="outline" className="bg-slate-950 text-slate-400 text-[10px] py-0 px-2 rounded-md border-slate-800">Metrics</Badge>
                </div>
              </CardFooter>
            </Card>

            {/* Card 3 */}
            <Card className="bg-slate-900/40 border-slate-800/80 hover:border-cyan-500/50 backdrop-blur-md rounded-3xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)] group flex flex-col justify-between overflow-hidden">
              <CardHeader className="p-8 pb-4 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-bl-3xl transition-opacity duration-300" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/10 to-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  High-Converting Landing Pages
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm leading-relaxed pt-2">
                  Clean, fast single-page marketing funnels built for local service companies and growing startups. Crafted with deep SEO engineering guidelines to maximize Google rankings and conversions.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 flex-1">
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> 100/100 Lighthouse performance metrics</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Optimized lead-capture forms & CTA triggers</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Fully responsive across all display formats</li>
                </ul>
              </CardContent>
              <CardFooter className="p-8 pt-0 border-t border-slate-800/50 mt-auto flex items-center justify-between">
                <button
                  onClick={() => scrollToSection("starter-package")}
                  className="text-xs font-semibold text-cyan-400 hover:text-emerald-400 flex items-center gap-1.5 group/btn"
                >
                  Request landing page proposal <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <div className="flex gap-1.5">
                  <Badge variant="outline" className="bg-slate-950 text-slate-400 text-[10px] py-0 px-2 rounded-md border-slate-800">SEO-Optimized</Badge>
                  <Badge variant="outline" className="bg-slate-950 text-slate-400 text-[10px] py-0 px-2 rounded-md border-slate-800">High-ROI</Badge>
                </div>
              </CardFooter>
            </Card>

            {/* Card 4 */}
            <Card className="bg-slate-900/40 border-slate-800/80 hover:border-emerald-500/50 backdrop-blur-md rounded-3xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] group flex flex-col justify-between overflow-hidden">
              <CardHeader className="p-8 pb-4 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-bl-3xl transition-opacity duration-300" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Server className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Cloud Deployment & Setup
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm leading-relaxed pt-2">
                  Say goodbye to expensive monthly web-hosting platform fees. We implement serverless configurations (Vercel, Netlify, Cloudflare CDN Edge, AWS Lambda) which operate permanently with zero base platform fees.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 flex-1">
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> CDN Edge distribution</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Cloudflare DDoS & security locks</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Auto-scaling database integrations</li>
                </ul>
              </CardContent>
              <CardFooter className="p-8 pt-0 border-t border-slate-800/50 mt-auto flex items-center justify-between">
                <button
                  onClick={() => scrollToSection("starter-package")}
                  className="text-xs font-semibold text-emerald-400 hover:text-cyan-400 flex items-center gap-1.5 group/btn"
                >
                  Request serverless setup proposal <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <div className="flex gap-1.5">
                  <Badge variant="outline" className="bg-slate-950 text-slate-400 text-[10px] py-0 px-2 rounded-md border-slate-800">Serverless</Badge>
                  <Badge variant="outline" className="bg-slate-950 text-slate-400 text-[10px] py-0 px-2 rounded-md border-slate-800">$0/mo base</Badge>
                </div>
              </CardFooter>
            </Card>

          </div>

        </div>
      </section>

      {/* --------------------------------------------------------
          4. NEW STARTER PACKAGE SECTION
         -------------------------------------------------------- */}
      <section id="starter-package" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0d14]/70 border-t border-slate-900">
        
        {/* Glow Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <Badge className="px-3 py-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15 border border-emerald-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
              STARTER PACKAGE
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Start Building Your Dream With Us From Only PKR 30,000
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mx-auto" />
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
              An all-inclusive, complete package with absolutely no hidden charges. Everything you need to launch your premium web presence.
            </p>
          </div>

          {/* Features Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            
            {/* Feature Card 1 */}
            <Card className="bg-slate-900/40 border-slate-800/80 hover:border-emerald-500/50 backdrop-blur-md rounded-3xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] group flex flex-col justify-between overflow-hidden">
              <CardHeader className="p-8 pb-4 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-bl-3xl transition-opacity duration-300" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Full Custom Website Development
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm leading-relaxed pt-2">
                  Tailored to your business layout with premium design and functionality.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 flex-1">
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Custom design system</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Responsive layouts</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> SEO-optimized structure</li>
                </ul>
              </CardContent>
              <CardFooter className="p-8 pt-0 border-t border-slate-800/50 mt-auto">
                <span className="text-xs font-semibold text-emerald-400">Included in Package</span>
              </CardFooter>
            </Card>

            {/* Feature Card 2 */}
            <Card className="bg-slate-900/40 border-slate-800/80 hover:border-cyan-500/50 backdrop-blur-md rounded-3xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)] group flex flex-col justify-between overflow-hidden">
              <CardHeader className="p-8 pb-4 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-bl-3xl transition-opacity duration-300" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/10 to-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Free Domain Registration
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm leading-relaxed pt-2">
                  .com or local extension included at no extra cost.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 flex-1">
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Domain privacy protection</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Free SSL certificate</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> 24/7 DNS support</li>
                </ul>
              </CardContent>
              <CardFooter className="p-8 pt-0 border-t border-slate-800/50 mt-auto">
                <span className="text-xs font-semibold text-emerald-400">Included in Package</span>
              </CardFooter>
            </Card>

            {/* Feature Card 3 */}
            <Card className="bg-slate-900/40 border-slate-800/80 hover:border-emerald-500/50 backdrop-blur-md rounded-3xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] group flex flex-col justify-between overflow-hidden">
              <CardHeader className="p-8 pb-4 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-bl-3xl transition-opacity duration-300" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  High-Speed Premium Cloud Hosting Setup
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm leading-relaxed pt-2">
                  Serverless architecture with global CDN edge distribution for blazing-fast performance.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 flex-1">
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Zero monthly platform fees</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Global CDN edge caching</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Automatic scaling</li>
                </ul>
              </CardContent>
              <CardFooter className="p-8 pt-0 border-t border-slate-800/50 mt-auto">
                <span className="text-xs font-semibold text-emerald-400">Included in Package</span>
              </CardFooter>
            </Card>

            {/* Feature Card 4 */}
            <Card className="bg-slate-900/40 border-slate-800/80 hover:border-cyan-500/50 backdrop-blur-md rounded-3xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)] group flex flex-col justify-between overflow-hidden">
              <CardHeader className="p-8 pb-4 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-bl-3xl transition-opacity duration-300" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/10 to-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Dedicated Admin Dashboard
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm leading-relaxed pt-2">
                  Full control over your products, content, and data with an intuitive management interface.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 flex-1">
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Easy content management</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Product/inventory control</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> User-friendly interface</li>
                </ul>
              </CardContent>
              <CardFooter className="p-8 pt-0 border-t border-slate-800/50 mt-auto">
                <span className="text-xs font-semibold text-emerald-400">Included in Package</span>
              </CardFooter>
            </Card>

            {/* Feature Card 5 */}
            <Card className="bg-slate-900/40 border-slate-800/80 hover:border-emerald-500/50 backdrop-blur-md rounded-3xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] group flex flex-col justify-between overflow-hidden">
              <CardHeader className="p-8 pb-4 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-bl-3xl transition-opacity duration-300" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Zero Monthly Platform Fees
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm leading-relaxed pt-2">
                  Pay once, run forever on serverless architecture with no recurring hosting costs.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 flex-1">
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> No subscription fees</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> One-time payment only</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Lifetime ownership</li>
                </ul>
              </CardContent>
              <CardFooter className="p-8 pt-0 border-t border-slate-800/50 mt-auto">
                <span className="text-xs font-semibold text-emerald-400">Included in Package</span>
              </CardFooter>
            </Card>

            {/* Feature Card 6 */}
            <Card className="bg-slate-900/40 border-slate-800/80 hover:border-cyan-500/50 backdrop-blur-md rounded-3xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)] group flex flex-col justify-between overflow-hidden">
              <CardHeader className="p-8 pb-4 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-bl-3xl transition-opacity duration-300" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/10 to-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Complete End-to-End Deployment & Launch Setup
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm leading-relaxed pt-2">
                  Full deployment, testing, and launch with complete documentation and handoff.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 flex-1">
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Production deployment</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Testing & QA</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Documentation & handoff</li>
                </ul>
              </CardContent>
              <CardFooter className="p-8 pt-0 border-t border-slate-800/50 mt-auto">
                <span className="text-xs font-semibold text-emerald-400">Included in Package</span>
              </CardFooter>
            </Card>

          </div>

          {/* CTA Button Section */}
          <div className="text-center mt-16">
            <a 
              href="https://wa.me/923123220078?text=Hello%20ByteCraft%20Solutions,%20I%20am%20interested%20in%20your%20PKR%2030,000%20All-In-One%20Web%20Package.%20Let's%20discuss!" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-lg shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>Order This Package</span>
            </a>
          </div>

        </div>
      </section>

      {/* --------------------------------------------------------
          5. PORTFOLIO / FEATURED WORK PLACEHOLDER & LIVE MOCKUP SIMULATOR
         -------------------------------------------------------- */}
      <section id="portfolio" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0d14] border-t border-slate-900">
        
        {/* Glow Element */}
        <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <Badge className="px-3 py-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15 border border-emerald-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
              OUR LATEST PROJECTS
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Crafting Live High-Performance Case Studies
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mx-auto" />
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              We build systems, not generic themes. Look under the hood of our latest live full-stack restaurant delivery solution below.
            </p>
          </div>

          {/* Interactive Case Study Simulated Grid Card */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Header info panel */}
            <div className="p-6 sm:p-8 border-b border-slate-800 bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-mono text-xs rounded-md">Live Platform Case Study</Badge>
                  <Badge className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 font-mono text-xs rounded-md">Interactive Demo</Badge>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">Hot N Tasty Roll</h3>
                <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
                  A high-velocity food delivery web architecture, customer order checkout menu, and merchant operations dashboard. Built with React and Vercel serverless functions.
                </p>
              </div>

              {/* Quick WhatsApp/Direct Launch button */}
              <div className="shrink-0">
                <a 
                  href={WHATSAPP_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 transition-all text-xs font-bold"
                >
                  <span>Request Platform Like This</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Simulated Simulator Layout: Tabs Navigation */}
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              
              {/* Tabs Switcher */}
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveSimulatorTab("customer")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
                    activeSimulatorTab === "customer" 
                      ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>1. Customer App Simulator</span>
                </button>

                <button 
                  onClick={() => setActiveSimulatorTab("admin")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
                    activeSimulatorTab === "admin" 
                      ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>2. Merchant Admin Panel</span>
                  {simulatorOrders.filter(o => o.status === "Pending").length > 0 && (
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
                  )}
                </button>

                <button 
                  onClick={() => setActiveSimulatorTab("metrics")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
                    activeSimulatorTab === "metrics" 
                      ? "bg-slate-100 text-slate-950 shadow-md" 
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>3. System Core Performance</span>
                </button>
              </div>

              {/* Hint badge */}
              <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-400/90 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Interact below to test full-stack live connections</span>
              </div>
            </div>

            {/* simulator tab contents */}
            <div className="p-4 sm:p-8 bg-[#0a0d14]/40 min-h-[420px]">
              
              {/* TAB 1: CUSTOMER APP VIEW */}
              {activeSimulatorTab === "customer" && (
                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
                 
                  {/* Left Column: Menu Items */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase font-mono text-slate-500 tracking-wider">Restaurant Food Menu</span>
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-semibold">Active Checkout Simulator</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {RESTAURANT_MENU.map(item => {
                        const qty = cart[item.id] || 0;
                        return (
                          <div 
                            key={item.id}
                            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-200"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1">
                                <span className="text-2xl" role="img" aria-label={item.name}>{item.img}</span>
                                <h4 className="font-bold text-sm text-slate-200">{item.name}</h4>
                                <p className="text-xs text-slate-500 font-medium">{item.category}</p>
                              </div>
                              <span className="text-sm font-mono font-bold text-emerald-400">${item.price}</span>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/60">
                              <span className="text-xs font-mono text-slate-500">Rating: ⭐{item.rating}</span>
                              
                              {qty > 0 ? (
                                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-1.5 py-0.5">
                                  <button 
                                    onClick={() => updateCartQuantity(item.id, -1)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="text-xs font-bold font-mono text-slate-200 w-4 text-center">{qty}</span>
                                  <button 
                                    onClick={() => updateCartQuantity(item.id, 1)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-900"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <Button 
                                  onClick={() => updateCartQuantity(item.id, 1)}
                                  className="h-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3 border-0"
                                >
                                  Add to Cart
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Checkout Basket */}
                  <div className="lg:col-span-5 bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6 space-y-6 shadow-md relative">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-[25px]" />
                    <h4 className="font-bold text-base text-white flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-emerald-400" />
                      <span>Delivery Basket</span>
                      {cartItemCount > 0 && (
                        <Badge className="bg-emerald-500 text-slate-950 font-bold ml-1">{cartItemCount}</Badge>
                      )}
                    </h4>

                    {cartItemCount === 0 ? (
                      <div className="text-center py-12 space-y-2">
                        <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto opacity-50" />
                        <p className="text-sm text-slate-400 font-medium">Your basket is empty.</p>
                        <p className="text-xs text-slate-600 max-w-xs mx-auto">Add a Gourmet Kabab Roll or Double Beef Burger to test the serverless database pipeline simulator.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        
                        {/* Selected Items lists */}
                        <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                          {Object.entries(cart).map(([id, qty]) => {
                            const item = RESTAURANT_MENU.find(m => m.id === id);
                            if (!item) return null;
                            return (
                              <div key={id} className="flex justify-between items-center text-xs text-slate-300">
                                <span className="font-medium">{qty}x {item.name}</span>
                                <span className="font-mono text-slate-400">${(item.price * qty).toFixed(2)}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Delivery fee, tax mockups */}
                        <div className="border-t border-slate-800 pt-3 space-y-1.5 text-xs text-slate-500 font-mono">
                          <div className="flex justify-between">
                            <span>Basket Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Delivery Platform Service</span>
                            <span className="text-emerald-400">Free ($0.00)</span>
                          </div>
                          <div className="flex justify-between font-bold text-slate-300 text-sm pt-2 border-t border-slate-800/50">
                            <span>Order Total</span>
                            <span className="text-emerald-400">${cartTotal.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Order Placement button */}
                        <Button 
                          onClick={handlePlaceSimulatorOrder}
                          disabled={isOrdering}
                          className="w-full py-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold shadow-lg border-0"
                        >
                          {isOrdering ? "Sending to Admin Dashboard..." : "Submit Order to Merchant Panel"}
                        </Button>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 2: MERCHANT ADMIN PANEL VIEW */}
              {activeSimulatorTab === "admin" && (
                <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
                 
                  {/* Top Dashboard Header Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   
                    {/* Metric 1 */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 font-mono uppercase font-semibold">Total Revenue Today</span>
                        <p className="text-lg font-mono font-extrabold text-cyan-400">${totalRevenue.toFixed(2)}</p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-cyan-400 opacity-80" />
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 font-mono uppercase font-semibold">Pending Orders</span>
                        <p className="text-lg font-mono font-extrabold text-amber-400">
                          {simulatorOrders.filter(o => o.status === "Pending").length} Orders
                        </p>
                      </div>
                      <Clock className="w-5 h-5 text-amber-400 opacity-80" />
                    </div>

                    {/* Metric 3 */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 font-mono uppercase font-semibold">Uptime Reliability</span>
                        <p className="text-lg font-mono font-extrabold text-emerald-400">100.0%</p>
                      </div>
                      <Shield className="w-5 h-5 text-emerald-400 opacity-80" />
                    </div>

                  </div>

                  {/* Orders Table Tracker */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                      <span className="text-xs uppercase font-mono text-slate-500 tracking-wider">Live Active Orders Pipeline</span>
                      <span className="text-[11px] text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full font-semibold">Real-Time Sync Ready</span>
                    </div>

                    <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                      {simulatorOrders.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 text-xs">
                          No orders in system pipeline yet. Place an order on the "Customer App Simulator" tab.
                        </div>
                      ) : (
                        simulatorOrders.map(order => (
                          <div 
                            key={order.id} 
                            className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:border-slate-800"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-slate-400">ORDER #{order.id}</span>
                                <span className="text-[10px] text-slate-600 font-mono">{order.time}</span>
                                
                                {/* Status Badges */}
                                {order.status === "Pending" && (
                                  <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md animate-pulse">Pending</span>
                                )}
                                {order.status === "Cooking" && (
                                  <span className="px-2 py-0.5 text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md">Cooking 🍳</span>
                                )}
                                {order.status === "Delivering" && (
                                  <span className="px-2 py-0.5 text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">Out for Delivery 🚀</span>
                                )}
                                {order.status === "Delivered" && (
                                  <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">Delivered ✅</span>
                                )}
                              </div>
                              <p className="text-xs font-medium text-slate-200">{order.items}</p>
                              <p className="text-xs font-mono text-slate-500">Subtotal: <strong className="text-slate-300 font-bold">${order.total}</strong></p>
                            </div>

                            {/* Action Buttons based on status */}
                            <div className="flex items-center gap-2">
                              {order.status === "Pending" && (
                                <Button 
                                  onClick={() => handleUpdateOrderStatus(order.id, "Cooking")}
                                  className="h-8 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold border-0 px-3"
                                >
                                  Accept Order
                                </Button>
                              )}
                              {order.status === "Cooking" && (
                                <Button 
                                  onClick={() => handleUpdateOrderStatus(order.id, "Delivering")}
                                  className="h-8 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-bold border-0 px-3"
                                >
                                  Mark Ready
                                </Button>
                              )}
                              {order.status === "Delivering" && (
                                <Button 
                                  onClick={() => handleUpdateOrderStatus(order.id, "Delivered")}
                                  className="h-8 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-bold border-0 px-3"
                                >
                                  Complete Delivery
                                </Button>
                              )}
                              {order.status === "Delivered" && (
                                <span className="text-[10px] font-mono text-slate-500 font-bold">Closed</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: SYSTEM CORE PERFORMANCE METRICS */}
              {activeSimulatorTab === "metrics" && (
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
                 
                  {/* Left Column: Lighthouse Speed Circles */}
                  <div className="md:col-span-5 flex flex-wrap justify-center gap-6">
                   
                    {/* Circle 1 */}
                    <div className="text-center space-y-1.5 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 w-28 h-28 flex flex-col justify-center items-center">
                      <div className="relative w-14 h-14 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <span className="text-base font-extrabold font-mono text-emerald-400">100</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Performance</span>
                    </div>

                    {/* Circle 2 */}
                    <div className="text-center space-y-1.5 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 w-28 h-28 flex flex-col justify-center items-center">
                      <div className="relative w-14 h-14 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <span className="text-base font-extrabold font-mono text-emerald-400">100</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">SEO Core</span>
                    </div>

                    {/* Circle 3 */}
                    <div className="text-center space-y-1.5 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 w-28 h-28 flex flex-col justify-center items-center">
                      <div className="relative w-14 h-14 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <span className="text-base font-extrabold font-mono text-emerald-400">100</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Best Practice</span>
                    </div>

                  </div>

                  {/* Right Column: Key Web Vitals Analysis */}
                  <div className="md:col-span-7 space-y-4">
                    <h4 className="font-bold text-base text-white">Why Hand-Crafted Code Crushes WordPress</h4>
                    
                    <div className="space-y-3 font-mono text-xs">
                     
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-900">
                        <div className="flex justify-between items-center text-slate-400 mb-1">
                          <span>First Contentful Paint (FCP)</span>
                          <span className="text-emerald-400 font-bold">0.24s (Extreme Green)</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full w-[98%]" />
                        </div>
                      </div>

                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-900">
                        <div className="flex justify-between items-center text-slate-400 mb-1">
                          <span>Time to Interactive (TTI)</span>
                          <span className="text-emerald-400 font-bold">0.31s (Instant Edge)</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full w-[97%]" />
                        </div>
                      </div>

                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-900">
                        <div className="flex justify-between items-center text-slate-400 mb-1">
                          <span>Cumulative Layout Shift (CLS)</span>
                          <span className="text-emerald-400 font-bold">0.00 (Perfect Layout)</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full w-[100%]" />
                        </div>
                      </div>

                    </div>

                    <p className="text-slate-400 text-xs leading-relaxed pt-2">
                      When your website loads instantly, customer dropoff rates plunge by up to 75%. Search engines like Google actively reward FCP times below 1 second with superior organic rankings. This platform achieves maximum metrics using static code generation and edge distribution.
                    </p>
                  </div>

                </div>
              )}

            </div>

            {/* Footer summary bar of case study */}
            <div className="px-6 py-5 bg-slate-950/60 border-t border-slate-800/80 text-slate-400 text-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <Coffee className="w-4.5 h-4.5 text-cyan-400" />
                <span>Engineered for zero base hosting bills with Supabase & Vercel serverless nodes.</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-slate-900 text-slate-300 border border-slate-800 text-[10px]">Real-time DB</Badge>
                <Badge variant="secondary" className="bg-slate-900 text-slate-300 border border-slate-800 text-[10px]">Edge Cache</Badge>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --------------------------------------------------------
          6. CONTACT & CALL TO ACTION (CTA) SECTION WITH FORM
         -------------------------------------------------------- */}
      <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0d14] border-t border-slate-900">
        
        {/* Glow Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
         
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <Badge className="px-3 py-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15 border border-emerald-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
              GET IN TOUCH
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Craft Your High-Performance Platform?
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mx-auto" />
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
              Secure your specialized web development slot today. Fill out our instant inquiry form below or connect directly via WhatsApp/Email.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           
            {/* Left Column: Form Info & Contact Options */}
            <div className="lg:col-span-5 space-y-8">
             
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white tracking-wide">Direct Connections</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Avoid long sales meetings and endless queues. Click one of our immediate communication bridges to speak directly with an engineering architect.
                </p>
              </div>

              {/* Instant Communication Bridges Card */}
              <div className="space-y-4">
               
                {/* WHATSAPP ACTION BUTTON */}
                <a 
                  href={WHATSAPP_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-emerald-500/20 hover:border-emerald-500/60 hover:bg-slate-900/80 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300 group select-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-6 h-6 fill-current" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>Chat on WhatsApp</span>
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </p>
                      <p className="text-xs text-slate-400">Response timeframe: ~5 minutes</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </a>

                {/* EMAIL ACTION BUTTON */}
                <a 
                  href={EMAIL_LINK}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-cyan-500/20 hover:border-cyan-500/60 hover:bg-slate-900/80 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300 group select-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">Direct Email Inquiry</p>
                      <p className="text-xs text-slate-400">Response timeframe: ~2 hours</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </a>

              </div>

              {/* Technical Guarantees lists */}
              <div className="bg-slate-950/60 rounded-3xl p-6 border border-slate-900 space-y-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold block">COOP OPERATION SPECS</span>
                
                <ul className="space-y-3 text-xs text-slate-300 font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Non-disclosure agreements executed instantly for enterprise concepts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Complete modular components handoff inside private Github repository.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Fully-documented setup guides with 1-click redeployment keys.</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Right Column: Custom Web Inquiry Form */}
            <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
             
              {formSubmitted ? (
                // SUCCESS STATE WITH INTERACTIVE CONTROLS
                <div className="text-center py-12 space-y-6 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <Check className="w-8 h-8 stroke-[3.5px]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-extrabold text-white">Inquiry Pipeline Opened!</h3>
                    <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-white">{formData.name}</strong>. Your custom inquiry parameters have bypassed regular screening and been assigned directly to an engineering lead.
                    </p>
                  </div>

                  <div className="bg-slate-950/80 rounded-2xl p-4 max-w-md mx-auto text-left border border-slate-900 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-slate-500">
                      <span>Assigned Engineer Slot</span>
                      <span className="text-emerald-400 font-bold">Priority Status Code: BCSF-2026</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Target Platform Type</span>
                      <span className="text-slate-300 capitalize">{formData.projectType} Spec</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                    <Button 
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({ name: "", email: "", businessName: "", projectType: "business", message: "" });
                      }}
                      variant="outline"
                      className="w-full sm:w-auto rounded-xl border-slate-700 text-slate-300 text-xs h-11"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                      Submit New Inquiry
                    </Button>

                    <a 
                      href={`https://wa.me/923123220078?text=${encodeURIComponent(
                        `Hi! I just submitted an inquiry form on ByteCraft Solutions as ${formData.name} for a ${formData.projectType} website.`
                      )}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                    >
                      <MessageSquare className="w-4 h-4 fill-current" />
                      Double Response Speed
                    </a>
                  </div>
                </div>
              ) : (
                // STANDARD INPUT FORM
                <form onSubmit={handleFormSubmit} className="space-y-6">
                 
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Your Name <span className="text-rose-500">*</span></label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all ${
                          formErrors.name ? "border-rose-500" : "border-slate-800"
                        }`}
                      />
                      {formErrors.name && <p className="text-[11px] text-rose-400 font-semibold">{formErrors.name}</p>}
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Email Address <span className="text-rose-500">*</span></label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all ${
                          formErrors.email ? "border-rose-500" : "border-slate-800"
                        }`}
                      />
                      {formErrors.email && <p className="text-[11px] text-rose-400 font-semibold">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Business/Org Name */}
                    <div className="space-y-2">
                      <label htmlFor="businessName" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Business / Organization Name</label>
                      <input 
                        type="text" 
                        id="businessName" 
                        name="businessName" 
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="E.g. Acme Inc"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
                      />
                    </div>

                    {/* Project Scope Dropdown */}
                    <div className="space-y-2">
                      <label htmlFor="projectType" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Project Scope</label>
                      <select 
                        id="projectType" 
                        name="projectType" 
                        value={formData.projectType}
                        onChange={handleInputChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all cursor-pointer"
                      >
                        <option value="landing">High-Converting Landing Page ($599+)</option>
                        <option value="business">Multi-Page Business Site ($1,199+)</option>
                        <option value="fullstack">Custom Full-Stack Web App ($2,499+)</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Tell Us About Your Project <span className="text-rose-500">*</span></label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="E.g. I need a custom restaurant platform like 'Hot N Tasty Roll' with an automated admin panel and quick WhatsApp orders integration. We are launching next month..."
                      className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all ${
                        formErrors.message ? "border-rose-500" : "border-slate-800"
                      }`}
                    />
                    {formErrors.message && <p className="text-[11px] text-rose-400 font-semibold">{formErrors.message}</p>}
                  </div>

                  {/* Submission triggers */}
                  <div className="pt-2">
                    {formSubmitting ? (
                      // SIMULATED PIPELINE LOADING MOCKUP
                      <div className="space-y-3 p-4 bg-slate-950 border border-slate-800 rounded-2xl animate-pulse">
                        <div className="flex justify-between items-center text-xs text-cyan-400 font-mono">
                          <span>{submissionStep}</span>
                          <span>{submissionProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${submissionProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <Button 
                        type="submit"
                        className="w-full py-6 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold border-0 shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Transmit Project Parameters</span>
                        <ArrowRight className="w-4 h-4 text-slate-950" />
                      </Button>
                    )}
                  </div>

                  <p className="text-center text-[11px] text-slate-500 font-mono">
                    🛡️ Enterprise-grade SSL Handshake. Your concept details are held completely confidential.
                  </p>

                </form>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* --------------------------------------------------------
          7. FREQUENTLY ASKED QUESTIONS (FAQ) SECTION
         -------------------------------------------------------- */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0d14]/80 border-t border-slate-900">
        <div className="max-w-4xl mx-auto relative z-10">
         
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <Badge className="px-3 py-1 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/15 border border-cyan-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
              HAVE QUESTIONS?
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Answering Your Essential Inquiries
            </h2>
            <div className="h-1.5 w-20 bg-gradient-to-r from-cyan-400 to-emerald-500 rounded-full mx-auto" />
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
           
            {/* FAQ Item 1 */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-colors">
              <h4 className="text-sm sm:text-base font-bold text-white mb-2">What does "zero monthly hosting overhead" mean?</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Traditional platforms like WordPress require monthly hosting fees to keep servers active. We write lightweight static React code distributed globally across Content Delivery Network (CDN) edge paths (like Cloudflare, Vercel, and Netlify). Their base service plans are 100% free forever for reasonable commercial volumes, meaning your server bills are literally $0.00 a month.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-colors">
              <h4 className="text-sm sm:text-base font-bold text-white mb-2">Do I fully own the code?</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Yes, absolutely. Once payment is complete, we transfer the complete software assets, including private Github repositories, component databases, design files, and administrative privileges. You have complete legal sovereignty over the systems we build.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-colors">
              <h4 className="text-sm sm:text-base font-bold text-white mb-2">Why is custom code better than templates or builders?</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                No WordPress plugins or Shopify templates achieve a perfect 100/100 Lighthouse performance. Because generic templates are bloated with legacy code, they are sluggish, prone to hacking vulnerabilities, and heavily restricted. Hand-crafted systems offer secure databases, instant loading, complete custom design control, and stellar organic Google SEO placement out of the box.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-colors">
              <h4 className="text-sm sm:text-base font-bold text-white mb-2">How long does a regular development project take?</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                High-converting landing pages take roughly 5-7 business days. Complex business portfolios take 10-14 days. Comprehensive custom full-stack software applications incorporating complete checkout models, custom admin systems, and user permissions take between 3 and 4 weeks. All targets are documented inside contracts with clear milestones.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* --------------------------------------------------------
          8. FOOTER SECTION
         -------------------------------------------------------- */}
      <footer className="bg-[#07090e] border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        
        {/* Ambient bottom line glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent blur-md" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
         
          {/* Logo & Brief Description */}
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 cursor-pointer group" onClick={() => scrollToSection("home")}>
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-emerald-500 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                ByteCraft Solutions<span className="text-emerald-400 font-extrabold">.</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Premium software engineering for growing brands. Ultra-fast speeds, bespoke admin controls, and zero platform overhead.
            </p>
          </div>

          {/* Quick Sitemap */}
          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400 font-medium">
            <button onClick={() => scrollToSection("home")} className="hover:text-emerald-400 transition-colors">Home</button>
            <button onClick={() => scrollToSection("services")} className="hover:text-emerald-400 transition-colors">Services</button>
            <button onClick={() => scrollToSection("portfolio")} className="hover:text-emerald-400 transition-colors">Featured Project</button>
            <button onClick={() => scrollToSection("contact")} className="hover:text-emerald-400 transition-colors">Contact</button>
          </div>

          {/* Copyright Info */}
          <div className="text-center md:text-right space-y-2">
            <p className="text-xs text-slate-500">
              © 2026 ByteCraft Solutions. All Rights Reserved.
            </p>
            <p className="text-[10px] text-slate-600 font-mono">
              Designed with supreme pixel precision.
            </p>
          </div>

        </div>
        
        {/* Mandatory credit badge included elegantly */}
        <div className="mt-8 flex justify-center border-t border-slate-900/50 pt-6">
          <MadeWithDyad />
        </div>
      </footer>

    </div>
  );
}