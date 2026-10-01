import re

with open('src/pages/LandingPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """{/*  Newsletter Subscription  */}

<div>

<h4 className="font-title-md text-body-md font-semibold text-on-surface mb-3">The Roaster's Ledger</h4>

<p className="font-body-sm text-body-sm text-on-surface-variant mb-3">

            Bi-weekly specialty coffee margin analysis &amp; operational frameworks.

          </p>

<form noValidate className="space-y-2" onSubmit={(e) => e.preventDefault()}>

<input className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary" placeholder="owner@craftcoffee.com" type="email"/>

<button className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-title-md text-body-sm transition-colors" type="button">

              Subscribe Free

            </button>

</form>

</div>"""

# Remove excessive blank lines if they exist or just use regex to match the block robustly
pattern = re.compile(
    r'\{\/\*\s*Newsletter Subscription\s*\*\/\}.*?<\/form>\s*<\/div>',
    re.MULTILINE | re.DOTALL
)

replacement = """{/* Social Links */}
<div>
  <h4 className="font-title-md text-body-md font-semibold text-on-surface mb-3">Connect With Us</h4>
  <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
    Follow us for updates, tips, and café success stories.
  </p>
  <div className="flex items-center gap-4">
    <a href="#" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface-variant flex items-center justify-center transition-colors">
      <span className="material-symbols-outlined text-[20px]">share</span>
    </a>
    <a href="#" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface-variant flex items-center justify-center transition-colors">
      <span className="material-symbols-outlined text-[20px]">chat</span>
    </a>
    <a href="#" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface-variant flex items-center justify-center transition-colors">
      <span className="material-symbols-outlined text-[20px]">video_library</span>
    </a>
    <a href="#" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface-variant flex items-center justify-center transition-colors">
      <span className="material-symbols-outlined text-[20px]">alternate_email</span>
    </a>
  </div>
</div>"""

if pattern.search(content):
    content = pattern.sub(replacement, content)
    with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced newsletter with social icons.")
else:
    print("Could not find the Newsletter block.")
