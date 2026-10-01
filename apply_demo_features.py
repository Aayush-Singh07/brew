import os
import re

# 1. Create DemoToggle.tsx
demo_toggle_content = """import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function DemoToggle({ isDemoMode }: { isDemoMode: boolean }) {
  const toggleDemoMode = async () => {
    if (!auth?.currentUser) return;
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        isDemoMode: !isDemoMode
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button
      onClick={toggleDemoMode}
      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
        isDemoMode 
          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300' 
          : 'bg-primary-container text-on-primary hover:bg-primary-fixed border border-primary/20'
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">
        {isDemoMode ? 'public' : 'science'}
      </span>
      {isDemoMode ? "Switch to Live" : "Switch to Demo"}
    </button>
  );
}
"""
with open("src/components/DemoToggle.tsx", "w", encoding="utf-8") as f:
    f.write(demo_toggle_content)

# 2. Update Sidebar.tsx (remove previous toggle)
with open("src/components/Sidebar.tsx", "r", encoding="utf-8") as f:
    sidebar = f.read()

toggle_regex = re.compile(r'<div className="px-space-md py-3 border-t border-outline-variant/30 flex items-center justify-between bg-surface-container-low">.*?</div>\s*<div className="p-space-md border-t border-outline-variant/30 bg-surface-container-lowest">', re.DOTALL)
sidebar = toggle_regex.sub('<div className="p-space-md border-t border-outline-variant/30 bg-surface-container-lowest">', sidebar)

with open("src/components/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(sidebar)

# 3. Update MainAnalyticsDashboard.tsx
with open("src/pages/MainAnalyticsDashboard.tsx", "r", encoding="utf-8") as f:
    dashboard = f.read()

if "DemoToggle" not in dashboard:
    dashboard = dashboard.replace('import Sidebar from "../components/Sidebar";', 'import Sidebar from "../components/Sidebar";\nimport DemoToggle from "../components/DemoToggle";')
    
    # Inject DemoToggle in header
    dashboard = dashboard.replace('<h1 className="font-headline-md text-headline-md text-on-surface">Overview</h1>', '<h1 className="font-headline-md text-headline-md text-on-surface">Overview</h1>\n            <DemoToggle isDemoMode={!!userProfile?.isDemoMode} />')
    
    # Setup dummy metrics
    metrics_setup = """
  const demoMetrics = {
    totalRevenue: 24500.50,
    averageOrderValue: 8.45,
    totalOrders: 2899,
    topProducts: [
      { name: "Oat Milk Latte", units: 450, revenue: 2700 },
      { name: "Avocado Toast", units: 320, revenue: 2400 },
      { name: "Drip Coffee", units: 890, revenue: 2225 },
      { name: "Cold Brew", units: 410, revenue: 2050 },
      { name: "Matcha Latte", units: 280, revenue: 1680 }
    ]
  };
  const displayMetrics = userProfile?.isDemoMode ? demoMetrics : metrics;
"""
    dashboard = dashboard.replace('return (', metrics_setup + '\n  return (')
    
    # Replace metrics? with displayMetrics?
    dashboard = dashboard.replace('metrics ? metrics', 'displayMetrics ? displayMetrics')
    dashboard = dashboard.replace('metrics && metrics', 'displayMetrics && displayMetrics')
    
    with open("src/pages/MainAnalyticsDashboard.tsx", "w", encoding="utf-8") as f:
        f.write(dashboard)

# 4. Update InsightsRecommendationsHub.tsx
with open("src/pages/InsightsRecommendationsHub.tsx", "r", encoding="utf-8") as f:
    insights = f.read()

if "DemoToggle" not in insights:
    insights = insights.replace('import Sidebar from "../components/Sidebar";', 'import Sidebar from "../components/Sidebar";\nimport DemoToggle from "../components/DemoToggle";')
    insights = insights.replace('const isFreePlan = userProfile?.plan === "free";', 'const isFreePlan = userProfile?.isDemoMode ? false : userProfile?.plan === "free";')
    
    # Inject into header
    # Header trailing action cluster
    insights = insights.replace('<div className="flex items-center gap-space-sm">', '<div className="flex items-center gap-space-sm">\n<DemoToggle isDemoMode={!!userProfile?.isDemoMode} />')
    
    with open("src/pages/InsightsRecommendationsHub.tsx", "w", encoding="utf-8") as f:
        f.write(insights)

# 5. Update AiAnalystCopilot.tsx
with open("src/pages/AiAnalystCopilot.tsx", "r", encoding="utf-8") as f:
    copilot = f.read()

if "DemoToggle" not in copilot:
    copilot = copilot.replace('import Sidebar from "../components/Sidebar";', 'import Sidebar from "../components/Sidebar";\nimport DemoToggle from "../components/DemoToggle";')
    
    copilot = copilot.replace('<div className="flex items-center gap-4">', '<DemoToggle isDemoMode={!!userProfile?.isDemoMode} />\n            <div className="flex items-center gap-4">')
    
    with open("src/pages/AiAnalystCopilot.tsx", "w", encoding="utf-8") as f:
        f.write(copilot)

# 6. Update CsvUploadDataPreview.tsx
with open("src/pages/CsvUploadDataPreview.tsx", "r", encoding="utf-8") as f:
    upload = f.read()

if "DemoToggle" not in upload:
    upload = upload.replace('import Sidebar from "../components/Sidebar";', 'import Sidebar from "../components/Sidebar";\nimport DemoToggle from "../components/DemoToggle";')
    
    upload = upload.replace('<div className="flex items-center gap-4">', '<DemoToggle isDemoMode={!!userProfile?.isDemoMode} />\n<div className="flex items-center gap-4">')
    
    with open("src/pages/CsvUploadDataPreview.tsx", "w", encoding="utf-8") as f:
        f.write(upload)

# 7. Update WorkspaceSettingsPosIntegrations.tsx
with open("src/pages/WorkspaceSettingsPosIntegrations.tsx", "r", encoding="utf-8") as f:
    settings = f.read()

if "DemoToggle" not in settings:
    settings = settings.replace('import Sidebar from "../components/Sidebar";', 'import Sidebar from "../components/Sidebar";\nimport DemoToggle from "../components/DemoToggle";')
    
    settings = settings.replace('</header>', '  <DemoToggle isDemoMode={!!userProfile?.isDemoMode} />\n</header>')
    
    # Hide billing/upgrade if demo mode
    # Assuming there's a section with id="billing-section"
    # Actually just wrapping the billing section if it exists
    # Let's search for '<section id="billing-section"'
    settings = settings.replace('<section id="billing-section"', '{userProfile?.isDemoMode ? null : <section id="billing-section"')
    settings = settings.replace('          </section>\n          {/*  3. Security & Data Management  */}', '          </section>}\n          {/*  3. Security & Data Management  */}')
    
    with open("src/pages/WorkspaceSettingsPosIntegrations.tsx", "w", encoding="utf-8") as f:
        f.write(settings)

print("Updates applied successfully.")
