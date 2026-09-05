import { Router } from 'express';
import prisma from '../db';

const router = Router();

const getUserId = async (req: any) => {
  const headerId = req.headers['x-user-id'] as string;
  if (headerId) return headerId;
  const user = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
  return user ? user.id : '';
};

// Get profile & preferences
router.get('/', async (req, res) => {
  try {
    const userId = await getUserId(req);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update shopping preferences
router.put('/preferences', async (req, res) => {
  try {
    const userId = await getUserId(req);
    const { budgetMax, preferredCategories, techProficiency, preferredBrands, location, personaTag } = req.body;

    const profile = await prisma.customerProfile.upsert({
      where: { userId },
      update: {
        budgetMax: budgetMax !== undefined ? parseFloat(budgetMax) : undefined,
        preferredCategories: preferredCategories ? JSON.stringify(preferredCategories) : undefined,
        techProficiency: techProficiency || undefined,
        preferredBrands: preferredBrands ? JSON.stringify(preferredBrands) : undefined,
        location: location || undefined,
        personaTag: personaTag || undefined
      },
      create: {
        userId,
        budgetMax: budgetMax !== undefined ? parseFloat(budgetMax) : 75000,
        preferredCategories: JSON.stringify(preferredCategories || []),
        techProficiency: techProficiency || 'Intermediate',
        preferredBrands: JSON.stringify(preferredBrands || []),
        location: location || 'Bengaluru, India',
        personaTag: personaTag || 'Shopper'
      }
    });

    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update preferences' });
  }
});

export default router;
