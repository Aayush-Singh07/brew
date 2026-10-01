import os
import glob
import re

routes = {
    'SignUpLogin.tsx': '/onboardingflowwizard',
    'OnboardingFlowWizard.tsx': '/mainanalyticsdashboard',
    'MainAnalyticsDashboard.tsx': '/csvuploaddatapreview',
    'CsvUploadDataPreview.tsx': '/insightsrecommendationshub',
    'InsightsRecommendationsHub.tsx': '/aianalystcopilot',
    'AiAnalystCopilot.tsx': '/workspacesettingsposintegrations',
    'WorkspaceSettingsPosIntegrations.tsx': '/mainanalyticsdashboard',
    'LandingPage.tsx': '/signuplogin'
}

for filepath in glob.glob('src/pages/*.tsx'):
    filename = os.path.basename(filepath)
    if filename in routes:
        next_route = routes[filename]
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace buttons that are primary actions
        def button_replacer(match):
            full_button = match.group(0)
            inner_html = match.group(2)
            keywords = ['start', 'continue', 'next', 'complete', 'save', 'upload', 'analyze', 'ask ai', 'sign in', 'create account']
            if any(k in inner_html.lower() for k in keywords) and 'onClick=' not in full_button:
                # Add onClick right after <button
                return full_button.replace('<button ', f'<button onClick={{() => window.location.href="{next_route}"}} ')
            return full_button
            
        content = re.sub(r'(<button\b[^>]*>)(.*?)(</button>)', button_replacer, content, flags=re.DOTALL|re.IGNORECASE)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print('Added onClick navigation to primary buttons')
