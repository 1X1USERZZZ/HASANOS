/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GRID_SIZE = 20;

// Safe web audio play
const playBeep = (freq: number, type: OscillatorType, duration: number, isMuted: boolean) => {
  if (isMuted) return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio context not allowed or failed
  }
};

export default function NativeSnake() {
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [food, setFood] = useState<{ x: number; y: number; isGolden: boolean }>({ x: 5, y: 5, isGolden: false });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('UP');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('hasanos_snake_highscore') || '0');
  });
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(130);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const directionRef = useRef(direction);
  directionRef.current = direction;

  // Key handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isStarted || isGameOver) return;
      const key = e.key;
      if ((key === 'ArrowUp' || key === 'w' || key === 'W') && directionRef.current !== 'DOWN') {
        setDirection('UP');
      } else if ((key === 'ArrowDown' || key === 's' || key === 'S') && directionRef.current !== 'UP') {
        setDirection('DOWN');
      } else if ((key === 'ArrowLeft' || key === 'a' || key === 'A') && directionRef.current !== 'RIGHT') {
        setDirection('LEFT');
      } else if ((key === 'ArrowRight' || key === 'd' || key === 'D') && directionRef.current !== 'LEFT') {
        setDirection('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarted, isGameOver]);

  // Generate new food location
  const spawnFood = (currentSnake: { x: number; y: number }[]) => {
    let newFood;
    let isOnSnake = true;
    while (isOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
        isGolden: Math.random() < 0.1, // 10% chance of golden apple
      };
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      isOnSnake = currentSnake.some(segment => segment.x === newFood!.x && segment.y === newFood!.y);
    }
    setFood(newFood!);
  };

  // Game loop interval
  useEffect(() => {
    if (!isStarted || isGameOver) return;

    const interval = setInterval(() => {
      setSnake(prev => {
        const head = prev[0];
        let newHead = { ...head };

        switch (directionRef.current) {
          case 'UP':
            newHead.y -= 1;
            break;
          case 'DOWN':
            newHead.y += 1;
            break;
          case 'LEFT':
            newHead.x -= 1;
            break;
          case 'RIGHT':
            newHead.x += 1;
            break;
        }

        // Border collision or self collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE ||
          prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)
        ) {
          setIsGameOver(true);
          playBeep(120, 'sawtooth', 0.4, isMuted);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Eat food checks
        if (newHead.x === food.x && newHead.y === food.y) {
          const points = food.isGolden ? 50 : 10;
          setScore(s => {
            const nextScore = s + points;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem('hasanos_snake_highscore', String(nextScore));
            }
            return nextScore;
          });

          playBeep(food.isGolden ? 880 : 520, 'sine', 0.15, isMuted);
          spawnFood(prev);

          // Speed up slightly
          setSpeed(sp => Math.max(70, sp - (food.isGolden ? 4 : 2)));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isStarted, isGameOver, food, speed, isMuted, highScore]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background (arcade grid theme)
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Subtle grid pattern
    ctx.strokeStyle = '#1e293b'; // slate-800
    ctx.lineWidth = 1;
    const cellWidth = canvas.width / GRID_SIZE;
    const cellHeight = canvas.height / GRID_SIZE;

    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellWidth, 0);
      ctx.lineTo(i * cellWidth, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellHeight);
      ctx.lineTo(canvas.width, i * cellHeight);
      ctx.stroke();
    }

    // Draw food
    if (food.isGolden) {
      // Shiny Golden circle
      ctx.fillStyle = '#f59e0b'; // amber-500
      ctx.beginPath();
      ctx.arc(
        food.x * cellWidth + cellWidth / 2,
        food.y * cellHeight + cellHeight / 2,
        cellWidth * 0.45,
        0,
        Math.PI * 2
      );
      ctx.fill();
      // Add shine reflection
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(
        food.x * cellWidth + cellWidth * 0.35,
        food.y * cellHeight + cellHeight * 0.35,
        cellWidth * 0.15,
        0,
        Math.PI * 2
      );
      ctx.fill();
    } else {
      // Fresh Red Apple with leaf
      ctx.fillStyle = '#ef4444'; // red-500
      ctx.beginPath();
      ctx.arc(
        food.x * cellWidth + cellWidth / 2,
        food.y * cellHeight + cellHeight / 2,
        cellWidth * 0.4,
        0,
        Math.PI * 2
      );
      ctx.fill();
      // small green leaf
      ctx.fillStyle = '#22c55e'; // green-500
      ctx.fillRect(
        food.x * cellWidth + cellWidth / 2 - 1,
        food.y * cellHeight + 1,
        3,
        cellHeight * 0.2
      );
    }

    // Draw snake segments
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      if (isHead) {
        ctx.fillStyle = '#22c55e'; // green-500
      } else {
        // gradient style decay for neon snake feel
        const alpha = Math.max(0.4, 1 - index / snake.length);
        ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
      }

      // Rounded rectangle for block-like segment
      const margin = 2;
      const x = segment.x * cellWidth + margin;
      const y = segment.y * cellHeight + margin;
      const w = cellWidth - margin * 2;
      const h = cellHeight - margin * 2;
      const r = isHead ? 6 : 3;

      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
      ctx.fill();

      // Snake eyes!
      if (isHead) {
        ctx.fillStyle = '#000000';
        const eyeRadius = cellWidth * 0.12;

        let leftEye = { x: 0, y: 0 };
        let rightEye = { x: 0, y: 0 };

        if (directionRef.current === 'UP') {
          leftEye = { x: x + w * 0.25, y: y + h * 0.3 };
          rightEye = { x: x + w * 0.75, y: y + h * 0.3 };
        } else if (directionRef.current === 'DOWN') {
          leftEye = { x: x + w * 0.25, y: y + h * 0.7 };
          rightEye = { x: x + w * 0.75, y: y + h * 0.7 };
        } else if (directionRef.current === 'LEFT') {
          leftEye = { x: x + w * 0.3, y: y + h * 0.25 };
          rightEye = { x: x + w * 0.3, y: y + h * 0.75 };
        } else if (directionRef.current === 'RIGHT') {
          leftEye = { x: x + w * 0.7, y: y + h * 0.25 };
          rightEye = { x: x + w * 0.7, y: y + h * 0.75 };
        }

        ctx.beginPath();
        ctx.arc(leftEye.x, leftEye.y, eyeRadius, 0, Math.PI * 2);
        ctx.arc(rightEye.x, rightEye.y, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [snake, food]);

  const startGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ]);
    setDirection('UP');
    setScore(0);
    setIsGameOver(false);
    setIsStarted(true);
    setSpeed(130);
    playBeep(330, 'sine', 0.2, isMuted);
    setTimeout(() => playBeep(440, 'sine', 0.25, isMuted), 150);
  };

  return (
    <div className="flex flex-col items-center bg-slate-950 p-4 rounded-xl shadow-2xl border border-emerald-500/20 max-w-lg mx-auto" id="snake-container">
      {/* Game Header */}
      <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800 pb-3" id="snake-hud">
        <div className="flex flex-col">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">Hi-Score</span>
          <span className="font-mono text-xl font-bold text-amber-500" id="snake-highscore">{highScore}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">Score</span>
          <span className="font-mono text-2xl font-bold text-emerald-400" id="snake-score">{score}</span>
        </div>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 cursor-pointer rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-700/60"
          id="sound-toggle-btn"
          title="Toggle SFX Mute"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Screen Box */}
      <div className="relative border-4 border-slate-800 bg-slate-900 rounded-lg overflow-hidden w-full aspect-square max-w-[360px]" id="snake-screen-wrapper">
        <canvas
          ref={canvasRef}
          width={360}
          height={360}
          className="w-full h-full block"
          id="snake-canvas"
        />

        {/* Big Start Overlay */}
        {!isStarted && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center animate-fade-in" id="snake-start-overlay">
            <span className="font-mono text-amber-500 text-2xl font-black mb-3 select-none flex items-center gap-2">
              <span className="inline-block animate-ping rounded-full w-2 h-2 bg-emerald-500"></span>
              NATIVE GRID SNAKE
            </span>
            <p className="text-slate-400 text-xs mb-6 max-w-[240px]">
              Dodge yourself, eat glowing apples, grow a colossal tail, and hit the board records. Runs at high FPS!
            </p>
            <button
              onClick={startGame}
              className="cursor-pointer flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-sm font-bold rounded-lg shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all outline-none"
              id="snake-play-btn"
            >
              <Play className="w-4 h-4 fill-current" />
              START GAME
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in" id="snake-gameover-overlay">
            <span className="font-mono text-red-500 text-3xl font-black mb-1 select-none animate-bounce">
              GAME OVER
            </span>
            <span className="text-xs text-slate-400 mb-5 font-mono">
              Final Score: <strong className="text-emerald-400">{score}</strong>
            </span>
            {score >= highScore && score > 0 && (
              <span className="text-xs text-amber-400 font-mono bg-amber-950/50 border border-amber-500/30 px-3 py-1 rounded-full mb-5 animate-pulse">
                🏆 NEW PERSONAL RECORD!
              </span>
            )}
            <button
              onClick={startGame}
              className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 font-mono text-xs font-bold rounded-lg border border-slate-700 hover:border-emerald-500/30 transition-all active:scale-95 outline-none"
              id="snake-restart-btn"
            >
              <RotateCcw className="w-4 h-4" />
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* D-Pad Buttons for Touch / Mobile Screens */}
      <div className="mt-5 w-full max-w-[200px]" id="snake-retro-controls">
        <div className="grid grid-cols-3 gap-1.5 justify-center">
          <div></div>
          <button
            onClick={() => isStarted && !isGameOver && directionRef.current !== 'DOWN' && setDirection('UP')}
            className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700 flex justify-center items-center cursor-pointer active:scale-90"
            id="pad-up"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <div></div>

          <button
            onClick={() => isStarted && !isGameOver && directionRef.current !== 'RIGHT' && setDirection('LEFT')}
            className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700 flex justify-center items-center cursor-pointer active:scale-90"
            id="pad-left"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-center text-slate-600 font-mono text-[9px] select-none font-bold">D-PAD</div>
          <button
            onClick={() => isStarted && !isGameOver && directionRef.current !== 'LEFT' && setDirection('RIGHT')}
            className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700 flex justify-center items-center cursor-pointer active:scale-90"
            id="pad-right"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <div></div>
          <button
            onClick={() => isStarted && !isGameOver && directionRef.current !== 'UP' && setDirection('DOWN')}
            className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700 flex justify-center items-center cursor-pointer active:scale-90"
            id="pad-down"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <div></div>
        </div>
      </div>
    </div>
  );
}
