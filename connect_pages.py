import os
import re

def patch_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add Link import
    if 'import { Link }' not in content:
        content = content.replace('import React from "react";', 'import React from "react";\nimport { Link } from "react-router-dom";')
    
    # Change all <a href="..."> to <Link to="...">
    content = re.sub(r'<a([^>]*?)href="([^"]*)"([^>]*)>', r'<Link\1to="\2"\3>', content)
    content = content.replace('</a>', '</Link>')
    
    # Apply specific route patches
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

patch_file('src/pages/LandingPage.tsx', [
    ('to="#"', 'to="/signuplogin"'),
    ('to="#demo"', 'to="/signuplogin"'),
    ('to="#features"', 'to="/signuplogin"'),
    ('to="#pricing"', 'to="/signuplogin"'),
    ('to="#interactive-preview"', 'to="/signuplogin"'),
])

patch_file('src/pages/SignUpLogin.tsx', [
    ('to="#"', 'to="/onboardingflowwizard"')
])

patch_file('src/pages/OnboardingFlowWizard.tsx', [
    ('to="#"', 'to="/mainanalyticsdashboard"')
])

patch_file('src/pages/MainAnalyticsDashboard.tsx', [
    ('to="#"', 'to="/csvuploaddatapreview"')
])

patch_file('src/pages/CsvUploadDataPreview.tsx', [
    ('to="#"', 'to="/insightsrecommendationshub"')
])

patch_file('src/pages/InsightsRecommendationsHub.tsx', [
    ('to="#"', 'to="/aianalystcopilot"')
])

patch_file('src/pages/AiAnalystCopilot.tsx', [
    ('to="#"', 'to="/workspacesettingsposintegrations"')
])

patch_file('src/pages/WorkspaceSettingsPosIntegrations.tsx', [
    ('to="#"', 'to="/mainanalyticsdashboard"')
])

print('Logically connected all pages!')
