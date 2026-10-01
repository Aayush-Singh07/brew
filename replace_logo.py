import os
import re

directory = 'src/pages'

for filename in os.listdir(directory):
    if filename.endswith(".tsx"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the URL
        content = re.sub(r'src="https://lh3\.googleusercontent\.com/aida-public/[^"]+"', 'src="/logo.png"', content)

        # We also need to increase the size specifically for the logo image.
        # Since we just replaced the src, let's find <img alt="Brewlytics Logo" className="..." src="/logo.png" />
        # and bump its h- size.
        
        def bump_size(match):
            cls = match.group(1)
            # Increase h-12 -> h-16, h-16 -> h-20, h-24 -> h-32, h-32 -> h-40
            cls = cls.replace('h-12', 'h-16')
            cls = cls.replace('h-16', 'h-24') # or h-20
            cls = cls.replace('h-24', 'h-32')
            cls = cls.replace('h-32', 'h-48')
            return f'<img alt="Brewlytics Logo" className="{cls}" src="/logo.png"'
        
        content = re.sub(r'<img alt="Brewlytics Logo" className="([^"]+)" src="/logo.png"', bump_size, content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Updated logo everywhere and increased size.")
