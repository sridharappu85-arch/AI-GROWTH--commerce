import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Check, Sparkles, Cpu } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../utils/api';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
  onCompare?: (product: Product) => void;
  showCompareButton?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onCompare, 
  showCompareButton = false 
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAdding(true);
      await addToCart(product.id, 1, product.aiRationale);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const wishlisted = isInWishlist(product.id);

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 relative border border-white/10 hover:border-indigo-500/40">
      
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900/80 backdrop-blur-md text-slate-300 border border-white/10">
            {product.brand}
          </span>
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/90 text-white shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.matchScore && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/90 text-slate-950 flex items-center gap-1 shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              {product.matchScore}% Match
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            wishlisted
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
        </button>

        {/* Stock status pill */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md">
            <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="text-[11px] text-indigo-400 font-medium tracking-wide uppercase">
            {product.category}
          </div>
          <Link to={`/products/${product.id}`} className="block group-hover:text-indigo-300 transition">
            <h3 className="text-sm font-semibold text-white line-clamp-2 mt-0.5 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* AI Rationale Badge */}
          {product.aiRationale && (
            <div className="mt-2 p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-indigo-200 flex items-start gap-1.5 leading-relaxed">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-cyan-300">AI Pick:</strong> {product.aiRationale}
              </span>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-300">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-semibold ml-1">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-bold text-white tracking-tight">
              {formatINR(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-slate-400 line-through">
                {formatINR(product.originalPrice)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {showCompareButton && onCompare && (
              <button
                onClick={() => onCompare(product)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-medium transition cursor-pointer flex items-center gap-1"
                title="Compare Specifications"
              >
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>Compare</span>
              </button>
            )}

            <button
              onClick={handleAddToCart}
              disabled={adding || !product.inStock}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                added
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
