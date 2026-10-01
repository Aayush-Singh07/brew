import re

with open('src/pages/OnboardingFlowWizard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Cut header progress indicator
progress_header_pattern = r'\{/\*\s*Center Progress Indicator\s*\*/\}.*?</div>\s*</div>\s*\{/\*\s*Right Header Actions\s*\*/\}'
content = re.sub(progress_header_pattern, '{/*  Right Header Actions  */}', content, flags=re.DOTALL)

# 2. Simplify "Instant Access" card text and cut highlights
old_sample_text = r'<p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">.*?</div>\s*\{/\*\s*Quick Highlights list\s*\*/\}.*?</div>\s*</div>\s*</div>\s*<div className="mt-space-lg'
new_sample_text = r'''<p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                  Load a sample café dataset to explore the product.
                </p>
</div>
</div>
<div className="mt-space-lg'''
content = re.sub(old_sample_text, new_sample_text, content, flags=re.DOTALL)

# 3. Cut POS compatibility tags
pos_tags_pattern = r'\{/\*\s*POS Compatibility Tags\s*\*/\}.*?</div>\s*\{/\*\s*Dropzone Box\s*\*/\}'
content = re.sub(pos_tags_pattern, '{/*  Dropzone Box  */}', content, flags=re.DOTALL)

# 4. Cut How Brewlytics Pipeline Works
pipeline_pattern = r'\{/\*\s*How It Works Flow Strip\s*\*/\}.*?</div>\s*</div>\s*\{/\*\s*Wizard Navigation Footer\s*\*/\}'
content = re.sub(pipeline_pattern, '{/*  Wizard Navigation Footer  */}', content, flags=re.DOTALL)

# 5. Cut Trust & Security Badges
trust_badges_pattern = r'\{/\*\s*Trust & Security Badges Footer\s*\*/\}.*?</footer>'
content = re.sub(trust_badges_pattern, '', content, flags=re.DOTALL)

# Also fix the `onClick={() => navigate("/mainanalyticsdashboard")}` for Explore Sample / Upload options?
# The spec says "Try Sample Data" navigates to /dashboard, "Upload My Own CSV" -> /upload
# We can do this in `03-navigation-map.md` wiring step.

with open('src/pages/OnboardingFlowWizard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Onboarding cleaned up.")
