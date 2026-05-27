/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import NavBar from './components/NavBar';
import GameCard from './components/GameCard';
import PlayTheater from './components/PlayTheater';
import gamesData from './games.json';
import { Gamepad2, Info, Shuffle, Sparkles, Trophy, Flame, Play, Clock, HeartCrack, X, Trash2 } from 'lucide-react';



export default function App() {
  // Auto-clear old local cached games lists so they never reappear
  useEffect(() => {
    localStorage.removeItem('hasanos_arcade_games_custom');
    localStorage.removeItem('hasanos_arcade_games_custom_v2');
  }, []);

  // Customized game cabinets state using a fresh pristine key V5
  const [typedGames, setTypedGames] = useState(() => {
    const saved = localStorage.getItem('hasanos_arcade_games_user_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    // Only the user's specific requested basket hoop game sits here by default
    return [
      {
        id: "basket-hoop",
        title: "Basket Hoop",
        description: "An exciting unblocked arcade basketball hoop game! Aim, shoot, and score high by dunking basketballs into the hoop with physics-driven controls.",
        iframeUrl: "https://d11jzht7mj96rr.cloudfront.net/games/2024/construct/311/basket-hoop/index-gg.html",
        category: "Sports",
        tags: ["Basketball", "Sports", "Arcade", "Physics"],
        thumbnail: "gradient-orange",
        instructions: [
          "Click or tap the screen to aim and throw the basketball.",
          "Score consecutive baskets to trigger combo fire multipliers!",
          "Be quick and precise to beat the retro timer."
        ],
        plays: 1205,
        rating: 4.8,
        likes: 185,
        releaseYear: 2024
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('hasanos_arcade_games_user_v5', JSON.stringify(typedGames));
  }, [typedGames]);



  const handleDeleteGame = (gameId) => {
    setTypedGames((prev) => prev.filter((g) => g.id !== gameId));
    
    // Clean preferences
    setUserPrefs((prev) => ({
      ...prev,
      favorites: prev.favorites.filter((id) => id !== gameId),
      recentlyPlayed: prev.recentlyPlayed.filter((id) => id !== gameId)
    }));

    if (activeGame && activeGame.id === gameId) {
      setActiveGame(null);
    }
  };

  const [activeGame, setActiveGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Load User Preferences from localStorage
  const [userPrefs, setUserPrefs] = useState(() => {
    const saved = localStorage.getItem('hasanos_arcade_preferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        // Fallback below
      }
    }
    return {
      favorites: [],
      ratings: {},
      recentlyPlayed: [],
    };
  });

  // Sync preferences with localStorage when changed
  useEffect(() => {
    localStorage.setItem('hasanos_arcade_preferences', JSON.stringify(userPrefs));
  }, [userPrefs]);

  // Handle Game Play selection triggers
  const handlePlayGame = (game) => {
    setActiveGame(game);
    
    // Add to recently played list (avoid duplicates and keep top 5)
    setUserPrefs((prev) => {
      const filtered = prev.recentlyPlayed.filter((id) => id !== game.id);
      return {
        ...prev,
        recentlyPlayed: [game.id, ...filtered].slice(0, 5),
      };
    });
  };

  // Toggle favorite state
  const handleToggleFavorite = (gameId) => {
    setUserPrefs((prev) => {
      const isFav = prev.favorites.includes(gameId);
      const nextFavorites = isFav
        ? prev.favorites.filter((id) => id !== gameId)
        : [...prev.favorites, gameId];
      return {
        ...prev,
        favorites: nextFavorites,
      };
    });
  };

  // Safe wrapper for card clicks (keeps event propagation quiet)
  const handleCardToggleFavorite = (e, gameId) => {
    e.stopPropagation();
    handleToggleFavorite(gameId);
  };

  // Trigger random game selector (bored button)
  const handlePickRandomGame = () => {
    if (typedGames.length === 0) return;
    const randomIndex = Math.floor(Math.random() * typedGames.length);
    handlePlayGame(typedGames[randomIndex]);
  };

  // Safe clear recents log
  const handleClearRecentlyPlayed = (e) => {
    e.stopPropagation();
    setUserPrefs((prev) => ({
      ...prev,
      recentlyPlayed: [],
    }));
  };

  // Filter and search game datasets
  const filteredGames = useMemo(() => {
    return typedGames.filter((game) => {
      // 1. Search Query filter (matches title and tags)
      const matchesSearch =
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.tags.some((tg) => tg.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. Category filter
      const matchesCategory =
        selectedCategory === 'All' || game.category === selectedCategory;

      // 3. Favorites toggle filter
      const matchesFavorites = !showOnlyFavorites || userPrefs.favorites.includes(game.id);

      return matchesSearch && matchesCategory && matchesFavorites;
    });
  }, [searchQuery, selectedCategory, showOnlyFavorites, userPrefs.favorites]);

  // Map recently played game IDs back to full Game objects
  const recentGamesList = useMemo(() => {
    return userPrefs.recentlyPlayed
      .map((id) => typedGames.find((g) => g.id === id))
      .filter((g) => g !== undefined);
  }, [userPrefs.recentlyPlayed]);

  return (
    <div className="min-h-screen mesh-bg text-slate-100 flex flex-col font-sans" id="hasanos-app-root">
      {/* Dynamic Header navbar control panel */}
      <NavBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={userPrefs.favorites.length}
        showOnlyFavorites={showOnlyFavorites}
        setShowOnlyFavorites={setShowOnlyFavorites}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Container contents area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:px-8 flex flex-col gap-8" id="hasanos-main-grid">
        
        {/* HERO BANNER SECTION (Displays list title banner) */}
        {!selectedCategory || selectedCategory === 'All' && !searchQuery && !showOnlyFavorites ? (
          <div
            className="relative w-full rounded-3xl overflow-hidden glass p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl"
            id="hasanos-hero-marquee"
          >
            {/* Ambient visual aura circles */}
            <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-indigo-500/5 blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-violet-500/5 blur-[80px]"></div>

            <div className="flex-1 flex flex-col gap-3 text-center md:text-left">
              <span className="font-mono text-xs font-black text-indigo-400 uppercase tracking-[0.25em] flex items-center justify-center md:justify-start gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                DODGE STUDY HALL BOREDOM
              </span>
              <h2 className="font-sans text-2xl md:text-4xl font-black text-white leading-tight">
                PRO LEVEL CLASSIC <br className="hidden md:inline" />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-rose-400 bg-clip-text text-transparent">
                  UNBLOCKED ARCADE
                </span>
              </h2>
              <p className="text-slate-400 text-xs md:text-sm font-sans max-w-md leading-relaxed">
                Loaded directly from pristine standalone sandboxed servers. Zero lag, zero trackers, 100% free gameplay.
              </p>
            </div>

            {/* Quick Play Trigger widget */}
            <div className="flex flex-col gap-2.5 items-center shrink-0 w-full md:w-auto" id="hero-launcher-box">
              <button
                onClick={() => handlePlayGame(typedGames[0])}
                className="cursor-pointer w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-black rounded-full shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 active:scale-95 transition-all outline-none"
                id="hero-boredom-btn"
              >
                <Play className="w-4 h-4 text-white fill-white" />
                PLAY NOW
              </button>
            </div>
          </div>
        ) : null}

        {/* RECENT PLAYS SECTION (Only loaded when user has history) */}
        {recentGamesList.length > 0 && !searchQuery ? (
          <section className="flex flex-col gap-3" id="recently-played-section">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-black">
                <Clock className="w-4 h-4 text-indigo-400" />
                Recently Played Archives
              </span>
              <button
                onClick={handleClearRecentlyPlayed}
                className="cursor-pointer text-[10px] font-mono font-bold text-slate-400 hover:text-rose-400 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                id="clear-recents-btn"
              >
                Clear History
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3" id="recently-played-grid">
              {recentGamesList.map((game) => (
                <div
                  key={game.id}
                  onClick={() => handlePlayGame(game)}
                  className="cursor-pointer px-3.5 py-3 rounded-xl glass-card text-left flex items-center gap-3 hover:scale-[1.02] transition-all group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-sans text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors truncate">
                      {game.title}
                    </h4>
                    <span className="font-mono text-[9px] text-slate-500 block uppercase">{game.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* MAIN ARCADE TILES GRID */}
        <section className="flex flex-col gap-4" id="main-arcade-section">
          {/* Section Breadcrumb label */}
          <div className="flex items-center justify-between" id="arcade-count-bubble">
            <h3 className="font-mono text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-indigo-400" />
              {showOnlyFavorites ? 'Favorited Cabinets' : `${selectedCategory} Cabinets`} ({filteredGames.length})
            </h3>
            
            {showOnlyFavorites && userPrefs.favorites.length > 0 && (
              <span className="text-[10px] font-mono text-rose-400 italic">Showing your liked selections</span>
            )}
          </div>

          {/* GRID OF ELEMENTS */}
          {filteredGames.length === 0 ? (
            /* EMPTY STATES CHANGER */
            <div className="w-full py-16 px-6 text-center flex flex-col items-center justify-center glass rounded-3xl" id="empty-grid-placeholder">
              {typedGames.length === 0 ? (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
                    <Gamepad2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-sans text-xl font-black text-slate-200 mb-1.5 uppercase">Arcade Storage Cleared</h3>
                  <p className="text-slate-400 text-xs font-sans max-w-sm leading-relaxed mb-6">
                    You've successfully unmounted all default games. It's time to install your very own HTML5, emulator, or iframe cabinet links!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="cursor-pointer px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-black shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
                    >
                      + Install Custom Cabinet
                    </button>
                  </div>
                </>
              ) : showOnlyFavorites ? (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/5 text-rose-500 border border-rose-500/10 mb-4 animate-pulse">
                    <HeartCrack className="w-8 h-8" />
                  </div>
                  <h3 className="font-sans text-lg font-bold text-slate-200 mb-1">No Favorites Added Yet</h3>
                  <p className="text-slate-400 text-xs font-sans max-w-sm leading-relaxed mb-6">
                    Tap the small heart button overlayed on any unblocked cabinet cover to quickly add them here for fast play.
                  </p>
                  <button
                    onClick={() => {
                      setShowOnlyFavorites(false);
                      setSelectedCategory('All');
                    }}
                    className="cursor-pointer px-4.5 py-2.5 bg-white/5 border border-white/10 text-slate-200 hover:text-white rounded-xl text-xs font-mono font-bold hover:bg-white/10 transition-colors"
                  >
                    Explore Game Directory
                  </button>
                </>
              ) : (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-slate-500 border border-slate-800 mb-4">
                    <Gamepad2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-sans text-lg font-bold text-slate-200 mb-1">No Unblocked Cabinet Found</h3>
                  <p className="text-slate-400 text-xs font-sans max-w-sm leading-relaxed mb-6">
                    No cabinet met your matches for <strong className="text-emerald-400">"{searchQuery}"</strong>. Try checking your spelling or selecting other category tabs.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="cursor-pointer px-4.5 py-2.5 bg-white/5 border border-white/10 text-slate-200 hover:text-white rounded-xl text-xs font-mono font-bold hover:bg-white/10 transition-colors"
                  >
                    Reset Grid filters
                  </button>
                </>
              )}
            </div>
          ) : (
            /* ACTIVE CARDS GRID */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" id="games-bento-grid">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  isFavorite={userPrefs.favorites.includes(game.id)}
                  onPlay={handlePlayGame}
                  onToggleFavorite={handleCardToggleFavorite}
                />
              ))}
            </div>
          )}
        </section>



      </main>

      {/* FOOTER BAR BANNER */}
      <footer className="w-full border-t border-white/10 glass py-8 px-4 text-center mt-12 text-xs font-mono text-slate-500" id="hasanos-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Gamepad2 className="w-4 h-4 text-slate-500" />
            <span>HASANOS UNBLOCKED GAMES © 2026. All rights secured.</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <span>Server Ingress Route : Port 3000</span>
            <div className="w-1 h-3 bg-white/15"></div>
            <span>Type : Client SPA Arcades</span>
          </div>
        </div>
      </footer>

      {/* COMPONENT DRAWER DISPLAY: PLAYTHEATER PANEL OVERLAY */}
      {activeGame && (
        <PlayTheater
          game={activeGame}
          isFavorite={userPrefs.favorites.includes(activeGame.id)}
          onClose={() => setActiveGame(null)}
          onToggleFavorite={handleToggleFavorite}
          onDeleteGame={handleDeleteGame}
        />
      )}


    </div>
  );
}
