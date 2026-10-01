import re

with open('src/pages/CsvUploadDataPreview.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove Confidence Score
confidence_pattern = r'<div className="pt-2 border-t border-outline-variant flex items-center justify-between text-\[11px\] font-label-sm">\s*<span className="text-outline">Confidence Score</span>\s*<span className="font-mono font-bold text-emerald-700">.*?</span>\s*</div>'
content = re.sub(confidence_pattern, '', content, flags=re.DOTALL)

# 2. Fix Table Columns
table_header_pattern = r'<th className="py-2.5 px-3 font-semibold text-right">Est\. Cost / COGS</th>\s*<th className="py-2.5 px-4 font-semibold text-right">Gross Margin %</th>\s*<th className="py-2.5 px-4 font-semibold text-center">Mapping Status</th>'
content = re.sub(table_header_pattern, '<th className="py-2.5 px-3 font-semibold text-right">Total</th>', content, flags=re.DOTALL)

content = content.replace('<th className="py-2.5 px-3 font-semibold text-right">Unit Revenue</th>', '<th className="py-2.5 px-3 font-semibold text-right">Price</th>')

# We need to replace the last 3 `<td>`s of each row with a single `<td>Total</td>`
# Let's find all rows. They are enclosed in <tr>...</tr> inside <tbody>
def replace_row_data(match):
    row = match.group(0)
    # The last 3 td's are: Est Cost, Margin, Mapping Status. We can find the 6th td (Unit Revenue) and calculate total or just fake it.
    # Actually, we can just replace the <td>s after the Unit Revenue <td>.
    # Unit Revenue is the 6th <td>
    tds = re.findall(r'<td.*?</td>', row, flags=re.DOTALL)
    if len(tds) >= 9:
        price_str = re.search(r'₹([\d\.]+)', tds[5])
        qty_str = re.search(r'>(\d+)<', tds[4])
        if price_str and qty_str:
            price = float(price_str.group(1))
            qty = int(qty_str.group(1))
            total = price * qty
        else:
            total = 0
        total_td = f'<td className="py-3 px-3 text-right font-mono font-medium text-on-surface">₹{total:.2f}</td>'
        new_row = row.replace(tds[6], total_td).replace(tds[7], '').replace(tds[8], '')
        return new_row
    return row

content = re.sub(r'(<tr className="hover:bg-surface-container-low/60 transition-colors">.*?</tr>)', replace_row_data, content, flags=re.DOTALL)

# 3. Change "Looks Good, Run AI Analytics" link or button if needed. (Navigation mapping later).
# Also, remove Workspace switchers from Sidebar since we did it on Dashboard too.
switcher_pattern = r'\{/\*\s*Workspace Context Switcher\s*\*/\}.*?</div>\s*</div>\s*\{/\*\s*Navigation Links\s*\*/\}'
content = re.sub(switcher_pattern, '</div>\n{/*  Navigation Links  */}', content, flags=re.DOTALL)

with open('src/pages/CsvUploadDataPreview.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("CsvUploadDataPreview cleaned up.")
