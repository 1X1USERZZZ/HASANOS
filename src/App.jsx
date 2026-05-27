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



const defaultGames = [
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
      "Be quick and precise to beat the active timer."
    ],
    plays: 1205,
    rating: 4.8,
    likes: 185,
    releaseYear: 2024
  },
  {
    id: "geometry-arrow",
    title: "Geometry Arrow",
    description: "Ride, glide, and navigate through a neon obstacle course in this intensive rhythm reaction jumping game. Time your moves perfectly!",
    iframeUrl: "https://cdn.vietdp.com/file/vietdp-games/games/t52025/geometry-arrow-2/index.html",
    category: "Action",
    tags: ["Geometry Dash", "Rhythm", "Hard", "Reaction"],
    thumbnail: "gradient-pink",
    instructions: [
      "Click, tap, or press Spacebar to bounce or shift directions upwards.",
      "Release to drop down or balance your path.",
      "Dodge hazardous wall triangles and floating spikes.",
      "Keep steady focus to clear successive speed checkpoints!"
    ],
    plays: 1540,
    rating: 4.9,
    likes: 215,
    releaseYear: 2025
  },
  {
    id: "melon-playground",
    title: "Melon Playground",
    description: "Unleash your creativity and experiment with characters, weapons, and physics in this fun sandbox simulator playground!",
    iframeUrl: "https://cdn.vietdp.com/file/vietdp-games/games/t52025/melon-playground/index.html",
    category: "Sandbox",
    tags: ["Sandbox", "Physics", "Simulator", "Fun"],
    thumbnail: "gradient-emerald",
    instructions: [
      "Use your Mouse/Touch to select and interact with characters or items.",
      "Spawn custom items and drag them on the active field.",
      "Observe cool physics-driven reactions inside the digital arena!"
    ],
    plays: 2310,
    rating: 4.7,
    likes: 310,
    releaseYear: 2025
  },
  {
    id: "geometry-dash",
    title: "Geometry Dash",
    description: "Navigate high-speed, rhythm-based hazard courses and time your leaps perfectly with intense soundtracks in Geometry Dash!",
    iframeUrl: "https://unblocked-games.s3.amazonaws.com/games/2023/q2/geometry-dash-freezenova/index.html",
    category: "Action",
    tags: ["Rhythm", "Platformer", "Hard", "Skill", "Dash"],
    thumbnail: "gradient-cyan",
    instructions: [
      "Click or tap the screen to complete jump movements.",
      "Hold to perform consecutive leaps.",
      "Prepare for almost impossible paths filled with spikes and portal shifts!",
      "Hone your reaction times with high energy music guides."
    ],
    plays: 4320,
    rating: 4.9,
    likes: 395,
    releaseYear: 2023
  },
  {
    id: "gunspin",
    title: "Gunspin",
    description: "Shoot your way to victory by spinning your firearm in mid-air through weapon thrust mechanics! Spend coins to upgrade and unlock powerful weapons.",
    iframeUrl: "https://htmlxm.github.io/h/gunspin/",
    category: "Action",
    tags: ["Shooting", "Physics", "Upgrades", "Spin", "Skill"],
    thumbnail: "gradient-yellow",
    instructions: [
      "Click or tap anywhere on the screen to fire your gun.",
      "Each shot triggers a powerful backwards recoil thrust vectoring.",
      "Time your shots as the gun spins to push it further to the right!",
      "Collect coin milestones and chests to purchase upgraded firearms."
    ],
    plays: 3890,
    rating: 4.8,
    likes: 312,
    releaseYear: 2023
  },
  {
    id: "crazy-roll-3d",
    title: "Crazy Roll 3D",
    description: "Speed through dynamic slopes and narrow tracks in this high speed 3D tumbling physics ball race! Dodge obstacles, collect neon gems, and don't fall off.",
    iframeUrl: "https://vaxtangi1980.github.io/crazy/",
    category: "Action",
    tags: ["Speed", "3D", "Physics", "Avoid", "Slope"],
    thumbnail: "gradient-indigo",
    instructions: [
      "Use Arrow/WASD keys or drag mouse to steer your rolling ball.",
      "Dodge moving and stationary red obstacles and blocks.",
      "Collect neon gems to save progress and unlock cool ball skins.",
      "Speed up on booster tracks and time your ramp jumps beautifully!"
    ],
    plays: 5120,
    rating: 4.9,
    likes: 421,
    releaseYear: 2023
  },
  {
    id: "time-shooter-3-swat",
    title: "Time Shooter 3: SWAT",
    description: "Time moves only when you move in this tactical SWAT shooter simulation! Plan your breaches, dodge enemy fire in super slow motion, and rescue hostaged agents.",
    iframeUrl: "https://classroomjq.github.io/class2623/time-shooter-3-swat/",
    category: "Action",
    tags: ["Shooter", "Tactical", "3D", "Slow-Motion", "SWAT"],
    thumbnail: "gradient-blue",
    instructions: [
      "Use WASD keys or Arrow keys to move around.",
      "Move your Mouse to aim and click Left-Click to shoot.",
      "Time is almost frozen when you stand perfectly still—use this to map your trajectory!",
      "Pick up dropped weapons with F and throw items/weapons with Right-Click."
    ],
    plays: 6410,
    rating: 4.9,
    likes: 512,
    releaseYear: 2023
  }
];

export default function App() {
  // Auto-clear old local cached games lists so they never reappear
  useEffect(() => {
    localStorage.removeItem('hasanos_arcade_games_custom');
    localStorage.removeItem('hasanos_arcade_games_custom_v1');
    localStorage.removeItem('hasanos_arcade_games_custom_v2');
    localStorage.removeItem('hasanos_arcade_games_user_v5');
    localStorage.removeItem('hasanos_arcade_games_user_v6');
    localStorage.removeItem('hasanos_arcade_games_user_v7');
    localStorage.removeItem('hasanos_arcade_games_user_v8');
    localStorage.removeItem('hasanos_arcade_games_user_v9');
    localStorage.removeItem('hasanos_arcade_games_user_v10');
    localStorage.removeItem('hasanos_arcade_games_user_v11');
    localStorage.removeItem('hasanos_arcade_games_user_v12');
  }, []);

  // Customized game cabinets state using a fresh pristine key V13
  const [typedGames, setTypedGames] = useState(() => {
    const saved = localStorage.getItem('hasanos_arcade_games_user_v13');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    // Only the user's specific requested basket hoop, geometry arrow, melon playground, geometry-dash, gunspin, crazy-roll-3d, and time-shooter-3-swat games sit here by default
    return defaultGames;
  });

  useEffect(() => {
    localStorage.setItem('hasanos_arcade_games_user_v13', JSON.stringify(typedGames));
  }, [typedGames]);

  const handleRestoreDefaults = () => {
    setTypedGames(defaultGames);
  };



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

            {/* Left Action Box */}
            <div className="flex-1 flex flex-col gap-3 items-center md:items-start text-center md:text-left">
              <span className="font-mono text-xs font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-1.5 justify-center md:justify-start">
                <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
                DODGE STUDY HALL BOREDOM
              </span>
              <p className="text-slate-400 text-xs md:text-sm font-sans max-w-md leading-relaxed mb-1">
                Tap to instantly play handpicked unblocked sandbox simulator, arcade sports, and rhythm course titles on HASANOS!
              </p>
            </div>

            {/* Right Header Area: GAMES HASANOSGAMES UNBLOCKED (GAMES in white) */}
            <div className="flex flex-col text-center md:text-right items-center md:items-end justify-center select-none" id="main-desktop-banner">
              <h2 className="font-sans text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
                GAMES
              </h2>
              <span className="font-sans text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-[#818cf8] mt-2.5 leading-none">
                HASANOSGAMES UNBLOCKED
              </span>
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
                    You've successfully cleared all active cabinets. Reset to the pristine unblocked versions anytime!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleRestoreDefaults}
                      className="cursor-pointer px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-black shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
                    >
                      Restore Default Cabinets
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
