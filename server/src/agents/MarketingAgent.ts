import prisma from '../db';
import { AgentTools } from './AgentTools';

export interface CampaignGenerationParams {
  segmentId: string;
  objective: string;
  channel: string;
  budget?: number;
}

export class MarketingAgent {
  static async generateCampaign(params: CampaignGenerationParams) {
    const { segmentId, objective, channel, budget = 20000 } = params;

    const generated = await AgentTools.generateCampaign(segmentId, objective, channel);

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
