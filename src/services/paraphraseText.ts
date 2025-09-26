import { ParaphraseResult } from '@/types';
import { UNKNOWN_ERROR } from '@/constants';

export async function paraphraseText(text: string): Promise<ParaphraseResult> {
  try {
    const response = await fetch('/api/paraphrase', {
      cache: 'no-store',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || UNKNOWN_ERROR);
    }

    return { success: true, data: result.paraphrasedText };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : UNKNOWN_ERROR,
    };
  }
}
