/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Heart,
  Maximize2,
  Minimize2,
  X,
  ThumbsUp,
  ThumbsDown,
  Star,
  Send,
  Wrench,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import NativeSnake from './native/NativeSnake';
import NativePong from './native/NativePong';

export default function PlayTheater({
  game,
  isFavorite,
  onClose,
  onToggleFavorite,
  onDeleteGame,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userRating, setUserRating] = useState(() => {
    return localStorage.getItem(`hasanos_rating_${game.id}`) || null;
  });
  const [likesCount, setLikesCount] = useState(game.likes);
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newStars, setNewStars] = useState(5);
  const [newScore, setNewScore] = useState('');

  // Initial mock comments for realistic arcade environment feel
  const initialComments = {
    pacman: [
      { username: "HasanOS_Fan", avatar: "🤖", stars: 5, comment: "I scored 142k! This is completely unblocked at school. Thanks HASANOS!", timestamp: "2 mins ago", scoreReport: "Score: 142,390" },
      { username: "NoobMaster", avatar: "👾", stars: 4, comment: "Blinky speed is insane in later stages. Classic!", timestamp: "1 hour ago" },
      { username: "ProGamerKyle", avatar: "🎮", stars: 5, comment: "Zero delay compared to other websites, runs flawlessly", timestamp: "Yesterday" }
    ],
    "2048": [
      { username: "MathWhiz", avatar: "🔢", stars: 5, comment: "Finally got 2048 tile after 3 weeks of trying on study halls!", timestamp: "10 mins ago", scoreReport: "Tile: 2048" },
      { username: "Alice_unlocked", avatar: "🌸", stars: 5, comment: "So addictive, plays beautifully in this console", timestamp: "3 hours ago" }
    ],
    "clumsy-bird": [
      { username: "FloppyKing", avatar: "🐦", stars: 5, comment: "My highscore is 93. Try beating that!", timestamp: "20 mins ago", scoreReport: "Score: 93 pipes" },
      { username: "JaggerX", avatar: "⚡", stars: 3, comment: "Too hard! But looks super cute.", timestamp: "Yesterday" }
    ],
    hextris: [
      { username: "HexMaster", avatar: "💠", stars: 5, comment: "The rotating mechanic is so trippy and fun!", timestamp: "4 hours ago", scoreReport: "Score: 24,000" }
    ],
    "native-snake": [
      { username: "Grid_Champion", avatar: "🐍", stars: 5, comment: "Wait, this native version is SO smooth! The slow-down golden apples are a cool addition.", timestamp: "5 mins ago", scoreReport: "Score: 210" },
      { username: "ArcadeOS_Fan", avatar: "👑", stars: 5, comment: "Insanely low response time. Golden standard!!", timestamp: "5 hours ago" }
    ],
    "native-pong": [
      { username: "PongStar_Pro", avatar: "🏓", stars: 5, comment: "This Bot has some seriously clever defense! Beating him felt amazing.", timestamp: "12 mins ago", scoreReport: "Match: Player (7) vs Bot (4)" },
      { username: "LagFreeGamer", avatar: "☄️", stars: 5, comment: "The sound effects are just like real old arcade machines", timestamp: "1 day ago" }
    ],
    "geometry-dash": [
      { username: "Rhythm_Rider", avatar: "⚡", stars: 5, comment: "This runs extremely fast! Love having Geometry Dash completely unblocked.", timestamp: "5 mins ago", scoreReport: "Progress: 84%" },
      { username: "StereoMadness", avatar: "🎮", stars: 5, comment: "Beat Stereo Madness! The response time here has absolutely no input lag.", timestamp: "45 mins ago", scoreReport: "100% Stereo Madness" },
      { username: "SchoolTimeGamer", avatar: "👑", stars: 4, comment: "Best time spent in study hall hands down. Great addition to HASANOS!", timestamp: "6 hours ago" }
    ],
    "gunspin": [
      { username: "Recoil_Rider", avatar: "🔫", stars: 5, comment: "Love the upgrades store in this! Spent hours clicking.", timestamp: "1 min ago", scoreReport: "Score: 1,845 meters" },
      { username: "Physics_Pro", avatar: "🎯", stars: 5, comment: "Golden revolver behaves so perfectly with that backward recoil thrust!", timestamp: "18 mins ago" },
      { username: "DeagleDream", avatar: "🚀", stars: 5, comment: "Completely unblocked on this school Chromebook. Massive thanks HASANOS!", timestamp: "2 hours ago" }
    ],
    "crazy-roll-3d": [
      { username: "SlopeSurfer", avatar: "🔮", stars: 5, comment: "This is hands down the best unblocked game ever! Level 8 is insane.", timestamp: "4 mins ago", scoreReport: "Score: 1,240 gems" },
      { username: "TumbleRoller", avatar: "💫", stars: 5, comment: "Extremely addictive! The fluid frame rate makes it very satisfying to dodge red barriers.", timestamp: "22 mins ago" },
      { username: "ChromebookChampion", avatar: "👑", stars: 5, comment: "Controls are ultra responsive. Loving this brand new addition!", timestamp: "1 hour ago" }
    ],
    "time-shooter-3-swat": [
      { username: "SWAT_Breacher", avatar: "🛡️", stars: 5, comment: "This SWAT shooter is incredible! Love how time stands still until you move.", timestamp: "1 min ago", scoreReport: "Level: SWAT Force (12)" },
      { username: "SlowMoSniper", avatar: "🎯", stars: 5, comment: "Snatching weapons off the floor in slow motion feels like absolute Matrix style actions.", timestamp: "15 mins ago" },
      { username: "ChromeGamer", avatar: "👾", stars: 5, comment: "Runs wonderfully without a single frame drop. Perfect study hall killer!", timestamp: "3 hours ago" }
    ]
  };

  // Load reviews on game select
  useEffect(() => {
    const saved = localStorage.getItem(`hasanos_reviews_${game.id}`);
    if (saved) {
      setReviews(JSON.parse(saved));
    } else {
      const defaults = initialComments[game.id] || [
        { username: "Casual_Gamer", avatar: "😊", stars: 4, comment: "Nice game! Glad it is unblocked and fast.", timestamp: "2 hours ago" }
      ];
      setReviews(defaults);
    }
    // Set matching like state
    const currentRating = localStorage.getItem(`hasanos_rating_${game.id}`);
    if (currentRating === 'like') {
      setLikesCount(game.likes + 1);
    } else {
      setLikesCount(game.likes);
    }
    // Reset forms
    setNewComment('');
    setNewUsername('');
    setNewStars(5);
    setNewScore('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.id]);

  const handleRating = (rating) => {
    if (userRating === rating) {
      // Clear rating
      setUserRating(null);
      localStorage.removeItem(`hasanos_rating_${game.id}`);
      setLikesCount(game.likes);
    } else {
      // Set new rating
      setUserRating(rating);
      localStorage.setItem(`hasanos_rating_${game.id}`, rating);
      if (rating === 'like') {
        setLikesCount(game.likes + 1);
      } else {
        setLikesCount(game.likes - 1);
      }
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const fresh = {
      username: newUsername.trim() || 'Anonymous Gamer',
      avatar: ['🎮', '👾', '🤖', '👑', '⭐', '🐍', '🚀', '🔮'][Math.floor(Math.random() * 8)],
      stars: newStars,
      comment: newComment.trim(),
      timestamp: 'Just now',
      scoreReport: newScore.trim() ? `Reported: ${newScore}` : undefined
    };

    const updated = [fresh, ...reviews];
    setReviews(updated);
    localStorage.setItem(`hasanos_reviews_${game.id}`, JSON.stringify(updated));

    // Reset fields
    setNewComment('');
    setNewUsername('');
    setNewScore('');
    setNewStars(5);
  };

  const toggleFullscreen = () => {
    const parentElem = document.getElementById('play-theater-root');
    if (!parentElem) return;

    if (!document.fullscreenElement) {
      parentElem.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Error enabling HTML5 full screen:", err);
        setIsFullscreen(true); // Fallback
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.error("Error exiting full screen:", err);
        setIsFullscreen(false);
      });
    }
  };

  // Synchronise with escape key triggers or hardware native changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col mesh-bg text-slate-100 transition-all ${
        isFullscreen ? 'p-0 w-full h-full overflow-hidden' : 'p-4 md:p-8 overflow-y-auto'
      }`}
      id="play-theater-root"
    >
      {/* Outer bounding box for default embedded mode */}
      <div className={`mx-auto w-full max-w-7xl flex flex-col ${isFullscreen ? 'h-full max-w-none' : 'gap-6'}`}>
        
        {/* UPPER PANEL: CONTROL HUD */}
        <div className={`flex items-center justify-between glass p-4 ${
          isFullscreen ? 'border-b border-white/10 px-6 shadow bg-slate-905' : 'rounded-2xl'
        }`} id="theater-hud">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-black px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg select-none">
              ARCADE ACTIVE
            </span>
            <h2 className="font-sans text-lg font-black tracking-tight" id="theater-game-title">
              {game.title}
            </h2>
          </div>

          {/* Floating Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`p-2 cursor-pointer rounded-lg border transition-all ${
                isFavorite
                  ? 'bg-rose-950/40 border-rose-500 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              title="Favorite this game"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 cursor-pointer bg-white/5 hover:bg-indigo-600/20 text-slate-400 hover:text-white rounded-lg border border-white/10 transition-all"
              title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-indigo-400" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 cursor-pointer bg-white/5 hover:bg-red-950/40 hover:border-red-500 hover:text-red-400 text-slate-400 rounded-lg border border-white/10 transition-all"
              title="Quit Game"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* GAME CONTENT SCREEN (Takes 100% width for huge display!) */}
        <div 
          className={`relative border border-white/10 bg-slate-950 shadow-2xl flex items-center justify-center transition-all ${
            isFullscreen 
              ? 'flex-1 w-full h-full rounded-none border-0' 
              : 'w-full rounded-2xl aspect-video min-h-[380px] md:min-h-[580px] lg:min-h-[660px]'
          }`} 
          id="game-stage-wrapper"
        >
          {game.isNative ? (
            <div className="w-full h-full flex items-center justify-center p-4 bg-slate-950 overflow-y-auto">
              {game.id === 'native-snake' ? <NativeSnake /> : <NativePong />}
            </div>
          ) : (
            <iframe
              src={game.iframeUrl}
              title={game.title}
              className="w-full h-full border-0 block"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; webcam; microphone; focus-without-user-activation; fullscreen"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock"
              referrerPolicy="no-referrer"
              id="game-iframe-element"
            />
          )}
        </div>

        {/* BOTTOM METADATA & REVIEWS & RATINGS (Rendered below only when not in fullscreen mode) */}
        {!isFullscreen && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="theater-details-section">
            
            {/* LEFT BENTO PANEL (Stats, Likes/Stars, Instructions): spans 5 cols out of 12 */}
            <div className="lg:col-span-5 flex flex-col gap-6" id="theater-details-left">
              {/* Ratings and Likes Header element */}
              <div className="glass p-5 rounded-2xl flex items-center justify-between shadow-lg" id="bento-likes-stars">
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest font-black block">USER APPROVAL</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRating('like')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 cursor-pointer rounded-lg font-mono text-xs font-bold border transition-all ${
                        userRating === 'like'
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                          : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-755'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4 fill-current" />
                      <span>{likesCount} Likes</span>
                    </button>
                    <button
                      onClick={() => handleRating('dislike')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 cursor-pointer rounded-lg font-mono text-xs font-bold border transition-all ${
                        userRating === 'dislike'
                          ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                          : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white'
                      }`}
                      title="Dislike"
                    >
                      <ThumbsDown className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest font-black block">CRITIC RATING</span>
                  <div className="flex items-center gap-1 text-amber-400 text-sm font-mono font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{game.rating} / 5.0</span>
                  </div>
                </div>
              </div>

              {/* Game Instructions box */}
              <div className="glass p-5 rounded-2xl flex flex-col gap-3 shadow-lg" id="bento-game-instructions">
                <span className="font-mono text-[10px] text-indigo-400 font-black tracking-wider uppercase flex items-center gap-1.5">
                  <Wrench className="w-4 h-4" />
                  How to Play & Controls
                </span>
                <ul className="text-sm text-slate-300 font-sans list-disc list-inside space-y-2 pl-1">
                  {game.instructions.map((inst, idx) => (
                    <li key={idx} className="leading-relaxed">{inst}</li>
                  ))}
                </ul>
              </div>

              {/* Game Info Details box */}
              <div className="glass p-5 rounded-2xl flex flex-col gap-3 shadow-lg" id="bento-game-info">
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest font-black block">ARCHIVE RECORDS</span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {game.description}
                </p>
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3.5 mt-1 font-mono text-xs text-slate-400">
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-[10px]">TOTAL ARCHIVE PLAYS</span>
                    <strong className="text-white text-base mt-0.5">{(game.plays + 23).toLocaleString()}</strong>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-[10px]">INITIAL RELEASE</span>
                    <strong className="text-white text-base mt-0.5">{game.releaseYear}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT BENTO PANEL (Comments Forum & Add Review): spans 7 cols out of 12 */}
            <div className="lg:col-span-7 flex flex-col glass rounded-2xl overflow-hidden shadow-lg" id="theater-details-right">
              <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <span className="font-mono text-xs font-black text-indigo-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  HASANOS Gamer Board Reviews
                </span>
                <span className="text-xs font-mono text-indigo-400 font-bold bg-indigo-950/40 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                  {reviews.length} Comments
                </span>
              </div>

              {/* Scrollable comments panel */}
              <div className="p-5 flex-1 max-h-[400px] overflow-y-auto flex flex-col gap-4" id="board-reviews-feed">
                {reviews.length === 0 ? (
                  <p className="text-slate-500 text-xs italic py-8 text-center">No scores reported yet. Be the first to leave a review!</p>
                ) : (
                  reviews.map((rev, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base select-none">{rev.avatar}</span>
                          <span className="font-mono text-xs font-bold text-slate-200">{rev.username}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{rev.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed pt-0.5">{rev.comment}</p>
                      {rev.scoreReport && (
                        <div className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-950/40 border border-indigo-500/20 px-2.5 py-0.5 rounded w-max mt-1">
                          🏆 {rev.scoreReport}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Comment submission form */}
              <form onSubmit={handleAddReview} className="p-4 bg-white/5 border-t border-white/5 flex flex-col gap-3" id="bento-review-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] text-slate-500 tracking-wider font-extrabold uppercase">your name</label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="e.g. Gamer_99..."
                      maxLength={18}
                      className="px-3 py-2 bg-slate-950 text-xs font-mono border border-white/5 text-slate-200 placeholder-slate-600 rounded-lg focus:border-indigo-500 outline-none w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] text-slate-500 tracking-wider font-extrabold uppercase">report score</label>
                    <input
                      type="text"
                      value={newScore}
                      onChange={(e) => setNewScore(e.target.value)}
                      placeholder="e.g. score: 250... (optional)"
                      maxLength={20}
                      className="px-3 py-2 bg-slate-950 text-xs font-mono border border-white/5 text-slate-200 placeholder-slate-600 rounded-lg focus:border-indigo-500 outline-none w-full"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span>Your Stars:</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setNewStars(st)}
                          className="p-1 focus:outline-none hover:scale-125 active:scale-90 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              st <= newStars ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write helpful tips or report your final score..."
                    maxLength={150}
                    className="w-full text-xs font-sans pl-3.5 pr-11 py-2.5 bg-black/40 border border-white/10 focus:border-indigo-500 text-slate-200 placeholder-slate-500 rounded-xl outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute top-1.5 right-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg cursor-pointer transition-all duration-150 active:scale-90"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
