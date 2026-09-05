export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  avatar?: string;
  phone?: string;
  profile?: CustomerProfile;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  budgetMax?: number;
  preferredCategories: string; // JSON string
  techProficiency: string;
  preferredBrands: string; // JSON string
  location?: string;
  personaTag?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  specs: string; // JSON
  features: string; // JSON
  tags: string; // JSON
  imageUrl: string;
  isFeatured: boolean;
  reviews?: Review[];
  recommendationRank?: number;
  aiRationale?: string;
  matchScore?: number;
  affinityReason?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  addedByAgent: boolean;
  agentRecommendationReason?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  itemCount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: { name: string; email: string };
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  finalAmount: number;
  status: 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  paymentMethod: string;
  shippingAddress: string;
  isAiAssisted: boolean;
  agentSummary?: string;
  createdAt: string;
  items: Array<{
    id: string;
    productId: string;
    title: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }>;
}

export interface CustomerSegment {
  id: string;
  name: string;
  key: string;
  description: string;
  customerCount: number;
  avgAOV: number;
  avgCLV: number;
  churnRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  characteristics: string; // JSON string
  recommendedActions: string; // JSON string
}

export interface GrowthInsight {
  id: string;
  type: 'OPPORTUNITY' | 'RISK' | 'CONVERSION' | 'MARKETING' | 'RETENTION';
  title: string;
  explanation: string;
  impactLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  recommendedAction: string;
  estimatedImpactValue: string;
  metricHighlight?: string;
  status: 'ACTIVE' | 'IMPLEMENTED' | 'DISMISSED';
  createdAt: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  targetSegmentId?: string;
  status: 'ACTIVE' | 'DRAFT' | 'COMPLETED';
  channel: 'EMAIL' | 'WHATSAPP' | 'PUSH' | 'ADS';
  generatedHeadline: string;
  generatedCopy: string;
  cta: string;
  predictedConversion: number;
  budget: number;
  revenueGenerated: number;
  createdAt: string;
}

export interface AgentLog {
  id: string;
  agentName: string;
  userQuery: string;
  toolInvoked?: string;
  inputParams?: string;
  outputSummary: string;
  reasoningSteps: string[];
  executionTimeMs?: number;
  success: boolean;
  createdAt: string;
  user?: { name: string; role: string };
}
