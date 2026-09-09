import express from 'express';
import { db } from '../db/init.js';
import { broadcast } from '../index.js';

const router = express.Router();

// POST /api/sos/send
router.post('/send', (req, res) => {
  const { userId, location, medicalEmergency, priority, deviceInfo } = req.body;
  
  if (!location || !location.lat || !location.lng) {
    return res.status(400).json({ error: 'Location required' });
  }

  const stmt = db.prepare(`
    INSERT INTO sos_signals (user_id, lat, lng, medical_emergency, priority, device_info, status)
    VALUES (?, ?, ?, ?, ?, ?, 'active')
  `);

  try {
    const info = stmt.run(
      userId || 'anonymous',
      location.lat,
      location.lng,
      medicalEmergency ? 1 : 0,
      priority || 'HIGH',
      JSON.stringify(deviceInfo || {})
    );

    const sosId = info.lastInsertRowid;
    
    // Broadcast via WS for dashboard
    broadcast('NEW_SOS', { sosId, location, priority });

    res.status(201).json({ sosId, status: 'active', message: 'SOS broadcasted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save SOS signal' });
  }
});

// GET /api/sos/status/:sosId
router.get('/status/:sosId', (req, res) => {
  try {
    const sos = db.prepare('SELECT * FROM sos_signals WHERE id = ?').get(req.params.sosId);
    if (!sos) return res.status(404).json({ error: 'SOS not found' });
    res.json(sos);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/sos/acknowledge/:sosId
router.post('/acknowledge/:sosId', (req, res) => {
  const { responderId } = req.body;
  
  try {
    const info = db.prepare('UPDATE sos_signals SET status = ?, responder_id = ? WHERE id = ?')
      .run('acknowledged', responderId || 'system', req.params.sosId);
      
    if (info.changes === 0) return res.status(404).json({ error: 'SOS not found' });
    
    broadcast('SOS_ACKNOWLEDGED', { sosId: req.params.sosId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to acknowledge' });
  }
});

// GET /api/sos/active
router.get('/active', (req, res) => {
  try {
    const active = db.prepare("SELECT * FROM sos_signals WHERE status = 'active' OR status = 'acknowledged' ORDER BY timestamp DESC").all();
    res.json(active);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
