settings_code = """import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function WorkspaceSettingsPosIntegrations() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestedPlan, setRequestedPlan] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("idle");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubscribeUser = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
          if (docSnap.exists()) setUserProfile(docSnap.data());
        });
        return () => unsubscribeUser();
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  const handleUpgrade = (plan: string) => {
    setRequestedPlan(plan);
    setIsModalOpen(true);
    setPaymentStatus("idle");
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    const uid = auth.currentUser.uid;
    setPaymentStatus("processing");
    
    await setDoc(doc(db, "payments", uid), {
      cafeId: uid,
      status: "pending",
      requestedPlan: requestedPlan,
      requestedAt: serverTimestamp(),
      resolvedAt: null
    });
    
    // Auto resolve after 1.5s
    setTimeout(async () => {
      await updateDoc(doc(db, "payments", uid), {
        status: "approved",
        resolvedAt: serverTimestamp()
      });
      await updateDoc(doc(db, "users", uid), {
        plan: requestedPlan
      });
      setPaymentStatus("approved");
      setTimeout(() => setIsModalOpen(false), 2000);
    }, 1500);
  };

  return (
    <div className="bg-background text-on-surface antialiased font-body-md text-body-md min-h-screen selection:bg-secondary-fixed selection:text-on-secondary-fixed-variant">
      
{/*  SIDEBAR NAVIGATION */}
<aside className="fixed top-0 left-0 h-screen w-60 bg-surface-container-lowest border-r border-outline-variant z-40 flex flex-col justify-between p-space-md">
<div className="flex flex-col gap-space-md">
<div className="flex items-center gap-2.5 px-space-xs pt-1">
<img alt="Brewlytics Logo" className="h-32 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOClm6yVPWJxjAEfESLwgxHFB75xtBGYaaOblOiJCpP6XMqwukbxpsIfnk_96PA7dE3lmwUYkbOWafsxUDxOcH08wBo4avWYQzomk3cCIWLyRIuV-j1mu8kCeyb27-rb4VOto0bRDl7O_1YSB6hkZ47xSanFXxg6Fd2eGVtk3dt8v-yA46fuwQAWXj62LBiOEI5C6nBZ7BPJBsGrCZKF9P6ta-QC0xV6jzzuS1QXI4lykKjGSPVIGws80Wj4B4ThdDFg"/>
<span className="sr-only">Brewlytics</span>
</div>
<nav className="flex flex-col gap-1 mt-1">
<Link className="flex items-center gap-space-sm px-space-md py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all duration-150 font-body-md text-body-md" to="/dashboard">
<span className="material-symbols-outlined text-[20px]" data-icon="dashboard">dashboard</span>
<span>Dashboard</span>
</Link>
<Link className="flex items-center justify-between px-space-md py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all duration-150 font-body-md text-body-md group" to="/ai">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-[20px]" data-icon="psychology">psychology</span>
<span>AI Analyst</span>
</div>
<span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Online</span>
</Link>
<Link className="flex items-center justify-between px-space-md py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all duration-150 font-body-md text-body-md group" to="/insights">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-[20px]" data-icon="insights">insights</span>
<span>Insights</span>
</div>
<span className="w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold bg-primary-container text-white">3</span>
</Link>
<Link className="flex items-center gap-space-sm px-space-md py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all duration-150 font-body-md text-body-md" to="/dashboard">
<span className="material-symbols-outlined text-[20px]" data-icon="bar_chart">bar_chart</span>
<span>Reports</span>
</Link>
<Link className="flex items-center gap-space-sm px-space-md py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all duration-150 font-body-md text-body-md" to="/upload">
<span className="material-symbols-outlined text-[20px]" data-icon="upload_file">upload_file</span>
<span>CSV Upload</span>
</Link>
<Link className="flex items-center gap-space-sm px-space-md py-2.5 rounded-lg bg-surface-container-low text-primary font-title-md text-body-md font-semibold border-l-4 border-primary-container shadow-sm" to="/settings">
<span className="material-symbols-outlined text-[20px] text-primary" data-icon="settings" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
<span>Settings</span>
</Link>
</nav>
</div>
<div className="flex flex-col gap-3 pt-3 border-t border-outline-variant/60">
<div className="px-2.5 py-2 rounded-lg bg-surface-container-low/70 border border-outline-variant/40 flex flex-col gap-1">
<div className="flex items-center gap-1.5">
<span className="relative flex h-2 w-2">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
</span>
<span className="font-label-sm text-[11px] font-semibold text-emerald-800">Square POS Synced</span>
</div>
<div className="font-body-sm text-[11px] text-on-surface-variant leading-tight">
          10m ago • 18,400 orders indexed
        </div>
</div>
<button onClick={() => navigate("/upload")} className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg border border-outline-variant hover:border-primary-container/60 hover:bg-surface-container-low text-on-surface font-title-md text-xs font-semibold transition-all">
<span className="material-symbols-outlined text-sm" data-icon="upload_file">upload_file</span>
<span>Upload CSV</span>
</button>
<div className="flex items-center justify-between pt-1">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary flex items-center justify-center font-bold text-xs">
            {userProfile ? userProfile.fullName.substring(0, 2).toUpperCase() : "JM"}
          </div>
<div className="flex flex-col">
<span className="font-title-md text-xs font-semibold text-on-surface leading-tight">{userProfile ? userProfile.fullName : "Jordan Miller"}</span>
<span className="font-label-sm text-[10px] text-on-surface-variant leading-tight">{userProfile ? userProfile.plan.toUpperCase() + " PLAN" : "Head of Ops"}</span>
</div>
</div>
<button className="text-on-surface-variant hover:text-on-surface transition-colors p-1">
<span className="material-symbols-outlined text-base" data-icon="more_vert">more_vert</span>
</button>
</div>
</div>
</aside>
{/*  MAIN VIEWPORT CANVAS  */}
<main className="ml-60 flex-1 min-h-screen flex flex-col custom-scrollbar">
<header className="sticky top-0 z-30 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant px-space-xl py-space-md flex items-center justify-between">
<div>
<div className="flex items-center gap-2">
<h1 className="font-headline-md text-headline-md text-on-surface">Workspace Settings &amp; Integrations</h1>
<span className="px-2 py-0.5 rounded-full text-label-sm bg-primary-fixed text-primary font-semibold">Store #1042</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
          Manage point-of-sale API webhooks, automated COGS benchmark sheets, team permissions, and AI engine controls for Artisan Roast Co.
        </p>
</div>
<div className="flex items-center gap-3 shrink-0">
<button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-title-md text-xs font-semibold hover:bg-surface-container-low transition-colors shadow-sm">
<span>Documentation &amp; API Keys</span>
<span className="material-symbols-outlined text-sm text-on-surface-variant" data-icon="open_in_new">open_in_new</span>
</button>
<button onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-container text-white font-title-md text-xs font-semibold hover:bg-primary transition-all duration-150 shadow-sm active:scale-99">
<span className="material-symbols-outlined text-base" data-icon="check">check</span>
<span>Save Changes</span>
</button>
</div>
</header>
<div className="bg-surface-container-lowest border-b border-outline-variant px-space-xl">
<nav className="flex space-x-8 overflow-x-auto">
<Link className="py-3 px-1 border-b-2 border-primary-container text-primary font-title-md text-sm font-semibold flex items-center gap-2 shrink-0" to="#profile-section">
<span className="material-symbols-outlined text-base">person</span>
<span>User Profile</span>
</Link>
<Link className="py-3 px-1 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-body-md text-sm hover:border-outline-variant transition-colors flex items-center gap-2 shrink-0" to="#billing-section">
<span className="material-symbols-outlined text-base">credit_card</span>
<span>Billing &amp; Subscription</span>
</Link>
<Link className="py-3 px-1 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-body-md text-sm hover:border-outline-variant transition-colors flex items-center gap-2 shrink-0" to="#privacy-section">
<span className="material-symbols-outlined text-base">security</span>
<span>Data &amp; Privacy</span>
</Link>
</nav>
</div>
<div className="p-space-xl flex flex-col gap-space-xl max-w-7xl">
  <section id="profile-section" className="flex flex-col gap-4">
    <div>
      <h2 className="font-headline-sm text-headline-sm text-on-surface">User Profile</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Manage your basic account details.</p>
    </div>
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xl">
        {userProfile ? userProfile.fullName.substring(0, 2).toUpperCase() : "JM"}
      </div>
      <div>
        <h3 className="font-title-md text-lg font-semibold text-on-surface">{userProfile ? userProfile.fullName : "Jordan Miller"}</h3>
        <p className="font-body-sm text-on-surface-variant">{userProfile ? userProfile.email : "jordan@artisanroast.coffee"}</p>
      </div>
    </div>
  </section>

  <section id="billing-section" className="flex flex-col gap-4">
    <div>
      <h2 className="font-headline-sm text-headline-sm text-on-surface">Subscription &amp; Billing</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Choose the plan that fits your business needs.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm text-center">
        <h3 className="font-title-md font-bold text-lg mb-2">Free</h3>
        <p className="text-on-surface-variant mb-4">Basic features to get started</p>
        <p className="text-2xl font-bold mb-4">₹0 <span className="text-sm font-normal">/ mo</span></p>
        {userProfile?.plan === "free" ? (
          <button disabled className="w-full py-2 bg-surface-container text-on-surface font-semibold rounded-lg opacity-50 cursor-not-allowed">Current Plan</button>
        ) : (
          <button onClick={() => handleUpgrade('free')} className="w-full py-2 border border-outline-variant font-semibold rounded-lg hover:bg-surface-container-low transition-colors">Downgrade</button>
        )}
      </div>
      <div className="bg-primary-container/10 p-6 rounded-xl border border-primary shadow-sm text-center relative">
        <span className="absolute top-0 right-0 bg-primary text-on-primary text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">POPULAR</span>
        <h3 className="font-title-md font-bold text-lg mb-2 text-primary">Pro</h3>
        <p className="text-on-surface-variant mb-4">Advanced insights and AI</p>
        <p className="text-2xl font-bold mb-4 text-primary">₹999 <span className="text-sm font-normal">/ mo</span></p>
        {userProfile?.plan === "pro" ? (
          <button disabled className="w-full py-2 bg-primary text-on-primary font-semibold rounded-lg opacity-50 cursor-not-allowed">Current Plan</button>
        ) : (
          <button onClick={() => handleUpgrade('pro')} className="w-full py-2 bg-primary text-on-primary font-semibold rounded-lg hover:bg-secondary transition-colors">Upgrade to Pro</button>
        )}
      </div>
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm text-center">
        <h3 className="font-title-md font-bold text-lg mb-2">Business</h3>
        <p className="text-on-surface-variant mb-4">Multi-outlet &amp; team access</p>
        <p className="text-2xl font-bold mb-4">₹2,499 <span className="text-sm font-normal">/ mo</span></p>
        {userProfile?.plan === "business" ? (
          <button disabled className="w-full py-2 bg-surface-container text-on-surface font-semibold rounded-lg opacity-50 cursor-not-allowed">Current Plan</button>
        ) : (
          <button onClick={() => handleUpgrade('business')} className="w-full py-2 border border-outline-variant font-semibold rounded-lg hover:bg-surface-container-low transition-colors">Upgrade to Business</button>
        )}
      </div>
    </div>
  </section>
</div>
</main>

{/* Mock Payment Modal */}
{isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-surface-container-lowest rounded-xl shadow-2xl p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-on-surface">Secure Checkout</h3>
        <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <div className="p-3 mb-6 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg flex items-start gap-2">
        <span className="material-symbols-outlined text-lg">info</span>
        <span><strong>Simulated payment</strong> &mdash; no real charge will be made.</span>
      </div>
      
      <form onSubmit={handleCheckoutSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1">Card Number</label>
          <input required type="text" placeholder="4242 4242 4242 4242" className="w-full px-3 py-2 border border-outline-variant rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Expiry</label>
            <input required type="text" placeholder="MM/YY" className="w-full px-3 py-2 border border-outline-variant rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">CVC</label>
            <input required type="text" placeholder="123" className="w-full px-3 py-2 border border-outline-variant rounded-lg" />
          </div>
        </div>
        
        {paymentStatus === "idle" && (
          <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-secondary mt-2">
            Confirm Upgrade to {requestedPlan.toUpperCase()}
          </button>
        )}
        {paymentStatus === "processing" && (
          <button disabled type="button" className="w-full py-3 bg-primary/70 text-white font-bold rounded-lg flex justify-center items-center gap-2 mt-2">
            <span className="material-symbols-outlined animate-spin">sync</span>
            Processing Payment...
          </button>
        )}
        {paymentStatus === "approved" && (
          <button disabled type="button" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg flex justify-center items-center gap-2 mt-2">
            <span className="material-symbols-outlined">check_circle</span>
            Payment Successful!
          </button>
        )}
      </form>
    </div>
  </div>
)}

    </div>
  );
}
"""

with open('src/pages/WorkspaceSettingsPosIntegrations.tsx', 'w', encoding='utf-8') as f:
    f.write(settings_code)
print("Updated Workspace Settings with mock payment flow.")
