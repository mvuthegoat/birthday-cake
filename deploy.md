# 🚀 Production Deployment Guide

## Files to Deploy
Upload these files to your web server:

```
cake-blow/
├── index.html           ← Main page
├── script.js           ← App logic
├── style.css           ← Styling
├── birthday-song.mp3   ← Music file
├── photos.json         ← Generated photo list (IMPORTANT!)
└── public/             ← All your photos
    ├── photo1.jpg
    ├── photo2.jpg
    └── ... (all photos)
```

## Deployment Process

### 1. Before Deployment (Local)
```bash
# Add all photos to public/ folder
# Generate photo list
node generate-photo-list.js

# OR use npm script
npm run build
```

### 2. Upload to Server
Upload ALL files including:
- `photos.json` (generated file)
- `public/` folder with all photos
- All other files (html, css, js, mp3)

### 3. Test
Visit your website and check browser console for:
```
📸 Loaded X photos automatically!
```

## Platform-Specific Guides

### GitHub Pages / Netlify / Vercel
```bash
# 1. Build locally
npm run build

# 2. Commit everything
git add .
git commit -m "Add photos and build"
git push

# 3. Platform auto-deploys
```

### Traditional Web Hosting
```bash
# 1. Build locally
npm run build

# 2. Upload via FTP/cPanel
# - Upload ALL files
# - Make sure public/ folder permissions are correct
```

### Simple HTTP Server (Testing)
```bash
# Test locally
npm run dev
# Opens at http://localhost:8000
```

## Important Notes

⚠️ **Always run `node generate-photo-list.js` before deployment!**
⚠️ **Upload the generated `photos.json` file**
⚠️ **No Node.js needed on production server**
⚠️ **Photos load via browser fetch() - static files only**

## Adding Photos After Deployment

1. Add photos to local `public/` folder
2. Run `node generate-photo-list.js`
3. Re-deploy `photos.json` and `public/` folder

## Troubleshooting

### Photos not loading?
- Check if `photos.json` exists on server
- Check browser console for fetch errors
- Verify `public/` folder uploaded correctly

### Build errors?
- Make sure Node.js is installed locally
- Check if `public/` folder exists
- Verify photo file extensions are supported 