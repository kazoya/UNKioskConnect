# Supabase Storage Setup Guide

This guide will help you set up Supabase Storage for image uploads in the UN KioskConnect application.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Supabase Project**: Create a new project or use existing one

## Step 1: Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Create a bucket named `events`
5. Set it as **Public bucket** (so images can be accessed without authentication)
6. Click **Create bucket**

## Step 2: Configure Storage Policies

1. In Storage → `events` bucket → **Policies**
2. Click **New Policy**
3. Create policies:

### Policy 1: Allow Public Read Access

```sql
-- Policy name: Public Read Access
-- Allowed operation: SELECT
-- Policy definition:
true
```

### Policy 2: Allow Authenticated Upload

```sql
-- Policy name: Authenticated Upload
-- Allowed operation: INSERT
-- Policy definition:
auth.role() = 'authenticated'
```

### Policy 3: Allow Authenticated Update (Optional)

```sql
-- Policy name: Authenticated Update
-- Allowed operation: UPDATE
-- Policy definition:
auth.role() = 'authenticated'
```

## Step 3: Set Environment Variables

Add these to your `.env.local` file and Vercel environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Get Your Supabase Credentials

1. Go to Supabase Dashboard → **Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 4: Update Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Add for all environments (Production, Preview, Development)
4. Redeploy your application

## Step 5: Test the Upload

1. Sign in to your application
2. Go to Admin → Events
3. Try uploading an image
4. Check that the image appears correctly

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

## Advantages of Supabase Storage

✅ **No CORS issues** - Supabase handles CORS automatically  
✅ **Better error messages** - Clear error responses  
✅ **Easier setup** - No complex security rules  
✅ **Built-in CDN** - Fast image delivery  
✅ **Public URLs** - Direct access to images  

## Troubleshooting

### Error: "Bucket not found"

**Solution**: Make sure the `events` bucket exists and is public

### Error: "new row violates row-level security policy"

**Solution**: Check that storage policies are configured correctly (Step 2)

### Error: "Invalid API key"

**Solution**: Verify environment variables are set correctly

### Images not loading

**Solution**: 
- Check bucket is set to **Public**
- Verify the URL is correct
- Check Next.js image configuration includes Supabase domain

## Security Best Practices

1. **Use RLS Policies**: Configure Row Level Security for fine-grained access
2. **File Size Limits**: Consider adding file size validation in your app
3. **File Type Validation**: Only allow image files
4. **Rate Limiting**: Consider implementing rate limiting for uploads

## Migration from Firebase Storage

If you were using Firebase Storage:
- ✅ No code changes needed (already updated)
- ✅ Just configure Supabase and add environment variables
- ✅ Images will be stored in Supabase instead of Firebase

---

**Your application is now using Supabase Storage! 🎉**

