export interface AIConfig {
  endpoint: string;
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export const aiConfig: AIConfig = {
  endpoint:
    import.meta.env.VITE_AI_ENDPOINT ||
    'https://api.openai.com/v1/chat/completions',
  apiKey: import.meta.env.VITE_AI_API_KEY || '',
  model: import.meta.env.VITE_AI_MODEL || 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 1000,
};
