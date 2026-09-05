import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Star, 
  Clock
} from 'lucide-react';
import { apiRequest, formatINR } from '../utils/api';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import { ProductCard } from '../components/ProductCard';
import { ComparisonModal } from '../components/ComparisonModal';
import { OrderConfirmationModal } from '../components/OrderConfirmationModal';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  reasoningSteps?: string[];
  recommendedProducts?: any[];
  comparison?: any;
  cartSummary?: any;
  checkoutIntent?: any;
  suggestedPrompts?: string[];
  executionTimeMs?: number;
  timestamp: string;
}

export const AssistantPage: React.FC = () => {
  const { currentUser } = useUser();
  const { cart, fetchCart } = useCart();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});
  
  // Comparison Modal state
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [selectedProductsForCompare, setSelectedProductsForCompare] = useState<any[]>([]);
  const [comparisonData, setComparisonData] = useState<any>(null);

  // Order Confirmation Modal state
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState<any>(null);

  // Feedback rating state
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, number>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeId = 'welcome-1';
    setMessages([
      {
        id: welcomeId,
        sender: 'agent',
        text: `Hello ${currentUser?.name || 'there'}! I am your autonomous AI Shopping & Commerce Agent. Tell me what you're looking for, your budget in ₹ INR, or your primary use case, and I'll find, compare, and prepare your ideal cart with personalized rationale.`,
        suggestedPrompts: [
          'Find me a laptop under ₹70,000.',
          'What is the best phone for photography?',
          'Compare Sony WH-1000XM5 and Bose QC45',
          'I want something good for college',
          'Find the best value for money'
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || loading) return;

    setInputText('');

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await apiRequest('/agents/chat', {
        method: 'POST',
        body: JSON.stringify({ query })
      });

      const agentMessageId = `agent-${Date.now()}`;
      const agentMessage: Message = {
        id: agentMessageId,
        sender: 'agent',
        text: response.reply,
        reasoningSteps: response.reasoningSteps,
        recommendedProducts: response.recommendedProducts,
        comparison: response.comparison,
        cartSummary: response.cartSummary,
        checkoutIntent: response.checkoutIntent,
        suggestedPrompts: response.suggestedPrompts,
        executionTimeMs: response.executionTimeMs,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Expand reasoning automatically for visibility
      setExpandedReasoning(prev => ({ ...prev, [agentMessageId]: true }));

      // If comparison returned, prepare comparison state
      if (response.comparison) {
        setComparisonData(response.comparison);
        setSelectedProductsForCompare(response.recommendedProducts || response.comparison.products || []);
      }

      // If checkout preparation returned, show confirmation modal
      if (response.checkoutIntent) {
        setPendingCheckout(response.checkoutIntent);
        setConfirmationModalOpen(true);
      }

      // If cart was modified, refresh global cart
      if (response.cartSummary) {
        await fetchCart();
      }

      setMessages(prev => [...prev, agentMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: `agent-error-${Date.now()}`,
        sender: 'agent',
        text: `Sorry, I encountered an issue processing that: ${err.message || 'Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderConfirmed = async (address: string) => {
    const result = await apiRequest('/orders/confirm', {
      method: 'POST',
      body: JSON.stringify({
        shippingAddress: address,
        confirmed: true,
        agentSummary: 'Order placed via AI Shopping Assistant autonomous session.'
      })
    });
    await fetchCart();
    return result;
  };

  const handleFeedback = async (messageId: string, rating: number) => {
    setFeedbackGiven(prev => ({ ...prev, [messageId]: rating }));
    try {
      await apiRequest('/agents/feedback', {
        method: 'POST',
        body: JSON.stringify({ rating, feedbackText: `User rated recommendation ${rating}/5` })
      });
    } catch { /* ignore */ }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-8rem)] flex flex-col">
      
      {/* Top Header Card */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Autonomous Shopping Assistant</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Agentic Engine v2.4
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Understands natural constraints, compares specifications, and prepares confirmed transactions
            </p>
          </div>
        </div>

        {/* Quick Cart Summary pill */}
        <div className="flex items-center gap-2 text-xs bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10">
          <ShoppingBag className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-300">Cart Total:</span>
          <span className="font-bold text-cyan-300">{formatINR(cart?.total || 0)}</span>
          <span className="text-[10px] text-slate-400">({cart?.itemCount || 0} items)</span>
        </div>
      </div>

      {/* Main Chat Stream */}
      <div className="flex-1 glass-panel rounded-2xl border border-white/10 p-4 sm:p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => {
          const isAgent = msg.sender === 'agent';
          const isExpanded = expandedReasoning[msg.id];

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'} space-y-2`}
            >
              {/* Message Bubble Container */}
              <div className="flex items-start gap-3 max-w-3xl">
                {isAgent && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-md shadow-indigo-600/30">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className="space-y-3">
                  {/* Bubble Content */}
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isAgent
                        ? 'bg-slate-900/90 border border-white/10 text-slate-200'
                        : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-tr-none shadow-md shadow-indigo-600/20'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Agent Execution Metadata */}
                    {isAgent && msg.executionTimeMs && (
                      <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>Autonomous Reasoning Time: {msg.executionTimeMs}ms</span>
                      </div>
                    )}
                  </div>

                  {/* Collapsible Reasoning Accordion */}
                  {isAgent && msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                    <div className="rounded-xl bg-slate-950/80 border border-indigo-500/20 overflow-hidden text-xs">
                      <button
                        onClick={() =>
                          setExpandedReasoning(prev => ({ ...prev, [msg.id]: !isExpanded }))
                        }
                        className="w-full px-3 py-2 bg-indigo-950/30 hover:bg-indigo-950/50 flex items-center justify-between text-indigo-300 font-mono text-[11px] transition cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Agent Reasoning & Tool Chain ({msg.reasoningSteps.length} steps)</span>
                        </span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="p-3 space-y-1.5 font-mono text-[11px] text-slate-300 bg-slate-950/90 border-t border-indigo-500/10">
                          {msg.reasoningSteps.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-cyan-400 font-bold">›</span>
                              <span className="leading-relaxed">{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Inline Product Recommendations Grid */}
                  {isAgent && msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Ranked Recommendations ({msg.recommendedProducts.length})
                        </span>
                        {msg.recommendedProducts.length >= 2 && (
                          <button
                            onClick={() => {
                              setSelectedProductsForCompare(msg.recommendedProducts || []);
                              setComparisonModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium hover:bg-cyan-500/30 transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Cpu className="w-3.5 h-3.5" />
                            <span>Compare Side-by-Side</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {msg.recommendedProducts.map((p) => (
                          <ProductCard
                            key={p.id}
                            product={p}
                            showCompareButton={true}
                            onCompare={(prod) => {
                              setSelectedProductsForCompare(msg.recommendedProducts || [prod]);
                              setComparisonModalOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feedback Rating */}
                  {isAgent && msg.recommendedProducts && (
                    <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                      <span>Rate this AI recommendation:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleFeedback(msg.id, star)}
                            className="p-1 text-slate-500 hover:text-amber-400 transition cursor-pointer"
                            title={`Rate ${star} Stars`}
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                (feedbackGiven[msg.id] || 0) >= star
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {feedbackGiven[msg.id] && (
                        <span className="text-emerald-400 text-[11px] font-medium ml-1">
                          ✓ Thanks for rating!
                        </span>
                      )}
                    </div>
                  )}

                  {/* Suggested Prompt Chips */}
                  {isAgent && msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {msg.suggestedPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt)}
                          className="px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-400/50 border border-white/10 text-xs text-slate-300 hover:text-white transition cursor-pointer text-left"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <span className="text-[10px] text-slate-400 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {/* Loading / Thinking State */}
        {loading && (
          <div className="flex items-start gap-3 max-w-lg">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-xs text-cyan-200 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Autonomous Agent Analyzing & Reasoning...</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Decomposing intent, querying specs, and synthesizing candidates.
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe what you need (e.g. 'Laptop for coding under ₹70,000 with long battery')..."
            className="w-full py-3.5 pl-4 pr-12 rounded-xl bg-slate-900/90 border border-white/15 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-slate-500 shadow-inner"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="absolute right-2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition cursor-pointer"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-slate-400">
          <span>💡 Tip: You can ask to compare products or tell the agent "add to cart" and "checkout".</span>
          <span>Explicit user confirmation required before order placement.</span>
        </div>
      </div>

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        products={selectedProductsForCompare}
        comparisonData={comparisonData}
      />

      {/* Order Confirmation Modal */}
      {pendingCheckout && (
        <OrderConfirmationModal
          isOpen={confirmationModalOpen}
          onClose={() => setConfirmationModalOpen(false)}
          orderSummary={pendingCheckout.orderSummary}
          shippingAddress={pendingCheckout.shippingAddress}
          onConfirmOrder={handleOrderConfirmed}
          onOrderSuccess={(order) => {
            // Append agent message confirming order
            setMessages(prev => [
              ...prev,
              {
                id: `order-confirmed-${Date.now()}`,
                sender: 'agent',
                text: `🎉 **Order Confirmed!**\n\nYour simulated order **#${order.orderNumber}** totaling **${formatINR(order.finalAmount)}** has been placed successfully. You can track this in the My Orders tab.`,
                suggestedPrompts: [
                  'View my orders',
                  'Find matching accessories',
                  'Start new search'
                ],
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }}
        />
      )}
    </div>
  );
};
