import React from 'react';
import { useJournal } from './AuthProvider';
import { useGamification } from './GamificationProvider';

export default function Profile() {
  const { entries } = useJournal();
  const entryCount = entries.length;
  const moods = entries.map(e => e.mood);
  const moodFreq = moods.reduce((acc, m) => { acc[m] = (acc[m] || 0) + 1; return acc; }, {});
  const favoriteMood = Object.entries(moodFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  const { streaks, xp, level, achievements, ACHIEVEMENTS, LEVEL_XP } = useGamification();

  return (
    <div className="glass rounded-2xl p-8 shadow-lg min-h-[70vh] flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent dark:text-green-400">User Profile</h2>
      {/* User Info (placeholder) */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-300 to-blue-300 dark:from-green-700 dark:to-green-400 flex items-center justify-center text-4xl font-bold text-white mb-2 shadow">
          <span role="img" aria-label="avatar">👤</span>
        </div>
        <div className="font-bold text-lg text-gray-800 dark:text-gray-100">Guest User</div>
        <div className="text-xs text-gray-400 dark:text-gray-300">(Sign in to sync your data)</div>
      </div>
      {/* Mood Stats & Gamification */}
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-800 rounded-xl p-6 shadow flex flex-col items-center mb-8">
        <div className="flex gap-8 mb-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-pink-400 dark:text-green-400">{entryCount}</span>
            <span className="text-xs text-gray-500 dark:text-gray-200">Journal Entries</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-blue-400 dark:text-green-400">{favoriteMood.charAt(0).toUpperCase() + favoriteMood.slice(1)}</span>
            <span className="text-xs text-gray-500 dark:text-gray-200">Favorite Mood</span>
          </div>
        </div>
        <div className="flex gap-8 mb-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-purple-400 dark:text-green-400">{streaks.current}</span>
            <span className="text-xs text-gray-500 dark:text-gray-200">Current Streak</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-blue-400 dark:text-green-400">{streaks.longest}</span>
            <span className="text-xs text-gray-500 dark:text-gray-200">Longest Streak</span>
          </div>
        </div>
        <div className="w-full mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-200">Level {level}</span>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-pink-400 to-blue-400 dark:from-green-700 dark:to-green-400" style={{ width: `${Math.min(100, ((xp - LEVEL_XP[level-1]) / (LEVEL_XP[level] - LEVEL_XP[level-1] || 1)) * 100)}%` }} />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-200">{xp} XP</span>
          </div>
        </div>
        <div className="w-full">
          <h4 className="font-semibold text-purple-400 dark:text-green-200 mb-2">Achievements</h4>
          <div className="flex flex-wrap gap-2">
            {ACHIEVEMENTS.map(a => (
              <span key={a.key} className={`px-3 py-1 rounded-full text-xs font-semibold shadow transition-all ${achievements[a.key] ? 'bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-100' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-400'}`} title={a.desc}>
                {achievements[a.key] ? '🏆' : '🔒'} {a.label}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Export/Share */}
      <div className="flex gap-4 mb-8">
        <button className="bg-gradient-to-r from-pink-400 to-blue-400 dark:from-green-700 dark:to-green-500 text-white dark:text-green-100 px-6 py-2 rounded-full font-bold shadow hover:scale-105 transition-all">Export Data</button>
        <button className="bg-white/80 dark:bg-gray-700 text-blue-400 dark:text-green-400 px-6 py-2 rounded-full font-bold shadow hover:scale-105 transition-all border border-blue-200 dark:border-green-700">Share Profile</button>
      </div>
      <div className="text-gray-400 dark:text-gray-500 text-center">Sign in to sync your profile, stats, and favorites across devices.</div>
    </div>
  );
} 