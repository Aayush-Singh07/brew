import json
import urllib.request
import re
import os

with open(r'C:\Users\meera\.gemini\antigravity-ide\brain\ee22cecd-7b20-4f68-8e52-c16ae2126ad9\.system_generated\steps\120\output.txt', 'r', encoding='utf-8') as f:
    data = json.load(f)

os.makedirs('src/pages', exist_ok=True)

pages = []

for screen in data.get('screens', []):
    title = screen.get('title', '')
    html_url = screen.get('htmlCode', {}).get('downloadUrl', '')
    
    if not html_url:
        continue
        
    # Generate component name from title
    # e.g. "1. Brewlytics Landing Page" -> "LandingPage"
    name = re.sub(r'^\d+\.\s*(?:Brewlytics\s*)?', '', title)
    name = re.sub(r'[^a-zA-Z0-9]', '', name.title())
    
    print(f"Downloading {name}...")
    
    try:
        req = urllib.request.Request(html_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
    except Exception as e:
        print(f"Failed to download {name}: {e}")
        continue
        
    body_match = re.search(r'<body[^>]*>(.*)</body>', html, re.DOTALL)
    body_html = body_match.group(1) if body_match else ''
    
    # Conversion
    jsx = body_html.replace('class="', 'className="')
    jsx = jsx.replace('readonly=""', 'readOnly={true}')
    jsx = jsx.replace('onsubmit="event.preventDefault();"', 'onSubmit={(e) => e.preventDefault()}')
    jsx = re.sub(r'style="([^"]*)"', lambda m: 'style={{ ' + ', '.join([f'"{k.strip()}": "{v.strip()}"' for k, v in [p.split(':', 1) for p in m.group(1).split(';') if ':' in p]]) + ' }}', jsx)
    jsx = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', jsx, flags=re.DOTALL)
    
    # Some other fixes
    jsx = jsx.replace('checked=""', 'defaultChecked={true}')
    jsx = jsx.replace('disabled=""', 'disabled={true}')
    
    # Generate file
    content = f'''import React from "react";

export default function {name}() {{
  return (
    <div className="bg-background text-on-surface antialiased font-body-md text-body-md min-h-screen selection:bg-secondary-fixed selection:text-on-secondary-fixed-variant">
      {jsx}
    </div>
  );
}}
'''
    
    with open(f'src/pages/{name}.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
        
    pages.append(name)
    
print("Generated pages:", pages)

# Generate App.tsx router
app_router = f'''import React from "react";
import {{ BrowserRouter, Routes, Route, Link }} from "react-router-dom";
{''.join([f'import {p} from "./pages/{p}";\\n' for p in pages])}

export default function App() {{
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={{<LandingPage />}} />
{''.join([f'        <Route path="/{p.lower()}" element={{<{p} />}} />\\n' for p in pages if p != 'LandingPage'])}
      </Routes>
    </BrowserRouter>
  );
}}
'''

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app_router)
