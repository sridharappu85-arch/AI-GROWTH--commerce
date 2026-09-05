import prisma from '../db';
import { AgentTools } from './AgentTools';
import { OpenAIService } from './OpenAIService';

export interface CampaignGenerationParams {
  segmentId: string;
  objective: string;
  channel: string;
  budget?: number;
}

export class MarketingAgent {
  static async generateCampaign(params: CampaignGenerationParams) {
    const { segmentId, objective, channel, budget = 20000 } = params;

    let generated = await AgentTools.generateCampaign(segmentId, objective, channel);

    if (OpenAIService.isAvailable()) {
      const segment = await prisma.customerSegment.findUnique({ where: { id: segmentId } });
      if (segment) {
        const aiCopy = await OpenAIService.generateMarketingCampaign({
          segmentName: segment.name,
          segmentCharacteristics: JSON.parse(segment.characteristics || '[]'),
          objective,
          channel
        });

        if (aiCopy) {
          generated = {
            ...generated,
            name: aiCopy.name || generated.name,
            generatedHeadline: aiCopy.headline || generated.generatedHeadline,
            generatedCopy: aiCopy.copy || generated.generatedCopy,
            cta: aiCopy.cta || generated.cta,
            predictedConversion: typeof aiCopy.predictedConversion === 'number' ? aiCopy.predictedConversion : generated.predictedConversion
          };
        }
      }
    }

    const savedCampaign = await prisma.marketingCampaign.create({
      data: {
        name: generated.name,
        targetSegmentId: generated.targetSegmentId,
        channel: generated.channel,
        generatedHeadline: generated.generatedHeadline,
        generatedCopy: generated.generatedCopy,
        cta: generated.cta,
        predictedConversion: generated.predictedConversion,
        budget,
        revenueGenerated: 0,
        status: 'ACTIVE'
      }
    });

    return savedCampaign;
  }
}
