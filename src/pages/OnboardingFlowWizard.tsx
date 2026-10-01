import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function OnboardingFlowWizard() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<"demo" | "upload">("demo");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProceed = async () => {
    setIsSubmitting(true);
    try {
      if (auth.currentUser) {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          isDemoMode: selectedOption === "demo",
        });
      }
      if (selectedOption === "demo") {
        navigate("/dashboard");
      } else {
        navigate("/upload");
      }
    } catch (err) {
      console.error("Error setting onboarding mode:", err);
      // Fallback navigation
      if (selectedOption === "demo") {
        navigate("/dashboard");
      } else {
        navigate("/upload");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface antialiased font-body-md text-body-md min-h-screen selection:bg-secondary-fixed selection:text-on-secondary-fixed-variant">
      
{/*  Main Wizard Canvas  */}
<main className="flex-1 flex flex-col items-center justify-center p-space-md sm:p-space-lg lg:p-space-xl">
<div className="w-full max-w-4xl flex flex-col gap-space-lg">
{/*  Stepper Breadcrumb Component  */}
<div className="w-full bg-surface-container-lowest rounded-2xl px-4 py-6 border border-outline-variant/50 shadow-sm flex items-center justify-between">
  
  {/* Step 1: Account Creation */}
  <div className="flex flex-col items-center gap-3 w-24 shrink-0">
    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold shadow-sm">
      <span className="material-symbols-outlined text-[20px]">check</span>
    </div>
    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 text-center leading-tight">Account<br/>Creation</span>
  </div>

  {/* Subtle Line 1 -> 2 (Completed progress) */}
  <div className="flex-1 h-[2px] bg-emerald-500/40 rounded-full mx-1 sm:mx-3 relative overflow-hidden">
    <div className="absolute inset-y-0 left-0 bg-emerald-500 w-full"></div>
  </div>

  {/* Step 2: Onboarding (Active) */}
  <div className="flex flex-col items-center gap-3 w-24 shrink-0">
    <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg shadow-md ring-4 ring-primary/20">
      2
    </div>
    <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary text-center">Onboarding</span>
  </div>

  {/* Subtle Line 2 -> 3 (Pending progress) */}
  <div className="flex-1 h-[2px] bg-surface-variant rounded-full mx-1 sm:mx-3 relative overflow-hidden">
    <div className="absolute inset-y-0 left-0 bg-primary w-1/3 opacity-50 rounded-r-full"></div>
  </div>

  {/* Step 3: View Insights */}
  <div className="flex flex-col items-center gap-3 w-24 shrink-0 opacity-50">
    <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-bold border border-outline-variant">
      3
    </div>
    <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant text-center leading-tight">View<br/>Insights</span>
  </div>

</div>
{/*  Main Interactive Content Card  */}
<section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-space-lg sm:p-space-xl flex flex-col gap-space-xl">
{/*  Header Copy  */}
<div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
<h1 className="text-headline-md font-headline-md sm:text-headline-lg sm:font-headline-lg text-on-surface">
            How would you like to kick off your analytics?
          </h1>
<p className="text-body-md font-body-md text-on-surface-variant">
            Brewlytics works instantly with raw register exports. Pick an option below to populate your live dashboard and unveil margin intelligence.
          </p>
</div>
{/*  Two Interactive Option Cards  */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg items-stretch">
{/*  Card A: Instant Demo Dataset  */}
<div 
  onClick={() => setSelectedOption("demo")}
  className={`relative group rounded-xl border-2 p-space-lg flex flex-col justify-between transition-all duration-200 cursor-pointer bg-surface-container-lowest ${
    selectedOption === "demo"
      ? "border-primary ring-2 ring-primary/20 shadow-md bg-primary/[0.02]"
      : "border-outline-variant hover:border-primary-container hover:shadow-sm"
  }`} 
  id="demo-card"
>
<div className="flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm bg-primary-fixed text-primary font-semibold">
<span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  Instant Access • No File Needed
                </span>
<input 
  checked={selectedOption === "demo"} 
  onChange={() => setSelectedOption("demo")}
  className="w-5 h-5 text-primary focus:ring-primary border-outline cursor-pointer" 
  id="radio-demo" 
  name="ingest-option" 
  type="radio"
/>
</div>
<div className="flex flex-col gap-1">
<h2 className="text-title-md font-title-md text-on-surface flex items-center gap-2">
                  Sample Café Dataset
                  <span className="px-2 py-0.5 text-label-sm font-label-sm bg-emerald-50 text-emerald-700 rounded border border-emerald-200 font-medium">Recommended</span>
</h2>
<p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                  Explore pre-seeded June–Sep 2026 sales, costs, margin intelligence, and AI analysis immediately.
                </p>
</div>
</div>
<div className="mt-4 flex justify-center">
  <img src="/sample_chart.png" alt="Sample Chart" className="w-32 h-32 object-contain opacity-90 drop-shadow-sm" />
</div>
<div className="mt-space-md pt-space-md border-t border-outline-variant flex items-center justify-between">
<span className="text-label-sm font-label-sm text-on-surface-variant font-medium">Time to dashboard: <strong className="text-primary font-bold">Instant (~5 sec)</strong></span>
</div>
</div>
{/*  Card B: Upload Live POS CSV  */}
<div 
  onClick={() => setSelectedOption("upload")}
  className={`relative group rounded-xl border-2 p-space-lg flex flex-col justify-between transition-all duration-200 cursor-pointer bg-surface-container-lowest ${
    selectedOption === "upload"
      ? "border-primary ring-2 ring-primary/20 shadow-md bg-primary/[0.02]"
      : "border-outline-variant hover:border-primary-container hover:shadow-sm"
  }`} 
  id="upload-card"
>
<div className="flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm bg-surface-container text-on-surface-variant font-semibold">
<span className="material-symbols-outlined text-[14px]">storefront</span>
                  Your Live Café Numbers
                </span>
<input 
  checked={selectedOption === "upload"} 
  onChange={() => setSelectedOption("upload")}
  className="w-5 h-5 text-primary focus:ring-primary border-outline cursor-pointer" 
  id="radio-upload" 
  name="ingest-option" 
  type="radio"
/>
</div>
<div className="flex flex-col gap-1">
<h2 className="text-title-md font-title-md text-on-surface">
                  Set Up My Own Café (Live Mode)
                </h2>
<p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                  Start fresh with your own café's Square, Toast, or POS sales and expense CSV exports.
                </p>
</div>
{/*  Dropzone Box  */}
<div className="custom-dashed-border rounded-lg p-space-md flex flex-col items-center justify-center text-center gap-2 group-hover:border-primary">
<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[24px]">cloud_upload</span>
</div>
<div className="flex flex-col">
<span className="text-body-sm font-body-sm font-semibold text-on-surface">
                    Upload your register CSV or Excel files
                  </span>
<span className="text-label-sm font-label-sm text-outline">Square, Toast &amp; Clover compatible</span>
</div>
</div>
</div>
<div className="mt-space-lg pt-space-md border-t border-outline-variant flex items-center justify-start">
<span className="text-label-sm font-label-sm text-on-surface-variant font-medium">Takes you directly to: <strong className="text-primary font-bold">Upload Data Studio</strong></span>
</div>
</div>
</div>
{/*  Wizard Navigation Footer  */}
<div className="pt-space-md border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-3">
  <span className="text-xs text-on-surface-variant">
    {selectedOption === "demo" ? "Will launch Dashboard with sample data active." : "Will open Upload Data in Live mode."}
  </span>
  <button 
    onClick={handleProceed} 
    disabled={isSubmitting}
    className="w-full sm:w-auto px-space-xl py-3 rounded-xl bg-primary text-on-primary hover:bg-secondary font-bold text-body-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50" 
    type="button"
  >
    <span>{selectedOption === "demo" ? "Launch Demo Dashboard" : "Proceed to Upload Data"}</span>
    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
  </button>
</div>
</section>

</div>
</main>


    </div>
  );
}
