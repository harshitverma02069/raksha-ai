import express from 'express';
import { db } from '../db/init.js';

const router = express.Router();

const districts = [
  'Tawang', 'West Kameng', 'East Kameng', 'Papum Pare', 'Kurung Kumey',
  'Kra Daadi', 'Lower Subansiri', 'Upper Subansiri', 'West Siang',
  'East Siang', 'Siang', 'Upper Siang', 'Lower Siang', 'Lower Dibang Valley',
  'Dibang Valley', 'Anjaw', 'Lohit', 'Namsai', 'Changlang', 'Tirap',
  'Longding', 'Pakke Kessang', 'Lepa Rada', 'Shi Yomi', 'Kamle', 'Itanagar Capital Complex',
  'Namsai', 'Bichar'
];

// Mock generator for risk levels
const getRiskScore = (district) => {
  // Simulate higher risk for certain districts
  const highRisk = ['Tawang', 'Dibang Valley', 'Anjaw', 'East Siang'];
  let baseScore = highRisk.includes(district) ? 50 : 20;
  return Math.min(100, Math.floor(baseScore + Math.random() * 40));
};

const getRiskLevel = (score) => {
  if (score > 80) return 'CRITICAL';
  if (score > 60) return 'HIGH';
  if (score > 40) return 'MODERATE';
  return 'LOW';
};

// GET /api/hazard/current
router.get('/current', (req, res) => {
  const currentRisk = districts.map(district => {
    const score = getRiskScore(district);
    return {
      districtId: district,
      riskScore: score,
      riskLevel: getRiskLevel(score),
      hazards: {
        landslide: score > 70 ? 'High' : 'Low',
        flood: district.includes('Siang') && score > 60 ? 'High' : 'Low',
        earthquake: 'Moderate' // Default for AP
      },
      lastUpdated: new Date().toISOString()
    };
  });
  res.json(currentRisk);
});

// GET /api/hazard/forecast/:districtId
router.get('/forecast/:districtId', (req, res) => {
  const { districtId } = req.params;
  const forecast = {
    '24h': { riskLevel: 'MODERATE', precipitation: '45mm' },
    '48h': { riskLevel: 'HIGH', precipitation: '120mm' },
    '72h': { riskLevel: 'CRITICAL', precipitation: '210mm' }
  };
  res.json({ districtId, forecast });
});

// POST /api/hazard/report
router.post('/report', (req, res) => {
  const { type, location, severity, description } = req.body;
  const stmt = db.prepare(`
    INSERT INTO hazard_events (type, lat, lng, severity, description, status)
    VALUES (?, ?, ?, ?, ?, 'reported')
  `);
  
  try {
    const info = stmt.run(type, location.lat, location.lng, severity, description);
    res.status(201).json({ id: info.lastInsertRowid, message: 'Report submitted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save report' });
  }
});

// GET /api/hazard/history
router.get('/history', (req, res) => {
  try {
    const events = db.prepare('SELECT * FROM hazard_events ORDER BY reported_at DESC LIMIT 50').all();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
