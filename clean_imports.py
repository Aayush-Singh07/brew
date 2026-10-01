import re
import os

files_to_fix = [
    'src/pages/AiAnalystCopilot.tsx',
    'src/pages/CsvUploadDataPreview.tsx',
    'src/pages/InsightsRecommendationsHub.tsx',
    'src/pages/MainAnalyticsDashboard.tsx'
]

for file_path in files_to_fix:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace 'import { Link, useNavigate }' with 'import { useNavigate }'
    content = content.replace('import { Link, useNavigate }', 'import { useNavigate }')
    
    # Replace 'import { Link } from "react-router-dom";' with ''
    content = re.sub(r'import\s+{\s*Link\s*}\s+from\s+"react-router-dom";\n', '', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Cleaned up unused imports.")
