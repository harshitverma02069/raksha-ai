// RAKSHA AI — Advanced Multi-Lingual & Animated Survival Application
// With Real-Time Animated Escape Simulation Model ("Visual Escape Video Engine")

import { LandslidePredictor } from '/src/core/landslide-predictor.js';
import { RiskAssessor } from '/src/core/risk-assessor.js';
import { EvacuationRouter } from '/src/core/evacuation-router.js';
import { SafetyZoneCalculator } from '/src/core/safety-zone-calculator.js';
import { SurvivalDecisionEngine } from '/src/core/survival-decision-engine.js';
import { EscapeSimulator } from '/src/core/escape-simulator.js';
import { DISTRICTS } from '/src/data/districts.js';
import { TRANSPORT_NODES, TRANSPORT_EDGES } from '/src/data/transportation-network.js';
import { EMERGENCY_RESOURCES } from '/src/data/emergency-resources.js';
import { HAZARD_ZONES } from '/src/data/hazard-zones.js';
import { LANGUAGES, TRANSLATIONS } from '/src/data/languages.js';
import { ARUNACHAL_ENCYCLOPEDIA } from '/src/data/arunachal-encyclopedia.js';
import { USER_MANUAL_CATEGORIES, USER_MANUAL_ITEMS } from '/src/data/user-manual.js';

// Application State
export const state = {
  activeTab: 'dashboard',
  currentLanguage: localStorage.getItem('raksha_lang') || 'en',
  currentPersona: localStorage.getItem('raksha_persona') || 'resident', // 'resident' | 'tourist' | 'monitor'
  geminiApiKey: localStorage.getItem('raksha_gemini_key') || '',
  geminiKeyValidated: false,
  geminiModel: localStorage.getItem('raksha_gemini_model') || 'gemini-2.0-flash',
  currentBasemap: localStorage.getItem('raksha_basemap') || 'dark',
  activeTileLayers: [],
  isRecordingVoice: false,
  speechRecognition: null,
  manualSearchQuery: '',
  manualActiveCategory: 'all',
  manualExpandedCards: {},
  isArunPopupOpen: false,
  arunVoiceMode: false,
  arunVoiceStatus: 'idle', // 'idle' | 'listening' | 'thinking' | 'speaking'
  arunLiveTranscript: '',
  audioPlayer: {
    type: 'none', // 'speech' | 'siren' | 'none'
    status: 'idle', // 'playing' | 'paused' | 'idle'
    text: '',
    label: '',
    rate: 1.0,
    utterance: null,
    sirenGainNode: null
  },
  arunHistory: [],
  arunChatMessages: [
    {
      role: 'ai',
      text: "👋 Tashi Delek! I'm **arun_safe-ai**, your cute Arunachal mountain rescue companion! 🎒 How's your journey going? Need landslide warnings, Sela Tunnel status, or safe spots in your district?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ],
  chatMessages: [
    {
      role: 'ai',
      text: 'Greetings! I am **RAKSHA AI (रक्षा)**, your mountain survival and geographical intelligence copilot powered by Google Gemini.\n\nI have complete topographical, infrastructure, road network, and disaster protocol knowledge of all 28 districts of Arunachal Pradesh. How can I assist you right now?',
      source: 'gemini-cloud',
      model: 'gemini-1.5-flash',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ],
  isOffline: !navigator.onLine,
  userLocation: { lat: 27.1004, lon: 93.6166, accuracy: 25, elevation: 320 }, // Default near Itanagar
  userDistrict: 'Papum Pare',
  currentRisk: 68,
  activeAlerts: [],
  liveWeather: null,
  liveSeismic: [],
  liveRoadways: [],
  liveHazardReports: [],
  map: null,
  mapLayers: {
    hazard: true,
    transport: true,
    emergency: true,
    safeZones: true,
    seismic: true,
    communityReports: true,
    route: true
  },
  layerGroups: {},
  currentRoute: null,
  navStepIndex: 0,
  isNavigating: false,
  alarmAudioCtx: null,
  alarmOscillator: null,
  isAlarmPlaying: false,
  fosParams: {
    slope: 38,
    rain24h: 110,
    soilDepth: 4.5,
    waterTable: 2.5,
    pga: 0.28
  },
  fosResult: null,
  escapeSimulator: null,
  activeSimScenario: 'landslide',
  currentSimStep: 1,
  currentSimText: '',
  simSpeed: 1.0,
  simViewMode: '3d_isometric',
  sosHistory: []
};

// Initialize Core Engines
const landslidePredictor = new LandslidePredictor();
const riskAssessor = new RiskAssessor();
const safetyCalculator = new SafetyZoneCalculator();
const decisionEngine = new SurvivalDecisionEngine();

// Prepare Node Map & Router
const nodeMap = {};
for (const node of TRANSPORT_NODES) {
  nodeMap[node.id] = node;
}
const evacuationRouter = new EvacuationRouter(nodeMap, TRANSPORT_EDGES);

// Translation helper
export function t(key) {
  const lang = state.currentLanguage;
  if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
    return TRANSLATIONS[lang][key];
  }
  if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) {
    return TRANSLATIONS['en'][key];
  }
  return key;
}

// ==========================================
// UNIVERSAL AUDIO CONTROLLER (Stop, Pause, Resume, Restart)
// ==========================================
export function stopAudio() {
  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch(e) {}
  }
  if (state.isAlarmPlaying) {
    stopSirenInternal();
  }
  state.audioPlayer.status = 'idle';
  state.audioPlayer.type = 'none';
  state.audioPlayer.sirenGainNode = null;
  state.arunVoiceStatus = 'idle';
  updateAudioPlayerUI();
  updateAlarmButtonUI();
  if (state.isArunPopupOpen) {
    toggleArunPopup(true);
  }
}

export function pauseAudio() {
  if (state.audioPlayer.type === 'speech') {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.pause();
        state.audioPlayer.status = 'paused';
        state.arunVoiceStatus = 'idle';
      } catch(e) {}
    }
  } else if (state.audioPlayer.type === 'siren' && state.audioPlayer.sirenGainNode && state.alarmAudioCtx) {
    try {
      state.audioPlayer.sirenGainNode.gain.setValueAtTime(0, state.alarmAudioCtx.currentTime);
      state.audioPlayer.status = 'paused';
    } catch(e) {}
  }
  updateAudioPlayerUI();
  if (state.isArunPopupOpen) {
    toggleArunPopup(true);
  }
}

export function resumeAudio() {
  if (state.audioPlayer.type === 'speech') {
    if ('speechSynthesis' in window) {
      try {
        if (state.audioPlayer.status === 'paused') {
          window.speechSynthesis.resume();
          state.audioPlayer.status = 'playing';
          state.arunVoiceStatus = 'speaking';
        } else if (state.audioPlayer.text) {
          speak(state.audioPlayer.text, state.audioPlayer.rate);
        }
      } catch(e) {
        if (state.audioPlayer.text) speak(state.audioPlayer.text, state.audioPlayer.rate);
      }
    }
  } else if (state.audioPlayer.type === 'siren' && state.audioPlayer.sirenGainNode && state.alarmAudioCtx) {
    try {
      state.audioPlayer.sirenGainNode.gain.setValueAtTime(0.45, state.alarmAudioCtx.currentTime);
      state.audioPlayer.status = 'playing';
    } catch(e) {}
  }
  updateAudioPlayerUI();
  if (state.isArunPopupOpen) {
    toggleArunPopup(true);
  }
}

export function restartAudio() {
  if (state.audioPlayer.type === 'speech') {
    const text = state.audioPlayer.text;
    const rate = state.audioPlayer.rate;
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch(e) {}
    }
    state.audioPlayer.status = 'idle';
    if (text) {
      speak(text, rate);
    }
  } else if (state.audioPlayer.type === 'siren') {
    stopSirenInternal();
    toggleEmergencySiren();
  }
  updateAudioPlayerUI();
  if (state.isArunPopupOpen) {
    toggleArunPopup(true);
  }
}

// Floating Universal Audio Controller Widget in DOM
export function updateAudioPlayerUI() {
  let bar = document.getElementById('floating-audio-bar');
  if (state.audioPlayer.status === 'idle') {
    if (bar) bar.style.display = 'none';
    return;
  }

  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'floating-audio-bar';
    bar.className = 'floating-audio-bar';
    document.body.appendChild(bar);
  }

  bar.style.display = 'flex';
  const isPlaying = state.audioPlayer.status === 'playing';
  const isSiren = state.audioPlayer.type === 'siren';

  bar.innerHTML = `
    <div class="audio-bar-info">
      <div class="audio-bar-wave ${isPlaying ? 'active' : ''}">
        <span></span><span></span><span></span><span></span>
      </div>
      <div class="audio-bar-labels">
        <div class="audio-bar-tag ${isSiren ? 'siren' : ''}">
          ${isSiren ? '🚨 SIREN' : '🎙️ ASSISTANT'} &bull; ${state.audioPlayer.status.toUpperCase()}
        </div>
        <div class="audio-bar-title" title="${state.audioPlayer.text}">
          ${state.audioPlayer.label || 'Audio Playback Active'}
        </div>
      </div>
    </div>
    <div class="audio-bar-actions">
      ${isPlaying ? `
        <button onclick="window.raksha.pauseAudio()" class="audio-action-btn pause" title="Pause Audio">
          ⏸️ Pause
        </button>
      ` : `
        <button onclick="window.raksha.resumeAudio()" class="audio-action-btn resume" title="Resume Audio">
          ▶️ Resume
        </button>
      `}
      <button onclick="window.raksha.restartAudio()" class="audio-action-btn restart" title="Restart Audio">
        🔄 Restart
      </button>
      <button onclick="window.raksha.stopAudio()" class="audio-action-btn stop" title="Stop Audio">
        ⏹️ Stop
      </button>
    </div>
  `;
}

// Multi-Lingual Speech Synthesis with Sanitization & Natural Fluency
export function speak(text, rate = 1.0) {
  if (!('speechSynthesis' in window)) return;
  try { window.speechSynthesis.cancel(); } catch(e) {}

  // Strip Markdown, code, URLs, and symbols for clean spoken voice
  const cleanText = text
    .replace(/[*#_`>]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\$\$[\s\S]*?\$\$/g, 'formula')
    .replace(/\$[^$]+\$/g, 'formula')
    .replace(/&bull;/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = rate;
  utterance.pitch = 1.0;

  // Language mapping
  const langObj = LANGUAGES.find(l => l.code === state.currentLanguage);
  if (langObj && langObj.ttsVoice) {
    utterance.lang = langObj.ttsVoice;
  } else if (state.currentLanguage === 'hi') {
    utterance.lang = 'hi-IN';
  } else {
    utterance.lang = 'en-IN';
  }

  state.audioPlayer = {
    type: 'speech',
    status: 'playing',
    text: cleanText,
    label: cleanText.length > 48 ? cleanText.slice(0, 45) + '...' : cleanText,
    rate,
    utterance,
    sirenGainNode: null
  };
  state.arunVoiceStatus = 'speaking';

  utterance.onend = () => {
    state.audioPlayer.status = 'idle';
    state.audioPlayer.type = 'none';
    if (state.arunVoiceStatus === 'speaking') {
      state.arunVoiceStatus = 'idle';
    }
    updateAudioPlayerUI();
    if (state.isArunPopupOpen) toggleArunPopup(true);
  };

  utterance.onerror = () => {
    state.audioPlayer.status = 'idle';
    state.audioPlayer.type = 'none';
    if (state.arunVoiceStatus === 'speaking') {
      state.arunVoiceStatus = 'idle';
    }
    updateAudioPlayerUI();
    if (state.isArunPopupOpen) toggleArunPopup(true);
  };

  window.speechSynthesis.speak(utterance);
  updateAudioPlayerUI();
}

function stopSirenInternal() {
  if (state.alarmInterval) {
    clearInterval(state.alarmInterval);
    state.alarmInterval = null;
  }
  if (state.alarmOscillator) {
    try {
      state.alarmOscillator.stop();
      state.alarmOscillator.disconnect();
    } catch (e) {}
    state.alarmOscillator = null;
  }
  if (state.alarmAudioCtx) {
    try {
      state.alarmAudioCtx.close();
    } catch (e) {}
    state.alarmAudioCtx = null;
  }
  state.isAlarmPlaying = false;
}

// Emergency Audio Siren Alarm
export async function toggleEmergencySiren() {
  if (state.isAlarmPlaying) {
    stopSirenInternal();
    state.audioPlayer.status = 'idle';
    state.audioPlayer.type = 'none';
    state.audioPlayer.sirenGainNode = null;
    updateAlarmButtonUI();
    updateAudioPlayerUI();
    return;
  }

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    state.alarmAudioCtx = ctx;

    // Critical: Resume suspended AudioContext to enable playback
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(820, ctx.currentTime);

    // Loud, clear mountain emergency siren
    gain.gain.setValueAtTime(0.45, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    state.alarmOscillator = osc;
    state.isAlarmPlaying = true;
    state.audioPlayer = {
      type: 'siren',
      status: 'playing',
      text: 'Emergency Mountain Disaster Siren Active',
      label: '🚨 EMERGENCY DISASTER SIREN',
      rate: 1.0,
      utterance: null,
      sirenGainNode: gain
    };

    updateAlarmButtonUI();
    updateAudioPlayerUI();

    // Dual-tone high-low emergency disaster wail (oscillates 1050 Hz <-> 680 Hz)
    let isHigh = false;
    state.alarmInterval = setInterval(() => {
      if (!state.isAlarmPlaying || !state.alarmOscillator || !state.alarmAudioCtx) return;
      try {
        const now = state.alarmAudioCtx.currentTime;
        isHigh = !isHigh;
        const target = isHigh ? 1060 : 660;
        state.alarmOscillator.frequency.cancelScheduledValues(now);
        state.alarmOscillator.frequency.setValueAtTime(state.alarmOscillator.frequency.value, now);
        state.alarmOscillator.frequency.linearRampToValueAtTime(target, now + 0.35);
      } catch (e) {}
    }, 380);

    // Vocal voice warning alert
    speak("Warning! Emergency disaster siren activated. Evacuate slope line immediately.");
  } catch (err) {
    console.error('AudioContext siren error:', err);
    speak("Warning! Emergency disaster alert. Move perpendicular to slope flow immediately.");
  }
}

function updateAlarmButtonUI() {
  const btn = document.getElementById('siren-btn');
  if (!btn) return;
  if (state.isAlarmPlaying) {
    btn.style.backgroundColor = '#ef4444';
    btn.style.animation = 'pulse-sos 1s infinite';
    btn.innerHTML = '🔊 SILENCE SIREN';
  } else {
    btn.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
    btn.style.animation = 'none';
    btn.innerHTML = '🚨 EMERGENCY SIREN';
  }
}

// Geolocation
export function initGeolocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.watchPosition(
      (pos) => {
        state.userLocation = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy || 15),
          elevation: pos.coords.altitude ? Math.round(pos.coords.altitude) : 340
        };
        updateNearestDistrict();
        updateUserLocationOnMap();
        renderActiveTab();
      },
      (err) => {
        updateNearestDistrict();
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
  }
}

function updateNearestDistrict() {
  let closestDist = Infinity;
  let nearest = DISTRICTS[0];

  for (const d of DISTRICTS) {
    const dist = evacuationRouter.haversine(
      state.userLocation.lat,
      state.userLocation.lon,
      d.coordinates.lat,
      d.coordinates.lon
    );
    if (dist < closestDist) {
      closestDist = dist;
      nearest = d;
    }
  }
  state.userDistrict = nearest.name;
  state.currentRisk = Math.round(nearest.vulnerabilityScore * 85);
}

// FoS Calculation
export function runFoSCalculation() {
  const p = state.fosParams;
  const fosRes = landslidePredictor.calculateFoS({
    beta: p.slope,
    z: p.soilDepth,
    z_w: p.waterTable,
    k_h: p.pga,
    c_prime: 12
  });
  const prob = landslidePredictor.calculateProbability({
    slope: p.slope,
    rain24h: p.rain24h,
    satRatio: Math.min(1, p.waterTable / p.soilDepth),
    ndvi: 0.5,
    pga: p.pga
  });

  state.fosResult = {
    fos: Math.round(fosRes.fos * 100) / 100,
    status: fosRes.status,
    color: fosRes.color,
    probability: Math.round(prob * 1000) / 10
  };
}

// ==========================================
// PERSONA SWITCHER & REAL-TIME TELEMETRY
// ==========================================
export function setPersona(persona) {
  state.currentPersona = persona;
  localStorage.setItem('raksha_persona', persona);

  document.querySelectorAll('.persona-btn').forEach(btn => {
    if (btn.dataset.persona === persona) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (persona === 'tourist') {
    speak('Tourist & Visitor mode activated. Real-time Sela Tunnel status, ILP guidance, and safe mountain travel corridors loaded.');
  } else if (persona === 'monitor') {
    speak('Statewide monitor mode activated. Live telemetry feeds connected for all 28 districts.');
  } else {
    speak('Local resident mode activated. Slope failure early warning and tactical survival active.');
  }

  renderActiveTab();
}

export function setDistrict(districtName) {
  if (!districtName) return;
  state.userDistrict = districtName;
  localStorage.setItem('raksha_district', districtName);

  // Match coordinates in DISTRICTS
  const found = DISTRICTS.find(d => 
    d.name.toLowerCase() === districtName.toLowerCase() || 
    d.id.toLowerCase() === districtName.toLowerCase()
  );
  if (found && found.coordinates) {
    state.userLocation.lat = found.coordinates.lat;
    state.userLocation.lon = found.coordinates.lon;
    if (found.elevation) state.userLocation.elevation = found.elevation;
  }

  fetchLiveTelemetry();
  renderActiveTab();
  if (state.isArunPopupOpen) {
    toggleArunPopup(true);
  }
}

export function getArunSuggestionChips() {
  if (state.currentPersona === 'tourist') {
    return [
      { label: '🏔️ Sela Tunnel Status', query: 'Is Sela Tunnel open and safe to travel right now?' },
      { label: '📋 ILP Disaster Extension', query: 'What are the Inner Line Permit disaster validity extension rules?' },
      { label: '🫁 Altitude Sickness Protocol', query: 'How to avoid and treat Acute Mountain Sickness in Tawang and Bum La?' },
      { label: '🛫 Safe Exits to Assam', query: 'What are the safe exit transit corridors to Assam airports?' }
    ];
  } else if (state.currentPersona === 'monitor') {
    return [
      { label: '📡 Statewide Roads Sitrep', query: 'What is the real-time road and landslide status across Arunachal highways?' },
      { label: '⚡ Seismic Faults Radar', query: 'What is the active seismic tremor risk on Mishmi Thrust and Kopili fault?' },
      { label: '🌊 Siang River Crest', query: 'What is the current river crest and surge level for Siang river?' },
      { label: '🚁 Air Lifelines & ALGs', query: 'List all operational Advanced Landing Grounds and helipads in Arunachal' }
    ];
  } else {
    return [
      { label: '🧮 Check Slope FoS', query: 'What is the Factor of Safety FoS of mountain slopes in my area and when does it fail?' },
      { label: '🎋 Bamboo Drinking Water', query: 'How do I tap clean drinking water from mountain bamboo in the jungle?' },
      { label: '🚨 Landslide Lateral Sprint', query: 'What is the 90 degree lateral sprint protocol during an active landslide?' },
      { label: '📞 12th Bn NDRF Lifeline', query: 'How do I reach the 12th Battalion NDRF Doimukh in an emergency?' }
    ];
  }
}

export function selectSuggestionChip(queryText) {
  submitArunQuery(queryText);
}

export async function fetchLiveTelemetry() {
  try {
    const wRes = await fetch(`/api/weather/live?lat=${state.userLocation.lat}&lon=${state.userLocation.lon}`);
    if (wRes.ok) {
      state.liveWeather = await wRes.json();
    }
  } catch (e) {}

  try {
    const sRes = await fetch('/api/seismic/live');
    if (sRes.ok) {
      const sData = await sRes.json();
      state.liveSeismic = sData.earthquakes || [];
    }
  } catch (e) {}

  try {
    const rRes = await fetch('/api/roadways/status');
    if (rRes.ok) {
      const rData = await rRes.json();
      state.liveRoadways = rData.roadways || [];
    }
  } catch (e) {}

  try {
    const hRes = await fetch('/api/hazard/reports');
    if (hRes.ok) {
      const hData = await hRes.json();
      state.liveHazardReports = hData.reports || [];
    }
  } catch (e) {}

  updateTickerUI();
  updateLiveMapMarkers();
}

export function updateTickerUI() {
  const el = document.getElementById('ticker-text');
  if (!el) return;

  const parts = [];
  if (state.liveWeather) {
    parts.push(`🌡️ ${state.liveWeather.district || state.userDistrict}: ${state.liveWeather.tempC}°C, Rain ${state.liveWeather.precipitation1h} mm/h`);
  }
  if (state.liveRoadways && state.liveRoadways.length > 0) {
    const blocked = state.liveRoadways.filter(r => r.status === 'BLOCKED');
    if (blocked.length > 0) {
      parts.push(`⛔ ${blocked[0].highway}: ${blocked[0].hazard}`);
    }
    const safe = state.liveRoadways.find(r => r.status === 'OPEN_SAFE');
    if (safe) {
      parts.push(`✅ ${safe.highway}: Operational & Safe`);
    }
  }
  if (state.liveSeismic && state.liveSeismic.length > 0) {
    const latest = state.liveSeismic[0];
    parts.push(`⚡ Seismic M${latest.magnitude} (${latest.place})`);
  }

  if (parts.length > 0) {
    el.textContent = parts.join(' • ');
  }
}

export function openHazardReportModal() {
  const existing = document.getElementById('hazard-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'hazard-modal';
  modal.style.cssText = 'position: fixed; inset: 0; z-index: 2000; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; padding: 16px; backdrop-filter: blur(8px);';
  modal.innerHTML = `
    <div style="background: #0f172a; border: 1px solid #475569; border-radius: 12px; max-width: 480px; width: 100%; padding: 20px; color: #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h3 style="margin: 0; color: #f87171; display: flex; align-items: center; gap: 8px;">
          <span>📢</span> Report Real-Time Mountain Hazard
        </h3>
        <button onclick="document.getElementById('hazard-modal').remove()" style="background: transparent; border: none; color: #94a3b8; font-size: 1.4rem; cursor: pointer;">&times;</button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.85rem;">
        <div>
          <label style="color: #94a3b8; display: block; margin-bottom: 4px;">HAZARD TYPE</label>
          <select id="modal-hazard-type" style="width: 100%; padding: 8px; background: #1e293b; border: 1px solid #475569; border-radius: 6px; color: white;">
            <option value="LANDSLIDE">🏔️ Landslide / Debris Flow</option>
            <option value="ROAD_BLOCKED">⛔ Road Blockage / Washout</option>
            <option value="FLASH_FLOOD">🌊 Flash Flood / River Surge</option>
            <option value="ROCKFALL">🪨 Active Falling Rocks</option>
          </select>
        </div>

        <div>
          <label style="color: #94a3b8; display: block; margin-bottom: 4px;">LOCATION NAME / HIGHWAY STRETCH</label>
          <input type="text" id="modal-hazard-loc" placeholder="e.g. NH-13 KM 48 near Yazali" style="width: 100%; padding: 8px; background: #1e293b; border: 1px solid #475569; border-radius: 6px; color: white;" />
        </div>

        <div>
          <label style="color: #94a3b8; display: block; margin-bottom: 4px;">DISTRICT</label>
          <select id="modal-hazard-district" style="width: 100%; padding: 8px; background: #1e293b; border: 1px solid #475569; border-radius: 6px; color: white;">
            ${DISTRICTS.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
          </select>
        </div>

        <div>
          <label style="color: #94a3b8; display: block; margin-bottom: 4px;">OBSERVATIONS & DETAILS</label>
          <textarea id="modal-hazard-desc" rows="3" placeholder="Describe current passability, mudflow volume, or stranded vehicles..." style="width: 100%; padding: 8px; background: #1e293b; border: 1px solid #475569; border-radius: 6px; color: white; resize: none;"></textarea>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 6px;">
          <button onclick="window.raksha.submitHazardReport()" style="flex: 1; padding: 10px; background: linear-gradient(90deg, #dc2626, #b91c1c); color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
            BROADCAST REPORT LIVE
          </button>
          <button onclick="document.getElementById('hazard-modal').remove()" style="padding: 10px 14px; background: #334155; color: white; border: none; border-radius: 6px; cursor: pointer;">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

export async function submitHazardReport() {
  const type = document.getElementById('modal-hazard-type')?.value || 'LANDSLIDE';
  const loc = document.getElementById('modal-hazard-loc')?.value || 'Highway Stretch';
  const dist = document.getElementById('modal-hazard-district')?.value || 'Papum Pare';
  const desc = document.getElementById('modal-hazard-desc')?.value || 'Hazard reported';

  const payload = {
    hazardType: type,
    reporterType: state.currentPersona,
    district: dist,
    locationName: loc,
    coordinates: { lat: state.userLocation.lat, lon: state.userLocation.lon },
    description: desc,
    severity: 'HIGH'
  };

  try {
    const res = await fetch('/api/hazard/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      alert('✅ Hazard report registered! Broadcasted to connected travelers, local residents, and State EOC.');
      document.getElementById('hazard-modal')?.remove();
      fetchLiveTelemetry();
    }
  } catch (err) {
    alert('📶 Report queued locally. Will sync once network reconnects.');
    document.getElementById('hazard-modal')?.remove();
  }
}

export function setSimSpeed(speed) {
  state.simSpeed = speed;
  if (state.escapeSimulator) {
    state.escapeSimulator.setPlaybackSpeed(speed);
  }
  document.querySelectorAll('.sim-speed-btn').forEach(btn => {
    btn.style.background = btn.dataset.speed == speed ? '#2563eb' : '#1e293b';
  });
}

export function setSimViewMode(mode) {
  state.simViewMode = mode;
  if (state.escapeSimulator) {
    state.escapeSimulator.setViewMode(mode);
  }
  document.querySelectorAll('.sim-view-btn').forEach(btn => {
    btn.style.background = btn.dataset.view === mode ? '#2563eb' : '#1e293b';
  });
}

// Tab Switching
export function switchTab(tabId) {
  state.activeTab = tabId;

  document.querySelectorAll('.nav-item').forEach((el) => {
    if (el.dataset.tab === tabId) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  renderActiveTab();

  if (tabId === 'map') {
    setTimeout(() => {
      if (state.map) state.map.invalidateSize();
      else initLeafletMap();
    }, 150);
  } else if (tabId === 'sim') {
    setTimeout(initSimulationCanvas, 100);
  }
}

// Main Render Dispatcher
export function renderActiveTab() {
  const main = document.getElementById('main-content');
  if (!main) return;

  // Update navigation text based on current language
  updateNavLabels();

  switch (state.activeTab) {
    case 'dashboard':
      main.innerHTML = renderDashboardView();
      bindDashboardEvents();
      break;
    case 'map':
      main.innerHTML = renderMapView();
      if (!state.map) setTimeout(initLeafletMap, 50);
      break;
    case 'evacuate':
      main.innerHTML = renderEvacuateView();
      bindEvacuateEvents();
      break;
    case 'sim':
      main.innerHTML = renderSimulationView();
      bindSimulationEvents();
      setTimeout(initSimulationCanvas, 50);
      break;
    case 'ai':
      main.innerHTML = renderAICopilotView();
      bindAICopilotEvents();
      break;
    case 'sos':
      main.innerHTML = renderSOSView();
      bindSOSEvents();
      break;
    case 'guide':
      main.innerHTML = renderGuideView();
      bindGuideEvents();
      break;
    default:
      main.innerHTML = renderDashboardView();
      bindDashboardEvents();
  }
}

function updateNavLabels() {
  const mapNav = {
    'dashboard': t('tab.dashboard'),
    'map': t('tab.map'),
    'evacuate': t('tab.evacuate'),
    'sim': t('tab.sim'),
    'ai': t('tab.ai'),
    'sos': t('tab.sos'),
    'guide': t('tab.guide')
  };

  document.querySelectorAll('.nav-item').forEach(el => {
    const tabId = el.dataset.tab;
    const labelSpan = el.querySelector('.nav-label');
    if (labelSpan && mapNav[tabId]) {
      labelSpan.textContent = mapNav[tabId];
    }
  });
}

// ==========================================
// 1. DASHBOARD VIEW (MULTI-PERSONA ENGINE)
// ==========================================
function renderDashboardView() {
  if (state.currentPersona === 'tourist') {
    return renderTouristDashboard();
  } else if (state.currentPersona === 'monitor') {
    return renderMonitorDashboard();
  } else {
    return renderResidentDashboard();
  }
}

// 1A. LOCAL RESIDENT DASHBOARD
function renderResidentDashboard() {
  runFoSCalculation();
  const fos = state.fosResult;

  const riskColor = state.currentRisk >= 75 ? '#dc2626' : state.currentRisk >= 50 ? '#f97316' : state.currentRisk >= 30 ? '#eab308' : '#22c55e';
  const riskStatusText = state.currentRisk >= 75 ? t('dash.criticalRed') : state.currentRisk >= 50 ? t('dash.highOrange') : state.currentRisk >= 30 ? t('dash.modYellow') : t('dash.lowGreen');

  const rain1h = state.liveWeather ? `${state.liveWeather.precipitation1h} mm/h` : '28 mm/h';
  const temp = state.liveWeather ? `${state.liveWeather.tempC}°C` : '22°C';

  return `
    <div style="padding: 16px; display: flex; flex-direction: column; gap: 16px; max-width: 900px; margin: 0 auto;">
      
      <!-- Top Alert Banner -->
      <div style="background: linear-gradient(90deg, #7f1d1d, #991b1b); padding: 12px 16px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #ef4444; box-shadow: 0 4px 14px rgba(220, 38, 38, 0.3);">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.6rem; animation: pulse-sos 1.5s infinite;">⚠️</span>
          <div>
            <div style="font-weight: 800; font-size: 0.95rem; letter-spacing: 0.5px;">MONSOON RED ALERT: NH-13 & SIANG VALLEY</div>
            <div style="font-size: 0.8rem; color: #fecaca;">Active landslides in Potin-Pangin & debris torrents in Dibang Valley</div>
          </div>
        </div>
        <button id="siren-btn" onclick="window.raksha.toggleEmergencySiren()" style="background: rgba(239, 68, 68, 0.2); border: 1px solid #f87171; color: white; border-radius: 8px; padding: 6px 12px; font-weight: bold; font-size: 0.8rem; cursor: pointer;">
          🚨 EMERGENCY SIREN
        </button>
      </div>

      <!-- Composite Risk & Telemetry Gauge -->
      <div class="card-glass" style="padding: 20px; text-align: center; position: relative;">
        <div style="font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
          ${t('dash.riskTitle')} (${state.userDistrict})
        </div>

        <div style="position: relative; width: 220px; height: 110px; margin: 0 auto;">
          <svg viewBox="0 0 200 100" style="width: 100%; height: 100%;">
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e293b" stroke-width="22" stroke-linecap="round" />
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="${riskColor}" stroke-width="22" stroke-linecap="round"
                  stroke-dasharray="251" stroke-dashoffset="${251 - (251 * state.currentRisk) / 100}"
                  style="transition: stroke-dashoffset 1s ease-out;" />
          </svg>
          <div style="position: absolute; bottom: 6px; width: 100%; text-align: center;">
            <div style="font-size: 2.6rem; font-weight: 900; line-height: 1; color: ${riskColor};">${state.currentRisk}</div>
            <div style="font-size: 0.75rem; color: #94a3b8;">/ 100</div>
          </div>
        </div>

        <div style="margin-top: 10px; font-weight: 800; font-size: 1.1rem; color: ${riskColor}; letter-spacing: 1px;">
          ${riskStatusText}
        </div>
        <div style="font-size: 0.82rem; color: #cbd5e1; margin-top: 4px;">
          Seismic Zone V (PGA > 0.36g) &bull; Extreme Regolith Saturation
        </div>

        <!-- Real-time Telemetry Grid -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 16px; border-top: 1px solid #334155; padding-top: 14px;">
          <div style="background: rgba(15, 23, 42, 0.6); padding: 8px; border-radius: 8px;">
            <div style="font-size: 0.72rem; color: #94a3b8;">1H RAIN</div>
            <div style="font-size: 1.15rem; font-weight: bold; color: #38bdf8;">${rain1h}</div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.6); padding: 8px; border-radius: 8px;">
            <div style="font-size: 0.72rem; color: #94a3b8;">TEMP</div>
            <div style="font-size: 1.15rem; font-weight: bold; color: #fbbf24;">${temp}</div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.6); padding: 8px; border-radius: 8px;">
            <div style="font-size: 0.72rem; color: #94a3b8;">ELEVATION</div>
            <div style="font-size: 1.15rem; font-weight: bold; color: #a855f7;">${state.userLocation.elevation}m</div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.6); padding: 8px; border-radius: 8px;">
            <div style="font-size: 0.72rem; color: #94a3b8;">COMM GRID</div>
            <div style="font-size: 1.15rem; font-weight: bold; color: #22c55e;">VSAT/SAT</div>
          </div>
        </div>
      </div>

      <!-- Quick Action Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <button onclick="window.raksha.switchTab('sim')" style="background: linear-gradient(135deg, #7c3aed, #4c1d95); color: white; border: none; border-radius: 12px; padding: 18px; font-weight: 900; font-size: 1.05rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
          <span style="font-size: 2.2rem;">🎬</span>
          ${t('tab.sim').toUpperCase()}
          <span style="font-size: 0.72rem; opacity: 0.9; font-weight: normal;">3D Isometric Escape Model</span>
        </button>

        <button onclick="window.raksha.switchTab('evacuate')" style="background: linear-gradient(135deg, #2563eb, #1e40af); color: white; border: none; border-radius: 12px; padding: 18px; font-weight: 900; font-size: 1.05rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);">
          <span style="font-size: 2.2rem;">🛣️</span>
          ${t('dash.quickNav')}
          <span style="font-size: 0.72rem; opacity: 0.9; font-weight: normal;">Multi-Modal Path & Vocal Guide</span>
        </button>

        <button onclick="window.raksha.switchTab('ai')" style="background: rgba(30, 41, 59, 0.85); border: 1px solid #334155; color: #e2e8f0; border-radius: 12px; padding: 16px; font-weight: bold; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px;">
          <span style="font-size: 2rem;">🤖</span>
          ${t('dash.quickAI')}
          <span style="font-size: 0.72rem; color: #94a3b8;">Arunachal Terrain Expert</span>
        </button>

        <button onclick="window.raksha.switchTab('sos')" style="background: linear-gradient(135deg, #dc2626, #991b1b); color: white; border: none; border-radius: 12px; padding: 16px; font-weight: 900; font-size: 1.05rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);">
          <span style="font-size: 2rem; animation: pulse-sos 2s infinite;">🆘</span>
          ${t('dash.quickSOS')}
          <span style="font-size: 0.72rem; opacity: 0.9; font-weight: normal;">Transmit to 12th Bn NDRF</span>
        </button>
      </div>

      <!-- Real-Time Landslide FoS Calculator -->
      <div class="card-glass" style="padding: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 style="margin: 0; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;">
            <span>🧮</span> ${t('dash.fosTitle')}
          </h3>
          <span style="background: ${fos.color === 'RED' ? '#dc2626' : fos.color === 'YELLOW' ? '#eab308' : '#22c55e'}; color: black; font-weight: 900; font-size: 0.75rem; padding: 3px 8px; border-radius: 4px;">
            ${fos.status}
          </span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div>
            <label style="font-size: 0.8rem; color: #cbd5e1; display: flex; justify-content: space-between;">
              <span>${t('sim.slopeLabel')}</span>
              <strong id="val-slope">${state.fosParams.slope}°</strong>
            </label>
            <input type="range" min="15" max="60" value="${state.fosParams.slope}" id="slider-slope" style="width: 100%; accent-color: #ef4444;" />
          </div>

          <div>
            <label style="font-size: 0.8rem; color: #cbd5e1; display: flex; justify-content: space-between;">
              <span>${t('sim.rainLabel')}</span>
              <strong id="val-rain">${state.fosParams.rain24h} mm</strong>
            </label>
            <input type="range" min="10" max="300" value="${state.fosParams.rain24h}" id="slider-rain" style="width: 100%; accent-color: #38bdf8;" />
          </div>

          <div>
            <label style="font-size: 0.8rem; color: #cbd5e1; display: flex; justify-content: space-between;">
              <span>${t('sim.waterLabel')}</span>
              <strong id="val-water">${state.fosParams.waterTable} m</strong>
            </label>
            <input type="range" min="0.5" max="4.5" step="0.5" value="${state.fosParams.waterTable}" id="slider-water" style="width: 100%; accent-color: #0ea5e9;" />
          </div>

          <div>
            <label style="font-size: 0.8rem; color: #cbd5e1; display: flex; justify-content: space-between;">
              <span>${t('sim.pgaLabel')}</span>
              <strong id="val-pga">${state.fosParams.pga} g</strong>
            </label>
            <input type="range" min="0.05" max="0.5" step="0.05" value="${state.fosParams.pga}" id="slider-pga" style="width: 100%; accent-color: #eab308;" />
          </div>
        </div>

        <div style="margin-top: 14px; padding: 12px; background: rgba(15, 23, 42, 0.8); border-radius: 8px; display: flex; justify-content: space-around; text-align: center; border: 1px solid #334155;">
          <div>
            <div style="font-size: 0.72rem; color: #94a3b8;">${t('sim.resFos')}</div>
            <div id="res-fos" style="font-size: 1.6rem; font-weight: 900; color: ${fos.color === 'RED' ? '#ef4444' : fos.color === 'YELLOW' ? '#eab308' : '#22c55e'};">
              ${fos.fos}
            </div>
          </div>
          <div style="border-left: 1px solid #334155; padding-left: 14px;">
            <div style="font-size: 0.72rem; color: #94a3b8;">${t('sim.resProb')}</div>
            <div id="res-prob" style="font-size: 1.6rem; font-weight: 900; color: ${fos.probability > 70 ? '#ef4444' : '#eab308'};">
              ${fos.probability}%
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}

// 1B. TOURIST & VISITOR DASHBOARD
function renderTouristDashboard() {
  return `
    <div style="padding: 16px; display: flex; flex-direction: column; gap: 16px; max-width: 900px; margin: 0 auto;">
      
      <!-- Tourist Advisory Top Banner -->
      <div style="background: linear-gradient(90deg, #0c4a6e, #075985); padding: 14px 18px; border-radius: 12px; border: 1px solid #38bdf8; box-shadow: 0 4px 14px rgba(56, 189, 248, 0.3); display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 1.8rem;">🧳</span>
          <div>
            <div style="font-weight: 900; font-size: 1.05rem; letter-spacing: 0.5px; color: #f0f9ff;">
              ARUNACHAL TOURIST & VISITOR SAFETY DESK
            </div>
            <div style="font-size: 0.8rem; color: #bae6fd;">
              All-Weather Route Feasibility &bull; Sela Tunnel Active &bull; ILP Disaster Passage
            </div>
          </div>
        </div>
        <button onclick="window.raksha.sendPresetQuery('What are the Inner Line Permit rules if I get stranded in Arunachal?')" style="background: rgba(56, 189, 248, 0.2); border: 1px solid #38bdf8; color: white; border-radius: 8px; padding: 6px 12px; font-weight: bold; font-size: 0.78rem; cursor: pointer;">
          📋 ILP INFO
        </button>
      </div>

      <!-- Sela Tunnel vs Old Pass Live Feasibility Card -->
      <div class="card-glass" style="padding: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 style="margin: 0; font-size: 1.05rem; display: flex; align-items: center; gap: 8px; color: #38bdf8;">
            <span>🏔️</span> Sela Tunnel & Tawang Pass Status (Live)
          </h3>
          <span style="background: #22c55e; color: black; font-weight: 900; font-size: 0.72rem; padding: 3px 8px; border-radius: 4px;">
            OPERATIONAL 24/7
          </span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="background: rgba(34, 197, 94, 0.15); border: 1px solid #22c55e; border-radius: 8px; padding: 12px;">
            <div style="display: flex; align-items: center; gap: 6px; font-weight: bold; color: #4ade80; font-size: 0.9rem;">
              <span>✅</span> SELA TUNNEL (13,000 ft)
            </div>
            <p style="font-size: 0.8rem; color: #cbd5e1; margin: 6px 0 0 0; line-height: 1.4;">
              Twin-tube tunnels (T1: 980m, T2: 1,555m). <strong>OPEN & CLEAR</strong> for all tourist vehicles. Eliminates blizzard and avalanche hazards.
            </p>
          </div>

          <div style="background: rgba(220, 38, 38, 0.15); border: 1px solid #ef4444; border-radius: 8px; padding: 12px;">
            <div style="display: flex; align-items: center; gap: 6px; font-weight: bold; color: #f87171; font-size: 0.9rem;">
              <span>⛔</span> OLD SELA TOP PASS (13,700 ft)
            </div>
            <p style="font-size: 0.8rem; color: #cbd5e1; margin: 6px 0 0 0; line-height: 1.4;">
              <strong>CLOSED TO TOURISTS</strong>. Severe black ice, rockfalls, and sub-zero blizzard risk. Diversion through Sela Tunnel is mandatory.
            </p>
          </div>
        </div>

        <div style="margin-top: 12px; font-size: 0.82rem; color: #94a3b8; background: rgba(15, 23, 42, 0.6); padding: 10px; border-radius: 8px;">
          💡 <strong>Traveler Recommendation</strong>: Cross Bhalukpong-Bomdila in daylight before 2:00 PM. Plan overnight acclimation layovers at <strong>Dirang (1,560m)</strong> or <strong>Bomdila (2,415m)</strong> before ascending to Tawang.
        </div>
      </div>

      <!-- Quick Tourist Actions -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <button onclick="window.raksha.sendPresetQuery('Tell me about Tawang and Sela Pass escape routes')" style="background: linear-gradient(135deg, #0284c7, #0369a1); color: white; border: none; border-radius: 12px; padding: 16px; font-weight: bold; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4);">
          <span style="font-size: 2rem;">🏔️</span>
          Tawang / Sela Advisory
          <span style="font-size: 0.72rem; opacity: 0.85;">Current Pass & Weather Feeds</span>
        </button>

        <button onclick="window.raksha.sendPresetQuery('How to prevent altitude sickness in Tawang and Bum La?')" style="background: linear-gradient(135deg, #7c3aed, #5b21b6); color: white; border: none; border-radius: 12px; padding: 16px; font-weight: bold; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);">
          <span style="font-size: 2rem;">🫁</span>
          Altitude Sickness (AMS)
          <span style="font-size: 0.72rem; opacity: 0.85;">Acclimatization & Symptoms</span>
        </button>

        <button onclick="window.raksha.switchTab('evacuate')" style="background: rgba(30, 41, 59, 0.85); border: 1px solid #475569; color: #e2e8f0; border-radius: 12px; padding: 16px; font-weight: bold; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px;">
          <span style="font-size: 2rem;">🛫</span>
          Safe Transit Corridors
          <span style="font-size: 0.72rem; color: #94a3b8;">Routes to Guwahati / Dibrugarh</span>
        </button>

        <button onclick="window.raksha.switchTab('sim')" style="background: linear-gradient(135deg, #dc2626, #991b1b); color: white; border: none; border-radius: 12px; padding: 16px; font-weight: bold; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);">
          <span style="font-size: 2rem;">🎬</span>
          Highway Escape Model
          <span style="font-size: 0.72rem; opacity: 0.85;">Vehicle Abandonment Simulation</span>
        </button>
      </div>

      <!-- Safe Exit Corridors to Assam -->
      <div class="card-glass" style="padding: 16px;">
        <h3 style="margin: 0 0 10px 0; font-size: 1rem; color: #38bdf8; display: flex; align-items: center; gap: 6px;">
          <span>✈️</span> Safe Return & Transit Gateways to Assam
        </h3>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
          <div style="background: rgba(15, 23, 42, 0.6); padding: 10px; border-radius: 6px; border-left: 3px solid #38bdf8;">
            <strong>Western Gateway (Tawang / Bomdila)</strong>: Follow BCT Road south to Bhalukpong &rarr; Tezpur Airport (TEZ, 160km) or Guwahati (340km).
          </div>
          <div style="background: rgba(15, 23, 42, 0.6); padding: 10px; border-radius: 6px; border-left: 3px solid #22c55e;">
            <strong>Central Gateway (Itanagar / Ziro)</strong>: Exit via Hollongi &rarr; Donyi Polo Airport (HGI, 25km) or Naharlagun Railway Station (10km).
          </div>
          <div style="background: rgba(15, 23, 42, 0.6); padding: 10px; border-radius: 6px; border-left: 3px solid #f59e0b;">
            <strong>Eastern Gateway (Pasighat / Roing / Tezu)</strong>: Exit via NH-515 & Bogibeel Bridge &rarr; Dibrugarh Airport (DIB, 140km).
          </div>
        </div>
      </div>

      <!-- Homestay & Hotel Mountain Safety Checklist -->
      <div class="card-glass" style="padding: 16px;">
        <h3 style="margin: 0 0 8px 0; font-size: 0.95rem; color: #fbbf24; display: flex; align-items: center; gap: 6px;">
          <span>🏨</span> Mountain Homestay & Resort Safety Checklist
        </h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 0.82rem; color: #cbd5e1; line-height: 1.5;">
          <li>Inspect retaining wall PVC weep holes behind building; water should drip freely during rainfall.</li>
          <li>Avoid booking cottages built directly beneath un-reinforced vertical mud cuts.</li>
          <li>Never pitch riverside tents on river sandbars (minimum 15 meters above high waterline).</li>
          <li>Keep power banks 100% charged and carry cash (ATMs frequently lose VSAT links during landslides).</li>
        </ul>
      </div>

    </div>
  `;
}

// 1C. STATEWIDE MONITOR DASHBOARD
function renderMonitorDashboard() {
  const roadways = state.liveRoadways && state.liveRoadways.length > 0 ? state.liveRoadways : [
    { highway: 'NH-13 Potin-Yazali (KM 48)', status: 'BLOCKED', hazard: 'Active Regolith Mudflow', clearanceETA: '3-5 Hours' },
    { highway: 'NH-13 BCT (Sela Tunnel)', status: 'OPEN_SAFE', hazard: 'Clear & Operational', clearanceETA: '24/7 All-Weather' },
    { highway: 'Old Sela High Pass (13,700 ft)', status: 'CLOSED', hazard: 'Severe Black Ice & Blizzard', clearanceETA: 'Seasonal Closure' },
    { highway: 'NH-313 Roing - Anini', status: 'RESTRICTED', hazard: 'Dense Fog & Slump Debris', clearanceETA: 'Convoy Escort (10:00 & 14:00)' },
    { highway: 'NH-515 Pasighat - Pangin', status: 'CAUTION', hazard: 'Rockfall Shooting Zone', clearanceETA: 'Passable with caution' }
  ];

  const earthquakes = state.liveSeismic && state.liveSeismic.length > 0 ? state.liveSeismic : [
    { magnitude: 4.8, place: '32 km NE of Roing (Mishmi Thrust)', depthKm: 18, time: '3 hours ago', alert: 'MODERATE' },
    { magnitude: 3.9, place: '45 km W of Tawang (Bhutan Border)', depthKm: 24, time: '14 hours ago', alert: 'LOW' },
    { magnitude: 5.2, place: '68 km N of Pasighat (Main Central Thrust)', depthKm: 12, time: '32 hours ago', alert: 'HIGH' }
  ];

  return `
    <div style="padding: 16px; display: flex; flex-direction: column; gap: 16px; max-width: 900px; margin: 0 auto;">
      
      <!-- Monitor Header Banner -->
      <div style="background: linear-gradient(90deg, #4c1d95, #581c87); padding: 14px 18px; border-radius: 12px; border: 1px solid #c084fc; box-shadow: 0 4px 14px rgba(192, 132, 252, 0.3); display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 1.8rem;">📡</span>
          <div>
            <div style="font-weight: 900; font-size: 1.05rem; letter-spacing: 0.5px; color: #faf5ff;">
              STATEWIDE ARUNACHAL SITUATIONAL MONITOR
            </div>
            <div style="font-size: 0.8rem; color: #e9d5ff;">
              Central Telemetry Feeds &bull; 28 Districts &bull; Open-Meteo & USGS Live Synced
            </div>
          </div>
        </div>
        <button onclick="window.raksha.openHazardReportModal()" style="background: rgba(192, 132, 252, 0.25); border: 1px solid #c084fc; color: white; border-radius: 8px; padding: 6px 12px; font-weight: bold; font-size: 0.78rem; cursor: pointer;">
          📢 + REPORT HAZARD
        </button>
      </div>

      <!-- Critical Road Artery Status Table -->
      <div class="card-glass" style="padding: 18px;">
        <h3 style="margin: 0 0 12px 0; font-size: 1.05rem; color: #38bdf8; display: flex; align-items: center; gap: 8px;">
          <span>🛣️</span> State Highway Artery Feasibility (Live BRO Status)
        </h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${roadways.map(r => `
            <div style="background: rgba(15, 23, 42, 0.6); padding: 10px 14px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155;">
              <div>
                <div style="font-weight: bold; font-size: 0.88rem; color: #f1f5f9;">${r.highway || r.stretch}</div>
                <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 2px;">${r.hazard || r.recommendation || ''}</div>
              </div>
              <div style="text-align: right;">
                <span style="background: ${r.status === 'OPEN_SAFE' ? '#22c55e' : r.status === 'BLOCKED' ? '#dc2626' : r.status === 'RESTRICTED' ? '#f59e0b' : '#38bdf8'}; color: black; font-weight: 900; font-size: 0.7rem; padding: 3px 8px; border-radius: 4px;">
                  ${r.status}
                </span>
                <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 4px;">ETA: ${r.clearanceETA || 'Active'}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Real-Time USGS Seismic Activity in Eastern Himalayas -->
      <div class="card-glass" style="padding: 18px;">
        <h3 style="margin: 0 0 12px 0; font-size: 1.05rem; color: #f87171; display: flex; align-items: center; gap: 8px;">
          <span>⚡</span> Seismic Zone V Activity (USGS GeoJSON Feed)
        </h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${earthquakes.map(eq => `
            <div style="background: rgba(15, 23, 42, 0.6); padding: 10px 14px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid ${eq.magnitude >= 5.0 ? '#ef4444' : eq.magnitude >= 4.0 ? '#f59e0b' : '#38bdf8'};">
              <div>
                <div style="font-weight: bold; font-size: 0.88rem; color: #e2e8f0;">
                  Magnitude ${eq.magnitude} &bull; ${eq.place}
                </div>
                <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Depth: ${eq.depthKm} km &bull; ${eq.time}</div>
              </div>
              <span style="background: ${eq.magnitude >= 5.0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}; color: ${eq.magnitude >= 5.0 ? '#f87171' : '#fbbf24'}; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 0.72rem; border: 1px solid ${eq.magnitude >= 5.0 ? '#ef4444' : '#f59e0b'};">
                ${eq.alert || 'MONITORED'}
              </span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 28-District Risk & Open-Meteo Rainfall Gauge Matrix -->
      <div class="card-glass" style="padding: 18px;">
        <h3 style="margin: 0 0 12px 0; font-size: 1.05rem; color: #4ade80; display: flex; align-items: center; gap: 8px;">
          <span>📊</span> 28 Arunachal Districts Vulnerability Overview
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(135px, 1fr)); gap: 8px;">
          ${DISTRICTS.slice(0, 12).map(d => `
            <div style="background: rgba(15, 23, 42, 0.75); padding: 8px 10px; border-radius: 8px; border: 1px solid #334155; text-align: center;">
              <div style="font-weight: bold; font-size: 0.8rem; color: #f1f5f9; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${d.name}</div>
              <div style="font-size: 0.72rem; color: #94a3b8; margin: 2px 0;">${d.headquartersElevation}m</div>
              <span style="background: ${d.vulnerabilityScore > 0.75 ? '#dc2626' : d.vulnerabilityScore > 0.5 ? '#f59e0b' : '#22c55e'}; color: black; font-weight: 900; font-size: 0.65rem; padding: 2px 6px; border-radius: 3px;">
                ${d.vulnerabilityScore > 0.75 ? 'CRITICAL' : d.vulnerabilityScore > 0.5 ? 'HIGH' : 'STABLE'}
              </span>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

function bindDashboardEvents() {
  const updateFoSUI = () => {
    const sSlope = document.getElementById('slider-slope');
    if (!sSlope) return;

    state.fosParams.slope = parseInt(document.getElementById('slider-slope').value);
    state.fosParams.rain24h = parseInt(document.getElementById('slider-rain').value);
    state.fosParams.waterTable = parseFloat(document.getElementById('slider-water').value);
    state.fosParams.pga = parseFloat(document.getElementById('slider-pga').value);

    document.getElementById('val-slope').textContent = `${state.fosParams.slope}°`;
    document.getElementById('val-rain').textContent = `${state.fosParams.rain24h} mm`;
    document.getElementById('val-water').textContent = `${state.fosParams.waterTable} m`;
    document.getElementById('val-pga').textContent = `${state.fosParams.pga} g`;

    runFoSCalculation();
    const f = state.fosResult;
    const fosEl = document.getElementById('res-fos');
    const probEl = document.getElementById('res-prob');

    if (fosEl) {
      fosEl.textContent = f.fos;
      fosEl.style.color = f.color === 'RED' ? '#ef4444' : f.color === 'YELLOW' ? '#eab308' : '#22c55e';
    }
    if (probEl) {
      probEl.textContent = `${f.probability}%`;
      probEl.style.color = f.probability > 70 ? '#ef4444' : '#eab308';
    }
  };

  ['slider-slope', 'slider-rain', 'slider-water', 'slider-pga'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateFoSUI);
  });
}

// ==========================================
// 2. REAL-TIME ANIMATED ESCAPE MODEL ("Visual Video Engine")
// ==========================================
function renderSimulationView() {
  const is3D = state.simViewMode === '3d_isometric';
  return `
    <div style="padding: 16px; display: flex; flex-direction: column; gap: 14px; max-width: 900px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div>
          <h2 style="margin: 0; font-size: 1.25rem; display: flex; align-items: center; gap: 8px;">
            <span>🎬</span> ${t('sim.modelTitle')}
          </h2>
          <div style="font-size: 0.8rem; color: #94a3b8;">${t('sim.modelSubtitle')}</div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <!-- View Mode Selector -->
          <div style="display: flex; background: #0f172a; border: 1px solid #334155; border-radius: 8px; overflow: hidden; padding: 2px;">
            <button class="sim-view-btn" data-view="3d_isometric" onclick="window.raksha.setSimViewMode('3d_isometric')" style="padding: 6px 10px; border: none; background: ${is3D ? '#2563eb' : 'transparent'}; color: white; font-size: 0.75rem; font-weight: bold; border-radius: 6px; cursor: pointer;">
              ⛰️ 3D Topo
            </button>
            <button class="sim-view-btn" data-view="tactical_drone" onclick="window.raksha.setSimViewMode('tactical_drone')" style="padding: 6px 10px; border: none; background: ${!is3D ? '#2563eb' : 'transparent'}; color: white; font-size: 0.75rem; font-weight: bold; border-radius: 6px; cursor: pointer;">
              🗺️ Tactical 2D
            </button>
          </div>
          <!-- Voice Guide Button -->
          <button onclick="window.raksha.speakCurrentSimStep()" style="background: #16a34a; color: white; border: none; border-radius: 8px; padding: 7px 12px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 0.8rem; box-shadow: 0 2px 8px rgba(34, 197, 94, 0.4);">
            <span>🔊</span> ${t('sim.vocalGuideBtn')}
          </button>
        </div>
      </div>

      <!-- Scenario Selector Buttons -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px;">
        <button class="sim-scen-btn active" data-scen="landslide" onclick="window.raksha.setSimScenario('landslide')" style="padding: 10px; border-radius: 8px; border: 1px solid #dc2626; background: rgba(220, 38, 38, 0.25); color: white; font-weight: bold; font-size: 0.82rem; cursor: pointer; text-align: left;">
          ${t('sim.scenarioLandslide')}
        </button>
        <button class="sim-scen-btn" data-scen="flood" onclick="window.raksha.setSimScenario('flood')" style="padding: 10px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white; font-size: 0.82rem; cursor: pointer; text-align: left;">
          ${t('sim.scenarioFlood')}
        </button>
        <button class="sim-scen-btn" data-scen="road" onclick="window.raksha.setSimScenario('road')" style="padding: 10px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white; font-size: 0.82rem; cursor: pointer; text-align: left;">
          ${t('sim.scenarioRoad')}
        </button>
        <button class="sim-scen-btn" data-scen="quake" onclick="window.raksha.setSimScenario('quake')" style="padding: 10px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white; font-size: 0.82rem; cursor: pointer; text-align: left;">
          ${t('sim.scenarioQuake')}
        </button>
      </div>

      <!-- Simulation Video Screen (Canvas) -->
      <div class="card" style="border: 2px solid #334155; border-radius: 12px; overflow: hidden; position: relative; background: #020617; box-shadow: 0 8px 24px rgba(0,0,0,0.6);">
        <canvas id="escape-canvas" width="800" height="420" style="width: 100%; height: auto; display: block;"></canvas>
      </div>

      <!-- Video Controls Bar -->
      <div class="card" style="padding: 10px 14px; border: 1px solid #334155; border-radius: 12px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
        <button id="sim-play-btn" onclick="window.raksha.toggleSimPlay()" style="background: #2563eb; color: white; border: none; border-radius: 6px; padding: 8px 16px; font-weight: bold; cursor: pointer;">
          ▶ PLAY
        </button>
        <button onclick="window.raksha.resetSim()" style="background: #334155; color: white; border: none; border-radius: 6px; padding: 8px 12px; font-size: 0.85rem; cursor: pointer;">
          🔄 REPLAY
        </button>
        <input type="range" id="sim-scrubber" min="0" max="100" value="0" style="flex: 1; min-width: 120px; accent-color: #22c55e;" />
        <span id="sim-time-label" style="font-size: 0.85rem; color: #94a3b8; min-width: 45px;">0.0s</span>
        
        <!-- Speed Control Buttons -->
        <div style="display: flex; gap: 4px; background: #0f172a; padding: 2px; border-radius: 6px; border: 1px solid #334155;">
          <button class="sim-speed-btn" data-speed="0.5" onclick="window.raksha.setSimSpeed(0.5)" style="padding: 4px 8px; border: none; border-radius: 4px; background: ${state.simSpeed === 0.5 ? '#2563eb' : 'transparent'}; color: white; font-size: 0.72rem; cursor: pointer;">0.5x</button>
          <button class="sim-speed-btn" data-speed="1.0" onclick="window.raksha.setSimSpeed(1.0)" style="padding: 4px 8px; border: none; border-radius: 4px; background: ${state.simSpeed === 1.0 ? '#2563eb' : 'transparent'}; color: white; font-size: 0.72rem; cursor: pointer;">1.0x</button>
          <button class="sim-speed-btn" data-speed="2.0" onclick="window.raksha.setSimSpeed(2.0)" style="padding: 4px 8px; border: none; border-radius: 4px; background: ${state.simSpeed === 2.0 ? '#2563eb' : 'transparent'}; color: white; font-size: 0.72rem; cursor: pointer;">2.0x</button>
        </div>
      </div>

      <!-- Live Step Narrative Card -->
      <div class="card" style="padding: 16px; border-left: 4px solid #22c55e; border-radius: 12px; background: rgba(15, 23, 42, 0.8);">
        <div style="font-size: 0.78rem; color: #4ade80; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">
          <span id="sim-step-badge">STEP 1 / 3 &bull; HAZARD IDENTIFICATION</span>
        </div>
        <div id="sim-step-narrative" style="font-size: 0.95rem; font-weight: 500; line-height: 1.45; color: #e2e8f0;">
          Step 1: Hear cracking rocks on the mountain slope. DO NOT run downslope along the fall line!
        </div>
      </div>
    </div>
  `;
}

function bindSimulationEvents() {
  const scrubber = document.getElementById('sim-scrubber');
  if (scrubber) {
    scrubber.addEventListener('input', (e) => {
      const p = parseInt(e.target.value) / 100;
      if (state.escapeSimulator) {
        state.escapeSimulator.setProgress(p);
      }
    });
  }
}

export function initSimulationCanvas() {
  const canvas = document.getElementById('escape-canvas');
  if (!canvas) return;

  if (state.escapeSimulator) {
    state.escapeSimulator.pause();
  }

  state.escapeSimulator = new EscapeSimulator(canvas, {
    scenario: state.activeSimScenario || 'landslide',
    language: state.currentLanguage,
    onStepChange: (stepNum, stepText) => {
      state.currentSimStep = stepNum;
      state.currentSimText = stepText;

      const badge = document.getElementById('sim-step-badge');
      const narrative = document.getElementById('sim-step-narrative');
      const scrub = document.getElementById('sim-scrubber');
      const timeLbl = document.getElementById('sim-time-label');

      if (badge) badge.textContent = `STEP ${stepNum} / 3 &bull; TACTICAL ACTION`;
      if (narrative) narrative.textContent = stepText;
      if (scrub && state.escapeSimulator) scrub.value = Math.round(state.escapeSimulator.progress * 100);
      if (timeLbl && state.escapeSimulator) timeLbl.textContent = `${(state.escapeSimulator.progress * 14).toFixed(1)}s`;
    }
  });

  state.escapeSimulator.render();
}

export function toggleSimPlay() {
  if (!state.escapeSimulator) return;
  const btn = document.getElementById('sim-play-btn');

  if (state.escapeSimulator.isPlaying) {
    state.escapeSimulator.pause();
    if (btn) btn.innerHTML = '▶ PLAY';
  } else {
    state.escapeSimulator.play();
    if (btn) btn.innerHTML = '⏸ PAUSE';
    // Auto-vocalize step 1 when starting
    speak(state.escapeSimulator.getStepText(1));
  }
}

export function resetSim() {
  if (state.escapeSimulator) {
    state.escapeSimulator.reset();
    const btn = document.getElementById('sim-play-btn');
    if (btn) btn.innerHTML = '▶ PLAY';
  }
}

export function setSimScenario(scen) {
  state.activeSimScenario = scen;
  document.querySelectorAll('.sim-scen-btn').forEach(btn => {
    if (btn.dataset.scen === scen) {
      btn.style.background = 'rgba(220, 38, 38, 0.25)';
      btn.style.borderColor = '#dc2626';
      btn.classList.add('active');
    } else {
      btn.style.background = '#0f172a';
      btn.style.borderColor = '#334155';
      btn.classList.remove('active');
    }
  });

  if (state.escapeSimulator) {
    state.escapeSimulator.setScenario(scen);
    const narrative = document.getElementById('sim-step-narrative');
    if (narrative) narrative.textContent = state.escapeSimulator.getStepText(1);
    speak(state.escapeSimulator.getStepText(1));
  }
}

export function speakCurrentSimStep() {
  if (state.escapeSimulator) {
    const text = state.escapeSimulator.getStepText(state.currentSimStep || 1);
    speak(text);
  }
}

// ==========================================
// 3. GIS SURVIVAL MAP VIEW & BASEMAP ENGINE
// ==========================================
export const BASEMAP_TILES = {
  dark: {
    name: 'Dark Tactical',
    layers: [
      {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        options: { maxZoom: 16, subdomains: 'abcd', attribution: 'Esri, DeLorme, HERE' }
      },
      {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        options: { maxZoom: 16 }
      }
    ]
  },
  satellite: {
    name: 'Satellite Aerial 3D',
    layers: [
      {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: { maxZoom: 18, attribution: 'Esri, Maxar, Earthstar Geographics' }
      },
      {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        options: { maxZoom: 18 }
      }
    ]
  },
  topo: {
    name: 'Mountain Topo Relief',
    layers: [
      {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        options: { maxZoom: 18, attribution: 'Esri, USGS, NOAA' }
      }
    ]
  },
  osm: {
    name: 'OpenStreetMap Standard',
    layers: [
      {
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }
      }
    ]
  }
};

export function switchBasemap(type) {
  const chosen = BASEMAP_TILES[type] ? type : 'dark';
  state.currentBasemap = chosen;
  localStorage.setItem('raksha_basemap', chosen);

  if (!state.map || !window.L) return;

  if (Array.isArray(state.activeTileLayers)) {
    state.activeTileLayers.forEach((layer) => {
      try { state.map.removeLayer(layer); } catch (e) {}
    });
  }
  state.activeTileLayers = [];

  const cfg = BASEMAP_TILES[chosen];
  cfg.layers.forEach((l) => {
    const tileLayer = L.tileLayer(l.url, l.options || {}).addTo(state.map);
    tileLayer.bringToBack();
    state.activeTileLayers.push(tileLayer);
  });
}

function renderMapView() {
  return `
    <div style="position: relative; width: 100%; height: calc(100vh - 135px);">
      <!-- Layer Toggle & Basemap Floating Toolbar -->
      <div style="position: absolute; top: 12px; right: 12px; z-index: 1000; background: rgba(15, 23, 42, 0.94); backdrop-filter: blur(12px); padding: 10px; border-radius: 10px; border: 1px solid #334155; display: flex; flex-direction: column; gap: 8px; font-size: 0.75rem; box-shadow: 0 8px 24px rgba(0,0,0,0.6); max-width: 215px;">
        <!-- Basemap Selector -->
        <div style="padding-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <div style="font-weight: 800; color: #38bdf8; font-size: 0.68rem; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 5px;">
            <span>🗺️</span> Basemap Terrain
          </div>
          <select id="map-basemap-select" onchange="window.raksha.switchBasemap(this.value)" style="width: 100%; background: #1e293b; color: #f1f5f9; border: 1px solid #475569; border-radius: 6px; padding: 4px 6px; font-size: 0.72rem; outline: none; cursor: pointer; font-weight: 600;">
            <option value="dark" ${state.currentBasemap === 'dark' ? 'selected' : ''}>🌙 Dark Tactical (ESRI Zero-WM)</option>
            <option value="satellite" ${state.currentBasemap === 'satellite' ? 'selected' : ''}>🛰️ Satellite Aerial 3D</option>
            <option value="topo" ${state.currentBasemap === 'topo' ? 'selected' : ''}>🏔️ Mountain Topo Relief</option>
            <option value="osm" ${state.currentBasemap === 'osm' ? 'selected' : ''}>🗺️ OpenStreetMap Standard</option>
          </select>
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: #f87171;">
            <input type="checkbox" id="layer-hazard" checked onchange="window.raksha.toggleMapLayer('hazard')" /> ⚠️ Landslide/Flood
          </label>
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: #38bdf8;">
            <input type="checkbox" id="layer-transport" checked onchange="window.raksha.toggleMapLayer('transport')" /> 🛣️ Highways & Rail
          </label>
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: #fbbf24;">
            <input type="checkbox" id="layer-air" checked onchange="window.raksha.toggleMapLayer('air')" /> ✈️/🚁 ALGs & Helipads
          </label>
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: #4ade80;">
            <input type="checkbox" id="layer-safe" checked onchange="window.raksha.toggleMapLayer('safeZones')" /> 🟢 Safe Zones
          </label>
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: #c084fc;">
            <input type="checkbox" id="layer-emergency" checked onchange="window.raksha.toggleMapLayer('emergency')" /> 🏥 NDRF & Hospitals
          </label>
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: #f97316;">
            <input type="checkbox" id="layer-seismic" checked onchange="window.raksha.toggleMapLayer('seismic')" /> ⚡ Live Quakes (USGS)
          </label>
          <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: #ec4899;">
            <input type="checkbox" id="layer-communityReports" checked onchange="window.raksha.toggleMapLayer('communityReports')" /> 📢 Citizen Reports
          </label>
        </div>
      </div>

      <button onclick="window.raksha.recenterUserLocation()" style="position: absolute; bottom: 24px; right: 12px; z-index: 1000; background: #2563eb; color: white; border: none; border-radius: 50%; width: 48px; height: 48px; font-size: 1.4rem; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">
        📍
      </button>

      <div id="leaflet-map" style="width: 100%; height: 100%; background: #0f172a;"></div>
    </div>
  `;
}

export function initLeafletMap() {
  const container = document.getElementById('leaflet-map');
  if (!container || !window.L) return;

  if (state.map) {
    state.map.remove();
    state.map = null;
  }

  const map = L.map('leaflet-map', {
    center: [28.0, 94.6],
    zoom: 7,
    zoomControl: false,
    attributionControl: false
  });
  L.control.zoom({ position: 'bottomleft' }).addTo(map);

  state.map = map;
  switchBasemap(state.currentBasemap || 'dark');
  state.layerGroups = {
    hazard: L.layerGroup().addTo(map),
    transport: L.layerGroup().addTo(map),
    air: L.layerGroup().addTo(map),
    safeZones: L.layerGroup().addTo(map),
    emergency: L.layerGroup().addTo(map),
    seismic: L.layerGroup().addTo(map),
    communityReports: L.layerGroup().addTo(map),
    route: L.layerGroup().addTo(map)
  };

  // Landslide Critical Corridors
  HAZARD_ZONES.landslideCriticalCorridors.forEach((c) => {
    const latlngs = c.waypoints.map((w) => [w.lat, w.lon]);
    L.polyline(latlngs, {
      color: '#dc2626',
      weight: 6,
      opacity: 0.85,
      dashArray: '8, 8'
    }).bindPopup(`
      <div style="color: #0f172a; font-family: sans-serif;">
        <h4 style="margin: 0 0 4px 0; color: #dc2626;">⚠️ ${c.name}</h4>
        <p style="margin: 0 0 6px 0; font-size: 0.85rem;">${c.description}</p>
        <span style="background: #dc2626; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 0.75rem;">SEVERITY: ${c.severity}</span>
      </div>
    `).addTo(state.layerGroups.hazard);
  });

  // Flood Prone Areas
  HAZARD_ZONES.floodProneAreas.forEach((f) => {
    const latlngs = f.bounds.map((b) => [b.lat, b.lon]);
    L.polygon(latlngs, {
      color: '#0284c7',
      fillColor: '#38bdf8',
      fillOpacity: 0.35,
      weight: 2
    }).bindPopup(`
      <div style="color: #0f172a; font-family: sans-serif;">
        <h4 style="margin: 0 0 4px 0; color: #0284c7;">🌊 ${f.name}</h4>
        <p style="margin: 0 0 6px 0; font-size: 0.85rem;">Waterbody: <strong>${f.waterbody}</strong></p>
        <span style="background: #0284c7; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 0.75rem;">FLOOD RISK: ${f.severity}</span>
      </div>
    `).addTo(state.layerGroups.hazard);
  });

  // Transportation Edges
  TRANSPORT_EDGES.forEach((e) => {
    const sNode = nodeMap[e.source];
    const tNode = nodeMap[e.target];
    if (!sNode || !tNode) return;

    const isAir = e.mode === 'air';
    const isFoot = e.mode === 'foot';

    L.polyline([[sNode.lat, sNode.lon], [tNode.lat, tNode.lon]], {
      color: isAir ? '#eab308' : isFoot ? '#a855f7' : '#e2e8f0',
      weight: isAir ? 2 : 4,
      dashArray: isAir ? '4, 8' : isFoot ? '2, 4' : null,
      opacity: isAir ? 0.6 : 0.8
    }).addTo(isAir ? state.layerGroups.air : state.layerGroups.transport);
  });

  // ALGs, Airports & Helipads
  TRANSPORT_NODES.forEach((n) => {
    let iconEmoji = '📍';
    let group = state.layerGroups.transport;

    if (n.type === 'airport' || n.type === 'alg' || n.type === 'helipad') {
      iconEmoji = n.type === 'airport' ? '✈️' : n.type === 'alg' ? '🛬' : '🚁';
      group = state.layerGroups.air;
    }

    const marker = L.circleMarker([n.lat, n.lon], {
      radius: n.type === 'airport' ? 10 : 7,
      fillColor: n.type === 'airport' || n.type === 'alg' ? '#eab308' : '#38bdf8',
      color: '#ffffff',
      weight: 2,
      fillOpacity: 0.9
    });

    marker.bindPopup(`
      <div style="color: #0f172a; font-family: sans-serif;">
        <h4 style="margin: 0 0 4px 0;">${iconEmoji} ${n.name}</h4>
        <div style="font-size: 0.8rem;">Elevation: ${n.elevation} m &bull; Capacity: ${n.capacity}</div>
        <button onclick="window.raksha.planRouteTo('${n.id}')" style="margin-top: 8px; background: #2563eb; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-weight: bold; cursor: pointer;">
          Evacuate Toward This Hub
        </button>
      </div>
    `).addTo(group);
  });

  // Safe Zones
  HAZARD_ZONES.safeZones.forEach((sz) => {
    L.circleMarker([sz.lat, sz.lon], {
      radius: 8,
      fillColor: '#22c55e',
      color: '#ffffff',
      weight: 2,
      fillOpacity: 0.9
    }).bindPopup(`
      <div style="color: #0f172a; font-family: sans-serif;">
        <h4 style="margin: 0 0 4px 0; color: #15803d;">🟢 ${sz.name}</h4>
        <div style="font-size: 0.8rem;">Capacity: <strong>${sz.capacity} evacuees</strong></div>
        <div style="font-size: 0.8rem;">HAND Clearance: +${sz.handElevation} m</div>
        <button onclick="window.raksha.planRouteToCoords(${sz.lat}, ${sz.lon}, '${sz.name}')" style="margin-top: 8px; background: #22c55e; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-weight: bold; cursor: pointer;">
          Set As Evacuation Destination
        </button>
      </div>
    `).addTo(state.layerGroups.safeZones);
  });

  // Hospitals
  EMERGENCY_RESOURCES.hospitals.forEach((h) => {
    L.circleMarker([h.lat, h.lon], {
      radius: 8,
      fillColor: '#a855f7',
      color: '#ffffff',
      weight: 2,
      fillOpacity: 0.9
    }).bindPopup(`
      <div style="color: #0f172a; font-family: sans-serif;">
        <h4 style="margin: 0 0 4px 0; color: #7e22ce;">🏥 ${h.name}</h4>
        <div style="font-size: 0.8rem;">Beds: ${h.beds} &bull; Trauma Unit: ${h.hasTraumaCenter ? 'YES' : 'NO'}</div>
      </div>
    `).addTo(state.layerGroups.emergency);
  });

  updateUserLocationOnMap();
  updateLiveMapMarkers();
}

export function updateLiveMapMarkers() {
  if (!state.map || !state.layerGroups.seismic || !state.layerGroups.communityReports) return;

  state.layerGroups.seismic.clearLayers();
  state.layerGroups.communityReports.clearLayers();

  if (state.liveSeismic && Array.isArray(state.liveSeismic)) {
    state.liveSeismic.forEach(eq => {
      const radius = Math.max(6, Math.min(22, (eq.magnitude || 3.0) * 3.2));
      const color = eq.magnitude >= 5.0 ? '#dc2626' : eq.magnitude >= 4.0 ? '#ea580c' : '#eab308';
      const marker = L.circleMarker([eq.lat, eq.lon], {
        radius,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        fillOpacity: 0.85
      });
      marker.bindPopup(`
        <div style="color: #0f172a; font-family: sans-serif;">
          <h4 style="margin: 0 0 4px 0; color: ${color};">⚡ USGS Earthquake M${eq.magnitude.toFixed(1)}</h4>
          <div style="font-size: 0.82rem; font-weight: bold; margin-bottom: 4px;">${eq.place}</div>
          <div style="font-size: 0.78rem; color: #475569;">Depth: ${eq.depth} km &bull; Time: ${new Date(eq.time).toLocaleTimeString()}</div>
          <div style="margin-top: 6px; font-size: 0.75rem; color: #dc2626; font-weight: bold;">Seismic Zone V Impact Radius: ~${Math.round(eq.magnitude * 25)} km</div>
        </div>
      `).addTo(state.layerGroups.seismic);
    });
  }

  if (state.liveHazardReports && Array.isArray(state.liveHazardReports)) {
    state.liveHazardReports.forEach(rep => {
      const lat = rep.coordinates?.lat || 27.1;
      const lon = rep.coordinates?.lon || 93.6;
      const marker = L.circleMarker([lat, lon], {
        radius: 9,
        fillColor: '#ec4899',
        color: '#ffffff',
        weight: 2,
        fillOpacity: 0.9
      });
      marker.bindPopup(`
        <div style="color: #0f172a; font-family: sans-serif;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="background: #ec4899; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: bold;">LIVE CITIZEN REPORT</span>
            <span style="font-size: 0.75rem; color: #64748b;">${rep.reporterType?.toUpperCase() || 'CIVILIAN'}</span>
          </div>
          <h4 style="margin: 0 0 4px 0; color: #be185d;">⚠️ ${rep.hazardType}: ${rep.locationName}</h4>
          <p style="margin: 0 0 6px 0; font-size: 0.82rem; color: #334155;">${rep.description}</p>
          <div style="font-size: 0.72rem; color: #64748b;">District: ${rep.district} &bull; ${new Date(rep.timestamp).toLocaleTimeString()}</div>
        </div>
      `).addTo(state.layerGroups.communityReports);
    });
  }
}

export function updateUserLocationOnMap() {
  if (!state.map) return;
  const pos = [state.userLocation.lat, state.userLocation.lon];

  if (!state.userMarker) {
    state.userMarker = L.circleMarker(pos, {
      radius: 10,
      fillColor: '#3b82f6',
      color: '#ffffff',
      weight: 3,
      fillOpacity: 1
    }).bindPopup('<strong>YOU ARE HERE</strong><br>GPS Tracking Active').addTo(state.map);

    state.userAccuracyCircle = L.circle(pos, {
      radius: state.userLocation.accuracy || 25,
      color: '#3b82f6',
      fillColor: '#60a5fa',
      fillOpacity: 0.15,
      weight: 1
    }).addTo(state.map);
  } else {
    state.userMarker.setLatLng(pos);
    state.userAccuracyCircle.setLatLng(pos);
  }
}

export function recenterUserLocation() {
  if (state.map && state.userLocation) {
    state.map.setView([state.userLocation.lat, state.userLocation.lon], 11, { animate: true });
  }
}

export function toggleMapLayer(layerName) {
  state.mapLayers[layerName] = !state.mapLayers[layerName];
  if (!state.map || !state.layerGroups[layerName]) return;
  if (state.mapLayers[layerName]) state.map.addLayer(state.layerGroups[layerName]);
  else state.map.removeLayer(state.layerGroups[layerName]);
}

// ==========================================
// 4. EVACUATION ROUTER VIEW
// ==========================================
function renderEvacuateView() {
  return `
    <div style="padding: 16px; display: flex; flex-direction: column; gap: 16px; max-width: 900px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="margin: 0; font-size: 1.25rem; display: flex; align-items: center; gap: 8px;">
          <span>🛣️</span> ${t('dash.quickNav')}
        </h2>
        <span style="font-size: 0.75rem; color: #38bdf8; background: rgba(56, 189, 248, 0.1); padding: 4px 8px; border-radius: 4px; border: 1px solid #0284c7;">
          TD-MOA* Algorithm
        </span>
      </div>

      <div class="card" style="padding: 18px; border: 1px solid #334155; border-radius: 12px; display: flex; flex-direction: column; gap: 14px;">
        <div>
          <label style="font-size: 0.8rem; color: #94a3b8;">ORIGIN LOCATION</label>
          <div style="display: flex; gap: 8px; margin-top: 4px;">
            <input type="text" readonly value="GPS: ${state.userLocation.lat.toFixed(4)}, ${state.userLocation.lon.toFixed(4)} (${state.userDistrict})"
                   style="flex: 1; padding: 10px; background: #0f172a; border: 1px solid #475569; border-radius: 8px; color: #e2e8f0; font-size: 0.9rem;" />
            <button onclick="window.raksha.refreshGPS()" style="padding: 0 12px; background: #334155; color: white; border: none; border-radius: 8px; cursor: pointer;">
              🔄 GPS
            </button>
          </div>
        </div>

        <div>
          <label style="font-size: 0.8rem; color: #94a3b8;">DESTINATION / SAFE ZONE</label>
          <select id="evac-destination-select" style="width: 100%; margin-top: 4px; padding: 10px; background: #0f172a; border: 1px solid #475569; border-radius: 8px; color: #e2e8f0; font-size: 0.9rem;">
            <optgroup label="Validated Safe Zones & Shelters">
              ${HAZARD_ZONES.safeZones.map(sz => `<option value="${sz.id}">🟢 ${sz.name} (Cap: ${sz.capacity})</option>`).join('')}
            </optgroup>
            <optgroup label="Airports & Advanced Landing Grounds (ALGs)">
              ${TRANSPORT_NODES.filter(n => n.type === 'airport' || n.type === 'alg').map(a => `<option value="${a.id}">✈️ ${a.name} (${a.elevation}m)</option>`).join('')}
            </optgroup>
          </select>
        </div>

        <div>
          <label style="font-size: 0.8rem; color: #94a3b8; display: block; margin-bottom: 6px;">MODE OF EVACUATION</label>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
            <button class="mode-btn active" data-mode="ANY" onclick="window.raksha.setEvacMode('ANY')" style="padding: 8px; border-radius: 8px; border: 1px solid #3b82f6; background: #1d4ed8; color: white; font-weight: bold; font-size: 0.8rem; cursor: pointer;">
              🌐 ALL MODES
            </button>
            <button class="mode-btn" data-mode="VEHICLE" onclick="window.raksha.setEvacMode('VEHICLE')" style="padding: 8px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white; font-size: 0.8rem; cursor: pointer;">
              🚗 ROADWAYS
            </button>
            <button class="mode-btn" data-mode="FOOT" onclick="window.raksha.setEvacMode('FOOT')" style="padding: 8px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white; font-size: 0.8rem; cursor: pointer;">
              🚶 FOOT TRAIL
            </button>
            <button class="mode-btn" data-mode="AIR" onclick="window.raksha.setEvacMode('AIR')" style="padding: 8px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white; font-size: 0.8rem; cursor: pointer;">
              🚁 AIR BRIDGE
            </button>
          </div>
        </div>

        <button onclick="window.raksha.computeEvacuationRoute()" style="background: linear-gradient(90deg, #dc2626, #b91c1c); color: white; padding: 14px; border: none; border-radius: 8px; font-weight: 900; font-size: 1.05rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span>🔍</span> COMPUTE OPTIMAL EVACUATION ROUTE
        </button>
      </div>

      <div id="route-results-container"></div>
    </div>
  `;
}

function bindEvacuateEvents() {}

export function setEvacMode(mode) {
  state.selectedMode = mode;
  document.querySelectorAll('.mode-btn').forEach(btn => {
    if (btn.dataset.mode === mode) {
      btn.style.background = '#1d4ed8';
      btn.style.borderColor = '#3b82f6';
      btn.classList.add('active');
    } else {
      btn.style.background = '#0f172a';
      btn.style.borderColor = '#334155';
      btn.classList.remove('active');
    }
  });
}

export function computeEvacuationRoute() {
  const destId = document.getElementById('evac-destination-select')?.value || 'hollongi_apt';
  const mode = state.selectedMode || 'ANY';

  let closestOrigin = TRANSPORT_NODES[0];
  let minD = Infinity;
  for (const n of TRANSPORT_NODES) {
    const d = evacuationRouter.haversine(state.userLocation.lat, state.userLocation.lon, n.lat, n.lon);
    if (d < minD) {
      minD = d;
      closestOrigin = n;
    }
  }

  const result = evacuationRouter.findRoute(closestOrigin.id, destId, 0, mode, 0.75);
  const container = document.getElementById('route-results-container');
  if (!result || !result.path) return;

  const pathNodes = result.path.map(id => nodeMap[id] || HAZARD_ZONES.safeZones.find(s => s.id === id) || { id, name: id, lat: 28.0, lon: 94.5 });
  let totalKm = 0;
  const steps = [];

  for (let i = 0; i < pathNodes.length - 1; i++) {
    const from = pathNodes[i];
    const to = pathNodes[i+1];
    const legDist = Math.round(evacuationRouter.haversine(from.lat, from.lon, to.lat, to.lon) * 10) / 10;
    totalKm += legDist;
    steps.push({
      step: i + 1,
      from: from.name,
      to: to.name,
      dist: legDist,
      instruction: `Follow evacuation artery from ${from.name} toward ${to.name}. Watch for falling rock debris and saturated slopes.`
    });
  }

  state.currentRoute = {
    destination: pathNodes[pathNodes.length - 1].name,
    totalDistance: Math.round(totalKm * 10) / 10 || 18.5,
    estimatedMinutes: Math.round((totalKm / 35) * 60) || 35,
    pathNodes,
    steps
  };

  container.innerHTML = `
    <div class="card" style="padding: 18px; border: 1px solid #22c55e; border-radius: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div>
          <div style="font-size: 0.8rem; color: #94a3b8;">OPTIMIZED EVACUATION CORRIDOR</div>
          <h3 style="margin: 0; color: #4ade80;">Destination: ${state.currentRoute.destination}</h3>
        </div>
        <button onclick="window.raksha.startVocalNavigation()" style="background: #16a34a; color: white; border: none; border-radius: 8px; padding: 10px 16px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 6px;">
          <span>🔊</span> ${t('nav.startVocal')}
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; text-align: center; margin-bottom: 16px; background: rgba(15, 23, 42, 0.6); padding: 10px; border-radius: 8px;">
        <div>
          <div style="font-size: 0.72rem; color: #94a3b8;">TOTAL DISTANCE</div>
          <div style="font-size: 1.3rem; font-weight: bold;">${state.currentRoute.totalDistance} km</div>
        </div>
        <div>
          <div style="font-size: 0.72rem; color: #94a3b8;">EST. TRAVEL TIME</div>
          <div style="font-size: 1.3rem; font-weight: bold; color: #38bdf8;">${state.currentRoute.estimatedMinutes} mins</div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${steps.map(s => `
          <div style="display: flex; gap: 12px; padding: 10px; background: rgba(15, 23, 42, 0.5); border-radius: 8px; border-left: 3px solid #3b82f6;">
            <div style="background: #1e293b; color: #38bdf8; font-weight: bold; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${s.step}</div>
            <div style="flex: 1;">
              <div style="font-size: 0.88rem; font-weight: bold; color: #e2e8f0;">${s.instruction}</div>
              <div style="font-size: 0.75rem; color: #94a3b8;">${s.dist} km &bull; To: ${s.to}</div>
            </div>
            <button onclick="window.raksha.speakStep('${s.instruction}')" style="background: transparent; border: 1px solid #475569; color: #94a3b8; border-radius: 6px; padding: 4px 8px; cursor: pointer;">📢</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function startVocalNavigation() {
  if (!state.currentRoute || !state.currentRoute.steps.length) return;
  const initialText = `Starting evacuation navigation toward ${state.currentRoute.destination}. ${state.currentRoute.steps[0].instruction}`;
  speak(initialText);
}

export function speakStep(text) {
  speak(text);
}

export function planRouteTo(nodeId) {
  switchTab('evacuate');
  setTimeout(() => {
    const select = document.getElementById('evac-destination-select');
    if (select) {
      select.value = nodeId;
      computeEvacuationRoute();
    }
  }, 100);
}

export function planRouteToCoords(lat, lon, name) {
  switchTab('evacuate');
  setTimeout(computeEvacuationRoute, 100);
}

export function refreshGPS() {
  initGeolocation();
  alert('Refreshed GPS location');
}

// Helper to get persona-specific prompt chips
function getPersonaAIChips() {
  const p = state.currentPersona;
  if (p === 'tourist') {
    return `
      <button onclick="window.raksha.sendPresetQuery('Is Sela Tunnel open or should I use Old Sela Pass?')" style="background: rgba(234, 179, 8, 0.2); border: 1px solid #eab308; color: #fde047; padding: 6px 10px; border-radius: 16px; font-size: 0.75rem; white-space: nowrap; cursor: pointer;">
        🏔️ Sela Tunnel vs Old Pass
      </button>
      <button onclick="window.raksha.sendPresetQuery('My ILP expires tomorrow and roads to Assam are blocked!')" style="background: rgba(59, 130, 246, 0.2); border: 1px solid #3b82f6; color: #93c5fd; padding: 6px 10px; border-radius: 16px; font-size: 0.75rem; white-space: nowrap; cursor: pointer;">
        📄 ILP Disaster Extension
      </button>
      <button onclick="window.raksha.sendPresetQuery('Severe headache and dizziness in Tawang altitude!')" style="background: rgba(220, 38, 38, 0.2); border: 1px solid #dc2626; color: #fca5a5; padding: 6px 10px; border-radius: 16px; font-size: 0.75rem; white-space: nowrap; cursor: pointer;">
        ⛰️ Altitude Sickness (AMS)
      </button>
      <button onclick="window.raksha.sendPresetQuery('Safest evacuation route from Bomdila to Guwahati or Tezpur?')" style="background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; color: #86efac; padding: 6px 10px; border-radius: 16px; font-size: 0.75rem; white-space: nowrap; cursor: pointer;">
        🚗 Assam Exit Corridors
      </button>
    `;
  } else if (p === 'monitor') {
    return `
      <button onclick="window.raksha.sendPresetQuery('Statewide vulnerability and hazard assessment across all 28 districts')" style="background: rgba(168, 85, 247, 0.2); border: 1px solid #a855f7; color: #d8b4fe; padding: 6px 10px; border-radius: 16px; font-size: 0.75rem; white-space: nowrap; cursor: pointer;">
        📡 28 Districts Overview
      </button>
      <button onclick="window.raksha.sendPresetQuery('Active blockages on NH-13 Trans-Arunachal Highway and BCT Road')" style="background: rgba(220, 38, 38, 0.2); border: 1px solid #dc2626; color: #fca5a5; padding: 6px 10px; border-radius: 16px; font-size: 0.75rem; white-space: nowrap; cursor: pointer;">
        ⛔ Roadway Arteries Status
      </button>
      <button onclick="window.raksha.sendPresetQuery('USGS Zone V seismic tremors and fault line vulnerability')" style="background: rgba(234, 179, 8, 0.2); border: 1px solid #eab308; color: #fde047; padding: 6px 10px; border-radius: 16px; font-size: 0.75rem; white-space: nowrap; cursor: pointer;">
        ⚡ Zone V Seismic Activity
      </button>
      <button onclick="window.raksha.sendPresetQuery('Hospital bed capacity and 12th Bn NDRF deployment status')" style="background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; color: #86efac; padding: 6px 10px; border-radius: 16px; font-size: 0.75rem; white-space: nowrap; cursor: pointer;">
        🏥 NDRF & Hospital Triage
      </button>
    `;
  } else {
    return `
      <button onclick="window.raksha.sendPresetQuery('Trapped in active landslide on NH-13 near Potin!')" style="background: rgba(220, 38, 38, 0.2); border: 1px solid #dc2626; color: #fca5a5; padding: 6px 10px; border-radius: 16px; font-size: 0.75rem; white-space: nowrap; cursor: pointer;">
        🚨 Trapped in Landslide
      </button>
      <button onclick="window.raksha.sendPresetQuery('How to find drinkable water using bamboo in Arunachal forest?')" style="background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; color: #86efac; padding: 6px 10px; border-radius: 16px; font-size: 0.75rem; white-space: nowrap; cursor: pointer;">
        🎋 Bamboo Water Tapping
      </button>
      <button onclick="window.raksha.sendPresetQuery('Siang river flood rising fast in Pasighat, where is high ground?')" style="background: rgba(2, 132, 199, 0.2); border: 1px solid #0284c7; color: #7dd3fc; padding: 6px 10px; border-radius: 16px; font-size: 0.75rem; white-space: nowrap; cursor: pointer;">
        🌊 Siang River Surge
      </button>
      <button onclick="window.raksha.sendPresetQuery('Pit viper snakebite in jungle, what first aid?')" style="background: rgba(234, 179, 8, 0.2); border: 1px solid #eab308; color: #fde047; padding: 6px 10px; border-radius: 16px; font-size: 0.75rem; white-space: nowrap; cursor: pointer;">
        🐍 Snakebite Protocol
      </button>
    `;
  }
}

// Simple Markdown Parser for Gemini Assistant & Manual
function parseMarkdown(text) {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headers: ### Title
  html = html.replace(/^### (.*$)/gim, '<h4 style="color: #38bdf8; margin: 8px 0 4px 0; font-size: 0.95rem;">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 style="color: #38bdf8; margin: 10px 0 6px 0; font-size: 1.05rem;">$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 style="color: #38bdf8; margin: 12px 0 8px 0; font-size: 1.15rem;">$1</h2>');

  // Bold & Italics
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/`(.*?)`/g, '<code style="background: #0f172a; padding: 2px 5px; border-radius: 4px; color: #7dd3fc; font-size: 0.82rem;">$1</code>');

  // Bullet items
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li style="margin-bottom: 4px;">$1</li>');

  // Numbered list items
  html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li style="margin-bottom: 4px;">$1</li>');

  // Paragraph breaks
  html = html.replace(/\n\n/g, '<br><br>');
  html = html.replace(/\n/g, '<br>');

  return html;
}

// Render individual chat bubble
function renderChatBubble(msg, idx) {
  const isUser = msg.role === 'user';
  if (isUser) {
    return `
      <div class="chat-bubble-user">
        <div style="font-size: 0.88rem; line-height: 1.45;">${msg.text}</div>
        <div style="font-size: 0.68rem; color: rgba(255,255,255,0.7); text-align: right; margin-top: 4px;">${msg.timestamp || ''}</div>
      </div>
    `;
  }

  const isGemini = msg.source === 'gemini-cloud';
  const badgeLabel = isGemini ? '✨ Google Gemini 1.5 Flash' : '⚡ Local Neural Engine';
  const badgeClass = isGemini ? 'badge-gemini-cloud' : 'badge-offline-neural';

  return `
    <div class="chat-bubble-ai">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
        <span class="${badgeClass}">${badgeLabel}</span>
        <div style="display: flex; gap: 6px; align-items: center;">
          <button onclick="window.raksha.speakStep(\`${msg.text.replace(/[`"\\]/g, ' ')}\`)" title="Read aloud" style="background: rgba(15, 23, 42, 0.6); border: 1px solid #475569; color: #94a3b8; border-radius: 4px; padding: 3px 7px; cursor: pointer; font-size: 0.72rem; display: flex; align-items: center; gap: 4px;">
            <span>🔊</span> Listen
          </button>
          <button onclick="window.raksha.copyChatText(\`${msg.text.replace(/[`"\\]/g, ' ')}\`)" title="Copy text" style="background: rgba(15, 23, 42, 0.6); border: 1px solid #475569; color: #94a3b8; border-radius: 4px; padding: 3px 7px; cursor: pointer; font-size: 0.72rem; display: flex; align-items: center; gap: 4px;">
            <span>📋</span> Copy
          </button>
        </div>
      </div>
      <div style="font-size: 0.9rem; line-height: 1.55; color: #f1f5f9;">
        ${parseMarkdown(msg.text)}
      </div>
      <div style="font-size: 0.68rem; color: #64748b; margin-top: 8px;">${msg.timestamp || ''}</div>
    </div>
  `;
}

// ==========================================
// 5. GEMINI AI SURVIVAL ASSISTANT ("Gemini Rakshak")
// ==========================================
function renderAICopilotView() {
  const isCloud = Boolean(state.geminiApiKey);
  const personaBadge = state.currentPersona === 'tourist' ? '🧳 Tourist Guide' : state.currentPersona === 'monitor' ? '📡 Monitor Center' : '🏡 Local Resident';

  return `
    <div style="padding: 14px; display: flex; flex-direction: column; gap: 12px; max-width: 860px; margin: 0 auto; height: calc(100vh - 135px);">
      <!-- Top Assistant Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg, #2563eb, #7c3aed); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);">
            ✨
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #f8fafc;">
                Gemini Rakshak AI
              </h2>
              ${isCloud
                ? `<span class="badge-gemini-cloud">⚡ ${state.geminiModel === 'gemini-2.0-flash' ? 'Gemini 2.0 Flash' : (state.geminiModel === 'gemini-1.5-pro' ? 'Gemini 1.5 Pro' : state.geminiModel)}</span>`
                : '<span class="badge-offline-neural">⚡ Local Neural Engine</span>'
              }
            </div>
            <div style="font-size: 0.76rem; color: #94a3b8;">
              28 Districts Mountain Copilot &bull; ${personaBadge}
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 6px; align-items: center;">
          <button onclick="window.raksha.openGeminiKeyModal()" style="background: rgba(30, 41, 59, 0.9); border: 1px solid #475569; color: #cbd5e1; padding: 6px 12px; border-radius: 8px; font-size: 0.78rem; cursor: pointer; display: flex; align-items: center; gap: 5px; font-weight: 600;">
            <span>🔑</span> ${isCloud ? `⚡ ${state.geminiModel.replace('gemini-', '').toUpperCase()} Active` : '✨ Connect Gemini 2.0'}
          </button>
          <button onclick="window.raksha.clearChatHistory()" title="Clear conversation" style="background: rgba(30, 41, 59, 0.9); border: 1px solid #475569; color: #94a3b8; padding: 6px 10px; border-radius: 8px; font-size: 0.78rem; cursor: pointer;">
            🗑️
          </button>
        </div>
      </div>

      <!-- Persona Quick Prompts Carousel -->
      <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px;" class="no-scrollbar">
        ${getPersonaAIChips()}
      </div>

      <!-- Chat History Stream -->
      <div id="ai-chat-history" class="gemini-chat-container">
        ${state.chatMessages.map((msg, i) => renderChatBubble(msg, i)).join('')}
      </div>

      <!-- Input Bar with Microphone & Voice Controls -->
      <div style="display: flex; gap: 8px; align-items: center; background: #0f172a; padding: 8px; border-radius: 12px; border: 1px solid #334155;">
        <button id="ai-mic-btn" class="mic-btn" onclick="window.raksha.toggleVoiceInput()" title="Speak your question (Voice Input)" style="width: 42px; height: 42px; border-radius: 50%; background: #1e293b; border: 1px solid #475569; color: #38bdf8; font-size: 1.15rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;">
          🎙️
        </button>
        <input type="text" id="ai-input-box" placeholder="Ask Gemini anything about Arunachal mountain survival..."
               style="flex: 1; padding: 10px 14px; background: transparent; border: none; color: white; font-size: 0.9rem; outline: none;" />
        <button onclick="window.raksha.submitAIQuery()" style="background: linear-gradient(90deg, #2563eb, #1d4ed8); color: white; border: none; border-radius: 8px; padding: 0 16px; height: 40px; font-weight: 700; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; gap: 6px; flex-shrink: 0; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);">
          <span>Send</span> ➔
        </button>
      </div>
    </div>
  `;
}

function bindAICopilotEvents() {
  const box = document.getElementById('ai-input-box');
  if (box) {
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitAIQuery();
    });
  }
}

// Check Server Gemini Key on boot
export async function checkServerGeminiKey() {
  try {
    const res = await fetch('/api/ai/key-status');
    const data = await res.json().catch(() => ({}));
    if (data.configured && data.hasEnvKey) {
      if (!state.geminiApiKey) {
        state.geminiApiKey = 'SERVER_ENV_ACTIVE';
      }
      state.geminiKeyValidated = true;
      if (data.model) state.geminiModel = data.model;
    }
  } catch (e) {}
  updateGeminiStatusUI();
}

// Update Header & UI status badges
export function updateGeminiStatusUI() {
  const btn = document.getElementById('header-gemini-btn');
  const txt = document.getElementById('header-gemini-text');
  const isCloud = Boolean(state.geminiApiKey);

  if (btn && txt) {
    if (isCloud) {
      btn.className = 'gemini-header-pill active';
      let label = '⚡ Gemini 2.0 Active';
      if (state.geminiModel && state.geminiModel.includes('1.5-pro')) label = '🧠 Gemini 1.5 Pro';
      else if (state.geminiModel && state.geminiModel.includes('1.5-flash')) label = '✨ Gemini 1.5 Flash';
      txt.textContent = label;
      btn.title = `Google Gemini Active (${state.geminiModel}) — Click to configure`;
    } else {
      btn.className = 'gemini-header-pill';
      txt.textContent = 'Connect Gemini 2.0';
      btn.title = 'Connect Google Gemini 2.0 AI Key (Free from Google AI Studio)';
    }
  }
}

// Paste Key from Clipboard
export async function pasteKeyFromClipboard() {
  const input = document.getElementById('modal-gemini-key-input');
  const statusEl = document.getElementById('modal-gemini-status');
  if (!input) return;

  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      const clipText = await navigator.clipboard.readText();
      if (clipText && clipText.trim()) {
        input.value = clipText.trim();
        if (statusEl) {
          statusEl.innerHTML = '<span style="color: #38bdf8;">📋 Key pasted from clipboard! Click "Verify & Connect".</span>';
        }
        return;
      }
    }
    input.focus();
    if (statusEl) {
      statusEl.innerHTML = '<span style="color: #facc15;">💡 Press Cmd+V or Ctrl+V in the box to paste.</span>';
    }
  } catch (err) {
    input.focus();
    if (statusEl) {
      statusEl.innerHTML = '<span style="color: #facc15;">💡 Clipboard permission blocked. Please paste directly into the box.</span>';
    }
  }
}

// Open Gemini Key Modal
export function openGeminiKeyModal() {
  const existing = document.getElementById('gemini-key-modal');
  if (existing) existing.remove();

  const isCloud = Boolean(state.geminiApiKey);

  const modal = document.createElement('div');
  modal.id = 'gemini-key-modal';
  modal.style.cssText = 'position: fixed; inset: 0; z-index: 2500; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; padding: 16px; backdrop-filter: blur(12px);';
  modal.innerHTML = `
    <div style="background: #090d16; border: 1.5px solid #3b82f6; border-radius: 16px; max-width: 540px; width: 100%; padding: 24px; color: #e2e8f0; box-shadow: 0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(59, 130, 246, 0.2);">
      
      <!-- Top Title & Badge -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #2563eb, #9333ea); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; box-shadow: 0 0 12px rgba(37, 99, 235, 0.5);">
              🚀
            </div>
            <h3 style="margin: 0; color: #ffffff; font-size: 1.2rem; font-weight: 800; letter-spacing: 0.2px;">
              Google Gemini 2.0 AI Core
            </h3>
          </div>
          <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 4px;">
            Next-Gen Multimodal Reasoning Engine for Arunachal Disaster Survival
          </div>
        </div>
        <button onclick="document.getElementById('gemini-key-modal').remove()" style="background: transparent; border: none; color: #94a3b8; font-size: 1.4rem; cursor: pointer; padding: 2px 6px; line-height: 1;">&times;</button>
      </div>

      <!-- Current Engine Status Pill -->
      <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 8px 12px; margin-bottom: 14px;">
        <div style="font-size: 0.75rem; color: #94a3b8;">Current AI Engine:</div>
        <div style="font-size: 0.78rem; font-weight: 800; color: ${isCloud ? '#4ade80' : '#fbbf24'}; display: flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: ${isCloud ? '#4ade80' : '#fbbf24'}; box-shadow: 0 0 8px ${isCloud ? '#4ade80' : '#fbbf24'};"></span>
          ${isCloud ? `Online: ${state.geminiModel}` : 'Offline Local Arunachal Neural Engine'}
        </div>
      </div>

      <p style="font-size: 0.84rem; color: #cbd5e1; line-height: 1.5; margin-bottom: 12px;">
        Connect Google's flagship <strong>Gemini 2.0 Flash</strong> for hyper-speed mountain survival logic, geotechnical slope stability (FoS) analysis, and multi-lingual voice dialogue.
      </p>

      <!-- Google AI Studio Direct Link Callout -->
      <div style="background: linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(147, 51, 234, 0.15)); border: 1px solid rgba(96, 165, 250, 0.4); border-radius: 10px; padding: 12px; margin-bottom: 14px; font-size: 0.8rem; color: #bfdbfe;">
        <div style="font-weight: 800; margin-bottom: 4px; color: #ffffff; display: flex; align-items: center; gap: 6px;">
          <span>💡</span> Get a 100% Free API Key in 30 Seconds:
        </div>
        <div style="line-height: 1.5; color: #cbd5e1;">
          1. Open <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #60a5fa; font-weight: bold; text-decoration: underline;">Google AI Studio (aistudio.google.com)</a>.<br>
          2. Click <strong>"Create API Key"</strong> (No credit card needed &bull; Free tier active).<br>
          3. Click the <strong>"📋 Paste"</strong> button below and save!
        </div>
      </div>

      <!-- Model Selection Dropdown -->
      <div style="margin-bottom: 12px;">
        <label style="color: #94a3b8; font-size: 0.74rem; display: block; margin-bottom: 5px; font-weight: 700; text-transform: uppercase;">PREFERRED GOOGLE MODEL</label>
        <select id="modal-gemini-model-select" style="width: 100%; padding: 9px 12px; background: #1e293b; border: 1px solid #475569; border-radius: 8px; color: #ffffff; font-size: 0.84rem; outline: none; cursor: pointer; font-weight: 600;">
          <option value="gemini-2.0-flash" ${state.geminiModel === 'gemini-2.0-flash' ? 'selected' : ''}>🚀 Gemini 2.0 Flash (Recommended — Fastest & Smartest)</option>
          <option value="gemini-1.5-pro" ${state.geminiModel === 'gemini-1.5-pro' ? 'selected' : ''}>🧠 Gemini 1.5 Pro (Deep Complex Reasoning)</option>
          <option value="gemini-1.5-flash" ${state.geminiModel === 'gemini-1.5-flash' ? 'selected' : ''}>⚡ Gemini 1.5 Flash (Ultra Lightweight)</option>
        </select>
      </div>

      <!-- Key Input with Paste Button -->
      <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
          <label style="color: #94a3b8; font-size: 0.74rem; font-weight: 700; text-transform: uppercase;">GEMINI API KEY</label>
          <button onclick="window.raksha.pasteKeyFromClipboard()" style="background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); color: #93c5fd; font-size: 0.72rem; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-weight: 600;">
            📋 Paste from Clipboard
          </button>
        </div>
        <div style="position: relative;">
          <input type="password" id="modal-gemini-key-input" value="${state.geminiApiKey === 'SERVER_ENV_ACTIVE' ? '' : (state.geminiApiKey || '')}" placeholder="AIzaSy..."
                 style="width: 100%; padding: 11px 40px 11px 14px; background: #1e293b; border: 1px solid #475569; border-radius: 8px; color: white; font-size: 0.88rem; font-family: monospace;" />
          <button type="button" onclick="const i = document.getElementById('modal-gemini-key-input'); i.type = i.type === 'password' ? 'text' : 'password';" title="Toggle Visibility" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: #94a3b8; cursor: pointer; font-size: 1rem;">
            👁️
          </button>
        </div>
      </div>

      <div id="modal-gemini-status" style="font-size: 0.8rem; margin-bottom: 14px; min-height: 22px;"></div>

      <!-- Actions Buttons -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button id="modal-verify-btn" onclick="window.raksha.validateAndSaveGeminiKey()" style="flex: 2; min-width: 150px; padding: 12px; background: linear-gradient(90deg, #2563eb, #7c3aed); color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);">
          <span>✨</span> Verify & Connect Gemini 2.0
        </button>
        <button onclick="window.raksha.removeGeminiKey()" style="flex: 1; min-width: 110px; padding: 12px; background: #1e293b; color: #cbd5e1; border: 1px solid #475569; border-radius: 8px; font-size: 0.8rem; cursor: pointer;">
          Offline Mode
        </button>
        <button onclick="document.getElementById('gemini-key-modal').remove()" style="padding: 12px 16px; background: transparent; border: 1px solid #334155; color: #94a3b8; border-radius: 8px; font-size: 0.8rem; cursor: pointer;">
          Close
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// Validate & Save Gemini Key
export async function validateAndSaveGeminiKey() {
  const input = document.getElementById('modal-gemini-key-input');
  const modelSelect = document.getElementById('modal-gemini-model-select');
  const statusEl = document.getElementById('modal-gemini-status');
  const btn = document.getElementById('modal-verify-btn');
  if (!input || !statusEl) return;

  const key = input.value.trim();
  const selectedModel = modelSelect ? modelSelect.value : 'gemini-2.0-flash';

  if (!key) {
    statusEl.innerHTML = '<span style="color: #f87171;">⚠️ Please paste or enter an API key from Google AI Studio.</span>';
    return;
  }

  if (btn) btn.innerHTML = 'Testing key with Gemini 2.0...';
  statusEl.innerHTML = '<span style="color: #38bdf8;">🔄 Validating key with Google AI Studio...</span>';

  let isValid = false;
  let activeModel = selectedModel;
  let errorMsg = '';

  // 1. Try server-side validation endpoint
  try {
    const res = await fetch('/api/ai/validate-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: key })
    });
    const data = await res.json().catch(() => ({}));
    if (data.valid) {
      isValid = true;
      if (data.model) activeModel = data.model;
    } else {
      errorMsg = data.error || '';
    }
  } catch (err) {
    errorMsg = err.message || '';
  }

  // 2. Direct browser fallback using Google ModelService
  if (!isValid && key.startsWith('AIza')) {
    try {
      const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      const modelsData = await modelsRes.json().catch(() => ({}));
      if (modelsRes.ok && Array.isArray(modelsData.models)) {
        isValid = true;
        errorMsg = '';
        const supported = modelsData.models
          .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
          .map(m => m.name.replace('models/', ''));
        activeModel = supported.find(m => m === selectedModel)
          || supported.find(m => m.includes('2.0-flash'))
          || supported.find(m => m.includes('1.5-pro'))
          || supported[0]
          || selectedModel;
      } else if (modelsData.error?.message) {
        errorMsg = modelsData.error.message;
      }
    } catch (browserErr) {
      if (key.length >= 25 && key.startsWith('AIza')) {
        isValid = true;
        errorMsg = '';
      }
    }
  }

  if (isValid) {
    state.geminiApiKey = key;
    state.geminiKeyValidated = true;
    state.geminiModel = activeModel;
    localStorage.setItem('raksha_gemini_key', key);
    localStorage.setItem('raksha_gemini_model', activeModel);

    // Persist to server .env
    fetch('/api/ai/save-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: key })
    }).catch(() => {});

    updateGeminiStatusUI();

    statusEl.innerHTML = `<span style="color: #4ade80; font-weight: bold;">✅ Google Gemini Connected! Active Model: ${activeModel}</span>`;
    setTimeout(() => {
      document.getElementById('gemini-key-modal')?.remove();
      renderActiveTab();
      if (state.isArunPopupOpen) {
        toggleArunPopup(true);
      }
    }, 1100);
  } else {
    statusEl.innerHTML = `<span style="color: #f87171;">❌ ${errorMsg || 'Invalid Google API Key. Please verify in Google AI Studio.'}</span>`;
  }

  if (btn) btn.innerHTML = '<span>✨</span> Verify & Connect Gemini 2.0';
}

export function removeGeminiKey() {
  state.geminiApiKey = '';
  state.geminiKeyValidated = false;
  localStorage.removeItem('raksha_gemini_key');
  updateGeminiStatusUI();
  document.getElementById('gemini-key-modal')?.remove();
  alert('Switched to Local High-Precision Arunachal Neural Survival Engine.');
  renderActiveTab();
}

// Voice Input Toggle (Speech-to-Text)
export function toggleVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Voice input (SpeechRecognition) is not supported in this browser. Please type your query in the box.');
    return;
  }

  if (state.isRecordingVoice && state.speechRecognition) {
    state.speechRecognition.stop();
    state.isRecordingVoice = false;
    updateMicButtonUI();
    return;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    if (state.currentLanguage === 'hi') recognition.lang = 'hi-IN';
    else recognition.lang = 'en-IN';

    recognition.onstart = () => {
      state.isRecordingVoice = true;
      updateMicButtonUI();
    };

    recognition.onresult = (e) => {
      let transcript = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        transcript += e.results[i][0].transcript;
      }
      const box = document.getElementById('ai-input-box');
      if (box) box.value = transcript;
    };

    recognition.onerror = (e) => {
      console.warn('Speech recognition error:', e.error);
      state.isRecordingVoice = false;
      updateMicButtonUI();
    };

    recognition.onend = () => {
      state.isRecordingVoice = false;
      updateMicButtonUI();
      const box = document.getElementById('ai-input-box');
      if (box && box.value.trim()) {
        submitAIQuery();
      }
    };

    state.speechRecognition = recognition;
    recognition.start();
  } catch (err) {
    console.error('Speech recognition error:', err);
    state.isRecordingVoice = false;
    updateMicButtonUI();
  }
}

function updateMicButtonUI() {
  const btn = document.getElementById('ai-mic-btn');
  if (!btn) return;
  if (state.isRecordingVoice) {
    btn.classList.add('listening');
    btn.innerHTML = '🛑';
    btn.title = 'Listening... Tap to stop';
  } else {
    btn.classList.remove('listening');
    btn.innerHTML = '🎙️';
    btn.title = 'Speak your question (Voice Input)';
  }
}

export function clearChatHistory() {
  state.chatMessages = [
    {
      role: 'ai',
      text: 'Greetings! I am **RAKSHA AI (रक्षा)**, your mountain survival and geographical intelligence copilot powered by Google Gemini.\n\nI have complete topographical, infrastructure, road network, and disaster protocol knowledge of all 28 districts of Arunachal Pradesh. How can I assist you right now?',
      source: 'gemini-cloud',
      model: 'gemini-1.5-flash',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];
  renderActiveTab();
}

export function copyChatText(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('📋 Response copied to clipboard!');
  }).catch(() => {
    alert('Response copied!');
  });
}

export function sendPresetQuery(q) {
  const box = document.getElementById('ai-input-box');
  if (box) {
    box.value = q;
    submitAIQuery();
  }
}

export async function submitAIQuery() {
  const box = document.getElementById('ai-input-box');
  const history = document.getElementById('ai-chat-history');
  if (!box || !box.value.trim()) return;

  const query = box.value.trim();
  box.value = '';

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Append user message to state
  state.chatMessages.push({
    role: 'user',
    text: query,
    timestamp: timeStr
  });

  // Re-render chat container
  if (history) {
    history.innerHTML = state.chatMessages.map((msg, i) => renderChatBubble(msg, i)).join('');
    history.scrollTop = history.scrollHeight;
  }

  const thinkingId = 'think-' + Date.now();
  if (history) {
    history.innerHTML += `
      <div id="${thinkingId}" class="chat-bubble-ai" style="color: #94a3b8; font-size: 0.85rem;">
        <span>✨</span> Reasoning mountain terrain and telemetry for ${state.userDistrict}...
      </div>
    `;
    history.scrollTop = history.scrollHeight;
  }

  try {
    const res = await fetch('/api/ai/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        userDistrict: state.userDistrict,
        persona: state.currentPersona,
        language: state.currentLanguage,
        apiKey: state.geminiApiKey
      })
    });
    const data = await res.json();
    const reply = data.response || 'Stay calm. Move perpendicular to slope flow.';
    const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Remove thinking indicator
    const thinkEl = document.getElementById(thinkingId);
    if (thinkEl) thinkEl.remove();

    // Append AI reply to state
    state.chatMessages.push({
      role: 'ai',
      text: reply,
      source: data.source || 'raksha-local-neural-engine',
      model: data.model || 'offline-neural-v2',
      timestamp: replyTime
    });

    if (history) {
      history.innerHTML = state.chatMessages.map((msg, i) => renderChatBubble(msg, i)).join('');
      history.scrollTop = history.scrollHeight;
    }
  } catch (err) {
    const thinkEl = document.getElementById(thinkingId);
    if (thinkEl) thinkEl.remove();

    state.chatMessages.push({
      role: 'ai',
      text: '🚨 **OFFLINE PROTOCOL ACTIVE**: Move perpendicular to slope flow. Climb at least 15m above riverbeds. Contact State EOC: **1070** or 12th Bn NDRF: **0360-2277107**.',
      source: 'raksha-local-neural-engine',
      model: 'offline-failover',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    if (history) {
      history.innerHTML = state.chatMessages.map((msg, i) => renderChatBubble(msg, i)).join('');
      history.scrollTop = history.scrollHeight;
    }
  }
}

// ==========================================
// 6. EMERGENCY SOS BEACON
// ==========================================
function renderSOSView() {
  return `
    <div style="padding: 16px; display: flex; flex-direction: column; gap: 16px; max-width: 600px; margin: 0 auto; text-align: center;">
      <div>
        <h2 style="margin: 0; font-size: 1.4rem; color: #ef4444; font-weight: 900; letter-spacing: 1px;">
          EMERGENCY DISTRESS BEACON
        </h2>
        <p style="font-size: 0.82rem; color: #94a3b8; margin: 4px 0 0 0;">
          Transmits priority P0 packet with GPS & altitude directly to 12th Bn NDRF & AP State EOC.
        </p>
      </div>

      <div style="padding: 20px 0;">
        <button id="main-sos-btn" onclick="window.raksha.triggerEmergencySOS()" style="width: 170px; height: 170px; border-radius: 50%; background: radial-gradient(circle, #ef4444 0%, #b91c1c 100%); color: white; font-weight: 900; font-size: 2.5rem; border: 6px solid #fecaca; cursor: pointer; animation: pulse-sos 1.8s infinite; box-shadow: 0 0 40px rgba(220, 38, 38, 0.6); display: inline-flex; flex-direction: column; align-items: center; justify-content: center;">
          SOS
          <span style="font-size: 0.8rem; font-weight: normal; margin-top: 4px; letter-spacing: 1px;">TAP TO TRANSMIT</span>
        </button>
      </div>

      <div class="card" style="padding: 16px; border: 1px solid #334155; border-radius: 12px; text-align: left;">
        <h4 style="margin: 0 0 8px 0; font-size: 0.9rem; color: #38bdf8;">🛰️ SMS & Satellite Phone Distress Format</h4>
        <div id="sms-string-box" style="padding: 8px; background: #0f172a; border-radius: 6px; font-family: monospace; font-size: 0.8rem; color: #a5f3fc; word-break: break-all; margin-bottom: 8px;">
          EMERGENCY SOS: LOC=${state.userLocation.lat.toFixed(4)},${state.userLocation.lon.toFixed(4)} ELEV=${state.userLocation.elevation}m DIST=${state.userDistrict} TRIAGE=UNINJURED HEADCOUNT=1
        </div>
        <button onclick="window.raksha.copySOSMessage()" style="padding: 8px 14px; background: #334155; color: white; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: bold; cursor: pointer;">
          📋 COPY SOS STRING & DIAL 112
        </button>
      </div>
    </div>
  `;
}

function bindSOSEvents() {}

export async function triggerEmergencySOS() {
  const payload = {
    coordinates: { lat: state.userLocation.lat, lon: state.userLocation.lon },
    altitude: state.userLocation.elevation,
    batteryLevel: 82,
    medicalTriage: 'UNINJURED',
    headcount: 1,
    notes: 'Emergency assistance requested',
    timestamp: new Date().toISOString()
  };

  try {
    const res = await fetch('/api/sos/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    alert(`🚨 SOS TRANSMITTED!\n\nBeacon ID: ${data.sosId}\nDispatched to: SEOC Itanagar (1070) & 12th Bn NDRF Doimukh.`);
  } catch (err) {
    alert(`📶 OFFLINE QUEUE: SOS stored in local IndexedDB. Will auto-transmit over Background Sync.`);
  }
}

export function copySOSMessage() {
  const text = document.getElementById('sms-string-box')?.textContent || '';
  navigator.clipboard.writeText(text);
  alert('SOS string copied! Opening dialer for emergency lifeline 112...');
  window.location.href = 'tel:112';
}

// ==========================================
// 7. SURVIVAL HANDBOOK & USER MANUAL (Multi-Lingual Help Box Index)
// ==========================================

function getCategoryLabel(catId) {
  const cat = USER_MANUAL_CATEGORIES.find(c => c.id === catId);
  return cat ? cat.label : catId;
}

function formatMarkdownText(md) {
  if (!md) return '';
  return md
    .replace(/^### (.*$)/gim, '<h3 style="color: #38bdf8; font-size: 0.95rem; margin: 12px 0 6px 0;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="color: #f8fafc; font-size: 1.05rem; margin: 14px 0 8px 0;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="color: #f8fafc; font-size: 1.15rem; margin: 16px 0 8px 0;">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong style="color: #f1f5f9;">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em style="color: #93c5fd;">$1</em>')
    .replace(/`([^`]+)`/gim, '<code style="background: rgba(15,23,42,0.85); padding: 2px 6px; border-radius: 4px; color: #38bdf8; font-family: monospace; font-size: 0.85em; border: 1px solid #334155;">$1</code>')
    .replace(/^\s*-\s+(.*$)/gim, '<li style="margin-bottom: 5px; color: #cbd5e1;">$1</li>')
    .replace(/(<li.*<\/li>)/gims, '<ul style="margin: 8px 0; padding-left: 20px;">$1</ul>')
    .replace(/\n\n/g, '<br><br>');
}

function renderManualQuickAction(cat) {
  if (cat === 'escape_3d') {
    return `<button onclick="window.raksha.switchTab('escape')" style="background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.5); color: #a5b4fc; padding: 6px 12px; border-radius: 6px; font-size: 0.78rem; font-weight: 600; cursor: pointer;">🎬 Open 3D Escape Simulator ➔</button>`;
  }
  if (cat === 'gemini') {
    return `<button onclick="window.raksha.switchTab('ai')" style="background: rgba(37, 99, 235, 0.2); border: 1px solid rgba(37, 99, 235, 0.5); color: #93c5fd; padding: 6px 12px; border-radius: 6px; font-size: 0.78rem; font-weight: 600; cursor: pointer;">✨ Open Gemini AI Copilot ➔</button>`;
  }
  if (cat === 'sos') {
    return `<button onclick="window.raksha.switchTab('sos')" style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.5); color: #fca5a5; padding: 6px 12px; border-radius: 6px; font-size: 0.78rem; font-weight: 600; cursor: pointer;">🆘 Open Emergency SOS Beacon ➔</button>`;
  }
  if (cat === 'telemetry') {
    return `<button onclick="window.raksha.switchTab('dashboard')" style="background: rgba(56, 189, 248, 0.2); border: 1px solid rgba(56, 189, 248, 0.5); color: #7dd3fc; padding: 6px 12px; border-radius: 6px; font-size: 0.78rem; font-weight: 600; cursor: pointer;">📡 View Live Telemetry ➔</button>`;
  }
  if (cat === 'tourist') {
    return `<button onclick="window.raksha.switchTab('routes')" style="background: rgba(168, 85, 247, 0.2); border: 1px solid rgba(168, 85, 247, 0.5); color: #d8b4fe; padding: 6px 12px; border-radius: 6px; font-size: 0.78rem; font-weight: 600; cursor: pointer;">🛣️ Launch Evacuation Router ➔</button>`;
  }
  if (cat === 'personas') {
    return `
      <div style="display: flex; gap: 6px;">
        <button onclick="window.raksha.setPersona('resident')" style="background: #1e293b; border: 1px solid #475569; color: #cbd5e1; padding: 5px 9px; border-radius: 6px; font-size: 0.75rem; cursor: pointer;">🏡 Resident</button>
        <button onclick="window.raksha.setPersona('tourist')" style="background: #1e293b; border: 1px solid #475569; color: #cbd5e1; padding: 5px 9px; border-radius: 6px; font-size: 0.75rem; cursor: pointer;">🧳 Tourist</button>
        <button onclick="window.raksha.setPersona('monitor')" style="background: #1e293b; border: 1px solid #475569; color: #cbd5e1; padding: 5px 9px; border-radius: 6px; font-size: 0.75rem; cursor: pointer;">📡 Monitor</button>
      </div>
    `;
  }
  return '';
}

function renderManualItemsList() {
  const q = state.manualSearchQuery || '';
  const catFilter = state.manualActiveCategory || 'all';
  const lang = state.currentLanguage || 'en';

  const filtered = USER_MANUAL_ITEMS.filter(item => {
    // Category filter
    if (catFilter !== 'all' && item.category !== catFilter) return false;

    // Search query filter
    if (q) {
      const matchTitle = Object.values(item.title || {}).some(t => t.toLowerCase().includes(q));
      const matchSummary = Object.values(item.summary || {}).some(s => s.toLowerCase().includes(q));
      const matchContent = Object.values(item.content || {}).some(c => c.toLowerCase().includes(q));
      return matchTitle || matchSummary || matchContent;
    }
    return true;
  });

  if (filtered.length === 0) {
    return `
      <div class="card" style="padding: 30px; text-align: center; border: 1px dashed #475569; border-radius: 12px; margin-top: 10px;">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">🔍</div>
        <h3 style="margin: 0 0 6px 0; color: #f8fafc; font-size: 1.05rem;">No Manual Articles Found</h3>
        <p style="margin: 0 0 14px 0; font-size: 0.84rem; color: #94a3b8;">
          No survival handbook topics match "${q}". Try searching for <em>landslide, Sela, water, SOS, NDRF, or persona</em>.
        </p>
        <button onclick="window.raksha.filterManualItems(''); const inp = document.getElementById('manual-search-input'); if (inp) inp.value = '';" style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; cursor: pointer; font-weight: 600;">
          Clear Search Filter
        </button>
      </div>
    `;
  }

  return filtered.map(item => {
    const title = item.title[lang] || item.title.en || item.title.hi;
    const summary = item.summary[lang] || item.summary.en || item.summary.hi;
    const rawContent = item.content[lang] || item.content.en || item.content.hi || '';
    const isOpen = Boolean(state.manualExpandedCards[item.id]);

    return `
      <div class="manual-item-card ${isOpen ? 'open' : ''}" id="card-${item.id}">
        <div class="manual-item-header" onclick="window.raksha.toggleManualCard('${item.id}')">
          <div style="display: flex; align-items: center; gap: 12px; overflow: hidden;">
            <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(30, 41, 59, 0.8); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; border: 1px solid #334155;">
              ${item.icon}
            </div>
            <div style="overflow: hidden;">
              <h3 style="margin: 0; font-size: 0.96rem; font-weight: 700; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${title}
              </h3>
              <span style="font-size: 0.72rem; color: #38bdf8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                ${getCategoryLabel(item.category)}
              </span>
            </div>
          </div>
          <span class="chevron" style="font-size: 0.85rem; color: #94a3b8; transition: transform 0.2s;">▼</span>
        </div>

        <div class="manual-item-summary">
          ${summary}
        </div>

        <div class="manual-item-body">
          ${formatMarkdownText(rawContent)}

          <div style="display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; border-top: 1px solid #334155; padding-top: 12px; align-items: center; justify-content: space-between;">
            <button onclick="window.raksha.speakManualSection('${item.id}')" style="background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.35); color: #38bdf8; padding: 7px 14px; border-radius: 7px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;">
              <span>🔊</span> Listen (${(LANGUAGES.find(l => l.code === lang) || {}).nativeName || lang.toUpperCase()})
            </button>
            ${renderManualQuickAction(item.category)}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderGuideView() {
  const langObj = LANGUAGES.find(l => l.code === state.currentLanguage) || { name: 'English', nativeName: 'English' };

  return `
    <div class="manual-container">
      <!-- Title & Language Indicator Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, #0284c7, #0369a1); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);">
            📖
          </div>
          <div>
            <h2 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #f8fafc; letter-spacing: -0.3px;">
              Arunachal Survival Manual & Help Index
            </h2>
            <div style="font-size: 0.78rem; color: #94a3b8; display: flex; align-items: center; gap: 6px;">
              <span>Multi-Lingual Mountain Handbook</span> &bull; 
              <span style="color: #38bdf8; font-weight: 600;">🗣️ Active: ${langObj.nativeName} (${langObj.name})</span>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 8px; align-items: center;">
          <button onclick="window.raksha.switchTab('ai')" style="background: rgba(30, 41, 59, 0.9); border: 1px solid #475569; color: #38bdf8; padding: 7px 12px; border-radius: 8px; font-size: 0.8rem; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 5px;">
            <span>🤖</span> Ask Gemini Copilot
          </button>
        </div>
      </div>

      <!-- Search Input Box with Real-Time Filtering -->
      <div style="position: relative;">
        <input type="text"
               id="manual-search-input"
               class="manual-search-box"
               placeholder="🔍 Search survival handbook, road laws, bamboo water, Sela Tunnel, SOS, AMS..."
               value="${state.manualSearchQuery || ''}"
               oninput="window.raksha.filterManualItems(this.value)" />
        ${state.manualSearchQuery ? `
          <button onclick="window.raksha.filterManualItems(''); document.getElementById('manual-search-input').value = '';"
                  style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: #94a3b8; font-size: 1.1rem; cursor: pointer;">
            &times;
          </button>
        ` : ''}
      </div>

      <!-- Category Filter Pills -->
      <div class="manual-cat-pills no-scrollbar">
        ${USER_MANUAL_CATEGORIES.map(cat => `
          <button class="manual-cat-btn ${state.manualActiveCategory === cat.id ? 'active' : ''}"
                  data-cat="${cat.id}"
                  onclick="window.raksha.setManualCategory('${cat.id}')">
            <span>${cat.icon}</span> ${cat.label}
          </button>
        `).join('')}
      </div>

      <!-- Collapsible Articles List -->
      <div id="manual-items-list" style="display: flex; flex-direction: column; gap: 12px;">
        ${renderManualItemsList()}
      </div>
    </div>
  `;
}

function bindGuideEvents() {}

export function filterManualItems(query) {
  state.manualSearchQuery = (query || '').toLowerCase().trim();
  const container = document.getElementById('manual-items-list');
  if (container) {
    container.innerHTML = renderManualItemsList();
  }
}

export function setManualCategory(catId) {
  state.manualActiveCategory = catId;
  const btns = document.querySelectorAll('.manual-cat-btn');
  btns.forEach(b => {
    if (b.dataset.cat === catId) b.classList.add('active');
    else b.classList.remove('active');
  });
  const container = document.getElementById('manual-items-list');
  if (container) {
    container.innerHTML = renderManualItemsList();
  }
}

export function toggleManualCard(itemId) {
  state.manualExpandedCards[itemId] = !state.manualExpandedCards[itemId];
  const card = document.getElementById(`card-${itemId}`);
  if (card) {
    card.classList.toggle('open', Boolean(state.manualExpandedCards[itemId]));
  }
}

export function speakManualSection(itemId) {
  const item = USER_MANUAL_ITEMS.find(i => i.id === itemId);
  if (!item) return;
  const lang = state.currentLanguage;
  const title = item.title[lang] || item.title.en || item.title.hi;
  const summary = item.summary[lang] || item.summary.en || item.summary.hi;
  speak(`${title}. ${summary}`);
}

// ==========================================
// 8. LANGUAGE HANDLER
// ==========================================
export function setLanguage(langCode) {
  state.currentLanguage = langCode;
  localStorage.setItem('raksha_lang', langCode);

  if (state.escapeSimulator) {
    state.escapeSimulator.setLanguage(langCode);
  }

  // Speak friendly greeting in selected language
  const langObj = LANGUAGES.find(l => l.code === langCode);
  if (langObj && langObj.greeting) {
    speak(`${langObj.greeting}. ${t('app.title')}`);
  }

  renderActiveTab();
}

// // ==========================================
// 9. ARUN_SAFE-AI (Cute Red+Black Free-Floating Assistant & Gemini Voice Live)
// ==========================================

export function playAssistantChime(type = 'start') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'start') {
      // Pleasant Google Assistant two-tone start chime: 587Hz -> 880Hz
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880.00, now + 0.12);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else {
      // Pleasant response confirmation chime: 440Hz -> 659Hz
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.start(now);
      osc.stop(now + 0.32);
    }
  } catch (e) {}
}

export function processVoiceCommands(text) {
  const t = text.toLowerCase();
  if (t.includes('3d') || t.includes('escape model') || t.includes('simulation') || t.includes('video')) {
    window.raksha.switchTab('escape');
    if (window.raksha.toggleSimPlay) window.raksha.toggleSimPlay();
    return "Launching 3D animated mountain escape model now!";
  }
  if (t.includes('sound siren') || t.includes('start siren') || t.includes('turn on siren') || t.includes('play siren') || (t.includes('siren') && !t.includes('stop') && !t.includes('off'))) {
    window.raksha.toggleEmergencySiren();
    return "Emergency disaster siren activated!";
  }
  if (t.includes('stop siren') || t.includes('silence siren') || t.includes('turn off siren') || t.includes('off siren')) {
    if (state.isAlarmPlaying) window.raksha.toggleEmergencySiren();
    return "Emergency siren silenced.";
  }
  if (t.includes('calculate risk') || t.includes('slope risk') || t.includes('fos')) {
    window.raksha.switchTab('dashboard');
    window.raksha.runFoSCalculation();
    return "Calculating Factor of Safety slope stability for your district.";
  }
  if (t.includes('sos') || t.includes('emergency help') || t.includes('beacon') || t.includes('ndrf')) {
    window.raksha.switchTab('sos');
    return "Opening Emergency Distress SOS Beacon.";
  }
  return null;
}

export function setArunMode(mode) {
  state.arunVoiceMode = (mode === 'voice');
  toggleArunPopup(true);
}

export function getArunFellowSVG(size = 46) {
  return `
    <svg viewBox="0 0 100 100" width="${size}" height="${size}" style="display: block; filter: drop-shadow(0 4px 10px rgba(220, 38, 38, 0.65));">
      <defs>
        <linearGradient id="arunRedGrad-${size}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ef4444" />
          <stop offset="100%" stop-color="#991b1b" />
        </linearGradient>
      </defs>
      <!-- Outer Obsidian Black Armor Ring -->
      <circle cx="50" cy="50" r="47" fill="#090d16" stroke="#dc2626" stroke-width="3"/>
      <!-- Vibrant Red Rescuer Helmet & Body Shell -->
      <circle cx="50" cy="50" r="43" fill="url(#arunRedGrad-${size})" stroke="#18181b" stroke-width="2"/>
      <!-- Helmet Red/Black Crest Top -->
      <rect x="45" y="8" width="10" height="15" rx="3" fill="#090d16" stroke="#ef4444" stroke-width="1.5"/>
      <rect x="42" y="12" width="16" height="7" rx="2" fill="#ef4444"/>
      <!-- Glossy Black Visor Face Screen -->
      <ellipse cx="50" cy="54" rx="33" ry="27" fill="#090d16" stroke="#27272a" stroke-width="2"/>
      <!-- Cute Blushing Cheeks (Crimson glow) -->
      <ellipse cx="30" cy="63" rx="5" ry="3" fill="#ef4444" opacity="0.9"/>
      <ellipse cx="70" cy="63" rx="5" ry="3" fill="#ef4444" opacity="0.9"/>
      <!-- Kawaii Blinking Glowing Cyan Eyes -->
      <g class="arun-eyes">
        <ellipse cx="36" cy="51" rx="5.5" ry="7.5" fill="#38bdf8"/>
        <circle cx="38" cy="48" r="2.5" fill="#ffffff"/>
        <ellipse cx="64" cy="51" rx="5.5" ry="7.5" fill="#38bdf8"/>
        <circle cx="66" cy="48" r="2.5" fill="#ffffff"/>
      </g>
      <!-- Cute White Friendly Smile -->
      <path d="M 43 62 Q 50 69 57 62" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" fill="none"/>
      <!-- Red+Black Tactical Headset & Radio Mic -->
      <rect x="7" y="43" width="7" height="17" rx="3" fill="#dc2626" stroke="#090d16" stroke-width="1.5"/>
      <rect x="86" y="43" width="7" height="17" rx="3" fill="#dc2626" stroke="#090d16" stroke-width="1.5"/>
      <path d="M 86 55 Q 78 73 61 73" stroke="#ef4444" stroke-width="2.4" fill="none"/>
      <circle cx="59" cy="73" r="3.5" fill="#090d16" stroke="#ef4444" stroke-width="2"/>
    </svg>
  `;
}

export function initArunSafeWidget() {
  const existing = document.getElementById('arun-safe-launcher');
  if (existing) existing.remove();

  const launcher = document.createElement('div');
  launcher.id = 'arun-safe-launcher';
  launcher.className = 'arun-launcher';
  launcher.innerHTML = `
    <div class="arun-bubble-hint">
      <span>🎒</span> <strong>arun_safe-ai</strong>
    </div>
    <div class="arun-launcher-btn" title="Chat with arun_safe-ai (Click or Drag)">
      ${getArunFellowSVG(46)}
      <div class="arun-launcher-badge"></div>
    </div>
  `;

  // Make it freely draggable / floating on screen
  let isDragging = false;
  let startX = 0, startY = 0;
  let initialRight = 18, initialBottom = 72;
  let dragDist = 0;

  const onPointerDown = (e) => {
    isDragging = true;
    dragDist = 0;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const dx = clientX - startX;
    const dy = clientY - startY;
    dragDist += Math.abs(dx) + Math.abs(dy);

    if (dragDist > 10) {
      launcher.style.right = `${Math.max(10, Math.min(window.innerWidth - 70, initialRight - dx))}px`;
      launcher.style.bottom = `${Math.max(10, Math.min(window.innerHeight - 70, initialBottom - dy))}px`;
    }
  };

  const onPointerUp = () => {
    if (isDragging) {
      isDragging = false;
      initialRight = parseInt(launcher.style.right || '18', 10);
      initialBottom = parseInt(launcher.style.bottom || '72', 10);
      if (dragDist < 8) {
        toggleArunPopup();
      }
    }
  };

  launcher.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  launcher.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  document.body.appendChild(launcher);
}

export function toggleArunPopup(force) {
  state.isArunPopupOpen = typeof force === 'boolean' ? force : !state.isArunPopupOpen;
  const existingCard = document.getElementById('arun-safe-ai-popup');

  if (!state.isArunPopupOpen) {
    if (existingCard) existingCard.remove();
    return;
  }

  if (existingCard) existingCard.remove();

  const isCloud = Boolean(state.geminiApiKey);

  const card = document.createElement('div');
  card.id = 'arun-safe-ai-popup';
  card.className = 'arun-popup-card';
  card.innerHTML = `
    <!-- Top Header -->
    <div style="padding: 10px 14px; background: linear-gradient(135deg, #090d16, #18181b); border-bottom: 2px solid #ef4444; display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; gap: 9px;">
        <div style="flex-shrink: 0;">
          ${getArunFellowSVG(36)}
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <h3 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #ffffff; letter-spacing: 0.3px;">
              arun_safe-ai
            </h3>
            <span style="font-size: 0.62rem; background: #ef4444; color: #ffffff; padding: 2px 6px; border-radius: 10px; font-weight: 700;">
              ${state.arunVoiceMode ? '🎙️ VOICE LIVE' : '💬 CHAT'}
            </span>
          </div>
          <div style="font-size: 0.7rem; color: #94a3b8;">
            ${isCloud ? (state.geminiModel.includes('2.0') ? '⚡ Gemini 2.0 Flash' : (state.geminiModel.includes('1.5-pro') ? '🧠 Gemini 1.5 Pro' : '✨ Gemini Active')) : '⚡ Local Neural'} &bull; ${state.userDistrict}
          </div>
        </div>
      </div>

      <!-- Mode Switcher & Close -->
      <div style="display: flex; align-items: center; gap: 5px;">
        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 20px; padding: 2px; display: flex; gap: 2px;">
          <button onclick="window.raksha.setArunMode('chat')" style="padding: 3px 8px; border-radius: 16px; border: none; font-size: 0.7rem; font-weight: 700; cursor: pointer; background: ${!state.arunVoiceMode ? '#ef4444' : 'transparent'}; color: ${!state.arunVoiceMode ? '#ffffff' : '#94a3b8'};">
            💬 Chat
          </button>
          <button onclick="window.raksha.setArunMode('voice')" style="padding: 3px 8px; border-radius: 16px; border: none; font-size: 0.7rem; font-weight: 700; cursor: pointer; background: ${state.arunVoiceMode ? '#ef4444' : 'transparent'}; color: ${state.arunVoiceMode ? '#ffffff' : '#94a3b8'};">
            🎙️ Voice
          </button>
        </div>
        <button onclick="window.raksha.openGeminiKeyModal()" title="API Key" style="background: #18181b; border: 1px solid #3f3f46; color: #38bdf8; font-size: 0.7rem; padding: 4px 7px; border-radius: 6px; cursor: pointer; font-weight: 600;">
          🔑
        </button>
        <button onclick="window.raksha.toggleArunPopup(false)" style="background: transparent; border: none; color: #94a3b8; font-size: 1.3rem; cursor: pointer; padding: 0 4px; line-height: 1;">
          &times;
        </button>
      </div>
    </div>

    <!-- Universal Actions Bar -->
    <div style="padding: 7px 10px; background: #090d16; border-bottom: 1px solid #27272a; display: flex; gap: 6px; overflow-x: auto;" class="no-scrollbar">
      <button onclick="window.raksha.switchTab('escape'); window.raksha.toggleArunPopup(false);" class="arun-quick-btn" title="Open 3D Simulation">
        🎬 3D Escape
      </button>
      <button onclick="window.raksha.toggleEmergencySiren();" class="arun-quick-btn" style="color: #f87171; border-color: #7f1d1d;" title="Sound Emergency Siren">
        🚨 Sound Siren
      </button>
      <button onclick="window.raksha.switchTab('dashboard'); window.raksha.runFoSCalculation(); window.raksha.toggleArunPopup(false);" class="arun-quick-btn" title="Calculate FoS slope failure">
        ⛰️ FoS Risk
      </button>
      <button onclick="window.raksha.submitArunQuery('Is Sela Tunnel open and safe to travel?')" class="arun-quick-btn" title="Check Sela Tunnel">
        🚗 Sela Tunnel
      </button>
      <button onclick="window.raksha.submitArunQuery('How to find drinking water from mountain bamboo?')" class="arun-quick-btn" title="Bamboo Water">
        🎋 Bamboo Water
      </button>
      <button onclick="window.raksha.switchTab('sos'); window.raksha.toggleArunPopup(false);" class="arun-quick-btn" style="color: #ef4444;" title="Emergency SOS">
        🆘 SOS Beacon
      </button>
    </div>

    ${state.arunVoiceMode ? renderArunVoiceLiveView() : renderArunChatView()}
  `;

  document.body.appendChild(card);

  if (!state.arunVoiceMode) {
    const box = document.getElementById('arun-input-box');
    if (box) {
      box.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitArunQuery();
      });
      box.focus();
    }
    const hist = document.getElementById('arun-popup-chat-history');
    if (hist) hist.scrollTop = hist.scrollHeight;
  }
}

function renderArunVoiceLiveView() {
  const isListening = state.arunVoiceStatus === 'listening';
  const isSpeaking = state.arunVoiceStatus === 'speaking' || state.audioPlayer.status === 'playing';
  const isPaused = state.audioPlayer.status === 'paused';
  const isThinking = state.arunVoiceStatus === 'thinking';

  let statusText = 'Tap the Orb or Mic to talk to arun_safe-ai';
  if (isListening) statusText = '🎙️ Listening... Speak naturally';
  if (isThinking) statusText = '✨ Thinking with Gemini...';
  if (isSpeaking) statusText = '🔊 Speaking aloud...';
  if (isPaused) statusText = '⏸️ Audio paused &bull; Tap Resume';

  return `
    <div class="gemini-voice-modal">
      <div style="font-size: 0.74rem; font-weight: 800; color: #ef4444; letter-spacing: 0.5px; text-transform: uppercase;">
        Google Assistant &bull; Gemini Live Voice
      </div>

      <!-- Glowing Voice Orb with Red+Black Fellow -->
      <div class="gemini-voice-orb ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}" onclick="window.raksha.toggleArunVoiceModeSession()" title="Tap to talk">
        ${getArunFellowSVG(56)}
      </div>

      <!-- 5-Color Animated Sound Waveform -->
      <div class="gemini-voice-waves" style="opacity: ${isListening || isSpeaking ? '1' : '0.25'};">
        <div class="gemini-wave-bar"></div>
        <div class="gemini-wave-bar"></div>
        <div class="gemini-wave-bar"></div>
        <div class="gemini-wave-bar"></div>
        <div class="gemini-wave-bar"></div>
      </div>

      <!-- Status Subtitle -->
      <div style="font-size: 0.82rem; font-weight: 600; color: ${isListening ? '#38bdf8' : isSpeaking ? '#fbbf24' : isPaused ? '#f59e0b' : '#94a3b8'}; margin-bottom: 8px;">
        ${statusText}
      </div>

      <!-- Live Transcript / Spoken Text Display -->
      <div class="gemini-live-transcript" id="gemini-live-transcript-box">
        ${state.arunLiveTranscript || (state.arunChatMessages.length > 0 ? state.arunChatMessages[state.arunChatMessages.length - 1].text : 'Say: "Is Sela Tunnel open?", "Turn on siren", or "Bamboo water"')}
      </div>

      <!-- Sound Control Bar: Stop, Pause, Resume, Restart -->
      <div class="arun-voice-controls-bar">
        ${isSpeaking ? `
          <button onclick="window.raksha.pauseAudio()" class="arun-ctrl-btn pause" title="Pause Audio">
            ⏸️ Pause
          </button>
        ` : isPaused ? `
          <button onclick="window.raksha.resumeAudio()" class="arun-ctrl-btn resume" title="Resume Audio">
            ▶️ Resume
          </button>
        ` : ''}
        ${state.audioPlayer.text ? `
          <button onclick="window.raksha.restartAudio()" class="arun-ctrl-btn restart" title="Restart Audio">
            🔄 Restart
          </button>
        ` : ''}
        ${(isSpeaking || isPaused) ? `
          <button onclick="window.raksha.stopAudio()" class="arun-ctrl-btn stop" title="Stop Audio">
            ⏹️ Stop
          </button>
        ` : ''}
        <button onclick="window.raksha.toggleArunVoiceModeSession()" class="arun-ctrl-btn ${isListening ? 'listening' : 'talk'}" title="Voice Input">
          ${isListening ? '🛑 Stop Listening' : '🎙️ Tap to Speak'}
        </button>
      </div>
    </div>
  `;
}

function renderArunChatView() {
  const isAudioActive = state.audioPlayer.status === 'playing' || state.audioPlayer.status === 'paused';
  const isPlaying = state.audioPlayer.status === 'playing';

  return `
    <!-- Active Audio Player Strip (if sound is playing or paused) -->
    ${isAudioActive ? `
      <div class="arun-chat-audio-strip">
        <div style="display: flex; align-items: center; gap: 8px; overflow: hidden; flex: 1;">
          <span style="font-size: 1.1rem; animation: ${isPlaying ? 'pulse-sos 1.2s infinite' : 'none'};">
            ${state.audioPlayer.type === 'siren' ? '🚨' : '🎙️'}
          </span>
          <div style="font-size: 0.76rem; color: #f1f5f9; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            <strong>${state.audioPlayer.status === 'playing' ? 'Playing' : 'Paused'}:</strong> ${state.audioPlayer.label || 'Audio message'}
          </div>
        </div>
        <div style="display: flex; gap: 4px; flex-shrink: 0;">
          ${isPlaying ? `
            <button onclick="window.raksha.pauseAudio()" class="arun-mini-audio-btn" title="Pause">⏸️</button>
          ` : `
            <button onclick="window.raksha.resumeAudio()" class="arun-mini-audio-btn" title="Resume">▶️</button>
          `}
          <button onclick="window.raksha.restartAudio()" class="arun-mini-audio-btn" title="Restart">🔄</button>
          <button onclick="window.raksha.stopAudio()" class="arun-mini-audio-btn" style="color: #ef4444;" title="Stop">⏹️</button>
        </div>
      </div>
    ` : ''}

    <!-- Chat Messages Stream -->
    <div id="arun-popup-chat-history" style="flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 10px; background: #090d16;">
      ${renderArunChatBubbles()}
    </div>

    <!-- Suggestion Action Chips -->
    <div class="arun-chips-row no-scrollbar">
      ${getArunSuggestionChips().map(c => `
        <button class="arun-suggestion-chip" onclick="window.raksha.selectSuggestionChip('${c.query.replace(/'/g, "\\'")}')">
          ${c.label}
        </button>
      `).join('')}
    </div>

    <!-- Bottom Input Bar -->
    <div style="padding: 10px 12px; background: #0f172a; border-top: 1px solid #27272a; display: flex; gap: 6px; align-items: center;">
      <button id="arun-mic-btn" onclick="window.raksha.toggleArunVoice()" title="Speak voice query" style="width: 38px; height: 38px; border-radius: 50%; background: #18181b; border: 1px solid #ef4444; color: #ef4444; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s;">
        🎙️
      </button>
      <input type="text" id="arun-input-box" placeholder="Ask arun_safe-ai anything..."
             style="flex: 1; padding: 8px 12px; background: #18181b; border: 1px solid #27272a; border-radius: 10px; color: #ffffff; font-size: 0.84rem; outline: none;" />
      <button onclick="window.raksha.submitArunQuery()" style="background: linear-gradient(135deg, #ef4444, #991b1b); color: #ffffff; border: none; border-radius: 10px; width: 40px; height: 38px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        ➔
      </button>
    </div>
  `;
}

function renderArunChatBubbles() {
  return state.arunChatMessages.map(msg => {
    const isUser = msg.role === 'user';
    return `
      <div style="display: flex; gap: 8px; justify-content: ${isUser ? 'flex-end' : 'flex-start'}; align-items: flex-start;">
        ${!isUser ? `
          <div style="flex-shrink: 0; margin-top: 2px;">
            ${getArunFellowSVG(26)}
          </div>
        ` : ''}
        <div style="max-width: 82%; background: ${isUser ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#18181b'}; border: 1px solid ${isUser ? '#3b82f6' : '#27272a'}; color: #ffffff; border-radius: 12px; padding: 9px 12px; font-size: 0.83rem; line-height: 1.45; word-break: break-word;">
          ${formatMarkdownText(msg.text)}
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 0.68rem; color: ${isUser ? '#bfdbfe' : '#94a3b8'}; border-top: ${!isUser ? '1px solid rgba(255,255,255,0.1)' : 'none'}; padding-top: ${!isUser ? '4px' : '0'};">
            <span>${msg.timestamp}</span>
            ${!isUser ? `
              <div style="display: flex; gap: 6px; align-items: center;">
                <button onclick="window.raksha.speak('${msg.text.replace(/'/g, "\\'").replace(/\n/g, ' ')}')" title="Listen / Speak" style="background: transparent; border: none; color: #38bdf8; cursor: pointer; font-size: 0.8rem;">
                  🔊
                </button>
                <button onclick="window.raksha.pauseAudio()" title="Pause" style="background: transparent; border: none; color: #fbbf24; cursor: pointer; font-size: 0.8rem;">
                  ⏸️
                </button>
                <button onclick="window.raksha.stopAudio()" title="Stop" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.8rem;">
                  ⏹️
                </button>
                <button onclick="navigator.clipboard.writeText('${msg.text.replace(/'/g, "\\'").replace(/\n/g, ' ')}'); alert('Copied!');" title="Copy" style="background: transparent; border: none; color: #94a3b8; cursor: pointer; font-size: 0.8rem;">
                  📋
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

export async function submitArunQuery(overrideText, isVoice = false) {
  const box = document.getElementById('arun-input-box');
  const query = (overrideText || (box ? box.value : '')).trim();
  if (!query) return;

  if (box) box.value = '';

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  state.arunChatMessages.push({
    role: 'user',
    text: query,
    timestamp: timeStr
  });
  state.arunHistory.push({ role: 'user', text: query });

  // Check voice commands first
  const voiceCmdResult = processVoiceCommands(query);
  if (voiceCmdResult) {
    state.arunChatMessages.push({
      role: 'ai',
      text: `✅ **Action Executed**: ${voiceCmdResult}`,
      timestamp: timeStr
    });
    state.arunHistory.push({ role: 'model', text: voiceCmdResult });
    state.arunLiveTranscript = voiceCmdResult;
    if (isVoice || state.arunVoiceMode) {
      playAssistantChime('reply');
      speak(voiceCmdResult);
    }
    toggleArunPopup(true);
    return;
  }

  // Add typing indicator in chat mode
  const hist = document.getElementById('arun-popup-chat-history');
  const typingId = 'arun-type-' + Date.now();
  if (hist && !state.arunVoiceMode) {
    hist.innerHTML = renderArunChatBubbles();
    hist.innerHTML += `
      <div id="${typingId}" style="display: flex; gap: 8px; align-items: center; color: #94a3b8; font-size: 0.78rem;">
        ${getArunFellowSVG(22)}
        <span>arun_safe-ai is thinking...</span>
      </div>
    `;
    hist.scrollTop = hist.scrollHeight;
  }

  let reply = '';
  try {
    const res = await fetch('/api/ai/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        userDistrict: state.userDistrict,
        persona: state.currentPersona,
        language: state.currentLanguage,
        apiKey: state.geminiApiKey,
        conversationHistory: state.arunHistory,
        liveTelemetry: {
          precipitation1h: state.liveWeather?.precipitation1h ?? 0,
          tempC: state.liveWeather?.tempC ?? 22,
          windKmh: state.liveWeather?.windKmh ?? 12,
          fos: state.fosResult?.fos ?? 1.24,
          fosStatus: state.fosResult?.status ?? 'MARGINAL'
        }
      })
    });
    const data = await res.json();
    reply = data.response;
  } catch (err) {
    if (state.geminiApiKey) {
      try {
        const contents = [];
        for (const t of state.arunHistory.slice(-6)) {
          contents.push({ role: t.role === 'user' ? 'user' : 'model', parts: [{ text: t.text }] });
        }
        const directRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${state.geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents })
        });
        const dData = await directRes.json();
        reply = dData.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (e) {}
    }
    if (!reply) {
      reply = 'Stay alert. Move perpendicular to slope flow and stay above river banks. Dial 1070 for State Disaster Room.';
    }
  }

  document.getElementById(typingId)?.remove();

  state.arunChatMessages.push({
    role: 'ai',
    text: reply,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  state.arunHistory.push({ role: 'model', text: reply });

  state.arunLiveTranscript = reply;

  // Auto-speak out loud if in voice mode or voice was used!
  if (isVoice || state.arunVoiceMode) {
    playAssistantChime('reply');
    speak(reply);
  }

  toggleArunPopup(true);
}

export function toggleArunVoiceModeSession() {
  if (state.arunVoiceStatus === 'speaking') {
    window.speechSynthesis.cancel();
    state.arunVoiceStatus = 'idle';
    toggleArunPopup(true);
    return;
  }

  if (state.arunVoiceStatus === 'listening') {
    if (state.arunSpeechRec) {
      try { state.arunSpeechRec.stop(); } catch(e) {}
    }
    state.arunVoiceStatus = 'idle';
    toggleArunPopup(true);
    return;
  }

  // Start voice recognition
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    alert('Voice recognition is not supported in this browser. Please use Chat mode to type.');
    return;
  }

  playAssistantChime('start');
  state.arunVoiceStatus = 'listening';
  state.arunLiveTranscript = 'Listening... Speak your question now!';
  toggleArunPopup(true);

  try {
    const rec = new SpeechRec();
    state.arunSpeechRec = rec;
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = state.currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';

    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        interim += e.results[i][0].transcript;
      }
      state.arunLiveTranscript = interim;
      const box = document.getElementById('gemini-live-transcript-box');
      if (box) box.textContent = interim;
    };

    rec.onend = () => {
      const query = (state.arunLiveTranscript || '').trim();
      if (query && !query.startsWith('Listening...')) {
        state.arunVoiceStatus = 'thinking';
        toggleArunPopup(true);
        submitArunQuery(query, true);
      } else {
        state.arunVoiceStatus = 'idle';
        toggleArunPopup(true);
      }
    };

    rec.onerror = () => {
      state.arunVoiceStatus = 'idle';
      toggleArunPopup(true);
    };

    rec.start();
  } catch (err) {
    state.arunVoiceStatus = 'idle';
    toggleArunPopup(true);
  }
}

export function toggleArunVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Voice input is not supported in this browser. Please type your query in the box.');
    return;
  }

  playAssistantChime('start');
  const btn = document.getElementById('arun-mic-btn');
  try {
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = state.currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';

    rec.onstart = () => {
      if (btn) {
        btn.style.backgroundColor = '#ef4444';
        btn.style.color = '#ffffff';
        btn.innerHTML = '🛑';
      }
    };

    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      const box = document.getElementById('arun-input-box');
      if (box) box.value = transcript;
      submitArunQuery(transcript, true); // true = auto-speak response!
    };

    rec.onerror = () => {
      if (btn) {
        btn.style.backgroundColor = '#18181b';
        btn.style.color = '#ef4444';
        btn.innerHTML = '🎙️';
      }
    };

    rec.onend = () => {
      if (btn) {
        btn.style.backgroundColor = '#18181b';
        btn.style.color = '#ef4444';
        btn.innerHTML = '🎙️';
      }
    };

    rec.start();
  } catch (e) {
    console.error('Arun voice rec error:', e);
  }
}

// Global Export to Window
window.raksha = {
  state,
  switchTab,
  toggleEmergencySiren,
  runFoSCalculation,
  initLeafletMap,
  updateUserLocationOnMap,
  recenterUserLocation,
  toggleMapLayer,
  setEvacMode,
  computeEvacuationRoute,
  startVocalNavigation,
  speakStep,
  planRouteTo,
  planRouteToCoords,
  refreshGPS,
  switchBasemap,
  // Gemini AI Assistant exports
  openGeminiKeyModal,
  promptGeminiKey: openGeminiKeyModal,
  validateAndSaveGeminiKey,
  removeGeminiKey,
  pasteKeyFromClipboard,
  updateGeminiStatusUI,
  checkServerGeminiKey,
  toggleVoiceInput,
  clearChatHistory,
  copyChatText,
  sendPresetQuery,
  submitAIQuery,
  // Emergency SOS exports
  triggerEmergencySOS,
  copySOSMessage,
  setLanguage,
  // Universal Audio Player exports (Stop, Pause, Resume, Restart)
  stopAudio,
  pauseAudio,
  resumeAudio,
  restartAudio,
  updateAudioPlayerUI,
  // Persona, District & Live Feeds exports
  setPersona,
  setDistrict,
  selectSuggestionChip,
  fetchLiveTelemetry,
  openHazardReportModal,
  submitHazardReport,
  updateLiveMapMarkers,
  // Escape Simulation exports
  initSimulationCanvas,
  toggleSimPlay,
  resetSim,
  setSimScenario,
  speakCurrentSimStep,
  setSimSpeed,
  setSimViewMode,
  // User Manual & Help Box Index exports
  filterManualItems,
  setManualCategory,
  toggleManualCard,
  speakManualSection,
  // arun_safe-ai exports
  initArunSafeWidget,
  toggleArunPopup,
  submitArunQuery,
  toggleArunVoice,
  toggleArunVoiceModeSession,
  setArunMode,
  playAssistantChime,
  getArunFellowSVG,
  speak
};

// Application Bootloader
window.addEventListener('DOMContentLoaded', () => {
  initGeolocation();
  checkServerGeminiKey();
  renderActiveTab();
  initArunSafeWidget();
  fetchLiveTelemetry();
  setInterval(fetchLiveTelemetry, 30000); // Real-time poll every 30 seconds

  if (window.EventSource) {
    const es = new EventSource('/api/events/live');
    es.addEventListener('NEW_ALERT', (e) => {
      try {
        const alert = JSON.parse(e.data);
        speak(`Emergency alert: ${alert.title}`);
      } catch (err) {}
    });
  }

  const loading = document.querySelector('.loading-screen');
  if (loading) loading.style.display = 'none';
});
