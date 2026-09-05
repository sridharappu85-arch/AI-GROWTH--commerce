import { Router } from 'express';
import prisma from '../db';

const router = Router();

const getUserId = async (req: any) => {
  const headerId = req.headers['x-user-id'] as string;
  if (headerId) return headerId;
  const user = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
  return user ? user.id : '';
};

// Get wishlist
router.get('/', async (req, res) => {
  try {
    const userId = await getUserId(req);
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(wishlist);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch wishlist' });
  }
});

// Toggle wishlist item
router.post('/toggle', async (req, res) => {
  try {
    const userId = await getUserId(req);
    const { productId } = req.body;

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id }
      });
      res.json({ action: 'removed', productId });
    } else {
      const added = await prisma.wishlist.create({
        data: {
          userId,
          productId
        },
        include: { product: true }
      });
      res.json({ action: 'added', item: added });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to toggle wishlist item' });
  }
});

export default router;
