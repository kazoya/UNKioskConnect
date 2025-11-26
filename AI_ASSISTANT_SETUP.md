# AI Assistant Setup Guide

## Overview

The AI Assistant feature uses Google's Gemini AI model via the Genkit framework to provide helpful responses to user questions about events, bookings, and the system.

## Prerequisites

- Google AI Studio account
- Gemini API key

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the API key (it starts with `AIza...`)

⚠️ **Important**: Keep your API key secret and never commit it to version control!

## Step 2: Add API Key to Environment Variables

### For Local Development

1. Create or edit `.env.local` file in the project root
2. Add:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
3. Replace `your_api_key_here` with your actual API key

### For Vercel Deployment

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your API key
5. Add for all environments (Production, Preview, Development)
6. **Redeploy** your application

## Step 3: Verify Setup

1. Start your development server: `npm run dev`
2. Sign in to your application
3. Go to **Dashboard** → **AI Assistant**
4. Try asking a question like "What events are available?"
5. If you see an error about the API key, double-check your environment variables

## Features

- **Conversational AI**: Maintains conversation context
- **Event Management Help**: Answers questions about events and bookings
- **Friendly Interface**: Clean chat-like UI
- **Error Handling**: Clear error messages if API key is missing

## Troubleshooting

### "API Key Required" Error

- ✅ Check that `GEMINI_API_KEY` is set in your environment variables
- ✅ For local dev: Make sure it's in `.env.local` (not `.env`)
- ✅ For Vercel: Verify it's added in the dashboard and redeploy
- ✅ Restart your dev server after adding the key

### "Failed to get response" Error

- Check your internet connection
- Verify the API key is valid
- Check browser console for detailed error messages
- Ensure you haven't exceeded API rate limits

### Build Errors

- Make sure all dependencies are installed: `npm install`
- Check that `@genkit-ai/google-genai` is in `package.json`
- Verify TypeScript compilation: `npm run typecheck`

## API Usage

The assistant uses Google's Gemini 2.0 Flash model, which is:
- Fast and responsive
- Cost-effective
- Suitable for conversational AI

## Security Notes

- API keys are server-side only (not exposed to the browser)
- Never commit API keys to Git
- Use environment variables for all secrets
- Rotate keys if accidentally exposed

---

**After setting up the API key, the AI Assistant will be fully functional! 🎉**

