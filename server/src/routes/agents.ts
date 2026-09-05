import { Router } from 'express';
import prisma from '../db';
import { AgentOrchestrator } from '../agents/AgentOrchestrator';

const router = Router();

const getUserId = async (req: any) => {
  const headerId = req.headers['x-user-id'] as string;
  if (headerId) return headerId;
  const user = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
  return user ? user.id : '';
};

// Customer interaction with Shopping Agent
router.post('/chat', async (req, res) => {
  try {
    const userId = await getUserId(req);
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query string is required' });
    }

    const response = await AgentOrchestrator.handleCustomerChat(userId, query);
    res.json(response);
  } catch (error: any) {
    console.error('Agent chat error:', error);
    res.status(500).json({ error: error.message || 'Agent interaction failed' });
  }
});

// Personalized recommendations
router.get('/recommendations', async (req, res) => {
  try {
    const userId = await getUserId(req);
    const recommendations = await AgentOrchestrator.getPersonalizedRecommendations(userId);
    res.json(recommendations);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch recommendations' });
  }
});

// Telemetry & Execution Logs for Observability
router.get('/logs', async (req, res) => {
  try {
    const logs = await prisma.agentLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 25,
      include: {
        user: { select: { name: true, role: true } }
      }
    });

    const parsedLogs = logs.map(l => {
      let reasoningArray: string[] = [];
      try {
        if (l.reasoningChain) reasoningArray = JSON.parse(l.reasoningChain);
      } catch { /* ignore */ }
      return {
        ...l,
        reasoningSteps: reasoningArray
      };
    });

    res.json(parsedLogs);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch agent logs' });
  }
});

// Trigger campaign generation via Marketing Agent
router.post('/generate-campaign', async (req, res) => {
  try {
    const { segmentId, objective, channel, budget } = req.body;
    const campaign = await AgentOrchestrator.generateMarketingCampaign({
      segmentId,
      objective: objective || 'Drive Developer Tool Sales',
      channel: channel || 'EMAIL',
      budget: budget ? parseFloat(budget) : 20000
    });
    res.json(campaign);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate campaign' });
  }
});

// Trigger growth insight generation via Growth Agent
router.post('/generate-insight', async (req, res) => {
  try {
    const { topic } = req.body;
    const diagnostics = await AgentOrchestrator.getGrowthDiagnostics();
    res.json(diagnostics);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate insight' });
  }
});

// Submit customer feedback on AI recommendation
router.post('/feedback', async (req, res) => {
  try {
    const userId = await getUserId(req);
    const { rating, feedbackText, productId } = req.body;

    // Log feedback
    await prisma.agentLog.create({
      data: {
        agentName: 'ShoppingAgent',
        userId,
        userQuery: `Recommendation feedback: ${rating} stars`,
        outputSummary: feedbackText || 'No comments provided',
        reasoningChain: JSON.stringify([`User submitted feedback score: ${rating}/5 for product ${productId || 'general'}`]),
        executionTimeMs: 45,
        success: true
      }
    });

    res.json({ success: true, message: 'Thank you! Your feedback will train our recommendation agents.' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

export default router;
