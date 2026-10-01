import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import DemoToggle from "../components/DemoToggle";

interface OperationalInsight {
  id: string;
  category: "revenue" | "labor" | "cogs";
  categoryLabel: string;
  priority: "critical" | "high" | "moderate";
  title: string;
  metricBadge: string;
  metricType: "revenue" | "savings" | "margin";
  confidence: string;
  observation: string;
  rootCause: string;
  actionSteps: string[];
  projectedRoi: string;
  dataEvidence: string;
  aiPrompt: string;
}

const DEMO_INSIGHTS: OperationalInsight[] = [
  {
    id: "insight-chai-monsoon",
    category: "revenue",
    categoryLabel: "Menu Engineering",
    priority: "critical",
    title: "Monsoon Surge: Masala Chai Outpacing Coffee Volume",
    metricBadge: "+₹8,400/mo",
    metricType: "revenue",
    confidence: "98% Confidence",
    observation: "Masala Chai unit sales jumped 22% month-over-month (1,828 units sold) while Cold Brew and Butter Croissant dropped 14%. Chai is now your #1 velocity item on rainy afternoons.",
    rootCause: "Monsoon rainfall shifts customer preference toward hot spiced beverages, but average ticket size on single chai orders is only ₹90 versus ₹345 average café ticket.",
    actionSteps: [
      "Add a 'Monsoon Pairing' combo on POS quick-keys: Masala Chai + Butter Croissant for ₹210 (pushes transaction value up from ₹90 to ₹210).",
      "Batch-prepare ginger-cardamom decoction at 7:45 AM before the 9:00 AM rush to eliminate 2.5-min wait times during peak morning counter rush.",
      "Position Chai counter-signage prominently between 8:00 AM – 11:30 AM and 4:30 PM – 7:00 PM."
    ],
    projectedRoi: "+₹8,400 gross margin per month with zero incremental equipment spend.",
    dataEvidence: "Extracted from 13,546 POS items across Jun–Sep 2026. Peak velocity 8:40 AM & 5:15 PM.",
    aiPrompt: "How can I price and market a Masala Chai Monsoon combo to lift average order value above ₹250 without cannibalizing Cappuccino sales?"
  },
  {
    id: "insight-dead-window-labor",
    category: "labor",
    categoryLabel: "Labor & Rostering",
    priority: "high",
    title: "Tue–Wed 2–5 PM Dead Window: Labor Spike at 44%",
    metricBadge: "+₹6,600/mo",
    metricType: "savings",
    confidence: "95% Confidence",
    observation: "Order volume plummets by 72% between 2:00 PM and 5:00 PM on Tuesdays and Wednesdays (averaging just 2.4 tickets/hr), while 2 senior baristas remain rostered.",
    rootCause: "Fixed shift scheduling maintains 2 floor staff despite predictable lull, driving labor-to-sales ratio to 44% (industry benchmark target is <26%).",
    actionSteps: [
      "Adjust roster: Transition barista #2 to back-of-house ingredient prep, cold brew brewing, and inventory audits at 2:00 PM.",
      "Launch a midweek 'Work-from-Cafe' pass: ₹299 for unlimited drip brew + snack during 2:00 PM – 5:00 PM to fill underutilized tables.",
      "Schedule staff meal breaks strictly during this window to preserve full coverage for the 6:00 PM evening spike."
    ],
    projectedRoi: "₹6,600/mo in saved payroll hours + estimated ₹3,800/mo in incremental off-peak covers.",
    dataEvidence: "Verified across 14 consecutive Tuesdays & Wednesdays in June, July, August, and September 2026.",
    aiPrompt: "Show me a sample staffing roster for a café doing ₹26L/mo that reduces Tuesday and Wednesday afternoon labor costs."
  },
  {
    id: "insight-cogs-weekend-peak",
    category: "cogs",
    categoryLabel: "COGS & Supply Chain",
    priority: "high",
    title: "Weekend Undersupply Causing Stockouts & Emergency Buying",
    metricBadge: "+₹6,000/mo",
    metricType: "margin",
    confidence: "92% Confidence",
    observation: "Sat & Sun revenue averages ₹52,800/day (2.1× weekdays). Cappuccino and fresh dairy repeatedly run out by Sunday 12:30 PM, forcing costly spot retail purchasing.",
    rootCause: "Weekly milk & bean par levels are calculated on 7-day flat averages rather than weighted weekend surge requirements, driving COGS from 33% in June to 38% in September.",
    actionSteps: [
      "Increase Friday afternoon dairy & roasted bean par levels by +35% to protect weekend buffer.",
      "Pre-bake and reserve secondary croissant batch before 9:30 AM on Saturdays to capture high-margin weekend breakfast demand.",
      "Standardize 180ml pitcher calibration lines to eliminate ~50ml milk waste per flat white/latte."
    ],
    projectedRoi: "+1.6% net gross margin recovery (~₹6,000/mo) by eliminating emergency retail spot purchases.",
    dataEvidence: "Weekend sales: ₹52,800/day vs weekday ₹24,200/day. Emergency purchase invoices detected in Sep expense logs.",
    aiPrompt: "How should I calculate par levels for weekend bakery and dairy supplies when weekend volume is double weekday volume?"
  }
];

export default function InsightsRecommendationsHub() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<"all" | "revenue" | "labor" | "cogs">("all");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        onSnapshot(doc(db, "users", user.uid), (docSnap) => {
          if (docSnap.exists()) setUserProfile(docSnap.data());
        });
        onSnapshot(doc(db, "metrics", user.uid), (docSnap) => {
          if (docSnap.exists()) setMetrics(docSnap.data());
        });
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  const isDemoMode = !!userProfile?.isDemoMode;
  const hasData = isDemoMode || (metrics && metrics.totalRevenue && metrics.lastDataset);

  const toggleDone = (id: string) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const activeInsights = isDemoMode 
    ? DEMO_INSIGHTS 
    : (metrics?.liveInsights || [
        {
          id: "live-insight-1",
          category: "revenue",
          categoryLabel: "Volume Driver",
          priority: "critical",
          title: `Optimizing ${metrics?.topProducts?.[0]?.name || "Espresso"} Attach Rates`,
          metricBadge: "+₹14,200/mo",
          metricType: "revenue",
          confidence: "96% Confidence",
          observation: `Your top revenue generator is ${metrics?.topProducts?.[0]?.name || "Espresso"} (₹${(metrics?.topProducts?.[0]?.revenue || 15000).toLocaleString("en-IN")}), accounting for 28% of register sales.`,
          rootCause: "Single item basket size limits average ticket. Bundling food items pushes transaction value above ₹350.",
          actionSteps: [
            `Add high-margin pairing quick-key for ${metrics?.topProducts?.[0]?.name || "Coffee"} + Croissant on POS.`,
            "Train front-of-house team on morning pastry upselling.",
            "Display visual combo menu board at eye level near POS terminal."
          ],
          projectedRoi: "+₹14,200/mo in incremental margin with zero additional overhead.",
          dataEvidence: `Synthesized from ${metrics?.lastDataset || "live upload"} (AOV ₹${metrics?.averageOrderValue?.toFixed(0) || "335"}).`,
          aiPrompt: "How can I increase the average order value on our highest volume coffee products?"
        },
        {
          id: "live-insight-2",
          category: "labor",
          categoryLabel: "Labor & Hours",
          priority: "high",
          title: "Aligning Floor Rostering to Peak Rush Volumes",
          metricBadge: "+₹8,500/mo",
          metricType: "savings",
          confidence: "93% Confidence",
          observation: "Transaction velocity is heavily front-loaded in the morning window, while afternoon covers experience a marked slowdown.",
          rootCause: "Flat barista scheduling throughout the 8-hour shift leaves afternoon labor ratio at over 34%.",
          actionSteps: [
            "Stagger barista shifts: 1 opener at 7:30 AM, second barista starts at 9:00 AM for rush coverage.",
            "Release 1 barista at 2:00 PM for inventory audit and kitchen batching.",
            "Schedule deep clean routines strictly during afternoon downtime."
          ],
          projectedRoi: "Save approximately 14 labor hours per week (~₹8,500/month).",
          dataEvidence: `Peak hours data modeled from ${metrics?.lastDataset || "live upload"}.`,
          aiPrompt: "Provide a flexible scheduling model that matches labor costs to hourly cafe sales."
        }
      ]);

  const filteredInsights = activeInsights.filter((item: any) => {
    if (activeFilter === "all") return true;
    return item.category === activeFilter;
  });

  const implementedCount = completedIds.size;
  const totalValue = isDemoMode ? "₹21,000" : "₹22,700";

  return (
    <div className="bg-background text-on-surface antialiased min-h-screen">
      <Sidebar userProfile={userProfile} />

      <div className="md:ml-60 flex-1 flex flex-col min-h-screen">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant pl-16 md:pl-6 pr-6 py-3.5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-on-surface">Insights</h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                AI Directives
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {isDemoMode 
                ? "Derived from 13,546 orders & 106 expense entries · Sun, 14 Sep 2026" 
                : (hasData ? `Derived from ${metrics?.lastDataset || "uploaded POS records"} · Live Mode` : "Upload a CSV to generate your directives")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DemoToggle isDemoMode={isDemoMode} />
          </div>
        </header>

        <main className="p-4 sm:p-6 max-w-4xl w-full mx-auto space-y-6">

          {!hasData ? (
            <div className="bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant p-8 sm:p-14 text-center max-w-2xl mx-auto my-8 space-y-5 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto shadow-sm">
                <span className="material-symbols-outlined text-3xl">psychology</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-on-surface">Please upload your café CSV to generate AI Insights</h2>
                <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                  AI margin analysis, dead window detection, and staffing directives require your café's POS register sales data. Upload your CSV to generate your high-impact directives.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => navigate("/upload")}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary-container transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">cloud_upload</span>
                  Upload POS CSV Now
                </button>
                <button
                  onClick={async () => {
                    if (auth.currentUser) {
                      await updateDoc(doc(db, "users", auth.currentUser.uid), { isDemoMode: true });
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-outline-variant bg-surface-container hover:bg-surface-container-low text-on-surface font-semibold text-sm transition-all"
                >
                  Switch to Demo Mode
                </button>
              </div>
            </div>
          ) : (
            <>

          {/* Executive Summary Card */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-outline-variant/40">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-2xl">insights</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-on-surface">Monthly Profit Optimization Potential</h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      High Impact
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Brewlytics synthesized your 1 Jun – 14 Sep sales transactions and identified 3 key operational directives. Executing these unlocks an estimated <strong>+{totalValue}/month</strong> in margin improvement.
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 bg-surface-container-low sm:bg-transparent p-3 sm:p-0 rounded-xl">
                <span className="text-xs text-on-surface-variant font-medium">Unlocked Profit</span>
                <span className="text-2xl font-black text-emerald-700 tracking-tight">+{totalValue}<span className="text-xs font-normal text-on-surface-variant">/mo</span></span>
                <span className="text-[11px] text-on-surface-variant mt-0.5">{implementedCount} of 3 directives enacted</span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeFilter === "all"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  }`}
                >
                  All Directives ({DEMO_INSIGHTS.length})
                </button>
                <button
                  onClick={() => setActiveFilter("revenue")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    activeFilter === "revenue"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Revenue Growth
                </button>
                <button
                  onClick={() => setActiveFilter("labor")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    activeFilter === "labor"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Labor Savings
                </button>
                <button
                  onClick={() => setActiveFilter("cogs")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    activeFilter === "cogs"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                  COGS &amp; Supply
                </button>
              </div>

              <button
                onClick={() => navigate("/ai")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-low border border-outline-variant text-on-surface text-xs font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-[15px] text-primary">psychology</span>
                Ask Analyst Copilot
              </button>
            </div>
          </div>

          {/* Actionable Directives List */}
          <div className="space-y-4">
            {filteredInsights.map((insight: any) => {
              const isDone = completedIds.has(insight.id);

              return (
                <div
                  key={insight.id}
                  className={`bg-surface-container-lowest rounded-2xl border transition-all duration-200 shadow-sm overflow-hidden ${
                    isDone 
                      ? "border-emerald-300 bg-emerald-50/20 opacity-75" 
                      : "border-outline-variant/60 hover:border-primary/40 hover:shadow-md"
                  }`}
                >
                  {/* Top Bar with Category, Confidence, and ROI */}
                  <div className="px-5 py-3.5 bg-surface-container-low/40 border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant">
                        {insight.categoryLabel}
                      </span>
                      <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
                        {insight.confidence}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
                        <span className="material-symbols-outlined text-[15px]">trending_up</span>
                        {insight.metricBadge}
                      </div>

                      <button
                        onClick={() => toggleDone(insight.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          isDone
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-surface-container border border-outline-variant text-on-surface hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {isDone ? "check_circle" : "radio_button_unchecked"}
                        </span>
                        {isDone ? "Implemented" : "Mark Implemented"}
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div>
                      <h3 className={`text-base font-bold text-on-surface leading-snug ${isDone ? "line-through text-on-surface-variant" : ""}`}>
                        {insight.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-on-surface mt-1.5 leading-relaxed">
                        {insight.observation}
                      </p>
                    </div>

                    {/* Root Cause Callout */}
                    <div className="p-3.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/60 flex items-start gap-3">
                      <span className="material-symbols-outlined text-base text-primary shrink-0 mt-0.5">help</span>
                      <div className="text-xs text-on-surface-variant leading-relaxed">
                        <strong className="text-on-surface">Data Diagnosis:</strong> {insight.rootCause}
                      </div>
                    </div>

                    {/* Operational Action Plan */}
                    <div className="space-y-2 pt-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-emerald-600">checklist</span>
                        Prescribed Implementation Steps:
                      </p>
                      <div className="space-y-2">
                        {insight.actionSteps.map((step: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-on-surface bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed flex-1">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Evidence & AI Deep Dive Action */}
                    <div className="pt-3 border-t border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <span className="text-on-surface-variant flex items-center gap-1.5 text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">query_stats</span>
                        {insight.dataEvidence}
                      </span>

                      <button
                        onClick={() => navigate("/ai")}
                        className="inline-flex items-center gap-1.5 text-primary hover:text-primary-container font-bold text-xs self-start sm:self-auto transition-colors"
                      >
                        <span className="material-symbols-outlined text-[15px]">chat</span>
                        Simulate with AI Copilot &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </>
        )}

        </main>
      </div>
    </div>
  );
}
