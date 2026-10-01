import re

with open('src/pages/SignUpLogin.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update main container to flex-col on mobile
content = content.replace(
    '<div className="flex min-h-screen',
    '<div className="flex flex-col lg:flex-row min-h-screen'
)

# 2. Update Left Video Panel to show on mobile with fixed height
content = content.replace(
    '<div className="hidden lg:flex lg:w-1/2 bg-[#E1DBF8] relative items-center justify-center overflow-hidden">',
    '<div className="flex w-full lg:w-1/2 h-48 sm:h-64 lg:h-auto bg-[#E1DBF8] relative items-center justify-center overflow-hidden flex-shrink-0">'
)

# 3. Update Right Form Panel to justify-start on mobile (so logo is high up) and more padding for boxy look
content = content.replace(
    '<div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 relative">',
    '<div className="w-full lg:w-1/2 flex flex-col items-center justify-start lg:justify-center p-6 sm:p-8 lg:p-12 relative flex-1">'
)

# 4. Make the form max-width smaller for a "boxy" look
content = content.replace(
    '<div className="w-full max-w-[440px] flex flex-col">',
    '<div className="w-full max-w-[380px] flex flex-col">'
)

# 5. Move logo spacing up slightly
content = content.replace(
    '<div className="mb-4 text-center flex justify-center">',
    '<div className="mb-6 mt-4 lg:mt-0 text-center flex justify-center">'
)

# 6. Ensure the Back to Home button works on both
content = content.replace(
    'className="absolute top-6 left-6 z-[100]',
    'className="absolute top-4 left-4 lg:top-6 lg:left-6 z-[100]'
)

with open('src/pages/SignUpLogin.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied mobile responsiveness tweaks.")
