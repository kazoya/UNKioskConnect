import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI Assistant Function
 * This function acts as a helpful assistant that can answer questions and provide information
 * Uses free tier compatible Gemini models with automatic fallback
 */
export async function assistantFunction(input: {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}): Promise<{ response: string }> {
  const { message, conversationHistory = [] } = input;

  // Check for API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    console.error('GEMINI_API_KEY check failed:', {
      exists: !!process.env.GEMINI_API_KEY,
      length: process.env.GEMINI_API_KEY?.length || 0,
      startsWith: process.env.GEMINI_API_KEY?.substring(0, 5) || 'N/A',
    });
    throw new Error('GEMINI_API_KEY is not configured');
  }

  // Initialize Google Generative AI
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // List of models to try (in order of preference - all free tier compatible)
  // gemini-pro is the most widely available on free tier
  const modelsToTry = [
    'gemini-pro',             // Most reliable free tier model
    'gemini-1.5-flash',       // Fast, newer free tier model
    'gemini-1.5-pro',         // More capable, newer free tier model
  ];

  // Build conversation history
  const history = conversationHistory.map((msg: { role: string; content: string }) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  // System instruction
  const systemInstruction = 'You are a helpful AI assistant for a kiosk event management system. You help users with questions about events, bookings, and general inquiries. Be friendly, concise, and helpful. If you don\'t know something, admit it politely. Keep responses clear and to the point.';

  // Try each model until one works
  let lastError: Error | null = null;
  
  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: systemInstruction,
      });

      // Build the chat with conversation history
      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: systemInstruction }],
          },
          {
            role: 'model',
            parts: [{ text: 'I understand. I\'m ready to help with questions about events, bookings, and the kiosk management system.' }],
          },
          ...history,
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      });

      // Send message and get response
      const result = await chat.sendMessage(message);
      const response = result.response;
      const text = response.text();

      // Success! Return the response
      return {
        response: text || 'I apologize, but I could not generate a response.',
      };
    } catch (error: any) {
      lastError = error;
      console.warn(`Model ${modelName} failed:`, error.message);
      
      // If it's a model availability error, try next model
      if (error.message?.includes('not available') || 
          error.message?.includes('404') || 
          error.message?.includes('not found') ||
          error.message?.includes('Model') && error.message?.includes('not')) {
        continue; // Try next model
      }
      
      // If it's a quota/rate limit error, throw it (no point trying other models)
      if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('rate limit')) {
        throw error;
      }
      
      // For other errors, try next model
      continue;
    }
  }

  // If all models failed, throw a helpful error
  throw new Error(
    `None of the available models (${modelsToTry.join(', ')}) are accessible. ` +
    `Please check your API key permissions. Last error: ${lastError?.message || 'Unknown error'}`
  );
}
