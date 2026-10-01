with open('src/pages/LandingPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Free Plan replacement
old_free = """<ul className="space-y-3 font-body-md text-body-md text-on-surface border-t border-outline-variant/40 pt-6 mb-8">
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

new_free = """<ul className="space-y-3 font-body-md text-body-md text-on-surface border-t border-outline-variant/40 pt-6 mb-8">
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>Basic CSV Uploads</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>5 AI Copilot Messages / mo</span>
</li>
<li className="flex items-center gap-2.5 opacity-50">
<span className="material-symbols-outlined text-on-surface-variant text-[18px]" data-icon="close">close</span>
<span className="line-through">AI Margin Insights</span>
</li>
<li className="flex items-center gap-2.5 opacity-50">
<span className="material-symbols-outlined text-on-surface-variant text-[18px]" data-icon="close">close</span>
<span className="line-through">Team Access</span>
</li>
</ul>"""

# Pro Plan replacement
old_pro = """<ul className="space-y-3 font-body-md text-body-md text-on-surface border-t border-outline-variant/40 pt-6 mb-8">

<li className="flex items-center gap-2.5">

<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>

<strong className="font-medium">Unlimited CSV uploads</strong>

</li>

<li className="flex items-center gap-2.5">

<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>

<span>Full 24/7 AI Analyst Copilot</span>

</li>

<li className="flex items-center gap-2.5">

<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>

<span>Hourly Peak Staffing Heatmaps</span>

</li>

<li className="flex items-center gap-2.5">

<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>

<span>Menu Profitability Matrix</span>

</li>

</ul>"""

new_pro = """<ul className="space-y-3 font-body-md text-body-md text-on-surface border-t border-outline-variant/40 pt-6 mb-8">
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>Advanced CSV Analytics</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>50 AI Copilot Messages / mo</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>Full AI Margin Insights</span>
</li>
<li className="flex items-center gap-2.5 opacity-50">
<span className="material-symbols-outlined text-on-surface-variant text-[18px]" data-icon="close">close</span>
<span className="line-through">Team Access</span>
</li>
</ul>"""

# Business Plan replacement
old_biz = """<ul className="space-y-3 font-body-md text-body-md text-on-surface border-t border-outline-variant/40 pt-6 mb-8">

<li className="flex items-center gap-2.5">

<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>

<span>Up to 10 retail locations</span>

</li>

<li className="flex items-center gap-2.5">

<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>

<span>Direct Toast / Square API Sync</span>

</li>

<li className="flex items-center gap-2.5">

<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>

<span>QuickBooks &amp; Xero Accounting Export</span>

</li>

<li className="flex items-center gap-2.5">

<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>

<span>Dedicated Coffee Operations Advisor</span>

</li>

</ul>"""

new_biz = """<ul className="space-y-3 font-body-md text-body-md text-on-surface border-t border-outline-variant/40 pt-6 mb-8">
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>2+ café locations (Multi-outlet)</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>Unlimited AI Copilot Messages</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>Full AI Margin Insights</span>
</li>
<li className="flex items-center gap-2.5">
<span className="material-symbols-outlined text-primary text-[18px]" data-icon="check">check</span>
<span>Team Access & Roles</span>
</li>
</ul>"""

content = content.replace(old_free, new_free)
content = content.replace(old_pro, new_pro)
content = content.replace(old_biz, new_biz)

with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Landing page pricing replaced successfully")
