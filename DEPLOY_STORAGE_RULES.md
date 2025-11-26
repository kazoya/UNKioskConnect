# Deploy Storage Rules

## Quick Deploy

After updating the storage rules, deploy them using Firebase CLI:

```powershell
# Make sure you're logged in
firebase login

# Deploy only storage rules
firebase deploy --only storage
```

## What the Rules Do

### 1. User Private Folders (`/users/{userId}/`)
- Users can read and write files in their own folder
- Path: `users/{userId}/...`
- Only the owner (matching `auth.uid`) can access

### 2. Event Images (`/events/`)
- Anyone can read event images (public)
- Authenticated users can upload images
- File size limit: 5MB
- Only image files allowed

### 3. Admin Access
- Admins can read all files (for moderation)
- Admin check matches Firestore rules:
  - Users with `role == 'admin'` custom claim
  - Specific email addresses: `suhib.asrawi@gmail.com`, `ceo@muqasa-jo.com`

## Verify Deployment

After deploying, verify the rules:

```powershell
# View current rules
firebase firestore:rules
```

Or check in Firebase Console → Storage → Rules

## Testing

1. **User folder access**: 
   - Sign in as a user
   - Try uploading to `users/{your-uid}/test.jpg` ✅ Should work
   - Try accessing another user's folder ❌ Should fail

2. **Event images**:
   - Sign in as any user
   - Upload to `events/test.jpg` ✅ Should work
   - Anyone can view event images ✅ Should work

3. **Admin access**:
   - Sign in as admin
   - Try reading any file ✅ Should work

---

**Rules are ready to deploy! Run `firebase deploy --only storage`**

