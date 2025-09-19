export interface ParaphraseResult {
  success: boolean;
  data?: string;
  error?: string;
}

export interface AIProvider {
  name: string;
  apiKey: string | undefined;
  apiEndpoint: string;
  createPayload: (text: string) => object;
  parseResponse: (data: unknown) => string;
}

export interface OpenApiResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}
