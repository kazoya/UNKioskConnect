# Gemini API Key Troubleshooting Guide

## Issue: "Please configure GEMINI_API_KEY" Error

If you're seeing this error even though you've set the API key, follow these steps:

## Step 1: Verify API Key in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Look for `GEMINI_API_KEY`
5. **Check:**
   - ✅ Key name is exactly `GEMINI_API_KEY` (case-sensitive)
   - ✅ Value is not empty
   - ✅ It's added for the correct environment (Production, Preview, Development)
   - ✅ No extra spaces before/after the value

## Step 2: Redeploy After Adding/Updating

**Important:** After adding or updating environment variables in Vercel, you MUST redeploy:

1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

**OR** push a new commit to trigger automatic deployment.

## Step 3: Verify API Key Format

Your Gemini API key should:
- Start with `AIza...`
- Be about 39 characters long
- Have no spaces or line breaks

## Step 4: Check Vercel Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Logs** tab
3. Look for errors mentioning `GEMINI_API_KEY`
4. Check if the error says "missing" or "empty"

## Step 5: Test API Key Locally

Create a test file to verify your API key works:

```bash
# Create test file
echo 'GEMINI_API_KEY=your_key_here' > .env.local

# Test (if you have Node.js)
node -e "console.log(process.env.GEMINI_API_KEY ? 'Key found' : 'Key missing')"
```

## Step 6: Common Issues

### Issue: Key set but still getting error
**Solution:** Redeploy your Vercel project after adding the key.

### Issue: Key works locally but not on Vercel
**Solution:** Make sure the key is set in Vercel (not just `.env.local`).

### Issue: Key was added but deployment failed
**Solution:** Check Vercel build logs for errors. The key might be invalid.

### Issue: "Quota exceeded" instead of "missing key"
**Solution:** This means the key IS working, but you've hit rate limits. Wait a minute and try again.

## Step 7: Verify API Key is Valid

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Check if your API key is still active
3. Try creating a new key if the old one might be invalid
4. Update the key in Vercel and redeploy

## Quick Checklist

- [ ] API key exists in Vercel Environment Variables
- [ ] Key name is exactly `GEMINI_API_KEY`
- [ ] Key value is not empty
- [ ] Key is set for Production environment (at minimum)
- [ ] Project has been redeployed after adding/updating the key
- [ ] API key starts with `AIza...`
- [ ] No extra spaces in the key value

## Still Not Working?

If you've checked everything above:

1. **Delete and recreate the environment variable:**
   - Remove `GEMINI_API_KEY` from Vercel
   - Add it again with a fresh value
   - Redeploy

2. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Your Project → Functions
   - Check `/api/assistant` function logs
   - Look for specific error messages

3. **Verify API Key Permissions:**
   - Make sure your API key has access to Gemini API
   - Check if there are any restrictions on the key

---

**After following these steps, the API key should work correctly!**

