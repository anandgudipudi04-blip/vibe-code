import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

// Game constants
const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120;

const generateFood = (snake: { x: number; y: number }[]) => {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Ensure food doesn't spawn on the snake
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef(direction);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) return;

      // Prevent default scrolling for arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'Escape') {
        if (hasStarted) {
          setIsPaused(prev => !prev);
        } else {
          setHasStarted(true);
        }
        return;
      }

      if (isPaused || !hasStarted) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    },
    [gameOver, isPaused, hasStarted]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        setDirection(directionRef.current); // Sync state with ref for rendering if needed
        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [gameOver, isPaused, hasStarted, food]);

  // Render grid
  const grid = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const isSnake = snake.some(segment => segment.x === col && segment.y === row);
      const isHead = snake[0].x === col && snake[0].y === row;
      const isFood = food.x === col && food.y === row;

      grid.push(
        <div
          key={`${row}-${col}`}
          className={`w-full h-full border border-gray-900/30 rounded-sm transition-all duration-75 ${
            isHead
              ? 'bg-green-400 shadow-[0_0_10px_#4ade80] z-10'
              : isSnake
              ? 'bg-green-500/80 shadow-[0_0_8px_#22c55e]'
              : isFood
              ? 'bg-pink-500 shadow-[0_0_12px_#ec4899] animate-pulse'
              : 'bg-gray-900/50'
          }`}
        />
      );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      {/* Header / Score */}
      <div className="flex justify-between items-center w-full mb-4 px-2">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)] uppercase tracking-widest">
          Cyber Snake
        </h2>
        <div className="text-xl font-mono text-pink-400 drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]">
          SCORE: {score.toString().padStart(4, '0')}
        </div>
      </div>

      {/* Game Board */}
      <div className="relative w-full aspect-square bg-gray-950 border-2 border-cyan-500/50 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] overflow-hidden p-1">
        <div
          className="w-full h-full grid gap-[1px]"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          }}
        >
          {grid}
        </div>

        {/* Overlays */}
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <button
              onClick={() => setHasStarted(true)}
              className="px-6 py-3 bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold tracking-wider uppercase rounded hover:bg-cyan-500/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] transition-all cursor-pointer"
            >
              Start Game
            </button>
            <p className="mt-4 text-gray-400 text-sm font-mono text-center">
              Use WASD or Arrow Keys to move.<br />Space to pause.
            </p>
          </div>
        )}

        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <h3 className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] mb-6 tracking-widest uppercase">
              Paused
            </h3>
            <button
              onClick={() => setIsPaused(false)}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold tracking-wider uppercase rounded hover:bg-cyan-500/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] transition-all cursor-pointer"
            >
              <Play size={20} /> Resume
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-20">
            <h3 className="text-4xl font-bold text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.9)] mb-2 tracking-widest uppercase">
              Game Over
            </h3>
            <p className="text-xl text-cyan-300 font-mono mb-8 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
              Final Score: {score}
            </p>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-pink-500/20 border border-pink-500 text-pink-400 font-bold tracking-wider uppercase rounded hover:bg-pink-500/40 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all cursor-pointer"
            >
              <RotateCcw size={20} /> Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
