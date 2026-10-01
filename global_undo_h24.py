import glob
import re

files = glob.glob('src/pages/*.tsx')

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix w-8 h-24 -> w-8 h-8
    content = content.replace('w-8 h-24', 'w-8 h-8')
    # Fix w-10 h-24 -> w-10 h-10
    content = content.replace('w-10 h-24', 'w-10 h-10')
    # Also fix h-24 for the main landing page logo back to h-32 if it was broken
    # But LandingPage was already restored properly from the original, so no worries.
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Globally fixed h-24 glitches.")
