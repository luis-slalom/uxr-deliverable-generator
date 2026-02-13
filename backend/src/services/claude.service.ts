import Anthropic from '@anthropic-ai/sdk';
import { PromptsUtil } from '../utils/prompts.util.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type DeliverableType = 'persona' | 'journey' | 'blueprint';

export class ClaudeService {
  /**
   * Generate a deliverable based on type and research context
   */
  static async generateDeliverable(
    deliverableType: DeliverableType,
    researchContext: string,
    userContext: string = ''
  ): Promise<string> {
    try {
      // Select appropriate prompt based on deliverable type
      const prompt = this.getPromptForType(deliverableType, researchContext, userContext);

      // Call Claude API
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      // Extract text from response
      const content = message.content[0];
      if (!content) {
        throw new Error('No content in Claude API response');
      }
      if (content.type === 'text') {
        return content.text;
      }

      throw new Error('Unexpected response format from Claude API');
    } catch (error) {
      console.error('Error generating deliverable:', error);
      if (error instanceof Anthropic.APIError) {
        throw new Error(`Claude API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get the appropriate prompt for the deliverable type
   */
  private static getPromptForType(
    deliverableType: DeliverableType,
    researchContext: string,
    userContext: string
  ): string {
    switch (deliverableType) {
      case 'persona':
        return PromptsUtil.getUserPersonaPrompt(researchContext, userContext);
      case 'journey':
        return PromptsUtil.getJourneyMapPrompt(researchContext, userContext);
      case 'blueprint':
        return PromptsUtil.getServiceBlueprintPrompt(researchContext, userContext);
      default:
        throw new Error(`Unknown deliverable type: ${deliverableType}`);
    }
  }

  /**
   * Validate API key is configured
   */
  static validateApiKey(): boolean {
    return !!process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_api_key_here';
  }
}
