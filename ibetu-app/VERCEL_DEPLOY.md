# Vercel Deployment Guide

## Current Status
- PWA functionality temporarily disabled due to build errors
- Application should deploy successfully without PWA features

## Build Configuration
- Vite config simplified to only include React plugin
- PWA dependencies removed from package.json
- .vercelignore configured to exclude PWA-related files

## To Re-enable PWA Later
1. Add back PWA dependencies:
   ```bash
   npm install vite-plugin-pwa workbox-window
   ```

2. Update vite.config.js:
   ```javascript
   import { VitePWA } from 'vite-plugin-pwa'
   
   export default defineConfig({
     plugins: [
       react(),
       VitePWA({
         registerType: 'autoUpdate',
         manifest: {
           name: 'I Bet U',
           short_name: 'IBetU',
           theme_color: '#667eea'
         }
       })
     ]
   })
   ```

3. Remove .vercelignore restrictions

## Current Build Command
```bash
npm run build
```

## Expected Output
- Build should complete without workbox errors
- Application will function normally without PWA features
- All core functionality (auth, payments, leaderboard) will work
