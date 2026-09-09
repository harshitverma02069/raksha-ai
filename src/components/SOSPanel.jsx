import React, { useState } from 'react';

export default function SOSPanel() {
  const [triage, setTriage] = useState('');
  const [headcount, setHeadcount] = useState(1);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSOS = () => {
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      setTimeout(() => setStatus('acknowledged'), 2000);
    }, 2000);
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      <h2 style={{ fontSize: '1.5rem', margin: 0, width: '100%', textAlign: 'left' }}>Emergency SOS</h2>

      <button 
        onClick={handleSOS}
        disabled={status !== 'idle'}
        className="sos-button"
        style={{ 
          width: '150px', height: '150px', borderRadius: '50%', 
          backgroundColor: '#dc2626', color: 'white', border: '8px solid rgba(220, 38, 38, 0.3)',
          fontSize: '2rem', fontWeight: 'bold', cursor: 'pointer',
          boxShadow: '0 0 30px rgba(220, 38, 38, 0.6)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          animation: status === 'idle' ? 'pulse-sos 2s infinite' : 'none',
          opacity: status !== 'idle' ? 0.7 : 1
        }}
      >
        {status === 'idle' ? 'SOS' : status.toUpperCase()}
      </button>

      {status !== 'idle' && (
        <div style={{ color: status === 'acknowledged' ? '#22c55e' : '#f97316', fontWeight: 'bold', textAlign: 'center' }}>
          {status === 'sending' && 'Transmitting over Mesh Network...'}
          {status === 'sent' && 'Message Sent. Waiting for ACK...'}
          {status === 'acknowledged' && 'Help is on the way. Stay calm.'}
        </div>
      )}

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>Medical Status</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {['Uninjured', 'Minor', 'Serious', 'Critical'].map(t => (
              <button 
                key={t} onClick={() => setTriage(t)}
                style={{ padding: '12px', borderRadius: '8px', background: triage === t ? '#dc2626' : 'rgba(30,41,59,0.8)', border: '1px solid #334155', color: 'white', cursor: 'pointer' }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>Number of People</label>
          <input 
            type="number" min="1" value={headcount} onChange={e => setHeadcount(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #475569', color: 'white', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>Additional Notes (Optional)</label>
          <textarea 
            rows="3" placeholder="Trapped under debris, need water..." value={notes} onChange={e => setNotes(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #475569', color: 'white', boxSizing: 'border-box' }}
          />
        </div>
      </div>
      
      {!navigator.onLine && (
        <div style={{ padding: '12px', backgroundColor: 'rgba(249, 115, 22, 0.2)', color: '#f97316', borderRadius: '8px', border: '1px solid #f97316', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' }}>
          ⚠️ You are offline. SOS will be transmitted via Bluetooth Mesh to nearby devices.
        </div>
      )}
    </div>
  );
}
