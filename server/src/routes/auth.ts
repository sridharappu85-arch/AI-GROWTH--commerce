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

// Login endpoint (supports existing user by email or persona ID)
router.post('/login', async (req, res) => {
  try {
    const { email, userId } = req.body;

    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        include: { profile: true }
      });
    }

    if (!user) {
      return res.status(404).json({ error: 'Account not found. Please select a demo persona or create an account.' });
    }

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, role = 'CUSTOMER', personaTag, budgetTier, categoryPreferences, brandPreferences } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists. Try signing in.' });
    }

    const budgetAmount = budgetTier === 'BUDGET' ? 25000 : (budgetTier === 'MODERATE' ? 65000 : 150000);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        role: role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80`,
        profile: {
          create: {
            personaTag: personaTag || 'Smart Shopper',
            budgetMax: budgetAmount,
            preferredCategories: JSON.stringify(categoryPreferences || ['Laptops & Ultrabooks', 'Audio & Acoustics']),
            preferredBrands: JSON.stringify(brandPreferences || ['Apple', 'Sony', 'Dell']),
            techProficiency: 'Intermediate',
            location: 'Bengaluru, India'
          }
        },
        carts: {
          create: {}
        }
      },
      include: { profile: true }
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

export default router;
