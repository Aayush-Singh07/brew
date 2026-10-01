import os
import re

# 1. Update App.tsx
app_tsx = """import { BrowserRouter, Routes, Route } from "react-router-dom";
import CsvUploadDataPreview from "./pages/CsvUploadDataPreview";
import InsightsRecommendationsHub from "./pages/InsightsRecommendationsHub";
import OnboardingFlowWizard from "./pages/OnboardingFlowWizard";
import LandingPage from "./pages/LandingPage";
import AiAnalystCopilot from "./pages/AiAnalystCopilot";
import SignUpLogin from "./pages/SignUpLogin";
import MainAnalyticsDashboard from "./pages/MainAnalyticsDashboard";
import WorkspaceSettingsPosIntegrations from "./pages/WorkspaceSettingsPosIntegrations";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SignUpLogin />} />
        <Route path="/onboarding" element={<OnboardingFlowWizard />} />
        <Route path="/dashboard" element={<MainAnalyticsDashboard />} />
        <Route path="/upload" element={<CsvUploadDataPreview />} />
        <Route path="/insights" element={<InsightsRecommendationsHub />} />
        <Route path="/ai" element={<AiAnalystCopilot />} />
        <Route path="/settings" element={<WorkspaceSettingsPosIntegrations />} />
      </Routes>
    </BrowserRouter>
  );
}
"""
with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app_tsx)

# 2. Update navigation links in all pages
pages_dir = 'src/pages'
for filename in os.listdir(pages_dir):
    if not filename.endswith('.tsx'): continue
    filepath = os.path.join(pages_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Make logo bigger: h-20 -> h-32 or h-40, h-8 -> h-24
    content = re.sub(r'className="([^"]*)h-20([^"]*)"', r'className="\1h-32\2"', content)
    content = re.sub(r'className="([^"]*)h-10([^"]*)"', r'className="\1h-24\2"', content)
    content = re.sub(r'className="([^"]*)h-8([^"]*)"', r'className="\1h-24\2"', content)
    
    # Replace old routes with new routes
    content = content.replace('/csvuploaddatapreview', '/upload')
    content = content.replace('/insightsrecommendationshub', '/insights')
    content = content.replace('/onboardingflowwizard', '/onboarding')
    content = content.replace('/aianalystcopilot', '/ai')
    content = content.replace('/signuplogin', '/login')
    content = content.replace('/mainanalyticsdashboard', '/dashboard')
    content = content.replace('/workspacesettingsposintegrations', '/settings')

    # Specifically for LandingPage -> login
    if filename == 'LandingPage.tsx':
        content = content.replace('navigate("/signuplogin")', 'navigate("/login")')
        content = content.replace('to="/signuplogin"', 'to="/login"')

    # Specifically for SignUpLogin -> onboarding
    if filename == 'SignUpLogin.tsx':
        content = content.replace('navigate("/onboardingflowwizard")', 'navigate("/onboarding")')
        content = content.replace('to="/onboardingflowwizard"', 'to="/onboarding"')
        # Ensure it navigates instead of submitting form
        content = re.sub(r'<form[^>]*>', r'<form onSubmit={(e) => { e.preventDefault(); navigate("/onboarding"); }}>', content)
        content = content.replace('type="submit"', 'type="button" onClick={() => navigate("/onboarding")}')
        
    # Sidebar links
    if 'Sidebar' in content or 'Navigation' in content or 'Rail' in content or 'aside' in content:
        # Some are just hardcoded to the previous page's name or some other name in the original files due to the prompt's simplicity.
        # We need to map the icon or text to the correct route.
        # Let's just do a regex replace for the known text
        def replace_link(match):
            href, inner = match.group(1), match.group(2)
            if 'Dashboard' in inner: new_href = '/dashboard'
            elif 'AI Analyst' in inner: new_href = '/ai'
            elif 'Insights' in inner: new_href = '/insights'
            elif 'Reports' in inner: new_href = '/dashboard' # no reports page yet
            elif 'CSV Upload' in inner or 'Upload' in inner: new_href = '/upload'
            elif 'Settings' in inner: new_href = '/settings'
            else: new_href = href
            return f'to="{new_href}"{inner}'

        # Link component matching
        content = re.sub(r'to="([^"]*)"(>.*?<span[^>]*>.*?</span>.*?<span>(Dashboard|AI Analyst|Insights|Reports|CSV Upload|Settings)</span>.*?</Link>)', replace_link, content, flags=re.DOTALL)
        content = re.sub(r'to="([^"]*)"(>.*?<span[^>]*>(Dashboard|AI Analyst|Insights|Reports|CSV Upload|Settings)</span>.*?</Link>)', replace_link, content, flags=re.DOTALL)
        
        # also for navigate in buttons
        def replace_nav(match):
            href, inner = match.group(1), match.group(2)
            if 'Dashboard' in inner: new_href = '/dashboard'
            elif 'AI Analyst' in inner: new_href = '/ai'
            elif 'Insights' in inner: new_href = '/insights'
            elif 'Reports' in inner: new_href = '/dashboard'
            elif 'Upload' in inner: new_href = '/upload'
            elif 'Settings' in inner: new_href = '/settings'
            else: new_href = href
            return f'navigate("{new_href}"){inner}'
        
        content = re.sub(r'navigate\("([^"]*)"\)(.*?>[^<]*?(Dashboard|AI Analyst|Insights|Reports|Upload|Settings)[^<]*?<)', replace_nav, content, flags=re.DOTALL)

    # Specific fix for OnboardingFlowWizard to navigate to dashboard
    if filename == 'OnboardingFlowWizard.tsx':
        content = content.replace('navigate("/mainanalyticsdashboard")', 'navigate("/dashboard")')
        content = content.replace('to="/mainanalyticsdashboard"', 'to="/dashboard"')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Links and logos fixed.")
