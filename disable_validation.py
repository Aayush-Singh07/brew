import os
import glob
import re

pages_dir = 'src/pages'
files = glob.glob(os.path.join(pages_dir, '*.tsx'))

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove required={true}
    content = content.replace('required={true}', '')
    
    # Add noValidate to form tags if not already there
    # Replace <form with <form noValidate
    content = re.sub(r'<form\b(?![^>]*noValidate)', r'<form noValidate', content)
    
    # In some places, button type="submit" might be wrapped in Link but still trigger form submission.
    # We can change type="submit" to type="button" to prevent native form submissions from blocking.
    content = content.replace('type="submit"', 'type="button"')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print('Disabled form validations.')
