import os
import re

directory = 'src/pages'

for filename in os.listdir(directory):
    if filename.endswith(".tsx"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if filename == "LandingPage.tsx":
            # Fix video z-index context
            content = content.replace('<section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-outline-variant/40">', '<section className="relative z-0 pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-outline-variant/40">')
            
            # Navbar logo (first match)
            content = re.sub(r'<img alt="Brewlytics Logo" className="h-48 md:h-48 w-auto', '<img alt="Brewlytics Logo" className="h-12 md:h-10 w-auto', content)
            
            # Drawer logo (second match, around line 63)
            # Actually, just regex replace all remaining h-48 with h-10 for drawer, and h-16 for footer
            def replace_landing_logo(match):
                full = match.group(0)
                if 'transition-transform' in full:
                    return full.replace('h-48 md:h-48', 'h-12 md:h-10')
                elif 'mb-4' in full:
                    return full.replace('h-48', 'h-16')
                else:
                    return full.replace('h-48', 'h-10')
            content = re.sub(r'<img alt="Brewlytics Logo" className="[^"]+"', replace_landing_logo, content)
            
        else:
            # For all dashboard pages, set logo to h-12 (it used to be h-32 but the new logo has no padding)
            content = re.sub(r'<img alt="Brewlytics Logo" className="h-48 w-auto', '<img alt="Brewlytics Logo" className="h-12 w-auto', content)
            content = re.sub(r'<img alt="Brewlytics Logo" className="h-48 sm:h-40 w-auto', '<img alt="Brewlytics Logo" className="h-16 sm:h-12 w-auto', content)
            content = re.sub(r'<img alt="Brewlytics Logo" className="h-48 w-auto object-contain flex-shrink-0"', '<img alt="Brewlytics Logo" className="h-12 w-auto object-contain flex-shrink-0"', content)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Fixed logo sizes and stacking context.")
