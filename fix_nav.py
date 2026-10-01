import re

with open('src/pages/LandingPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add useState import
if 'import { useState } from "react";' not in content:
    content = content.replace('import { Link, useNavigate } from "react-router-dom";', 'import { Link, useNavigate } from "react-router-dom";\nimport { useState } from "react";')

# 2. Add state variable
if 'const [isMobileMenuOpen' not in content:
    content = content.replace('const navigate = useNavigate();', 'const navigate = useNavigate();\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);')

# 3. Replace the header block
header_start = content.find('<header')
header_end = content.find('</header>') + len('</header>')

new_header = """<header className="bg-surface-container-lowest dark:bg-inverse-surface border-b border-outline-variant dark:border-outline shadow-sm sticky top-0 z-50">
  <div className="flex items-center justify-between w-full h-16 px-gutter max-w-7xl mx-auto">
    
    {/* Brand Logo */}
    <Link className="flex items-center gap-space-sm group" to="/login">
      <img alt="Brewlytics Logo" className="h-16 md:h-12 w-auto object-contain transition-transform group-hover:scale-102" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuJED-yJigROSRKya3uZjCI0ufBRaEnBING_CTM46U9WWxWgZ7buiLvDtrKEtHlCvh665BLwOeAQ-B9c6MHpavoW9AnWRY3dIfOv6EzQYlOp5kRqkASzebbcsP1GLXbqmrUPj2c2NTlkFFA0iEcpxcB6JATzz0vt7OtAQnc0m7_3jbAuYnFXnSaE94myNTfWXsKYWhcxGB0YCEo0Q7QAIn60X-fr10mm5vUIw0YqnkcitkQCOIIMEGLZKPVDtcaiVpFQ"/>
    </Link>

    {/* Desktop Navigation Links */}
    <nav className="hidden md:flex items-center gap-space-lg">
      <Link className="text-on-surface-variant dark:text-outline-variant font-body-md text-body-md hover:text-primary dark:hover:text-inverse-primary transition-colors duration-150" to="/login">Features</Link>
      <Link className="text-on-surface-variant dark:text-outline-variant font-body-md text-body-md hover:text-primary dark:hover:text-inverse-primary transition-colors duration-150" to="/login">Pricing</Link>
      <Link className="relative text-primary dark:text-inverse-primary font-title-md text-title-md flex items-center gap-1 hover:text-primary dark:hover:text-inverse-primary transition-colors duration-150" to="/login">
        Demo
        <span className="absolute -top-3 -right-6 text-[10px] font-bold text-red-600 animate-pulse tracking-widest uppercase">Live</span>
      </Link>
    </nav>

    {/* Desktop Trailing Actions */}
    <div className="hidden md:flex items-center gap-space-sm">
      <Link className="inline-flex items-center justify-center px-space-md py-2 rounded-lg text-on-surface font-title-md text-body-md bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant transition-colors duration-150" to="/login">
        Sign In
      </Link>
      <Link className="inline-flex items-center justify-center px-space-md py-2 rounded-lg text-on-primary font-title-md text-body-md bg-primary-container hover:bg-secondary active:scale-99 transition-all duration-150 shadow-sm" to="/login">
        Get Started
      </Link>
    </div>

    {/* Mobile Hamburger Menu */}
    <div className="md:hidden flex items-center">
      <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-on-surface">
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>
    </div>

  </div>
</header>

{/* MOBILE DRAWER OVERLAY */}
{isMobileMenuOpen && (
  <div className="fixed inset-0 z-[100] bg-surface-container-lowest flex flex-col md:hidden">
    <div className="flex items-center justify-between p-4 border-b border-outline-variant">
      <img alt="Brewlytics Logo" className="h-12 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuJED-yJigROSRKya3uZjCI0ufBRaEnBING_CTM46U9WWxWgZ7buiLvDtrKEtHlCvh665BLwOeAQ-B9c6MHpavoW9AnWRY3dIfOv6EzQYlOp5kRqkASzebbcsP1GLXbqmrUPj2c2NTlkFFA0iEcpxcB6JATzz0vt7OtAQnc0m7_3jbAuYnFXnSaE94myNTfWXsKYWhcxGB0YCEo0Q7QAIn60X-fr10mm5vUIw0YqnkcitkQCOIIMEGLZKPVDtcaiVpFQ"/>
      <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-on-surface-variant hover:text-on-surface">
        <span className="material-symbols-outlined text-2xl">close</span>
      </button>
    </div>
    <div className="flex flex-col p-6 gap-6">
      <Link to="/login" className="text-xl font-medium text-on-surface" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
      <Link to="/login" className="text-xl font-medium text-on-surface" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
      <Link to="/login" className="text-xl font-bold text-primary flex items-center gap-2 relative w-max" onClick={() => setIsMobileMenuOpen(false)}>
        Demo
        <span className="text-[11px] font-bold text-red-600 animate-pulse tracking-widest uppercase">Live</span>
      </Link>
      
      <div className="mt-8 flex flex-col gap-4 border-t border-outline-variant/60 pt-8">
        <Link to="/login" className="w-full text-center py-3.5 rounded-xl border-2 border-primary text-primary font-title-md text-lg active:scale-99 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
          Sign In
        </Link>
        <Link to="/login" className="w-full text-center py-3.5 rounded-xl bg-primary text-on-primary font-title-md text-lg active:scale-99 shadow-md transition-all" onClick={() => setIsMobileMenuOpen(false)}>
          Get Started
        </Link>
      </div>
    </div>
  </div>
)}"""

content = content[:header_start] + new_header + content[header_end:]

with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated LandingPage.tsx nav UI.")
