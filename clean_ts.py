import os

# 1. Sidebar.tsx
sidebar_path = "src/components/Sidebar.tsx"
with open(sidebar_path, "r", encoding="utf-8") as f:
    sidebar = f.read()

import re
# Remove toggleDemoMode from Sidebar
sidebar = re.sub(r'const toggleDemoMode = async \(\) => \{.*?\};\n\n', '', sidebar, flags=re.DOTALL)
with open(sidebar_path, "w", encoding="utf-8") as f:
    f.write(sidebar)

# 2. AiAnalystCopilot.tsx
copilot_path = "src/pages/AiAnalystCopilot.tsx"
with open(copilot_path, "r", encoding="utf-8") as f:
    copilot = f.read()
if "<DemoToggle" not in copilot:
    # If not injected properly, let's inject it at the top right of the header
    copilot = copilot.replace('<h1 className="font-headline-md text-headline-md text-on-surface">AI Analyst</h1>', '<h1 className="font-headline-md text-headline-md text-on-surface">AI Analyst</h1>\n            <DemoToggle isDemoMode={!!userProfile?.isDemoMode} />')
with open(copilot_path, "w", encoding="utf-8") as f:
    f.write(copilot)

# 3. MainAnalyticsDashboard.tsx
dashboard_path = "src/pages/MainAnalyticsDashboard.tsx"
with open(dashboard_path, "r", encoding="utf-8") as f:
    dashboard = f.read()

# Make sure we actually use displayMetrics
dashboard = dashboard.replace('metrics ? metrics.totalRevenue', 'displayMetrics ? displayMetrics.totalRevenue')
dashboard = dashboard.replace('metrics ? metrics.averageOrderValue', 'displayMetrics ? displayMetrics.averageOrderValue')
dashboard = dashboard.replace('metrics ? metrics.totalOrders', 'displayMetrics ? displayMetrics.totalOrders')
dashboard = dashboard.replace('metrics && metrics.topProducts', 'displayMetrics && displayMetrics.topProducts')

with open(dashboard_path, "w", encoding="utf-8") as f:
    f.write(dashboard)
