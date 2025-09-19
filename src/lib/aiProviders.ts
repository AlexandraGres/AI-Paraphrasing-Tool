import { AIProvider, GeminiResponse, OpenApiResponse } from '@/types';

export const providers: AIProvider[] = [
  {
    name: 'OpenAI',
    apiKey: process.env.OPENAI_API_KEY,
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    createPayload: (text) => ({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Paraphrase: ${text}` }],
    }),
    parseResponse: (data: unknown) => {
      const response = data as OpenApiResponse;
      return response.choices[0].message.content.trim();
    },
  },
  {
    name: 'Gemini',
    apiKey: process.env.GEMINI_API_KEY,
    apiEndpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    createPayload: (text) => ({
      contents: [
        {
          parts: [{ text: `Paraphrase: ${text}` }],
        },
      ],
    }),
    parseResponse: (data: unknown) => {
      const response = data as GeminiResponse;
      return response.candidates[0].content.parts[0].text.trim();
    },
  },
];
