export const HAZARD_ZONES = {
  landslideCriticalCorridors: [
    {
      id: 'ls_corridor_1',
      name: 'Bhalukpong-Bomdila Corridor',
      severity: 'HIGH',
      waypoints: [
        { lat: 27.0051, lon: 92.6465 }, // Bhalukpong
        { lat: 27.1234, lon: 92.5123 }, // Nechiphu
        { lat: 27.2645, lon: 92.4159 }  // Bomdila
      ],
      description: 'Prone to frequent landslides during monsoon due to steep gradients and weak rock formation.'
    },
    {
      id: 'ls_corridor_2',
      name: 'Pasighat-Pangin Corridor',
      severity: 'HIGH',
      waypoints: [
        { lat: 28.0622, lon: 95.3262 }, // Pasighat
        { lat: 28.1500, lon: 95.1000 },
        { lat: 28.2144, lon: 94.9786 }  // Pangin
      ],
      description: 'Highly unstable slopes along the Siang river valley.'
    },
    {
      id: 'ls_corridor_3',
      name: 'Roing-Anini Frontier Highway',
      severity: 'CRITICAL',
      waypoints: [
        { lat: 28.1408, lon: 95.8447 },
        { lat: 28.4500, lon: 95.8700 },
        { lat: 28.7950, lon: 95.9015 }
      ],
      description: 'Extreme landslide vulnerability, frequent road blocks.'
    }
  ],
  
  floodProneAreas: [
    {
      id: 'fp_pasighat_plains',
      name: 'Pasighat Plains & Siang Delta',
      severity: 'CRITICAL',
      bounds: [
        { lat: 28.1, lon: 95.2 },
        { lat: 28.1, lon: 95.4 },
        { lat: 27.9, lon: 95.4 },
        { lat: 27.9, lon: 95.2 }
      ],
      waterbody: 'Siang River'
    },
    {
      id: 'fp_namsai_lohit',
      name: 'Namsai & Lower Lohit Plains',
      severity: 'HIGH',
      bounds: [
        { lat: 27.75, lon: 95.75 },
        { lat: 27.75, lon: 96.0 },
        { lat: 27.55, lon: 96.0 },
        { lat: 27.55, lon: 95.75 }
      ],
      waterbody: 'Noa-Dihing and Lohit Rivers'
    }
  ],
  
  seismicFaults: [
    {
      id: 'mbt',
      name: 'Main Boundary Thrust (MBT)',
      type: 'Thrust Fault',
      coordinates: [
        { lat: 27.0, lon: 92.5 },
        { lat: 27.2, lon: 93.5 },
        { lat: 27.5, lon: 94.5 },
        { lat: 27.8, lon: 95.5 }
      ]
    },
    {
      id: 'mct',
      name: 'Main Central Thrust (MCT)',
      type: 'Thrust Fault',
      coordinates: [
        { lat: 27.5, lon: 92.0 },
        { lat: 27.8, lon: 93.0 },
        { lat: 28.2, lon: 94.0 },
        { lat: 28.5, lon: 95.0 }
      ]
    }
  ],
  
  glofThreats: [
    {
      id: 'glof_tawang_chu',
      name: 'Tawang Chu Upper Catchment GLOF Risk',
      lakeLat: 27.8, lakeLon: 91.9,
      threatZoneLat: 27.6, threatZoneLon: 91.8,
      riskLevel: 'HIGH'
    },
    {
      id: 'glof_subansiri',
      name: 'Upper Subansiri LDOF Risk',
      lakeLat: 28.3, lakeLon: 93.8,
      threatZoneLat: 28.0, threatZoneLon: 94.2,
      riskLevel: 'MODERATE'
    }
  ],
  
  communicationBlackouts: [
    {
      id: 'cb_anini_north',
      name: 'North of Anini',
      lat: 28.9, lon: 95.9,
      radius_km: 50,
      reason: 'Deep valleys, no cell towers'
    },
    {
      id: 'cb_mechuka_upper',
      name: 'Upper Mechuka Valley',
      lat: 28.7, lon: 94.0,
      radius_km: 40,
      reason: 'Mountain shadow zone'
    }
  ],
  
  safeZones: [
    {
      id: 'sz_itanagar_igp',
      name: 'IG Park, Itanagar',
      lat: 27.0910, lon: 93.6120,
      capacity: 5000,
      facilities: ['Helipad access', 'Medical camp space', 'Water supply']
    },
    {
      id: 'sz_pasighat_stadium',
      name: 'Pasighat General Stadium',
      lat: 28.0650, lon: 95.3300,
      capacity: 3000,
      facilities: ['Helipad access', 'Hospital nearby']
    },
    {
      id: 'sz_ziro_padi',
      name: 'Padi Yube Stadium, Ziro',
      lat: 27.5600, lon: 93.8300,
      capacity: 2500,
      facilities: ['High ground', 'Medical camp space']
    }
  ]
};
