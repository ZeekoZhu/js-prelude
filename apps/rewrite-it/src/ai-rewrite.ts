import { Recipe } from './interfaces';
import { aiConfig } from './ai-config';

export async function aiRewrite(
  recipe: Recipe,
  rawString: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'POST',
      url: new URL('/v1/chat/completions', aiConfig.endpoint).href,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aiConfig.apiKey}`,
      },
      data: JSON.stringify({
        model: aiConfig.model,
        messages: [
          {
            role: 'system',
            content: recipe.prompt,
          },
          {
            role: 'user',
            content: rawString,
          },
        ],
        temperature: aiConfig.temperature,
        max_tokens: recipe.maxTokens ?? aiConfig.maxTokens,
      }),
      onload: (response) => {
        if (response.status >= 200 && response.status < 300) {
          try {
            const data = JSON.parse(response.responseText);
            resolve(data.choices[0].message.content);
          } catch (error) {
            reject(new Error(`Failed to parse AI response: ${error}`));
          }
        } else {
          reject(new Error(`AI request failed: ${response.statusText}`));
        }
      },
      onerror: (error) => {
        reject(new Error(`AI request failed: ${error}`));
      },
    });
  });
}
