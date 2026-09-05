import { Router } from 'express';
import prisma from '../db';

const router = Router();

// Get all demo users for easy switching
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { profile: true },
      orderBy: { role: 'asc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get current user context
router.get('/me', async (req, res) => {
  try {
    const userId = (req.headers['x-user-id'] as string) || undefined;
    
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });
    }

    // Default to first customer if none provided
    if (!user) {
      user = await prisma.user.findFirst({
        where: { role: 'CUSTOMER' },
        include: { profile: true }
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch current user' });
  }
});

export default router;
