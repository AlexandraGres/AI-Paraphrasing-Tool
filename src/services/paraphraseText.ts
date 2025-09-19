interface ParaphraseResult {
  success: boolean;
  data?: string;
  error?: string;
}

export async function paraphraseText(text: string): Promise<ParaphraseResult> {
  try {
    const response = await fetch('/api/paraphrase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'An unknown error occurred.');
    }

    return { success: true, data: result.paraphrasedText };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
