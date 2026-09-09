import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { db } from './db/init.js';

import hazardRoutes from './routes/hazard.js';
import evacuateRoutes from './routes/evacuation.js';
import sosRoutes from './routes/sos.js';
import alertsRoutes from './routes/alerts.js';

const app = express();
const port = process.env.PORT || 3001;
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Make wss available to routes
app.set('wss', wss);

// Mount routes
app.use('/api/hazard', hazardRoutes);
app.use('/api/evacuate', evacuateRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/alerts', alertsRoutes);

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');
  
  // Send active alerts on connection
  const activeAlerts = db.prepare('SELECT * FROM alerts WHERE status = ?').all('active');
  ws.send(JSON.stringify({ type: 'ACTIVE_ALERTS', payload: activeAlerts }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);
      // Handle incoming WS messages if needed
    } catch (e) {
      console.error('Failed to parse WS message:', e);
    }
  });
});

// Broadcast helper
export const broadcast = (type, payload) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify({ type, payload }));
    }
  });
};

// Periodic hazard updates simulation (every 30 seconds)
setInterval(() => {
  console.log('Broadcasting periodic hazard update...');
  // In a real app, this would query updated ML models or weather APIs
  const update = {
    districtId: 'Tawang',
    riskScore: Math.floor(Math.random() * 40) + 60, // Simulate elevated risk
    timestamp: new Date().toISOString()
  };
  broadcast('HAZARD_UPDATE', update);
}, 30000);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    db.close();
    process.exit(0);
  });
});

server.listen(port, () => {
  console.log(`RAKSHA AI server running on port ${port}`);
});
