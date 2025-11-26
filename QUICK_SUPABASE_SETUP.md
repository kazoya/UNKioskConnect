# Quick Supabase Setup - UN KioskConnect

## ✅ Environment Variables (Already Provided)

Your Supabase credentials:
- **URL**: `https://furawqjxkmqezputamrf.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 1: Add to Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `unkioskconnecti`
3. Go to **Settings** → **Environment Variables**
4. Add these two variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://furawqjxkmqezputamrf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cmF3cWp4a21xZXpwdXRhbXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODM2MTAsImV4cCI6MjA3OTc1OTYxMH0.pEC1ZNPkl120zW3IbKcGe4uXMYGcjP0XsPYbEC7dsDY
```

5. Add them for **all environments** (Production, Preview, Development)
6. **Redeploy** your application

## Step 2: Create Storage Bucket

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/furawqjxkmqezputamrf)
2. Click **Storage** in the left sidebar
3. Click **New bucket**
4. Configure:
   - **Name**: `events`
   - **Public bucket**: ✅ **Enable** (toggle ON)
   - **File size limit**: 5 MB (or leave default)
   - **Allowed MIME types**: `image/*` (optional, for extra security)
5. Click **Create bucket**

## Step 3: Configure Storage Policies

After creating the bucket, set up policies:

### Policy 1: Public Read Access

1. Go to Storage → `events` bucket → **Policies** tab
2. Click **New Policy**
3. Select **For full customization**
4. Configure:
   - **Policy name**: `Public Read Access`
   - **Allowed operation**: `SELECT`
   - **Policy definition**:
   ```sql
   true
   ```
5. Click **Review** → **Save policy**

### Policy 2: Authenticated Upload

1. Click **New Policy** again
2. Select **For full customization**
3. Configure:
   - **Policy name**: `Authenticated Upload`
   - **Allowed operation**: `INSERT`
   - **Policy definition**:
   ```sql
   auth.role() = 'authenticated'
   ```
4. Click **Review** → **Save policy**

### Policy 3: Authenticated Update (Optional)

1. Click **New Policy**
2. Configure:
   - **Policy name**: `Authenticated Update`
   - **Allowed operation**: `UPDATE`
   - **Policy definition**:
   ```sql
   auth.role() = 'authenticated'
   ```
3. Click **Review** → **Save policy**

## Step 4: Test the Upload

1. **Redeploy** your Vercel app (after adding env vars)
2. Sign in to your application
3. Go to **Admin** → **Events**
4. Click **Create Event**
5. Try uploading an image
6. ✅ Should work without CORS errors!

## Troubleshooting

### Images not uploading?

- ✅ Check bucket exists and is **Public**
- ✅ Verify policies are created
- ✅ Check environment variables in Vercel
- ✅ Make sure you're signed in

### Still seeing errors?

- Check browser console for specific error messages
- Verify Supabase project is active
- Check bucket name is exactly `events` (case-sensitive)

## Storage Structure

Images will be stored at:
```
events/
  └── {eventId}_{timestamp}_{filename}
```

Example:
```
events/new_1764185165827_WhatsApp_Image_2025-11-13_at_12.39.31_PM.jpeg
```

## Security Notes

- ✅ Bucket is public (anyone can view images)
- ✅ Only authenticated users can upload
- ✅ File size limit: 5MB
- ✅ Only image files allowed

---

**After completing these steps, image uploads should work perfectly! 🎉**

