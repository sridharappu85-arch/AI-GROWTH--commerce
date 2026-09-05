import { Router } from 'express';
import prisma from '../db';

const router = Router();

// List products with filtering
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, brand, sort } = req.query;

    const where: any = {};

    if (category && category !== 'All') {
      where.category = String(category);
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(String(minPrice));
      if (maxPrice) where.price.lte = parseFloat(String(maxPrice));
    }

    if (brand && brand !== 'All') {
      where.brand = String(brand);
    }

    if (search) {
      const q = String(search).toLowerCase();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { brand: { contains: q } }
      ];
    }

    let orderBy: any = { isFeatured: 'desc' };
    if (sort === 'price-low') orderBy = { price: 'asc' };
    else if (sort === 'price-high') orderBy = { price: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };
    else if (sort === 'reviews') orderBy = { reviewCount: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Categories summary with counts
router.get('/categories', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      select: { category: true }
    });

    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    const result = Object.entries(counts).map(([name, count]) => ({
      name,
      count
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Single product details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;
