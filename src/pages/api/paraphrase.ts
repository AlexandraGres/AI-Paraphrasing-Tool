import { NextApiRequest, NextApiResponse } from 'next';
import { REQUEST_TIMEOUT, UNKNOWN_ERROR } from '@/constants';

import { AIProvider } from '@/types';
import { providers } from '@/lib/aiProviders';

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

    res.setHeader('Cache-Control', 'no-store, max-age=0');

    return res.status(200).json({ paraphrasedText: result });
  } catch (error) {
    console.error(
      `Primary provider failed: ${
        error instanceof Error ? error.message : UNKNOWN_ERROR
      }. Triggering fallback providers...`
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

      res.setHeader('Cache-Control', 'no-store, max-age=0');

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
