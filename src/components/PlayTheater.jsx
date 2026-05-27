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
  Smile,
  ShieldCheck,
  RotateCcw,
  Trash2
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
      { username: "HasanCore_99", avatar: "🤖", stars: 5, comment: "I scored 142k! This is completely unblocked at school. Thanks Hasan!", timestamp: "2 mins ago", scoreReport: "Score: 142,390" },
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
      { username: "ArcadeHasanFan", avatar: "👑", stars: 5, comment: "Insanely low response time. Golden standard!!", timestamp: "5 hours ago" }
    ],
    "native-pong": [
      { username: "PongStar_Pro", avatar: "🏓", stars: 5, comment: "This Bot has some seriously clever defense! Beating him felt amazing.", timestamp: "12 mins ago", scoreReport: "Match: Player (7) vs Bot (4)" },
      { username: "LagFreeGamer", avatar: "☄️", stars: 5, comment: "The sound effects are just like real old arcade machines", timestamp: "1 day ago" }
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

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col mesh-bg text-slate-100 transition-all ${
        isFullscreen ? 'p-0 w-full h-full' : 'p-4 md:p-8 overflow-y-auto'
      }`}
      id="play-theater-root"
    >
      {/* Outer bounding box for default embedded mode */}
      <div className={`mx-auto w-full max-w-7xl flex flex-col ${isFullscreen ? 'h-full max-w-none' : 'gap-6'}`}>
        
        {/* UPPER PANEL: CONTROL HUD */}
         <div className={`flex items-center justify-between glass p-4 ${
           isFullscreen ? 'border-b border-white/10 px-6 shadow' : 'rounded-2xl'
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
               onClick={() => setIsFullscreen(!isFullscreen)}
               className="p-2 cursor-pointer bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/10 transition-all"
               title={isFullscreen ? 'Exit Theater Mode' : 'Theater Mode'}
             >
               {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
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

         {/* MAIN INTERACTIVE SEGMENT */}
         <div className={`grid ${isFullscreen ? 'flex-1 h-0 grid-cols-1 md:grid-cols-4' : 'grid-cols-1 lg:grid-cols-3 gap-6'}`} id="theater-interactive-grid">
           {/* GAME SCREEN BOX */}
           <div className={`relative ${isFullscreen ? 'md:col-span-3 h-full' : 'lg:col-span-2 aspect-video min-h-[340px] md:min-h-[460px]'} border border-white/10 bg-slate-950 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center`} id="game-stage-wrapper">
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

           {/* PLAY SIDEBAR PANEL (Reviews Board / Game controller instructions) */}
           <div className={`flex flex-col glass rounded-2xl overflow-hidden ${
             isFullscreen ? 'md:col-span-1 h-full' : 'lg:col-span-1'
           }`} id="theater-sidebar">
             {/* Info & Rating Tab */}
             <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
               <div className="flex gap-2">
                 <button
                   onClick={() => handleRating('like')}
                   className={`flex items-center gap-1 px-3 py-1.5 cursor-pointer rounded-lg font-mono text-xs font-bold border transition-all ${
                     userRating === 'like'
                       ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                       : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white'
                   }`}
                 >
                   <ThumbsUp className="w-3.5 h-3.5 fill-current" />
                   <span>{likesCount}</span>
                 </button>
                 <button
                   onClick={() => handleRating('dislike')}
                   className={`flex items-center gap-1 px-3 py-1.5 cursor-pointer rounded-lg font-mono text-xs font-bold border transition-all ${
                     userRating === 'dislike'
                       ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                       : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white'
                   }`}
                   title="Dislike"
                 >
                   <ThumbsDown className="w-3.5 h-3.5 fill-current" />
                 </button>
               </div>
               
               <div className="flex items-center gap-1 text-amber-400 text-sm font-mono font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                 <span>{game.rating}</span>
               </div>
             </div>

             {/* Dynamic Scrolling Board content */}
             <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 min-h-[220px]" id="sidebar-scrolling-content">
               {/* Controls / Instructions section */}
               <div className="bg-white/5 border border-white/15 p-3.5 rounded-xl">
                 <span className="font-mono text-[10px] text-indigo-400 font-black tracking-wider uppercase flex items-center gap-1.5 mb-2.5">
                   <Wrench className="w-3.5 h-3.5" />
                   How to play & Controls
                 </span>
                 <ul className="text-xs text-slate-300 font-sans list-disc list-inside space-y-1">
                   {game.instructions.map((inst, idx) => (
                     <li key={idx} className="leading-relaxed">{inst}</li>
                   ))}
                 </ul>
               </div>

               {/* Reviews Section Title */}
               <div className="border-t border-slate-850 pt-3">
                 <span className="font-mono text-[10px] text-indigo-400 font-black tracking-wider uppercase flex items-center gap-1.5 mb-3">
                   <Sparkles className="w-3.5 h-3.5" />
                   Gamer Board Reviews
                 </span>

                 {/* Comments Feed list */}
                 <div className="flex flex-col gap-3 max-h-[280px] overflow-y-auto pr-1">
                   {reviews.length === 0 ? (
                     <p className="text-slate-500 text-xs italic py-4 text-center">No scores reported yet. Be the first!</p>
                   ) : (
                     reviews.map((rev, idx) => (
                       <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex flex-col gap-1.5">
                         <div className="flex items-center justify-between">
                           <div className="flex items-center gap-1.5">
                             <span className="text-sm select-none">{rev.avatar}</span>
                             <span className="font-mono text-xs font-bold text-slate-200">{rev.username}</span>
                           </div>
                           <span className="text-[9px] font-mono text-slate-500">{rev.timestamp}</span>
                         </div>
                         <div className="flex items-center gap-0.5">
                           {Array.from({ length: 5 }).map((_, i) => (
                             <Star
                               key={i}
                               className={`w-2.5 h-2.5 ${
                                 i < rev.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                               }`}
                             />
                           ))}
                         </div>
                         <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{rev.comment}</p>
                         {rev.scoreReport && (
                           <div className="text-[9px] font-mono text-indigo-400 font-bold bg-indigo-950/40 border border-indigo-500/20 px-2 py-0.5 rounded w-max">
                             🏆 {rev.scoreReport}
                           </div>
                         )}
                       </div>
                     ))
                   )}
                 </div>
               </div>
             </div>

             {/* Add Score & Review footer box */}
             <form onSubmit={handleAddReview} className="p-3 bg-white/5 border-t border-white/10 flex flex-col gap-2" id="comment-textbox">
               <div className="grid grid-cols-2 gap-1.5">
                 <input
                   type="text"
                   value={newUsername}
                   onChange={(e) => setNewUsername(e.target.value)}
                   placeholder="Your Name..."
                   maxLength={18}
                   className="px-2 py-1 bg-slate-950 text-[11px] font-mono border border-slate-800 text-slate-200 placeholder-slate-600 rounded focus:border-cyan-500 outline-none"
                 />
                 <input
                   type="text"
                   value={newScore}
                   onChange={(e) => setNewScore(e.target.value)}
                   placeholder="Report Score (Optional)..."
                   maxLength={20}
                   className="px-2 py-1 bg-slate-950 text-[11px] font-mono border border-slate-800 text-slate-200 placeholder-slate-600 rounded focus:border-cyan-500 outline-none"
                 />
               </div>
               
               <div className="flex items-center justify-between">
                 {/* mini star selector */}
                 <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                   <span>Stars:</span>
                   <div className="flex items-center">
                     {[1, 2, 3, 4, 5].map((st) => (
                       <button
                         key={st}
                         type="button"
                         onClick={() => setNewStars(st)}
                         className="p-0.5 focus:outline-none hover:scale-110 active:scale-95 transition-transform"
                       >
                         <Star
                           className={`w-3.5 h-3.5 ${
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
                   placeholder="Share review message or tips..."
                   maxLength={150}
                   className="w-full text-xs font-sans pl-3 pr-9 py-2 bg-black/40 border border-white/10 focus:border-indigo-500/50 text-slate-200 placeholder-slate-500 rounded-lg outline-none"
                 />
                 <button
                   type="submit"
                   className="absolute top-1 right-[5px] p-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded cursor-pointer transition-all duration-150 active:scale-90"
                 >
                   <Send className="w-3.5 h-3.5" />
                 </button>
               </div>
             </form>
           </div>
         </div>

         {/* LOWER SUMMARY DESCRIPTION BANNER */}
         {!isFullscreen && (
           <div className="glass p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4" id="theater-desc-footer">
             <div className="flex-1">
               <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest font-black block mb-1">ARCADE RECORD METRIC</span>
               <p className="text-xs text-slate-300 font-sans leading-relaxed">
                 {game.description}
               </p>
             </div>
             
             <div className="flex items-center gap-4 shrink-0 font-mono text-xs text-slate-400 md:border-l border-white/10 md:pl-6 px-1 py-1">
               <div className="flex flex-col">
                 <span>Plays Archive</span>
                 <strong className="text-white text-sm">{(game.plays + 23).toLocaleString()}</strong>
               </div>
               <div className="flex flex-col">
                 <span>Initial Release</span>
                 <strong className="text-white text-sm">{game.releaseYear}</strong>
               </div>
               <div className="flex items-center gap-1.5 bg-white/5 border border-white/15 px-3 py-2 rounded-xl text-indigo-400 text-[10px] font-bold">
                 <ShieldCheck className="w-4 h-4 text-indigo-400" />
                 <span>UNBLOCKED SECURE</span>
               </div>
             </div>
           </div>
         )}
      </div>
    </div>
  );
}
