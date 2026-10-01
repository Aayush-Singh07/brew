import re

with open('src/pages/WorkspaceSettingsPosIntegrations.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Simplify Sub-Tab Navigation
subtabs = '''{/*  Sub-Tab Navigation Bar  */}
<div className="bg-surface-container-lowest border-b border-outline-variant px-space-xl">
<nav className="flex space-x-8 overflow-x-auto">
<Link className="py-3 px-1 border-b-2 border-primary-container text-primary font-title-md text-sm font-semibold flex items-center gap-2 shrink-0" to="#profile-section">
<span className="material-symbols-outlined text-base">person</span>
<span>User Profile</span>
</Link>
<Link className="py-3 px-1 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-body-md text-sm hover:border-outline-variant transition-colors flex items-center gap-2 shrink-0" to="#billing-section">
<span className="material-symbols-outlined text-base">credit_card</span>
<span>Billing &amp; Subscription</span>
</Link>
<Link className="py-3 px-1 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-body-md text-sm hover:border-outline-variant transition-colors flex items-center gap-2 shrink-0" to="#privacy-section">
<span className="material-symbols-outlined text-base">security</span>
<span>Data &amp; Privacy</span>
</Link>
</nav>
</div>'''
content = re.sub(r'\{/\*\s*Sub-Tab Navigation Bar\s*\*/\}.*?</div>', subtabs, content, flags=re.DOTALL)

# 2. Replace Content Body Container
new_body = '''{/*  CONTENT BODY CONTAINER  */}
<div className="p-space-xl flex flex-col gap-space-xl max-w-7xl">
  <section id="profile-section" className="flex flex-col gap-4">
    <div>
      <h2 className="font-headline-sm text-headline-sm text-on-surface">User Profile</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Manage your basic account details.</p>
    </div>
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xl">
        JM
      </div>
      <div>
        <h3 className="font-title-md text-lg font-semibold text-on-surface">Jordan Miller</h3>
        <p className="font-body-sm text-on-surface-variant">jordan@artisanroast.coffee • Head of Operations</p>
      </div>
    </div>
  </section>

  <section id="billing-section" className="flex flex-col gap-4">
    <div>
      <h2 className="font-headline-sm text-headline-sm text-on-surface">Subscription &amp; Billing</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Choose the plan that fits your business needs.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm text-center">
        <h3 className="font-title-md font-bold text-lg mb-2">Free Tier</h3>
        <p className="text-on-surface-variant mb-4">Basic features to get started</p>
        <p className="text-2xl font-bold mb-4">₹0 <span className="text-sm font-normal">/ mo</span></p>
        <button className="w-full py-2 border border-outline-variant rounded-lg text-sm font-medium hover:bg-surface-container-low">Current Plan</button>
      </div>
      <div className="bg-primary-container/10 p-6 rounded-xl border border-primary shadow-sm text-center relative">
        <span className="absolute top-0 right-0 bg-primary text-on-primary text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">POPULAR</span>
        <h3 className="font-title-md font-bold text-lg mb-2 text-primary">Pro</h3>
        <p className="text-on-surface-variant mb-4">Advanced insights and AI</p>
        <p className="text-2xl font-bold mb-4 text-primary">₹999 <span className="text-sm font-normal">/ mo</span></p>
        <button className="w-full py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-secondary">Upgrade to Pro</button>
      </div>
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm text-center">
        <h3 className="font-title-md font-bold text-lg mb-2">Enterprise</h3>
        <p className="text-on-surface-variant mb-4">Multi-location &amp; full support</p>
        <p className="text-2xl font-bold mb-4">₹2,499 <span className="text-sm font-normal">/ mo</span></p>
        <button className="w-full py-2 border border-outline-variant rounded-lg text-sm font-medium hover:bg-surface-container-low">Contact Sales</button>
      </div>
    </div>
  </section>

  <section id="privacy-section" className="flex flex-col gap-4">
    <div>
      <h2 className="font-headline-sm text-headline-sm text-on-surface">Data &amp; Privacy</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Manage your account data and privacy settings.</p>
    </div>
    <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h3 className="font-title-md text-red-800 font-bold">Delete Account &amp; Data</h3>
        <p className="text-sm text-red-700 mt-1">Once you delete your account, there is no going back. Please be certain.</p>
      </div>
      <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap">
        Delete Account
      </button>
    </div>
  </section>
</div>
</main>'''

content = re.sub(r'\{/\*\s*CONTENT BODY CONTAINER\s*\*/\}.*?</main>', new_body, content, flags=re.DOTALL)

# 3. Clean up Workspace Switcher in sidebar
switcher_pattern = r'\{/\*\s*Workspace Switcher Pill\s*\*/\}.*?</button>\s*\{/\*\s*Navigation Links\s*\*/\}'
content = re.sub(switcher_pattern, '{/*  Navigation Links  */}', content, flags=re.DOTALL)

with open('src/pages/WorkspaceSettingsPosIntegrations.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Settings cleaned up.")
