export const TRANSPORT_NODES = [
  // Airports
  { id: 'hollongi_apt', name: 'Donyi Polo Airport, Hollongi', lat: 26.9605, lon: 93.6262, elevation: 150, type: 'airport', capacity: 'Medium' },
  { id: 'pasighat_apt', name: 'Pasighat Airport', lat: 28.0641, lon: 95.3331, elevation: 153, type: 'airport', capacity: 'Small' },
  { id: 'tezu_apt', name: 'Tezu Airport', lat: 27.9400, lon: 96.1438, elevation: 185, type: 'airport', capacity: 'Small' },
  { id: 'ziro_apt', name: 'Ziro Airport', lat: 27.5878, lon: 93.8272, elevation: 1688, type: 'airport', capacity: 'Small' },

  // ALGs
  { id: 'mechuka_alg', name: 'Mechuka ALG', lat: 28.5991, lon: 94.1378, elevation: 1890, type: 'alg', capacity: 'Medium' },
  { id: 'tuting_alg', name: 'Tuting ALG', lat: 28.9863, lon: 94.8876, elevation: 600, type: 'alg', capacity: 'Medium' },
  { id: 'walong_alg', name: 'Walong ALG', lat: 28.1189, lon: 97.0205, elevation: 1098, type: 'alg', capacity: 'Small' },
  { id: 'aalo_alg', name: 'Aalo ALG', lat: 28.1691, lon: 94.7963, elevation: 618, type: 'alg', capacity: 'Medium' },
  { id: 'vijaynagar_alg', name: 'Vijaynagar ALG', lat: 27.1855, lon: 96.9930, elevation: 1300, type: 'alg', capacity: 'Small' },
  { id: 'tawang_alg', name: 'Tawang ALG', lat: 27.5861, lon: 91.8775, elevation: 2669, type: 'alg', capacity: 'Small' },

  // Railway Stations
  { id: 'naharlagun_rs', name: 'Naharlagun Railway Station', lat: 27.1066, lon: 93.7029, elevation: 215, type: 'rail_station', capacity: 'Large' },
  { id: 'bhalukpong_rs', name: 'Bhalukpong Railway Station', lat: 27.0051, lon: 92.6465, elevation: 213, type: 'rail_station', capacity: 'Medium' },

  // Bridges
  { id: 'dhola_sadiya', name: 'Dhola-Sadiya Bridge', lat: 27.7845, lon: 95.6698, elevation: 150, type: 'bridge', capacity: 'High' },
  { id: 'bogibeel', name: 'Bogibeel Bridge', lat: 27.4048, lon: 94.7618, elevation: 100, type: 'bridge', capacity: 'High' },
  
  // Passes
  { id: 'sela_pass', name: 'Sela Pass', lat: 27.5029, lon: 92.0519, elevation: 4170, type: 'pass', capacity: 'Low' },
  { id: 'bum_la', name: 'Bum La Pass', lat: 27.7121, lon: 91.8893, elevation: 4600, type: 'pass', capacity: 'Low' },
  { id: 'pangsau_pass', name: 'Pangsau Pass', lat: 27.2427, lon: 96.1418, elevation: 1136, type: 'pass', capacity: 'Low' },

  // Major Helipads
  { id: 'itanagar_heli', name: 'Itanagar Helipad', lat: 27.0850, lon: 93.6067, elevation: 350, type: 'helipad', capacity: 'Medium' },
  { id: 'tawang_heli', name: 'Tawang Helipad', lat: 27.5861, lon: 91.8775, elevation: 2669, type: 'helipad', capacity: 'Medium' },
  { id: 'daporijo_heli', name: 'Daporijo Helipad', lat: 27.9868, lon: 94.2185, elevation: 600, type: 'helipad', capacity: 'Small' },
  { id: 'anini_heli', name: 'Anini Helipad', lat: 28.7950, lon: 95.9015, elevation: 1968, type: 'helipad', capacity: 'Small' },
  
  // Major Highway Junctions & District HQs
  { id: 'itanagar', name: 'Itanagar (NH-415)', lat: 27.0850, lon: 93.6067, elevation: 350, type: 'district_hq', capacity: 'Large' },
  { id: 'bomdila', name: 'Bomdila (NH-13)', lat: 27.2645, lon: 92.4159, elevation: 2415, type: 'district_hq', capacity: 'Medium' },
  { id: 'tawang', name: 'Tawang (NH-13)', lat: 27.5861, lon: 91.8775, elevation: 2669, type: 'district_hq', capacity: 'Medium' },
  { id: 'ziro', name: 'Ziro (NH-13)', lat: 27.5623, lon: 93.8344, elevation: 1688, type: 'district_hq', capacity: 'Medium' },
  { id: 'pasighat', name: 'Pasighat (NH-515)', lat: 28.0622, lon: 95.3262, elevation: 153, type: 'district_hq', capacity: 'Large' },
  { id: 'roing', name: 'Roing (NH-115)', lat: 28.1408, lon: 95.8447, elevation: 390, type: 'district_hq', capacity: 'Medium' },
  { id: 'tezu', name: 'Tezu (NH-113)', lat: 27.9179, lon: 96.1661, elevation: 185, type: 'district_hq', capacity: 'Medium' },
  { id: 'aalo', name: 'Aalo (NH-13)', lat: 28.1691, lon: 94.7963, elevation: 618, type: 'district_hq', capacity: 'Medium' },
  { id: 'khonsa', name: 'Khonsa', lat: 27.0270, lon: 95.5323, elevation: 1215, type: 'district_hq', capacity: 'Small' },
  { id: 'changlang', name: 'Changlang', lat: 27.1264, lon: 95.7366, elevation: 580, type: 'district_hq', capacity: 'Small' },
  { id: 'namsai', name: 'Namsai', lat: 27.6710, lon: 95.8752, elevation: 150, type: 'district_hq', capacity: 'Medium' },
  { id: 'seppa', name: 'Seppa', lat: 27.3639, lon: 93.0336, elevation: 362, type: 'district_hq', capacity: 'Medium' },
  { id: 'daporijo', name: 'Daporijo', lat: 27.9868, lon: 94.2185, elevation: 600, type: 'district_hq', capacity: 'Medium' },
  { id: 'yingkiong', name: 'Yingkiong', lat: 28.6145, lon: 95.0483, elevation: 200, type: 'district_hq', capacity: 'Small' },
  { id: 'anini', name: 'Anini', lat: 28.7950, lon: 95.9015, elevation: 1968, type: 'district_hq', capacity: 'Small' },
  { id: 'hawai', name: 'Hawai', lat: 27.8825, lon: 96.8005, elevation: 1296, type: 'district_hq', capacity: 'Small' },
];

export const TRANSPORT_EDGES = [
  // Highway NH-13 Routes
  { id: 'e1', source: 'bhalukpong_rs', target: 'bomdila', mode: 'road', length_km: 100, baseSpeedKmh: 30, slopeGradient: 5.2, capacity: 'Medium', roadType: 'NH', vulnerabilityScore: 0.8, name: 'Bhalukpong-Bomdila Highway' },
  { id: 'e2', source: 'bomdila', target: 'sela_pass', mode: 'road', length_km: 70, baseSpeedKmh: 20, slopeGradient: 8.5, capacity: 'Low', roadType: 'NH', vulnerabilityScore: 0.9, name: 'Bomdila-Sela Route' },
  { id: 'e3', source: 'sela_pass', target: 'tawang', mode: 'road', length_km: 75, baseSpeedKmh: 25, slopeGradient: 7.0, capacity: 'Low', roadType: 'NH', vulnerabilityScore: 0.9, name: 'Sela-Tawang Route' },
  { id: 'e4', source: 'tawang', target: 'bum_la', mode: 'road', length_km: 37, baseSpeedKmh: 15, slopeGradient: 9.0, capacity: 'Low', roadType: 'district', vulnerabilityScore: 0.95, name: 'Bum La Border Road' },

  // NH-415 & Capital Connect
  { id: 'e5', source: 'hollongi_apt', target: 'itanagar', mode: 'road', length_km: 25, baseSpeedKmh: 45, slopeGradient: 2.5, capacity: 'High', roadType: 'NH', vulnerabilityScore: 0.3, name: 'Hollongi-Itanagar Highway (NH-415)' },
  { id: 'e6', source: 'naharlagun_rs', target: 'itanagar', mode: 'road', length_km: 15, baseSpeedKmh: 40, slopeGradient: 3.0, capacity: 'High', roadType: 'NH', vulnerabilityScore: 0.4, name: 'Naharlagun-Itanagar Route' },

  // Trans-Arunachal Highway Links
  { id: 'e7', source: 'itanagar', target: 'ziro', mode: 'road', length_km: 110, baseSpeedKmh: 35, slopeGradient: 6.0, capacity: 'Medium', roadType: 'NH', vulnerabilityScore: 0.7, name: 'Itanagar-Ziro Highway' },
  { id: 'e8', source: 'ziro', target: 'daporijo', mode: 'road', length_km: 165, baseSpeedKmh: 25, slopeGradient: 7.5, capacity: 'Medium', roadType: 'NH', vulnerabilityScore: 0.85, name: 'Ziro-Daporijo Highway' },
  { id: 'e9', source: 'daporijo', target: 'aalo', mode: 'road', length_km: 150, baseSpeedKmh: 30, slopeGradient: 6.5, capacity: 'Medium', roadType: 'NH', vulnerabilityScore: 0.75, name: 'Daporijo-Aalo Highway' },
  { id: 'e10', source: 'aalo', target: 'pasighat', mode: 'road', length_km: 105, baseSpeedKmh: 40, slopeGradient: 4.5, capacity: 'Medium', roadType: 'NH', vulnerabilityScore: 0.6, name: 'Aalo-Pasighat Highway' },

  // Eastern Arunachal Links
  { id: 'e11', source: 'pasighat', target: 'roing', mode: 'road', length_km: 100, baseSpeedKmh: 50, slopeGradient: 1.5, capacity: 'High', roadType: 'NH', vulnerabilityScore: 0.4, name: 'Pasighat-Roing Highway' },
  { id: 'e12', source: 'roing', target: 'tezu', mode: 'road', length_km: 70, baseSpeedKmh: 55, slopeGradient: 1.0, capacity: 'High', roadType: 'NH', vulnerabilityScore: 0.3, name: 'Roing-Tezu Highway' },
  { id: 'e13', source: 'tezu', target: 'hawai', mode: 'road', length_km: 165, baseSpeedKmh: 20, slopeGradient: 8.0, capacity: 'Low', roadType: 'NH', vulnerabilityScore: 0.9, name: 'Tezu-Hawai Route' },
  { id: 'e14', source: 'roing', target: 'anini', mode: 'road', length_km: 235, baseSpeedKmh: 20, slopeGradient: 9.5, capacity: 'Low', roadType: 'NH', vulnerabilityScore: 0.95, name: 'Roing-Anini Frontier Highway' },
  { id: 'e15', source: 'dhola_sadiya', target: 'roing', mode: 'road', length_km: 40, baseSpeedKmh: 60, slopeGradient: 0.5, capacity: 'High', roadType: 'NH', vulnerabilityScore: 0.2, name: 'Dhola-Sadiya to Roing Link' },

  // Capital & Western Arteries
  { id: 'e19', source: 'bomdila', target: 'seppa', mode: 'road', length_km: 110, baseSpeedKmh: 35, slopeGradient: 5.5, capacity: 'Medium', roadType: 'NH', vulnerabilityScore: 0.7, name: 'Bomdila-Seppa Highway (NH-13)' },
  { id: 'e20', source: 'seppa', target: 'itanagar', mode: 'road', length_km: 140, baseSpeedKmh: 40, slopeGradient: 4.8, capacity: 'Medium', roadType: 'NH', vulnerabilityScore: 0.75, name: 'Seppa-Sagalee-Itanagar (NH-13)' },
  { id: 'e21', source: 'bhalukpong_rs', target: 'itanagar', mode: 'road', length_km: 130, baseSpeedKmh: 50, slopeGradient: 2.0, capacity: 'High', roadType: 'NH', vulnerabilityScore: 0.35, name: 'Bhalukpong-Banderdewa-Itanagar Foothill Road' },

  // Siang, Subansiri & Northern Border Lifelines
  { id: 'e22', source: 'aalo', target: 'mechuka_alg', mode: 'road', length_km: 185, baseSpeedKmh: 25, slopeGradient: 7.2, capacity: 'Low', roadType: 'NH', vulnerabilityScore: 0.85, name: 'Aalo-Tato-Mechuka Highway' },
  { id: 'e23', source: 'pasighat', target: 'yingkiong', mode: 'road', length_km: 120, baseSpeedKmh: 30, slopeGradient: 5.0, capacity: 'Medium', roadType: 'NH', vulnerabilityScore: 0.8, name: 'Pasighat-Yingkiong Highway (NH-513)' },
  { id: 'e24', source: 'yingkiong', target: 'tuting_alg', mode: 'road', length_km: 130, baseSpeedKmh: 22, slopeGradient: 8.0, capacity: 'Low', roadType: 'NH', vulnerabilityScore: 0.9, name: 'Yingkiong-Tuting Siang Canyon Road' },

  // Eastern & Southern Corridors
  { id: 'e25', source: 'tezu', target: 'walong_alg', mode: 'road', length_km: 180, baseSpeedKmh: 24, slopeGradient: 8.2, capacity: 'Low', roadType: 'NH', vulnerabilityScore: 0.92, name: 'Tezu-Hayuliang-Walong Highway' },
  { id: 'e26', source: 'tezu', target: 'namsai', mode: 'road', length_km: 60, baseSpeedKmh: 55, slopeGradient: 1.0, capacity: 'High', roadType: 'NH', vulnerabilityScore: 0.3, name: 'Tezu-Chowkham-Namsai Highway (NH-13)' },
  { id: 'e27', source: 'namsai', target: 'changlang', mode: 'road', length_km: 80, baseSpeedKmh: 45, slopeGradient: 3.5, capacity: 'Medium', roadType: 'SH', vulnerabilityScore: 0.5, name: 'Namsai-Miao-Changlang Road' },
  { id: 'e28', source: 'changlang', target: 'khonsa', mode: 'road', length_km: 65, baseSpeedKmh: 35, slopeGradient: 6.0, capacity: 'Medium', roadType: 'SH', vulnerabilityScore: 0.65, name: 'Changlang-Khonsa Highway' },
  { id: 'e29', source: 'changlang', target: 'vijaynagar_alg', mode: 'foot', length_km: 157, baseSpeedKmh: 15, slopeGradient: 7.0, capacity: 'Low', roadType: 'track', vulnerabilityScore: 0.95, name: 'Miao-Vijaynagar Emergency Trail' },

  // Local Transfers (Town center to Airport/Helipad)
  { id: 't1', source: 'itanagar', target: 'itanagar_heli', mode: 'road', length_km: 2, baseSpeedKmh: 30, slopeGradient: 1.0, capacity: 'High', roadType: 'district', vulnerabilityScore: 0.1, name: 'Itanagar Heli Access' },
  { id: 't2', source: 'tawang', target: 'tawang_heli', mode: 'road', length_km: 2, baseSpeedKmh: 25, slopeGradient: 2.0, capacity: 'Medium', roadType: 'district', vulnerabilityScore: 0.1, name: 'Tawang Heli Access' },
  { id: 't3', source: 'tawang', target: 'tawang_alg', mode: 'road', length_km: 3, baseSpeedKmh: 25, slopeGradient: 2.0, capacity: 'Medium', roadType: 'district', vulnerabilityScore: 0.1, name: 'Tawang ALG Access' },
  { id: 't4', source: 'ziro', target: 'ziro_apt', mode: 'road', length_km: 3, baseSpeedKmh: 35, slopeGradient: 1.0, capacity: 'High', roadType: 'district', vulnerabilityScore: 0.1, name: 'Ziro Airport Access' },
  { id: 't5', source: 'pasighat', target: 'pasighat_apt', mode: 'road', length_km: 4, baseSpeedKmh: 40, slopeGradient: 0.5, capacity: 'High', roadType: 'district', vulnerabilityScore: 0.1, name: 'Pasighat Airport Access' },
  { id: 't6', source: 'tezu', target: 'tezu_apt', mode: 'road', length_km: 3, baseSpeedKmh: 45, slopeGradient: 0.5, capacity: 'High', roadType: 'district', vulnerabilityScore: 0.1, name: 'Tezu Airport Access' },
  { id: 't7', source: 'aalo', target: 'aalo_alg', mode: 'road', length_km: 2, baseSpeedKmh: 30, slopeGradient: 1.0, capacity: 'High', roadType: 'district', vulnerabilityScore: 0.1, name: 'Aalo ALG Access' },
  { id: 't8', source: 'daporijo', target: 'daporijo_heli', mode: 'road', length_km: 2, baseSpeedKmh: 25, slopeGradient: 1.0, capacity: 'High', roadType: 'district', vulnerabilityScore: 0.1, name: 'Daporijo Heli Access' },
  { id: 't9', source: 'anini', target: 'anini_heli', mode: 'road', length_km: 2, baseSpeedKmh: 20, slopeGradient: 2.0, capacity: 'Medium', roadType: 'district', vulnerabilityScore: 0.1, name: 'Anini Heli Access' },

  // Air Evacuation Network (Helicopters & Transport Aircraft)
  { id: 'air1', source: 'hollongi_apt', target: 'tezu_apt', mode: 'air', length_km: 260, baseSpeedKmh: 380, slopeGradient: 0, capacity: 'High', roadType: 'air', vulnerabilityScore: 0.1, name: 'Hollongi-Tezu Air Bridge' },
  { id: 'air2', source: 'hollongi_apt', target: 'ziro_apt', mode: 'air', length_km: 85, baseSpeedKmh: 250, slopeGradient: 0, capacity: 'Medium', roadType: 'air', vulnerabilityScore: 0.2, name: 'Hollongi-Ziro Air Shuttle' },
  { id: 'air3', source: 'itanagar_heli', target: 'anini_heli', mode: 'air', length_km: 290, baseSpeedKmh: 220, slopeGradient: 0, capacity: 'Low', roadType: 'air', vulnerabilityScore: 0.35, name: 'Itanagar-Anini IAF Helicopter Lifeline' },
  { id: 'air4', source: 'itanagar_heli', target: 'mechuka_alg', mode: 'air', length_km: 175, baseSpeedKmh: 220, slopeGradient: 0, capacity: 'Low', roadType: 'air', vulnerabilityScore: 0.3, name: 'Itanagar-Mechuka Air Lifeline' },
  { id: 'air5', source: 'pasighat_apt', target: 'tuting_alg', mode: 'air', length_km: 115, baseSpeedKmh: 280, slopeGradient: 0, capacity: 'Medium', roadType: 'air', vulnerabilityScore: 0.25, name: 'Pasighat-Tuting Relief Flight' },
  { id: 'air6', source: 'tezu_apt', target: 'walong_alg', mode: 'air', length_km: 95, baseSpeedKmh: 250, slopeGradient: 0, capacity: 'Medium', roadType: 'air', vulnerabilityScore: 0.3, name: 'Tezu-Walong Air Evac' },
  { id: 'air7', source: 'tezu_apt', target: 'vijaynagar_alg', mode: 'air', length_km: 125, baseSpeedKmh: 250, slopeGradient: 0, capacity: 'Medium', roadType: 'air', vulnerabilityScore: 0.35, name: 'Tezu-Vijaynagar Air Bridge' }
];
