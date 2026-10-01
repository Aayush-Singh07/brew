import re

with open('src/pages/SignUpLogin.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

func_block = """  const handleDemo = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, "demo@brewlytics.app", "BrewDemo@2026");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };"""

content = content.replace(func_block, "")

with open('src/pages/SignUpLogin.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed handleDemo.")
