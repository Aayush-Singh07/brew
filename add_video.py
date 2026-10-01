import re

with open('src/pages/LandingPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

hero_replacement = """<section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-outline-variant/40">

{/* Background Video */}
<video 
  autoPlay 
  loop 
  muted 
  playsInline 
  className="absolute inset-0 w-full h-full object-cover -z-20 opacity-30 dark:opacity-20 pointer-events-none"
>
  <source src="/hero-bg.mp4" type="video/mp4" />
</video>

{/* Gradient Overlay for Text Readability */}
<div className="absolute inset-0 bg-background/60 -z-10 pointer-events-none"></div>

{/*  Subtle Ambient Violet Light Wash  */}
<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-gradient-to-b from-secondary-fixed/50 via-surface-container/30 to-transparent blur-3xl pointer-events-none -z-10"></div>

<div className="relative z-10 max-w-7xl mx-auto px-gutter flex flex-col items-center text-center">"""

# Use regex to match the varying whitespace between elements
pattern = re.compile(
    r'<section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-outline-variant/40">\s*\{\/\*\s*Subtle Ambient Violet Light Wash\s*\*\/\}\s*<div className="absolute top-0 left-1/2 -translate-x-1/2 w-\[700px\] h-\[340px\] bg-gradient-to-b from-secondary-fixed/30 via-surface-container/20 to-transparent blur-3xl pointer-events-none -z-10"></div>\s*<div className="max-w-7xl mx-auto px-gutter flex flex-col items-center text-center">',
    re.MULTILINE | re.DOTALL
)

if pattern.search(content):
    content = pattern.sub(hero_replacement, content)
    with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated hero section successfully.")
else:
    print("Could not find the target block.")
