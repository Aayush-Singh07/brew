import os

file_path = "src/pages/OnboardingFlowWizard.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove Save & Exit
# Lines 22-27
import re
content = re.sub(r'<div className="flex items-center gap-space-md">\s*<Link.*?Save &amp; Exit.*?</Link>\s*</div>', '', content, flags=re.DOTALL)

# 2. Replace Stepper
stepper_start = content.find('<!--  Stepper Breadcrumb Component  -->')
# The comment in the file uses {/*  Stepper Breadcrumb Component  */}
stepper_start = content.find('{/*  Stepper Breadcrumb Component  */}')
stepper_end = content.find('{/*  Main Interactive Content Card  */}')

if stepper_start != -1 and stepper_end != -1:
    new_stepper = """{/*  Stepper Breadcrumb Component  */}
<div className="w-full bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm flex items-center justify-between">
  {/* Step 1 */}
  <div className="flex flex-col items-center gap-2 relative z-10 w-20">
    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm">
      <span className="material-symbols-outlined text-[16px]">check</span>
    </div>
    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Account</span>
  </div>

  {/* Line 1 -> 2 */}
  <div className="flex-1 h-1.5 bg-gradient-to-r from-emerald-500 via-emerald-300 to-primary rounded-full animate-pulse opacity-80 mx-2"></div>

  {/* Step 2 (Active) */}
  <div className="flex flex-col items-center gap-2 relative z-10 w-24">
    <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xl shadow-lg ring-4 ring-primary-container scale-110">
      2
    </div>
    <span className="text-[13px] font-extrabold uppercase tracking-widest text-primary mt-1">Onboarding</span>
  </div>

  {/* Line 2 -> 3 */}
  <div className="flex-1 h-1.5 bg-gradient-to-r from-primary to-surface-variant rounded-full opacity-50 mx-2"></div>

  {/* Step 3 */}
  <div className="flex flex-col items-center gap-2 relative z-10 w-20 opacity-60">
    <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold shadow-sm">
      3
    </div>
    <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Insights</span>
  </div>
</div>
"""
    content = content[:stepper_start] + new_stepper + content[stepper_end:]

# 3. Remove "Explore Sample" button
explore_sample_regex = r'<button[^>]*>\s*Explore Sample\s*</button>'
content = re.sub(explore_sample_regex, '', content, flags=re.DOTALL)

# 4. Put time to dashboard as 5 mins
# Replace "Auto-parsed" with "Time to dashboard: 5 mins"
content = content.replace(
    '<span className="text-label-sm font-label-sm text-outline font-medium">Auto-parsed</span>',
    '<span className="text-label-sm font-label-sm text-on-surface-variant font-medium">Time to dashboard: <strong className="text-primary font-bold">5 mins</strong></span>'
)
# And replace the first card's 5 seconds with 5 mins just in case that's what they meant, 
# or just leave it. They said "remove this and put time to dashboard as 5 mins".
# Let's replace the first card's "~5 seconds" with "5 mins" as well, or just remove it if the button is gone.
# If they said "remove explore sample button from onboarding wizard", maybe the first card is still there.

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated OnboardingFlowWizard.tsx")
