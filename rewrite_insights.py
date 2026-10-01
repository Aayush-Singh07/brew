import re

with open('src/pages/InsightsRecommendationsHub.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add imports
if 'import { useEffect, useState } from "react";' not in content:
    content = content.replace('import { Link, useNavigate } from "react-router-dom";', 'import { Link, useNavigate } from "react-router-dom";\nimport { useEffect, useState } from "react";\nimport { auth, db } from "../firebase";\nimport { doc, getDoc } from "firebase/firestore";\nimport { onAuthStateChanged } from "firebase/auth";')

# 2. Add state and effect
hook_code = """  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        getDoc(doc(db, "users", user.uid)).then(userDoc => {
          if (userDoc.exists()) setUserProfile(userDoc.data());
        });
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  const isFreePlan = userProfile?.plan === "free";
"""
content = re.sub(r'const navigate = useNavigate\(\);', hook_code, content)

# 3. Add Feature Gate UI right inside the relative container
# The main content wrapper starts at: <div className="ml-60 flex-1 flex flex-col min-w-0">
# Wait, let's make it `<div className="ml-60 flex-1 flex flex-col min-w-0 relative">`

content = content.replace('<div className="ml-60 flex-1 flex flex-col min-w-0">', '<div className="ml-60 flex-1 flex flex-col min-w-0 relative">')

feature_gate = """
          {/* FEATURE GATE OVERLAY */}
          {isFreePlan && (
            <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-xl border border-outline-variant max-w-md text-center">
                <span className="material-symbols-outlined text-5xl text-primary mb-4">lock</span>
                <h2 className="text-2xl font-bold mb-2">Pro Feature</h2>
                <p className="text-on-surface-variant mb-6">Upgrade to Pro or Business to access the AI Insights Hub and get deep insights into your café's data.</p>
                <button onClick={() => navigate("/settings")} className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-container transition-colors">
                  Upgrade Plan
                </button>
              </div>
            </div>
          )}
"""
content = content.replace('<header className="sticky top-0', feature_gate + '\n<header className="sticky top-0')

# Update profile pill in sidebar
content = re.sub(
    r'<div className="w-8 h-8 rounded-full bg-primary-fixed text-primary font-bold text-label-md flex items-center justify-center border border-outline-variant/50">\s*JM\s*</div>',
    '<div className="w-8 h-8 rounded-full bg-primary-fixed text-primary font-bold text-label-md flex items-center justify-center border border-outline-variant/50">{userProfile ? userProfile.fullName.substring(0, 2).toUpperCase() : "..."}</div>',
    content
)

content = re.sub(
    r'<p className="font-title-md text-body-sm text-on-surface truncate leading-tight">Jordan Miller</p>',
    '<p className="font-title-md text-body-sm text-on-surface truncate leading-tight">{userProfile ? userProfile.fullName : "Loading..."}</p>',
    content
)

content = re.sub(
    r'<p className="font-body-sm text-\[11px\] text-on-surface-variant truncate">Head of Ops</p>',
    '<p className="font-body-sm text-[11px] text-on-surface-variant truncate">{userProfile ? userProfile.plan.toUpperCase() + " PLAN" : ""}</p>',
    content
)

with open('src/pages/InsightsRecommendationsHub.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Rewrote Insights Hub with Feature Gate!")
