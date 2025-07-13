import React from 'react';
import logo from '../logo.svg';

export default function Navbar({ tab, setTab, tabs }) {
  return (
    <nav className="flex items-center justify-between px-8 py-4 glass shadow-lg backdrop-blur-sm sticky top-0 z-30 transition-all duration-300 hover-glow">
      {/* Logo & App Name */}
      <div className="flex items-center gap-3 hover-bounce">
        <img src={logo} alt="Mood Journal Pro" className="w-10 h-10 hover:scale-110 transition-transform duration-300" />
        <div className="hidden sm:block">
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent dark:from-green-400 dark:to-green-300 typing-animation">
            Mood Journal Pro
          </h1>
          <p className="text-xs text-muted">Track moods, discover music</p>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex gap-2">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all border-2 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-green-700 hover-bounce \
              ${tab === t.key
                ? 'bg-gradient-to-r from-pink-200 to-blue-200 text-primary border-pink-200 shadow-lg scale-105 dark:bg-gradient-to-r dark:from-green-900 dark:to-green-700 dark:text-primary dark:border-green-700 pulse-glow'
                : 'bg-white/60 border-white/60 text-secondary hover:bg-white/80 hover:scale-105 dark:bg-gray-800/60 dark:border-gray-700 dark:text-secondary dark:hover:bg-gray-800 hover-glow'}
            `}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
} 