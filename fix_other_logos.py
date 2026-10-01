import os

directory = 'src/pages'

for filename in os.listdir(directory):
    if filename.endswith(".tsx") and filename != "LandingPage.tsx":
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Currently they are h-12 and h-16
        # Let's reduce them to h-10 and h-12
        content = content.replace('className="h-12 w-auto', 'className="h-10 w-auto')
        content = content.replace('className="h-16 sm:h-12 w-auto', 'className="h-14 sm:h-10 w-auto')
        content = content.replace('className="h-12 w-auto object-contain flex-shrink-0"', 'className="h-10 w-auto object-contain flex-shrink-0"')

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Other pages logo fixed.")
