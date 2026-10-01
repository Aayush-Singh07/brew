import re
import os

# 1. Restore Landing Page Chat Interface
with open('src/pages/LandingPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

demo_pattern = r'\{/\*\s*Interface Mockup Window \(Simplified\).*?</section>'
restored_chat = '''{/*  Interface Mockup Window (Restored Interactive Chat) */}
<div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-2xl overflow-hidden max-w-4xl mx-auto flex flex-col text-left" id="interactive-preview">
  <div className="bg-surface-container border-b border-outline-variant px-4 py-3 flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
      <span className="material-symbols-outlined text-lg">psychology</span>
    </div>
    <div>
      <h3 className="font-title-md text-sm font-bold text-on-surface">Brewlytics AI Assistant</h3>
      <p className="font-body-sm text-xs text-emerald-600 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online &amp; Analyzing
      </p>
    </div>
  </div>
  <div className="p-space-md bg-surface-container-lowest flex flex-col gap-4">
    <div className="flex gap-3 justify-end">
      <div className="bg-primary text-on-primary p-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
        <p className="text-body-sm">Why was Tuesday gross revenue down 18% compared to Monday?</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-sm font-bold shrink-0">JM</div>
    </div>
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-bold shrink-0">
        <span className="material-symbols-outlined text-[16px]">psychology</span>
      </div>
      <div className="bg-surface-container-low p-4 rounded-2xl rounded-tl-sm border border-outline-variant max-w-[85%] shadow-sm text-body-sm text-on-surface">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-outline-variant/50">
          <span className="font-bold">Diagnostic Breakdown</span>
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">-18.2% REV DIP</span>
        </div>
        <p className="mb-3">
          Gross revenue fell <strong className="text-red-600">18.2%</strong> (₹11,420 vs ₹11,732). 
          The drop was concentrated in afternoon espresso drinks (2-5 PM) following rainy weather.
        </p>
      </div>
    </div>
  </div>
  <div className="p-3 bg-surface-container border-t border-outline-variant flex items-center gap-2">
    <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-full px-4 py-2 text-sm text-outline-variant flex items-center">
      Ask a follow-up question...
    </div>
    <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center opacity-50">
      <span className="material-symbols-outlined text-[18px]">send</span>
    </div>
  </div>
</div>
</section>'''

if "{/*  Interface Mockup Window (Simplified) */}" in content:
    content = re.sub(demo_pattern, restored_chat, content, flags=re.DOTALL)
    with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Restored chat in LandingPage.")

# 2. Add validation back to SignUpLogin.tsx
with open('src/pages/SignUpLogin.tsx', 'r', encoding='utf-8') as f:
    signup_content = f.read()

# Add required to inputs
signup_content = signup_content.replace('<input className=', '<input required className=')
signup_content = signup_content.replace('type="button" onClick={() => navigate("/onboarding")}', 'type="submit"')
signup_content = signup_content.replace('onSubmit={(e) => { e.preventDefault(); navigate("/onboarding"); }}', 'onSubmit={(e) => { e.preventDefault(); if(e.currentTarget.checkValidity()) navigate("/onboarding"); }}')

with open('src/pages/SignUpLogin.tsx', 'w', encoding='utf-8') as f:
    f.write(signup_content)
print("Restored validation in SignUpLogin.")

# 3. Add validation back to OnboardingFlowWizard.tsx
with open('src/pages/OnboardingFlowWizard.tsx', 'r', encoding='utf-8') as f:
    onb_content = f.read()

onb_content = onb_content.replace('<input className=', '<input required className=')
onb_content = onb_content.replace('<select className=', '<select required className=')

with open('src/pages/OnboardingFlowWizard.tsx', 'w', encoding='utf-8') as f:
    f.write(onb_content)
print("Restored validation in OnboardingFlowWizard.")

