/**
 * AI Assistant Function
 * Uses DeepSeek API (free, simple, reliable) as the primary option
 * Falls back to Gemini if DeepSeek is not configured
 */
export async function assistantFunction(input: {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}): Promise<{ response: string }> {
  const { message, conversationHistory = [] } = input;

  // Try DeepSeek first (simpler, free, reliable)
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
  if (deepseekApiKey && deepseekApiKey.trim() !== '') {
    try {
      return await callDeepSeek(message, conversationHistory, deepseekApiKey);
    } catch (error: any) {
      console.warn('DeepSeek API failed, trying Gemini:', error.message);
      // Fall through to try Gemini
    }
  }

  // Fallback to Gemini if DeepSeek not configured
  return await callGemini(message, conversationHistory);
}

/**
 * Call DeepSeek API (simple, free, reliable)
 */
async function callDeepSeek(
  message: string,
  conversationHistory: Array<{ role: string; content: string }>,
  apiKey: string
): Promise<{ response: string }> {
  const axios = (await import('axios')).default;

  // Build messages array
  const messages = [
    {
      role: 'system',
      content: 'You are a helpful AI assistant for a kiosk event management system. You help users with questions about events, bookings, and general inquiries. Be friendly, concise, and helpful. If you don\'t know something, admit it politely. Keep responses clear and to the point.',
    },
    ...conversationHistory.map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    })),
    {
      role: 'user',
      content: message,
    },
  ];

  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    const assistantMessage = response.data.choices[0]?.message?.content;
    if (!assistantMessage) {
      throw new Error('No response from DeepSeek API');
    }

    return {
      response: assistantMessage,
    };
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Invalid DeepSeek API key');
    }
    if (error.response?.status === 429) {
      throw new Error('DeepSeek API rate limit exceeded. Please try again later.');
    }
    throw error;
  }
}

/**
 * Call Gemini API (fallback)
 */
async function callGemini(
  message: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<{ response: string }> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');

  // Check for API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Neither DEEPSEEK_API_KEY nor GEMINI_API_KEY is configured. Please set at least one in Vercel environment variables.');
  }

  // Initialize Google Generative AI
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // List of models to try (in order of preference)
  const modelsToTry = [
    'gemini-pro',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
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
      console.log(`Attempting to use Gemini model: ${modelName}`);
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: systemInstruction,
      });

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

      const result = await chat.sendMessage(message);
      const response = result.response;
      const text = response.text();

      console.log(`Successfully used Gemini model: ${modelName}`);
      
      return {
        response: text || 'I apologize, but I could not generate a response.',
      };
    } catch (error: any) {
      lastError = error;
      const errorMsg = (error.message || '').toLowerCase();
      console.warn(`Gemini model ${modelName} failed:`, error.message);
      
      if (errorMsg.includes('not available') || 
          errorMsg.includes('404') || 
          errorMsg.includes('not found') ||
          (errorMsg.includes('model') && (errorMsg.includes('not') || errorMsg.includes('invalid'))) ||
          errorMsg.includes('permission denied') ||
          errorMsg.includes('selected ai model')) {
        console.log(`Gemini model ${modelName} not available, trying next...`);
        continue;
      }
      
      if (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('rate limit')) {
        throw error;
      }
      
      continue;
    }
  }

  throw new Error(
    `Gemini models failed. Last error: ${lastError?.message || 'Unknown error'}. ` +
    `Consider using DeepSeek API instead (set DEEPSEEK_API_KEY).`
  );
}
