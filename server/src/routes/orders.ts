import { Router } from 'express';
import prisma from '../db';
import { AgentTools } from '../agents/AgentTools';

const router = Router();

const getUserId = async (req: any) => {
  const headerId = req.headers['x-user-id'] as string;
  if (headerId) return headerId;
  const user = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
  return user ? user.id : '';
};

// List orders
router.get('/', async (req, res) => {
  try {
    const userId = await getUserId(req);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    let orders;
    if (user?.role === 'ADMIN') {
      // Admin sees all orders
      orders = await prisma.order.findMany({
        include: {
          items: true,
          user: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      orders = await prisma.order.findMany({
        where: { userId },
        include: { items: true },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch orders' });
  }
});

// Single order details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: { select: { name: true, email: true } }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch order' });
  }
});

// Prepare Checkout (Human-In-The-Loop Confirmation)
router.post('/prepare', async (req, res) => {
  try {
    const userId = await getUserId(req);
    const { shippingAddress } = req.body;
    const preparation = await AgentTools.prepareCheckout(userId, shippingAddress);
    res.json(preparation);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to prepare checkout' });
  }
});

// Confirm & Execute Simulated Order
router.post('/confirm', async (req, res) => {
  try {
    const userId = await getUserId(req);
    const { shippingAddress, agentSummary, confirmed } = req.body;

    if (!confirmed) {
      return res.status(400).json({ error: 'Explicit user confirmation is required to finalize order.' });
    }

    const order = await AgentTools.createOrder(userId, shippingAddress, agentSummary);

    // Record agent log for confirmed execution
    await prisma.agentLog.create({
      data: {
        agentName: 'ShoppingAgent',
        userId,
        userQuery: 'Confirm simulated checkout and place order',
        toolInvoked: 'createOrder',
        inputParams: JSON.stringify({ orderNumber: order.orderNumber, finalAmount: order.finalAmount }),
        outputSummary: `Successfully created Order #${order.orderNumber} for ₹${order.finalAmount.toLocaleString('en-IN')}. Status: CONFIRMED.`,
        reasoningChain: JSON.stringify([
          '1. Explicit User Confirmation Verified.',
          '2. Created immutable order record in database.',
          '3. Cleared active cart items.',
          '4. Dispatched confirmation notification.'
        ]),
        executionTimeMs: 95,
        success: true
      }
    });

    res.json({
      success: true,
      message: 'Simulated order placed successfully!',
      order
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to place order' });
  }
});

export default router;
