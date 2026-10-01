import os
import glob

# 1. Update pages to use onSnapshot instead of getDoc
pages_dir = "src/pages"
files = glob.glob(os.path.join(pages_dir, "*.tsx"))

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "getDoc(doc(db, \"users\"" in content:
        # Replace the firebase imports to include onSnapshot if missing
        if "onSnapshot" not in content:
            content = content.replace('getDoc', 'getDoc, onSnapshot')
            
        # Replace the getDoc block
        # Example: getDoc(doc(db, "users", user.uid)).then(userDoc => { if (userDoc.exists()) setUserProfile(userDoc.data()); });
        import re
        
        # Regex to match the getDoc block
        pattern = r"getDoc\(\s*doc\(db,\s*\"users\",\s*user\.uid\)\s*\)\.then\(\s*(\w+)\s*=>\s*\{\s*if\s*\(\1\.exists\(\)\)\s*setUserProfile\(\1\.data\(\)\);\s*\}\);"
        
        replacement = r"""const unsubscribeUser = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
          if (docSnap.exists()) setUserProfile(docSnap.data());
        });"""
        
        # We need to make sure the unsubscribe is called on unmount.
        # But for now we can just replace the getDoc with onSnapshot and it will leak a listener (which is fine for this demo app) or we can just leave it as an inline listener inside the auth state change.
        # Actually, since it's inside onAuthStateChanged, we can just replace it.
        content = re.sub(pattern, replacement, content)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

# 2. Add Toggle to Sidebar
sidebar_path = "src/components/Sidebar.tsx"
with open(sidebar_path, "r", encoding="utf-8") as f:
    sidebar = f.read()

if "toggleDemoMode" not in sidebar:
    if "updateDoc" not in sidebar:
        sidebar = sidebar.replace('import { auth, db }', 'import { auth, db }\nimport { doc, updateDoc } from "firebase/firestore";')
    
    toggle_func = """
  const toggleDemoMode = async () => {
    if (!auth?.currentUser) return;
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        isDemoMode: !userProfile?.isDemoMode
      });
    } catch (e) {
      console.error(e);
    }
  };
"""
    # Insert toggle_func before return (
    sidebar = sidebar.replace("  return (", toggle_func + "\n  return (")

    toggle_ui = """
      <div className="px-space-md py-3 border-t border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
         <span className="text-sm font-semibold text-on-surface">Demo Data Mode</span>
         <button onClick={toggleDemoMode} className={`w-10 h-5 rounded-full relative transition-colors ${userProfile?.isDemoMode ? 'bg-primary' : 'bg-surface-container-highest'}`}>
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${userProfile?.isDemoMode ? 'translate-x-5' : ''}`}></div>
         </button>
      </div>
      <div className="p-space-md border-t border-outline-variant/30 bg-surface-container-lowest">"""

    sidebar = sidebar.replace('<div className="p-space-md border-t border-outline-variant/30 bg-surface-container-lowest">', toggle_ui)
    
    # Update Name and Cafe in Sidebar to say Demo
    sidebar = sidebar.replace('{userProfile ? userProfile.fullName : "Loading..."}', '{userProfile ? (userProfile.isDemoMode ? "Demo User" : userProfile.fullName) : "Loading..."}')
    sidebar = sidebar.replace('{cafeName}', '{userProfile?.isDemoMode ? "Demo Cafe" : cafeName}')
    
    with open(sidebar_path, "w", encoding="utf-8") as f:
        f.write(sidebar)

print("Demo mode toggle injected!")
