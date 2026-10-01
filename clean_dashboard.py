import re

with open('src/pages/MainAnalyticsDashboard.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find where the actual code starts (either import or export default)
start_idx = 0
for i, line in enumerate(lines):
    if 'import { Link' in line or 'export default function MainAnalyticsDashboard' in line:
        start_idx = i
        break

cleaned_lines = []
for line in lines[start_idx:]:
    # In case there are STILL line numbers (e.g. 8: 1: import)
    # Let's replace any leading line numbers
    match = re.match(r'^(?:\d+:\s+)*(.*)', line)
    if match:
        # if the remaining is just an empty line or something, append
        # wait, the regex `^(?:\d+:\s+)*` matches the start of the string, optionally followed by digits and colon.
        # if there are no digits, it matches 0 times and group(1) gets the whole line.
        cleaned = match.group(1)
        if cleaned.endswith('\n'):
            cleaned_lines.append(cleaned)
        else:
            cleaned_lines.append(cleaned + '\n')
    else:
        cleaned_lines.append(line)

content = "".join(cleaned_lines)

# Write it back
with open('src/pages/MainAnalyticsDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Cleaned up MainAnalyticsDashboard.tsx")
