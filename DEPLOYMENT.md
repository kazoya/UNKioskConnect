# Deployment Guide - UN KioskConnect

This guide will help you deploy the UN KioskConnect application to GitHub and Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Firebase project with Authentication and Firestore enabled

---

## Step 1: Push to GitHub

### 1.1 Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: UN KioskConnect with Arabic/English support"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it: `UNKioskConnect` (or your preferred name)
3. **Do NOT** initialize with README, .gitignore, or license (we already have these)

### 1.3 Push to GitHub

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/UNKioskConnect.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 2: Deploy to Vercel

### 2.1 Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 2.2 Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository (`UNKioskConnect`)
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - In the project settings, go to "Environment Variables"
   - Add the following variables:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```
   - Add them for all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

### 2.3 Deploy via Vercel CLI (Alternative)

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? un-kiosk-connect (or your choice)
# - Directory? ./
# - Override settings? N

# Add environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID

# Deploy to production
vercel --prod
```

---

## Step 3: Configure Firebase

### 3.1 Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domain: `your-project.vercel.app`
5. Add your custom domain if you have one

### 3.2 Firestore Rules

Ensure your Firestore security rules allow authenticated users:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Note**: Adjust these rules based on your security requirements.

---

## Step 4: Custom Domain (Optional)

### 4.1 Add Custom Domain in Vercel

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### 4.2 Update Firebase Authorized Domains

Add your custom domain to Firebase authorized domains.

---

## Step 5: Verify Deployment

1. **Check Build Logs**
   - Go to Vercel dashboard → Your project → Deployments
   - Check that the build completed successfully

2. **Test the Application**
   - Visit your Vercel URL
   - Test login/signup
   - Test language switching (Arabic/English)
   - Test RTL layout in Arabic

3. **Check Console for Errors**
   - Open browser DevTools
   - Check for any Firebase connection errors
   - Verify environment variables are loaded

---

## Troubleshooting

### Build Fails

**Error**: `Module not found` or `Cannot resolve module`
- **Solution**: Ensure all dependencies are in `package.json` and run `npm install` locally first

**Error**: `Environment variable not found`
- **Solution**: Add all Firebase environment variables in Vercel project settings

### Firebase Connection Issues

**Error**: `Firebase not initialized`
- **Solution**: 
  - Check environment variables are set correctly
  - Verify Firebase project is active
  - Check authorized domains in Firebase Console

### RTL/Arabic Not Working

**Issue**: Arabic text displays but layout is not RTL
- **Solution**: Clear browser cache, check that `I18nProvider` is wrapping the app

---

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

- **Production**: Pushes to `main` branch
- **Preview**: Pushes to other branches (creates preview URLs)

### Workflow

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
3. Vercel automatically builds and deploys

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | `AIza...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | `my-project` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `my-project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | `1:123456789:web:abc123` |

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [GitHub Actions](https://github.com/features/actions) (for CI/CD)

---

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify Firebase configuration
4. Review [RFI_COMPLIANCE.md](./RFI_COMPLIANCE.md) for feature status

---

**Last Updated**: 2024

