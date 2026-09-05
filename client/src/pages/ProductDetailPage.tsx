import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Cpu
} from 'lucide-react';
import type { Product } from '../types';
import { apiRequest, formatINR } from '../utils/api';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await apiRequest(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400 text-sm">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <Link to="/products" className="text-indigo-400 hover:underline text-xs">
          Return to Catalog
        </Link>
      </div>
    );
  }

  let specsObj: Record<string, string> = {};
  let featuresArr: string[] = [];
  try { specsObj = JSON.parse(product.specs); } catch { /* ignore */ }
  try { featuresArr = JSON.parse(product.features); } catch { /* ignore */ }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity, `Added directly from detail page with quantity ${quantity}`);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </Link>

      {/* Main product overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left: Product Image */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden glass-panel border border-white/10 bg-slate-950 relative">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-lg">
                {discountPercent}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition ${
                wishlisted
                  ? 'bg-rose-500 text-white shadow-lg'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white'
              }`}
            >
              <Heart className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
              <Truck className="w-4 h-4 text-cyan-400 mx-auto" />
              <div className="text-[11px] font-semibold text-white">Free Express</div>
              <p className="text-[10px] text-slate-400">All India Delivery</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
              <ShieldCheck className="w-4 h-4 text-indigo-400 mx-auto" />
              <div className="text-[11px] font-semibold text-white">Brand Warranty</div>
              <p className="text-[10px] text-slate-400">1-Year Official</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
              <RotateCcw className="w-4 h-4 text-emerald-400 mx-auto" />
              <div className="text-[11px] font-semibold text-white">7 Days Return</div>
              <p className="text-[10px] text-slate-400">Hassle-Free Replacement</p>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="space-y-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              {product.brand} • {product.category}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 leading-snug">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-300">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold ml-1">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400">{product.reviewCount} customer reviews</span>
              <span className="text-slate-400">•</span>
              <span className={`font-semibold ${product.inStock ? 'text-emerald-400' : 'text-rose-400'}`}>
                {product.inStock ? `In Stock (${product.stockCount} left)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {formatINR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-slate-400 line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-400 font-medium">
              Inclusive of all taxes + 5% automated discount applied when added via AI Assistant
            </p>
          </div>

          {/* AI "Why You Should Buy This" Highlight */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/70 to-slate-900 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Shopping Agent Verdict</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Key Features */}
          {featuresArr.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Highlights
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {featuresArr.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-4">
            <div className="flex items-center rounded-xl bg-slate-900 border border-white/10 p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-white flex items-center justify-center font-bold"
              >
                -
              </button>
              <span className="w-10 text-center text-xs font-bold text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-white flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 py-3 px-6 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                added
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white shadow-lg shadow-indigo-600/30'
              } disabled:opacity-50`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added {quantity} to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart ({formatINR(product.price * quantity)})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Technical Specifications Table */}
      {Object.keys(specsObj).length > 0 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Technical Specifications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(specsObj).map(([key, value]) => (
              <div
                key={key}
                className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-between text-xs"
              >
                <span className="text-slate-400 font-medium">{key}</span>
                <span className="text-white font-semibold text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Customer Reviews ({product.reviews?.length || 0})
            </h2>
            <p className="text-xs text-slate-400">
              Verified feedback from tech professionals and enthusiasts
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{product.rating.toFixed(1)} / 5.0</span>
          </div>
        </div>

        <div className="space-y-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((r) => (
              <div key={r.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={r.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80'}
                      alt={r.user?.name || 'User'}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-white">{r.user?.name || 'Customer'}</span>
                  </div>
                  <div className="flex text-amber-400 text-xs">
                    {Array.from({ length: r.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{r.comment}</p>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400 p-4 rounded-xl bg-slate-900/40 border border-white/5">
              Verified 5-star customer ratings recorded during pre-launch tech evaluation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
