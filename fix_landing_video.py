import re

with open('src/pages/LandingPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will replace the <video> and the <div> overlay with more visible ones.
old_video_block = """{/* Background Video */}
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
<div className="absolute inset-0 bg-background/60 -z-10 pointer-events-none"></div>"""

new_video_block = """{/* Background Video */}
<video 
  autoPlay 
  loop 
  muted 
  playsInline 
  className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 pointer-events-none"
>
  <source src="/hero-bg.mp4" type="video/mp4" />
</video>

{/* Gradient Overlay for Text Readability */}
<div className="absolute inset-0 bg-background/40 z-0 pointer-events-none"></div>"""

content = content.replace(old_video_block, new_video_block)

# Let's also check if I missed any logo that wasn't resized down properly.
# The user said: "make logo smaller eveyhwere little"
# Currently they are h-12 and h-16 in my last script.
# Let's make them h-10 and h-12 to be safe.
content = content.replace('className="h-12 md:h-10 w-auto', 'className="h-10 md:h-8 w-auto')
content = content.replace('className="h-16 w-auto object-contain mb-4"', 'className="h-12 w-auto object-contain mb-4"')
content = content.replace('className="h-10 w-auto object-contain"', 'className="h-8 w-auto object-contain"')

with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Landing page fixed.")
