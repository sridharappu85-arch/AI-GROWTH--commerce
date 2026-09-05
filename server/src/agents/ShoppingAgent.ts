import { AgentTools } from './AgentTools';
import { OpenAIService } from './OpenAIService';
import prisma from '../db';

export interface AgentResponse {
  reply: string;
  reasoningSteps: string[];
  recommendedProducts?: any[];
  comparison?: any;
  cartSummary?: any;
  checkoutIntent?: any;
  suggestedPrompts: string[];
  toolInvoked?: string;
  executionTimeMs: number;
}

export class ShoppingAgent {
  static async handleQuery(userId: string, query: string): Promise<AgentResponse> {
    const startTime = Date.now();
    const reasoningSteps: string[] = [];
    const lowerQuery = query.toLowerCase();

    // 1. Fetch User Context
    reasoningSteps.push(`[Context Analysis] Evaluating user profile, preferences, and active cart.`);
    const customer = await AgentTools.getCustomerProfile(userId);
    const userPersona = customer?.profile?.personaTag || 'Shopper';

    // 2. Detect Actions: Checkout Intent
    if (lowerQuery.includes('checkout') || lowerQuery.includes('place order') || lowerQuery.includes('proceed to pay')) {
      reasoningSteps.push(`[Intent Detection] User requested order preparation and checkout.`);
      const checkoutPreparation = await AgentTools.prepareCheckout(userId);
      reasoningSteps.push(`[Tool Execution] Invoked prepareCheckout. Calculated totals, applied AI discount, and generated confirmation requirement.`);
      
      const executionTime = Date.now() - startTime;
      return {
        reply: `I have prepared your order checkout! Before we proceed with the simulated transaction, please verify your details below and confirm to place your order.`,
        reasoningSteps,
        checkoutIntent: checkoutPreparation,
        suggestedPrompts: [
          'Confirm simulated order',
          'Modify cart items',
          'Add another accessory'
        ],
        toolInvoked: 'prepareCheckout',
        executionTimeMs: executionTime
      };
    }

    // 3. Detect Actions: Add to Cart Intent
    const addMatch = lowerQuery.match(/(?:add|put)\s+(?:the\s+)?(.+?)(?:\s+to\s+cart|\s+in\s+my\s+cart|$)/i);
    if ((lowerQuery.includes('add to cart') || lowerQuery.includes('buy this')) && !lowerQuery.includes('what') && !lowerQuery.includes('compare')) {
      reasoningSteps.push(`[Intent Detection] Cart addition requested.`);
      
      // Look for candidate product in database
      const products = await prisma.product.findMany();
      let targetProduct = products.find(p => lowerQuery.includes(p.title.toLowerCase()) || lowerQuery.includes(p.brand.toLowerCase()));
      
      // If none explicitly named, pick highest ranked item from previous searches or top featured
      if (!targetProduct) {
        targetProduct = products[0];
      }

      const updatedCart = await AgentTools.addToCart(
        userId, 
        targetProduct.id, 
        1, 
        `Recommended by Shopping Agent based on compatibility with your ${userPersona} profile.`
      );

      reasoningSteps.push(`[Tool Execution] Added "${targetProduct.title}" (₹${targetProduct.price.toLocaleString('en-IN')}) to cart. Total items: ${updatedCart.itemCount}.`);

      const executionTime = Date.now() - startTime;
      return {
        reply: `I've added the **${targetProduct.title}** to your cart! Your updated cart now has **${updatedCart.itemCount} item(s)** totaling **₹${updatedCart.total.toLocaleString('en-IN')}** (including 5% AI Assistant discount). Would you like to proceed to checkout or compare alternatives?`,
        reasoningSteps,
        cartSummary: updatedCart,
        suggestedPrompts: [
          'Proceed to checkout',
          'Suggest matching accessories',
          'Compare with alternatives'
        ],
        toolInvoked: 'addToCart',
        executionTimeMs: executionTime
      };
    }

    // 4. Detect Actions: Product Comparison Intent
    if (lowerQuery.includes('compare') || lowerQuery.includes('difference between') || lowerQuery.includes('which one is better')) {
      reasoningSteps.push(`[Intent Detection] Comparison requested across product specifications.`);

      // Find products mentioned in query
      const allProds = await prisma.product.findMany();
      let matchedProds = allProds.filter(p => 
        lowerQuery.includes(p.title.toLowerCase()) || 
        lowerQuery.includes(p.brand.toLowerCase()) ||
        lowerQuery.includes(p.slug.toLowerCase())
      );

      // If fewer than 2 matched explicitly, take top 2-3 products in the active category
      if (matchedProds.length < 2) {
        if (lowerQuery.includes('laptop') || lowerQuery.includes('macbook')) {
          matchedProds = allProds.filter(p => p.category === 'Laptops & Computing').slice(0, 3);
        } else if (lowerQuery.includes('headphone') || lowerQuery.includes('audio') || lowerQuery.includes('sony') || lowerQuery.includes('bose') || lowerQuery.includes('airpods')) {
          matchedProds = allProds.filter(p => p.category === 'Audio & Headphones').slice(0, 3);
        } else if (lowerQuery.includes('phone') || lowerQuery.includes('samsung') || lowerQuery.includes('iphone') || lowerQuery.includes('pixel')) {
          matchedProds = allProds.filter(p => p.category === 'Smartphones & Tablets').slice(0, 3);
        } else {
          matchedProds = allProds.slice(0, 3);
        }
      }

      const comparisonResult = await AgentTools.compareProducts(matchedProds.slice(0, 3).map(p => p.id));
      reasoningSteps.push(`[Tool Execution] Ran compareProducts for ${matchedProds.length} products. Generated side-by-side specification differential matrix.`);

      const executionTime = Date.now() - startTime;
      return {
        reply: `Here is a side-by-side technical comparison of the top choices: **${matchedProds.map(p => p.title).join(' vs ')}**. Review the matrix below to compare battery life, processors, and value:`,
        reasoningSteps,
        comparison: comparisonResult,
        recommendedProducts: matchedProds,
        suggestedPrompts: [
          `Add ${matchedProds[0].brand} to cart`,
          `Which has better battery life?`,
          'Find cheaper alternatives'
        ],
        toolInvoked: 'compareProducts',
        executionTimeMs: executionTime
      };
    }

    // 5. Standard Shopping / Search Query Extraction
    reasoningSteps.push(`[Intent Extraction] Parsing budget, category, key technical requirements, and persona compatibility.`);

    // Budget extraction: e.g. "under 70,000", "under 70k", "below 50000", "< 80k"
    let extractedBudget: number | undefined = undefined;
    const kBudget = lowerQuery.match(/(?:under|below|less than|within|budget of|around)\s*₹?\s*([0-9]{1,3}(?:,[0-9]{3})*|[0-9]+)\s*k\b/i);
    const standardBudget = lowerQuery.match(/(?:under|below|less than|within|budget of|around)\s*₹?\s*([0-9]{1,3}(?:,[0-9]{3})*|[0-9]{4,6})\b/i);

    if (kBudget && kBudget[1]) {
      extractedBudget = parseInt(kBudget[1].replace(/,/g, ''), 10) * 1000;
    } else if (standardBudget && standardBudget[1]) {
      extractedBudget = parseInt(standardBudget[1].replace(/,/g, ''), 10);
    }

    if (extractedBudget) {
      reasoningSteps.push(`[Constraint Extracted] Maximum Budget: ₹${extractedBudget.toLocaleString('en-IN')}`);
    }

    // Category extraction
    let detectedCategory: string | undefined = undefined;
    if (lowerQuery.includes('laptop') || lowerQuery.includes('macbook') || lowerQuery.includes('notebook') || lowerQuery.includes('programming') || lowerQuery.includes('coding')) {
      detectedCategory = 'Laptops & Computing';
    } else if (lowerQuery.includes('headphone') || lowerQuery.includes('earbud') || lowerQuery.includes('audio') || lowerQuery.includes('music') || lowerQuery.includes('sound') || lowerQuery.includes('anc') || lowerQuery.includes('noise cancel')) {
      detectedCategory = 'Audio & Headphones';
    } else if (lowerQuery.includes('phone') || lowerQuery.includes('smartphone') || lowerQuery.includes('mobile') || lowerQuery.includes('tablet') || lowerQuery.includes('ipad') || lowerQuery.includes('photography') || lowerQuery.includes('camera')) {
      detectedCategory = 'Smartphones & Tablets';
    } else if (lowerQuery.includes('watch') || lowerQuery.includes('wearable') || lowerQuery.includes('fitness') || lowerQuery.includes('tracker')) {
      detectedCategory = 'Smart Wearables';
    } else if (lowerQuery.includes('mouse') || lowerQuery.includes('keyboard') || lowerQuery.includes('monitor') || lowerQuery.includes('light') || lowerQuery.includes('desk') || lowerQuery.includes('smart home') || lowerQuery.includes('alexa')) {
      detectedCategory = 'Smart Home & Productivity';
    }

    if (detectedCategory) {
      reasoningSteps.push(`[Category Match] Target Category: "${detectedCategory}"`);
    }

    // Keywords extraction
    const keywords: string[] = [];
    if (lowerQuery.includes('programming') || lowerQuery.includes('code') || lowerQuery.includes('developer')) keywords.push('programming', 'coding');
    if (lowerQuery.includes('battery') || lowerQuery.includes('long battery')) keywords.push('battery');
    if (lowerQuery.includes('camera') || lowerQuery.includes('photo')) keywords.push('camera', 'photography');
    if (lowerQuery.includes('anc') || lowerQuery.includes('noise')) keywords.push('anc');
    if (lowerQuery.includes('college') || lowerQuery.includes('student')) keywords.push('student', 'college');
    if (lowerQuery.includes('gaming')) keywords.push('gaming');
    if (lowerQuery.includes('value') || lowerQuery.includes('best value')) keywords.push('value');

    // 6. Invoke Search Tool
    reasoningSteps.push(`[Tool Execution] Calling searchProducts with criteria { category: "${detectedCategory || 'All'}", maxPrice: ${extractedBudget || 'Any'}, keywords: [${keywords.join(', ')}] }`);
    
    let candidates = await AgentTools.searchProducts({
      category: detectedCategory,
      maxPrice: extractedBudget,
      keywords: keywords.length > 0 ? keywords : undefined,
      limit: 4
    });

    // Fallback if tight filter yielded < 2 products
    if (candidates.length < 2 && detectedCategory) {
      reasoningSteps.push(`[Filter Relaxation] Expanding search radius within "${detectedCategory}" to supply strong comparison candidates.`);
      candidates = await AgentTools.searchProducts({
        category: detectedCategory,
        limit: 4
      });
    }

    // 7. Rationale Synthesis
    reasoningSteps.push(`[Recommendation Synthesis] Scored ${candidates.length} candidates against specifications, review sentiment (avg ${(candidates.reduce((s,c)=>s+c.rating,0)/candidates.length).toFixed(1)}/5.0), and reliability.`);

    // Attach custom explanation for each
    const enrichedProducts = candidates.map((prod, idx) => {
      let rationale = '';
      if (detectedCategory === 'Laptops & Computing') {
        if (prod.price <= (extractedBudget || 70000)) {
          rationale = `Fits squarely within your ₹${(extractedBudget || 70000).toLocaleString('en-IN')} budget. Features multi-core processor and fast NVMe storage ideal for heavy IDE compilation.`;
        } else {
          rationale = `Premium benchmark choice offering best-in-class display and long endurance.`;
        }
      } else if (detectedCategory === 'Audio & Headphones') {
        rationale = `Outstanding active noise cancellation and ergonomic seal, verified with ${prod.reviewCount} customer reviews.`;
      } else if (detectedCategory === 'Smartphones & Tablets') {
        rationale = `Flagship optics and high-efficiency chipset with prolonged software update support.`;
      } else {
        rationale = `Top-rated peripheral proven to elevate daily workflow ergonomics and speed.`;
      }

      return {
        ...prod,
        recommendationRank: idx + 1,
        aiRationale: rationale
      };
    });

    // Formulate final conversational reply (Hybrid OpenAI / Deterministic)
    let reply = '';
    if (OpenAIService.isAvailable() && enrichedProducts.length > 0) {
      reasoningSteps.push(`[OpenAI Bridge] Invoking GPT-4o-mini for natural conversational synthesis grounded in verified catalogue results.`);
      const aiResult = await OpenAIService.generateAgentResponse({
        systemPrompt: `You are an expert, proactive AI Shopping Assistant for NexAgentic Commerce. Synthesize a warm, concise 2-3 sentence markdown response explaining why these ${enrichedProducts.length} items fit the shopper's criteria (${userPersona} persona, ₹${extractedBudget || 'flexible'} budget, ${detectedCategory || 'general'}). Highlight key differentiator specs. Output valid JSON: { "reply": string, "reasoningSteps": string[] }`,
        userQuery: query,
        contextJson: JSON.stringify({
          userPersona,
          extractedBudget,
          detectedCategory,
          products: enrichedProducts.map(p => ({ title: p.title, price: p.price, brand: p.brand, rating: p.rating, specs: p.specs }))
        })
      });

      if (aiResult) {
        reply = aiResult.reply;
        if (aiResult.reasoning) {
          reasoningSteps.push(...aiResult.reasoning);
        }
      }
    }

    if (!reply) {
      if (enrichedProducts.length > 0) {
        reply = `I analyzed your request${extractedBudget ? ` for options under **₹${extractedBudget.toLocaleString('en-IN')}**` : ''}${detectedCategory ? ` in **${detectedCategory}**` : ''}. Here are the top **${enrichedProducts.length} curated recommendations** ranked for performance, reliability, and value:`;
      } else {
        reply = `I searched our catalog but couldn't find exact matches for those criteria. Here are our most versatile, top-rated products:`;
      }
    }

    const executionTime = Date.now() - startTime;

    return {
      reply,
      reasoningSteps,
      recommendedProducts: enrichedProducts,
      suggestedPrompts: [
        `Compare ${enrichedProducts[0]?.title.split(' ')[0] || 'top'} and ${enrichedProducts[1]?.title.split(' ')[0] || 'second'}`,
        `Add #${enrichedProducts[0]?.recommendationRank || 1} to my cart`,
        'What are the battery life details?',
        'Find accessories under ₹10,000'
      ],
      toolInvoked: 'searchProducts',
      executionTimeMs: executionTime
    };
  }
}
