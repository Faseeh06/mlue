# Converting Mlue to Android APK

## Overview
Your Next.js app is already set up as a PWA. Here are the main approaches to convert it to an APK.

---

## Option 1: Capacitor (Recommended) ⭐

**Best for:** Keeping your existing codebase, adding native features later

### Step 1: Install Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npx cap init
```

When prompted:
- **App name:** Mlue
- **App ID:** com.mlue.app (or your preferred package name)
- **Web dir:** out (for static export) or .next (for server-side)

### Step 2: Configure Next.js for Static Export
Since Capacitor needs static files, update `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Add this for static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // ... rest of config
}
```

**Note:** Static export means:
- ❌ No API routes
- ❌ No server-side rendering
- ✅ Works with Capacitor
- ✅ Can use client-side APIs (localStorage, etc.)

### Step 3: Build and Sync
```bash
# Build your Next.js app
npm run build

# Add Android platform
npx cap add android

# Sync web assets to native project
npx cap sync
```

### Step 4: Open in Android Studio
```bash
npx cap open android
```

### Step 5: Build APK in Android Studio
1. Open the project in Android Studio
2. Build → Build Bundle(s) / APK(s) → Build APK(s)
3. APK will be in: `android/app/build/outputs/apk/`

### Step 6: Configure Capacitor (Optional)
Create `capacitor.config.ts`:
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mlue.app',
  appName: 'Mlue',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
```

---

## Option 2: PWABuilder (Quick & Easy)

**Best for:** Quick conversion without code changes

### Step 1: Build Your App
```bash
npm run build
```

### Step 2: Use PWABuilder
1. Go to https://www.pwabuilder.com/
2. Enter your deployed app URL (or use localhost with ngrok)
3. Click "Build My PWA"
4. Select Android
5. Download the APK

**Limitations:**
- Requires your app to be publicly accessible
- Less customization
- No native plugin support

---

## Option 3: TWA (Trusted Web Activity)

**Best for:** Simple PWA-to-APK with minimal native code

### Step 1: Create Android Project
Use Android Studio to create a new project with TWA support.

### Step 2: Add TWA Library
Add to `build.gradle`:
```gradle
dependencies {
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
}
```

### Step 3: Configure TWA
Update `AndroidManifest.xml` to point to your web app URL.

---

## Important Considerations

### 1. API Routes & Server Features
If you use Next.js API routes or SSR:
- **Option A:** Convert to client-side only (use external APIs)
- **Option B:** Deploy backend separately and point app to it
- **Option C:** Use Capacitor HTTP plugin for API calls

### 2. Environment Variables
For Capacitor, you'll need to:
- Move sensitive keys to Capacitor config
- Use environment variables in build process
- Consider using Capacitor Preferences plugin for local storage

### 3. Native Features You Can Add
With Capacitor, you can add:
- Camera access
- File system
- Push notifications
- Biometric authentication
- Device info
- And more!

### 4. Testing
- Use Android Studio emulator
- Test on physical devices
- Check PWA features still work

---

## Recommended Workflow

1. **Start with Capacitor** (most flexible)
2. **Test static export** first:
   ```bash
   # Update next.config.mjs to add output: 'export'
   npm run build
   # Test the 'out' folder locally
   ```
3. **Fix any static export issues** (remove SSR, API routes, etc.)
4. **Add Capacitor** and sync
5. **Build APK** in Android Studio

---

## Quick Start Commands

```bash
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize (choose your settings)
npx cap init

# 3. Update next.config.mjs to add: output: 'export'

# 4. Build Next.js
npm run build

# 5. Add Android platform
npx cap add android

# 6. Sync
npx cap sync

# 7. Open in Android Studio
npx cap open android
```

---

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Make sure all dependencies are installed and compatible with static export.

### Issue: API routes not working
**Solution:** Move API logic to external service or use Capacitor HTTP plugin.

### Issue: Images not loading
**Solution:** Ensure `images.unoptimized: true` is set (you already have this).

### Issue: Build fails in Android Studio
**Solution:** 
- Check Android SDK is installed
- Update Gradle if needed
- Clean and rebuild project

---

## Next Steps After APK Creation

1. **Sign the APK** for distribution
2. **Test on multiple devices**
3. **Optimize app icon and splash screen**
4. **Add native features** as needed
5. **Publish to Google Play Store** (requires developer account)

---

## Need Help?

- Capacitor Docs: https://capacitorjs.com/docs
- PWABuilder: https://www.pwabuilder.com/
- Next.js Static Export: https://nextjs.org/docs/app/building-your-application/deploying/static-exports

