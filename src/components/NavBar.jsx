/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Flame, Search, Sparkles, TrendingUp, Gamepad2, Heart } from 'lucide-react';

export default function NavBar({
  searchQuery,
  setSearchQuery,
  favoritesCount,
  showOnlyFavorites,
  setShowOnlyFavorites,
  selectedCategory,
  setSelectedCategory,
}) {
  const categories = ['All', 'Action', 'Arcade', 'Puzzle', 'Retro', 'Sports'];

  return (
    <header className="sticky top-0 z-50 w-full glass px-4 py-4 md:px-8" id="hasanos-header">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center justify-between" id="header-brand-section">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
            setSelectedCategory('All');
            setShowOnlyFavorites(false);
          }}>
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20" id="header-logo">
              <Gamepad2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-indigo-400">ARCADE HUB</span>
              <h1 className="font-sans text-lg font-black text-white tracking-tight uppercase italic flex items-center gap-0.5" id="header-title">
                HASANOS<span className="text-indigo-400">GAMES</span>
              </h1>
            </div>
          </div>

          {/* Favorites filter pill (Mobile Only inline toggle) */}
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`md:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-black border transition-all ${
              showOnlyFavorites
                ? 'bg-rose-950/40 border-rose-500 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
            id="fav-mobile-btn"
          >
            <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span>FAVS ({favoritesCount})</span>
          </button>
        </div>

        {/* Search Bar section */}
        <div className="relative flex-1 max-w-md mx-auto md:mx-4" id="header-search-wrapper">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search unblocked game cabinets..."
            className="w-full text-sm font-sans pl-10 pr-4 py-2 bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-full text-slate-100 placeholder-slate-400 outline-none transition-all duration-200"
            id="game-search-input"
          />
        </div>

        {/* Action Toggles for Desktop */}
        <div className="hidden md:flex items-center gap-3" id="header-actions">
          <button
            onClick={() => setShowOnlyFavorites(true)}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${
              showOnlyFavorites
                ? 'bg-rose-950/40 border-rose-500 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span>Favorites ({favoritesCount})</span>
          </button>
        </div>
      </div>

      {/* Row of Category Buttons */}
      <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-white/5 overflow-x-auto scrollbar-none flex gap-2" id="header-categories-row">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              if (showOnlyFavorites) setShowOnlyFavorites(false); // Switch off to show chosen category
            }}
            className={`cursor-pointer shrink-0 px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
              selectedCategory === cat && !showOnlyFavorites
                ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
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
