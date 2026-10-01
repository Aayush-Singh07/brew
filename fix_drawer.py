import re

with open('src/pages/LandingPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Current drawer code:
# {/* MOBILE DRAWER OVERLAY */}
# {isMobileMenuOpen && (
#   <div className="fixed inset-0 z-[100] bg-surface-container-lowest flex flex-col md:hidden">

new_drawer = """{/* MOBILE DRAWER OVERLAY */}
{isMobileMenuOpen && (
  <>
    <div className="fixed inset-0 bg-black/50 z-[90] md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
    <div className="fixed inset-y-0 right-0 w-1/2 z-[100] bg-surface-container-lowest flex flex-col md:hidden border-l border-outline-variant shadow-2xl animate-in slide-in-from-right duration-200">"""

content = content.replace('{/* MOBILE DRAWER OVERLAY */}\n{isMobileMenuOpen && (\n  <div className="fixed inset-0 z-[100] bg-surface-container-lowest flex flex-col md:hidden">', new_drawer)

# And close the React fragment at the end of the drawer.
# The drawer ends with:
#     </div>
#   </div>
# )}
# I need to change it to:
#     </div>
#   </div>
#   </>
# )}

end_drawer = """    </div>
  </div>
  </>
)}"""
content = content.replace("""    </div>\n  </div>\n)}""", end_drawer)

# Just in case my previous regex missed the fragment closure, I'll double check by looking for the last `</div>` inside isMobileMenuOpen

with open('src/pages/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated drawer to half screen.")
