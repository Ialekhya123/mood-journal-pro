import React, { createContext, useContext, useState, useEffect } from 'react';

// TODO: Implement real authentication logic (Google, Spotify, email)
const AuthContext = createContext({ user: null, login: () => {}, logout: () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  // Placeholder: no real auth yet
  const value = { user: null, login: () => {}, logout: () => {} };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --- Journal Context for global mood entries ---
const JournalContext = createContext();
const ENTRIES_KEY = 'mood_journal_entries';

// --- Mood Tags Context ---
const TAGS_KEY = 'mood_journal_custom_tags';
const DEFAULT_TAGS = ['happy', 'sad', 'angry', 'anxious', 'neutral'];
const MoodTagsContext = createContext();

export function MoodTagsProvider({ children }) {
  const [tags, setTags] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(TAGS_KEY)) || DEFAULT_TAGS;
    } catch {
      return DEFAULT_TAGS;
    }
  });
  useEffect(() => {
    localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  }, [tags]);
  return (
    <MoodTagsContext.Provider value={{ tags, setTags }}>
      {children}
    </MoodTagsContext.Provider>
  );
}
export function useMoodTags() {
  return useContext(MoodTagsContext);
}

export function JournalProvider({ children }) {
  const [entries, setEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(ENTRIES_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  }, [entries]);

  function addEntry(entry) {
    setEntries(prev => [{ ...entry, date: new Date().toISOString() }, ...prev]);
  }
  function updateEntry(idx, entry) {
    setEntries(prev => prev.map((e, i) => (i === idx ? { ...entry, date: e.date } : e)));
  }
  function deleteEntry(idx) {
    setEntries(prev => prev.filter((_, i) => i !== idx));
  }

  return (
    <JournalContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry }}>
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  return useContext(JournalContext);
} 