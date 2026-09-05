import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_openai_key_here')) {
    return null;
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: apiKey.trim() });
  }
  return openaiClient;
}

export function setOpenAIKey(newKey: string) {
  process.env.OPENAI_API_KEY = newKey.trim();
  openaiClient = new OpenAI({ apiKey: newKey.trim() });
}

export class OpenAIService {
  static isAvailable(): boolean {
    return getOpenAIClient() !== null;
  }

  /**
   * Enhanced conversational reasoning using OpenAI models (e.g. gpt-4o-mini / gpt-4o)
   */
  static async generateAgentResponse(params: {
    systemPrompt: string;
    userQuery: string;
    contextJson?: string;
  }): Promise<{ reply: string; reasoning: string[] } | null> {
    const client = getOpenAIClient();
    if (!client) return null;

    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: params.systemPrompt },
          { 
            role: 'user', 
            content: `User query: "${params.userQuery}"\nContext: ${params.contextJson || '{}'}` 
          }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) return null;

      const parsed = JSON.parse(content);
      return {
        reply: parsed.reply || parsed.message || 'I have analyzed your request based on the product specifications.',
        reasoning: Array.isArray(parsed.reasoningSteps) ? parsed.reasoningSteps : ['[OpenAI Inference] Neural parsing and intent alignment completed.']
      };
    } catch (error) {
      console.warn('OpenAI API invocation failed, falling back to deterministic reasoning engine:', error);
      return null;
    }
  }

  /**
   * Marketing copy synthesis powered by OpenAI
   */
  static async generateMarketingCampaign(params: {
    segmentName: string;
    segmentCharacteristics: string[];
    objective: string;
    channel: string;
  }) {
    const client = getOpenAIClient();
    if (!client) return null;

    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert AI Growth & Marketing Director. Generate a high-converting, personalized campaign in JSON with fields: { "name": string, "headline": string, "copy": string, "cta": string, "predictedConversion": number (between 3.0 and 8.5) }.`
          },
          {
            role: 'user',
            content: `Target Segment: ${params.segmentName}\nTraits: ${params.segmentCharacteristics.join(', ')}\nObjective: ${params.objective}\nChannel: ${params.channel}`
          }
        ],
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) return null;
      return JSON.parse(content);
    } catch (err) {
      console.warn('OpenAI Marketing campaign generation error:', err);
      return null;
    }
  }
}
