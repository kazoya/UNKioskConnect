# Vercel Deployment Troubleshooting

## Issue: Project Name Already Exists

If you see "Project 'unkioskconnect' already exists", you have a few options:

### Option 1: Use the Existing Project (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Look for a project named "unkioskconnect" or similar

2. **Connect Your GitHub Repository**
   - Click on the existing project
   - Go to Settings → Git
   - Click "Connect Git Repository"
   - Select your `kazoya/UNKioskConnect` repository
   - This will link your GitHub repo to the existing Vercel project

3. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add all 6 Firebase environment variables
   - Deploy

### Option 2: Delete and Recreate

1. **Delete the Existing Project**
   - Go to https://vercel.com/dashboard
   - Find the "unkioskconnect" project
   - Click on it → Settings → General
   - Scroll down and click "Delete Project"
   - Confirm deletion

2. **Create New Project**
   - Go to "Add New Project"
   - Import `kazoya/UNKioskConnect`
   - Use a different name like:
     - `un-kiosk-connect`
     - `unkioskconnect-v2`
     - `kiosk-connect-un`
     - Or any name you prefer

### Option 3: Use a Different Project Name

When importing, Vercel will suggest a project name. You can change it:

1. **During Import**
   - When importing, you'll see "Project Name" field
   - Change it to something unique like:
     - `un-kiosk-connect-app`
     - `skills4work-kiosk`
     - `unhcr-kiosk-connect`
     - Or any unique name

2. **After Import**
   - Go to Settings → General
   - Change "Project Name"
   - Save

## Quick Fix Steps

1. **Check Your Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   ```
   - Look for any existing projects
   - Check if "unkioskconnect" is there

2. **If Project Exists:**
   - Use it (Option 1 above)
   - Or delete it and recreate (Option 2)

3. **If No Project Exists:**
   - Try importing with a different name
   - Or clear browser cache and try again

## Still Having Issues?

- Check if you're logged into the correct Vercel account
- Try using Vercel CLI instead:
  ```bash
  npm install -g vercel
  vercel login
  cd c:\a\un
  vercel
  ```

