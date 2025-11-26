# DeepSeek API Setup (Recommended - Simple & Free!)

## Why DeepSeek?

- ✅ **Free tier** with generous limits
- ✅ **Simple API** - no complicated model selection
- ✅ **Reliable** - fewer errors than Gemini
- ✅ **Fast** - quick responses
- ✅ **Easy setup** - just one API key

## Step 1: Get Your DeepSeek API Key

1. Go to [DeepSeek Platform](https://platform.deepseek.com/)
2. Sign up or log in (free account)
3. Go to **API Keys** section
4. Click **"Create API Key"**
5. Copy your API key (starts with `sk-...`)

## Step 2: Add to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name**: `DEEPSEEK_API_KEY`
   - **Value**: Your DeepSeek API key
5. Add for **Production** environment (and Preview/Development if needed)
6. **Redeploy** your project

## Step 3: Done!

That's it! The assistant will automatically use DeepSeek if the key is set.

## How It Works

- If `DEEPSEEK_API_KEY` is set → Uses DeepSeek (simple, reliable)
- If not set → Falls back to Gemini (if `GEMINI_API_KEY` is set)
- If neither is set → Shows error message

## Free Tier Limits

DeepSeek free tier typically includes:
- Generous request limits
- Fast response times
- No credit card required

Check [DeepSeek Pricing](https://platform.deepseek.com/pricing) for current limits.

## Comparison

| Feature | DeepSeek | Gemini |
|---------|----------|--------|
| Setup | ✅ Simple | ❌ Complex |
| Free Tier | ✅ Yes | ✅ Yes |
| Reliability | ✅ High | ⚠️ Variable |
| Model Selection | ✅ Automatic | ❌ Manual |
| Errors | ✅ Few | ⚠️ Many |

## Troubleshooting

### "Invalid DeepSeek API key"
- Check the key is correct in Vercel
- Make sure it starts with `sk-`
- Redeploy after adding the key

### "Rate limit exceeded"
- Wait a moment and try again
- Check your usage in DeepSeek dashboard

### Still using Gemini?
- Make sure `DEEPSEEK_API_KEY` is set in Vercel
- Redeploy after adding the key
- Check Vercel logs to see which API is being used

---

**DeepSeek is recommended for simplicity and reliability! 🚀**

