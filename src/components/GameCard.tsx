/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Game } from '../types';
import { Heart, Play, Star, Eye } from 'lucide-react';
import { MouseEvent } from 'react';

interface GameCardProps {
  key?: string | number | null;
  game: Game;
  isFavorite: boolean;
  onPlay: (game: Game) => void;
  onToggleFavorite: (e: any, gameId: string) => void;
}

export default function GameCard({
  game,
  isFavorite,
  onPlay,
  onToggleFavorite,
}: GameCardProps) {
  // Translate gradient ID into Tailwind gradient backgrounds
  const getGradientStyle = (thumb: string) => {
    switch (thumb) {
      case 'gradient-yellow':
        return 'from-amber-400 via-orange-500 to-red-600 shadow-[0_0_20px_rgba(249,115,22,0.15)]';
      case 'gradient-gold':
        return 'from-yellow-500 via-amber-500 to-amber-700 shadow-[0_0_20px_rgba(245,158,11,0.15)]';
      case 'gradient-emerald':
        return 'from-emerald-400 via-green-500 to-teal-700 shadow-[0_0_20px_rgba(16,185,129,0.15)]';
      case 'gradient-pink':
        return 'from-pink-500 via-purple-600 to-indigo-700 shadow-[0_0_20px_rgba(219,39,119,0.15)]';
      case 'gradient-cyan':
        return 'from-cyan-400 via-sky-500 to-blue-700 shadow-[0_0_20px_rgba(6,182,212,0.15)]';
      case 'gradient-slate':
        return 'from-slate-600 via-slate-700 to-slate-900 shadow-[0_0_20px_rgba(71,85,105,0.15)]';
      case 'gradient-orange':
        return 'from-orange-400 via-red-500 to-rose-700 shadow-[0_0_20px_rgba(249,115,22,0.15)]';
      case 'gradient-violet':
        return 'from-violet-500 via-purple-600 to-fuchsia-800 shadow-[0_0_20px_rgba(139,92,246,0.15)]';
      case 'gradient-rose':
        return 'from-rose-500 via-pink-600 to-red-700 shadow-[0_0_20px_rgba(244,63,94,0.15)]';
      default:
        return 'from-slate-800 to-slate-900';
    }
  };

  // Get letter display icons for cards as backup
  const getGameInitials = (title: string) => {
    return title.split(' ').map(nm => nm[0]).join('').slice(0, 3).toUpperCase();
  };

  return (
    <div
      onClick={() => onPlay(game)}
      className="group relative cursor-pointer flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/90 transition-all duration-300 overflow-hidden shadow-lg hover:-translate-y-1.5"
      id={`game-card-${game.id}`}
    >
      {/* Thumbnail Banner */}
      <div className="relative w-full aspect-video overflow-hidden border-b border-slate-800/80">
        {/* Animated Background Vector Pattern */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradientStyle(game.thumbnail)} flex items-center justify-center`}>
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(18,24,38,0.15)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(18,24,38,0.15)_1.5px,transparent_1.5px)] bg-[size:16px_16px]"></div>
          
          {/* Game Title initials Vector Label */}
          <span className="font-mono text-5xl font-black text-slate-950/20 tracking-wider select-none animate-pulse">
            {getGameInitials(game.title)}
          </span>

          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 font-mono text-[9px] text-slate-300 border border-slate-800 uppercase tracking-widest font-black">
            {game.category}
          </span>

          {game.isNative && (
            <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono text-[9px] font-black uppercase tracking-widest animate-pulse border border-emerald-400">
              ⚡ LIVE NATIVE
            </span>
          )}
        </div>

        {/* Hover overlay with play button trigger */}
        <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-slate-950 group-hover:scale-110 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            <Play className="h-6 w-6 ml-1 fill-current text-slate-950" />
          </div>
        </div>

        {/* Floating Favorite Action click */}
        <button
          onClick={(e) => onToggleFavorite(e, game.id)}
          className="absolute top-2.5 right-2.5 p-2 rounded-full cursor-pointer bg-slate-950/60 hover:bg-slate-950 text-slate-300 hover:text-white border border-slate-800/50 backdrop-blur-sm transition-all active:scale-90"
          id={`fav-btn-${game.id}`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`h-4.5 w-4.5 transition-colors ${
              isFavorite ? 'fill-rose-500 text-rose-500 animate-pulse' : 'text-slate-300'
            }`}
          />
        </button>
      </div>

      {/* Details Box */}
      <div className="flex-1 flex flex-col p-4">
        {/* Title & Metadata */}
        <div className="flex items-start justify-between gap-1 mb-1.5">
          <h3 className="font-sans text-base font-bold text-slate-50 group-hover:text-emerald-400 transition-colors line-clamp-1">
            {game.title}
          </h3>
          <span className="shrink-0 font-mono text-[10px] text-slate-500 bg-slate-950/50 border border-slate-800 px-1.5 py-0.5 rounded font-black">
            {game.releaseYear}
          </span>
        </div>

        {/* Description blurb */}
        <p className="text-slate-400 text-xs font-sans line-clamp-2 leading-relaxed mb-4 flex-1">
          {game.description}
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 mt-auto">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-mono text-xs font-bold text-slate-300">{game.rating.toFixed(2)}</span>
          </div>

          {/* Sizing of Plays */}
          <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>{(game.plays / 1000).toFixed(1)}k plays</span>
          </div>
        </div>
      </div>
    </div>
  );
}
