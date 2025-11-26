# Firebase Storage Setup Guide

This guide will help you configure Firebase Storage for image uploads in the UN KioskConnect application.

## Issue: CORS Error

If you're seeing CORS errors like:
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' 
from origin 'https://unkioskconnecti.vercel.app' has been blocked by CORS policy
```

This is typically caused by Firebase Storage security rules that are too restrictive or not properly configured.

## Step 1: Enable Firebase Storage

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **Get Started** if Storage is not enabled
5. Choose **Start in production mode** (we'll configure rules next)

## Step 2: Configure Security Rules

1. In Firebase Console → Storage → **Rules** tab
2. Replace the default rules with the following:

### For Development/Testing (Less Secure)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to read and write event images
    match /events/{allPaths=**} {
      allow read: if true; // Anyone can read
      allow write: if request.auth != null; // Only authenticated users can write
    }
    
    // Default: deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### For Production (More Secure)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Event images: authenticated users can upload, everyone can read
    match /events/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024 // Max 5MB
                   && request.resource.contentType.matches('image/.*');
    }
    
    // Default: deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **Publish** to save the rules

## Step 3: Verify Authentication

Make sure users are properly authenticated before uploading:

1. Check that Firebase Authentication is enabled
2. Verify users can sign in/sign up
3. Ensure the user has a valid auth token when uploading

## Step 4: Test the Upload

1. Sign in to your application
2. Go to Admin → Events
3. Try uploading an image
4. Check the browser console for any errors

## Troubleshooting

### Error: "storage/unauthorized"

**Cause**: Security rules are blocking the upload

**Solution**: 
- Check that your security rules allow authenticated writes
- Verify the user is signed in
- Check that the path matches the rule pattern (`events/*`)

### Error: CORS Policy Blocked

**Cause**: Security rules are rejecting the request before CORS headers are sent

**Solution**:
- Update security rules to allow the operation
- Ensure the user is authenticated
- Check that the file path matches allowed patterns

### Error: "storage/quota-exceeded"

**Cause**: Firebase Storage quota has been exceeded

**Solution**:
- Check your Firebase Storage usage in the console
- Upgrade your Firebase plan if needed
- Delete old/unused files

### Error: "storage/unauthenticated"

**Cause**: User is not signed in

**Solution**:
- Ensure user signs in before uploading
- Check Firebase Authentication is working
- Verify auth token is valid

## Security Best Practices

1. **Always require authentication** for write operations
2. **Validate file types** (only images)
3. **Limit file size** (e.g., 5MB max)
4. **Use specific paths** (don't allow wildcard writes)
5. **Regularly review** uploaded files
6. **Set up monitoring** for unusual activity

## Example Production Rules (Recommended)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Event images
    match /events/{eventId}/{fileName} {
      // Anyone can read event images
      allow read: if true;
      
      // Only authenticated users can upload
      // File must be an image and under 5MB
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/(jpeg|jpg|png|gif|webp)')
                   && resource == null; // Only allow new files, not overwrites
      
      // Allow updates/deletes only by admins (optional)
      allow delete: if request.auth != null 
                   && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Deny all other paths
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Testing Rules

You can test your rules in Firebase Console:

1. Go to Storage → Rules
2. Click **Rules Playground**
3. Test different scenarios:
   - Authenticated user uploading to `events/`
   - Unauthenticated user trying to upload
   - File size validation
   - File type validation

## Additional Resources

- [Firebase Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Storage Rules Reference](https://firebase.google.com/docs/rules/rules-language)
- [Common Rules Patterns](https://firebase.google.com/docs/storage/security/start)

---

**After updating rules, wait a few seconds for them to propagate before testing again.**

