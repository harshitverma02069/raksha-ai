# 🛡️ RAKSHA AI (रक्षा) — Arunachal Pradesh Disaster Survival Intelligence System

> **Mathematically-rigorous, authentic real-time, multi-persona, and multi-lingual disaster survival AI engine built specifically for the extreme geography, Himalayan faults, and monsoon floods of Arunachal Pradesh, India.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests: 44/44 Passed](https://img.shields.io/badge/Tests-44%2F44%20Passed-success.svg)](test-verification.js)
[![Deployed on Render](https://img.shields.io/badge/Deploy-Render-46E3B7.svg)](render.yaml)

---

## 🌟 Overview

**RAKSHA AI** is an offline-first mountain survival application designed to save lives during landslides, flash floods, earthquakes (Zone V), and severe monsoon washouts across all **28 districts** of Arunachal Pradesh.

It combines:
- **Physics-Driven Mathematical Engines**: Factor of Safety ($FoS < 1.0$), Fahrböschung reach angle runout envelopes, and Time-Dependent Multi-Objective A* (TD-MOA*) pathfinding.
- **3D Animated Escape Simulation Engine**: Real-time canvas simulation showing tumbling 3D boulders, dust particle clouds, and 90° lateral sprint vectors to safe bedrock.
- **Authentic Live Telemetry**: Live Open-Meteo rainfall and temperature, USGS Zone V seismic tremors, and live highway status (NH-13, Sela Tunnel, NH-313, BCT).
- **Google Gemini 1.5 Flash Copilot**: Conversational AI assistant with voice dictation (STT), multi-lingual speech synthesis (TTS), and graceful local neural fallback.
- **Multi-Lingual Survival Manual & Help Box Index**: 10 comprehensive guides translated and spoken across 15 regional and tribal languages (English, Hindi, Nyishi, Adi, Galo, Monpa, Wancho, Apatani, Tagin, etc.).

---

## 👥 Tri-Persona User Intelligence

1. **🏡 Local Resident / Trapped Civilian**:
   - Immediate tactical life-or-death slope failure ($FoS < 1.0$) early warnings.
   - 90° lateral perpendicular sprint vector away from debris flow paths.
   - Indigenous tribal jungle wisdom: potable water tapping from mountain bamboo (*Dendrocalamus hamiltonii*), wild edible plants, and torrential rain lean-tos.
   - Priority P0 Emergency SOS Beacon with GPS, altitude, battery, and medical triage.

2. **🧳 Tourist / Outsider / Visitor / Remote Worker**:
   - **Sela Tunnel vs Old Sela Top Pass Advisory**: Real-time twin-tube tunnel status vs pass closure warnings.
   - **Inner Line Permit (ILP) Disaster Extension**: Automatic legal immunity and transit extension under Section 4 of Bengal Eastern Frontier Regulation 1873 during red-alert disasters.
   - **Acute Mountain Sickness (AMS) Protocol**: High-altitude triage for Tawang (10,000 ft) and Bum La (15,200 ft), Diamox dosage, and descent corridors.
   - **Assam Evacuation Corridors**: Highway arteries to Guwahati Airport (GAU), Tezpur Airport (TEZ), and Dibrugarh Airport (DIB).

3. **📡 Situational Monitor / Remote Family / Authority**:
   - Real-time statewide 28-district telemetry grid and vulnerability index.
   - Live USGS earthquake tremors with epicenter distance calculation.
   - Live crowdsourced community hazard map pins and real-time SSE broadcasts.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
```bash
# 1. Clone repository
git clone <YOUR-GITHUB-REPO-URL>
cd raksha-ai

# 2. Install dependencies
npm install

# 3. Start the application
npm start
```

Open your browser at: **`http://localhost:3000`**

### Running the Test Suite
```bash
npm test
# Or: node test-verification.js
```
Runs 44 automated assertions verifying mathematical physics, routing, live APIs, and multi-lingual manual data integrity.

---

## ☁️ Deploying to Render (Free Cloud Hosting)

This repository includes a `render.yaml` blueprint for 1-click deployment.

### Method 1: Using the Render Dashboard (Recommended)
1. Push this repository to your **GitHub** account.
2. Go to **[dashboard.render.com](https://dashboard.render.com/)** and log in.
3. Click **"New +"** → **"Web Service"**.
4. Select your **GitHub repository** (`raksha-ai`).
5. Configure settings:
   - **Name**: `raksha-ai`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`
6. *(Optional)* Add Environment Variable:
   - `GEMINI_API_KEY`: *(Your Google AI Studio API Key)*
7. Click **"Deploy Web Service"**!
8. Within 60 seconds, your app will be live at: `https://raksha-ai-xxxx.onrender.com`!

### Method 2: Render Blueprint (Infrastructure as Code)
1. Go to **Render Dashboard** → **"New +"** → **"Blueprint"**.
2. Connect your GitHub repository.
3. Render will automatically read `render.yaml` and configure the web service.

---

## 📁 Project Architecture

```
raksha-ai/
├── public/
│   ├── app.js               # Main application orchestration & UI state
│   ├── index.html           # PWA Shell with persona switcher & audio synthesis
│   └── sw.js                # Service Worker for offline IndexedDB caching
├── src/
│   ├── core/
│   │   ├── escape-simulator.js      # 3D isometric simulation engine
│   │   ├── evacuation-router.js     # Multi-modal TD-MOA* router
│   │   ├── landslide-predictor.js   # FoS slope stability physics engine
│   │   ├── risk-assessor.js         # UNDRR composite multi-hazard model
│   │   ├── safety-zone-calculator.js# Fahrböschung reach angle runout
│   │   └── survival-decision-engine.js# Real-time action matrix
│   ├── data/
│   │   ├── districts.js             # 28 districts geo-telemetry & baseline
│   │   ├── hazard-zones.js          # Landslide & seismic fault zones
│   │   ├── emergency-resources.js   # Hospitals, ALGs, 12th Bn NDRF
│   │   ├── languages.js             # 15 regional & tribal languages
│   │   ├── transportation-network.js# Highways, passes, ALGs, heliports
│   │   └── user-manual.js           # Multi-lingual Help Box Index & handbook
│   └── styles/
│       └── main.css                 # Dark mountain glassmorphic UI & 3D canvas styles
├── server.js                # Unified HTTP/SSE server & live API proxy
├── render.yaml              # Render Cloud deployment blueprint
├── package.json             # NPM package scripts & dependencies
├── test-verification.js     # 44-assertion automated test suite
└── README.md                # Project documentation
```

---

## 🔑 Gemini AI API Configuration

RAKSHA AI works completely out-of-the-box with its built-in **Local Offline Neural Survival Engine**.

To activate Google Gemini 1.5 Flash:
1. Get a 100% free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Either:
   - Enter it directly inside the app by clicking **`🔑 Add Free Gemini Key`** on the **AI Copilot** tab.
   - Or set `GEMINI_API_KEY=AIzaSy...` in your Render Environment Variables.

---

## 📄 License
MIT License. Built for the safety and resilience of the people of Arunachal Pradesh and mountain travelers.
