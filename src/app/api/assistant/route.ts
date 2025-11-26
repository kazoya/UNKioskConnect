import { NextRequest, NextResponse } from 'next/server';
import { assistantFunction } from '@/ai/flows/assistant-flow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Call the assistant function
    const result = await assistantFunction({
      message,
      conversationHistory,
    });

    return NextResponse.json({
      response: result.response,
    });
  } catch (error: any) {
    console.error('Assistant API error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    
    // Check if it's a missing API key error
    if (error.message?.includes('not configured') || 
        (error.message?.includes('API key') && error.message?.includes('not configured'))) {
      return NextResponse.json(
        { 
          error: 'No AI API key configured. Please set DEEPSEEK_API_KEY (recommended, free & simple) or GEMINI_API_KEY in your Vercel environment variables and redeploy.',
          code: 'MISSING_API_KEY'
        },
        { status: 500 }
      );
    }

    // Check for quota/rate limit errors
    if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('rate limit') || error.message?.includes('Too Many Requests')) {
      const retryAfter = error.message.match(/retry in ([\d.]+)s/i)?.[1];
      return NextResponse.json(
        { 
          error: 'API quota exceeded. Please wait a moment and try again. If this persists, check your Google AI Studio quota limits.',
          code: 'QUOTA_EXCEEDED',
          retryAfter: retryAfter ? Math.ceil(parseFloat(retryAfter)) : 60
        },
        { status: 429 }
      );
    }

    // Check for model availability errors (usually Gemini issues)
    if (error.message?.includes('model') && (error.message?.includes('not found') || error.message?.includes('not available')) ||
        error.message?.includes('selected AI model')) {
      return NextResponse.json(
        { 
          error: 'Gemini model not available. We recommend using DeepSeek API instead (it\'s simpler and more reliable). Set DEEPSEEK_API_KEY in Vercel environment variables. See DEEPSEEK_SETUP.md for instructions.',
          code: 'MODEL_UNAVAILABLE'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to get response from assistant' },
      { status: 500 }
    );
  }
}

