import re

with open('src/pages/SignUpLogin.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make wrappers tighter
content = content.replace('p-6 sm:p-12', 'p-4 sm:p-6')
content = content.replace('mb-8 text-center', 'mb-4 text-center')

# Form container padding tighter
content = content.replace('p-6 sm:p-8', 'p-5 sm:p-6')

# Input sizing and margins
content = content.replace('h-11', 'h-10')
content = content.replace('mb-1.5', 'mb-1')
content = content.replace('space-y-4', 'space-y-3')
content = content.replace('h-12', 'h-10')

# Toggle margin
content = content.replace('mb-6', 'mb-4')
content = content.replace('py-2.5', 'py-1.5')

# Bottom texts margins
content = content.replace('mt-5', 'mt-3')
content = content.replace('mt-8 text-center', 'mt-4 text-center')

with open('src/pages/SignUpLogin.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Compacted SignUpLogin.")
