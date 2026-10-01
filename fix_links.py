import re

# Update LandingPage.tsx
with open('src/pages/LandingPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Desktop Nav
# <Link className="..." to="/login">Features</Link> -> <a className="..." href="#features">Features</a>
content = re.sub(
    r'<Link([^>]*)to="/login">Features<\/Link>',
    r'<a\1href="#features">Features</a>',
    content
)
content = re.sub(
    r'<Link([^>]*)to="/login">Pricing<\/Link>',
    r'<a\1href="#pricing">Pricing</a>',
    content
)

# Mobile Drawer uses onClick={() => setIsMobileMenuOpen(false)}
content = re.sub(
    r'<Link([^>]*)to="/login"([^>]*)>Features<\/Link>',
    r'<a\1href="#features"\2>Features</a>',
    content
)
content = re.sub(
    r'<Link([^>]*)to="/login"([^>]*)>Pricing<\/Link>',
    r'<a\1href="#pricing"\2>Pricing</a>',
    content
)

with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# Update index.css
with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

if 'scroll-behavior' not in css:
    css = css.replace('@layer base {', '@layer base {\n  html {\n    scroll-behavior: smooth;\n  }\n')
    with open('src/index.css', 'w', encoding='utf-8') as f:
        f.write(css)

print("Links and CSS updated.")
