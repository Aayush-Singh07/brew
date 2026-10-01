import os
import glob
import re

def scale_up_height(match):
    prefix = match.group(1) # e.g. "h-" or "md:h-" or "sm:h-"
    val_str = match.group(2)
    try:
        val = int(val_str)
        # Scale up by roughly 2.5x to 3x based on Tailwind scale
        # 7 -> 20, 8 -> 24, 9 -> 24, 10 -> 28, 12 -> 32
        new_val = int(val * 2.5)
        # Round to nearest tailwind class (which are usually multiples of 4 at this level)
        new_val = round(new_val / 4) * 4
        if new_val < 20: new_val = 20
        return f"{prefix}{new_val}"
    except ValueError:
        return match.group(0)

def replace_img(match):
    img_tag = match.group(0)
    # Scale up h-XX classes
    img_tag = re.sub(r'([a-z:-]*h-)(\d+)', scale_up_height, img_tag)
    return img_tag

for filepath in glob.glob('src/pages/*.tsx'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Target only the logo img
    content = re.sub(r'<img[^>]*alt="Brewlytics Logo"[^>]*>', replace_img, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print('Scaled up Brewlytics Logo across all pages.')
