import React, { useContext } from 'react';
import { AppContext } from '../App';

export default function Dashboard() {
  const { currentRisk, userLocation } = useContext(AppContext);

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Risk Gauge */}
      <div className="card" style={{ backgroundColor: 'rgba(30,41,59,0.8)', padding: '24px', borderRadius: '12px', textAlign: 'center', border: '1px solid #334155' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: '#94a3b8' }}>Composite Risk Level</h2>
        <div style={{ position: 'relative', width: '200px', height: '100px', margin: '0 auto', overflow: 'hidden' }}>
          <svg viewBox="0 0 200 100" style={{ width: '100%', height: '100%' }}>
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#334155" strokeWidth="20" strokeLinecap="round" />
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={`url(#riskGradient)`} strokeWidth="20" strokeLinecap="round" strokeDasharray="251" strokeDashoffset={251 - (251 * currentRisk) / 100} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
            <defs>
              <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: 'absolute', bottom: '10px', width: '100%', textAlign: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
            {currentRisk}
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem' }}>Active Alerts</h3>
        <div style={{ display: 'flex', overflowX: 'auto', gap: '12px', paddingBottom: '8px' }}>
          {[
            { title: 'Flash Flood Warning', dist: 'Lower Subansiri', time: '10m ago', icon: '🌊', color: '#dc2626' },
            { title: 'Heavy Rainfall', dist: 'Papum Pare', time: '1h ago', icon: '🌧️', color: '#f97316' }
          ].map((alert, i) => (
            <div key={i} className="card alert-card" style={{ minWidth: '220px', padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(30,41,59,0.8)', borderLeft: `4px solid ${alert.color}`, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.5rem' }}>{alert.icon}</span>
                <span style={{ fontWeight: 'bold' }}>{alert.title}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>📍 {alert.dist} &bull; ⏱️ {alert.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Widget */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(30,41,59,0.8)', border: '1px solid #334155' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>28°C</div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Itanagar</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>12mm</div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Rainfall/hr</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0ea5e9' }}>45mm</div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>24h Accum</div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <button style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#dc2626', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '2rem' }}>🆘</span> Send SOS
        </button>
        <button style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(30,41,59,0.8)', color: '#e2e8f0', border: '1px solid #334155', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '2rem' }}>🏥</span> Nearest Hospital
        </button>
        <button style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(30,41,59,0.8)', color: '#e2e8f0', border: '1px solid #334155', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '2rem' }}>🛤️</span> Evac Route
        </button>
        <button style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(30,41,59,0.8)', color: '#e2e8f0', border: '1px solid #334155', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '2rem' }}>🩹</span> First Aid
        </button>
      </div>

      {/* District Card */}
      <div className="card" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(30,41,59,0.8)', border: '1px solid #334155' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem' }}>My District</h3>
        <p style={{ margin: '0 0 8px 0' }}><strong>Location:</strong> {userLocation ? `${userLocation.lat.toFixed(2)}, ${userLocation.lng.toFixed(2)}` : 'Detecting...'}</p>
        <p style={{ margin: '0 0 8px 0' }}><strong>Status:</strong> <span style={{ color: '#22c55e' }}>Moderate Risk</span></p>
        <p style={{ margin: '0 0 8px 0' }}><strong>NDRF Distance:</strong> 42km</p>
        <p style={{ margin: 0 }}><strong>Emergency:</strong> 112 / 1070</p>
      </div>
    </div>
  );
}
