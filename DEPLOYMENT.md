# Deployment Guide

Hey there! Thanks for checking out Mood Journal Pro. I wanted to make it super easy for you (and my interviewers!) to run and deploy this project, so here’s a step-by-step guide.

---

## Why This Guide?
I know how frustrating it can be to get a project running, especially with API keys and modern build tools. This guide is here to save you time and help you see the app in action, whether you’re a reviewer or just curious!

---

## Pre-Deployment Checklist
- Code is clean and documented
- No sensitive keys in the repo
- All features work as described

---

## Deployment Options

### 1. Netlify (Super Easy!)
1. Build the project:
   ```bash
   npm run build
   ```
2. Go to [netlify.com](https://netlify.com) and drag the `build` folder into the dashboard, or connect your GitHub repo.
3. Set your environment variables in Site Settings > Environment Variables.

### 2. Vercel
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Deploy:
   ```bash
   vercel
   ```
3. Set your environment variables in the Vercel dashboard.

### 3. GitHub Pages
1. Add this to your `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/mood-journal-pro"
   ```
2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```
3. Add these scripts to `package.json`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
4. Deploy:
   ```bash
   npm run deploy
   ```

---

## Environment Setup
1. Copy `env.example` to `.env`
2. Add your API keys
3. Run `npm start` for local dev

---

## Tips for Reviewers
- Try the AI mood detection with a real journal entry!
- Build a playlist and play a song in-app
- Add a few entries to see gamification in action
- Check out the analytics and charts

---

## Thanks!
If you have any trouble running or deploying, just let me know (alekhyar2005@gmail.com). I’m happy to help or answer questions.

Good luck, and I hope you enjoy Mood Journal Pro!

— Alekhya 