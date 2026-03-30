import os

directory = r"d:\Projects\My Portfolio\Portfolio\src\app\components"
exclude_files = ["HeroSection.tsx", "Navigation.tsx", "BackgroundAnimation.tsx"]

replacements = {
    "bg-gradient-to-r from-accent to-glow": "bg-foreground",
    "bg-gradient-to-r from-accent/10 to-glow/10": "bg-surface",
    "border-accent/20": "border-border",
    "border-accent/50": "border-foreground/50",
    "border-accent": "border-foreground",
    "shadow-accent/10": "shadow-black/5 dark:shadow-white/5",
    "shadow-accent/20": "shadow-black/5 dark:shadow-white/5",
    "shadow-accent/30": "shadow-black/10 dark:shadow-white/10",
    "shadow-accent/40": "shadow-black/10 dark:shadow-white/10",
    "text-accent": "text-foreground font-semibold",
    "text-glow": "text-foreground/80",
    "bg-accent text-white": "bg-foreground text-background border border-transparent hover:bg-background hover:text-foreground hover:border-foreground transition-all",
    "bg-accent/10": "bg-foreground/10",
    "hover:border-accent/50": "hover:border-foreground/50",
    "hover:border-accent": "hover:border-foreground",
    "hover:text-accent": "hover:opacity-70",
    "hover:shadow-accent/40": "hover:shadow-black/20 dark:hover:shadow-white/20",
    "hover:shadow-accent/20": "hover:shadow-black/10 dark:hover:shadow-white/10",
    "hover:shadow-accent/10": "hover:shadow-black/5 dark:hover:shadow-white/5",
    "group-hover:text-accent": "group-hover:opacity-70",
    "from-accent": "from-foreground",
    "via-glow": "via-foreground",
    "to-accent": "to-foreground",
    "to-glow": "to-foreground"
}

for filename in os.listdir(directory):
    if filename.endswith(".tsx") and filename not in exclude_files:
        filepath = os.path.join(directory, filename)
        if os.path.isfile(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            for old, new in replacements.items():
                content = content.replace(old, new)
                
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

print("Done replacing in components.")
