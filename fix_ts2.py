import os
import glob
import re

pages_dir = "src/pages"
files = glob.glob(os.path.join(pages_dir, "*.tsx"))

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # In WorkspaceSettingsPosIntegrations.tsx, `onSnapshot` might be on line 19 without `const unsubscribeUser = `
    content = content.replace("        onSnapshot(doc(db, \"users\", user.uid), (docSnap) => {", "        const unsubscribeUser = onSnapshot(doc(db, \"users\", user.uid), (docSnap) => {")
    
    # Same for other files if they were replaced
    
    # Remove unused getDoc
    content = content.replace("getDoc, onSnapshot", "onSnapshot")
    content = content.replace("import { doc, setDoc, getDoc, onSnapshot, serverTimestamp }", "import { doc, setDoc, onSnapshot, serverTimestamp }")
    content = content.replace("import { doc, setDoc, getDoc, serverTimestamp, onSnapshot }", "import { doc, setDoc, serverTimestamp, onSnapshot }")
    content = content.replace("import { doc, getDoc, onSnapshot }", "import { doc, onSnapshot }")
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
