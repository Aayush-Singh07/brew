import os
import glob
import re

for filepath in glob.glob('src/pages/*.tsx'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'window.location.href=' in content:
        # Add import
        if 'useNavigate' not in content:
            content = content.replace('import { Link } from "react-router-dom";', 'import { Link, useNavigate } from "react-router-dom";')
            if 'import { Link' not in content:
                 content = 'import { useNavigate } from "react-router-dom";\n' + content
        
        # Inject hook
        content = re.sub(r'(export default function [a-zA-Z0-9_]+\(\) {\s*)(return \()', r'\1const navigate = useNavigate();\n  \2', content)
        
        # Replace window.location.href
        content = re.sub(r'window\.location\.href="([^"]+)"', r'navigate("\1")', content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print('Upgraded navigation to SPA.')
