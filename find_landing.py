import json
import os

log_path = r"C:\Users\meera\.gemini\antigravity-ide\brain\ee22cecd-7b20-4f68-8e52-c16ae2126ad9\.system_generated\logs\transcript_full.jsonl"
out_path = r"LandingPage_original.tsx"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'content' in data and 'export default function LandingPage' in data['content']:
                content = data['content']
                # Try to extract the file content from view_file output or markdown blocks
                if 'File Path' in content or '```tsx' in content or 'Created file' in content:
                    print("Found candidate in step", data.get('step_index'))
                    with open(out_path, 'w', encoding='utf-8') as out:
                        out.write(content)
                    break
        except Exception as e:
            pass
