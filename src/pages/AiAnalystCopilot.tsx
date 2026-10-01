import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, updateDoc, increment } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import DemoToggle from "../components/DemoToggle";
import Groq from "groq-sdk";

interface ChartItem {
  label: string;
  value: number;
  secondaryValue?: number;
  unit?: string;
  percentage?: number;
  color?: string;
  status?: "good" | "alert" | "neutral";
  annotation?: string;
}

interface MessageChart {
  type: "comparison_bar" | "distribution_bar" | "kpi_grid";
  title: string;
  summaryBadge?: string;
  data: ChartItem[];
}

interface ChatMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  chart?: MessageChart;
  reasoningSteps?: string[];
  recommendations?: string[];
  timestamp?: any;
  dateContext?: string;
}

// Fixed pre-seeded responses for Demo Mode (Date: 14 Sep 2026 6:30 PM IST)
const FIXED_DEMO_CONVERSATION: ChatMessage[] = [
  {
    id: "fixed-demo-1",
    role: "user",
    content: "Can you analyze our gross margin for the oat milk lattes this week?",
    dateContext: "Sun, 14 Sep 2026 · 6:15 PM IST"
  },
  {
    id: "fixed-demo-2",
    role: "assistant",
    content: "Here is your margin analysis for the week of Sep 8–14, 2026. A recent +18% supplier price surge on barista oat milk has severely eroded gross margins on oat milk drinks, causing approximately ₹20,250 in weekly margin leakage.",
    dateContext: "Sun, 14 Sep 2026 · 6:15 PM IST",
    chart: {
      type: "comparison_bar",
      title: "Latte Gross Margin Comparison (% & Unit Cost)",
      summaryBadge: "Oat Margin: 67.6% → 53.3%",
      data: [
        { label: "Whole Milk Latte", value: 76.7, secondaryValue: 42, unit: "%", status: "good", annotation: "Retail ₹180 · Cost ₹42 · Margin ₹138" },
        { label: "Oat Latte (Pre-Hike)", value: 67.6, secondaryValue: 68, unit: "%", status: "neutral", annotation: "Retail ₹210 · Cost ₹68 · Margin ₹142" },
        { label: "Oat Latte (Current)", value: 53.3, secondaryValue: 98, unit: "%", status: "alert", annotation: "Retail ₹210 · Cost ₹98 · Margin ₹112 (Leakage)" },
        { label: "Proposed (+₹30 Modifier)", value: 73.5, secondaryValue: 98, unit: "%", status: "good", annotation: "Retail ₹240 · Cost ₹98 · Margin ₹142 (Target)" }
      ]
    },
    reasoningSteps: [
      "In the past 7 days, your café dispensed 450 Oat Milk Lattes (27.6% of all latte orders).",
      "Supplier wholesale invoice dated 8 Sep shows Barista Oat Milk price rose +18% from ₹140/L to ₹165/L.",
      "Each 12oz latte uses 220ml of steamed milk, pushing oat milk ingredient cost from ₹68 up to ₹98 per cup.",
      "With your current selling price of ₹210 (₹180 base + ₹30 add-on), margin dropped by 14.3 percentage points to 53.3%."
    ],
    recommendations: [
      "Increase the alternative milk modifier from ₹30 to ₹60 on your POS register.",
      "Keep standard cow's milk latte at ₹180 to avoid alienating whole milk regulars.",
      "Immediate financial recovery: +₹13,500/month in net gross margin recovery."
    ]
  },
  {
    id: "fixed-demo-3",
    role: "user",
    content: "What if we just increase the base price instead?",
    dateContext: "Sun, 14 Sep 2026 · 6:20 PM IST"
  },
  {
    id: "fixed-demo-4",
    role: "assistant",
    content: "Increasing the base price of all lattes across the board is high-risk. 69% of your customer base orders standard cow's milk where your costs have remained stable. A blanket price hike risks avoidable customer churn.",
    dateContext: "Sun, 14 Sep 2026 · 6:20 PM IST",
    chart: {
      type: "distribution_bar",
      title: "Customer Milk Preference Distribution & Margin Exposure",
      summaryBadge: "69% Volume Unaffected by Oat Spike",
      data: [
        { label: "Whole / Standard Milk", percentage: 69, value: 1125, unit: "orders", color: "#7C3AED", status: "good", annotation: "Cost ₹42 (Stable) · High customer churn risk if hiked" },
        { label: "Barista Oat Milk", percentage: 21, value: 342, unit: "orders", color: "#F59E0B", status: "alert", annotation: "Cost ₹98 (Spike) · Low price sensitivity, absorbs +₹30" },
        { label: "Almond & Soy", percentage: 10, value: 163, unit: "orders", color: "#06B6D4", status: "neutral", annotation: "Cost ₹75 · Margin currently compliant" }
      ]
    },
    reasoningSteps: [
      "Price Elasticity Risk: Regular milk coffee drinkers exhibit 1.3× higher price elasticity than specialty plant-based drinkers. A blanket ₹30 hike on regular latte risks losing 7–11% of daily repeat patrons to neighborhood cafes.",
      "Cost Isolation Principle: The cost shock is strictly isolated to alternative plant-based milk. Whole milk supplies remain contracted at ₹68/L with zero cost inflation.",
      "Selective Modifier Tolerance: Specialty oat milk consumers historically absorb modifier changes with <2% volume drop, since alternative milk pricing is industry standard."
    ],
    recommendations: [
      "Do NOT increase the base latte price of ₹180.",
      "Update only the 'Oat Milk' modifier on your register to ₹60.",
      "This strategy achieves 100% margin recovery while preserving goodwill with 69% of your customer base."
    ]
  }
];

const groq = new Groq({ apiKey: "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", dangerouslyAllowBrowser: true });

// Analytical AI Intelligence Engine that handles any question dynamically with rich charts
async function generateSmartAnalystResponse(queryText: string, isDemo: boolean, _metricsContext?: any): Promise<{
  content: string;
  chart?: MessageChart;
  reasoningSteps?: string[];
  recommendations?: string[];
}> {
  // If in Live mode and no CSV has been ingested yet:
  if (!isDemo && !_metricsContext?.lastDataset) {
    return {
      content: "I am ready to analyze your café, but you have not uploaded a sales or expense CSV file yet in Live mode. Please head over to the 'Upload Data' tab to ingest your Square, Toast, or POS export. Once uploaded, I will compute your exact gross margins, peak rush velocity, and itemized revenue charts!",
      chart: {
        type: "kpi_grid",
        title: "Action Required: Ingest POS Register CSV",
        summaryBadge: "Awaiting Live Upload",
        data: [
          { label: "Data Ingestion", value: 0, unit: "%", status: "alert", annotation: "Navigate to Upload Data" },
          { label: "Target Schema", value: 100, unit: "%", status: "good", annotation: "Square & Toast compatible" },
          { label: "AI Directives", value: 0, unit: "ready", status: "neutral", annotation: "Computed upon upload" }
        ]
      },
      reasoningSteps: [
        "Live mode is currently in a clean state with zero transactions ingested.",
        "Accurate margin intelligence and labor ratio analysis require at least 1 POS sales CSV.",
        "You can also toggle to Demo mode anytime in the header to explore with pre-seeded sample data."
      ],
      recommendations: [
        "Click 'Upload Data' in the sidebar to upload your register CSV export.",
        "Once uploaded, click 'Looks Good, Run AI Analytics' to recompute all charts.",
        "Return here to ask tailored questions about your custom menu numbers."
      ]
    };
  }

  const contextStr = isDemo ? "Pre-seeded demo data: Total Revenue ₹26.50 Lakh across 7,667 orders, AOV ₹345. Top products: Cappuccino, Chai, Cold Coffee. Weekend surge 2.1x." : JSON.stringify(_metricsContext);
  
  const prompt = `You are an expert Cafe Business Analyst. The user asks: "${queryText}". 
Context Data: ${contextStr}

Respond with a JSON object strictly following this exact structure (NO MARKDOWN, RAW JSON ONLY):
{
  "content": "A detailed natural language response acting as a cafe consultant.",
  "chart": {
    "type": "comparison_bar",
    "title": "A short descriptive title",
    "summaryBadge": "A short highlight badge",
    "data": [
      { "label": "Item Name", "value": 120, "unit": "₹ or orders or %", "status": "good" | "alert" | "neutral", "annotation": "Brief explanation" }
    ]
  },
  "reasoningSteps": ["Step 1 explanation based on data", "Step 2"],
  "recommendations": ["Actionable recommendation 1", "Recommendation 2"]
}`;

  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    
    let text = (response.choices[0]?.message?.content || "").trim();
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
       text = text.substring(jsonStart, jsonEnd + 1);
    }
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Groq API Error:", error);
    return {
      content: `Groq AI Engine Error: ${error?.message || "Failed to parse data"}. Please try again.`
    };
  }
}

export default function AiAnalystCopilot() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isDemoMode = !!userProfile?.isDemoMode;

  // Real-time live date/time strings for Live Mode
  const [currentLiveTime, setCurrentLiveTime] = useState({
    date: new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
    time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLiveTime({
        date: new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      });
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const isFreePlan = userProfile?.plan === "free";
  const isProPlan = userProfile?.plan === "pro";
  const isBusinessPlan = userProfile?.plan === "business";
  const messagesUsed = userProfile?.aiMessageCount || 0;
  
  let limitReached = false;
  if (isDemoMode) {
    const userMessages = messages.filter(m => m.role === "user").length;
    if (userMessages >= 5) limitReached = true;
  } else {
    if (isFreePlan && messagesUsed >= 5) limitReached = true;
    if (isProPlan && messagesUsed >= 20) limitReached = true;
    if (isBusinessPlan && messagesUsed >= 100) limitReached = true;
  }

  // Load chat messages: Completely isolated between Demo mode and Live mode!
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        onSnapshot(doc(db, "users", user.uid), (docSnap) => {
          if (docSnap.exists()) setUserProfile(docSnap.data());
        });

        // Determine collection key based on mode: NEVER mix demo and live!
        const collectionKey = userProfile?.isDemoMode 
          ? `chats/${user.uid}_demo/messages` 
          : `chats/${user.uid}_live/messages`;

        const q = query(collection(db, collectionKey), orderBy("timestamp", "asc"));
        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
          const msgs: ChatMessage[] = [];
          snapshot.forEach((d) => {
            msgs.push({ id: d.id, ...(d.data() as ChatMessage) });
          });
          setMessages(msgs);
        });

        return () => {
          unsubscribeMessages();
        };
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribeAuth();
  }, [navigate, userProfile?.isDemoMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Combine fixed demo conversation with any dynamic demo messages
  const displayMessages: ChatMessage[] = isDemoMode
    ? (messages.length > 0 ? [...FIXED_DEMO_CONVERSATION, ...messages] : FIXED_DEMO_CONVERSATION)
    : messages;

  const suggestedQuestions = isDemoMode ? [
    "What are our peak rush hours and slowest dead windows?",
    "Which products generate our highest profit margins?",
    "Why are weekend sales so much higher than weekdays?",
    "How can we reduce our ingredient prime costs?"
  ] : [
    "What is my top revenue product this month?",
    "Can you analyze my average order value trend?",
    "How can I improve my coffee gross margin?"
  ];

  const handleSend = async (questionText?: string) => {
    const queryToSend = (questionText || input).trim();
    if (!queryToSend || loading || !auth.currentUser) return;
    if (limitReached && !isDemoMode) return;

    setLoading(true);
    setInput("");

    const userId = auth.currentUser.uid;
    // Strict partition: Demo vs Live collections
    const collectionKey = isDemoMode 
      ? `chats/${userId}_demo/messages` 
      : `chats/${userId}_live/messages`;
    
    const messagesRef = collection(db, collectionKey);

    const nowLabel = isDemoMode 
      ? "Sun, 14 Sep 2026 · 6:30 PM IST"
      : `${currentLiveTime.date} · ${currentLiveTime.time}`;

    try {
      // 1. Add user message to Firestore
      await addDoc(messagesRef, {
        role: "user",
        content: queryToSend,
        dateContext: nowLabel,
        timestamp: serverTimestamp()
      });

      // 2. Fetch live metrics if in live mode
      let metricsData: any = null;
      if (!isDemoMode) {
        const metricsDoc = await getDoc(doc(db, "metrics", userId));
        if (metricsDoc.exists()) metricsData = metricsDoc.data();
      }

      // Generate intelligent, structured chart-backed response
      const analystOutput = await generateSmartAnalystResponse(queryToSend, isDemoMode, metricsData);

      // 3. Save assistant message with structured chart and reasoning
      await addDoc(messagesRef, {
        role: "assistant",
        content: analystOutput.content,
        chart: analystOutput.chart || null,
        reasoningSteps: analystOutput.reasoningSteps || [],
        recommendations: analystOutput.recommendations || [],
        dateContext: nowLabel,
        timestamp: serverTimestamp()
      });

      // 4. Increment usage counter if live mode
      if (!isDemoMode) {
        await updateDoc(doc(db, "users", userId), {
          aiMessageCount: increment(1)
        });
      }
    } catch (error) {
      console.error("Error asking analyst:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface antialiased font-body-md text-body-md min-h-screen selection:bg-secondary-fixed selection:text-on-secondary-fixed-variant">
      <div className="flex h-screen w-full overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar userProfile={userProfile} />

        {/* MAIN CHAT CANVAS */}
        <div className="md:ml-60 flex-1 flex flex-col h-screen overflow-hidden relative">
          
          {/* Header Bar - Exactly matches menu tab name "AI Analyst" */}
          <header className="sticky top-0 z-30 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant pl-16 md:pl-6 pr-6 py-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-on-surface">AI Analyst</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  Financial Copilot
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[13px] text-primary">schedule</span>
                {isDemoMode ? (
                  <span>Demo Context Clock: <strong>Sun, 14 Sep 2026 · 6:30 PM IST</strong></span>
                ) : (
                  <span>Live Production Clock: <strong>{currentLiveTime.date} · {currentLiveTime.time}</strong></span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <DemoToggle isDemoMode={isDemoMode} />
            </div>
          </header>

          {/* Mode Context Badge Bar */}
          <div className={`px-6 py-2 border-b text-xs flex items-center justify-between ${
            isDemoMode ? "bg-amber-50/70 border-amber-200/60 text-amber-900" : "bg-emerald-50/70 border-emerald-200/60 text-emerald-900"
          }`}>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">
                {isDemoMode ? "science" : "storefront"}
              </span>
              <span>
                {isDemoMode 
                  ? "Demo Workspace: Analyzing 13,546 historical sales rows up to 14 Sep 2026. Questions here are stored separately from Live mode." 
                  : "Live Production: Connected to your cafe's live register uploads. Real-time timestamps active."}
              </span>
            </span>
            <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded border bg-surface-container-lowest">
              {isDemoMode ? "Demo Feed" : "Live Feed"}
            </span>
          </div>

          {/* Chat Stream */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {displayMessages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 text-on-surface-variant">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-sm">
                    <span className="material-symbols-outlined text-3xl">psychology</span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface mb-1">Your Café Business Analyst is Ready</h3>
                  <p className="max-w-md text-xs text-on-surface-variant leading-relaxed">
                    Ask any question regarding your sales velocity, margin leakages, recipe profitability, or peak hour patterns. Every analysis includes visual charts and concrete explanations.
                  </p>
                </div>
              ) : (
                displayMessages.map((msg, idx) => (
                  <div key={msg.id || idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start gap-3`}>
                    {msg.role !== "user" && (
                      <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <span className="material-symbols-outlined text-lg">coffee</span>
                      </div>
                    )}

                    <div className={`max-w-2xl sm:max-w-3xl w-full rounded-2xl p-5 shadow-sm space-y-4 ${
                      msg.role === "user" 
                        ? "bg-primary text-on-primary rounded-tr-sm ml-12" 
                        : "bg-surface-container-lowest border border-outline-variant/70 text-on-surface rounded-tl-sm"
                    }`}>
                      {/* Message Header with Timestamp & Context */}
                      <div className="flex items-center justify-between text-[11px] opacity-75 border-b pb-2 border-outline-variant/30">
                        <span className="font-bold uppercase tracking-wider flex items-center gap-1">
                          {msg.role === "user" ? "You" : "Brewlytics AI Analyst"}
                        </span>
                        <span>{msg.dateContext || (isDemoMode ? "Sun, 14 Sep 2026 · 6:30 PM IST" : "Today")}</span>
                      </div>

                      {/* Main Message Content */}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                        {msg.content}
                      </p>

                      {/* Chart Card Component */}
                      {msg.chart && (
                        <div className="mt-4 p-4 rounded-xl bg-surface-container-low/40 border border-outline-variant/70 space-y-3.5">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/40 pb-2.5">
                            <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm text-primary">bar_chart</span>
                              {msg.chart.title}
                            </span>
                            {msg.chart.summaryBadge && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                {msg.chart.summaryBadge}
                              </span>
                            )}
                          </div>

                          {/* Chart Bars & Metrics */}
                          <div className="space-y-3 pt-1">
                            {msg.chart.data.map((item, cIdx) => (
                              <div key={cIdx} className="space-y-1">
                                <div className="flex items-center justify-between text-xs font-semibold">
                                  <span className="text-on-surface">{item.label}</span>
                                  <span className={`font-mono font-bold ${
                                    item.status === "alert" ? "text-red-700" : item.status === "good" ? "text-emerald-700" : "text-on-surface"
                                  }`}>
                                    {item.percentage !== undefined ? `${item.percentage}%` : `${item.value}${item.unit || ""}`}
                                  </span>
                                </div>

                                {/* Visual Progress Bar */}
                                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden flex">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      item.status === "alert" 
                                        ? "bg-red-500" 
                                        : item.status === "good" 
                                          ? "bg-emerald-500" 
                                          : item.color || "bg-violet-600"
                                    }`}
                                    style={{ width: `${Math.min(item.percentage || item.value || 0, 100)}%` }}
                                  ></div>
                                </div>

                                {item.annotation && (
                                  <p className="text-[11px] text-on-surface-variant font-mono">
                                    {item.annotation}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reasoning & Diagnostic Steps */}
                      {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                        <div className="mt-3 p-3.5 rounded-xl bg-surface-container-low/30 border border-outline-variant/50 space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-xs text-primary">psychology</span>
                            Analyst Diagnostics &amp; Evidence:
                          </p>
                          <ul className="space-y-1.5 text-xs text-on-surface-variant">
                            {msg.reasoningSteps.map((step, sIdx) => (
                              <li key={sIdx} className="flex items-start gap-2">
                                <span className="text-primary font-bold mt-0.5">•</span>
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Prescribed Operational Recommendations */}
                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="mt-2 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-xs text-emerald-700">task_alt</span>
                            Tactical Action Steps:
                          </p>
                          <div className="space-y-1 text-xs text-emerald-950 font-medium">
                            {msg.recommendations.map((rec, rIdx) => (
                              <div key={rIdx} className="flex items-start gap-2">
                                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                  {rIdx + 1}
                                </span>
                                <span className="leading-relaxed">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {msg.role === "user" && (
                      <div className="w-9 h-9 rounded-full bg-secondary-fixed text-primary flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                        {userProfile ? userProfile.fullName.substring(0, 2).toUpperCase() : "U"}
                      </div>
                    )}
                  </div>
                ))
              )}

              {loading && (
                <div className="flex justify-start items-start gap-3 animate-fade-in">
                  <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl rounded-tl-sm p-4 text-xs text-on-surface space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">Analyzing café register sales &amp; cost logs...</span>
                      <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                    </div>
                    <p className="text-on-surface-variant">Generating financial diagnostics and visual breakdown...</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </main>

          {/* Quick Prompt Suggestions */}
          <div className="px-4 py-2 border-t border-outline-variant/30 bg-surface-container-lowest/80 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider shrink-0 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-primary">lightbulb</span>
              Suggested:
            </span>
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="whitespace-nowrap px-3 py-1 rounded-full text-xs bg-surface-container hover:bg-surface-container-low border border-outline-variant text-on-surface transition-colors shadow-sm shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-4 border-t border-outline-variant bg-surface-container-lowest">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 border border-outline-variant/80 rounded-xl p-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-sm bg-surface-container-lowest">
                <input 
                  type="text" 
                  disabled={limitReached || loading}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                  className="flex-1 bg-transparent border-0 text-on-surface placeholder:text-outline text-sm px-2 focus:outline-none disabled:opacity-50" 
                  placeholder={limitReached ? (isDemoMode ? "ur demo quota exceeded..switch to live mode, upload ur data and start analyzing and growing ur cafe" : "Message limit reached on your plan. Please upgrade in Settings.") : "Ask anything about peak hours, milk margins, chai velocity, or weekend staffing..."} 
                />
                <button 
                  disabled={loading || limitReached || !input.trim()} 
                  onClick={() => handleSend()} 
                  className="w-10 h-10 rounded-lg bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center transition-all disabled:opacity-40 shadow-sm shrink-0"
                  title="Send message"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span className="material-symbols-outlined text-lg">arrow_upward</span>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between text-[11px] text-on-surface-variant mt-2 px-1">
                <span>Brewlytics Copilot analyzes verified POS CSV records.</span>
                {!isDemoMode && (
                  <span className={`px-2 py-0.5 rounded font-semibold ${limitReached ? "bg-red-100 text-red-800" : "bg-surface-container"}`}>
                    {isFreePlan ? "Free Plan" : isProPlan ? "Pro Plan" : "Business"}: {messagesUsed} / {isFreePlan ? 5 : isProPlan ? 20 : 100} messages used.
                    {limitReached && <Link to="/settings" className="ml-1 text-primary underline font-bold">Upgrade</Link>}
                  </span>
                )}
                {isDemoMode && (
                  <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Demo Mode · {messages.filter(m => m.role === 'user').length} / 5 Messages Used
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
