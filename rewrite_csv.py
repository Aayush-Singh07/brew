import re

with open('src/pages/CsvUploadDataPreview.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add imports
if 'import { useState } from "react";' not in content:
    content = content.replace('import { Link, useNavigate } from "react-router-dom";', 'import { Link, useNavigate } from "react-router-dom";\nimport { useState } from "react";\nimport { auth, db } from "../firebase";\nimport { doc, setDoc, serverTimestamp } from "firebase/firestore";')

# 2. Add handleUpload function
hook_code = """  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!auth.currentUser) return;
    setIsUploading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock dataset upload replacing metrics
    await setDoc(doc(db, "metrics", auth.currentUser.uid), {
      totalRevenue: 50000 + Math.floor(Math.random() * 10000),
      totalOrders: 6000 + Math.floor(Math.random() * 1000),
      averageOrderValue: 8.5,
      topProducts: [
        { name: "Vanilla Sweet Cream Cold Brew", revenue: 15000, units: 2000 },
        { name: "Avocado Toast", revenue: 12000, units: 1000 },
        { name: "Matcha Latte", revenue: 8000, units: 1200 },
      ],
      updatedAt: serverTimestamp(),
      lastDataset: "artisan_roast_oct_sales.csv"
    }, { merge: true });

    setIsUploading(false);
    navigate("/dashboard");
  };
"""
content = re.sub(r'const navigate = useNavigate\(\);', hook_code, content)

# 3. Modify the upload button
btn_target = '<button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-[#5837A3] text-on-primary font-title-md text-xs font-semibold transition-all transform active:scale-95 shadow-md shadow-primary/20">'

btn_replace = '<button onClick={handleUpload} disabled={isUploading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-title-md text-xs font-semibold transition-all transform active:scale-95 shadow-md disabled:opacity-50">'

content = content.replace(btn_target, btn_replace)
content = content.replace('Looks Good, Run AI Analytics →', '{isUploading ? "Uploading Data..." : "Looks Good, Run AI Analytics →"}')
content = content.replace('arrow_back_ios_new', 'sparkles') # fix icon name from the original code which had `<span className="material-symbols-outlined text-base" data-icon="sparkles">arrow_back_ios_new</span>`

with open('src/pages/CsvUploadDataPreview.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Rewrote CSV Upload with mock update logic!")
