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
  // Customized game cabinets state
  const [typedGames, setTypedGames] = useState(() => {
    const saved = localStorage.getItem('hasanos_arcade_games_custom');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return []; // Completely empty by default
  });

  useEffect(() => {
    localStorage.setItem('hasanos_arcade_games_custom', JSON.stringify(typedGames));
  }, [typedGames]);

  // Modal setup
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState('Arcade');
  const [newThumb, setNewThumb] = useState('gradient-violet');
  const [newInstr, setNewInstr] = useState('');
  const [newYear, setNewYear] = useState(2026);

  const handleAddGame = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const newGame = {
      id: 'custom-' + Date.now(),
      title: newTitle.trim(),
      description: newDesc.trim() || 'A custom unblocked play cabinet.',
      iframeUrl: newUrl.trim(),
      category: newCat,
      tags: ['Custom', newCat],
      thumbnail: newThumb,
      instructions: newInstr.split('\n').map(x => x.trim()).filter(Boolean),
      plays: 0,
      rating: 5.0,
      likes: 0,
      releaseYear: parseInt(newYear) || 2026
    };

    setTypedGames((prev) => [...prev, newGame]);
    setShowAddModal(false);
    
    // Clear inputs
    setNewTitle('');
    setNewUrl('');
    setNewDesc('');
    setNewCat('Arcade');
    setNewThumb('gradient-violet');
    setNewInstr('');
    setNewYear(2026);
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

  const handleRestoreDemoGames = () => {
    const demoList = [
      {
        "id": "pacman",
        "title": "Google Pac-Man",
        "description": "The timeless retro arcade classic. Gobble up yellow dots, avoid the colorful ghosts (Blinky, Pinky, Inky, and Clyde), and aim for the high score inside the classic Google interactive board!",
        "iframeUrl": "https://macek.github.io/google_pacman/",
        "category": "Retro",
        "tags": ["Classic", "Retro", "Arcade", "High Score"],
        "thumbnail": "gradient-yellow",
        "instructions": [
          "Use Arrow Keys to guide Pac-Man.",
          "Eat Power Pellets (large dots) to turn ghosts blue and vulnerable.",
          "Eat fruits that appear near the center for bonus points.",
          "Avoid ghosts when they are in their normal state!"
        ],
        "plays": 14205,
        "rating": 4.9,
        "likes": 2420,
        "releaseYear": 1980
      },
      {
        "id": "2048",
        "title": "2048 puzzle",
        "description": "Combine falling and sliding numbered tiles on a grid to merge them into the legendary 2048 tile. A highly addictive mathematical slide puzzle requiring forward-thinking strategy.",
        "iframeUrl": "https://gabrielecirulli.github.io/2048/",
        "category": "Puzzle",
        "tags": ["Math", "Strategy", "Puzzle", "Highly Addictive"],
        "thumbnail": "gradient-gold",
        "instructions": [
          "Use Arrow keys or WASD to slide tiles in any direction.",
          "When two tiles with the same number touch, they merge into one with double the value!",
          "Plan your moves ahead to avoid filling the entire grid.",
          "Build up to the 2048 tile to win, then keep going to chase your ultimate high score."
        ],
        "plays": 11840,
        "rating": 4.8,
        "likes": 1928,
        "releaseYear": 2014
      },
      {
        "id": "clumsy-bird",
        "title": "Clumsy Bird",
        "description": "Fly through hazardous custom brick obstacles as a cute, clumsy bird! A visually rich HTML5 clone of the iconic Flappy Bird game featuring pixel-perfect graphics and responsive control.",
        "iframeUrl": "https://ellisonleao.github.io/clumsy-bird/",
        "category": "Arcade",
        "tags": ["Flappy", "Hard", "Arcade", "Flying"],
        "thumbnail": "gradient-emerald",
        "instructions": [
          "Click the screen or press the Spacebar to flap your wings and fly upwards.",
          "Let go to dive downwards.",
          "Squeeze carefully through the gaps in the green brick towers.",
          "Every gap successfully cleared awards 1 point. Go for a high score!"
        ],
        "plays": 9520,
        "rating": 4.6,
        "likes": 1210,
        "releaseYear": 2013
      },
      {
        "id": "hextris",
        "title": "Hextris Puzzle",
        "description": "An intense, fast-paced puzzle game inspired by Tetris. Rotate a hexagon and stack colored blocks arriving from all directions. Clear blocks by aligning three or more of the same color.",
        "iframeUrl": "https://hextris.github.io/hextris/",
        "category": "Puzzle",
        "tags": ["Tetris", "Hexagon", "Puzzle", "Fast-Paced"],
        "thumbnail": "gradient-pink",
        "instructions": [
          "Use Left and Right Arrow keys (or A and D) to rotate the center hexagon.",
          "Match 3 or more blocks of the same color on adjacent outer faces to destroy them.",
          "Earn huge combo multipliers by triggering multiple matches in a row.",
          "Do not let the stacked blocks expand beyond the outer grey boundary ring!"
        ],
        "plays": 7450,
        "rating": 4.7,
        "likes": 1050,
        "releaseYear": 2014
      },
      {
        "id": "doodle-jump",
        "title": "Doodle Jump",
        "description": "Bounce automatically from platform to platform, shooting monsters and grabbing jetpacks to propel yourself higher and higher in an infinite vertical climbing adventure!",
        "iframeUrl": "https://earth96.github.io/doodle-jump/",
        "category": "Action",
        "tags": ["Jump", "Infinite", "Platformer", "Action"],
        "thumbnail": "gradient-cyan",
        "instructions": [
          "Use Left and Right Arrow Keys (or tilt controls) to steer. You wrap around screen edges!",
          "Collect jetpacks, hats, and trampolines to get massive vertical boosts.",
          "Avoid yellowing, breaking, or trick shifting platforms.",
          "Tap Spacebar to fire projectiles up at aliens and monsters!"
        ],
        "plays": 12340,
        "rating": 4.5,
        "likes": 1845,
        "releaseYear": 2009
      },
      {
        "id": "asteroids",
        "title": "Retro Asteroids",
        "description": "Drive a vector triangular spacecraft through a field of floating space pebbles and enemy flying saucers. Clear the space sector by breaking down and shooting big asteroids into debris.",
        "iframeUrl": "https://dmcinnes.github.io/HTML5-Asteroids/",
        "category": "Retro",
        "tags": ["Space", "Vector", "Classic", "Shooter"],
        "thumbnail": "gradient-slate",
        "instructions": [
          "Use Left and Right Arrow keys to rotate your spaceship.",
          "Press Up Arrow to apply forward thrust.",
          "Press Spacebar to fire lasers.",
          "Press Down Arrow to make a panic jump into Hyperspace (unsafe!).",
          "Avoid colliding with floating rocky fragments and enemy saucer shots."
        ],
        "plays": 5830,
        "rating": 4.4,
        "likes": 840,
        "releaseYear": 1979
      },
      {
        "id": "breakout",
        "title": "Brick Breakout",
        "description": "An elegant, canvas-based arcade classic of block destruction. Bounce a steel ball off your paddle to shatter standard brick grid matrices without letting it hit the ground.",
        "iframeUrl": "https://mdn.github.io/canvas-breakout-game/",
        "category": "Arcade",
        "tags": ["Classic", "Breakout", "Physics", "Canvas"],
        "thumbnail": "gradient-orange",
        "instructions": [
          "Move the paddle with your Mouse or Left and Right Arrow keys.",
          "Bounce the ball back up to destroy colored blocks.",
          "Angle your collisions by striking the ball near the edges of the paddle.",
          "Clear all bricks to advance. Lose all lives if the ball hits the floor!"
        ],
        "plays": 6540,
        "rating": 4.3,
        "likes": 720,
        "releaseYear": 1976
      },
      {
        "id": "native-snake",
        "title": "Hasan's Retro Arcade Snake",
        "description": "A responsive, arcade-perfect 8-bit snake game built natively. Navigate the neon grid to chew down apples, grow longer, unlock speed-boost achievements, and avoid crash collisions with walls or yourself!",
        "iframeUrl": "NATIVE",
        "category": "Retro",
        "tags": ["Snake", "Classic", "High-FPS", "Native"],
        "thumbnail": "gradient-violet",
        "instructions": [
          "Use Arrow Keys (or WASD / Swipe) to change the directions of the snake.",
          "Don't run into the game grid borders or your own body!",
          "Eat red apples to score points and grow longer.",
          "Golden apples appear occasionally for high-bonus action and temporary slow-downs."
        ],
        "plays": 16500,
        "rating": 4.95,
        "likes": 3110,
        "releaseYear": 2026,
        "isNative": true
      },
      {
        "id": "native-pong",
        "title": "Hasan's Retro Physics Pong",
        "description": "A high-fidelity retro paddle hockey game. Play against an intelligent computer AI with full bounce physics, variable speed deflects, retro sound wave fx, and a responsive arcade screen.",
        "iframeUrl": "NATIVE",
        "category": "Sports",
        "tags": ["Pong", "Sports", "Physics", "Native"],
        "thumbnail": "gradient-rose",
        "instructions": [
          "Move your paddle using the Mouse (move cursor up/down) or Arrow Keys.",
          "Deflect the ball past the opponent's boundary line to score points.",
          "Angle the bounce by moving the paddle while striking the ball.",
          "The first player to score 7 points wins the match!"
        ],
        "plays": 8430,
        "rating": 4.8,
        "likes": 1140,
        "releaseYear": 2026,
        "isNative": true
      }
    ];
    setTypedGames(demoList);
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

            {/* Quick Bored Button Trigger widget */}
            <div className="flex flex-col gap-2.5 items-center shrink-0 w-full md:w-auto" id="hero-launcher-box">
              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center md:justify-start">
                <button
                  onClick={handlePickRandomGame}
                  className="cursor-pointer flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-black rounded-full shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 active:scale-95 transition-all outline-none"
                  id="hero-boredom-btn"
                >
                  <Shuffle className="w-4 h-4 text-white stroke-[3]" />
                  RANDOM LAUNCH
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="cursor-pointer flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-mono text-xs font-black rounded-full transition-all active:scale-95 outline-none"
                >
                  + INSTALL CABINET
                </button>
              </div>
              
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Leaderboard reviews integrated</span>
              </div>
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
                    <button
                      onClick={handleRestoreDemoGames}
                      className="cursor-pointer px-6 py-3 bg-white/5 border border-white/10 text-indigo-300 hover:bg-white/10 hover:text-indigo-200 rounded-xl text-xs font-mono font-bold transition-all"
                    >
                      Restore Demo Cabinets
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

        {/* INTUITION MANUAL CORNER (Adding games info instructions) */}
        {!searchQuery ? (
          <section className="mt-8 border-t border-white/5 pt-8" id="education-section">
            <div className="p-5 rounded-2xl glass flex flex-col md:flex-row items-start gap-4">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/15">
                <Info className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-sans text-sm font-black text-slate-100 mb-1 flex items-center gap-1.5">
                  HASANOS ARCHIVE ARCHITECTURE
                  <span className="bg-indigo-950/40 text-indigo-300 text-[9px] font-mono border border-indigo-500/25 px-1.5 py-0.5 rounded uppercase font-black tracking-widest">
                    SYSTEM INFO
                  </span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  The active frames on this arcade system are loaded dynamically from <strong>games.json</strong>.
                  Developers can easily expand HASANOS catalog database at any time by editing the directory configuration and appending additional embeddable Iframe target URLs!
                </p>
                <div className="mt-3.5 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span>9 Cabinets Loaded</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>2 Native Performance Titles inside</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

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

      {/* CUSTOM ADD GAME CABINET MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5">
              <h3 className="font-sans text-base font-black text-white flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-indigo-400" />
                INSTALL RETRO CABINET
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Scrollable Wrapper */}
            <form onSubmit={handleAddGame} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-mono font-black text-indigo-400 uppercase tracking-wider mb-1.5">Game Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Slope Unblocked"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500/50 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-black text-indigo-400 uppercase tracking-wider mb-1.5">Game Embed/Iframe URL *</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example-arcade.github.io/slope/"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500/50 outline-none transition-all"
                />
                <span className="text-[10px] font-mono text-slate-500 block mt-1">Provide any HTML5 game URL, emulator page, or iframe unblocked link.</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-black text-indigo-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-sm text-slate-200 focus:border-indigo-500/50 outline-none"
                  >
                    <option value="Arcade">Arcade</option>
                    <option value="Action">Action</option>
                    <option value="Puzzle">Puzzle</option>
                    <option value="Retro">Retro</option>
                    <option value="Sports">Sports</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-black text-indigo-400 uppercase tracking-wider mb-1.5">Release Year</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-slate-100 focus:border-indigo-500/50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-black text-indigo-400 uppercase tracking-wider mb-1.5">Cabinet Theme Color</label>
                <div className="grid grid-cols-5 gap-2 mt-1">
                  {[
                    { id: 'gradient-yellow', label: 'Yellow' },
                    { id: 'gradient-gold', label: 'Gold' },
                    { id: 'gradient-emerald', label: 'Green' },
                    { id: 'gradient-pink', label: 'Pink' },
                    { id: 'gradient-cyan', label: 'Cyan' },
                    { id: 'gradient-slate', label: 'Slate' },
                    { id: 'gradient-orange', label: 'Orange' },
                    { id: 'gradient-violet', label: 'Violet' },
                    { id: 'gradient-rose', label: 'Rose' }
                  ].map((grad) => (
                    <button
                      key={grad.id}
                      type="button"
                      onClick={() => setNewThumb(grad.id)}
                      className={`h-8 rounded-lg relative border-2 ${
                        newThumb === grad.id ? 'border-white' : 'border-transparent'
                      } ${
                        grad.id === 'gradient-yellow' ? 'bg-gradient-to-r from-amber-400 to-red-600' :
                        grad.id === 'gradient-gold' ? 'bg-gradient-to-r from-yellow-500 to-amber-700' :
                        grad.id === 'gradient-emerald' ? 'bg-gradient-to-r from-emerald-400 to-teal-700' :
                        grad.id === 'gradient-pink' ? 'bg-gradient-to-r from-pink-500 to-indigo-700' :
                        grad.id === 'gradient-cyan' ? 'bg-gradient-to-r from-cyan-400 to-blue-700' :
                        grad.id === 'gradient-slate' ? 'bg-gradient-to-r from-slate-600 to-slate-900' :
                        grad.id === 'gradient-orange' ? 'bg-gradient-to-r from-orange-400 to-rose-700' :
                        grad.id === 'gradient-violet' ? 'bg-gradient-to-r from-violet-500 to-fuchsia-800' :
                        'bg-gradient-to-r from-rose-500 to-red-700'
                      }`}
                      title={grad.label}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-black text-indigo-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows="2"
                  placeholder="Short description or tagline..."
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500/50 outline-none resize-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-black text-indigo-400 uppercase tracking-wider mb-1.5 flex justify-between items-center">
                  <span>How to Play (One instruction per line)</span>
                  <span className="text-[9px] text-slate-500 font-normal">Optional</span>
                </label>
                <textarea
                  value={newInstr}
                  onChange={(e) => setNewInstr(e.target.value)}
                  rows="3"
                  placeholder="e.g., Use WASD or arrows to steer&#10;Dodge red obstacles&#10;Aim for higher scores"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500/50 outline-none resize-none transition-all font-mono"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 rounded-xl text-xs font-mono font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  Install Cabinet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
