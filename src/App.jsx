import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import MapView from './components/MapView';
import AlertsPanel from './components/AlertsPanel';
import SOSPanel from './components/SOSPanel';
import SurvivalGuide from './components/SurvivalGuide';
import LanguageSelector from './components/LanguageSelector';
import VoiceAssistant from './components/VoiceAssistant';
import './styles/main.css';

export const AppContext = React.createContext();

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [userLocation, setUserLocation] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [currentRisk, setCurrentRisk] = useState(25);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'map': return <MapView />;
      case 'alerts': return <AlertsPanel />;
      case 'sos': return <SOSPanel />;
      case 'guide': return <SurvivalGuide />;
      default: return <Dashboard />;
    }
  };

  return (
    <AppContext.Provider value={{ currentLanguage, userLocation, alerts, currentRisk }}>
      <div className="app-container" style={{ backgroundColor: '#0f172a', color: '#e2e8f0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="header-bar" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'linear-gradient(90deg, #0f172a, #1e293b)', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>रक्षा RAKSHA AI</h1>
            {isOffline && <div className="offline-dot" style={{ width: 8, height: 8, backgroundColor: '#dc2626', borderRadius: '50%', marginLeft: 8 }} />}
          </div>
          <button className="btn-ghost" onClick={() => setShowLanguageModal(true)} style={{ background: 'transparent', color: '#e2e8f0', border: '1px solid #334155', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}>
            🌐 {currentLanguage.toUpperCase()}
          </button>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>
          {renderTab()}
        </main>

        <VoiceAssistant />

        <nav className="nav-bar" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-around', backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', borderTop: '1px solid #1e293b', padding: '12px 0' }}>
          {[
            { id: 'dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'map', icon: '🗺️', label: 'Map' },
            { id: 'alerts', icon: '🚨', label: 'Alerts' },
            { id: 'sos', icon: '🆘', label: 'SOS' },
            { id: 'guide', icon: '📖', label: 'Guide' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ background: 'transparent', border: 'none', color: activeTab === tab.id ? '#dc2626' : '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              <span style={{ fontSize: '1.5rem', marginBottom: 4 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {showLanguageModal && (
          <LanguageSelector onClose={() => setShowLanguageModal(false)} onSelect={(lang) => { setCurrentLanguage(lang); setShowLanguageModal(false); }} />
        )}
      </div>
    </AppContext.Provider>
  );
}
