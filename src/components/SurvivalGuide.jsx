import React, { useState } from 'react';

export default function SurvivalGuide() {
  const [activeTab, setActiveTab] = useState('active');
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Survival Guide</h2>

      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
        {['active', 'prep', 'firstaid'].map(tab => (
          <button 
            key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: '8px 16px', background: 'transparent', border: 'none', borderBottom: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent', color: activeTab === tab ? '#3b82f6' : '#94a3b8', cursor: 'pointer', textTransform: 'capitalize', fontWeight: 'bold' }}
          >
            {tab === 'active' ? 'Active AI' : tab === 'prep' ? 'Preparation' : 'First Aid'}
          </button>
        ))}
      </div>

      <div style={{ overflowY: 'auto' }}>
        {activeTab === 'active' && (
          <div className="card" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '2rem' }}>🤖</span>
              <div>
                <h3 style={{ margin: 0, color: '#60a5fa' }}>AI Recommendation</h3>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Based on your location & risk</div>
              </div>
            </div>
            <p style={{ margin: '0 0 16px 0', lineHeight: '1.5' }}>Heavy rainfall detected. Landslide risk is elevated in your current area (Sector 4). Avoid steep slopes and remain indoors if possible.</p>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#e2e8f0', lineHeight: '1.6' }}>
              <li>Move to higher ground if on a slope.</li>
              <li>Pack essential documents in waterproof bags.</li>
              <li>Keep phone charged and save battery.</li>
            </ul>
          </div>
        )}

        {activeTab === 'prep' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { title: 'Earthquake Readiness', icon: '🫨', content: 'Drop, Cover, and Hold On. Keep a Go-Bag ready with 3 days of food, water, and meds. Secure heavy furniture to walls.' },
              { title: 'Flood Evacuation', icon: '🌊', content: 'Move to higher ground. Do not walk or drive through floodwaters. Disconnect electrical appliances.' },
              { title: 'Landslide Warning Signs', icon: '⛰️', content: 'Listen for unusual sounds like trees cracking. Watch for sudden changes in water flow in streams. Move away from the path quickly.' }
            ].map((item, index) => (
              <div key={index} className="card" style={{ backgroundColor: 'rgba(30,41,59,0.8)', border: '1px solid #334155', borderRadius: '8px', overflow: 'hidden' }}>
                <button onClick={() => toggleAccordion(index)} style={{ width: '100%', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}>
                  <span>{item.icon} {item.title}</span>
                  <span>{openAccordion === index ? '▲' : '▼'}</span>
                </button>
                {openAccordion === index && (
                  <div style={{ padding: '0 16px 16px 16px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'firstaid' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            <div className="card" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(30,41,59,0.8)', border: '1px solid #334155' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#f87171' }}>🩸 Severe Bleeding</h4>
              <ol style={{ margin: 0, paddingLeft: '20px', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <li>Apply direct pressure with a clean cloth.</li>
                <li>Maintain pressure for 10 minutes continuously.</li>
                <li>If bleeding soaks through, add more cloth (do not remove the first).</li>
                <li>Elevate the injured area above the heart if possible.</li>
              </ol>
            </div>
            <div className="card" style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(30,41,59,0.8)', border: '1px solid #334155' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#f87171' }}>🦴 Fractures</h4>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>Immobilize the injured area. Do not try to realign the bone. Apply a cold pack wrapped in cloth. Seek medical help.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
