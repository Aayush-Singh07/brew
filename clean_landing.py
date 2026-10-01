import re

with open('src/pages/LandingPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove Social Proof Badge
content = re.sub(r'\{/\*\s*Social Proof Badge\s*\*/\}.*?</div>\s*</div>\s*</section>', '</div>\n</section>', content, flags=re.DOTALL)

# 2. Simplify Interactive Demo to just a placeholder or remove the complex parts
# Find from {/*  Interface Mockup Window  */} to {/*  CORE FEATURE HIGHLIGHTS (Bento Grid)  */}
demo_pattern = r'\{/\*\s*Interface Mockup Window\s*\*/\}.*?</section>'
static_demo = '''{/*  Interface Mockup Window (Simplified) */}
<div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 popover-shadow overflow-hidden max-w-4xl mx-auto p-8 text-center text-on-surface-variant font-body-md" id="interactive-preview">
  <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/50 inline-block">
    <p className="font-semibold text-primary mb-2">Example AI Output</p>
    <p className="max-w-md mx-auto italic">"Tuesday gross revenue was down 18% (₹1,420 vs ₹1,732). The drop was concentrated in afternoon espresso drinks (2-5 PM) following rainy weather."</p>
  </div>
</div>
</section>'''
content = re.sub(demo_pattern, static_demo, content, flags=re.DOTALL)

# 3. Cut Feature 3 and 4 from Bento Grid
# From {/*  Feature 3: Peak Hour Heatmap & Staffing Predictor  */} to </section>
features_pattern = r'\{/\*\s*Feature 3: Peak Hour Heatmap & Staffing Predictor\s*\*/\}.*?</div>\s*</div>\s*</section>'
content = re.sub(features_pattern, '</div>\n</div>\n</section>', content, flags=re.DOTALL)

# 4. Remove fake badges from Footer
badges_pattern = r'<div className="flex items-center gap-3 text-label-sm font-label-sm text-outline">.*?</div>\s*</div>\s*\{/\*\s*Links Column 1\s*\*/\}'
content = re.sub(badges_pattern, '</div>\n{/*  Links Column 1  */}', content, flags=re.DOTALL)

# 5. Remove Integrations and Newsletter from Footer
footer_links_pattern = r'\{/\*\s*Links Column 2\s*\*/\}.*?</div>\s*</div>\s*\{/\*\s*Copyright & Legal\s*\*/\}'
content = re.sub(footer_links_pattern, '</div>\n{/*  Copyright & Legal  */}', content, flags=re.DOTALL)
# Also change grid-cols-5 to grid-cols-3
content = content.replace('grid-cols-1 md:grid-cols-5 gap-10', 'grid-cols-1 md:grid-cols-3 gap-10')

# 6. Clean Pricing
# Remove "Direct Toast / Square API Sync" and "QuickBooks & Xero Accounting Export"
content = re.sub(r'<li[^>]*>.*?Direct Toast / Square API Sync.*?</li>', '', content, flags=re.DOTALL)
content = re.sub(r'<li[^>]*>.*?QuickBooks &amp; Xero Accounting Export.*?</li>', '', content, flags=re.DOTALL)
# Add realistic CSV upload feature
content = re.sub(r'(<li[^>]*>.*?Up to 10 retail locations.*?</li>)', r'\1\n<li className="flex items-center gap-2.5"><span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span><span>Priority CSV Processing</span></li>', content, flags=re.DOTALL)


with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Landing page cleaned up.")
