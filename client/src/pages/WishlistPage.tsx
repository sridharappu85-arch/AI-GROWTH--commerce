import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { formatINR } from '../utils/api';

export const WishlistPage: React.FC = () => {
  const { wishlistItems, toggleWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400 text-xs">
        Loading wishlist...
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Heart className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">Your Wishlist is Empty</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Save devices you're eyeing to get notified by the AI Agent when stock or promotions update.
        </p>
        <Link
          to="/products"
          className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Saved Wishlist</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
              {wishlistItems.length} items
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Personal hardware watch list tracked by the Recommendation Agent
          </p>
        </div>

        <Link
          to="/products"
          className="text-xs text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => {
          const product = item.product;
          return (
            <div
              key={item.id}
              className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3 relative group"
            >
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 relative">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-slate-900/80 text-rose-400 hover:bg-slate-900 transition"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400">
                    {product.brand}
                  </span>
                  <Link
                    to={`/products/${product.id}`}
                    className="block text-sm font-semibold text-white hover:text-indigo-300 transition line-clamp-2 mt-0.5"
                  >
                    {product.title}
                  </Link>
                </div>

                <div className="text-base font-bold text-white">
                  {formatINR(product.price)}
                </div>
              </div>

              <button
                onClick={() => addToCart(product.id, 1, 'Moved from Wishlist')}
                className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move to Cart</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
