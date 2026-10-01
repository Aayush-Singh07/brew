import os
import re

# 1. Create Sidebar component
os.makedirs('src/components', exist_ok=True)
sidebar_code = """import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Sidebar({ userProfile }: { userProfile: any }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [cafeName, setCafeName] = useState<string>("Loading...");

  useEffect(() => {
    if (userProfile?.cafeId) {
      getDoc(doc(db, "cafes", userProfile.cafeId)).then(snap => {
        if (snap.exists()) {
          setCafeName(snap.data().name);
        } else {
          setCafeName("My Café");
        }
      });
    }
  }, [userProfile]);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { name: "AI Analyst", path: "/ai", icon: "psychology", badge: "NEW" },
    { name: "Insights", path: "/insights", icon: "insights", count: "3" },
    { name: "Settings", path: "/settings", icon: "settings" },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-surface-container-lowest border-r border-outline-variant/40 flex flex-col justify-between z-40 select-none">
      <div>
        <div className="px-space-md pt-5 pb-4 border-b border-outline-variant/30 flex flex-col gap-2">
          <Link to="/dashboard" className="flex items-center gap-2 transition-transform hover:scale-102 duration-150">
            <img alt="Brewlytics Logo" className="h-10 w-auto object-contain" src="/logo.png"/>
          </Link>
        </div>
        <nav className="p-space-md space-y-1">
          {navLinks.map(link => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-space-sm px-space-md py-2.5 rounded-lg font-body-md text-body-md group transition-all duration-150 ${
                  isActive
                    ? "bg-surface-container-low text-primary font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                }`}
              >
                <span className={`material-symbols-outlined text-xl ${isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>
                  {link.icon}
                </span>
                <span className="flex-1">{link.name}</span>
                {link.badge && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary-fixed text-primary tracking-wide">
                    {link.badge}
                  </span>
                )}
                {link.count && !link.badge && (
                  <span className="w-5 h-5 rounded-full bg-secondary-fixed text-primary font-bold text-[11px] flex items-center justify-center">
                    {link.count}
                  </span>
                )}
                {isActive && !link.badge && !link.count && (
                  <span className="w-1.5 h-4 bg-primary-container rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-space-md border-t border-outline-variant/30 space-y-3 bg-surface-container-lowest">
        <button onClick={() => navigate("/upload")} className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-title-md text-label-md border border-primary/20 hover:border-primary/40 transition-all duration-150 group active:scale-[0.99]">
          <span className="material-symbols-outlined text-lg group-hover:translate-y-[-1px] transition-transform">upload_file</span>
          <span>Upload CSV</span>
        </button>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 w-full overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary font-bold text-sm flex items-center justify-center ring-1 ring-primary/20 flex-shrink-0">
              {userProfile ? userProfile.fullName.substring(0, 2).toUpperCase() : "..."}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="font-title-md text-label-md text-on-surface font-semibold leading-tight truncate">
                {userProfile ? userProfile.fullName : "Loading..."}
              </p>
              <p className="text-[11px] text-on-surface-variant leading-tight truncate">
                {cafeName} • {userProfile ? userProfile.plan.toUpperCase() : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
"""

with open('src/components/Sidebar.tsx', 'w', encoding='utf-8') as f:
    f.write(sidebar_code)


# 2. Replace sidebars in pages
def replace_sidebar(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find where <aside starts and ends. 
    # It starts with <aside and ends with </aside>
    import re
    # We use re.DOTALL to match across newlines
    new_content = re.sub(r'<aside.*?</aside>', '<Sidebar userProfile={userProfile} />', content, flags=re.DOTALL)
    
    if new_content != content:
        # Add import if not present
        if 'import Sidebar' not in new_content:
            new_content = new_content.replace('export default function', 'import Sidebar from "../components/Sidebar";\n\nexport default function')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")

pages_to_update = [
    'src/pages/MainAnalyticsDashboard.tsx',
    'src/pages/WorkspaceSettingsPosIntegrations.tsx',
    'src/pages/InsightsRecommendationsHub.tsx',
    'src/pages/CsvUploadDataPreview.tsx',
    'src/pages/AiAnalystCopilot.tsx'
]

for p in pages_to_update:
    replace_sidebar(p)

# 3. Remove "POS synced" texts
def remove_text(file_path, text_to_remove, regex=False):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    if regex:
        content = re.sub(text_to_remove, '', content)
    else:
        content = content.replace(text_to_remove, '')
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

# LandingPage.tsx Line 364: Toast POS Synced (there's an element around it, let's remove the whole chip or just the text)
# Let's search for "Toast POS Synced" in LandingPage
with open('src/pages/LandingPage.tsx', 'r', encoding='utf-8') as f:
    lp_content = f.read()
lp_content = re.sub(r'<span[^>]*>Toast POS Synced</span>', '', lp_content)
with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(lp_content)

# InsightsRecommendationsHub.tsx Line 93: Square POS Synced
with open('src/pages/InsightsRecommendationsHub.tsx', 'r', encoding='utf-8') as f:
    ins_content = f.read()
ins_content = re.sub(r'<span[^>]*>Square POS Synced</span>', '', ins_content)
with open('src/pages/InsightsRecommendationsHub.tsx', 'w', encoding='utf-8') as f:
    f.write(ins_content)

# WorkspaceSettingsPosIntegrations.tsx Line 113: Square POS Synced
with open('src/pages/WorkspaceSettingsPosIntegrations.tsx', 'r', encoding='utf-8') as f:
    pos_content = f.read()
pos_content = re.sub(r'<span[^>]*>Square POS Synced</span>', '', pos_content)
with open('src/pages/WorkspaceSettingsPosIntegrations.tsx', 'w', encoding='utf-8') as f:
    f.write(pos_content)

print("Sidebar unified and POS texts removed.")
