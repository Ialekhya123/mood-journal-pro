// spotify.js
// Utility for Spotify API integration
// 1. Add your credentials to a .env file in the project root:
//    REACT_APP_SPOTIFY_CLIENT_ID=your_client_id_here
//    REACT_APP_SPOTIFY_CLIENT_SECRET=your_client_secret_here
// 2. Restart your dev server after editing .env

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

let accessToken = null;
let tokenExpires = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpires) return accessToken;
  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
    },
    body: 'grant_type=client_credentials',
  });
  const data = await resp.json();
  accessToken = data.access_token;
  tokenExpires = Date.now() + (data.expires_in - 60) * 1000;
  return accessToken;
}

export async function searchPlaylistsByMood(mood) {
  const token = await getAccessToken();
  const resp = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(mood)}&type=playlist&limit=15`,
    {
      headers: { Authorization: 'Bearer ' + token },
    }
  );
  const data = await resp.json();
  return data.playlists?.items || [];
}

export async function getPlaylistTracks(playlistId) {
  const token = await getAccessToken();
  const resp = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=10`,
    {
      headers: { Authorization: 'Bearer ' + token },
    }
  );
  const data = await resp.json();
  return data.items || [];
} 