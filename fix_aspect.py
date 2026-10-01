import re

with open('src/pages/SignUpLogin.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Video Panel width
content = content.replace(
    '<div className="flex w-full lg:w-1/2 h-48 sm:h-64 lg:h-auto bg-[#E1DBF8] relative items-center justify-center overflow-hidden flex-shrink-0">',
    '<div className="flex w-full lg:w-[40%] xl:w-[35%] h-48 sm:h-64 lg:h-auto bg-[#E1DBF8] relative items-center justify-center overflow-hidden flex-shrink-0">'
)

# 2. Update Form Panel width
content = content.replace(
    '<div className="w-full lg:w-1/2 flex flex-col items-center justify-start lg:justify-center p-6 sm:p-8 lg:p-12 relative flex-1">',
    '<div className="w-full lg:w-[60%] xl:w-[65%] flex flex-col items-center justify-start lg:justify-center p-6 sm:p-8 lg:p-12 relative flex-1">'
)

# 3. Revert to object-cover so video fills without letterboxing
content = content.replace(
    'className="absolute inset-0 w-full h-full object-contain z-0"',
    'className="absolute inset-0 w-full h-full object-cover z-0"'
)

with open('src/pages/SignUpLogin.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated aspect ratios.")
