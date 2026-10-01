import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

import Sidebar from "../components/Sidebar";
import DemoToggle from "../components/DemoToggle";

// ── DEMO_NOW = 2026-09-14 18:30 IST ──────────────────────────────────────────
const DEMO_NOW_LABEL = "Sun, 14 Sep 2026 · 6:30 PM IST";

const DEMO_METRICS = {
  totalRevenue: 2649660,
  totalOrders: 7667,
  averageOrderValue: 345.59,
  totalExpenses: 2373550,
  netProfit: 276110,
  grossMargin: 71.2,
  primeCost: 68.1,
  laborCostRatio: 32.8,
  foodCostRatio: 28.8,
  avgDailyRevenue: 29440,
  weekendMultiplier: "2.1×",
  repeatOrdersRatio: 38.4,
  kpiDeltas: { revenue: 10.9, orders: 9.7, aov: 1.1, profit: -241.4, margin: 2.1, labor: -1.4 },
  revenueByDay: [
    { date: "Sep 15", revenue: 29800, expenses: 18400 },
    { date: "Sep 16", revenue: 31200, expenses: 5200 },
    { date: "Sep 17", revenue: 26500, expenses: 21000 },
    { date: "Sep 18", revenue: 27800, expenses: 4800 },
    { date: "Sep 19", revenue: 24200, expenses: 14300 },
    { date: "Sep 08", revenue: 31000, expenses: 36200 },
    { date: "Sep 09", revenue: 38200, expenses: 26900 },
    { date: "Sep 10", revenue: 45600, expenses: 23400 },
    { date: "Sep 11", revenue: 48100, expenses: 12800 },
    { date: "Sep 12", revenue: 33200, expenses: 16800 },
    { date: "Sep 13", revenue: 52800, expenses: 7200 },
    { date: "Sep 14", revenue: 38600, expenses: 33280 },
  ],
  topProducts: [
    { name: "Cappuccino", revenue: 307870, units: 1817 },
    { name: "Cafe Latte", revenue: 293400, units: 1630 },
    { name: "Chicken Sandwich", revenue: 216480, units: 1136 },
    { name: "Cold Coffee", revenue: 178800, units: 894 },
    { name: "Masala Chai", revenue: 164520, units: 1828 },
  ],
  categorySplit: [
    { category: "Hot Beverages", revenue: 1098420 },
    { category: "Snacks", revenue: 654980 },
    { category: "Cold Beverages", revenue: 593910 },
    { category: "Bakery", revenue: 302350 },
  ],
  peakHours: [
    { label: "08:00", revenue: 82340, orders: 238 },
    { label: "09:00", revenue: 195680, orders: 568 },
    { label: "10:00", revenue: 187520, orders: 543 },
    { label: "11:00", revenue: 162400, orders: 470 },
    { label: "12:00", revenue: 143200, orders: 415 },
    { label: "13:00", revenue: 128900, orders: 373 },
    { label: "14:00", revenue: 62400, orders: 181 },
    { label: "15:00", revenue: 44800, orders: 130 },
    { label: "16:00", revenue: 48200, orders: 140 },
    { label: "17:00", revenue: 98400, orders: 285 },
    { label: "18:00", revenue: 167300, orders: 485 },
    { label: "19:00", revenue: 156800, orders: 454 },
    { label: "20:00", revenue: 118600, orders: 344 },
    { label: "21:00", revenue: 52800, orders: 153 },
  ],
  expensesByCategory: [
    { category: "Ingredients", amount: 936030 },
    { category: "Salaries", amount: 868000 },
    { category: "Rent", amount: 380000 },
    { category: "Utilities", amount: 114920 },
    { category: "Marketing", amount: 47000 },
    { category: "Other", amount: 27600 },
  ],
};

const DONUT_COLORS = ["#7C3AED", "#A78BFA", "#C4B5FD", "#DDD6FE"];
const EXPENSE_COLORS = ["#F59E0B", "#EF4444", "#6366F1", "#06B6D4", "#10B981", "#94A3B8"];

const fmt = (v: number) => `₹${v.toLocaleString("en-IN")}`;
const shortFmt = (v: number) => {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
  return `₹${v}`;
};

function DeltaBadge({ delta }: { delta: number }) {
  const up = delta >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full ${up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
      <span className="material-symbols-outlined text-[12px]">{up ? "trending_up" : "trending_down"}</span>
      {Math.abs(delta)}%
    </span>
  );
}

function KpiCard({ label, value, sub, delta, icon }: { label: string; value: string; sub?: string; delta: number; icon: string }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{label}</span>
        <span className="material-symbols-outlined text-xl text-primary/60 group-hover:text-primary transition-colors">{icon}</span>
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-extrabold tracking-tight text-on-surface">{value}</span>
      </div>
      <div className="flex items-center gap-2">
        <DeltaBadge delta={delta} />
        <span className="text-xs text-on-surface-variant">vs prev 7 days</span>
      </div>
      {sub && <p className="text-xs text-on-surface-variant mt-1">{sub}</p>}
    </div>
  );
}

function MetricPillCard({ title, value, sub, status, icon }: { title: string; value: string; sub: string; status: "good" | "alert" | "neutral"; icon: string }) {
  const statusColor = status === "good" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : status === "alert" ? "text-amber-800 bg-amber-50 border-amber-200" : "text-violet-700 bg-violet-50 border-violet-200";
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/60 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant group-hover:text-primary transition-colors">{title}</span>
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center border text-sm ${statusColor}`}>
          <span className="material-symbols-outlined text-[15px]">{icon}</span>
        </span>
      </div>
      <div>
        <div className="text-xl font-black text-on-surface tracking-tight">{value}</div>
        <p className="text-[11px] text-on-surface-variant mt-1 leading-snug">{sub}</p>
      </div>
    </div>
  );
}

const CustomTooltipRevenue = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 shadow-lg text-xs">
        <p className="font-bold text-on-surface mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {fmt(p.value)}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function MainAnalyticsDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [dateRange] = useState("30d");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        onSnapshot(doc(db, "users", user.uid), (docSnap) => {
          if (docSnap.exists()) setUserProfile(docSnap.data());
        });

        const unsubscribeMetrics = onSnapshot(doc(db, "metrics", user.uid), (docSnap) => {
          if (docSnap.exists()) setMetrics(docSnap.data());
        });

        return () => unsubscribeMetrics();
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  const isDemoMode = !!userProfile?.isDemoMode;
  const hasData = isDemoMode || (metrics && metrics.totalRevenue && metrics.lastDataset);
  const dm = isDemoMode ? DEMO_METRICS : metrics;

  return (
    <div className="bg-background text-on-surface antialiased min-h-screen">
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar userProfile={userProfile} />

        <div className="md:ml-60 flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant pl-16 md:pl-6 pr-6 py-3.5 flex items-center justify-between">
            <div>
              <h1 className="font-bold text-lg text-on-surface">Dashboard</h1>
              {isDemoMode && (
                <p className="text-xs text-on-surface-variant">{DEMO_NOW_LABEL} · Demo mode</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {isDemoMode && (
                <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Demo · 14 Sep 2026
                </span>
              )}
              <DemoToggle isDemoMode={isDemoMode} />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

            {!hasData ? (
              <div className="bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant p-8 sm:p-14 text-center max-w-2xl mx-auto my-8 space-y-5 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto shadow-sm">
                  <span className="material-symbols-outlined text-3xl">upload_file</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-on-surface">Please upload your café CSV to get your metrics</h2>
                  <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                    You are in <strong>Live Café mode</strong>. Once you upload your Square, Toast, or POS sales and expense files, your gross revenue, prime costs, rush hours, and itemized margins will appear here in real-time.
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
                    Explore with Demo Data
                  </button>
                </div>
              </div>
            ) : (
              <>
            {/* AI Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-5 shadow-md text-white">
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.15%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-lg">auto_awesome</span>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-80">AI Margin Intelligence</span>
                  </div>
                  {isDemoMode ? (
                    <p className="font-semibold text-base leading-snug">
                      Weekend revenue is <strong>2× weekday average</strong>. Tue–Wed 2–5 PM is your dead window — consider a targeted combo deal to fill seats.
                    </p>
                  ) : (
                    <p className="font-semibold text-base leading-snug">Upload your sales data to get AI-powered margin intelligence.</p>
                  )}
                </div>
                <button onClick={() => navigate("/ai")} className="ml-4 shrink-0 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold border border-white/30 transition-all flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  Ask AI
                </button>
              </div>
            </div>

            {/* KPI Row */}
            {dm ? (
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <KpiCard label="Gross Revenue" value={shortFmt(dm.totalRevenue)} delta={dm.kpiDeltas?.revenue || 0} icon="payments" />
                <KpiCard label="Total Orders" value={dm.totalOrders.toLocaleString("en-IN")} delta={dm.kpiDeltas?.orders || 0} icon="receipt_long" />
                <KpiCard label="Avg Order Value" value={`₹${dm.averageOrderValue?.toFixed(0)}`} delta={dm.kpiDeltas?.aov || 0} icon="shopping_bag" />
                <KpiCard label="Net Profit" value={shortFmt(dm.netProfit || 0)} delta={dm.kpiDeltas?.profit || 0} icon="trending_up" />
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/50 shadow-sm animate-pulse">
                    <div className="h-3 bg-surface-container-high rounded w-2/3 mb-3"></div>
                    <div className="h-7 bg-surface-container-high rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-surface-container-high rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Operational Unit Economics Row */}
            {isDemoMode && dm && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">pie_chart</span>
                    Unit Economics &amp; Operational Health
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-medium">Standard Indian Café Benchmarks</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                  <MetricPillCard 
                    title="Gross Margin" 
                    value="71.2%" 
                    sub="Target >70% · Strong beverage mix" 
                    status="good" 
                    icon="trending_up" 
                  />
                  <MetricPillCard 
                    title="Prime Cost" 
                    value="68.1%" 
                    sub="Food COGS + Staff (Alert >65%)" 
                    status="alert" 
                    icon="warning" 
                  />
                  <MetricPillCard 
                    title="Labor Ratio" 
                    value="32.8%" 
                    sub="₹8.68L staff wages / ₹26.5L rev" 
                    status="alert" 
                    icon="group" 
                  />
                  <MetricPillCard 
                    title="Food COGS" 
                    value="28.8%" 
                    sub="₹7.63L dairy, coffee & bakery" 
                    status="good" 
                    icon="inventory_2" 
                  />
                  <MetricPillCard 
                    title="Daily Average" 
                    value="₹29,440" 
                    sub="Over 106 operating café days" 
                    status="neutral" 
                    icon="calendar_today" 
                  />
                  <MetricPillCard 
                    title="Weekend Lift" 
                    value="2.1×" 
                    sub="₹51.2K Sat/Sun vs ₹24.5K Mon-Fri" 
                    status="good" 
                    icon="weekend" 
                  />
                </div>
              </div>
            )}

            {/* Revenue Trend Chart */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/50 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-on-surface">Revenue vs Expenses</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">Daily trend · last {dateRange === "30d" ? "30 days" : "7 days"}</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-violet-500 inline-block"></span>Revenue</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-red-400 inline-block"></span>Expenses</span>
                </div>
              </div>
              {dm ? (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={dm.revenueByDay} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={shortFmt} tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={50} />
                    <Tooltip content={<CustomTooltipRevenue />} />
                    <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
                    <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} fill="url(#expGrad)" name="Expenses" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] animate-pulse bg-surface-container rounded-xl"></div>
              )}
            </div>

            {/* Two column row: Top Products + Category Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products Bar Chart */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/50 shadow-sm">
                <h3 className="font-bold text-on-surface mb-1">Top Products by Revenue</h3>
                <p className="text-xs text-on-surface-variant mb-5">All time · Jun–Sep 2026</p>
                {dm ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={dm.topProducts} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                      <XAxis type="number" tickFormatter={shortFmt} tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#374151" }} axisLine={false} tickLine={false} width={110} />
                      <Tooltip formatter={(v: any) => fmt(v)} cursor={{ fill: "rgba(124,58,237,0.05)" }} />
                      <Bar dataKey="revenue" name="Revenue" fill="#7C3AED" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[200px] animate-pulse bg-surface-container rounded-xl"></div>
                )}
              </div>

              {/* Category Donut */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/50 shadow-sm">
                <h3 className="font-bold text-on-surface mb-1">Revenue by Category</h3>
                <p className="text-xs text-on-surface-variant mb-2">Donut breakdown</p>
                {dm ? (
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="50%" height={180}>
                      <PieChart>
                        <Pie data={dm.categorySplit} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="revenue" nameKey="category" paddingAngle={3}>
                          {dm.categorySplit.map((_: any, idx: number) => (
                            <Cell key={idx} fill={DONUT_COLORS[idx % DONUT_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: any) => fmt(v)} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {dm.categorySplit.map((c: any, idx: number) => (
                        <div key={c.category} className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: DONUT_COLORS[idx % DONUT_COLORS.length] }}></span>
                          <span className="text-xs text-on-surface flex-1">{c.category}</span>
                          <span className="text-xs font-bold text-on-surface">{shortFmt(c.revenue)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[180px] animate-pulse bg-surface-container rounded-xl"></div>
                )}
              </div>
            </div>

            {/* Two column row: Peak Hours + Expenses Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Peak Hours */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/50 shadow-sm">
                <h3 className="font-bold text-on-surface mb-1">Peak Hours</h3>
                <p className="text-xs text-on-surface-variant mb-5">Revenue by hour of day</p>
                {dm ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={dm.peakHours} margin={{ left: 0, right: 5, top: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} interval={1} />
                      <YAxis tickFormatter={shortFmt} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={42} />
                      <Tooltip formatter={(v: any) => fmt(v)} cursor={{ fill: "rgba(124,58,237,0.05)" }} />
                      <Bar dataKey="revenue" name="Revenue" fill="#A78BFA" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[180px] animate-pulse bg-surface-container rounded-xl"></div>
                )}
              </div>

              {/* Expenses Breakdown */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/50 shadow-sm">
                <h3 className="font-bold text-on-surface mb-1">Expenses Breakdown</h3>
                <p className="text-xs text-on-surface-variant mb-2">By category · all time</p>
                {dm ? (
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="50%" height={180}>
                      <PieChart>
                        <Pie data={dm.expensesByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="amount" nameKey="category" paddingAngle={3}>
                          {dm.expensesByCategory.map((_: any, idx: number) => (
                            <Cell key={idx} fill={EXPENSE_COLORS[idx % EXPENSE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: any) => fmt(v)} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {dm.expensesByCategory.map((e: any, idx: number) => (
                        <div key={e.category} className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: EXPENSE_COLORS[idx % EXPENSE_COLORS.length] }}></span>
                          <span className="text-xs text-on-surface flex-1">{e.category}</span>
                          <span className="text-xs font-bold text-on-surface">{shortFmt(e.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[180px] animate-pulse bg-surface-container rounded-xl"></div>
                )}
              </div>
            </div>
            </>
          )}

          </main>
        </div>
      </div>
    </div>
  );
}
