import re

with open('LandingPage_original.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Strip lines until we see '1: import { Link' or similar
start_idx = 0
for i, line in enumerate(lines):
    if line.startswith('8: 1: import') or line.startswith('1: import'):
        start_idx = i
        break

cleaned_lines = []
for line in lines[start_idx:]:
    # Match something like '8: 1: import ' or '1: import '
    match = re.match(r'^(?:\d+:\s+)*\d+:\s(.*)', line)
    if match:
        cleaned_lines.append(match.group(1) + '\n')
    else:
        cleaned_lines.append(line)

content = "".join(cleaned_lines)

# Fix links
content = content.replace('/csvuploaddatapreview', '/upload')
content = content.replace('/insightsrecommendationshub', '/insights')
content = content.replace('/onboardingflowwizard', '/onboarding')
content = content.replace('/aianalystcopilot', '/ai')
content = content.replace('/signuplogin', '/login')
content = content.replace('/mainanalyticsdashboard', '/dashboard')
content = content.replace('/workspacesettingsposintegrations', '/settings')

# Make logo bigger
content = re.sub(r'className="([^"]*)h-20([^"]*)"', r'className="\1h-32\2"', content)
content = re.sub(r'className="([^"]*)h-10([^"]*)"', r'className="\1h-24\2"', content)
content = re.sub(r'className="([^"]*)h-8([^"]*)"', r'className="\1h-24\2"', content)

# Remove unused useNavigate if it's there
content = re.sub(r'const navigate = useNavigate\(\);\n', '', content)
content = content.replace('import { Link, useNavigate } from "react-router-dom";', 'import { Link } from "react-router-dom";')

with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Restored original Landing Page with fixed links and logo.")
