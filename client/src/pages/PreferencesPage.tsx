import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Save, User, DollarSign } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { apiRequest, formatINR } from '../utils/api';

const AVAILABLE_CATEGORIES = [
  'Laptops & Computing',
  'Audio & Headphones',
  'Smartphones & Tablets',
  'Smart Wearables',
  'Smart Home & Productivity'
];

const AVAILABLE_BRANDS = [
  'Apple', 'Dell', 'Lenovo', 'HP', 'ASUS', 'Samsung', 'Sony', 'Bose', 'OnePlus', 'Google', 'Logitech', 'Keychron'
];

export const PreferencesPage: React.FC = () => {
  const { currentUser, refreshUser } = useUser();
  const [budgetMax, setBudgetMax] = useState<number>(75000);
  const [preferredCategories, setPreferredCategories] = useState<string[]>([]);
  const [preferredBrands, setPreferredBrands] = useState<string[]>([]);
  const [techProficiency, setTechProficiency] = useState<string>('Intermediate');
  const [location, setLocation] = useState<string>('Bengaluru, India');
  const [personaTag, setPersonaTag] = useState<string>('Tech Enthusiast');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentUser?.profile) {
      const p = currentUser.profile;
      if (p.budgetMax) setBudgetMax(p.budgetMax);
      if (p.techProficiency) setTechProficiency(p.techProficiency);
      if (p.location) setLocation(p.location);
      if (p.personaTag) setPersonaTag(p.personaTag);

      try {
        if (p.preferredCategories) setPreferredCategories(JSON.parse(p.preferredCategories));
      } catch { /* ignore */ }

      try {
        if (p.preferredBrands) setPreferredBrands(JSON.parse(p.preferredBrands));
      } catch { /* ignore */ }
    }
  }, [currentUser]);

  const toggleCategory = (cat: string) => {
    setPreferredCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleBrand = (brand: string) => {
    setPreferredBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await apiRequest('/profile/preferences', {
        method: 'PUT',
        body: JSON.stringify({
          budgetMax,
          preferredCategories,
          preferredBrands,
          techProficiency,
          location,
          personaTag
        })
      });
      await refreshUser();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error('Failed to update preferences:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>AI Shopping Preferences</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Agent Persona Tuning</span>
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Adjust your preferences to instantly refine how the Shopping and Recommendation Agents tailor their suggestions
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Card 1: Persona & Identity */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            <span>Profile Persona Tag & Location</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Persona Tag</label>
              <input
                type="text"
                value={personaTag}
                onChange={(e) => setPersonaTag(e.target.value)}
                placeholder="e.g. Senior Fullstack Developer, CS Student..."
                className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Shipping Delivery Hub</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru, Karnataka"
                className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Budget Cap Slider */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              <span>Target Maximum Budget Cap</span>
            </h2>
            <span className="text-base font-extrabold text-cyan-400">
              {formatINR(budgetMax)}
            </span>
          </div>

          <input
            type="range"
            min="10000"
            max="160000"
            step="5000"
            value={budgetMax}
            onChange={(e) => setBudgetMax(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />

          <p className="text-[11px] text-slate-400">
            The Shopping Agent will prioritize options within this threshold and clearly highlight why premium alternatives exceed it.
          </p>
        </div>

        {/* Card 3: Preferred Categories */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-white">
            Category Affinities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {AVAILABLE_CATEGORIES.map((cat) => {
              const checked = preferredCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`p-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition cursor-pointer ${
                    checked
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-sm'
                      : 'bg-slate-900/50 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{cat}</span>
                  {checked && <Check className="w-4 h-4 text-cyan-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Card 4: Preferred Brands */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-white">
            Preferred Hardware Brands
          </h2>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_BRANDS.map((brand) => {
              const checked = preferredBrands.includes(brand);
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => toggleBrand(brand)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                    checked
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>
        </div>

        {/* Card 5: Technical Proficiency */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-white">
            Hardware Familiarity Level
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {['Beginner', 'Intermediate', 'Advanced'].map((level) => {
              const isSelected = techProficiency === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setTechProficiency(level)}
                  className={`p-3 rounded-xl border text-xs font-medium text-center transition cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-slate-900/50 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400">
            "Advanced" prompts the AI agent to explain benchmarks, TDP wattage, and bus bandwidth. "Beginner" focuses on simplified benefits.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Preferences saved successfully!</span>
            </span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating Persona...' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
