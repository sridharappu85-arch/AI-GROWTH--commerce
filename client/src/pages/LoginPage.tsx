import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Bot, 
  Sparkles, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Zap, 
  Compass, 
  TrendingUp,
  Layers,
  ShoppingBag,
  Terminal,
  Activity,
  KeyRound,
  Fingerprint
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUser } from '../contexts/UserContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, users, login, register, switchUser } = useUser();

  const [activeTab, setActiveTab] = useState<'persona' | 'signin' | 'register'>('persona');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [personaTag, setPersonaTag] = useState('AI Tech Enthusiast');
  const [budgetTier, setBudgetTier] = useState('HIGH');
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanStep, setScanStep] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('');

  // Mouse position for reactive cursor light effect
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (users.length > 0 && !selectedPersonaId) {
      setSelectedPersonaId(users[0].id);
    }
  }, [users, selectedPersonaId]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#06b6d4', '#ec4899', '#a855f7']
    });
  };

  const simulateAIScan = async (personaName: string, role: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    setScanStep('Initializing Neural Authentication Bridge...');
    await new Promise(r => setTimeout(r, 450));

    setScanStep(`Retrieving Vector Profile & Affinities for [${personaName}]...`);
    await new Promise(r => setTimeout(r, 550));

    setScanStep(`Allocating Agent Permissions (${role === 'ADMIN' ? 'Full Growth Suite' : 'Autonomous Buyer Mode'})...`);
    await new Promise(r => setTimeout(r, 400));

    setScanStep('Syncing Agent Memory Cache...');
    await new Promise(r => setTimeout(r, 350));
  };

  const handlePersonaLogin = async (userObj: any) => {
    setSelectedPersonaId(userObj.id);
    await simulateAIScan(userObj.name, userObj.role);
    
    await switchUser(userObj.id);
    triggerCelebration();
    setSuccessMessage(`Authenticated as ${userObj.name} (${userObj.role})`);
    
    setTimeout(() => {
      setIsSubmitting(false);
      if (userObj.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/assistant');
      }
    }, 600);
  };

  const handleCustomSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setScanStep('Verifying cryptographic token and agent credentials...');

    try {
      await new Promise(r => setTimeout(r, 700));
      const res = await login({ email });

      if (res.success) {
        setScanStep('Authentication confirmed! Launching Agentic Workspace...');
        triggerCelebration();
        setSuccessMessage(res.message || 'Login successful');
        setTimeout(() => {
          setIsSubmitting(false);
          navigate('/');
        }, 800);
      } else {
        setIsSubmitting(false);
        setErrorMessage(res.message || 'Invalid email or user not found. Try 1-Click Demo Persona.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Authentication error');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      setErrorMessage('Please fill in both name and email');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setScanStep('Generating Multi-Agent Persona & Vector Embeddings...');

    try {
      await new Promise(r => setTimeout(r, 900));
      const res = await register({
        name,
        email,
        personaTag,
        budgetTier,
        categoryPreferences: ['Laptops & Ultrabooks', 'Audio & Acoustics', 'Wearables & Health']
      });

      if (res.success) {
        triggerCelebration();
        setSuccessMessage('AI Persona created successfully! Welcome to NexAgentic.');
        setTimeout(() => {
          setIsSubmitting(false);
          navigate('/assistant');
        }, 900);
      } else {
        setIsSubmitting(false);
        setErrorMessage(res.message || 'Registration failed');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Registration failed');
    }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-[calc(100vh-4rem)] relative flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden bg-[#070a12] bg-cyber-grid"
    >
      {/* Dynamic Cursor Spotlight Effect */}
      <div 
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-60"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}% ${mousePos.y}%, rgba(99, 102, 241, 0.18), transparent 70%)`
        }}
      />

      {/* Floating Animated Ambient Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none animate-float-delayed" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none animate-float-slow" />

      {/* Main Container */}
      <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Hero AI Teaser (Hidden on mobile or compact) */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold w-fit backdrop-blur-md glow-pill">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>AGENTIC IDENTITY PORTAL</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Unlock the Future of <br />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
                Autonomous Commerce
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
              Step into an ecosystem powered by proactive AI agents that discover intent, negotiate discounts, and execute hyper-personalized shopping.
            </p>
          </div>

          {/* Animated AI Capability Ticker */}
          <div className="space-y-3 pt-2">
            {[
              {
                icon: <Bot className="w-4 h-4 text-cyan-400" />,
                title: 'Autonomous Shopping Agent',
                desc: 'Understands budget, specifications & preferences in real-time'
              },
              {
                icon: <TrendingUp className="w-4 h-4 text-indigo-400" />,
                title: 'AI Growth Diagnostic Suite',
                desc: 'Real-time telemetry on customer lifetime value and conversion lift'
              },
              {
                icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
                title: 'Human-in-the-Loop Safe Guard',
                desc: 'Strict limits, transparent reasoning and explicit user confirmations'
              }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5 backdrop-blur-md hover:border-indigo-500/30 transition-all group"
              >
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Current Live AI State Indicator */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/40 via-slate-900/40 to-cyan-950/40 border border-cyan-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-medium font-mono text-[11px]">
                Multi-Agent Cluster: ONLINE
              </span>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
              v2.4 Agentic
            </span>
          </div>
        </div>

        {/* Right Auth Glassmorphic Card */}
        <div className="lg:col-span-7">
          <div className="relative rounded-2xl p-1 bg-gradient-to-b from-indigo-500/30 via-white/5 to-cyan-500/20 shadow-2xl backdrop-blur-2xl">
            <div className="rounded-[15px] bg-[#0b101d]/90 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
              
              {/* Top Scanner Laser Line Effect when Submitting */}
              {isSubmitting && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
              )}

              {/* Navigation Tabs */}
              <div className="flex rounded-xl bg-slate-900/80 p-1 border border-white/10 mb-6">
                <button
                  type="button"
                  onClick={() => { setActiveTab('persona'); setErrorMessage(null); }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'persona'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Fingerprint className="w-4 h-4 text-cyan-300" />
                  <span>1-Click Personas</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setErrorMessage(null); }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'signin'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <KeyRound className="w-4 h-4 text-indigo-300" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setErrorMessage(null); }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-pink-300" />
                  <span>Create Agent ID</span>
                </button>
              </div>

              {/* Alerts */}
              {errorMessage && (
                <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* AI Verification Scanner Overlay during authentication */}
              {isSubmitting && scanStep && (
                <div className="my-6 p-5 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-inner flex flex-col items-center text-center gap-3 animate-in fade-in zoom-in-95">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
                    <Bot className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                      AGENT AUTHENTICATION PROTOCOL
                    </h3>
                    <p className="text-xs text-slate-300 font-mono mt-1 transition-all">
                      {scanStep}
                    </p>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full w-full animate-shimmer" />
                  </div>
                </div>
              )}

              {/* TAB 1: 1-Click Persona Quick-Login */}
              {activeTab === 'persona' && !isSubmitting && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Select a Persona</h3>
                      <p className="text-xs text-slate-400">Experience tailored AI recommendations & admin suites instantly</p>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/30">
                      {users.length} Personas Available
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                    {users.map((userItem) => {
                      const isSelected = userItem.id === (selectedPersonaId || currentUser?.id);
                      const isAdmin = userItem.role === 'ADMIN';

                      return (
                        <div
                          key={userItem.id}
                          onClick={() => handlePersonaLogin(userItem)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-3 relative group ${
                            isSelected
                              ? 'bg-indigo-950/60 border-indigo-400/60 shadow-lg shadow-indigo-500/15'
                              : 'bg-slate-900/50 border-white/5 hover:border-indigo-500/30 hover:bg-slate-800/60'
                          }`}
                        >
                          <img
                            src={userItem.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80'}
                            alt={userItem.name}
                            className={`w-10 h-10 rounded-xl object-cover border ${
                              isAdmin ? 'border-amber-400/60' : 'border-indigo-400/40'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                                {userItem.name}
                              </p>
                              {isAdmin && (
                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {isAdmin ? 'Store Executive & Growth Analytics' : (userItem.profile?.personaTag || 'Customer')}
                            </p>
                            <p className="text-[10px] text-indigo-400/80 font-mono truncate">
                              {userItem.email}
                            </p>
                          </div>

                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="w-4 h-4 text-cyan-400" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 text-center text-xs text-slate-400">
                    Clicking any persona simulates authentic vector matching & launches their tailored session.
                  </div>
                </div>
              )}

              {/* TAB 2: Custom Sign In */}
              {activeTab === 'signin' && !isSubmitting && (
                <form onSubmit={handleCustomSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sridhar@nexagentic.ai"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Password / Secret Key
                      </label>
                      <button
                        type="button"
                        onClick={() => setEmail(users[0]?.email || '')}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                      >
                        Autofill Demo Email
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-white/10 text-indigo-600 focus:ring-0" />
                      <span>Remember Session</span>
                    </label>
                    <span className="text-cyan-400/80 hover:text-cyan-300 cursor-pointer">
                      Forgot Credentials?
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <ShieldCheck className="w-4 h-4 text-cyan-200" />
                    <span>Authorize Agentic Session</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="pt-2 text-center">
                    <p className="text-xs text-slate-400">
                      Need a demo account? Switch to the{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('persona')}
                        className="text-cyan-400 font-semibold hover:underline cursor-pointer"
                      >
                        1-Click Personas tab
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* TAB 3: Create AI Agent ID (Register) */}
              {activeTab === 'register' && !isSubmitting && (
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Devin Chen"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="devin@tech.io"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      AI Shopping Persona Archetype
                    </label>
                    <select
                      value={personaTag}
                      onChange={(e) => setPersonaTag(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                    >
                      <option value="AI Tech Enthusiast">🚀 AI Tech Enthusiast (Early Adopter)</option>
                      <option value="Student Developer">🎓 Student Developer (Budget-Conscious / High Performance)</option>
                      <option value="Audiophile & Creator">🎧 Audiophile & Studio Creator (Acoustic Quality)</option>
                      <option value="Smart Home Architect">🏡 Smart Home Architect (Ecosystem Integration)</option>
                      <option value="Executive Professional">💼 Executive Professional (Ultra-Premium)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Budget Calibration
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['BUDGET', 'MODERATE', 'HIGH'].map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setBudgetTier(tier)}
                          className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            budgetTier === tier
                              ? 'bg-indigo-600/30 border-indigo-400 text-cyan-300'
                              : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {tier === 'BUDGET' && 'Under ₹25k'}
                          {tier === 'MODERATE' && '₹25k - ₹75k'}
                          {tier === 'HIGH' && '₹75k+'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Generate AI Profile & Start Shopping</span>
                  </button>
                </form>
              )}

              {/* Security & Agentic Trust Footer */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-bit Vector Encryption</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Sub-15ms Agent Memory</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
