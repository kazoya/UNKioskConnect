# Firebase Storage Setup via CLI

Since the Firebase Console is having issues, we'll set up Storage using Firebase CLI.

## Prerequisites

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

## Quick Setup (Windows PowerShell)

1. **Open PowerShell** in your project directory (`c:\a\un`)

2. **Run the setup script**:
   ```powershell
   .\setup-firebase-storage.ps1
   ```

   Or manually run these commands:
   ```powershell
   # Initialize Firebase Storage (if not already done)
   firebase init storage
   
   # Deploy Storage rules
   firebase deploy --only storage
   ```

## Quick Setup (Linux/Mac)

1. **Open Terminal** in your project directory

2. **Run the setup script**:
   ```bash
   chmod +x setup-firebase-storage.sh
   ./setup-firebase-storage.sh
   ```

   Or manually:
   ```bash
   # Initialize Firebase Storage (if not already done)
   firebase init storage
   
   # Deploy Storage rules
   firebase deploy --only storage
   ```

## Manual Setup Steps

### Step 1: Initialize Firebase Storage

```bash
firebase init storage
```

When prompted:
- ✅ Select your Firebase project
- ✅ Use `storage.rules` as the rules file (already created)
- ✅ Don't overwrite existing files

### Step 2: Enable Storage in Firebase Console

Even though we're using CLI, Storage still needs to be enabled:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Storage** in the left menu
4. Click **Get Started**
5. Choose **Start in production mode** (we'll use our CLI rules)
6. Select a location (choose closest to your users)

### Step 3: Deploy Storage Rules

```bash
firebase deploy --only storage
```

This will deploy the `storage.rules` file to Firebase.

### Step 4: Verify Rules

Check that rules are deployed:
```bash
firebase firestore:rules
```

Or check in Firebase Console → Storage → Rules

## Storage Rules

The `storage.rules` file contains:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Event images: authenticated users can upload, everyone can read
    match /events/{allPaths=**} {
      allow read: if true; // Anyone can read event images
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024 // Max 5MB
                   && request.resource.contentType.matches('image/.*'); // Only images
    }
    
    // Default: deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Troubleshooting

### Error: "Storage is not enabled"

**Solution**: Enable Storage in Firebase Console first (Step 2 above)

### Error: "Permission denied"

**Solution**: Make sure you're logged in:
```bash
firebase login
```

### Error: "Project not found"

**Solution**: Link your project:
```bash
firebase use --add
```

Select your project from the list.

### Error: "Rules file not found"

**Solution**: Make sure `storage.rules` exists in the project root.

## Verify Setup

After setup, test the upload in your application. The CORS error should be resolved.

If you still see CORS errors:
1. Wait 1-2 minutes for rules to propagate
2. Clear browser cache
3. Check that you're signed in
4. Verify rules in Firebase Console → Storage → Rules

## Alternative: Use Firebase Admin SDK (Server-Side)

If you prefer server-side uploads, we can create an API route that uses Firebase Admin SDK. However, this requires:
- Setting up Firebase Admin SDK
- Creating API endpoints
- More complex setup

The client-side approach (current) is simpler and works well once Storage rules are configured.

---

**After running the setup, your Storage should be configured and ready to use!**

