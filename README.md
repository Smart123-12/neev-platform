# NEEV — Smart Volunteer Coordination Platform
### *Where community needs meet human purpose*

> **Google Solution Challenge 2026 · Problem 5: Smart Resource Allocation**

## 🚀 Live Deployments

| Platform | URL | Status |
|---|---|---|
| **Google Cloud Run** | [neev-platform-613146682867.asia-south1.run.app](https://neev-platform-613146682867.asia-south1.run.app) | ✅ Live |
| **Vercel** | [neev-platform.vercel.app](https://neev-platform.vercel.app) | ✅ Live |
| **GitHub** | [Smart123-12/neev-platform](https://github.com/Smart123-12/neev-platform) | ✅ Public |

NEEV (meaning "foundation" in Hindi) is an AI-powered platform that intelligently matches NGO community needs with skilled volunteers across Indian cities, using **Gemini 1.5 Flash**, **Firebase**, and **Google Maps**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏢 **NGO Portal** | Post community needs with category, urgency, and required skills |
| ✦ **AI Matching** | Gemini 1.5 Flash returns top 3 volunteer matches with scores + reasoning |
| 🤲 **Volunteer Dashboard** | Skill profile builder, AI-ranked task feed, accept & complete tasks |
| 🗺️ **Needs Map** | Google Maps with color-coded urgency markers + info windows |
| 📈 **Impact Reports** | Monthly AI-generated narrative report for NGOs |
| ⚡ **Demo Mode** | Full app experience with zero API keys — perfect for judges |

---

## 🚀 Quick Start (Demo Mode — no keys needed)

```bash
git clone https://github.com/your-username/neev.git
cd neev
npm install
npm run dev
```

Open `http://localhost:5173` → the app launches in **Demo Mode** automatically.
Click **"I represent an NGO"** or **"I want to volunteer"** to explore.

---

## 🔑 Environment Variables

Copy `.env.example` → `.env` and fill in your keys:

```env
VITE_FIREBASE_API_KEY=        # From Firebase Console
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GOOGLE_MAPS_API_KEY=     # Enable Maps JavaScript API
```

Set this server-side (not in Vite client env):

```env
GEMINI_API_KEY=               # From Google AI Studio (kept private on server)
```

### Getting API Keys

| Key | Where to get |
|---|---|
| Gemini | [aistudio.google.com](https://aistudio.google.com) → Get API Key |
| Firebase | [console.firebase.google.com](https://console.firebase.google.com) → Project Settings |
| Google Maps | [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Maps JavaScript API |

---

## 🏗️ Tech Stack

```
Frontend   React 18 + Vite + Tailwind CSS 3
Backend    Firebase (Firestore + Auth + Hosting)
AI         Google Gemini 1.5 Flash API
Maps       Google Maps JavaScript API
Fonts      Playfair Display · DM Sans (Google Fonts)
```

---

## 📁 Project Structure

```
src/
  components/
    Navbar.jsx           Navy header, NEEV wordmark, role-aware links
    NeedCard.jsx         Gold left border, urgency badge, AI match button
    VolunteerCard.jsx    Match score chip in gold
    MatchResult.jsx      AI match card with Gemini reasoning
    MapView.jsx          Google Maps, colored urgency pins
    NeedForm.jsx         Slide-in panel with all need fields
    SkillTagInput.jsx    Type + Enter → gold pill chips
    LoadingSkeleton.jsx  Cream + gold shimmer
    UrgencyBadge.jsx     High/Medium/Low styled badges
    DemoModeToggle.jsx   Top-bar toggle
  pages/
    Landing.jsx          Hero, stats, feature cards, footer
    NGODashboard.jsx     4 metric cards, needs list, AI matching
    VolunteerDashboard.jsx  Profile + ranked task feed
    NeedsMap.jsx         Full-page map + filter bar + sidebar
    Login.jsx            Demo shortcuts + Firebase auth
    Register.jsx         Role-based registration form
  services/
    geminiService.js     matchVolunteersToNeed, parseNeedFromText, generateImpactReport
    firebaseService.js   Firestore CRUD + Firebase Auth helpers
    demoData.js          5 needs, 8 volunteers, mock Gemini responses
  context/
    AuthContext.jsx      role: "ngo" | "volunteer" | "demo"
    ToastContext.jsx      Navy/gold toast notifications
```

---

## 🗄️ Firestore Schema

```
needs/         { id, ngoId, ngoName, title, description, category, location, urgency,
                 volunteersNeeded, volunteersAssigned[], status, createdAt, requiredSkills[] }

volunteers/    { id, name, email, skills[], city, hoursPerWeek,
                 tasksCompleted, totalImpactHours, rating, joinedAt }

assignments/   { id, needId, volunteerId, assignedAt, completedAt, status }

ngos/          { id, name, email, city, totalNeedsPosted, impactScore }
```

---

## 🌐 Deploy to Vercel

```bash
npm run build
vercel --prod
```

Or connect your GitHub repo to Vercel — `vercel.json` handles SPA routing automatically.

---

## 📄 Firestore Security Rules

See `firestore.rules` — deploys with:
```bash
firebase deploy --only firestore:rules
```

---

## 🧑‍⚖️ For Judges

Toggle **Demo Mode ON** (gold button in navbar) to:
- Browse all 5 sample needs across 5 Indian cities
- Click **"Match with NEEV AI"** → see mock Gemini match results
- Accept and complete tasks as a volunteer
- Generate an AI impact report for the NGO
- Explore the Needs Map (static list shown if Maps key is absent)

No login, no API keys required in Demo Mode.

---

*NEEV · Built for Google Solution Challenge 2026 · Powered by Gemini AI + Firebase + Google Maps*
