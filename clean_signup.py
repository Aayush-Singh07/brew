import re

with open('src/pages/SignUpLogin.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove View Demo
demo_block = """            <div className="mb-space-lg">
              <button onClick={handleDemo} disabled={loading} className="w-full h-12 px-space-md bg-secondary-container hover:bg-secondary text-on-secondary font-title-md text-body-md flex items-center justify-center gap-space-sm rounded-lg transition-all duration-150 active:scale-99 disabled:opacity-50" type="button">
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
                <span>View Demo</span>
              </button>
            </div>"""

content = content.replace(demo_block, "")

# 2. Remove "Already have an account?"
top_right = """        <div className="flex items-center gap-space-sm text-body-sm font-body-sm text-on-surface-variant">
          <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-semibold hover:underline cursor-pointer focus:outline-none" type="button">
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>"""

content = content.replace(top_right, "")

# 3. Make back button look good
old_back = """<Link className="inline-flex items-center gap-space-xs text-on-surface-variant hover:text-primary transition-colors text-body-sm font-body-sm" to="/">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to home</span>
        </Link>"""

new_back = """<Link className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/50 text-on-surface-variant hover:text-on-surface transition-all duration-150 text-body-sm font-title-md shadow-sm active:scale-99" to="/">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Home</span>
        </Link>"""

content = content.replace(old_back, new_back)

with open('src/pages/SignUpLogin.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("SignUpLogin.tsx cleaned up.")
