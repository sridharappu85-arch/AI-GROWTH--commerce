import { Router } from 'express';
import prisma from '../db';
import { AgentTools } from '../agents/AgentTools';

const router = Router();

// Helper to get userId from header or fallback
const getUserId = async (req: any) => {
  const headerId = req.headers['x-user-id'] as string;
  if (headerId) return headerId;
  const user = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
  return user ? user.id : '';
};

// Get current cart
router.get('/', async (req, res) => {
  try {
    const userId = await getUserId(req);
    const cart = await AgentTools.getCart(userId);
    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const userId = await getUserId(req);
    const { productId, quantity = 1, reason } = req.body;
    const cart = await AgentTools.addToCart(userId, productId, quantity, reason);
    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to add item to cart' });
  }
});

// Update item quantity
router.patch('/item/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id } });
    } else {
      await prisma.cartItem.update({
        where: { id },
        data: { quantity }
      });
    }

    const userId = await getUserId(req);
    const cart = await AgentTools.getCart(userId);
    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update item' });
  }
});

// Remove item
router.delete('/item/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cartItem.delete({ where: { id } });

    const userId = await getUserId(req);
    const cart = await AgentTools.getCart(userId);
    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to remove item' });
  }
});

// Clear cart
router.delete('/clear', async (req, res) => {
  try {
    const userId = await getUserId(req);
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    const freshCart = await AgentTools.getCart(userId);
    res.json(freshCart);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to clear cart' });
  }
});

export default router;
