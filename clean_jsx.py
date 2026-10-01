import os
import glob
import re

pages_dir = 'src/pages'
files = glob.glob(os.path.join(pages_dir, '*.tsx'))
files.append('src/App.tsx')

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove script tags
    content = re.sub(r'<script.*?</script>', '', content, flags=re.DOTALL)
    
    # Fix htmlFor
    content = content.replace('for="', 'htmlFor="')
    
    # Fix viewBox
    content = content.replace('viewbox="', 'viewBox="')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print('Cleaned up React JSX issues (scripts, htmlFor, viewBox) in all files.')
