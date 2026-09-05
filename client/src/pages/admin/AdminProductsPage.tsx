import React, { useState, useEffect } from 'react';
import { Package, Search, Star, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { apiRequest, formatINR } from '../../utils/api';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProds = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('/products');
        setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProds();
  }, []);

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Product Catalog & Inventory Management</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {products.length} products
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Store inventory monitored by autonomous shopping and recommendation agents
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full py-1.5 pl-9 pr-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500"
          />
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-white/10 text-slate-400">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price (INR ₹)</th>
                <th className="p-4 font-semibold">Stock Status</th>
                <th className="p-4 font-semibold">Rating</th>
                <th className="p-4 font-semibold">AI Featured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-900 flex-shrink-0"
                      />
                      <div className="min-w-0 max-w-xs">
                        <p className="font-semibold text-white truncate">{p.title}</p>
                        <p className="text-[10px] text-slate-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px]">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-white">
                    {formatINR(p.price)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      p.inStock
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {p.inStock ? `${p.stockCount} units` : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-4 text-amber-400 font-semibold">
                    ★ {p.rating.toFixed(1)} ({p.reviewCount})
                  </td>
                  <td className="p-4">
                    {p.isFeatured ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 flex items-center gap-1 w-fit">
                        <Sparkles className="w-3 h-3" />
                        <span>Yes</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
