# 🎵 Mood Journal Pro

A modern, interactive mood journaling application with AI-powered mood detection, Spotify integration, and gamification features.

## ✨ Features

### 🧠 **AI-Powered Mood Detection**
- **OpenAI Integration**: Automatically detects mood from journal notes
- **Smart Analysis**: Analyzes text content to suggest appropriate moods
- **Custom Mood Tags**: Support for custom mood categories

### 🎵 **Spotify Playlist Integration**
- **Mood-Based Playlists**: Create playlists based on your current mood
- **In-App Music Player**: Listen to music directly within the app
- **Favorites Management**: Save and organize your favorite tracks

### 📊 **Advanced Analytics & Insights**
- **Interactive Charts**: Visualize mood trends over time
- **Mood Distribution**: Pie charts showing mood patterns
- **Data Export**: Export your journal data for analysis

### 🏆 **Gamification System**
- **Experience Points (XP)**: Earn XP for journaling consistently
- **Level System**: Progress through levels as you journal
- **Achievement Badges**: Unlock achievements for milestones
- **Streak Tracking**: Track your journaling streaks

### 🎨 **Modern UI/UX**
- **Glass Morphism Design**: Beautiful frosted glass effects
- **Animated Background**: Dynamic particle effects and floating elements
- **Dark/Light Mode**: Full theme support
- **Responsive Design**: Works on desktop and mobile
- **Interactive Animations**: Smooth hover effects and transitions

### 📱 **Core Journaling Features**
- **Mood Tracking**: Log your daily moods with emojis
- **Photo Attachments**: Add photos to your journal entries
- **Tag System**: Organize entries with custom tags
- **Local Storage**: Data persists in your browser
- **Search & Filter**: Find specific entries easily

## 🚀 Technologies Used

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS with custom animations
- **AI Integration**: OpenAI GPT API for mood detection
- **Music API**: Spotify Web API for playlist creation
- **Charts**: Recharts for data visualization
- **State Management**: React Context API
- **Animations**: CSS3 with custom keyframes

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mood-journal-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_OPENAI_API_KEY=your_openai_api_key
   REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
   REACT_APP_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## 🔧 Configuration

### OpenAI API Setup
1. Get your API key from [OpenAI Platform](https://platform.openai.com/)
2. Add it to your `.env` file as `REACT_APP_OPENAI_API_KEY`

### Spotify API Setup
1. Create a Spotify app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Add your Client ID and Secret to `.env`
3. Configure redirect URIs in your Spotify app settings

## 🎯 Key Features Implementation

### AI Mood Detection
```javascript
// Uses OpenAI API to analyze journal text and suggest moods
const suggestedMood = await detectMoodFromNotes(notes, availableMoods);
```

### Gamification System
```javascript
// Context-based XP and level management
const { xp, level, achievements, streaks } = useGamification();
```

### Spotify Integration
```javascript
// Real-time playlist creation based on mood
const playlist = await createMoodPlaylist(mood, tracks);
```

## 📱 App Structure

```
src/
├── components/
│   ├── AuthProvider.js      # Context for journal data
│   ├── GamificationProvider.js # XP, levels, achievements
│   ├── Journal.js          # Main journaling interface
│   ├── Insights.js         # Analytics and charts
│   ├── PlaylistBuilder.js  # Spotify integration
│   ├── Profile.js          # User stats and achievements
│   ├── Settings.js         # App configuration
│   └── Navbar.js           # Navigation component
├── services/
│   └── aiMoodDetection.js  # OpenAI API integration
└── App.js                  # Main application component
```

## 🎨 Design Highlights

- **Glass Morphism**: Modern frosted glass UI elements
- **Particle Effects**: Animated background particles
- **Smooth Animations**: CSS3 transitions and keyframes
- **Responsive Layout**: Mobile-first design approach
- **Accessibility**: Proper focus states and ARIA labels

## 🔮 Future Enhancements

- [ ] **Cloud Sync**: Save data to cloud storage
- [ ] **Social Features**: Share mood insights with friends
- [ ] **Advanced Analytics**: Machine learning insights
- [ ] **Mobile App**: Native iOS/Android versions
- [ ] **Voice Notes**: Audio journaling support
- [ ] **Mood Reminders**: Smart notification system

## 🤝 Contributing

This is a demo project for interview purposes. Feel free to explore the code and suggest improvements!

## 📄 License

This project is created for educational and interview demonstration purposes.

---

**Built with ❤️ using React, Tailwind CSS, and modern web technologies**
