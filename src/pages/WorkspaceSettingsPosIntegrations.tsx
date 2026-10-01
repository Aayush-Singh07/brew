import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, updateDoc, serverTimestamp, onSnapshot, query, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import Sidebar from "../components/Sidebar";
import DemoToggle from "../components/DemoToggle";

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

  const [demoMessagesCount, setDemoMessagesCount] = useState(0);

  useEffect(() => {
    if (userProfile?.isDemoMode && auth.currentUser) {
      const q = query(collection(db, `chats/${auth.currentUser.uid}_demo/messages`));
      const unsubscribeMessages = onSnapshot(q, (snapshot: any) => {
        const userMsgs = snapshot.docs.filter((d: any) => d.data().role === "user").length;
        setDemoMessagesCount(userMsgs);
      });
      return () => unsubscribeMessages();
    }
  }, [userProfile?.isDemoMode]);

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

  const isFreePlan = userProfile?.plan === "free";
  const isProPlan = userProfile?.plan === "pro";
  const messagesUsed = userProfile?.isDemoMode ? demoMessagesCount : (userProfile?.aiMessageCount || 0);
  const messageLimit = userProfile?.isDemoMode ? 5 : (isFreePlan ? 5 : isProPlan ? 20 : 100);
  const usagePercentage = Math.min((messagesUsed / messageLimit) * 100, 100);

  return (
    <div className="bg-background text-on-surface antialiased font-body-md text-body-md min-h-screen selection:bg-secondary-fixed selection:text-on-secondary-fixed-variant">
      
{/*  SIDEBAR NAVIGATION */}
<Sidebar userProfile={userProfile} />
{/*  MAIN VIEWPORT CANVAS  */}
<main className="md:ml-60 flex-1 min-h-screen flex flex-col custom-scrollbar">
<header className="sticky top-0 z-30 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant pl-16 md:pl-space-xl pr-space-xl py-space-md flex flex-col gap-4">
  <div className="flex items-center justify-between">
    <h1 className="font-headline-md text-headline-md text-on-surface">Settings</h1>
    <DemoToggle isDemoMode={!!userProfile?.isDemoMode} />
  </div>
</header>
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

  <section id="environment-section" className="flex flex-col gap-4">
    <div>
      <h2 className="font-headline-sm text-headline-sm text-on-surface">Data Environment</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Switch between pre-loaded demo cafe datasets and your live cafe workspace.</p>
    </div>
    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm max-w-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${userProfile?.isDemoMode ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
          <span className="material-symbols-outlined text-2xl">{userProfile?.isDemoMode ? 'science' : 'storefront'}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-title-md font-bold text-base text-on-surface">
              {userProfile?.isDemoMode ? "Demo Mode Active" : "Live Café Mode Active"}
            </h3>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${userProfile?.isDemoMode ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
              {userProfile?.isDemoMode ? "Sample Data" : "Production"}
            </span>
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant mt-1.5 leading-relaxed max-w-xl">
            {userProfile?.isDemoMode
              ? "Currently exploring pre-seeded 1 Jun – 14 Sep 2026 sales & expense figures. Ready to analyze your own café? Switch to Live mode."
              : "Connected to your custom uploaded POS transactions and expenses. Switch to Demo anytime to test features with sample data."}
          </p>
        </div>
      </div>
      <div className="shrink-0 self-start sm:self-center">
        <DemoToggle isDemoMode={!!userProfile?.isDemoMode} />
      </div>
    </div>
  </section>

  <section id="usage-section" className="flex flex-col gap-4">
    <div>
      <h2 className="font-headline-sm text-headline-sm text-on-surface">AI Copilot Usage</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Track your AI message limits based on your current plan.</p>
    </div>
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm w-full max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <span className="font-title-md font-semibold text-on-surface">Current Usage</span>
        <span className="font-title-md font-bold text-primary">{messagesUsed} <span className="text-on-surface-variant text-sm font-normal">/ {messageLimit} Messages</span></span>
      </div>
      <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${usagePercentage >= 100 ? 'bg-error' : 'bg-primary'} transition-all duration-500`} 
          style={{ width: `${usagePercentage}%` }}
        ></div>
      </div>
      {usagePercentage >= 100 && (
        <p className="mt-4 text-sm text-error font-medium">You have reached your limit. Upgrade to continue using the AI Copilot.</p>
      )}
    </div>
  </section>

  {userProfile?.isDemoMode ? null : <section id="billing-section" className="flex flex-col gap-4">
    <div>
      <h2 className="font-headline-sm text-headline-sm text-on-surface">Subscription &amp; Billing</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Choose the plan that fits your business needs.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm text-center">
        <h3 className="font-title-md font-bold text-lg mb-2">Free</h3>
        <p className="text-on-surface-variant mb-4">5 AI Messages, Basic Insights</p>
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
        <p className="text-on-surface-variant mb-4">20 AI Messages, Full Insights</p>
        <p className="text-2xl font-bold mb-4 text-primary">₹999 <span className="text-sm font-normal">/ mo</span></p>
        {userProfile?.plan === "pro" ? (
          <button disabled className="w-full py-2 bg-primary text-on-primary font-semibold rounded-lg opacity-50 cursor-not-allowed">Current Plan</button>
        ) : (
          <button onClick={() => handleUpgrade('pro')} className="w-full py-2 bg-primary text-on-primary font-semibold rounded-lg hover:bg-secondary transition-colors">Upgrade to Pro</button>
        )}
      </div>
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm text-center">
        <h3 className="font-title-md font-bold text-lg mb-2">Business</h3>
        <p className="text-on-surface-variant mb-4">100 AI Messages, Team access</p>
        <p className="text-2xl font-bold mb-4">₹2,499 <span className="text-sm font-normal">/ mo</span></p>
        {userProfile?.plan === "business" ? (
          <button disabled className="w-full py-2 bg-surface-container text-on-surface font-semibold rounded-lg opacity-50 cursor-not-allowed">Current Plan</button>
        ) : (
          <button onClick={() => handleUpgrade('business')} className="w-full py-2 border border-outline-variant font-semibold rounded-lg hover:bg-surface-container-low transition-colors">Upgrade to Business</button>
        )}
      </div>
    </div>
  </section>}
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
