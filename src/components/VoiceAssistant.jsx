import React, { useState, useEffect } from 'react';

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      processCommand(text);
    };

    recognition.onerror = (e) => {
      console.error(e);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const processCommand = (text) => {
    const lower = text.toLowerCase();
    let reply = "I didn't catch that. Say 'nearest shelter' or 'send SOS'.";
    
    if (lower.includes('shelter') || lower.includes('safe')) {
      reply = "The nearest safe zone is Relief Camp Alpha, 5 kilometers away. Calculating route.";
    } else if (lower.includes('sos') || lower.includes('help')) {
      reply = "Triggering emergency SOS protocol.";
    } else if (lower.includes('risk')) {
      reply = "Your current risk level is moderate. No immediate action required.";
    }

    speak(reply);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
      {transcript && (
        <div style={{ backgroundColor: 'rgba(15,23,42,0.9)', padding: '8px 12px', borderRadius: '16px', border: '1px solid #3b82f6', color: 'white', maxWidth: '200px', fontSize: '0.85rem' }}>
          "{transcript}"
        </div>
      )}
      <button 
        onClick={startListening}
        style={{ 
          width: '60px', height: '60px', borderRadius: '50%', backgroundColor: isListening ? '#ef4444' : '#3b82f6', 
          color: 'white', border: 'none', fontSize: '1.5rem', cursor: 'pointer', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          animation: isListening ? 'pulse-sos 1s infinite' : 'none'
        }}
      >
        🎙️
      </button>
    </div>
  );
}
