import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { apiRequest, formatINR } from '../utils/api';
import { OrderConfirmationModal } from '../components/OrderConfirmationModal';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeItem, clearCart, fetchCart } = useCart();
  const navigate = useNavigate();

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [checkoutPreparation, setCheckoutPreparation] = useState<any>(null);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProceedToCheckout = async () => {
    try {
      setPreparing(true);
      setError(null);
      const prep = await apiRequest('/orders/prepare', {
        method: 'POST',
        body: JSON.stringify({})
      });
      setCheckoutPreparation(prep);
      setConfirmationOpen(true);
    } catch (e: any) {
      setError(e.message || 'Failed to prepare checkout');
    } finally {
      setPreparing(false);
    }
  };

  const handleOrderConfirmed = async (address: string) => {
    const res = await apiRequest('/orders/confirm', {
      method: 'POST',
      body: JSON.stringify({
        shippingAddress: address,
        confirmed: true,
        agentSummary: 'Order placed from Cart checkout with human confirmation.'
      })
    });
    await fetchCart();
    return res;
  };

  const handleOrderSuccess = (_order: any) => {
    navigate('/orders');
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto text-indigo-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Ask our AI Shopping Assistant for customized recommendations or browse through our hardware catalog.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            to="/assistant"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Ask AI Assistant</span>
          </Link>
          <Link
            to="/products"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Shopping Cart</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {cart.itemCount} item(s)
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review your items and proceed with simulated agentic checkout
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-rose-400 transition flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Main Grid: Items on Left, Order Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-900 border border-white/5 flex-shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider">
                    {item.product.brand}
                  </span>
                  <Link
                    to={`/products/${item.product.id}`}
                    className="block text-sm font-semibold text-white hover:text-indigo-300 transition truncate"
                  >
                    {item.product.title}
                  </Link>

                  {/* Agent Recommendation Rationale Badge */}
                  {item.addedByAgent && (
                    <div className="p-1.5 px-2.5 rounded-md bg-indigo-950/60 border border-indigo-500/30 text-[10px] text-cyan-300 flex items-center gap-1.5 w-fit">
                      <Sparkles className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                      <span>{item.agentRecommendationReason || 'Added by AI Shopping Agent'}</span>
                    </div>
                  )}

                  <div className="text-xs font-bold text-slate-200 sm:hidden pt-1">
                    {formatINR(item.product.price)} each
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <div className="flex items-center rounded-lg bg-slate-900 border border-white/10 p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded text-slate-400 hover:text-white flex items-center justify-center font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded text-slate-400 hover:text-white flex items-center justify-center font-bold text-xs"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-white">
                    {formatINR(item.product.price * item.quantity)}
                  </div>
                  <div className="text-[10px] text-slate-400 hidden sm:block">
                    {formatINR(item.product.price)} ea
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
            <h2 className="text-base font-bold text-white tracking-tight">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({cart.itemCount} items)</span>
                <span className="text-white font-medium">{formatINR(cart.subtotal)}</span>
              </div>

              {cart.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Assistant Privilege (5%)</span>
                  </span>
                  <span className="font-semibold">-{formatINR(cart.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Estimated GST (18%)</span>
                <span className="text-white font-medium">{formatINR(cart.tax)}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Express Courier Shipping</span>
                <span className="text-emerald-400 font-medium">FREE</span>
              </div>

              <div className="border-t border-white/10 pt-3 flex justify-between text-base font-extrabold text-white">
                <span>Total Amount</span>
                <span className="text-cyan-400">{formatINR(cart.total)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              disabled={preparing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {preparing ? (
                <span>Preparing Checkout...</span>
              ) : (
                <>
                  <span>Proceed to Simulated Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1 text-[11px] text-slate-400 leading-relaxed">
              <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supervised Agentic Commerce</span>
              </div>
              <p>
                Order requires explicit user confirmation before recording simulated transaction. No real payment is required.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {checkoutPreparation && (
        <OrderConfirmationModal
          isOpen={confirmationOpen}
          onClose={() => setConfirmationOpen(false)}
          orderSummary={checkoutPreparation.orderSummary}
          shippingAddress={checkoutPreparation.shippingAddress}
          onConfirmOrder={handleOrderConfirmed}
          onOrderSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
};
