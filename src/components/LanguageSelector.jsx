import React from 'react';

export default function LanguageSelector({ onClose, onSelect }) {
  const languages = [
    { code: 'en', name: 'English', native: 'English', tier: 'Primary' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', tier: 'Primary' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া', tier: 'Regional' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', tier: 'Regional' },
    { code: 'ny', name: 'Nyishi', native: 'Nyishi', tier: 'Local (Arunachal)' },
    { code: 'ad', name: 'Adi', native: 'Adi', tier: 'Local (Arunachal)' },
    { code: 'ap', name: 'Apatani', native: 'Apatani', tier: 'Local (Arunachal)' }
  ];

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="modal-content" style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '400px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Select Language</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', maxHeight: '60vh', overflowY: 'auto' }}>
          {languages.map(lang => (
            <button 
              key={lang.code}
              onClick={() => onSelect(lang.code)}
              style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{lang.native}</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{lang.name}</span>
              </div>
              <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '12px' }}>{lang.tier}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
