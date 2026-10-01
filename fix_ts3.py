import os

files_to_fix = [
    "src/pages/AiAnalystCopilot.tsx",
    "src/pages/CsvUploadDataPreview.tsx",
    "src/pages/InsightsRecommendationsHub.tsx",
    "src/pages/MainAnalyticsDashboard.tsx"
]

for file_path in files_to_fix:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = content.replace("const unsubscribeUser = onSnapshot", "onSnapshot")
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
