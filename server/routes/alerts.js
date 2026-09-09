import express from 'express';
import { db } from '../db/init.js';
import { broadcast } from '../index.js';

const router = express.Router();

// GET /api/alerts/active
router.get('/active', (req, res) => {
  try {
    const alerts = db.prepare('SELECT * FROM alerts WHERE status = ? ORDER BY created_at DESC').all('active');
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/alerts/create
router.post('/create', (req, res) => {
  const { title, description, type, severity, district, location } = req.body;

  const stmt = db.prepare(`
    INSERT INTO alerts (title, description, type, severity, district, lat, lng, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
  `);

  try {
    const info = stmt.run(title, description, type, severity, district, location?.lat, location?.lng);
    const alert = { id: info.lastInsertRowid, ...req.body, status: 'active', created_at: new Date().toISOString() };
    
    broadcast('NEW_ALERT', alert);
    res.status(201).json(alert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// PUT /api/alerts/:alertId/resolve
router.put('/:alertId/resolve', (req, res) => {
  try {
    const info = db.prepare('UPDATE alerts SET status = ? WHERE id = ?').run('resolved', req.params.alertId);
    if (info.changes === 0) return res.status(404).json({ error: 'Alert not found' });
    
    broadcast('ALERT_RESOLVED', { alertId: req.params.alertId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});

export default router;
