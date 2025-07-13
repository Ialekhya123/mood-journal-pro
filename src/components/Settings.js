import React, { useEffect, useState } from 'react';
import { isAIMoodDetectionAvailable } from '../services/aiMoodDetection';

const TAGS_KEY = 'mood_journal_custom_tags';
const REMINDER_KEY = 'mood_journal_reminder';

function getInitialDark() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('mood_journal_dark') === 'true' ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  return false;
}
function getInitialTags() {
  try {
    return JSON.parse(localStorage.getItem(TAGS_KEY)) || ['happy', 'sad', 'angry', 'anxious', 'neutral'];
  } catch {
    return ['happy', 'sad', 'angry', 'anxious', 'neutral'];
  }
}
function getInitialReminder() {
  try {
    return localStorage.getItem(REMINDER_KEY) === 'true';
  } catch {
    return false;
  }
}

export default function Settings() {
  const [dark, setDark] = useState(getInitialDark());
  const [reminder, setReminder] = useState(getInitialReminder());
  const [tags, setTags] = useState(getInitialTags());
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mood_journal_dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mood_journal_dark', 'false');
    }
  }, [dark]);

  useEffect(() => {
    localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  }, [tags]);
  useEffect(() => {
    localStorage.setItem(REMINDER_KEY, reminder ? 'true' : 'false');
  }, [reminder]);

  function addTag() {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  }
  function removeTag(tag) {
    setTags(tags.filter(t => t !== tag));
  }

  return (
    <div className="glass rounded-2xl p-8 shadow-lg min-h-[70vh]">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent dark:text-green-400">Settings</h2>
      {/* Dark Mode Toggle */}
      <div className="flex items-center gap-4 mb-8">
        <label className="font-semibold text-gray-700 dark:text-gray-200">Dark Mode</label>
        <button
          className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${dark ? 'bg-green-500' : 'bg-gray-300'}`}
          onClick={() => setDark(d => !d)}
          aria-label="Toggle dark mode"
        >
          <span className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${dark ? 'translate-x-6' : ''}`}></span>
        </button>
        <span className="text-xs text-gray-400 ml-2">{dark ? 'On' : 'Off'}</span>
      </div>
      {/* Daily Mood Reminder Toggle */}
      <div className="flex items-center gap-4 mb-8">
        <label className="font-semibold text-gray-700 dark:text-gray-200">Daily Mood Reminder</label>
        <button
          className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${reminder ? 'bg-blue-500' : 'bg-gray-300'}`}
          onClick={() => setReminder(r => !r)}
          aria-label="Toggle daily reminder"
        >
          <span className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${reminder ? 'translate-x-6' : ''}`}></span>
        </button>
        <span className="text-xs text-gray-400 ml-2">{reminder ? 'On' : 'Off'}</span>
        {/* TODO: Implement real notification logic */}
      </div>
      {/* Export/Share */}
      <div className="flex gap-4 mb-8">
        <button className="bg-gradient-to-r from-pink-400 to-blue-400 dark:from-green-700 dark:to-green-500 text-white dark:text-green-100 px-6 py-2 rounded-full font-bold shadow hover:scale-105 transition-all">Export Data</button>
        <button className="bg-white/80 dark:bg-gray-700 text-blue-400 dark:text-green-400 px-6 py-2 rounded-full font-bold shadow hover:scale-105 transition-all border border-blue-200 dark:border-green-700">Share Profile</button>
        {/* TODO: Implement export/share logic */}
      </div>
      {/* Custom Mood Tags */}
      <div className="mb-8">
        <label className="font-semibold text-gray-700 dark:text-gray-200 mb-2 block">Custom Mood Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(tag => (
            <span key={tag} className="inline-flex items-center bg-gradient-to-r from-blue-200 to-pink-100 dark:from-green-900 dark:to-green-700 text-blue-700 dark:text-green-200 rounded-full px-3 py-1 text-xs font-semibold shadow-sm">
              #{tag}
              <button onClick={() => removeTag(tag)} className="ml-1 text-pink-400 dark:text-green-400 hover:text-pink-600 dark:hover:text-green-200 focus:outline-none">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            placeholder="Add new tag"
            className="p-2 rounded border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-200 dark:focus:ring-green-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <button onClick={addTag} className="bg-blue-400 dark:bg-green-700 text-white px-4 py-2 rounded-full font-bold shadow hover:scale-105 transition-all">Add</button>
        </div>
        {/* TODO: Persist custom tags and use in Journal */}
      </div>
      {/* AI Features */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">AI Features</h3>
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="font-medium text-purple-700 dark:text-purple-300">AI Mood Detection</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isAIMoodDetectionAvailable() 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
            }`}>
              {isAIMoodDetectionAvailable() ? 'Available' : 'Not Configured'}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Write your thoughts in the journal and let AI suggest your mood automatically. 
            Available moods include your custom tags.
          </p>
          {!isAIMoodDetectionAvailable() && (
            <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded p-2">
              <strong>Setup required:</strong> Add your OpenAI API key to the .env file to enable AI mood detection.
            </div>
          )}
        </div>
      </div>
      <div className="text-gray-400 dark:text-gray-500 text-center">More settings and features coming soon!</div>
    </div>
  );
} 