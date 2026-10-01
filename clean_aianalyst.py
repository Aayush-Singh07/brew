import re

with open('src/pages/AiAnalystCopilot.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Cut Workspace Selector
switcher_pattern = r'\{/\*\s*Workspace Selector\s*\*/\}.*?</div>\s*</div>\s*\{/\*\s*Navigation Links\s*\*/\}'
content = re.sub(switcher_pattern, '</div>\n{/*  Navigation Links  */}', content, flags=re.DOTALL)

# 2. Cut Right Top Bar Actions (Simulated Export Buttons)
export_pattern = r'\{/\*\s*Right Top Bar Actions\s*\*/\}.*?</div>\s*</header>'
content = re.sub(export_pattern, '{/*  Right Top Bar Actions  */}\n<div className="flex items-center gap-2"></div>\n</header>', content, flags=re.DOTALL)

# 3. Cut Model Selector Pill
model_pattern = r'\{/\*\s*Deep Margin Audit Model selector pill\s*\*/\}.*?</div>\s*<span className="text-xs text-outline'
content = re.sub(model_pattern, '<span className="text-xs text-outline', content, flags=re.DOTALL)

# 4. Cut Right Sidebar Drawer
drawer_pattern = r'\{/\*\s*========================================================\s*\*/\}\s*\{/\*\s*RIGHT SIDEBAR / CONTEXT & TRANSPARENCY DRAWER \(approx 35%\)\s*\*/\}.*?</aside>'
content = re.sub(drawer_pattern, '', content, flags=re.DOTALL)

# Adjust Left Main Conversation Panel width from lg:w-[65%] to w-full
content = content.replace('lg:w-[65%]', 'w-full')

# Also, the buttons at the bottom that simulate integrations:
# Actually, the spec says "fake language model selector... Reference Context side drawer... Fake prompt library".
# I'll cut the prompt library (lines 378-392).
prompt_pattern = r'\{/\*\s*Horizontally Scrollable Query Chips\s*\*/\}.*?</div>\s*\{/\*\s*Main Input Box'
content = re.sub(prompt_pattern, '{/*  Main Input Box', content, flags=re.DOTALL)


with open('src/pages/AiAnalystCopilot.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("AiAnalystCopilot cleaned up.")
