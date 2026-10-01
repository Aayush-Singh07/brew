import re

with open('src/pages/MainAnalyticsDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the glitchy h-24 left by global_text_fixes.py
content = content.replace('w-8 h-24', 'w-8 h-8')
content = content.replace('w-10 h-24', 'w-10 h-10')

# Replace the static products with dynamic topProducts map
products_pattern = re.compile(r'\{\/\*  Product 1  \*\/\}.*?\{\/\*  Product 5 \(Attention Needed\)  \*\/\}.*?<\/div>\s*<\/div>\s*<\/div>', re.DOTALL)

dynamic_products = """{/* Dynamic Products List */}
{metrics && metrics.topProducts ? metrics.topProducts.map((product: any, idx: number) => (
  <div key={idx} className="py-3 flex items-center justify-between hover:bg-surface-container-low/50 px-2 rounded-lg transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-on-surface text-xs">
        {idx + 1}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-title-md text-sm font-semibold text-on-surface">{product.name}</span>
          {idx === 0 && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#EDE8F8] text-primary">★ Star Item</span>}
        </div>
        <p className="text-label-sm text-on-surface-variant">{product.units.toLocaleString()} units sold</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-title-md text-sm font-bold text-on-surface tnum">₹{product.revenue.toLocaleString()}</p>
    </div>
  </div>
)) : (
  <div className="py-4 text-center text-sm text-outline">No products data available.</div>
)}
</div>
</div>
</div>"""

content = re.sub(products_pattern, dynamic_products, content)

with open('src/pages/MainAnalyticsDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Dashboard updated with dynamic products and fixed h-24 bug.")
