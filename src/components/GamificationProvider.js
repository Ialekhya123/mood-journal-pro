import React, { createContext, useContext, useEffect, useState } from 'react';
import { useJournal } from './AuthProvider';

const GamificationContext = createContext();

// XP and Leveling
const XP_PER_ENTRY = 10;
const LEVEL_XP = [0, 50, 150, 300, 500, 750, 1050, 1400, 1800, 2250]; // XP required for each level

// Achievements
const ACHIEVEMENTS = [
  { key: 'first_entry', label: 'First Entry', desc: 'Write your first journal entry.' },
  { key: 'streak_3', label: '3-Day Streak', desc: 'Journal 3 days in a row.' },
  { key: 'streak_7', label: '7-Day Streak', desc: 'Journal 7 days in a row.' },
  { key: 'streak_30', label: '30-Day Streak', desc: 'Journal 30 days in a row.' },
  { key: 'mood_explorer', label: 'Mood Explorer', desc: 'Use all available moods at least once.' },
  { key: 'expressive_writer', label: 'Expressive Writer', desc: 'Write 50 journal entries.' },
  { key: 'custom_tag_creator', label: 'Custom Tag Creator', desc: 'Add a custom mood tag.' },
];

function getStreaks(entries) {
  if (!entries.length) return { current: 0, longest: 0 };
  // Sort entries by date descending
  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
  let currentStreak = 1;
  let longestStreak = 1;
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date);
    const curr = new Date(sorted[i].date);
    const diff = (prev - curr) / (1000 * 60 * 60 * 24);
    if (diff >= 1 && diff < 2) {
      streak++;
      if (streak > longestStreak) longestStreak = streak;
    } else if (diff < 1) {
      // Same day, ignore
      continue;
    } else {
      streak = 1;
    }
  }
  // Check if last entry is today or yesterday for current streak
  const last = new Date(sorted[0].date);
  const now = new Date();
  const diff = (now - last) / (1000 * 60 * 60 * 24);
  if (diff < 1) currentStreak = streak;
  else if (diff < 2) currentStreak = streak;
  else currentStreak = 0;
  return { current: currentStreak, longest: longestStreak };
}

function getXP(entries) {
  return entries.length * XP_PER_ENTRY;
}

function getLevel(xp) {
  let level = 1;
  for (let i = 0; i < LEVEL_XP.length; i++) {
    if (xp >= LEVEL_XP[i]) level = i + 1;
    else break;
  }
  return level;
}

function getAchievements(entries, moods, customTags) {
  const usedMoods = new Set(entries.map(e => e.mood));
  const usedCustom = entries.some(e => (e.tags || []).some(t => customTags.includes(t)));
  return {
    first_entry: entries.length > 0,
    streak_3: getStreaks(entries).longest >= 3,
    streak_7: getStreaks(entries).longest >= 7,
    streak_30: getStreaks(entries).longest >= 30,
    mood_explorer: moods.every(m => usedMoods.has(m)),
    expressive_writer: entries.length >= 50,
    custom_tag_creator: usedCustom,
  };
}

export function useGamification() {
  return useContext(GamificationContext);
}

export default function GamificationProvider({ children, moods, customTags }) {
  const { entries } = useJournal();
  const [streaks, setStreaks] = useState({ current: 0, longest: 0 });
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [achievements, setAchievements] = useState({});

  useEffect(() => {
    setStreaks(getStreaks(entries));
    const xpVal = getXP(entries);
    setXP(xpVal);
    setLevel(getLevel(xpVal));
    setAchievements(getAchievements(entries, moods, customTags));
  }, [entries, moods, customTags]);

  return (
    <GamificationContext.Provider value={{ streaks, xp, level, achievements, ACHIEVEMENTS, LEVEL_XP }}>
      {children}
    </GamificationContext.Provider>
  );
} 