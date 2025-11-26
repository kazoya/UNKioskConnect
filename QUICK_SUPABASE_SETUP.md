# Quick Supabase Setup - UN KioskConnect

## ✅ Environment Variables (Already Provided)

Your Supabase credentials:
- **URL**: `https://furawqjxkmqezputamrf.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 1: Get Service Role Key (Important!)

Since we're using Firebase Auth (not Supabase Auth), we need the service role key for server-side uploads:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/furawqjxkmqezputamrf)
2. Click **Settings** → **API**
3. Find **service_role key** (⚠️ Keep this secret!)
4. Copy it - you'll need it for Vercel

## Step 2: Add to Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `unkioskconnecti`
3. Go to **Settings** → **Environment Variables**
4. Add these **three** variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://furawqjxkmqezputamrf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cmF3cWp4a21xZXpwdXRhbXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODM2MTAsImV4cCI6MjA3OTc1OTYxMH0.pEC1ZNPkl120zW3IbKcGe4uXMYGcjP0XsPYbEC7dsDY
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

⚠️ **Important**: The `SUPABASE_SERVICE_ROLE_KEY` is used server-side only and bypasses RLS policies.

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

Since we're using a server-side API route with service role key, we can use simpler policies:

### Option A: Simple Public Policies (Recommended)

1. Go to Storage → `events` bucket → **Policies** tab
2. Click **New Policy** → **For full customization**
3. Configure:
   - **Policy name**: `Public Read Access`
   - **Allowed operation**: `SELECT`
   - **Policy definition**: `true`
4. Click **Review** → **Save policy**

That's it! The server-side API route uses the service role key which bypasses RLS, so we don't need upload policies.

### Option B: If you want client-side uploads (Advanced)

If you want to allow direct client-side uploads, you'd need to set up Supabase Auth, which is more complex. The server-side approach (Option A) is recommended.

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

