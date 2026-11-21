# AUTOCORE — Premium Automotive Encyclopedia

A complete automotive knowledge platform with 150+ technical spec points per vehicle, covering 80+ global manufacturers, 45+ motorcycle categories, EVs, engines, parts, comparisons, and maintenance guides.

**Tech:** Pure HTML + CSS + JavaScript — no framework, no backend, no build step.

## Deploy

**Netlify (drag & drop):** Upload the folder at [netlify.com](https://netlify.com)

**GitHub Pages:**
```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/autocore.git
git push -u origin main
# Then: Settings → Pages → Source: main
```

**Local test:**
```bash
npx serve .
# http://localhost:3000
```

## Structure
```
index.html
css/styles.css
js/app.js
js/data-access.js
data/
assets/
```
