import os
import re

worlds = ['Roast.tsx', 'Brew.tsx', 'Shop.tsx']

for w in worlds:
    path = os.path.join('src', 'worlds', w)
    if not os.path.exists(path): continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace scroller logic
    content = content.replace("const scroller = isJourney ? window : containerRef.current;", "const scroller = window;")
    content = content.replace("isJourney ? window : containerRef.current", "window")
    
    # Remove old start, end, pin lines to avoid duplication
    content = re.sub(r"start:\s*'top top',", "", content)
    content = re.sub(r"end:\s*'\+=300%',", "", content)
    content = re.sub(r"pin:\s*true,", "", content)
    
    # Insert dynamic trigger, start, end, pin
    if 'Roast' in w:
        content = re.sub(r"trigger:\s*'\.st-roast-pin',", "trigger: isJourney ? '.st-roast-pin' : null,\n          start: isJourney ? 'top top' : '400vh',\n          end: isJourney ? '+=300%' : '700vh',\n          pin: isJourney ? true : false,", content)
    if 'Brew' in w:
        content = re.sub(r"trigger:\s*'\.st-brew-pin',", "trigger: isJourney ? '.st-brew-pin' : null,\n          start: isJourney ? 'top top' : '700vh',\n          end: isJourney ? '+=300%' : '1000vh',\n          pin: isJourney ? true : false,", content)
    if 'Shop' in w:
        content = re.sub(r"trigger:\s*'\.st-shop-pin',", "trigger: isJourney ? '.st-shop-pin' : null,\n          start: isJourney ? 'top top' : '1000vh',\n          end: isJourney ? '+=300%' : '1300vh',\n          pin: isJourney ? true : false,", content)

    # Replace overflow-y-auto overflow-x-hidden
    content = content.replace("'h-full overflow-y-auto overflow-x-hidden'", "''")
    content = content.replace("'h-full overflow-y-auto'", "''")
    content = content.replace("overflow-y-auto", "")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Rewrote GSAP triggers using regex")
