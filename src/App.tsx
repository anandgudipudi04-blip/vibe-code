/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-pink-500/30 overflow-x-hidden relative flex flex-col">
      {/* Global Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        ></div>
        
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 z-10 gap-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left/Top: Title & Info */}
          <div className="lg:col-span-4 flex flex-col gap-6 text-center lg:text-left">
            <div>
              <h1 className="text-5xl md:text-6xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                SYNTH<br/>SNAKE
              </h1>
              <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">
                Retro Arcade x AI Audio
              </p>
            </div>
            
            <div className="hidden lg:block p-4 bg-gray-900/50 border border-gray-800 rounded-lg backdrop-blur-sm">
              <h3 className="text-cyan-400 font-bold mb-2 uppercase tracking-wider text-sm">Controls</h3>
              <ul className="text-gray-400 font-mono text-xs space-y-2">
                <li><span className="text-white px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">W</span> <span className="text-white px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">A</span> <span className="text-white px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">S</span> <span className="text-white px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">D</span> to move</li>
                <li><span className="text-white px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700">SPACE</span> to pause</li>
                <li>Play music to enhance focus</li>
              </ul>
            </div>
          </div>

          {/* Center: Game */}
          <div className="lg:col-span-8 flex justify-center">
            <SnakeGame />
          </div>
        </div>
        
        {/* Bottom: Music Player */}
        <div className="w-full max-w-5xl mt-auto pt-8">
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
