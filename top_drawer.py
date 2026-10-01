import re

with open('src/pages/LandingPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the drawer container classes
old_drawer = 'className="fixed inset-y-0 right-0 w-1/2 z-[100] bg-surface-container-lowest flex flex-col md:hidden border-l border-outline-variant shadow-2xl animate-in slide-in-from-right duration-200"'
new_drawer = 'className="fixed inset-x-0 top-0 w-full h-auto max-h-[65vh] overflow-y-auto rounded-b-3xl z-[100] bg-surface-container-lowest flex flex-col md:hidden border-b border-outline-variant shadow-2xl animate-in slide-in-from-top duration-200"'

if old_drawer in content:
    content = content.replace(old_drawer, new_drawer)
    
    with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Drawer updated to top-down.")
else:
    print("Could not find the exact drawer string.")
