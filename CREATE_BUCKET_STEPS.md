# Create Supabase Storage Bucket - Step by Step

## Quick Steps to Create "events" Bucket

### Step 1: Go to Supabase Dashboard

1. Open: https://supabase.com/dashboard/project/furawqjxkmqezputamrf
2. Click **Storage** in the left sidebar

### Step 2: Create New Bucket

1. Click the **"New bucket"** button (usually at the top right)
2. A dialog will appear

### Step 3: Configure Bucket Settings

Fill in the form:

- **Name**: `events` (⚠️ Must be exactly "events" - case sensitive)
- **Public bucket**: ✅ **Toggle ON** (This is important!)
- **File size limit**: `5` MB (or leave default)
- **Allowed MIME types**: `image/*` (optional, but recommended)

### Step 4: Create

Click **"Create bucket"** or **"Save"**

### Step 5: Verify

After creating, you should see:
- ✅ Bucket named "events" in the Storage list
- ✅ Status showing it's public
- ✅ You can click on it to see details

## Visual Guide

```
Supabase Dashboard
├── Storage (click here)
    ├── [New bucket] button (top right)
    └── Bucket creation form:
        ├── Name: events
        ├── Public bucket: ✅ ON
        ├── File size limit: 5 MB
        └── Allowed MIME types: image/*
```

## Troubleshooting

### "Bucket name already exists"
- The bucket might already exist
- Check the Storage list
- If it exists but isn't public, click on it and toggle "Public bucket" ON

### Can't find "New bucket" button
- Make sure you're in the Storage section
- Check if you have the right permissions
- Try refreshing the page

### Bucket created but still getting error
1. Make sure bucket name is exactly `events` (lowercase, no spaces)
2. Verify it's set to **Public**
3. Wait 10-20 seconds for changes to propagate
4. Try uploading again

## After Creating the Bucket

Once the bucket is created:
1. ✅ The error should disappear
2. ✅ You can upload images
3. ✅ Images will be accessible via public URLs

---

**The bucket name must be exactly "events" (lowercase) for the code to work!**

