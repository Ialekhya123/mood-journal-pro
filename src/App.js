import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Journal from './components/Journal';
import Insights from './components/Insights';
import Profile from './components/Profile';
import PlaylistBuilder from './components/PlaylistBuilder';
import Settings from './components/Settings';
import AuthProvider, { JournalProvider, MoodTagsProvider } from './components/AuthProvider';
import GamificationProvider from './components/GamificationProvider';

const TABS = [
  { key: 'journal', label: 'Journal' },
  { key: 'insights', label: 'Insights' },
  { key: 'playlist', label: 'Playlist Builder' },
  { key: 'profile', label: 'Profile' },
  { key: 'settings', label: 'Settings' },
];

export default function App() {
  const [tab, setTab] = useState('journal');

  return (
    <AuthProvider>
      <MoodTagsProvider>
        <JournalProvider>
          <GamificationProvider moods={['happy', 'sad', 'angry', 'anxious', 'neutral']} customTags={[]}> {/* TODO: pass real tags */}
            <div className="min-h-screen bg-animated text-primary transition-colors duration-300">
              {/* Floating Background Elements */}
              <div className="floating-elements">
                <div className="floating-element"></div>
                <div className="floating-element"></div>
                <div className="floating-element"></div>
                <div className="floating-element"></div>
              </div>
              
              {/* Particle Effects */}
              <div className="particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
              </div>
              
              <Navbar tab={tab} setTab={setTab} tabs={TABS} />
              <main className="max-w-4xl mx-auto px-2 pb-12 pt-8 relative z-10">
                {tab === 'journal' && <Journal />}
                {tab === 'insights' && <Insights />}
                {tab === 'playlist' && <PlaylistBuilder />}
                {tab === 'profile' && <Profile />}
                {tab === 'settings' && <Settings />}
              </main>
              <footer className="text-center text-muted py-6 mt-12 text-sm relative z-10">
                &copy; {new Date().getFullYear()} Mood Journal Pro &mdash; Powered by Spotify, OpenAI, and more
              </footer>
            </div>
          </GamificationProvider>
        </JournalProvider>
      </MoodTagsProvider>
    </AuthProvider>
  );
}
