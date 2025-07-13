import React, { useEffect, useState } from 'react';
import { useJournal } from './AuthProvider';
import { searchPlaylistsByMood, getPlaylistTracks } from '../spotify';

const FALLBACK_IMAGE = 'https://via.placeholder.com/150?text=No+Image';
const FAVORITES_KEY = 'mood_journal_favorite_playlists';
const SPOTIFY_GREEN = '#1DB954';

function getStoredFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

function PlayIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="18" fill="rgba(30,215,96,0.9)" />
      <polygon points="14,11 27,18 14,25" fill="white" />
    </svg>
  );
}

export default function PlaylistBuilder() {
  const { entries } = useJournal();
  const latestMood = entries[0]?.mood;
  const [playlists, setPlaylists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState(getStoredFavorites());

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    async function fetchPlaylists() {
      if (!latestMood) return;
      setLoading(true);
      setError('');
      setSelected(null);
      setTracks([]);
      try {
        const pls = await searchPlaylistsByMood(latestMood);
        setPlaylists(Array.isArray(pls) ? pls.filter(Boolean) : []);
      } catch (e) {
        setError('Failed to fetch playlists.');
      }
      setLoading(false);
    }
    fetchPlaylists();
  }, [latestMood]);

  async function handleSelect(pl) {
    setSelected(pl);
    setTracks([]);
    setLoading(true);
    try {
      const tr = await getPlaylistTracks(pl.id);
      setTracks(Array.isArray(tr) ? tr.filter(Boolean) : []);
    } catch (e) {
      setError('Failed to fetch tracks.');
    }
    setLoading(false);
  }

  function isFavorite(pl) {
    return favorites.some(fav => fav.id === pl.id);
  }

  function addFavorite(pl) {
    if (!isFavorite(pl)) setFavorites([pl, ...favorites]);
  }

  function removeFavorite(pl) {
    setFavorites(favorites.filter(fav => fav.id !== pl.id));
  }

  function pluralize(count, word) {
    return count === 1 ? word : word + 's';
  }

  return (
    <div className="glass rounded-2xl p-8 shadow-lg min-h-[70vh]">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent dark:text-green-400">Playlist Builder</h2>
      {/* Favorites Section */}
      {favorites.length > 0 && !selected && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2 text-pink-400 dark:text-green-400">Your Favorite Playlists</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {favorites.map(pl => (
              <div key={pl.id} className="group bg-white/90 dark:bg-gray-800 rounded-xl p-3 shadow flex flex-col items-center relative cursor-pointer hover:scale-105 transition-all" onClick={() => handleSelect(pl)}>
                <div className="relative w-full flex justify-center">
                  <img src={pl.images?.[0]?.url || FALLBACK_IMAGE} alt={pl.name} className="w-32 h-32 rounded-lg object-cover shadow" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayIcon />
                  </div>
                </div>
                <div className="font-bold text-gray-900 dark:text-white text-center mt-2 line-clamp-1 w-full">{pl.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-300 text-center line-clamp-1 w-full">{pl.owner?.display_name || 'Spotify'}</div>
                <div className="text-xs text-gray-400 dark:text-gray-400 mt-1">{pl.tracks?.total} {pluralize(pl.tracks?.total, 'track')}</div>
                <a href={pl.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-xs mt-1" style={{ color: SPOTIFY_GREEN }}>Open in Spotify</a>
                <button
                  onClick={e => { e.stopPropagation(); removeFavorite(pl); }}
                  className="absolute top-2 right-2 bg-pink-100 dark:bg-gray-700 text-pink-500 dark:text-green-400 rounded-full px-2 py-1 text-xs font-bold shadow hover:bg-pink-200 dark:hover:bg-gray-600"
                  title="Remove from favorites"
                >
                  ♥
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {!latestMood && (
        <div className="text-gray-400 dark:text-gray-500 text-center py-12">Add a mood entry to get playlist recommendations!</div>
      )}
      {error && <div className="text-red-400 text-center mb-4">{error}</div>}
      {loading && <div className="text-blue-400 text-center py-8">Loading...</div>}
      {/* Playlist Recommendations */}
      {!loading && latestMood && !selected && playlists.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-400 dark:text-green-400">Recommended Playlists for your mood</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {playlists.filter(pl => pl && pl.images && pl.images.length > 0).map(pl => (
              <div key={pl.id} className="group bg-white/90 dark:bg-gray-800 rounded-xl p-3 shadow flex flex-col items-center relative cursor-pointer hover:scale-105 transition-all" onClick={() => handleSelect(pl)}>
                <div className="relative w-full flex justify-center">
                  <img src={pl.images[0]?.url || FALLBACK_IMAGE} alt={pl.name} className="w-32 h-32 rounded-lg object-cover shadow" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayIcon />
                  </div>
                </div>
                <div className="font-bold text-gray-900 dark:text-white text-center mt-2 line-clamp-1 w-full">{pl.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-300 text-center line-clamp-1 w-full">{pl.owner?.display_name || 'Spotify'}</div>
                <div className="text-xs text-gray-400 dark:text-gray-400 mt-1">{pl.tracks?.total} {pluralize(pl.tracks?.total, 'track')}</div>
                <a href={pl.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-xs mt-1" style={{ color: SPOTIFY_GREEN }}>Open in Spotify</a>
                <button
                  onClick={e => { e.stopPropagation(); isFavorite(pl) ? removeFavorite(pl) : addFavorite(pl); }}
                  className={`absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-bold shadow ${isFavorite(pl) ? 'bg-pink-400 dark:bg-green-600 text-white' : 'bg-pink-100 dark:bg-gray-700 text-pink-500 dark:text-green-400 hover:bg-pink-200 dark:hover:bg-gray-600'}`}
                  title={isFavorite(pl) ? 'Remove from favorites' : 'Save to favorites'}
                >
                  ♥
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Playlist Tracks & In-App Playback */}
      {selected && (
        <div className="mt-8">
          <button onClick={() => { setSelected(null); setTracks([]); }} className="mb-4 text-blue-400 dark:text-green-400 underline">&larr; Back to playlists</button>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex flex-col items-center">
              <img src={selected.images?.[0]?.url || FALLBACK_IMAGE} alt={selected.name} className="w-40 h-40 rounded-xl object-cover shadow mb-2" />
              {/* Spotify Embed Player */}
              <iframe
                title="Spotify Player"
                src={`https://open.spotify.com/embed/playlist/${selected.id}`}
                width="240"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="rounded-lg shadow mt-2"
              />
            </div>
            <div className="flex-1">
              <div className="font-bold text-2xl text-pink-500 dark:text-green-400 mb-1">{selected.name}</div>
              <div className="text-gray-500 dark:text-gray-300 mb-2">{selected.description}</div>
              <a href={selected.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-400 dark:text-green-400 underline text-sm">Open in Spotify</a>
              <h4 className="mt-4 font-semibold text-blue-400 dark:text-green-400">Top Tracks</h4>
              <div className="text-gray-400 dark:text-gray-400 text-xs mb-2">Tip: Not all tracks have a Spotify preview. If you see 'No preview', it's a limitation from Spotify.</div>
              <ul className="mt-2 space-y-3">
                {tracks.filter(t => t && t.track).map((t, i) => (
                  <li key={t.track.id} className="flex items-center gap-4 bg-white/80 dark:bg-gray-700 rounded-lg p-2 shadow-sm">
                    <img src={t.track.album?.images?.[2]?.url || t.track.album?.images?.[0]?.url || FALLBACK_IMAGE} alt={t.track.name} className="w-12 h-12 rounded object-cover" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 dark:text-white">{t.track.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-300">{t.track.artists.map(a => a.name).join(', ')}</div>
                    </div>
                    {t.track.preview_url ? (
                      <audio controls src={t.track.preview_url} className="w-32" />
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-400">No preview</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 