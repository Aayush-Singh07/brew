import os
import glob
import re

for filepath in glob.glob('src/pages/*.tsx'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pricing replacements
    content = content.replace('$49', '₹999')
    content = content.replace('$129', '₹2,499')
    content = content.replace('$0', '₹0')
    
    # Generic dollar replacements that are purely text (not template literals)
    # We can look for \$ followed by digits
    content = re.sub(r'\$(\d+)', r'₹\1', content)
    
    # Brand voice replacements
    content = re.sub(r'(?i)specialty coffee roaster', 'café', content)
    content = re.sub(r'(?i)artisan roastery', 'café', content)
    content = re.sub(r'(?i)coffee sommelier', 'café owner', content)
    content = re.sub(r'(?i)independent specialty roasters & coffee shops', 'independent cafés', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Global text fixes applied.")
