import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI Assistant Function
 * This function acts as a helpful assistant that can answer questions and provide information
 */
export async function assistantFunction(input: {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}): Promise<{ response: string }> {
  const { message, conversationHistory = [] } = input;

  // Check for API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  // Initialize Google Generative AI
  // Using gemini-1.5-flash which is available on the free tier
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Build conversation history
  const history = conversationHistory.map((msg: { role: string; content: string }) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  // Build the chat with system instruction
  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: 'You are a helpful AI assistant for a kiosk event management system. You help users with questions about events, bookings, and general inquiries. Be friendly, concise, and helpful. If you don\'t know something, admit it politely. Keep responses clear and to the point.' }],
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

  return {
    response: text || 'I apologize, but I could not generate a response.',
  };
}
