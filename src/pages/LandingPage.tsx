import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";



export default function LandingPage() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  
  return (

    <div className="bg-background text-on-surface antialiased font-body-md text-body-md min-h-screen selection:bg-secondary-fixed selection:text-on-secondary-fixed-variant">

      

{/*  TOP NAV BAR (Shared Component: TopNavBar web_header execution)  */}

<header className="bg-surface-container-lowest dark:bg-inverse-surface border-b border-outline-variant dark:border-outline shadow-sm sticky top-0 z-50">
  <div className="flex items-center justify-between w-full h-16 px-gutter max-w-7xl mx-auto">
    
    {/* Brand Logo */}
    <Link className="flex items-center gap-space-sm group" to="/login">
      <img alt="Brewlytics Logo" className="h-10 md:h-8 w-auto object-contain transition-transform group-hover:scale-102" src="/logo.png"/>
    </Link>

    {/* Desktop Navigation Links */}
    <nav className="hidden md:flex items-center gap-space-lg">
      <a className="text-on-surface-variant dark:text-outline-variant font-body-md text-body-md hover:text-primary dark:hover:text-inverse-primary transition-colors duration-150" href="#features">Features</a>
      <a className="text-on-surface-variant dark:text-outline-variant font-body-md text-body-md hover:text-primary dark:hover:text-inverse-primary transition-colors duration-150" href="#pricing">Pricing</a>
      <Link className="relative text-primary dark:text-inverse-primary font-title-md text-title-md flex items-center gap-1 hover:text-primary dark:hover:text-inverse-primary transition-colors duration-150" to="/login">
        Demo
        <span className="absolute -top-3 -right-6 text-[10px] font-bold text-red-600 animate-pulse tracking-widest uppercase">Live</span>
      </Link>
    </nav>

    {/* Desktop Trailing Actions */}
    <div className="hidden md:flex items-center gap-space-sm">
      <Link className="inline-flex items-center justify-center px-space-md py-2 rounded-lg text-on-surface font-title-md text-body-md bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant transition-colors duration-150" to="/login">
        Sign In
      </Link>
      <Link className="inline-flex items-center justify-center px-space-md py-2 rounded-lg text-on-primary font-title-md text-body-md bg-primary-container hover:bg-secondary active:scale-99 transition-all duration-150 shadow-sm" to="/login">
        Get Started
      </Link>
    </div>

    {/* Mobile Hamburger Menu */}
    <div className="md:hidden flex items-center">
      <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-on-surface">
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>
    </div>

  </div>
</header>

{/* MOBILE DRAWER OVERLAY */}
{isMobileMenuOpen && (
  <>
    <div className="fixed inset-0 bg-black/50 z-[90] md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
    <div className="fixed inset-x-0 top-0 w-full h-auto max-h-[65vh] overflow-y-auto rounded-b-3xl z-[100] bg-surface-container-lowest flex flex-col md:hidden border-b border-outline-variant shadow-2xl animate-in slide-in-from-top duration-200">
    <div className="flex items-center justify-between p-4 border-b border-outline-variant">
      <img alt="Brewlytics Logo" className="h-8 w-auto object-contain" src="/logo.png"/>
      <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-on-surface-variant hover:text-on-surface">
        <span className="material-symbols-outlined text-2xl">close</span>
      </button>
    </div>
    <div className="flex flex-col p-6 gap-6">
      <a href="#features" className="text-xl font-medium text-on-surface" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
      <a href="#pricing" className="text-xl font-medium text-on-surface" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
      <Link to="/login" className="text-xl font-bold text-primary flex items-center gap-2 relative w-max" onClick={() => setIsMobileMenuOpen(false)}>
        Demo
        <span className="text-[11px] font-bold text-red-600 animate-pulse tracking-widest uppercase">Live</span>
      </Link>
      
      <div className="mt-8 flex flex-col gap-4 border-t border-outline-variant/60 pt-8">
        <Link to="/login" className="w-full text-center py-3.5 rounded-xl border-2 border-primary text-primary font-title-md text-lg active:scale-99 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
          Sign In
        </Link>
        <Link to="/login" className="w-full text-center py-3.5 rounded-xl bg-primary text-on-primary font-title-md text-lg active:scale-99 shadow-md transition-all" onClick={() => setIsMobileMenuOpen(false)}>
          Get Started
        </Link>
      </div>
    </div>
  </div>
  </>
)}

{/*  HERO SECTION  */}

<section className="relative z-0 pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-outline-variant/40">

{/* Background Video */}
<video 
  autoPlay 
  loop 
  muted 
  playsInline 
  className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 pointer-events-none"
>
  <source src="/hero-bg.mp4" type="video/mp4" />
</video>

{/* Gradient Overlay for Text Readability */}
<div className="absolute inset-0 bg-background/40 z-0 pointer-events-none"></div>

{/*  Subtle Ambient Violet Light Wash  */}
<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-gradient-to-b from-secondary-fixed/50 via-surface-container/30 to-transparent blur-3xl pointer-events-none -z-10"></div>

<div className="relative z-10 max-w-7xl mx-auto px-gutter flex flex-col items-center text-center">

{/*  Tagline Pill  */}

<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/60 shadow-xs mb-6">

<span className="text-primary font-title-md text-label-md">✨ Know your café. Grow your business.</span>

<span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>

</div>

{/*  Hero Headline  */}

<h1 className="font-display text-display md:text-5xl text-on-surface max-w-4xl tracking-tight mb-6">

        Your café’s data analyst. <br className="hidden sm:inline"/>

<span className="text-primary-container">Without the analyst.</span>

</h1>

{/*  Hero Subheadline  */}

<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-8 leading-relaxed">

        Upload raw POS &amp; sales CSVs from Square, Toast, Clover, or Lightspeed. Unlock immediate AI recommendations on peak hours, dead stock, and profit margins.

      </p>

{/*  CTAs & Interaction Controls  */}

<div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-10">

<Link className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-on-primary bg-primary-container hover:bg-secondary font-title-md text-body-lg active:scale-99 transition-all duration-150 shadow-sm group" to="/login">

<span>Analyze My Café Free</span>

<span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform" data-icon="arrow_forward">arrow_forward</span>

</Link>

<button onClick={() => setIsVideoModalOpen(true)} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-on-surface bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant font-title-md text-body-lg active:scale-99 transition-all duration-150">

<span className="material-symbols-outlined text-primary text-[20px]" data-icon="play_circle">play_circle</span>

<span>Watch 2-Min Demo</span>

</button>

</div>

{/*  Social Proof Badge  */}

<div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-2 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs">

<div className="flex -space-x-2">

<div className="w-7 h-7 rounded-full bg-secondary-container/40 border-2 border-surface-container-lowest flex items-center justify-center font-label-sm text-on-secondary-container">AR</div>

<div className="w-7 h-7 rounded-full bg-surface-container-high border-2 border-surface-container-lowest flex items-center justify-center font-label-sm text-primary">SC</div>

<div className="w-7 h-7 rounded-full bg-primary-fixed border-2 border-surface-container-lowest flex items-center justify-center font-label-sm text-on-primary-fixed">BL</div>

</div>

<div className="h-3 w-px bg-outline-variant"></div>

<p className="font-label-md text-label-md text-on-surface-variant">

          Trusted by <strong className="text-on-surface font-semibold">450+</strong> independent specialty roasters &amp; coffee shops

        </p>

</div>

</div>

</section>

{/*  VALUE STRIP (Ingest -> Analyze -> Act)  */}

<section className="py-12 bg-surface-container-low/40 border-b border-outline-variant/40">

<div className="max-w-7xl mx-auto px-gutter">

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

{/*  Step 1  */}

<div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/70 custom-card-shadow custom-card-hover transition-all duration-200 flex flex-col justify-between">

<div>

<div className="flex items-center justify-between mb-4">

<span className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">

<span className="material-symbols-outlined text-[22px]" data-icon="upload_file">upload_file</span>

</span>

<span className="font-label-sm text-label-sm text-outline px-2 py-0.5 rounded bg-surface-container">STEP 01</span>

</div>

<h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Instant CSV Ingestion</h3>

<p className="font-body-md text-body-md text-on-surface-variant mb-4">

              Drag &amp; drop exported CSVs straight from Square, Toast, Clover, or Lightspeed without any manual field-mapping.

            </p>

</div>

<div className="pt-3 border-t border-outline-variant/40 flex items-center gap-2 text-primary font-label-md text-label-md">

<span className="material-symbols-outlined text-[16px]" data-icon="check_circle">check_circle</span>

<span>Zero API setup required</span>

</div>

</div>

{/*  Step 2  */}

<div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/70 custom-card-shadow custom-card-hover transition-all duration-200 flex flex-col justify-between">

<div>

<div className="flex items-center justify-between mb-4">

<span className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">

<span className="material-symbols-outlined text-[22px]" data-icon="psychology">psychology</span>

</span>

<span className="font-label-sm text-label-sm text-outline px-2 py-0.5 rounded bg-surface-container">STEP 02</span>

</div>

<h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Autonomous AI Analysis</h3>

<p className="font-body-md text-body-md text-on-surface-variant mb-4">

              Our coffee-tuned LLM calculates real gross margins, detects hidden wastage, and flags ticket speed bottlenecks automatically.

            </p>

</div>

<div className="pt-3 border-t border-outline-variant/40 flex items-center gap-2 text-primary font-label-md text-label-md">

<span className="material-symbols-outlined text-[16px]" data-icon="auto_awesome">auto_awesome</span>

<span>Trained on 2M+ cafe tickets</span>

</div>

</div>

{/*  Step 3  */}

<div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/70 custom-card-shadow custom-card-hover transition-all duration-200 flex flex-col justify-between">

<div>

<div className="flex items-center justify-between mb-4">

<span className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">

<span className="material-symbols-outlined text-[22px]" data-icon="insights">insights</span>

</span>

<span className="font-label-sm text-label-sm text-outline px-2 py-0.5 rounded bg-surface-container">STEP 03</span>

</div>

<h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Actionable Playbooks</h3>

<p className="font-body-md text-body-md text-on-surface-variant mb-4">

              Get weekly shift adjustment schedules, cold brew batch size targets, and recipe margin tweaks you can execute immediately.

            </p>

</div>

<div className="pt-3 border-t border-outline-variant/40 flex items-center gap-2 text-primary font-label-md text-label-md">

<span className="material-symbols-outlined text-[16px]" data-icon="trending_up">trending_up</span>

<span>Avg. +₹1,850 monthly margin</span>

</div>

</div>

</div>

</div>

</section>

{/*  INTERACTIVE SIMULATED AI DEMO PREVIEW  */}

<section className="py-16 md:py-24 max-w-7xl mx-auto px-gutter" id="demo">

<div className="text-center max-w-3xl mx-auto mb-12">

<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-primary mb-3">

<span className="material-symbols-outlined text-[16px]" data-icon="forum">forum</span>

<span>COFFEE SPECIALIZED AI COPILOT</span>

</div>

<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-4">Ask plain questions. Get margin-saving answers.</h2>

<p className="font-body-lg text-body-lg text-on-surface-variant">Stop squinting at pivot tables. Brewlytics translates complex register logs into straightforward operational decisions.</p>

</div>

{/*  Interface Mockup Window  */}

<div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 popover-shadow overflow-hidden max-w-5xl mx-auto" id="interactive-preview">

{/*  Window Title Bar  */}

<div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant/60 flex items-center justify-between">

<div className="flex items-center gap-2">

<span className="w-3 h-3 rounded-full bg-error/60"></span>

<span className="w-3 h-3 rounded-full bg-amber-400"></span>

<span className="w-3 h-3 rounded-full bg-emerald-400"></span>

<span className="ml-2 font-label-sm text-label-sm text-outline font-medium hidden sm:inline">Brewlytics AI Session — Artisan Roast Co. (Portland Flagship)</span>

</div>

<div className="flex items-center gap-3">

<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest text-primary font-label-sm text-label-sm border border-outline-variant/40">

<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>

            Toast POS Synced

          </span>

</div>

</div>

{/*  Chat / Analysis Workspace  */}

<div className="p-6 md:p-8 space-y-6 bg-surface-bright">

{/*  User Query Bubble  */}

<div className="flex justify-end">

<div className="bg-primary-container text-on-primary rounded-2xl rounded-tr-xs px-5 py-3.5 max-w-lg shadow-sm">

<p className="font-body-md text-body-md font-medium">Why was Tuesday worse than Monday?</p>

<span className="block text-[11px] text-on-primary-container/80 text-right mt-1">10:42 AM · Artisan Roast Co.</span>

</div>

</div>

{/*  AI Analyst Response Bubble  */}

<div className="flex gap-3 md:gap-4 items-start max-w-3xl">

<div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 shadow-sm mt-1">

<span className="material-symbols-outlined text-[20px]" data-icon="psychology">psychology</span>

</div>

<div className="bg-surface-container-lowest rounded-2xl rounded-tl-xs p-5 md:p-6 border border-outline-variant/80 custom-card-shadow flex-1">

<div className="flex items-center justify-between border-b border-outline-variant/40 pb-3 mb-4">

<div className="flex items-center gap-2">

<span className="font-title-md text-title-md text-on-surface font-semibold">Brewlytics AI</span>

<span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container-high text-primary">Model 4.2 Roasted</span>

</div>

<span className="font-label-sm text-label-sm text-outline">Processed 1,842 lines</span>

</div>

{/*  Narrative Breakdown  */}

<p className="font-body-md text-body-md text-on-surface mb-3 leading-relaxed">

              Tuesday gross revenue was down <strong className="text-error font-semibold">18% (₹1,420 vs ₹1,732)</strong>. The drop was concentrated in afternoon espresso drinks (2-5 PM) following rainy weather. Cold brew batches were over-prepped resulting in <strong className="text-error font-semibold">₹140 food waste</strong>.

            </p>

{/*  Inline Comparative Micro Chart  */}

<div className="my-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/50">

<div className="flex justify-between items-center mb-3">

<span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Hourly Revenue Comparison (Monday vs Tuesday)</span>

<div className="flex items-center gap-3 text-label-sm font-label-sm">

<span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary-container"></span> Mon</span>

<span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-outline-variant"></span> Tue</span>

</div>

</div>

{/*  Bar Comparison Simulation  */}

<div className="space-y-2">

<div>

<div className="flex justify-between text-[11px] text-outline mb-1">

<span>7 AM - 10 AM (Morning Rush)</span>

<span className="font-semibold text-on-surface">₹680 vs ₹640 (-5%)</span>

</div>

<div className="w-full bg-surface-container-high rounded-full h-2.5 flex overflow-hidden">

<div className="bg-primary-container h-2.5 rounded-full" style={{ "width": "78%" }}></div>

</div>

</div>

<div>

<div className="flex justify-between text-[11px] text-outline mb-1">

<span>11 AM - 1 PM (Lunch Spike)</span>

<span className="font-semibold text-on-surface">₹520 vs ₹510 (-2%)</span>

</div>

<div className="w-full bg-surface-container-high rounded-full h-2.5 flex overflow-hidden">

<div className="bg-primary-container h-2.5 rounded-full" style={{ "width": "62%" }}></div>

</div>

</div>

<div>

<div className="flex justify-between text-[11px] text-outline mb-1">

<span className="text-error font-semibold">2 PM - 5 PM (Afternoon Drop)</span>

<span className="font-semibold text-error">₹532 vs ₹270 (-49%)</span>

</div>

<div className="w-full bg-error-container/40 rounded-full h-2.5 flex overflow-hidden">

<div className="bg-error h-2.5 rounded-full" style={{ "width": "32%" }}></div>

</div>

</div>

</div>

</div>

{/*  Action Recommendation Callout  */}

<div className="p-3.5 rounded-xl bg-surface-container-high/60 border border-secondary-container/40 flex items-start gap-3">

<span className="material-symbols-outlined text-primary text-[20px] mt-0.5" data-icon="lightbulb">lightbulb</span>

<div className="font-body-sm text-body-sm text-on-surface">

<span className="font-semibold text-primary">Recommendation:</span> Run a <strong>20% rainy-day mobile discount code</strong> during 2-4 PM slow windows to boost espresso ticket throughput and cut batch prep volume by 2 gallons.

              </div>

</div>

{/*  Quick Action Pills  */}

<div className="mt-4 pt-3 border-t border-outline-variant/30 flex flex-wrap gap-2">

<button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md transition-colors flex items-center gap-1.5">

<span className="material-symbols-outlined text-[15px]" data-icon="schedule">schedule</span>

                Adjust Tuesday Barista Schedule

              </button>

<button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md transition-colors flex items-center gap-1.5">

<span className="material-symbols-outlined text-[15px]" data-icon="campaign">campaign</span>

                Draft Rainy Day SMS Promo

              </button>

</div>

</div>

</div>

</div>

{/*  Quick Prompt Input Box Simulation  */}

<div className="p-4 bg-surface-container-lowest border-t border-outline-variant/60">

<div className="relative flex items-center">

<input className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-4 pr-24 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none cursor-default" readOnly={true} type="text" value="What drinks have the highest food cost percentage this week?"/>

<button onClick={() => navigate("/login")} className="absolute right-2 px-3 py-1.5 rounded-md bg-primary-container text-on-primary font-label-md text-label-md flex items-center gap-1 hover:bg-secondary transition-colors">

            Ask AI

            <span className="material-symbols-outlined text-[14px]" data-icon="arrow_upward">arrow_upward</span>

</button>

</div>

</div>

</div>

</section>

{/*  CORE FEATURE HIGHLIGHTS (Bento Grid)  */}

<section className="py-16 bg-surface-container-low/30 border-y border-outline-variant/40" id="features">

<div className="max-w-7xl mx-auto px-gutter">

<div className="text-center max-w-2xl mx-auto mb-14">

<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-3">Designed for the floor. Built for the books.</h2>

<p className="font-body-lg text-body-lg text-on-surface-variant">Four mission-critical analytics engines working continuously behind your espresso bar.</p>

</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

{/*  Feature 1: Real-time Revenue & Margins  */}

<div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/80 custom-card-shadow custom-card-hover transition-all">

<div className="flex items-center justify-between mb-4">

<span className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">

<span className="material-symbols-outlined" data-icon="show_chart">show_chart</span>

</span>

<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">

              +14.2% Margin Lift

            </span>

</div>

<h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Real-time Revenue &amp; Margin Trends</h3>

<p className="font-body-md text-body-md text-on-surface-variant mb-6">

            Instantly view gross profit per ounce of roasted bean and dairy alternative, factoring dynamic wholesale cost shifts.

          </p>

{/*  Mini Data Visualization Box  */}

<div className="p-4 rounded-lg bg-surface-bright border border-outline-variant/50">

<div className="flex justify-between items-end mb-2">

<div>

<span className="font-label-sm text-label-sm text-outline">Oat Milk Latte Margin</span>

<div className="font-headline-md text-headline-md text-on-surface">76.4% <span className="font-label-sm text-label-sm text-emerald-600">↑ 3.1%</span></div>

</div>

<span className="text-outline font-label-sm text-label-sm">30-Day Avg</span>

</div>

{/*  Sparkline Graphic  */}

<div className="h-24 flex items-end gap-1.5">

<div className="flex-1 bg-surface-container-high rounded-t h-[40%]"></div>

<div className="flex-1 bg-surface-container-high rounded-t h-[55%]"></div>

<div className="flex-1 bg-surface-container-high rounded-t h-[48%]"></div>

<div className="flex-1 bg-surface-container-high rounded-t h-[65%]"></div>

<div className="flex-1 bg-surface-container-high rounded-t h-[70%]"></div>

<div className="flex-1 bg-primary-container rounded-t h-[88%]"></div>

<div className="flex-1 bg-primary rounded-t h-[94%]"></div>

</div>

</div>

</div>

{/*  Feature 2: 24/7 AI Sommelier & Analyst  */}

<div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/80 custom-card-shadow custom-card-hover transition-all">

<div className="flex items-center justify-between mb-4">

<span className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">

<span className="material-symbols-outlined" data-icon="coffee">coffee</span>

</span>

<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container text-primary font-semibold">

              Natural Language

            </span>

</div>

<h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">24/7 AI café owner &amp; Analyst</h3>

<p className="font-body-md text-body-md text-on-surface-variant mb-6">

            Ask any question via web or mobile. Inquire about origin roast decay, seasonal syrup sell-through, or single-origin pour-over velocity.

          </p>

<div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/60 flex items-center gap-3">

<span className="w-2.5 h-2.5 rounded-full bg-primary-container flex-shrink-0"></span>

<p className="font-body-sm text-body-sm text-on-surface-variant italic">

              "Ethiopian Yirgacheffe batch sells 3x faster between 8-10 AM. Shift second grinder hopper to prevent morning queue stalls."

            </p>

</div>

</div>

{/*  Feature 3: Peak Hour Heatmap & Staffing Predictor  */}

<div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/80 custom-card-shadow custom-card-hover transition-all">

<div className="flex items-center justify-between mb-4">

<span className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">

<span className="material-symbols-outlined" data-icon="grid_view">grid_view</span>

</span>

<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant">

              Predictive Roster

            </span>

</div>

<h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Peak Hour Heatmap &amp; Staffing Predictor</h3>

<p className="font-body-md text-body-md text-on-surface-variant mb-6">

            Eliminate double-barista dead shifts. Match hourly schedule headcounts directly against historical drink preparation density.

          </p>

{/*  Heatmap Matrix Mini  */}

<div className="grid grid-cols-7 gap-1.5 text-center font-label-sm text-[10px]">

<span className="text-outline">M</span>

<span className="text-outline">T</span>

<span className="text-outline">W</span>

<span className="text-outline">T</span>

<span className="text-outline">F</span>

<span className="text-primary font-semibold">S</span>

<span className="text-primary font-semibold">S</span>

<div className="h-6 rounded bg-surface-container-high"></div>

<div className="h-6 rounded bg-surface-container-low"></div>

<div className="h-6 rounded bg-surface-container-high"></div>

<div className="h-6 rounded bg-primary-fixed"></div>

<div className="h-6 rounded bg-primary-container/80 text-white flex items-center justify-center">Rush</div>

<div className="h-6 rounded bg-primary-container text-white flex items-center justify-center">Peak</div>

<div className="h-6 rounded bg-primary-container text-white flex items-center justify-center">Peak</div>

</div>

</div>

{/*  Feature 4: Menu Profitability Matrix  */}

<div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/80 custom-card-shadow custom-card-hover transition-all">

<div className="flex items-center justify-between mb-4">

<span className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">

<span className="material-symbols-outlined" data-icon="category">category</span>

</span>

<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-semibold">

              Boston Box

            </span>

</div>

<h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Menu Profitability Matrix</h3>

<p className="font-body-md text-body-md text-on-surface-variant mb-4">

            Autonomous categorization of your entire menu into Stars (High Vol / High Margin), Workhorses, Puzzles, and margin-draining Dogs.

          </p>

<div className="grid grid-cols-2 gap-2 text-label-sm font-label-sm">

<div className="p-2.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-between">

<span>⭐ Cortado</span>

<strong className="font-semibold">Star</strong>

</div>

<div className="p-2.5 rounded bg-amber-50 text-amber-800 border border-amber-100 flex items-center justify-between">

<span>🐴 Drip 12oz</span>

<strong className="font-semibold">Workhorse</strong>

</div>

<div className="p-2.5 rounded bg-surface-container text-on-surface border border-outline-variant/40 flex items-center justify-between">

<span>🧩 Nitro Cascara</span>

<strong className="font-semibold">Puzzle</strong>

</div>

<div className="p-2.5 rounded bg-red-50 text-red-700 border border-red-100 flex items-center justify-between">

<span>⚠️ Almond Croissant</span>

<strong className="font-semibold">Dog (Waste)</strong>

</div>

</div>

</div>

</div>

</div>

</section>

{/*  TRANSPARENT PRICING TEASER  */}

<section className="py-16 md:py-24 max-w-7xl mx-auto px-gutter" id="pricing">

<div className="text-center max-w-3xl mx-auto mb-14">

<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-primary mb-3">

<span>SIMPLE, ROI-DRIVEN PRICING</span>

</div>

<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-3">Pays for itself with your first avoided batch waste.</h2>

<p className="font-body-lg text-body-lg text-on-surface-variant">Start free with no credit card required. Upgrade whenever you need automated multi-location sync.</p>

</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

{/*  Free Plan  */}

<div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/80 custom-card-shadow flex flex-col justify-between">

<div>

<h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Free</h3>

<p className="font-body-sm text-body-sm text-on-surface-variant mb-6">For budding solo roasters exploring initial unit economics.</p>

<div className="flex items-baseline gap-1 mb-6">

<span className="font-display text-4xl text-on-surface font-bold">₹0</span>

<span className="font-body-md text-body-md text-outline">/month</span>

</div>

<ul className="space-y-3 font-body-md text-body-md text-on-surface border-t border-outline-variant/40 pt-6 mb-8">
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>Basic CSV Uploads</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>5 AI Copilot Messages / mo</span>
</li>
<li className="flex items-center gap-2.5 opacity-50">
<span className="material-symbols-outlined text-on-surface-variant text-[18px]" data-icon="close">close</span>
<span className="line-through">AI Margin Insights</span>
</li>
<li className="flex items-center gap-2.5 opacity-50">
<span className="material-symbols-outlined text-on-surface-variant text-[18px]" data-icon="close">close</span>
<span className="line-through">Team Access</span>
</li>
</ul>

</div>

<Link className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low text-on-surface border border-outline-variant font-title-md text-body-md transition-colors" to="/login">

          Get Started Free

        </Link>

</div>

{/*  Pro Plan (Most Popular)  */}

<div className="bg-surface-container-lowest p-8 rounded-2xl border-2 border-primary-container relative custom-card-shadow flex flex-col justify-between ring-4 ring-primary-container/10">

<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary font-label-sm text-label-sm uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">

          Most Popular

        </div>

<div>

<h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Pro</h3>

<p className="font-body-sm text-body-sm text-on-surface-variant mb-6">Complete analytical suite for busy independent brick-and-mortars.</p>

<div className="flex items-baseline gap-1 mb-6">

<span className="font-display text-4xl text-on-surface font-bold">₹999</span>

<span className="font-body-md text-body-md text-outline">/month</span>

</div>

<ul className="space-y-3 font-body-md text-body-md text-on-surface border-t border-outline-variant/40 pt-6 mb-8">
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>Advanced CSV Analytics</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>20 AI Copilot Messages / mo</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>Full AI Margin Insights</span>
</li>
<li className="flex items-center gap-2.5 opacity-50">
<span className="material-symbols-outlined text-on-surface-variant text-[18px]" data-icon="close">close</span>
<span className="line-through">Team Access</span>
</li>
</ul>

</div>

<Link className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-lg bg-primary-container hover:bg-secondary text-on-primary font-title-md text-body-md active:scale-99 transition-all shadow-sm" to="/login">

          Upgrade to Pro

        </Link>

</div>

{/*  Business Plan  */}

<div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/80 custom-card-shadow flex flex-col justify-between">

<div>

<h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Business</h3>

<p className="font-body-sm text-body-sm text-on-surface-variant mb-6">Designed for franchise chains and wholesale multi-roastery groups.</p>

<div className="flex items-baseline gap-1 mb-6">

<span className="font-display text-4xl text-on-surface font-bold">₹2,499</span>

<span className="font-body-md text-body-md text-outline">/month</span>

</div>

<ul className="space-y-3 font-body-md text-body-md text-on-surface border-t border-outline-variant/40 pt-6 mb-8">
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>2+ café locations (Multi-outlet)</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>100 AI Copilot Messages / mo</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>Full AI Margin Insights</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>Team Access & Roles</span>
</li>
</ul>

</div>

<Link className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low text-on-surface border border-outline-variant font-title-md text-body-md transition-colors" to="/login">

          Contact Enterprise Sales

        </Link>

</div>

</div>

</section>

{/*  CTA BANNER  */}

<section className="py-16 bg-surface-container-lowest border-t border-outline-variant/50">

<div className="max-w-5xl mx-auto px-gutter text-center">

<div className="bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high/70 p-10 md:p-14 rounded-3xl border border-secondary-container/40">

<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-4">Ready to find hidden margins in your register logs?</h2>

<p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mb-8">

          Upload last week’s POS sales export. Review actionable insights and batch recommendations in under 90 seconds.

        </p>

<div className="flex flex-col sm:flex-row justify-center items-center gap-3">

<Link className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-on-primary bg-primary-container hover:bg-secondary font-title-md text-body-md transition-colors shadow-sm" to="/login">

<span>Upload My First CSV Free</span>

<span className="material-symbols-outlined text-[18px]" data-icon="upload_file">upload_file</span>

</Link>

<Link className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg text-on-surface bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant font-title-md text-body-md transition-colors" to="/login">

            See Example Output

          </Link>

</div>

</div>

</div>

</section>

{/*  FOOTER  */}

<footer className="bg-surface-container-lowest border-t border-outline-variant/70 pt-16 pb-12">

<div className="max-w-7xl mx-auto px-gutter">

<div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-outline-variant/40">

{/*  Brand & Description (2 cols)  */}

<div className="md:col-span-2">

<img alt="Brewlytics Logo" className="h-12 w-auto object-contain mb-4" src="/logo.png"/>

<p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-6">

            The hospitality intelligence platform engineered for cafés, craft cafes, and multi-unit beverage operations.

          </p>

<div className="flex items-center gap-3 text-label-sm font-label-sm text-outline">

<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low text-primary border border-outline-variant/40">

<span className="material-symbols-outlined text-[14px]" data-icon="lock">lock</span>

              SOC2 &amp; GDPR Compliant

            </span>

<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low text-primary border border-outline-variant/40">

<span className="material-symbols-outlined text-[14px]" data-icon="verified_user">verified_user</span>

              Bank-grade 256-bit AES

            </span>

</div>

</div>

{/*  Links Column 1  */}

<div>

<h4 className="font-title-md text-body-md font-semibold text-on-surface mb-3">Product</h4>

<ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">

<li><Link className="hover:text-primary transition-colors" to="/login">POS Ingestion</Link></li>

<li><Link className="hover:text-primary transition-colors" to="/login">AI Coffee Copilot</Link></li>

<li><Link className="hover:text-primary transition-colors" to="/login">Pricing &amp; ROI</Link></li>

<li><Link className="hover:text-primary transition-colors" to="/login">Changelog</Link></li>

</ul>

</div>

{/*  Links Column 2  */}

<div>

<h4 className="font-title-md text-body-md font-semibold text-on-surface mb-3">Integrations</h4>

<ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">

<li><Link className="hover:text-primary transition-colors" to="/login">Square CSV Guide</Link></li>

<li><Link className="hover:text-primary transition-colors" to="/login">Toast POS Exporter</Link></li>

<li><Link className="hover:text-primary transition-colors" to="/login">Clover Integration</Link></li>

<li><Link className="hover:text-primary transition-colors" to="/login">Lightspeed Support</Link></li>

</ul>

</div>

{/* Social Links */}
<div>
  <h4 className="font-title-md text-body-md font-semibold text-on-surface mb-3">Connect With Us</h4>
  <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
    Follow us for updates, tips, and café success stories.
  </p>
  <div className="flex items-center gap-4">
    <a href="#" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface-variant flex items-center justify-center transition-colors">
      <span className="material-symbols-outlined text-[20px]">share</span>
    </a>
    <a href="#" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface-variant flex items-center justify-center transition-colors">
      <span className="material-symbols-outlined text-[20px]">chat</span>
    </a>
    <a href="#" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface-variant flex items-center justify-center transition-colors">
      <span className="material-symbols-outlined text-[20px]">video_library</span>
    </a>
    <a href="#" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface-variant flex items-center justify-center transition-colors">
      <span className="material-symbols-outlined text-[20px]">alternate_email</span>
    </a>
  </div>
</div>

</div>

{/*  Copyright & Legal  */}

<div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-outline">

<p>© 2025 Brewlytics Technologies, Inc. All rights reserved.</p>

<div className="flex items-center gap-6">

<Link className="hover:text-on-surface transition-colors" to="/login">Privacy Policy</Link>

<Link className="hover:text-on-surface transition-colors" to="/login">Terms of Service</Link>

<Link className="hover:text-on-surface transition-colors" to="/login">Security</Link>

</div>

</div>

</div>

</footer>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-5xl w-full relative overflow-hidden border border-outline-variant/30">
            {/* Header */}
            <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
              <span className="text-white font-title-md text-sm font-semibold tracking-wide drop-shadow-md">
                Brewlytics 2-Min Demo
              </span>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-colors pointer-events-auto border border-white/20"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            
            {/* Video Player */}
            <div className="aspect-video w-full bg-black">
              <video 
                src="/demo-video.mp4" 
                controls 
                autoPlay 
                className="w-full h-full outline-none"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}

    </div>

  );

}



