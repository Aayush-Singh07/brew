Created At: 2026-09-27T21:08:13+05:30
Completed At: 2026-09-27T21:08:13+05:30
File Path: `file:///c:/Users/meera/OneDrive/Desktop/Workpsace/Fluxatic/Brewlytics/src/pages/LandingPage.tsx`
Total Lines: 602
Total Bytes: 39203
Showing lines 1 to 602
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: import { Link, useNavigate } from "react-router-dom";
2: 
3: export default function LandingPage() {
4:   const navigate = useNavigate();
5:   return (
6:     <div className="bg-background text-on-surface antialiased font-body-md text-body-md min-h-screen selection:bg-secondary-fixed selection:text-on-secondary-fixed-variant">
7:       
8: {/*  TOP NAV BAR (Shared Component: TopNavBar web_header execution)  */}
9: <header className="bg-surface-container-lowest dark:bg-inverse-surface border-b border-outline-variant dark:border-outline shadow-sm sticky top-0 z-50">
10: <div className="flex items-center justify-between w-full h-16 px-gutter max-w-7xl mx-auto">
11: {/*  Brand Logo  */}
12: <Link className="flex items-center gap-space-sm group" to="/signuplogin">
13: <img alt="Brewlytics Logo" className="h-20 md:h-24 w-auto object-contain transition-transform group-hover:scale-102" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuJED-yJigROSRKya3uZjCI0ufBRaEnBING_CTM46U9WWxWgZ7buiLvDtrKEtHlCvh665BLwOeAQ-B9c6MHpavoW9AnWRY3dIfOv6EzQYlOp5kRqkASzebbcsP1GLXbqmrUPj2c2NTlkFFA0iEcpxcB6JATzz0vt7OtAQnc0m7_3jbAuYnFXnSaE94myNTfWXsKYWhcxGB0YCEo0Q7QAIn60X-fr10mm5vUIw0YqnkcitkQCOIIMEGLZKPVDtcaiVpFQ"/>
14: </Link>
15: {/*  Desktop Navigation Links from JSON Anchor  */}
16: <nav className="hidden md:flex items-center gap-space-lg">
17: <Link className="text-on-surface-variant dark:text-outline-variant font-body-md text-body-md hover:text-primary dark:hover:text-inverse-primary transition-colors duration-150" to="/signuplogin">Features</Link>
18: <Link className="text-on-surface-variant dark:text-outline-variant font-body-md text-body-md hover:text-primary dark:hover:text-inverse-primary transition-colors duration-150" to="/signuplogin">Pricing</Link>
19: <Link className="text-primary dark:text-inverse-primary font-title-md text-title-md flex items-center gap-1 hover:text-primary dark:hover:text-inverse-primary transition-colors duration-150" to="/signuplogin">
20:           Demo
21:           <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container-high text-primary">Live</span>
22: </Link>
23: </nav>
24: {/*  Trailing Actions from JSON Anchor  */}
25: <div className="flex items-center gap-space-sm">
26: <Link className="hidden sm:inline-flex items-center justify-center px-space-md py-2 rounded-lg text-on-surface font-title-md text-body-md bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant transition-colors duration-150" to="/signuplogin">
27:           Sign In
28:         </Link>
29: <Link className="inline-flex items-center justify-center px-space-md py-2 rounded-lg text-on-primary font-title-md text-body-md bg-primary-container hover:bg-secondary active:scale-99 transition-all duration-150 shadow-sm" to="/signuplogin">
30:           Get Started
31:         </Link>
32: </div>
33: </div>
34: </header>
35: {/*  HERO SECTION  */}
36: <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-outline-variant/40">
37: {/*  Subtle Ambient Violet Light Wash  */}
38: <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-gradient-to-b from-secondary-fixed/30 via-surface-container/20 to-transparent blur-3xl pointer-events-none -z-10"></div>
39: <div className="max-w-7xl mx-auto px-gutter flex flex-col items-center text-center">
40: {/*  Tagline Pill  */}
41: <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/60 shadow-xs mb-6">
42: <span className="text-primary font-title-md text-label-md">✨ Know your café. Grow your business.</span>
43: <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
44: </div>
45: {/*  Hero Headline  */}
46: <h1 className="font-display text-display md:text-5xl text-on-surface max-w-4xl tracking-tight mb-6">
47:         Your café’s data analyst. <br className="hidden sm:inline"/>
48: <span className="text-primary-container">Without the analyst.</span>
49: </h1>
50: {/*  Hero Subheadline  */}
51: <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-8 leading-relaxed">
52:         Upload raw POS &amp; sales CSVs from Square, Toast, Clover, or Lightspeed. Unlock immediate AI recommendations on peak hours, dead stock, and profit margins.
53:       </p>
54: {/*  CTAs & Interaction Controls  */}
55: <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-10">
56: <Link className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-on-primary bg-primary-container hover:bg-secondary font-title-md text-body-lg active:scale-99 transition-all duration-150 shadow-sm group" to="/signuplogin">
57: <span>Analyze My Café Free</span>
58: <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform" data-icon="arrow_forward">arrow_forward</span>
59: </Link>
60: <Link className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-on-surface bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant font-title-md text-body-lg active:scale-99 transition-all duration-150" to="/signuplogin">
61: <span className="material-symbols-outlined text-primary text-[20px]" data-icon="play_circle">play_circle</span>
62: <span>Watch 2-Min Demo</span>
63: </Link>
64: </div>
65: {/*  Social Proof Badge  */}
66: <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-2 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs">
67: <div className="flex -space-x-2">
68: <div className="w-7 h-7 rounded-full bg-secondary-container/40 border-2 border-surface-container-lowest flex items-center justify-center font-label-sm text-on-secondary-container">AR</div>
69: <div className="w-7 h-7 rounded-full bg-surface-container-high border-2 border-surface-container-lowest flex items-center justify-center font-label-sm text-primary">SC</div>
70: <div className="w-7 h-7 rounded-full bg-primary-fixed border-2 border-surface-container-lowest flex items-center justify-center font-label-sm text-on-primary-fixed">BL</div>
71: </div>
72: <div className="h-3 w-px bg-outline-variant"></div>
73: <p className="font-label-md text-label-md text-on-surface-variant">
74:           Trusted by <strong className="text-on-surface font-semibold">450+</strong> independent specialty roasters &amp; coffee shops
75:         </p>
76: </div>
77: </div>
78: </section>
79: {/*  VALUE STRIP (Ingest -> Analyze -> Act)  */}
80: <section className="py-12 bg-surface-container-low/40 border-b border-outline-variant/40">
81: <div className="max-w-7xl mx-auto px-gutter">
82: <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
83: {/*  Step 1  */}
84: <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/70 custom-card-shadow custom-card-hover transition-all duration-200 flex flex-col justify-between">
85: <div>
86: <div className="flex items-center justify-between mb-4">
87: <span className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
88: <span className="material-symbols-outlined text-[22px]" data-icon="upload_file">upload_file</span>
89: </span>
90: <span className="font-label-sm text-label-sm text-outline px-2 py-0.5 rounded bg-surface-container">STEP 01</span>
91: </div>
92: <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Instant CSV Ingestion</h3>
93: <p className="font-body-md text-body-md text-on-surface-variant mb-4">
94:               Drag &amp; drop exported CSVs straight from Square, Toast, Clover, or Lightspeed without any manual field-mapping.
95:             </p>
96: </div>
97: <div className="pt-3 border-t border-outline-variant/40 flex items-center gap-2 text-primary font-label-md text-label-md">
98: <span className="material-symbols-outlined text-[16px]" data-icon="check_circle">check_circle</span>
99: <span>Zero API setup required</span>
100: </div>
101: </div>
102: {/*  Step 2  */}
103: <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/70 custom-card-shadow custom-card-hover transition-all duration-200 flex flex-col justify-between">
104: <div>
105: <div className="flex items-center justify-between mb-4">
106: <span className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
107: <span className="material-symbols-outlined text-[22px]" data-icon="psychology">psychology</span>
108: </span>
109: <span className="font-label-sm text-label-sm text-outline px-2 py-0.5 rounded bg-surface-container">STEP 02</span>
110: </div>
111: <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Autonomous AI Analysis</h3>
112: <p className="font-body-md text-body-md text-on-surface-variant mb-4">
113:               Our coffee-tuned LLM calculates real gross margins, detects hidden wastage, and flags ticket speed bottlenecks automatically.
114:             </p>
115: </div>
116: <div className="pt-3 border-t border-outline-variant/40 flex items-center gap-2 text-primary font-label-md text-label-md">
117: <span className="material-symbols-outlined text-[16px]" data-icon="auto_awesome">auto_awesome</span>
118: <span>Trained on 2M+ cafe tickets</span>
119: </div>
120: </div>
121: {/*  Step 3  */}
122: <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/70 custom-card-shadow custom-card-hover transition-all duration-200 flex flex-col justify-between">
123: <div>
124: <div className="flex items-center justify-between mb-4">
125: <span className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
126: <span className="material-symbols-outlined text-[22px]" data-icon="insights">insights</span>
127: </span>
128: <span className="font-label-sm text-label-sm text-outline px-2 py-0.5 rounded bg-surface-container">STEP 03</span>
129: </div>
130: <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Actionable Playbooks</h3>
131: <p className="font-body-md text-body-md text-on-surface-variant mb-4">
132:               Get weekly shift adjustment schedules, cold brew batch size targets, and recipe margin tweaks you can execute immediately.
133:             </p>
134: </div>
135: <div className="pt-3 border-t border-outline-variant/40 flex items-center gap-2 text-primary font-label-md text-label-md">
136: <span className="material-symbols-outlined text-[16px]" data-icon="trending_up">trending_up</span>
137: <span>Avg. +₹1,850 monthly margin</span>
138: </div>
139: </div>
140: </div>
141: </div>
142: </section>
143: {/*  INTERACTIVE SIMULATED AI DEMO PREVIEW  */}
144: <section className="py-16 md:py-24 max-w-7xl mx-auto px-gutter" id="demo">
145: <div className="text-center max-w-3xl mx-auto mb-12">
146: <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-primary mb-3">
147: <span className="material-symbols-outlined text-[16px]" data-icon="forum">forum</span>
148: <span>COFFEE SPECIALIZED AI COPILOT</span>
149: </div>
150: <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-4">Ask plain questions. Get margin-saving answers.</h2>
151: <p className="font-body-lg text-body-lg text-on-surface-variant">Stop squinting at pivot tables. Brewlytics translates complex register logs into straightforward operational decisions.</p>
152: </div>
153: {/*  Interface Mockup Window  */}
154: <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 popover-shadow overflow-hidden max-w-5xl mx-auto" id="interactive-preview">
155: {/*  Window Title Bar  */}
156: <div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant/60 flex items-center justify-between">
157: <div className="flex items-center gap-2">
158: <span className="w-3 h-3 rounded-full bg-error/60"></span>
159: <span className="w-3 h-3 rounded-full bg-amber-400"></span>
160: <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
161: <span className="ml-2 font-label-sm text-label-sm text-outline font-medium hidden sm:inline">Brewlytics AI Session — Artisan Roast Co. (Portland Flagship)</span>
162: </div>
163: <div className="flex items-center gap-3">
164: <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest text-primary font-label-sm text-label-sm border border-outline-variant/40">
165: <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
166:             Toast POS Synced
167:           </span>
168: </div>
169: </div>
170: {/*  Chat / Analysis Workspace  */}
171: <div className="p-6 md:p-8 space-y-6 bg-surface-bright">
172: {/*  User Query Bubble  */}
173: <div className="flex justify-end">
174: <div className="bg-primary-container text-on-primary rounded-2xl rounded-tr-xs px-5 py-3.5 max-w-lg shadow-sm">
175: <p className="font-body-md text-body-md font-medium">Why was Tuesday worse than Monday?</p>
176: <span className="block text-[11px] text-on-primary-container/80 text-right mt-1">10:42 AM · Artisan Roast Co.</span>
177: </div>
178: </div>
179: {/*  AI Analyst Response Bubble  */}
180: <div className="flex gap-3 md:gap-4 items-start max-w-3xl">
181: <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
182: <span className="material-symbols-outlined text-[20px]" data-icon="psychology">psychology</span>
183: </div>
184: <div className="bg-surface-container-lowest rounded-2xl rounded-tl-xs p-5 md:p-6 border border-outline-variant/80 custom-card-shadow flex-1">
185: <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3 mb-4">
186: <div className="flex items-center gap-2">
187: <span className="font-title-md text-title-md text-on-surface font-semibold">Brewlytics AI</span>
188: <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container-high text-primary">Model 4.2 Roasted</span>
189: </div>
190: <span className="font-label-sm text-label-sm text-outline">Processed 1,842 lines</span>
191: </div>
192: {/*  Narrative Breakdown  */}
193: <p className="font-body-md text-body-md text-on-surface mb-3 leading-relaxed">
194:               Tuesday gross revenue was down <strong className="text-error font-semibold">18% (₹1,420 vs ₹1,732)</strong>. The drop was concentrated in afternoon espresso drinks (2-5 PM) following rainy weather. Cold brew batches were over-prepped resulting in <strong className="text-error font-semibold">₹140 food waste</strong>.
195:             </p>
196: {/*  Inline Comparative Micro Chart  */}
197: <div className="my-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/50">
198: <div className="flex justify-between items-center mb-3">
199: <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Hourly Revenue Comparison (Monday vs Tuesday)</span>
200: <div className="flex items-center gap-3 text-label-sm font-label-sm">
201: <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary-container"></span> Mon</span>
202: <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-outline-variant"></span> Tue</span>
203: </div>
204: </div>
205: {/*  Bar Comparison Simulation  */}
206: <div className="space-y-2">
207: <div>
208: <div className="flex justify-between text-[11px] text-outline mb-1">
209: <span>7 AM - 10 AM (Morning Rush)</span>
210: <span className="font-semibold text-on-surface">₹680 vs ₹640 (-5%)</span>
211: </div>
212: <div className="w-full bg-surface-container-high rounded-full h-2.5 flex overflow-hidden">
213: <div className="bg-primary-container h-2.5 rounded-full" style={{ "width": "78%" }}></div>
214: </div>
215: </div>
216: <div>
217: <div className="flex justify-between text-[11px] text-outline mb-1">
218: <span>11 AM - 1 PM (Lunch Spike)</span>
219: <span className="font-semibold text-on-surface">₹520 vs ₹510 (-2%)</span>
220: </div>
221: <div className="w-full bg-surface-container-high rounded-full h-2.5 flex overflow-hidden">
222: <div className="bg-primary-container h-2.5 rounded-full" style={{ "width": "62%" }}></div>
223: </div>
224: </div>
225: <div>
226: <div className="flex justify-between text-[11px] text-outline mb-1">
227: <span className="text-error font-semibold">2 PM - 5 PM (Afternoon Drop)</span>
228: <span className="font-semibold text-error">₹532 vs ₹270 (-49%)</span>
229: </div>
230: <div className="w-full bg-error-container/40 rounded-full h-2.5 flex overflow-hidden">
231: <div className="bg-error h-2.5 rounded-full" style={{ "width": "32%" }}></div>
232: </div>
233: </div>
234: </div>
235: </div>
236: {/*  Action Recommendation Callout  */}
237: <div className="p-3.5 rounded-xl bg-surface-container-high/60 border border-secondary-container/40 flex items-start gap-3">
238: <span className="material-symbols-outlined text-primary text-[20px] mt-0.5" data-icon="lightbulb">lightbulb</span>
239: <div className="font-body-sm text-body-sm text-on-surface">
240: <span className="font-semibold text-primary">Recommendation:</span> Run a <strong>20% rainy-day mobile discount code</strong> during 2-4 PM slow windows to boost espresso ticket throughput and cut batch prep volume by 2 gallons.
241:               </div>
242: </div>
243: {/*  Quick Action Pills  */}
244: <div className="mt-4 pt-3 border-t border-outline-variant/30 flex flex-wrap gap-2">
245: <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md transition-colors flex items-center gap-1.5">
246: <span className="material-symbols-outlined text-[15px]" data-icon="schedule">schedule</span>
247:                 Adjust Tuesday Barista Schedule
248:               </button>
249: <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md transition-colors flex items-center gap-1.5">
250: <span className="material-symbols-outlined text-[15px]" data-icon="campaign">campaign</span>
251:                 Draft Rainy Day SMS Promo
252:               </button>
253: </div>
254: </div>
255: </div>
256: </div>
257: {/*  Quick Prompt Input Box Simulation  */}
258: <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/60">
259: <div className="relative flex items-center">
260: <input className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-4 pr-24 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none cursor-default" readOnly={true} type="text" value="What drinks have the highest food cost percentage this week?"/>
261: <button onClick={() => navigate("/signuplogin")} className="absolute right-2 px-3 py-1.5 rounded-md bg-primary-container text-on-primary font-label-md text-label-md flex items-center gap-1 hover:bg-secondary transition-colors">
262:             Ask AI
263:             <span className="material-symbols-outlined text-[14px]" data-icon="arrow_upward">arrow_upward</span>
264: </button>
265: </div>
266: </div>
267: </div>
268: </section>
269: {/*  CORE FEATURE HIGHLIGHTS (Bento Grid)  */}
270: <section className="py-16 bg-surface-container-low/30 border-y border-outline-variant/40" id="features">
271: <div className="max-w-7xl mx-auto px-gutter">
272: <div className="text-center max-w-2xl mx-auto mb-14">
273: <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-3">Designed for the floor. Built for the books.</h2>
274: <p className="font-body-lg text-body-lg text-on-surface-variant">Four mission-critical analytics engines working continuously behind your espresso bar.</p>
275: </div>
276: <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
277: {/*  Feature 1: Real-time Revenue & Margins  */}
278: <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/80 custom-card-shadow custom-card-hover transition-all">
279: <div className="flex items-center justify-between mb-4">
280: <span className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
281: <span className="material-symbols-outlined" data-icon="show_chart">show_chart</span>
282: </span>
283: <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
284:               +14.2% Margin Lift
285:             </span>
286: </div>
287: <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Real-time Revenue &amp; Margin Trends</h3>
288: <p className="font-body-md text-body-md text-on-surface-variant mb-6">
289:             Instantly view gross profit per ounce of roasted bean and dairy alternative, factoring dynamic wholesale cost shifts.
290:           </p>
291: {/*  Mini Data Visualization Box  */}
292: <div className="p-4 rounded-lg bg-surface-bright border border-outline-variant/50">
293: <div className="flex justify-between items-end mb-2">
294: <div>
295: <span className="font-label-sm text-label-sm text-outline">Oat Milk Latte Margin</span>
296: <div className="font-headline-md text-headline-md text-on-surface">76.4% <span className="font-label-sm text-label-sm text-emerald-600">↑ 3.1%</span></div>
297: </div>
298: <span className="text-outline font-label-sm text-label-sm">30-Day Avg</span>
299: </div>
300: {/*  Sparkline Graphic  */}
301: <div className="h-8 flex items-end gap-1.5">
302: <div className="flex-1 bg-surface-container-high rounded-t h-[40%]"></div>
303: <div className="flex-1 bg-surface-container-high rounded-t h-[55%]"></div>
304: <div className="flex-1 bg-surface-container-high rounded-t h-[48%]"></div>
305: <div className="flex-1 bg-surface-container-high rounded-t h-[65%]"></div>
306: <div className="flex-1 bg-surface-container-high rounded-t h-[70%]"></div>
307: <div className="flex-1 bg-primary-container rounded-t h-[88%]"></div>
308: <div className="flex-1 bg-primary rounded-t h-[94%]"></div>
309: </div>
310: </div>
311: </div>
312: {/*  Feature 2: 24/7 AI Sommelier & Analyst  */}
313: <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/80 custom-card-shadow custom-card-hover transition-all">
314: <div className="flex items-center justify-between mb-4">
315: <span className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
316: <span className="material-symbols-outlined" data-icon="coffee">coffee</span>
317: </span>
318: <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container text-primary font-semibold">
319:               Natural Language
320:             </span>
321: </div>
322: <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">24/7 AI café owner &amp; Analyst</h3>
323: <p className="font-body-md text-body-md text-on-surface-variant mb-6">
324:             Ask any question via web or mobile. Inquire about origin roast decay, seasonal syrup sell-through, or single-origin pour-over velocity.
325:           </p>
326: <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/60 flex items-center gap-3">
327: <span className="w-2.5 h-2.5 rounded-full bg-primary-container flex-shrink-0"></span>
328: <p className="font-body-sm text-body-sm text-on-surface-variant italic">
329:               "Ethiopian Yirgacheffe batch sells 3x faster between 8-10 AM. Shift second grinder hopper to prevent morning queue stalls."
330:             </p>
331: </div>
332: </div>
333: {/*  Feature 3: Peak Hour Heatmap & Staffing Predictor  */}
334: <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/80 custom-card-shadow custom-card-hover transition-all">
335: <div className="flex items-center justify-between mb-4">
336: <span className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
337: <span className="material-symbols-outlined" data-icon="grid_view">grid_view</span>
338: </span>
339: <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant">
340:               Predictive Roster
341:             </span>
342: </div>
343: <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Peak Hour Heatmap &amp; Staffing Predictor</h3>
344: <p className="font-body-md text-body-md text-on-surface-variant mb-6">
345:             Eliminate double-barista dead shifts. Match hourly schedule headcounts directly against historical drink preparation density.
346:           </p>
347: {/*  Heatmap Matrix Mini  */}
348: <div className="grid grid-cols-7 gap-1.5 text-center font-label-sm text-[10px]">
349: <span className="text-outline">M</span>
350: <span className="text-outline">T</span>
351: <span className="text-outline">W</span>
352: <span className="text-outline">T</span>
353: <span className="text-outline">F</span>
354: <span className="text-primary font-semibold">S</span>
355: <span className="text-primary font-semibold">S</span>
356: <div className="h-6 rounded bg-surface-container-high"></div>
357: <div className="h-6 rounded bg-surface-container-low"></div>
358: <div className="h-6 rounded bg-surface-container-high"></div>
359: <div className="h-6 rounded bg-primary-fixed"></div>
360: <div className="h-6 rounded bg-primary-container/80 text-white flex items-center justify-center">Rush</div>
361: <div className="h-6 rounded bg-primary-container text-white flex items-center justify-center">Peak</div>
362: <div className="h-6 rounded bg-primary-container text-white flex items-center justify-center">Peak</div>
363: </div>
364: </div>
365: {/*  Feature 4: Menu Profitability Matrix  */}
366: <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/80 custom-card-shadow custom-card-hover transition-all">
367: <div className="flex items-center justify-between mb-4">
368: <span className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
369: <span className="material-symbols-outlined" data-icon="category">category</span>
370: </span>
371: <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-semibold">
372:               Boston Box
373:             </span>
374: </div>
375: <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Menu Profitability Matrix</h3>
376: <p className="font-body-md text-body-md text-on-surface-variant mb-4">
377:             Autonomous categorization of your entire menu into Stars (High Vol / High Margin), Workhorses, Puzzles, and margin-draining Dogs.
378:           </p>
379: <div className="grid grid-cols-2 gap-2 text-label-sm font-label-sm">
380: <div className="p-2.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-between">
381: <span>⭐ Cortado</span>
382: <strong className="font-semibold">Star</strong>
383: </div>
384: <div className="p-2.5 rounded bg-amber-50 text-amber-800 border border-amber-100 flex items-center justify-between">
385: <span>🐴 Drip 12oz</span>
386: <strong className="font-semibold">Workhorse</strong>
387: </div>
388: <div className="p-2.5 rounded bg-surface-container text-on-surface border border-outline-variant/40 flex items-center justify-between">
389: <span>🧩 Nitro Cascara</span>
390: <strong className="font-semibold">Puzzle</strong>
391: </div>
392: <div className="p-2.5 rounded bg-red-50 text-red-700 border border-red-100 flex items-center justify-between">
393: <span>⚠️ Almond Croissant</span>
394: <strong className="font-semibold">Dog (Waste)</strong>
395: </div>
396: </div>
397: </div>
398: </div>
399: </div>
400: </section>
401: {/*  TRANSPARENT PRICING TEASER  */}
402: <section className="py-16 md:py-24 max-w-7xl mx-auto px-gutter" id="pricing">
403: <div className="text-center max-w-3xl mx-auto mb-14">
404: <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-primary mb-3">
405: <span>SIMPLE, ROI-DRIVEN PRICING</span>
406: </div>
407: <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-3">Pays for itself with your first avoided batch waste.</h2>
408: <p className="font-body-lg text-body-lg text-on-surface-variant">Start free with no credit card required. Upgrade whenever you need automated multi-location sync.</p>
409: </div>
410: <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
411: {/*  Free Plan  */}
412: <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/80 custom-card-shadow flex flex-col justify-between">
413: <div>
414: <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Free</h3>
415: <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">For budding solo roasters exploring initial unit economics.</p>
416: <div className="flex items-baseline gap-1 mb-6">
417: <span className="font-display text-4xl text-on-surface font-bold">₹0</span>
418: <span className="font-body-md text-body-md text-outline">/month</span>
419: </div>
420: <ul className="space-y-3 font-body-md text-body-md text-on-surface border-t border-outline-variant/40 pt-6 mb-8">
421: <li className="flex items-center gap-2.5">
422: <span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
423: <span>1 café location</span>
424: </li>
425: <li className="flex items-center gap-2.5">
426: <span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
427: <span>3 CSV uploads / month</span>
428: </li>
429: <li className="flex items-center gap-2.5">
430: <span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
431: <span>Core Revenue Summary</span>
432: </li>
433: <li className="flex items-center gap-2.5 text-outline">
434: <span className="material-symbols-outlined text-[18px]" data-icon="close">close</span>
435: <span>AI Conversational Analyst</span>
436: </li>
437: </ul>
438: </div>
439: <Link className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low text-on-surface border border-outline-variant font-title-md text-body-md transition-colors" to="/signuplogin">
440:           Get Started Free
441:         </Link>
442: </div>
443: {/*  Pro Plan (Most Popular)  */}
444: <div className="bg-surface-container-lowest p-8 rounded-2xl border-2 border-primary-container relative custom-card-shadow flex flex-col justify-between ring-4 ring-primary-container/10">
445: <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary font-label-sm text-label-sm uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
446:           Most Popular
447:         </div>
448: <div>
449: <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Pro</h3>
450: <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">Complete analytical suite for busy independent brick-and-mortars.</p>
451: <div className="flex items-baseline gap-1 mb-6">
452: <span className="font-display text-4xl text-on-surface font-bold">₹999</span>
453: <span className="font-body-md text-body-md text-outline">/month</span>
454: </div>
455: <ul className="space-y-3 font-body-md text-body-md text-on-surface border-t border-outline-variant/40 pt-6 mb-8">
456: <li className="flex items-center gap-2.5">
457: <span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
458: <strong className="font-medium">Unlimited CSV uploads</strong>
459: </li>
460: <li className="flex items-center gap-2.5">
461: <span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
462: <span>Full 24/7 AI Analyst Copilot</span>
463: </li>
464: <li className="flex items-center gap-2.5">
465: <span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
466: <span>Hourly Peak Staffing Heatmaps</span>
467: </li>
468: <li className="flex items-center gap-2.5">
469: <span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
470: <span>Menu Profitability Matrix</span>
471: </li>
472: </ul>
473: </div>
474: <Link className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-lg bg-primary-container hover:bg-secondary text-on-primary font-title-md text-body-md active:scale-99 transition-all shadow-sm" to="/signuplogin">
475:           Start 14-Day Free Trial
476:         </Link>
477: </div>
478: {/*  Business Plan  */}
479: <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/80 custom-card-shadow flex flex-col justify-between">
480: <div>
481: <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Business</h3>
482: <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">Designed for franchise chains and wholesale multi-roastery groups.</p>
483: <div className="flex items-baseline gap-1 mb-6">
484: <span className="font-display text-4xl text-on-surface font-bold">₹2,499</span>
485: <span className="font-body-md text-body-md text-outline">/month</span>
486: </div>
487: <ul className="space-y-3 font-body-md text-body-md text-on-surface border-t border-outline-variant/40 pt-6 mb-8">
488: <li className="flex items-center gap-2.5">
489: <span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
490: <span>Up to 10 retail locations</span>
491: </li>
492: <li className="flex items-center gap-2.5">
493: <span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
494: <span>Direct Toast / Square API Sync</span>
495: </li>
496: <li className="flex items-center gap-2.5">
497: <span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
498: <span>QuickBooks &amp; Xero Accounting Export</span>
499: </li>
500: <li className="flex items-center gap-2.5">
501: <span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
502: <span>Dedicated Coffee Operations Advisor</span>
503: </li>
504: </ul>
505: </div>
506: <Link className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low text-on-surface border border-outline-variant font-title-md text-body-md transition-colors" to="/signuplogin">
507:           Contact Enterprise Sales
508:         </Link>
509: </div>
510: </div>
511: </section>
512: {/*  CTA BANNER  */}
513: <section className="py-16 bg-surface-container-lowest border-t border-outline-variant/50">
514: <div className="max-w-5xl mx-auto px-gutter text-center">
515: <div className="bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high/70 p-10 md:p-14 rounded-3xl border border-secondary-container/40">
516: <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-4">Ready to find hidden margins in your register logs?</h2>
517: <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mb-8">
518:           Upload last week’s POS sales export. Review actionable insights and batch recommendations in under 90 seconds.
519:         </p>
520: <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
521: <Link className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-on-primary bg-primary-container hover:bg-secondary font-title-md text-body-md transition-colors shadow-sm" to="/signuplogin">
522: <span>Upload My First CSV Free</span>
523: <span className="material-symbols-outlined text-[18px]" data-icon="upload_file">upload_file</span>
524: </Link>
525: <Link className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg text-on-surface bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant font-title-md text-body-md transition-colors" to="/signuplogin">
526:             See Example Output
527:           </Link>
528: </div>
529: </div>
530: </div>
531: </section>
532: {/*  FOOTER  */}
533: <footer className="bg-surface-container-lowest border-t border-outline-variant/70 pt-16 pb-12">
534: <div className="max-w-7xl mx-auto px-gutter">
535: <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-outline-variant/40">
536: {/*  Brand & Description (2 cols)  */}
537: <div className="md:col-span-2">
538: <img alt="Brewlytics Logo" className="h-20 w-auto object-contain mb-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKx43RzfRNf8Kh9RVdtCG8p8C3HSf6TuVK3ghHioko0t_NgzVTnkSHyfwWCC0v8mGyFsCQyatUSbVLj28ET_vsS_ifZb-bcJTWGkmSy5wB-HS55301roAfChEoblNJUWXrpmw2t3TgR8rlUUVqrUCNkZC7aaRwNl4VpGvN60bJ-GP_mmkYpA9EiRF4gdptrogafs5gXLnrSBLbybeF3PRub8Juj-pnJ0_a0Jv61G6i2jbcvq-rO3_EKRF1SDcN6rKBPA"/>
539: <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-6">
540:             The hospitality intelligence platform engineered for cafés, craft cafes, and multi-unit beverage operations.
541:           </p>
542: <div className="flex items-center gap-3 text-label-sm font-label-sm text-outline">
543: <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low text-primary border border-outline-variant/40">
544: <span className="material-symbols-outlined text-[14px]" data-icon="lock">lock</span>
545:               SOC2 &amp; GDPR Compliant
546:             </span>
547: <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low text-primary border border-outline-variant/40">
548: <span className="material-symbols-outlined text-[14px]" data-icon="verified_user">verified_user</span>
549:               Bank-grade 256-bit AES
550:             </span>
551: </div>
552: </div>
553: {/*  Links Column 1  */}
554: <div>
555: <h4 className="font-title-md text-body-md font-semibold text-on-surface mb-3">Product</h4>
556: <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
557: <li><Link className="hover:text-primary transition-colors" to="/signuplogin">POS Ingestion</Link></li>
558: <li><Link className="hover:text-primary transition-colors" to="/signuplogin">AI Coffee Copilot</Link></li>
559: <li><Link className="hover:text-primary transition-colors" to="/signuplogin">Pricing &amp; ROI</Link></li>
560: <li><Link className="hover:text-primary transition-colors" to="/signuplogin">Changelog</Link></li>
561: </ul>
562: </div>
563: {/*  Links Column 2  */}
564: <div>
565: <h4 className="font-title-md text-body-md font-semibold text-on-surface mb-3">Integrations</h4>
566: <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
567: <li><Link className="hover:text-primary transition-colors" to="/signuplogin">Square CSV Guide</Link></li>
568: <li><Link className="hover:text-primary transition-colors" to="/signuplogin">Toast POS Exporter</Link></li>
569: <li><Link className="hover:text-primary transition-colors" to="/signuplogin">Clover Integration</Link></li>
570: <li><Link className="hover:text-primary transition-colors" to="/signuplogin">Lightspeed Support</Link></li>
571: </ul>
572: </div>
573: {/*  Newsletter Subscription  */}
574: <div>
575: <h4 className="font-title-md text-body-md font-semibold text-on-surface mb-3">The Roaster's Ledger</h4>
576: <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
577:             Bi-weekly specialty coffee margin analysis &amp; operational frameworks.
578:           </p>
579: <form noValidate className="space-y-2" onSubmit={(e) => e.preventDefault()}>
580: <input className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary" placeholder="owner@craftcoffee.com" type="email"/>
581: <button className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-title-md text-body-sm transition-colors" type="button">
582:               Subscribe Free
583:             </button>
584: </form>
585: </div>
586: </div>
587: {/*  Copyright & Legal  */}
588: <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-outline">
589: <p>© 2025 Brewlytics Technologies, Inc. All rights reserved.</p>
590: <div className="flex items-center gap-6">
591: <Link className="hover:text-on-surface transition-colors" to="/signuplogin">Privacy Policy</Link>
592: <Link className="hover:text-on-surface transition-colors" to="/signuplogin">Terms of Service</Link>
593: <Link className="hover:text-on-surface transition-colors" to="/signuplogin">Security</Link>
594: </div>
595: </div>
596: </div>
597: </footer>
598: 
599:     </div>
600:   );
601: }
602: 
The above content shows the entire, complete file contents of the requested file.
