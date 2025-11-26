import { ai } from '../genkit';

/**
 * AI Assistant Function
 * This function acts as a helpful assistant that can answer questions and provide information
 */
export async function assistantFunction(input: {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}): Promise<{ response: string }> {
  const { message, conversationHistory = [] } = input;

  // Build conversation context
  const messages: Array<{ role: 'user' | 'model' | 'system'; content: string }> = [
    {
      role: 'system',
      content: `You are a helpful AI assistant for a kiosk event management system. 
You help users with questions about events, bookings, and general inquiries.
Be friendly, concise, and helpful. If you don't know something, admit it politely.
Keep responses clear and to the point.`,
    },
    ...conversationHistory.map((msg: { role: string; content: string }) => ({
      role: (msg.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
      content: msg.content,
    })),
    {
      role: 'user',
      content: message,
    },
  ];

  // Call Gemini model
  const model = ai.model('googleai/gemini-2.0-flash-exp');
  
  const response = await model.generate({
    messages: messages,
    config: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  });

  return {
    response: response.text || 'I apologize, but I could not generate a response.',
  };
}
