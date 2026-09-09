import React, { useContext, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline, Polygon } from 'react-leaflet';
import { AppContext } from '../App';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leafet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const myIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapView() {
  const { userLocation } = useContext(AppContext);
  const [layers, setLayers] = useState({ hazard: true, transport: true, emergency: true, safeZones: true });

  const toggleLayer = (layer) => setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));

  const defaultCenter = [28.2, 94.7];
  const center = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;

  const floodPolygon = [[28.1, 94.6], [28.15, 94.65], [28.12, 94.7]];
  const roadPolyline = [[28.0, 94.5], [28.1, 94.6], [28.2, 94.7]];

  return (
    <div className="map-container" style={{ height: 'calc(100vh - 140px)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button onClick={() => toggleLayer('hazard')} style={{ background: layers.hazard ? '#dc2626' : 'rgba(30,41,59,0.8)', color: 'white', padding: '8px 12px', borderRadius: '4px', border: '1px solid #334155', cursor: 'pointer' }}>⚠️ Hazards</button>
        <button onClick={() => toggleLayer('transport')} style={{ background: layers.transport ? '#3b82f6' : 'rgba(30,41,59,0.8)', color: 'white', padding: '8px 12px', borderRadius: '4px', border: '1px solid #334155', cursor: 'pointer' }}>🛣️ Transport</button>
        <button onClick={() => toggleLayer('emergency')} style={{ background: layers.emergency ? '#f97316' : 'rgba(30,41,59,0.8)', color: 'white', padding: '8px 12px', borderRadius: '4px', border: '1px solid #334155', cursor: 'pointer' }}>🏥 Emergency</button>
        <button onClick={() => toggleLayer('safeZones')} style={{ background: layers.safeZones ? '#22c55e' : 'rgba(30,41,59,0.8)', color: 'white', padding: '8px 12px', borderRadius: '4px', border: '1px solid #334155', cursor: 'pointer' }}>✅ Safe Zones</button>
      </div>

      <MapContainer center={center} zoom={7} style={{ height: '100%', width: '100%' }} attributionControl={false}>
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}" />
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}" />
        
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={myIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {layers.hazard && (
          <>
            <CircleMarker center={[27.5, 93.5]} radius={20} pathOptions={{ color: 'red', fillColor: '#dc2626', fillOpacity: 0.5 }}>
              <Popup>Landslide Risk Zone</Popup>
            </CircleMarker>
            <Polygon positions={floodPolygon} pathOptions={{ color: 'blue', fillColor: '#3b82f6', fillOpacity: 0.4 }}>
              <Popup>Flood Prone Area</Popup>
            </Polygon>
          </>
        )}

        {layers.transport && (
          <Polyline positions={roadPolyline} pathOptions={{ color: 'white', weight: 4 }}>
            <Popup>NH-15 Highway</Popup>
          </Polyline>
        )}

        {layers.emergency && (
          <Marker position={[27.1, 93.6]}>
            <Popup>Itanagar Civil Hospital</Popup>
          </Marker>
        )}

        {layers.safeZones && (
          <Marker position={[27.8, 94.2]}>
            <Popup>Relief Camp A</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
