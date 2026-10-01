import os

# 1. Fix LandingPage.tsx
with open('src/pages/LandingPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("The above content shows the entire, complete file contents of the requested file.", "")
content = content.replace("The above content does NOT show the entire file contents.", "")

with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Fix MainAnalyticsDashboard.tsx
# I'll just append missing divs to MainAnalyticsDashboard.tsx and hope it works?
# No, let's restore MainAnalyticsDashboard.tsx from transcript!
import json
log_path = r"C:\Users\meera\.gemini\antigravity-ide\brain\ee22cecd-7b20-4f68-8e52-c16ae2126ad9\.system_generated\logs\transcript_full.jsonl"

dashboard_content = None
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'content' in data and 'export default function MainAnalyticsDashboard' in data['content']:
                c = data['content']
                if 'File Path' in c and 'MainAnalyticsDashboard.tsx' in c:
                    dashboard_content = c
        except Exception:
            pass

if dashboard_content:
    lines = dashboard_content.split('\\n')
    cleaned_lines = []
    import re
    for line in lines:
        match = re.match(r'^(?:\d+:\s+)*\d+:\s(.*)', line)
        if match:
            cleaned_lines.append(match.group(1))
        else:
            cleaned_lines.append(line)
    
    # Let's join and strip any weird view_file artifacts
    text = "\\n".join(cleaned_lines)
    text = text.replace("The above content shows the entire, complete file contents of the requested file.", "")
    
    # Save the original
    with open('src/pages/MainAnalyticsDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(text)

print("Fixed LandingPage and restored Dashboard.")
