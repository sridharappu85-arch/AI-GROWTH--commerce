import prisma from '../db';

export interface SearchCriteria {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  keywords?: string[];
  limit?: number;
}

export class AgentTools {
  // 1. Search Products
  static async searchProducts(criteria: SearchCriteria) {
    const { query, category, minPrice, maxPrice, brand, keywords, limit = 6 } = criteria;

    const allProducts = await prisma.product.findMany();

    const filtered = allProducts.filter((p) => {
      // Category match
      if (category && category !== 'All' && !p.category.toLowerCase().includes(category.toLowerCase())) {
        return false;
      }
      // Price bounds
      if (minPrice !== undefined && p.price < minPrice) return false;
      if (maxPrice !== undefined && p.price > maxPrice) return false;
      // Brand match
      if (brand && !p.brand.toLowerCase().includes(brand.toLowerCase())) return false;

      // Query / Keyword matching across title, description, tags, features, specs
      if (query || (keywords && keywords.length > 0)) {
        const searchText = `${p.title} ${p.description} ${p.tags} ${p.features} ${p.specs} ${p.brand}`.toLowerCase();
        
        if (query) {
          const qWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
          const matchesQuery = qWords.some(w => searchText.includes(w));
          if (!matchesQuery) return false;
        }

        if (keywords && keywords.length > 0) {
          const matchesKeyword = keywords.some(k => searchText.includes(k.toLowerCase()));
          if (!matchesKeyword) return false;
        }
      }

      return true;
    });

    // Score & Rank: inStock first, then rating
    filtered.sort((a, b) => {
      if (a.inStock && !b.inStock) return -1;
      if (!a.inStock && b.inStock) return 1;
      return b.rating - a.rating;
    });

    return filtered.slice(0, limit);
  }

  // 2. Get Product Details
  static async getProductDetails(productId: string) {
    return prisma.product.findUnique({
      where: { id: productId },
      include: {
        reviews: {
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });
  }

  // 3. Compare Products
  static async compareProducts(productIds: string[]) {
    const prods = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    if (prods.length === 0) return null;

    // Parse specs for each
    const parsed = prods.map(p => {
      let specsObj: Record<string, string> = {};
      let featuresArr: string[] = [];
      try { specsObj = JSON.parse(p.specs); } catch { /* ignore */ }
      try { featuresArr = JSON.parse(p.features); } catch { /* ignore */ }
      return {
        ...p,
        specsObj,
        featuresArr
      };
    });

    // Compile shared spec keys
    const allKeys = new Set<string>();
    parsed.forEach(p => Object.keys(p.specsObj).forEach(k => allKeys.add(k)));

    const comparisonMatrix = Array.from(allKeys).map(key => ({
      attribute: key,
      values: parsed.map(p => ({
        productId: p.id,
        title: p.title,
        value: p.specsObj[key] || 'N/A'
      }))
    }));

    return {
      products: parsed,
      comparisonMatrix,
      summary: `Compared ${parsed.length} products across ${allKeys.size} technical specifications.`
    };
  }

  // 4. Get Customer Profile & Preferences
  static async getCustomerProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { items: true }
        },
        wishlists: {
          include: { product: true }
        }
      }
    });
  }

  // 5. Get Purchase History
  static async getPurchaseHistory(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });
  }

  // 6. Get Customer Segments
  static async getCustomerSegments() {
    return prisma.customerSegment.findMany({
      orderBy: { avgAOV: 'desc' }
    });
  }

  // 7. Get Cart
  static async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: { product: true }
          }
        }
      });
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.18);
    const hasAgentItem = cart.items.some(i => i.addedByAgent);
    const discount = hasAgentItem ? Math.round(subtotal * 0.05) : 0; // 5% AI perk discount
    const total = subtotal - discount + tax;

    return {
      ...cart,
      subtotal,
      discount,
      tax,
      total,
      itemCount: cart.items.reduce((sum, i) => sum + i.quantity, 0)
    };
  }

  // 8. Add to Cart
  static async addToCart(userId: string, productId: string, quantity = 1, reason?: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      });
    }

    const existing = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + quantity,
          addedByAgent: reason ? true : existing.addedByAgent,
          agentRecommendationReason: reason || existing.agentRecommendationReason
        }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          addedByAgent: Boolean(reason),
          agentRecommendationReason: reason || null
        }
      });
    }

    return this.getCart(userId);
  }

  // 9. Prepare Checkout (Confirmation Required)
  static async prepareCheckout(userId: string, shippingAddress?: string) {
    const cart = await this.getCart(userId);

    if (cart.items.length === 0) {
      throw new Error('Cart is empty. Please add items before proceeding to checkout.');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    return {
      orderSummary: {
        itemsCount: cart.itemCount,
        subtotal: cart.subtotal,
        discount: cart.discount,
        tax: cart.tax,
        total: cart.total,
        items: cart.items.map(i => ({
          productId: i.productId,
          title: i.product.title,
          price: i.product.price,
          quantity: i.quantity,
          imageUrl: i.product.imageUrl
        }))
      },
      customerName: user?.name || 'Customer',
      shippingAddress: shippingAddress || user?.profile?.location || 'Bengaluru, India',
      paymentMethod: 'Simulated Instant Pay (No real payment)',
      requiresConfirmation: true,
      confirmationMessage: `Please review your order total of ₹${cart.total.toLocaleString('en-IN')} for ${cart.itemCount} item(s). Confirming will securely simulate order placement without real financial transactions.`
    };
  }

  // 10. Confirm & Create Order
  static async createOrder(userId: string, shippingAddress?: string, agentSummary?: string) {
    const cart = await this.getCart(userId);

    if (cart.items.length === 0) {
      throw new Error('Cannot place order: Cart is empty.');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    const orderNumber = `ORD-${Date.now().toString().slice(-7)}`;
    const hasAgentAssisted = cart.items.some(i => i.addedByAgent) || Boolean(agentSummary);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        totalAmount: cart.subtotal,
        discountAmount: cart.discount,
        taxAmount: cart.tax,
        finalAmount: cart.total,
        status: 'CONFIRMED',
        paymentMethod: 'Simulated Pay',
        shippingAddress: shippingAddress || user?.profile?.location || 'Bengaluru, India',
        isAiAssisted: hasAgentAssisted,
        agentSummary: agentSummary || 'Order placed with AI Shopping Assistant guidance.',
        items: {
          create: cart.items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.product.price,
            title: i.product.title,
            imageUrl: i.product.imageUrl
          }))
        }
      },
      include: {
        items: true
      }
    });

    // Clear cart items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return order;
  }

  // 11. Analyze Growth
  static async analyzeGrowth() {
    const orders = await prisma.order.findMany({
      include: { items: true }
    });
    const users = await prisma.user.findMany({
      where: { role: 'CUSTOMER' }
    });
    const products = await prisma.product.findMany();

    const totalRevenue = orders.reduce((sum, o) => sum + o.finalAmount, 0);
    const totalOrders = orders.length;
    const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const aiAssistedOrders = orders.filter(o => o.isAiAssisted).length;
    const aiAssistedPercent = totalOrders > 0 ? Math.round((aiAssistedOrders / totalOrders) * 100) : 0;

    return {
      totalRevenue,
      totalOrders,
      aov,
      customerCount: users.length,
      productCount: products.length,
      aiAssistedPercent,
      estimatedConversionRate: 4.8
    };
  }

  // 12. Generate Campaign
  static async generateCampaign(segmentKey: string, objective: string, channel: string) {
    const segment = await prisma.customerSegment.findFirst({
      where: {
        OR: [{ key: segmentKey }, { id: segmentKey }]
      }
    });

    const segName = segment ? segment.name : 'Target Customers';

    let headline = `Unleash Next-Gen Performance Tailored for ${segName}`;
    let copy = `Discover curated devices engineered for your workflow. Get early access privileges, priority delivery, and verified warranty today.`;
    let cta = 'Explore Curated Picks';
    let predictedConversion = 6.4;

    if (objective.toLowerCase().includes('retention') || objective.toLowerCase().includes('abandon')) {
      headline = `Complete Your Setup with an Exclusive 10% AI Privilege`;
      copy = `We noticed you left items waiting in your bag. Complete checkout today to unlock complimentary priority express shipping and our 7-day hassle-free replacement guarantee.`;
      cta = 'Resume My Order';
      predictedConversion = 9.1;
    } else if (objective.toLowerCase().includes('student') || objective.toLowerCase().includes('budget')) {
      headline = `Work & Learn Without Compromise: Top Laptops Under ₹70,000`;
      copy = `Get high-performance multitasking and all-day battery life with zero-downpayment No-Cost EMI options for students and young professionals.`;
      cta = 'Claim Student Special';
      predictedConversion = 7.8;
    }

    return {
      name: `${segName} - ${objective} (${channel})`,
      channel: channel.toUpperCase(),
      targetSegmentId: segment?.id || null,
      generatedHeadline: headline,
      generatedCopy: copy,
      cta,
      predictedConversion,
      budget: 20000,
      status: 'ACTIVE'
    };
  }
}
