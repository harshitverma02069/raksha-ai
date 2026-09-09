import React, { useState } from 'react';

export default function AlertsPanel() {
  const [filter, setFilter] = useState('All');

  const alerts = [
    { id: 1, type: 'Flood', severity: 'CRITICAL', title: 'Siang River Overflowing', desc: 'Water levels above danger mark. Immediate evacuation recommended for low-lying areas.', district: 'East Siang', time: '10 mins ago', color: '#dc2626' },
    { id: 2, type: 'Landslide', severity: 'HIGH', title: 'Highway Blocked', desc: 'NH-415 blocked near Karsingsa due to massive landslide. Avoid travel.', district: 'Papum Pare', time: '1 hour ago', color: '#f97316' },
    { id: 3, type: 'Earthquake', severity: 'MODERATE', title: 'Tremor Detected', desc: 'Magnitude 4.2 earthquake detected. Stay alert for aftershocks.', district: 'Tawang', time: '3 hours ago', color: '#eab308' }
  ];

  const filteredAlerts = filter === 'All' ? alerts : alerts.filter(a => a.type === filter);

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>🚨</span> Disaster Alerts
      </h2>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['All', 'Earthquake', 'Landslide', 'Flood'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #334155', background: filter === f ? '#e2e8f0' : 'rgba(30,41,59,0.8)', color: filter === f ? '#0f172a' : '#e2e8f0', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 'bold' }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredAlerts.map(alert => (
          <div key={alert.id} className="card" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(30,41,59,0.8)', borderLeft: `6px solid ${alert.color}`, borderTop: '1px solid #334155', borderRight: '1px solid #334155', borderBottom: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge" style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '12px', backgroundColor: alert.color, color: 'white', fontWeight: 'bold' }}>{alert.severity}</span>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{alert.time}</span>
              </div>
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{alert.title}</h3>
            <p style={{ margin: '0 0 12px 0', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.4' }}>{alert.desc}</p>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>📍</span> {alert.district}
            </div>
          </div>
        ))}
        {filteredAlerts.length === 0 && (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '32px' }}>No active alerts for this category.</div>
        )}
      </div>
    </div>
  );
}
