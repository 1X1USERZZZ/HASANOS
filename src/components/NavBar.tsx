/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Flame, Search, Sparkles, TrendingUp, Gamepad2, Heart } from 'lucide-react';

interface NavBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favoritesCount: number;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (onlyFavs: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function NavBar({
  searchQuery,
  setSearchQuery,
  favoritesCount,
  showOnlyFavorites,
  setShowOnlyFavorites,
  selectedCategory,
  setSelectedCategory,
}: NavBarProps) {
  const categories = ['All', 'Action', 'Arcade', 'Puzzle', 'Retro', 'Sports'];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 py-4 md:px-8" id="hasanos-header">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center justify-between" id="header-brand-section">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
            setSelectedCategory('All');
            setShowOnlyFavorites(false);
          }}>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" id="header-logo">
              <Gamepad2 className="h-6 w-6 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">ARCADE CORE</span>
              <h1 className="font-sans text-xl font-black text-white tracking-tight flex items-center gap-1.5" id="header-title">
                HASANOS <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">UNBLOCKED</span>
              </h1>
            </div>
          </div>

          {/* Favorites filter pill (Mobile Only inline toggle) */}
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`md:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-black border transition-all ${
              showOnlyFavorites
                ? 'bg-rose-950/40 border-rose-500 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            id="fav-mobile-btn"
          >
            <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span>FAVS ({favoritesCount})</span>
          </button>
        </div>

        {/* Search Bar section */}
        <div className="relative flex-1 max-w-md mx-auto md:mx-4" id="header-search-wrapper">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search from unblocked arcade archives..."
            className="w-full text-sm font-sans pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 focus:border-emerald-500/80 text-slate-100 placeholder-slate-500 rounded-xl outline-none transition-all duration-200"
            id="game-search-input"
          />
        </div>

        {/* Action Toggles for Desktop */}
        <div className="hidden md:flex items-center gap-3" id="header-actions">
          <button
            onClick={() => setShowOnlyFavorites(false)}
            className={`cursor-pointer px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${
              !showOnlyFavorites
                ? 'bg-gradient-to-tr from-slate-900 to-slate-800 border-slate-700 text-emerald-400'
                : 'bg-transparent border-transparent text-slate-400 hover:text-white'
            }`}
          >
            All Archives
          </button>
          <button
            onClick={() => setShowOnlyFavorites(true)}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${
              showOnlyFavorites
                ? 'bg-rose-950/40 border-rose-500 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span>Favorites ({favoritesCount})</span>
          </button>
        </div>
      </div>

      {/* Row of Category Buttons */}
      <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-900 overflow-x-auto scrollbar-none flex gap-2" id="header-categories-row">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              if (showOnlyFavorites) setShowOnlyFavorites(false); // Switch off to show chosen category
            }}
            className={`cursor-pointer shrink-0 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all border ${
              selectedCategory === cat && !showOnlyFavorites
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
            id={`category-${cat.toLowerCase()}`}
          >
            {cat === 'All' && <Sparkles className="w-3 h-3 inline mr-1.5 text-amber-500" />}
            {cat === 'Action' && <Flame className="w-3 h-3 inline mr-1.5 text-orange-400" />}
            {cat === 'Retro' && <TrendingUp className="w-3 h-3 inline mr-1.5 text-violet-400" />}
            {cat}
          </button>
        ))}
      </div>
    </header>
  );
}
