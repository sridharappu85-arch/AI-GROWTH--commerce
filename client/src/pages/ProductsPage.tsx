import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles
} from 'lucide-react';
import type { Product } from '../types';
import { apiRequest, formatINR } from '../utils/api';
import { ProductCard } from '../components/ProductCard';
import { ComparisonModal } from '../components/ComparisonModal';
import { useUser } from '../contexts/UserContext';

export const ProductsPage: React.FC = () => {
  const { currentUser } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [sortBy, setSortBy] = useState('featured');

  // Comparison modal
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [selectedCompareProds, setSelectedCompareProds] = useState<Product[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchInit = async () => {
      try {
        setLoading(true);
        const [cats, prods, recs] = await Promise.all([
          apiRequest('/products/categories'),
          apiRequest('/products'),
          apiRequest('/agents/recommendations')
        ]);
        setCategories(cats);
        setProducts(prods);
        setRecommendations(recs);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInit();
  }, [currentUser]);

  // Apply filters
  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;
    if (p.price > maxPrice) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = p.title.toLowerCase().includes(q) || 
                    p.brand.toLowerCase().includes(q) || 
                    p.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Sorting
  filteredProducts.sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const allBrands = Array.from(new Set(products.map(p => p.brand)));

  const handleCompare = (product: Product) => {
    if (!selectedCompareProds.some(p => p.id === product.id)) {
      if (selectedCompareProds.length >= 3) {
        setSelectedCompareProds([selectedCompareProds[1], selectedCompareProds[2], product]);
      } else {
        setSelectedCompareProds([...selectedCompareProds, product]);
      }
    }
    setComparisonModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header with title and active persona context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Curated Hardware & Technology Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Over 30+ precision devices seeded in Indian Rupees (₹) with verified technical specs
          </p>
        </div>

        {currentUser && (
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl glass-panel border border-indigo-500/30 text-xs">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <div>
              <span className="text-slate-400">Tailoring recommendations for:</span>{' '}
              <strong className="text-white">{currentUser.name}</strong>{' '}
              <span className="text-indigo-400">({currentUser.profile?.personaTag || 'Customer'})</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. AI Recommendation Banner (Personalized by RecommendationAgent) */}
      {recommendations.length > 0 && selectedCategory === 'All' && !searchQuery && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">
                  Autonomous AI Recommendations For You
                </h2>
                <p className="text-xs text-slate-400">
                  Scored by Recommendation Agent based on your profile, budget, and affinity tags
                </p>
              </div>
            </div>
            <span className="text-[11px] text-cyan-300 font-mono hidden sm:inline">
              Collaborative Scoring Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                showCompareButton={true}
                onCompare={handleCompare}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. Search & Filters Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, keywords (e.g. 'OLED', 'ANC', 'Ryzen')..."
              className="w-full py-2 pl-10 pr-4 rounded-xl bg-slate-900/80 border border-white/10 focus:border-indigo-500 focus:outline-none text-xs text-white placeholder-slate-500"
            />
          </div>

          {/* Brand Selector */}
          <div className="w-full md:w-48">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Brands</option>
              {allBrands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="w-full md:w-52">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="featured">Featured / AI Ranked</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>
        </div>

        {/* Categories Tabs & Price Slider */}
        <div className="pt-3 border-t border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              All Categories ({products.length})
            </button>
            {categories.map(c => (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedCategory === c.name
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {c.name} ({c.count})
              </button>
            ))}
          </div>

          {/* Price Range Slider */}
          <div className="flex items-center gap-3 text-xs text-slate-300 min-w-[240px]">
            <span>Max Price:</span>
            <input
              type="range"
              min="5000"
              max="160000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="flex-1 accent-indigo-500 cursor-pointer"
            />
            <span className="font-bold text-cyan-400 whitespace-nowrap">
              {formatINR(maxPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Products Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs">
          Loading catalog products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl border border-white/10 space-y-3">
          <p className="text-sm text-slate-300 font-semibold">No products matched your active filters.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedBrand('All');
              setSearchQuery('');
              setMaxPrice(160000);
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              showCompareButton={true}
              onCompare={handleCompare}
            />
          ))}
        </div>
      )}

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        products={selectedCompareProds}
      />
    </div>
  );
};
