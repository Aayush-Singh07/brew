import re

with open('screen.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract body inner HTML
body_match = re.search(r'<body[^>]*>(.*)</body>', content, re.DOTALL)
body_html = body_match.group(1) if body_match else ''

# Replace class with className
jsx = body_html.replace('class="', 'className="')

# Replace readonly
jsx = jsx.replace('readonly=""', 'readOnly={true}')

# Replace onsubmit
jsx = jsx.replace('onsubmit="event.preventDefault();"', 'onSubmit={(e) => e.preventDefault()}')

# Replace inline styles with objects
jsx = re.sub(r'style="width:\s*(\d+)%"', r'style={{ width: "\1%" }}', jsx)

# Remove any comments that might break JSX if they are HTML comments
# Actually in JSX, HTML comments <!-- --> need to be {/* */}
jsx = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', jsx, flags=re.DOTALL)

app_tsx = f'''import React from "react";

export default function App() {{
  return (
    <div className="bg-background text-on-surface antialiased font-body-md text-body-md min-h-screen selection:bg-secondary-fixed selection:text-on-secondary-fixed-variant">
      {{/* TOP NAV BAR */}}
      {jsx}
    </div>
  );
}}
'''

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app_tsx)

print('App.tsx generated successfully!')
