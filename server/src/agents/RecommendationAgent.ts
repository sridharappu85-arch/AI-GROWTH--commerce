import prisma from '../db';

export class RecommendationAgent {
  static async getRecommendationsForUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        orders: {
          include: { items: true },
          take: 5
        },
        wishlists: {
          include: { product: true }
        }
      }
    });

    if (!user) {
      // Default to top featured
      return prisma.product.findMany({
        where: { isFeatured: true },
        take: 4
      });
    }

    let preferredCategories: string[] = [];
    try {
      if (user.profile?.preferredCategories) {
        preferredCategories = JSON.parse(user.profile.preferredCategories);
      }
    } catch { /* ignore */ }

    // Collect purchased product IDs
    const purchasedIds = new Set<string>();
    user.orders.forEach(o => o.items.forEach(i => purchasedIds.add(i.productId)));

    // Fetch candidate products
    const allProducts = await prisma.product.findMany();

    const scored = allProducts.map(prod => {
      let score = prod.rating * 10; // base score 40-50

      // Boost if in preferred categories
      if (preferredCategories.includes(prod.category)) {
        score += 25;
      }

      // Boost if matches user budget
      if (user.profile?.budgetMax && prod.price <= user.profile.budgetMax) {
        score += 15;
      }

      // Boost if featured
      if (prod.isFeatured) {
        score += 10;
      }

      // Penalize if already purchased
      if (purchasedIds.has(prod.id)) {
        score -= 40;
      }

      return {
        ...prod,
        matchScore: Math.min(99, Math.round(score)),
        affinityReason: preferredCategories.includes(prod.category)
          ? `Matches your affinity for ${prod.category}`
          : `High satisfaction rating (${prod.rating}/5.0) in tech community`
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored.slice(0, 4);
  }
}
