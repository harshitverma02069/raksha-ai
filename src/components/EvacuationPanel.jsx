import React, { useState } from 'react';

export default function EvacuationPanel() {
  const [mode, setMode] = useState('any');
  const [risk, setRisk] = useState(50);

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>🛣️</span> Route Planning
      </h2>

      <div className="card" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(30,41,59,0.8)', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="text" placeholder="Origin (Auto-detected)" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: 'white' }} />
          <select style={{ padding: '12px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: 'white' }}>
            <option>Nearest Safe Zone</option>
            <option>Relief Camp Alpha</option>
            <option>Civil Hospital</option>
          </select>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Mode of Transport</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['walk', 'vehicle', 'any'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: mode === m ? '#3b82f6' : 'rgba(30,41,59,0.8)', color: 'white', cursor: 'pointer', textTransform: 'capitalize' }}>
              {m === 'walk' ? '🚶 Walk' : m === 'vehicle' ? '🚗 Vehicle' : '🚁 Any'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '1rem', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Risk Tolerance</span>
          <span style={{ color: '#94a3b8' }}>{risk < 33 ? 'Safest' : risk > 66 ? 'Fastest' : 'Balanced'}</span>
        </h3>
        <input type="range" min="0" max="100" value={risk} onChange={(e) => setRisk(e.target.value)} style={{ width: '100%', accentColor: '#dc2626' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
          <span>Safest (Longer)</span>
          <span>Fastest (Riskier)</span>
        </div>
      </div>

      <button className="btn-primary" style={{ padding: '16px', borderRadius: '8px', background: '#dc2626', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>
        FIND ROUTE
      </button>

      <div className="card" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(30,41,59,0.8)', border: '1px solid #334155', marginTop: '10px' }}>
        <h3 style={{ margin: '0 0 12px 0' }}>Route Summary</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div><div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Distance</div><div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>14.2 km</div></div>
          <div><div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Time</div><div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>45 mins</div></div>
          <div><div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Risk</div><div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#22c55e' }}>Low</div></div>
        </div>
        
        <ul style={{ paddingLeft: '20px', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '20px' }}>
          <li style={{ marginBottom: '8px' }}>Head North on NH-15 for 5km</li>
          <li style={{ marginBottom: '8px' }}>Turn right onto Sector 4 road (Avoid flooded underpass)</li>
          <li style={{ marginBottom: '8px' }}>Arrive at Relief Camp Alpha</li>
        </ul>

        <button style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#22c55e', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <span>🔊</span> START NAVIGATION
        </button>
      </div>
    </div>
  );
}
