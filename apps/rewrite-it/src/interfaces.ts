export interface Recipe {
  name: string;
  prompt: string;
  maxTokens?: number;
}

export const SLUGIFY_RECIPE: Recipe = {
  name: 'slugify',
  prompt:
    'Convert the following text into a URL-safe slug. Use lowercase letters, numbers, and hyphens only. Remove special characters and replace spaces with hyphens. Translate the text to English if needed. Keep it under 100 characters. Return only the slugified text with no additional explanation.',
  maxTokens: 200,
};
