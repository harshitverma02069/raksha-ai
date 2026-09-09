import express from 'express';
import { db } from '../db/init.js';

const router = express.Router();

// Haversine distance mock for route calculation on backend
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// POST /api/evacuate/route
router.post('/route', (req, res) => {
  const { origin, destination } = req.body;
  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin and destination required' });
  }

  // Simplified backend routing simulation. In reality, use an offline router or real-time graph.
  const distance = getDistance(origin.lat, origin.lng, destination.lat, destination.lng);
  
  const route = {
    distance: distance.toFixed(2),
    estimatedTime: Math.round((distance / 30) * 60), // Assuming 30km/h avg speed in hilly terrain
    waypoints: [origin, destination],
    status: 'SAFE',
    warnings: []
  };

  if (distance > 100) {
    route.warnings.push('Long route. Refuel recommended.');
  }

  res.json(route);
});

// GET /api/evacuate/safe-zones
router.get('/safe-zones', (req, res) => {
  try {
    const zones = db.prepare('SELECT * FROM shelters WHERE capacity > current_occupancy').all();
    res.json(zones);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch safe zones' });
  }
});

// GET /api/evacuate/shelters/:districtId
router.get('/shelters/:districtId', (req, res) => {
  try {
    const shelters = db.prepare('SELECT * FROM shelters WHERE district = ?').all(req.params.districtId);
    res.json(shelters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shelters for district' });
  }
});

export default router;
