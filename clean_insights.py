import re

with open('src/pages/InsightsRecommendationsHub.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Cut High-Level Impact Summary Strip
kpi_pattern = r'\{/\*\s*High-Level Impact Summary Strip.*?\{/\*\s*Category Filter Tabs\s*\*/\}'
content = re.sub(kpi_pattern, '{/*  Category Filter Tabs  */}', content, flags=re.DOTALL)

# 2. Cut Category Filter Tabs
filters_pattern = r'\{/\*\s*Category Filter Tabs\s*\*/\}.*?\{/\*\s*Priority Actionable Recommendation Cards'
content = re.sub(filters_pattern, '{/*  Priority Actionable Recommendation Cards', content, flags=re.DOTALL)

# 3. Simplify Action Triggers in Cards
# Replace all `{/*  Interactive Action Triggers  */}` blocks with a simple Mark as Done button
action_triggers_pattern = r'\{/\*\s*Interactive Action(?:s| Triggers)\s*\*/\}.*?</article>'
simple_actions = '''{/*  Interactive Actions  */}
<div className="mt-space-md pt-space-sm border-t border-outline-variant/60 flex items-center justify-end">
  <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface font-title-md text-body-sm hover:bg-surface-container hover:text-primary transition-all active:scale-99">
    <span className="material-symbols-outlined text-base">check</span>
    <span>Mark as Done</span>
  </button>
</div>
</article>'''

content = re.sub(action_triggers_pattern, simple_actions, content, flags=re.DOTALL)

# Also simplify Quick Wins Action buttons
quick_wins_actions = r'<div className="mt-3 flex items-center gap-3">.*?</div>\s*</div>\s*</div>'
simple_quick_win_action = '''<div className="mt-3 flex items-center gap-3">
  <button className="text-label-sm font-title-md text-primary hover:underline inline-flex items-center gap-1">
    Mark as Done
  </button>
</div>
</div>
</div>'''
content = re.sub(quick_wins_actions, simple_quick_win_action, content, flags=re.DOTALL)

# 4. Remove Workspace Selector from left nav (same as others)
switcher_pattern = r'\{/\*\s*Workspace Selector\s*\*/\}.*?</div>\s*</div>\s*\{/\*\s*Navigation Rail Links\s*\*/\}'
content = re.sub(switcher_pattern, '</div>\n{/*  Navigation Rail Links  */}', content, flags=re.DOTALL)

with open('src/pages/InsightsRecommendationsHub.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Insights cleaned up.")
