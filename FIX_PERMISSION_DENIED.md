# Fix "Permission Denied" Error - Supabase Storage

## Quick Fix: Configure Storage Policies

The "permission denied" error means the storage bucket needs proper policies. Here's how to fix it:

## Option 1: Simple Public Policies (Recommended)

Since we're using a server-side API route, we can make the bucket fully accessible:

### Step 1: Go to Storage Policies

1. Go to: https://supabase.com/dashboard/project/furawqjxkmqezputamrf/storage/buckets
2. Click on the **"events"** bucket
3. Click the **"Policies"** tab

### Step 2: Create Public Read Policy

1. Click **"New Policy"**
2. Select **"For full customization"**
3. Configure:
   - **Policy name**: `Public Read Access`
   - **Allowed operation**: `SELECT` (Read)
   - **Policy definition**:
   ```sql
   true
   ```
4. Click **Review** → **Save policy**

### Step 3: Create Public Upload Policy (for service role)

1. Click **"New Policy"** again
2. Select **"For full customization"**
3. Configure:
   - **Policy name**: `Public Upload Access`
   - **Allowed operation**: `INSERT` (Upload)
   - **Policy definition**:
   ```sql
   true
   ```
4. Click **Review** → **Save policy**

### Step 4: Create Update Policy (Optional)

1. Click **"New Policy"**
2. Configure:
   - **Policy name**: `Public Update Access`
   - **Allowed operation**: `UPDATE`
   - **Policy definition**:
   ```sql
   true
   ```
3. Click **Review** → **Save policy**

## Option 2: Verify Service Role Key

If you're still getting errors, check:

1. **In Vercel**:
   - Go to Settings → Environment Variables
   - Verify `SUPABASE_SERVICE_ROLE_KEY` is set
   - Make sure it's the **service_role** key (not anon key)

2. **Get Service Role Key**:
   - Go to: https://supabase.com/dashboard/project/furawqjxkmqezputamrf/settings/api
   - Find **"service_role"** key (⚠️ Secret!)
   - Copy it
   - Add to Vercel as `SUPABASE_SERVICE_ROLE_KEY`

3. **Redeploy** after adding/updating the key

## Option 3: Check Bucket Settings

1. Go to Storage → **events** bucket
2. Make sure:
   - ✅ **Public bucket** is enabled (toggle ON)
   - ✅ Bucket name is exactly `events` (lowercase)

## Quick Test

After setting up policies:

1. Wait 10-20 seconds for changes to propagate
2. Try uploading an image again
3. Check browser console for any errors

## Alternative: Disable RLS Temporarily (Not Recommended for Production)

If you need a quick test, you can temporarily disable RLS:

1. Go to Storage → **events** bucket → **Policies**
2. You should see policies listed
3. Make sure at least one policy allows `INSERT` operation

---

**After creating the policies, the permission error should be resolved!**

