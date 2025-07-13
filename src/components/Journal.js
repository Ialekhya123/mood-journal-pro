import React, { useState, useRef } from 'react';
import { useJournal, useMoodTags } from './AuthProvider';
import { detectMoodFromNotes, isAIMoodDetectionAvailable } from '../services/aiMoodDetection';

function TagChip({ tag, onRemove }) {
  return (
    <span className="inline-flex items-center bg-gradient-to-r from-blue-200 to-pink-100 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold mr-2 mb-1 shadow-sm hover-bounce">
      #{tag}
      {onRemove && (
        <button onClick={onRemove} className="ml-1 text-pink-400 hover:text-pink-600 focus:outline-none hover-bounce">×</button>
      )}
    </span>
  );
}

const MOOD_COLORS = [
  { value: 'happy', color: 'from-pink-400 to-yellow-300', ring: 'ring-pink-300', label: '😊 Happy' },
  { value: 'sad', color: 'from-blue-400 to-blue-200', ring: 'ring-blue-300', label: '😔 Sad' },
  { value: 'angry', color: 'from-red-400 to-orange-300', ring: 'ring-red-300', label: '😡 Angry' },
  { value: 'anxious', color: 'from-purple-400 to-blue-300', ring: 'ring-purple-300', label: '😱 Anxious' },
  { value: 'neutral', color: 'from-gray-200 to-gray-100', ring: 'ring-gray-300', label: '😐 Neutral' },
];

function getMoodOption(tag) {
  const preset = MOOD_COLORS.find(m => m.value === tag);
  if (preset) return preset;
  // Custom tag: assign a default color and label
  return {
    value: tag,
    color: 'from-green-400 to-green-600',
    ring: 'ring-green-400',
    label: `🏷️ ${tag.charAt(0).toUpperCase() + tag.slice(1)}`,
    text: 'text-white',
  };
}

export default function Journal() {
  const { entries, addEntry, updateEntry, deleteEntry } = useJournal();
  const { tags } = useMoodTags();
  const [form, setForm] = useState({
    mood: '',
    tags: [],
    tagInput: '',
    notes: '',
    photo: null,
    photoUrl: '',
  });
  const [editIdx, setEditIdx] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestedMood, setAiSuggestedMood] = useState(null);
  const fileInputRef = useRef();

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === 'photo' && files[0]) {
      setForm(f => ({ ...f, photo: files[0], photoUrl: URL.createObjectURL(files[0]) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleTagInput(e) {
    setForm(f => ({ ...f, tagInput: e.target.value }));
  }

  function handleTagKeyDown(e) {
    if ((e.key === 'Enter' || e.key === ',') && form.tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(form.tagInput.trim())) {
        setForm(f => ({ ...f, tags: [...f.tags, f.tagInput.trim()], tagInput: '' }));
      } else {
        setForm(f => ({ ...f, tagInput: '' }));
      }
    }
  }

  function removeTag(idx) {
    setForm(f => ({ ...f, tags: f.tags.filter((_, i) => i !== idx) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.mood) return;
    if (editIdx !== null) {
      updateEntry(editIdx, form);
      setEditIdx(null);
    } else {
      addEntry(form);
    }
    setForm({ mood: '', tags: [], tagInput: '', notes: '', photo: null, photoUrl: '' });
    setShowForm(false);
    setTimeout(() => setShowForm(true), 300);
  }

  function handleEdit(idx) {
    setForm(entries[idx]);
    setEditIdx(idx);
    setShowForm(true);
  }

  function handleDelete(idx) {
    deleteEntry(idx);
    if (editIdx === idx) setEditIdx(null);
  }

  async function handleAIMoodDetection() {
    if (!form.notes || form.notes.trim().length < 10) {
      alert('Please write at least 10 characters in your notes for AI mood detection.');
      return;
    }

    setAiLoading(true);
    setAiSuggestedMood(null);

    try {
      const suggestedMood = await detectMoodFromNotes(form.notes, tags);
      if (suggestedMood) {
        setAiSuggestedMood(suggestedMood);
        setForm(f => ({ ...f, mood: suggestedMood }));
      } else {
        alert('AI couldn\'t determine a mood. Please try writing more detailed notes or select a mood manually.');
      }
    } catch (error) {
      console.error('AI mood detection failed:', error);
      alert(`AI mood detection failed: ${error.message}. Please check your OpenAI API key in the .env file.`);
    } finally {
      setAiLoading(false);
    }
  }

  function handleFAB() {
    setShowForm(true);
    setEditIdx(null);
    setForm({ mood: '', tags: [], tagInput: '', notes: '', photo: null, photoUrl: '' });
    setAiSuggestedMood(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="relative glass rounded-2xl p-8 shadow-lg min-h-[70vh] overflow-x-hidden hover-glow">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent dark:text-green-400 typing-animation">Mood Journal</h2>
      {/* Floating Action Button for mobile */}
      <button
        className="md:hidden fixed bottom-8 right-8 z-50 bg-gradient-to-r from-pink-400 to-blue-400 text-white dark:bg-gradient-to-r dark:from-green-700 dark:to-green-500 dark:text-green-100 rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl hover:scale-110 transition-all pulse-glow"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)' }}
        onClick={handleFAB}
        aria-label="Add Mood Entry"
      >
        +
      </button>
      {/* Mood Entry Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8 animate-fade-in">
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => {
              const opt = getMoodOption(tag);
              return (
                <label key={opt.value} className={`cursor-pointer px-4 py-2 rounded-full bg-gradient-to-r ${opt.color} ${opt.text || 'text-gray-900 dark:text-white'} font-semibold shadow-sm flex items-center gap-2 transition-all duration-150 hover-bounce ${form.mood === opt.value ? `${opt.ring} ring-2 scale-105 dark:ring-green-400 pulse-glow` : 'hover:scale-105'}`}>
                  <input
                    type="radio"
                    name="mood"
                    value={opt.value}
                    checked={form.mood === opt.value}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="text-lg font-bold drop-shadow-sm">{opt.label}</span>
                </label>
              );
            })}
          </div>
          <div>
            <div className="flex flex-wrap gap-1 mb-1">
              {form.tags.map((tag, idx) => (
                <TagChip key={tag} tag={tag} onRemove={() => removeTag(idx)} />
              ))}
            </div>
            <input
              type="text"
              name="tagInput"
              value={form.tagInput}
              onChange={handleTagInput}
              onKeyDown={handleTagKeyDown}
              placeholder="Add tags (press Enter or ,)"
              className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-200 dark:focus:ring-green-700 bg-white/90 dark:bg-gray-800/90 text-primary placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-pink-300 dark:focus:border-green-500 transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Notes or reflections..."
              className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-200 dark:focus:ring-green-700 bg-white/90 dark:bg-gray-800/90 text-primary placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-pink-300 dark:focus:border-green-500 transition-all duration-200 resize-none"
              rows="4"
            />
            {isAIMoodDetectionAvailable() && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAIMoodDetection}
                  disabled={aiLoading || !form.notes || form.notes.trim().length < 10}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover-bounce ${
                    aiLoading || !form.notes || form.notes.trim().length < 10
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:scale-105 shadow-md hover-glow'
                  }`}
                >
                  {aiLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      AI Detect Mood
                    </>
                  )}
                </button>
                {aiSuggestedMood && (
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium animate-fade-in">
                    AI suggested: {getMoodOption(aiSuggestedMood).label}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <input ref={fileInputRef} type="file" name="photo" accept="image/*" onChange={handleChange} className="hover-bounce" />
            {form.photoUrl && (
              <img
                src={form.photoUrl}
                alt="preview"
                className="w-14 h-14 rounded-lg object-cover border-2 border-pink-200 dark:border-green-400 shadow-md cursor-pointer hover:scale-110 transition-all hover-glow"
                onClick={() => window.open(form.photoUrl, '_blank')}
              />
            )}
          </div>
          <div className="flex gap-4 items-center">
            <button type="submit" className="bg-gradient-to-r from-pink-400 to-blue-400 dark:from-green-700 dark:to-green-500 text-white dark:text-green-100 px-6 py-2 rounded-full font-bold shadow hover:scale-105 transition-all hover-glow">
              {editIdx !== null ? 'Update Entry' : 'Add Entry'}
            </button>
            {editIdx !== null && (
              <button type="button" onClick={handleFAB} className="text-gray-500 dark:text-gray-300 underline hover-bounce">Cancel Edit</button>
            )}
          </div>
        </form>
      )}
      {/* Mood History */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-pink-400 dark:text-green-400">Mood History</h3>
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted">
            <div className="mb-4 hover-bounce">
              <svg width="80" height="80" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="url(#grad)" opacity="0.2" />
                <path d="M8 15s1.5 2 4 2 4-2 4-2" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="9" cy="10" r="1" fill="#a78bfa"/>
                <circle cx="15" cy="10" r="1" fill="#a78bfa"/>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="24" y2="24">
                    <stop stopColor="#fbc2eb"/>
                    <stop offset="1" stopColor="#a6c1ee"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="typing-animation">No entries yet. Start journaling your mood!</span>
          </div>
        ) : (
          <ul className="space-y-6 animate-fade-in">
            {entries.map((entry, idx) => (
              <li key={idx} className={`group bg-white/90 dark:bg-gray-800 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center gap-4 border-l-8 ${getMoodOption(entry.mood).color} bg-gradient-to-r hover:scale-[1.02] transition-all duration-200 hover-glow`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-2xl font-bold drop-shadow-sm ${getMoodOption(entry.mood).text || 'text-gray-900 dark:text-white'}`}> {getMoodOption(entry.mood).label} </span>
                    <span className="text-xs text-muted">{new Date(entry.date).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {entry.tags && entry.tags.map((tag, i) => <TagChip key={tag} tag={tag} />)}
                  </div>
                  {entry.notes && <div className="text-secondary text-sm mb-1">{entry.notes}</div>}
                  {entry.photoUrl && (
                    <img
                      src={entry.photoUrl}
                      alt="entry"
                      className="w-20 h-20 rounded-lg object-cover mt-2 border-2 border-pink-200 dark:border-green-400 shadow-md cursor-pointer hover:scale-110 transition-all hover-glow"
                      onClick={() => window.open(entry.photoUrl, '_blank')}
                    />
                  )}
                </div>
                <div className="flex gap-2 md:flex-col md:gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button onClick={() => handleEdit(idx)} className="text-blue-500 dark:text-green-400 hover:underline hover-bounce">Edit</button>
                  <button onClick={() => handleDelete(idx)} className="text-red-400 dark:text-pink-400 hover:underline hover-bounce">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Animations
// Add this to your global CSS (e.g., index.css):
// .animate-fade-in { animation: fadeIn 0.5s; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } } 