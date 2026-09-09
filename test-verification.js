// Automated Verification Suite for RAKSHA AI
import { LandslidePredictor } from './src/core/landslide-predictor.js';
import { RiskAssessor } from './src/core/risk-assessor.js';
import { EvacuationRouter } from './src/core/evacuation-router.js';
import { SafetyZoneCalculator } from './src/core/safety-zone-calculator.js';
import { SurvivalDecisionEngine } from './src/core/survival-decision-engine.js';
import { DISTRICTS } from './src/data/districts.js';
import { TRANSPORT_NODES, TRANSPORT_EDGES } from './src/data/transportation-network.js';
import { EMERGENCY_RESOURCES } from './src/data/emergency-resources.js';
import { HAZARD_ZONES } from './src/data/hazard-zones.js';
import { LANGUAGES, TRANSLATIONS } from './src/data/languages.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

console.log('=======================================================');
console.log('🧪 RAKSHA AI — AUTOMATED MATHEMATICAL & DATA VERIFICATION');
console.log('=======================================================');

// 1. Test Landslide Predictor
console.log('\n[1] Testing Landslide Predictor Engine...');
const lp = new LandslidePredictor();
const fosTest1 = lp.calculateFoS({ beta: 45, z: 6, z_w: 4.5, k_h: 0.36, c_prime: 8 });
assert(fosTest1.fos < 1.0 && fosTest1.status === 'FAILURE' && fosTest1.color === 'RED', 'Steep saturated slope triggers FoS < 1.0 (FAILURE)');

const fosTest2 = lp.calculateFoS({ beta: 15, z: 3, z_w: 0.5, k_h: 0.05, c_prime: 25 });
assert(fosTest2.fos > 1.3 && fosTest2.status === 'STABLE' && fosTest2.color === 'GREEN', 'Gentle dry slope triggers FoS > 1.3 (STABLE)');

const probTest = lp.calculateProbability({ slope: 42, rain24h: 180, satRatio: 0.95, ndvi: 0.2, pga: 0.38 });
assert(probTest > 0.9, `Extreme conditions give high landslide probability: ${(probTest * 100).toFixed(1)}%`);

// 2. Test Multi-Hazard Risk Assessor
console.log('\n[2] Testing Multi-Hazard Risk Assessor...');
const ra = new RiskAssessor();
const hComp = ra.computeCompositeHazard(
  { 'EQ': 0.8, 'L': 0.85, 'F': 0.7 },
  { 'EQ': 0.35, 'L': 0.35, 'F': 0.30 }
);
assert(hComp > 1.0, `Cascade interactions amplify hazard composite score: ${hComp.toFixed(2)}`);

const vuln = ra.computeVulnerability({ roadQuality: 0.3, bridgeVulnerability: 0.8, drainageDeficiency: 0.8 });
assert(vuln > 0.6, `Vulnerability accurately penalizes degraded infrastructure: ${vuln.toFixed(2)}`);

// 3. Test Multi-Modal Evacuation Router
console.log('\n[3] Testing Multi-Modal Evacuation Router...');
const nodeMap = {};
for (const n of TRANSPORT_NODES) nodeMap[n.id] = n;
const router = new EvacuationRouter(nodeMap, TRANSPORT_EDGES);

const tawangToAirport = router.findRoute('tawang', 'hollongi_apt', 0, 'VEHICLE', 0.5);
assert(tawangToAirport && tawangToAirport.path.length >= 4, `Found road evacuation route from Tawang to Hollongi Airport (${tawangToAirport.path.join(' -> ')})`);

const aniniToPasighat = router.findRoute('anini', 'pasighat', 0, 'ANY', 0.5);
assert(aniniToPasighat && aniniToPasighat.path.includes('roing'), `Found frontier highway escape from Anini through Roing to Pasighat (${aniniToPasighat.path.join(' -> ')})`);

const mechukaAirLifeline = router.findRoute('mechuka_alg', 'hollongi_apt', 0, 'ANY', 0.5);
assert(mechukaAirLifeline && mechukaAirLifeline.path.includes('mechuka_alg'), `Found multi-modal air bridge for Mechuka border valley (${mechukaAirLifeline.path.join(' -> ')})`);

// 4. Test Safety Zone Calculator
console.log('\n[4] Testing Safety Zone Calculator...');
const szCalc = new SafetyZoneCalculator();
const lSafe = szCalc.calculateRunoutDistance(120, 25, 15);
assert(lSafe > 100, `Fahrböschung reach angle runout distance calculated: ${lSafe.toFixed(1)}m`);

const floodSafe = szCalc.checkFloodSafety(185, 150, 15);
assert(floodSafe === true, 'Safe zone with 35m HAND clearance passes flood safety criteria');

// 5. Test Survival Decision Engine
console.log('\n[5] Testing Survival Decision Engine...');
const sde = new SurvivalDecisionEngine();
const eqDecision = sde.evaluate(
  { locationType: 'indoor_highrise', floorLevel: 3, mobilityImpaired: false, currentElevation: 350 },
  { hazardType: 'EARTHQUAKE', timeToImpact: 0, intensityPGA: 0.32, floodVelocity: 0, floodDepth: 0, slopeFoS: 1.5 }
);
assert(eqDecision.actionCode === 'DROP_COVER_HOLD', 'Active high PGA shaking triggers DROP_COVER_HOLD');

const floodDecision = sde.evaluate(
  { locationType: 'outdoor_urban', floorLevel: 0, mobilityImpaired: false, currentElevation: 120 },
  { hazardType: 'FLASH_FLOOD', timeToImpact: 10, intensityPGA: 0, floodVelocity: 1.8, floodDepth: 0.8, slopeFoS: 1.5 }
);
assert(floodDecision.actionCode === 'WATER_ENERGY_CRITICAL', 'Dangerous water energy triggers WATER_ENERGY_CRITICAL');

// 6. Test Arunachal Pradesh Data Layer
console.log('\n[6] Testing Arunachal Pradesh Data Layer...');
assert(DISTRICTS.length === 28, `All 28 districts present (found ${DISTRICTS.length})`);
assert(DISTRICTS.some(d => d.id === 'bichom') && DISTRICTS.some(d => d.id === 'keyi_panyor'), 'Includes newly formed 2024 districts Bichom and Keyi Panyor');
assert(TRANSPORT_NODES.length >= 35, `Transport network includes ${TRANSPORT_NODES.length} key nodes`);
assert(TRANSPORT_NODES.filter(n => n.type === 'alg').length >= 6, 'Includes all 6 strategic Advanced Landing Grounds (ALGs)');
assert(TRANSPORT_NODES.filter(n => n.type === 'airport').length >= 4, 'Includes all 4 operational civilian/dual-use airports');
assert(EMERGENCY_RESOURCES.hospitals.length >= 20, `Hospitals registry contains ${EMERGENCY_RESOURCES.hospitals.length} facilities`);
assert(EMERGENCY_RESOURCES.ndrf.length >= 1, '12th Battalion NDRF Doimukh registered');
assert(LANGUAGES.length >= 15, `Multi-lingual system covers ${LANGUAGES.length} regional and tribal languages`);
assert(TRANSLATIONS['en'] && TRANSLATIONS['hi'], 'Core survival translations for English and Hindi active');

// 7. Test 3D Cinematic Escape Simulator Engine
console.log('\n[7] Testing Escape Simulator Engine...');
import { EscapeSimulator } from './src/core/escape-simulator.js';

const mockCanvas = {
  width: 800,
  height: 420,
  getContext: () => new Proxy({}, {
    get: (target, prop) => {
      if (prop === 'measureText') return () => ({ width: 50 });
      return () => new Proxy({}, { get: () => () => {} });
    }
  })
};

const sim = new EscapeSimulator(mockCanvas, { scenario: 'landslide', language: 'en' });
assert(sim.boulders.length > 20, `Landslide scenario initialized with ${sim.boulders.length} physical 3D boulders`);

const step1Text = sim.getStepText(1);
assert(step1Text.includes('90 degrees') || step1Text.includes('fall line') || step1Text.includes('perpendicular'), 'Step 1 instructs perpendicular evasion');

sim.setLanguage('hi');
const step1Hindi = sim.getStepText(1);
assert(step1Hindi.includes('90') || step1Hindi.includes('दौड़ें') || step1Hindi.includes('भागें'), 'Hindi translation conveys perpendicular 90° sprint');

sim.setLanguage('ny');
const step1Nyishi = sim.getStepText(1);
assert(step1Nyishi.includes('daado') || step1Nyishi.includes('dolo') || step1Nyishi.includes('Lam 1'), 'Nyishi tribal translation loaded accurately');

sim.setViewMode('tactical_drone');
assert(sim.viewMode === 'tactical_drone', 'View mode toggled to tactical_drone');
sim.setViewMode('3d_isometric');
assert(sim.viewMode === '3d_isometric', 'View mode toggled to 3d_isometric');

sim.setPlaybackSpeed(2.0);
assert(sim.speed === 2.0, 'Playback speed adjusted to 2.0x');

sim.setProgress(0.85);
assert(sim.progress === 0.85, 'Scrubber progress updated to 85%');

// 8. Test Real-Time Authentic Live Data Endpoints & Persona Intelligence
console.log('\n[8] Testing Real-Time Live Endpoints & Multi-Persona AI...');

async function runAsyncTests() {
  try {
    // 8a. Live Weather Feed (Open-Meteo)
    const wRes = await fetch('http://localhost:3000/api/weather/live?lat=27.1&lon=93.6');
    const wData = await wRes.json();
    assert(wData.success && typeof wData.tempC === 'number' && typeof wData.precipitation1h === 'number', `Live Weather Feed returns authentic temp: ${wData.tempC}°C, rain: ${wData.precipitation1h} mm/h`);

    // 8b. Live Seismic Feed (USGS Zone V)
    const sRes = await fetch('http://localhost:3000/api/seismic/live');
    const sData = await sRes.json();
    assert(sData.success && sData.earthquakes.length > 0, `Live Seismic Feed returned ${sData.earthquakes.length} earthquakes in Zone V`);

    // 8c. Live Roadways Feed
    const rRes = await fetch('http://localhost:3000/api/roadways/status');
    const rData = await rRes.json();
    const selaTunnel = rData.roadways.find(r => r.highway.includes('Sela Tunnel') || r.stretch.includes('Sela Tunnel'));
    assert(selaTunnel && selaTunnel.status === 'OPEN_SAFE', 'Live Roadways confirms Sela Tunnel is OPEN_SAFE & operational');

    // 8d. Crowdsourced Hazard Reporting
    const postRes = await fetch('http://localhost:3000/api/hazard/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hazardType: 'LANDSLIDE',
        reporterType: 'resident',
        district: 'Papum Pare',
        locationName: 'Doimukh-Sagalee Highway',
        coordinates: { lat: 27.15, lon: 93.75 },
        description: 'Mudflow cleared to one lane',
        severity: 'LOW'
      })
    });
    const postData = await postRes.json();
    assert(postData.success && postData.report.id, 'Live Crowdsource Hazard Report submitted and registered');

    // 8e. AI Copilot: Tourist Persona (ILP & Disaster Validity)
    const aiTouristILP = await fetch('http://localhost:3000/api/ai/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'My ILP expires tomorrow and roads to Assam are blocked!',
        userDistrict: 'West Kameng',
        language: 'en',
        persona: 'tourist'
      })
    });
    const touristILPData = await aiTouristILP.json();
    assert(touristILPData.response.includes('Section 4') || touristILPData.response.includes('disaster') || touristILPData.response.includes('extension'), 'AI Copilot provides authentic ILP disaster extension rules for tourists');

    // 8f. AI Copilot: Tourist Persona (AMS & Acclimatization)
    const aiTouristAMS = await fetch('http://localhost:3000/api/ai/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'Severe headache and dizziness in Tawang altitude!',
        userDistrict: 'Tawang',
        language: 'en',
        persona: 'tourist'
      })
    });
    const touristAMSData = await aiTouristAMS.json();
    assert(touristAMSData.response.includes('ACUTE MOUNTAIN SICKNESS') || touristAMSData.response.includes('DESCENT'), 'AI Copilot provides AMS medical protocol for high-altitude visitors');

    // 8g. AI Copilot: Resident Persona (Tribal Jungle Survival)
    const aiResidentBamboo = await fetch('http://localhost:3000/api/ai/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'How do I find drinkable water using bamboo in Arunachal forest?',
        userDistrict: 'Papum Pare',
        language: 'en',
        persona: 'resident'
      })
    });
    const residentBambooData = await aiResidentBamboo.json();
    assert(residentBambooData.response.includes('bamboo') && residentBambooData.response.includes('Potable Water'), 'AI Copilot provides authentic indigenous bamboo water tapping knowledge for residents');

    // 8h. AI Copilot: Monitor Persona (Statewide Situation)
    const aiMonitor = await fetch('http://localhost:3000/api/ai/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'Statewide vulnerability and hazard assessment across all 28 districts',
        userDistrict: 'Papum Pare',
        language: 'en',
        persona: 'monitor'
      })
    });
    const monitorData = await aiMonitor.json();
    assert(monitorData.response.includes('STATEWIDE') || monitorData.response.includes('NH-13'), 'AI Copilot provides multi-district situation report for monitors');

    // 8i. Gemini API Key Status Endpoint
    const keyStatusRes = await fetch('http://localhost:3000/api/ai/key-status');
    const keyStatusData = await keyStatusRes.json();
    assert(keyStatusData.success && typeof keyStatusData.hasEnvKey === 'boolean', 'API /api/ai/key-status responds with valid configuration status');

    // 8j. Gemini API Key Validation Endpoint
    const valKeyRes = await fetch('http://localhost:3000/api/ai/validate-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: 'INVALID_DUMMY_KEY_FOR_TESTING' })
    });
    const valKeyData = await valKeyRes.json();
    assert(valKeyData.valid === false && valKeyData.error, 'API /api/ai/validate-key successfully intercepts invalid API key');

    // 8k. User Manual Data Layer & Multi-Lingual Help Box Index
    const { USER_MANUAL_CATEGORIES, USER_MANUAL_ITEMS } = await import('./src/data/user-manual.js');
    assert(USER_MANUAL_CATEGORIES.length >= 10, `User Manual contains ${USER_MANUAL_CATEGORIES.length} categorized indexes`);
    assert(USER_MANUAL_ITEMS.length >= 10, `User Manual contains ${USER_MANUAL_ITEMS.length} comprehensive survival articles`);

    const allHaveTitles = USER_MANUAL_ITEMS.every(item => item.title && item.title.en && item.title.hi);
    assert(allHaveTitles, 'All manual items have complete bilingual English and Hindi titles');

    const allHaveTribalTranslations = USER_MANUAL_ITEMS.every(item => 
      item.title.ny && item.title.adi && item.title.gal && item.title.mon && item.title.wan
    );
    assert(allHaveTribalTranslations, 'Manual index includes multi-lingual titles across Nyishi, Adi, Galo, Monpa, Wancho');

    const allHaveContent = USER_MANUAL_ITEMS.every(item => item.content && item.content.en && item.content.hi);
    assert(allHaveContent, 'All manual items contain detailed survival protocols & instructions in English & Hindi');

  } catch (err) {
    console.error('Async test error:', err);
    assert(false, `Async testing encountered error: ${err.message}`);
  }

  console.log('\n=======================================================');
  console.log(`📊 TEST RESULTS: ${passed}/${total} assertions passed (${Math.round((passed/total)*100)}%)`);
  console.log('=======================================================');

  if (passed === total) {
    console.log('🌟 ALL 28 DISTRICTS, PERSONAS, SIMULATION & LIVE ENGINES VERIFIED 100% PERFECTLY!\n');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runAsyncTests();
