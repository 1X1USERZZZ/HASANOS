/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Game {
  id: string;
  title: string;
  description: string;
  iframeUrl: string;
  category: 'Arcade' | 'Puzzle' | 'Action' | 'Retro' | 'Sports' | 'Casual';
  tags: string[];
  thumbnail: string; // URL or a local styling flag
  instructions: string[];
  plays: number;
  rating: number; // e.g. 4.8
  likes: number;
  releaseYear: number;
  isNative?: boolean; // True if it runs native React/Canvas code in-app
}

export interface UserPreferences {
  favorites: string[]; // List of game IDs
  ratings: Record<string, 'like' | 'dislike' | null>; // Game ID to rating
  recentlyPlayed: string[]; // List of game IDs
}
