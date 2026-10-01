import os

files_to_clean = [
    "src/pages/WorkspaceSettingsPosIntegrations.tsx",
    "src/pages/InsightsRecommendationsHub.tsx",
    "src/pages/CsvUploadDataPreview.tsx",
    "src/pages/AiAnalystCopilot.tsx"
]

for file_path in files_to_clean:
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    with open(file_path, "w", encoding="utf-8") as f:
        for line in lines:
            if "import DemoToggle from" in line:
                continue
            if "<DemoToggle" in line:
                continue
            f.write(line)

print("Removed DemoToggle from 4 files.")
