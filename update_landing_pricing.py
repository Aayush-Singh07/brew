import re

with open('src/pages/LandingPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# FREE PLAN list
free_plan_list = """<ul className="space-y-3 font-body-md text-body-md text-on-surface border-t border-outline-variant/40 pt-6 mb-8">
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>1 café location</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>3 CSV uploads / month</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>Dashboard Analytics</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>5 AI Copilot Messages / mo</span>
</li>
<li className="flex items-center gap-2.5 text-outline">
<span className="material-symbols-outlined text-[18px]" data-icon="close">close</span>
<span>Insights Hub</span>
</li>
</ul>"""

# Search for the ul in the free plan and replace it. 
# It starts at line 872 and ends at 906
content = re.sub(r'<ul className="space-y-3 font-body-md text-body-md text-on-surface border-t border-outline-variant/40 pt-6 mb-8">(.*?)</ul>', free_plan_list, content, count=1, flags=re.DOTALL)

# PRO PLAN list
pro_plan_list = """<ul className="space-y-3 font-body-md text-body-md text-on-surface border-t border-outline-variant/40 pt-6 mb-8">
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>1 café location</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<strong className="font-medium">Unlimited CSV uploads</strong>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>50 AI Copilot Messages / mo</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>Full Insights Hub</span>
</li>
</ul>"""
content = re.sub(r'<ul className="space-y-3 font-body-md text-body-md text-on-surface border-t border-outline-variant/40 pt-6 mb-8">(.*?)</ul>', pro_plan_list, content, count=1, flags=re.DOTALL)

# BUSINESS PLAN list
business_plan_list = """<ul className="space-y-3 font-body-md text-body-md text-on-surface border-t border-outline-variant/40 pt-6 mb-8">
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>2+ café locations</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>Unlimited AI Copilot Messages</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>Team Access & Roles</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>Dedicated Support Advisor</span>
</li>
</ul>"""
content = re.sub(r'<ul className="space-y-3 font-body-md text-body-md text-on-surface border-t border-outline-variant/40 pt-6 mb-8">(.*?)</ul>', business_plan_list, content, count=1, flags=re.DOTALL)


with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated LandingPage.tsx")
