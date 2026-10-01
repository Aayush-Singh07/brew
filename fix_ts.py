import os
import glob

# Fix unused 'unsubscribeUser' in pages
pages_dir = "src/pages"
files = glob.glob(os.path.join(pages_dir, "*.tsx"))

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Change 'const unsubscribeUser = onSnapshot' to 'onSnapshot'
    content = content.replace('const unsubscribeUser = onSnapshot', 'onSnapshot')
    content = content.replace('import { doc, getDoc, onSnapshot }', 'import { doc, onSnapshot }')
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

# Fix Sidebar unused 'toggleDemoMode'
sidebar_path = "src/components/Sidebar.tsx"
with open(sidebar_path, "r", encoding="utf-8") as f:
    sidebar = f.read()

# I will just write a new version of the Sidebar to be absolutely sure it's correct
# Wait, I don't want to replace the whole Sidebar, I'll just check what's inside.
