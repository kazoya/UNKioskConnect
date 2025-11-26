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
    
    // Check if it's a missing API key error
    if (error.message?.includes('API key') || error.message?.includes('GEMINI') || error.message?.includes('API_KEY')) {
      return NextResponse.json(
        { 
          error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in your environment variables.',
          code: 'MISSING_API_KEY'
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

