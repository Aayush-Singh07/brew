import os
import glob

pages_dir = "src/pages"
files = glob.glob(os.path.join(pages_dir, "*.tsx"))

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Change ml-60 to md:ml-60 for the main wrapper
    content = content.replace('className="ml-60 ', 'className="md:ml-60 ')

    # Adjust header padding to accommodate the mobile hamburger (top-left)
    content = content.replace('px-space-xl', 'pl-16 md:pl-space-xl pr-space-xl')
    content = content.replace('px-margin', 'pl-16 md:pl-margin pr-margin')

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Updated page layouts for mobile!")
