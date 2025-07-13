import React from 'react';
import { useGamification } from './GamificationProvider';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useJournal, useMoodTags } from './AuthProvider';

const MOOD_COLORS = {
  happy: '#f472b6',
  sad: '#60a5fa',
  angry: '#fb7185',
  anxious: '#a78bfa',
  neutral: '#a3a3a3',
};
const CUSTOM_COLORS = [
  '#34d399', '#fbbf24', '#818cf8', '#f472b6', '#60a5fa', '#fb7185', '#a78bfa', '#a3a3a3', '#f87171', '#4ade80', '#facc15', '#f472b6', '#38bdf8', '#f59e42', '#a3e635', '#f43f5e', '#6366f1', '#f472b6', '#fbbf24', '#34d399', '#818cf8',
];

export default function Insights() {
  const { entries } = useJournal();
  const { tags } = useMoodTags();
  const { streaks, xp, level, achievements, ACHIEVEMENTS, LEVEL_XP } = useGamification();

  // Assign a color for each mood (preset or custom)
  function getColor(mood, idx) {
    return MOOD_COLORS[mood] || CUSTOM_COLORS[idx % CUSTOM_COLORS.length];
  }

  // Prepare data for charts
  const moodOrder = tags;
  const trendData = entries.slice().reverse().map((entry, i) => ({
    date: entry.date ? entry.date.slice(5, 10) : `#${i + 1}`,
    mood: moodOrder.indexOf(entry.mood) + 1,
    moodLabel: entry.mood,
  })).slice(-10); // last 10 entries

  const moodCounts = moodOrder.map((mood, idx) => ({
    name: mood.charAt(0).toUpperCase() + mood.slice(1),
    value: entries.filter(e => e.mood === mood).length,
    color: getColor(mood, idx),
  }));

  return (
    <div className="glass rounded-2xl p-8 shadow-lg min-h-[70vh] hover-glow">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent dark:text-green-400 typing-animation">Mood Insights & Trends</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Mood Trends Line Chart */}
        <div className="bg-white/90 dark:bg-gray-800 rounded-xl p-4 shadow flex flex-col hover-bounce">
          <h3 className="font-semibold text-accent mb-2">Mood Trend (Last 10 Entries)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#8884d8' }} />
              <YAxis domain={[1, moodOrder.length]} ticks={moodOrder.map((_, i) => i + 1)} tickFormatter={v => moodOrder[v - 1]?.charAt(0).toUpperCase() + moodOrder[v - 1]?.slice(1)} tick={{ fontSize: 12, fill: '#8884d8' }} />
              <Tooltip formatter={(v, n, p) => moodOrder[v - 1]?.charAt(0).toUpperCase() + moodOrder[v - 1]?.slice(1)} />
              <Line type="monotone" dataKey="mood" stroke="#f472b6" strokeWidth={3} dot={{ r: 6, fill: '#f472b6' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Mood Distribution Pie Chart */}
        <div className="bg-white/90 dark:bg-gray-800 rounded-xl p-4 shadow flex flex-col items-center hover-bounce">
          <h3 className="font-semibold text-accent mb-2">Mood Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={moodCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {moodCounts.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Streaks & Achievements */}
      <div className="bg-gradient-to-r from-pink-100 to-blue-100 dark:from-green-900 dark:to-green-700 rounded-xl p-6 shadow flex flex-col md:flex-row items-center gap-8 hover-glow">
        <div className="flex-1">
          <h4 className="font-semibold text-accent mb-1">Streaks & Achievements</h4>
          <div className="flex gap-8 items-center mb-4">
            <div className="flex flex-col items-center hover-bounce">
              <span className="text-3xl font-bold text-pink-400 dark:text-green-400 pulse-glow">{streaks.current}</span>
              <span className="text-xs text-muted">Current Streak</span>
            </div>
            <div className="flex flex-col items-center hover-bounce">
              <span className="text-3xl font-bold text-accent">{streaks.longest}</span>
              <span className="text-xs text-muted">Longest Streak</span>
            </div>
            <div className="flex flex-col items-center hover-bounce">
              <span className="text-3xl font-bold text-accent">{xp}</span>
              <span className="text-xs text-muted">XP</span>
            </div>
            <div className="flex flex-col items-center hover-bounce">
              <span className="text-3xl font-bold text-accent">{level}</span>
              <span className="text-xs text-muted">Level</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {ACHIEVEMENTS.map(a => (
              <span key={a.key} className={`px-3 py-1 rounded-full text-xs font-semibold shadow transition-all hover-bounce ${achievements[a.key] ? 'bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-100 pulse-glow' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-400'}`} title={a.desc}>
                {achievements[a.key] ? '🏆' : '🔒'} {a.label}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <span className="text-lg text-secondary mb-2 typing-animation">Keep journaling to unlock more achievements!</span>
        </div>
      </div>
    </div>
  );
} 