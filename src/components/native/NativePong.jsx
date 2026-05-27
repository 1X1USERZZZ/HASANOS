/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, ArrowUp, ArrowDown } from 'lucide-react';

const playBeep = (freq, type, duration, isMuted) => {
  if (isMuted) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + duration);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // browser permission block or failed
  }
};

export default function NativePong() {
  const [playerScore, setPlayerScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const canvasRef = useRef(null);

  // Core physics references (so they update without trigger React loop re-renders)
  const ballPos = useRef({ x: 180, y: 180 });
  const ballVel = useRef({ x: 3, y: 1.5 });
  const pPaddleY = useRef(150); // Player Paddle Y
  const cPaddleY = useRef(150); // CPU Paddle Y
  const keysPressed = useRef({});
  const particles = useRef([]);

  // Dimension details
  const pHeight = 60;
  const pWidth = 10;
  const ballRadius = 6;
  const paddleSpeed = 6;

  // Initialize controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
    };
    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Track cursor movement on Canvas
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;

    // center paddle with mouse
    const scaleY = canvas.height / rect.height;
    pPaddleY.current = Math.max(
      0,
      Math.min(canvas.height - pHeight, relativeY * scaleY - pHeight / 2)
    );
  };

  // Run sparks effect
  const spawnParticles = (x, y, color) => {
    for (let i = 0; i < 10; i++) {
      particles.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4 + (x < 180 ? 2 : -2),
        vy: (Math.random() - 0.5) * 4,
        color,
        alpha: 1,
      });
    }
  };

  const resetBall = (direction) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ballPos.current = { x: canvas.width / 2, y: canvas.height / 2 };
    const spX = 3.5;
    const spY = (Math.random() - 0.5) * 4;
    ballVel.current = {
      x: direction === 'toPlayer' ? -spX : spX,
      y: spY,
    };
  };

  // Primary animation game loop
  useEffect(() => {
    let animationId;

    const gameLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Ensure frame logic is only calculated when active
      if (isStarted && !isGameOver) {
        // keyboard controls override mouse controls
        if (keysPressed.current['ArrowUp'] || keysPressed.current['w']) {
          pPaddleY.current = Math.max(0, pPaddleY.current - paddleSpeed);
        }
        if (keysPressed.current['ArrowDown'] || keysPressed.current['s']) {
          pPaddleY.current = Math.min(canvas.height - pHeight, pPaddleY.current + paddleSpeed);
        }

        // --- CPU AI movement ---
        const cpuCenter = cPaddleY.current + pHeight / 2;
        const targetY = ballPos.current.y;
        // Limit CPU speed so player can actually win
        const cpuSpeedLimit = 3.2;
        const diff = targetY - cpuCenter;

        if (Math.abs(diff) > 5) {
          if (diff > 0) {
            cPaddleY.current = Math.min(
              canvas.height - pHeight,
              cPaddleY.current + cpuSpeedLimit
            );
          } else {
            cPaddleY.current = Math.max(0, cPaddleY.current - cpuSpeedLimit);
          }
        }

        // --- Physics Movement ---
        ballPos.current.x += ballVel.current.x;
        ballPos.current.y += ballVel.current.y;

        // Peak / Floor collision bounce
        if (ballPos.current.y - ballRadius <= 0) {
          ballPos.current.y = ballRadius;
          ballVel.current.y = -ballVel.current.y;
          playBeep(260, 'triangle', 0.08, isMuted);
        } else if (ballPos.current.y + ballRadius >= canvas.height) {
          ballPos.current.y = canvas.height - ballRadius;
          ballVel.current.y = -ballVel.current.y;
          playBeep(260, 'triangle', 0.08, isMuted);
        }

        // Paddle Collision Checks (Left Paddle: Player)
        if (ballVel.current.x < 0) {
          const checkLeftX = pWidth;
          if (
            ballPos.current.x - ballRadius <= checkLeftX &&
            ballPos.current.x + ballRadius >= 0 &&
            ballPos.current.y >= pPaddleY.current &&
            ballPos.current.y <= pPaddleY.current + pHeight
          ) {
            // angle collision depending on where the ball strikes the paddle
            const strikeLocation = (ballPos.current.y - (pPaddleY.current + pHeight / 2)) / (pHeight / 2);
            ballVel.current.x = -ballVel.current.x * 1.05; // speed up slightly!
            ballVel.current.y = strikeLocation * 3.5;
            ballPos.current.x = checkLeftX + ballRadius; // block stuck in paddle

            playBeep(440, 'square', 0.1, isMuted);
            spawnParticles(checkLeftX, ballPos.current.y, '#38bdf8'); // sky-400
          }
        }

        // Paddle Collision Checks (Right Paddle: CPU)
        if (ballVel.current.x > 0) {
          const checkRightX = canvas.width - pWidth;
          if (
            ballPos.current.x + ballRadius >= checkRightX &&
            ballPos.current.x - ballRadius <= canvas.width &&
            ballPos.current.y >= cPaddleY.current &&
            ballPos.current.y <= cPaddleY.current + pHeight
          ) {
            const strikeLocation = (ballPos.current.y - (cPaddleY.current + pHeight / 2)) / (pHeight / 2);
            ballVel.current.x = -ballVel.current.x * 1.05;
            ballVel.current.y = strikeLocation * 3.5;
            ballPos.current.x = checkRightX - ballRadius;

            playBeep(400, 'square', 0.1, isMuted);
            spawnParticles(checkRightX, ballPos.current.y, '#f43f5e'); // rose-500
          }
        }

        // Goal Scores
        if (ballPos.current.x - ballRadius < 0) {
          // CPU Scores!
          setCpuScore(prev => {
            const next = prev + 1;
            if (next >= 7) {
              setWinner('cpu');
              setIsGameOver(true);
              playBeep(180, 'sawtooth', 0.45, isMuted);
            } else {
              playBeep(140, 'sine', 0.3, isMuted);
              resetBall('toPlayer');
            }
            return next;
          });
        } else if (ballPos.current.x + ballRadius > canvas.width) {
          // Player Scores!
          setPlayerScore(prev => {
            const next = prev + 1;
            if (next >= 7) {
              setWinner('player');
              setIsGameOver(true);
              playBeep(660, 'sine', 0.5, isMuted);
            } else {
              playBeep(580, 'sine', 0.25, isMuted);
              resetBall('toCpu');
            }
            return next;
          });
        }
      }

      // --- RENDER SCREEN ---
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dash line down the middle
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width, canvas.height); // wait, should go down straight to height!
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]); // clear dash for paddle/ball

      // Player Paddle
      ctx.fillStyle = '#38bdf8'; // sky-400
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(0, pPaddleY.current, pWidth, pHeight, 4) : ctx.rect(0, pPaddleY.current, pWidth, pHeight);
      ctx.fill();

      // CPU Paddle
      ctx.fillStyle = '#f43f5e'; // rose-500
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(canvas.width - pWidth, cPaddleY.current, pWidth, pHeight, 4) : ctx.rect(canvas.width - pWidth, cPaddleY.current, pWidth, pHeight);
      ctx.fill();

      // Ball
      if (isStarted && !isGameOver) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ballPos.current.x, ballPos.current.y, ballRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(ballPos.current.x, ballPos.current.y, ballRadius - 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // clear shadow
      }

      // Particles effect update & render
      particles.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        if (p.alpha <= 0) {
          particles.current.splice(idx, 1);
          return;
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.min(1.5, Math.max(0.5, p.alpha * 3)), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0; // reset transparency

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [isStarted, isGameOver, isMuted]);

  const startGame = () => {
    setPlayerScore(0);
    setCpuScore(0);
    setIsGameOver(false);
    setWinner(null);
    setIsStarted(true);
    pPaddleY.current = 150;
    cPaddleY.current = 150;
    particles.current = [];
    resetBall('toCpu');
    playBeep(440, 'sine', 0.25, isMuted);
  };

  return (
    <div className="flex flex-col items-center bg-slate-950 p-4 rounded-xl shadow-2xl border border-rose-500/10 max-w-lg mx-auto" id="pong-container">
      {/* Game Header HUD */}
      <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800 pb-3" id="pong-hud">
        <div className="flex flex-col items-start">
          <span className="font-mono text-[10px] text-sky-400 uppercase tracking-widest font-bold">PLAYER</span>
          <span className="font-mono text-2xl font-black text-white" id="pong-player-score">{playerScore}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest font-black mb-1">SCORE GOAL: 7</span>
          <span className="font-mono text-xs text-slate-400 font-bold px-3 py-0.5 rounded-full bg-slate-900 border border-slate-800" id="pong-score-target">MATCH VS BOT</span>
        </div>

        <div className="flex flex-col items-end">
          <span className="font-mono text-[10px] text-rose-400 uppercase tracking-widest font-bold">ARCADE_BOT</span>
          <span className="font-mono text-2xl font-black text-white" id="pong-cpu-score">{cpuScore}</span>
        </div>
      </div>

      {/* Screen Frame */}
      <div className="relative border-4 border-slate-800 bg-slate-900 rounded-lg overflow-hidden w-full max-w-[380px]" id="pong-screen-wrapper">
        <canvas
          ref={canvasRef}
          width={380}
          height={300}
          onMouseMove={handleMouseMove}
          className="w-full h-full block cursor-none"
          id="pong-canvas"
        />

        {/* Start Game UI Over */}
        {!isStarted && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center animate-fade-in" id="pong-start-overlay">
            <span className="font-mono text-rose-500 text-2xl font-black mb-3 select-none flex items-center gap-2">
              <span className="inline-block animate-ping rounded-full w-2 h-2 bg-rose-500"></span>
              NATIVE PHYSICS PONG
            </span>
            <p className="text-slate-400 text-xs mb-6 max-w-[280px]">
              Challenge the custom CPU Arcade bot! Use your Mouse or Arrow/WASD keys to guard and smash the physics ball.
            </p>
            <button
              onClick={startGame}
              className="cursor-pointer flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-sm font-bold rounded-lg shadow-lg hover:shadow-rose-500/20 active:scale-95 transition-all outline-none"
              id="pong-play-btn"
            >
              <Play className="w-4 h-4 fill-current" />
              START MATCH
            </button>
          </div>
        )}

        {/* Game Over UI Over */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in" id="pong-gameover-overlay">
            {winner === 'player' ? (
              <>
                <span className="font-mono text-emerald-400 text-3xl font-black mb-1 select-none animate-bounce">
                  VICTORY!
                </span>
                <span className="text-xs text-slate-400 mb-5 font-mono">
                  You beat Arcade CPU <strong className="text-emerald-400">{playerScore} to {cpuScore}</strong>!
                </span>
                <span className="text-xs text-amber-400 font-mono bg-amber-950/50 border border-amber-500/30 px-3 py-1 rounded-full mb-5">
                  🏆 CERTIFIED ARCADE PLAYER
                </span>
              </>
            ) : (
              <>
                <span className="font-mono text-rose-500 text-3xl font-black mb-1 select-none">
                  DEFEAT
                </span>
                <span className="text-xs text-slate-400 mb-5 font-mono">
                  Arcade CPU beat you <strong className="text-rose-400">{cpuScore} to {playerScore}</strong>.
                </span>
                <span className="text-xs text-slate-500 font-mono mb-5">
                  Try again, watch the angles!
                </span>
              </>
            )}

            <button
              onClick={startGame}
              className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 font-mono text-xs font-bold rounded-lg border border-slate-700 hover:border-rose-500/30 transition-all active:scale-95 outline-none"
              id="pong-restart-btn"
            >
              <RotateCcw className="w-4 h-4" />
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Control Manual hints */}
      <div className="w-full flex items-center justify-between mt-4 border-t border-slate-800/80 pt-3 px-1 text-[10px] font-mono text-slate-500 select-none" id="pong-controls-hints">
        <span className="flex items-center gap-1.5"><ArrowUp className="w-3 h-3" /> / W : move up</span>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-1 cursor-pointer text-slate-500 hover:text-slate-300 transition-colors"
          title="Toggle SFX Mute"
        >
          {isMuted ? <VolumeX className="w-3 h-3 h-3" /> : <Volume2 className="w-3 h-3" />}
        </button>
        <span className="flex items-center gap-1.5"><ArrowDown className="w-3 h-3" /> / S : move down</span>
      </div>
    </div>
  );
}
