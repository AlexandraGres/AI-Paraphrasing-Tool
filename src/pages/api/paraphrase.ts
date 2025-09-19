import { NextApiRequest, NextApiResponse } from 'next';

import { REQUEST_TIMEOUT } from '@/constants';

interface AIProvider {
  name: string;
  apiKey: string | undefined;
  apiEndpoint: string;
  createPayload: (text: string) => object;
  parseResponse: (data: any) => string;
}

const providers: AIProvider[] = [
  {
    name: 'OpenAI',
    apiKey: process.env.OPENAI_API_KEY,
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    createPayload: (text) => ({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Paraphrase: ${text}` }],
    }),
    parseResponse: (data) => data.choices[0].message.content.trim(),
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
    parseResponse: (data) => data.candidates[0].content.parts[0].text.trim(),
  },
];

async function makeRequest(
  provider: AIProvider,
  text: string
): Promise<string> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };

  if (provider.name !== 'Gemini') {
    headers['Authorization'] = `Bearer ${provider.apiKey}`;
  }

  const response = await fetch(provider.apiEndpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(provider.createPayload(text)),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`[${provider.name}] API request failed: ${errorText}`);
  }

  const data = await response.json();
  return provider.parseResponse(data);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { text } = req.body;

  const primaryProvider = providers.find(
    (p) => p.name === 'OpenAI' && p.apiKey
  );
  const fallbackProviders = providers.filter(
    (p) => p.name !== 'OpenAI' && p.apiKey
  );

  if (!primaryProvider) {
    return res
      .status(500)
      .json({ error: 'Primary AI provider (OpenAI) is not configured.' });
  }

  try {
    const openAiPromise = makeRequest(primaryProvider, text);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error('OpenAI request timed out')),
        REQUEST_TIMEOUT
      )
    );

    console.log('Attempting primary provider: OpenAI...');
    const result = await Promise.race([openAiPromise, timeoutPromise]);

    return res.status(200).json({ paraphrasedText: result });
  } catch (error: any) {
    console.error(
      `Primary provider failed: ${error.message}. Triggering fallback providers...`
    );

    if (fallbackProviders.length === 0) {
      return res.status(503).json({
        error:
          'Primary provider failed and no fallback providers are configured.',
      });
    }

    try {
      const fallbackPromises = fallbackProviders.map((provider) =>
        makeRequest(provider, text)
      );

      const firstSuccess = await Promise.any(fallbackPromises);

      return res.status(200).json({ paraphrasedText: firstSuccess });
    } catch (fallbackError) {
      console.error(
        'All fallback providers failed.',
        (fallbackError as AggregateError).errors
      );
      return res
        .status(503)
        .json({ error: 'All AI services are currently unavailable.' });
    }
  }
}
