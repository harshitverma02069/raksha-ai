// RAKSHA AI — Arunachal Pradesh Comprehensive Terrain & Survival Encyclopedia
// Exhaustive geographic, geological, infrastructural, and survival intelligence for all 28 districts

export const ARUNACHAL_ENCYCLOPEDIA = {
  geology: {
    seismicZone: 'Zone V (100% of state)',
    peakGroundAcceleration: 'PGA > 0.36g to 0.50g',
    tectonics: [
      'Main Himalayan Thrust (MHT) basal detachment',
      'Main Boundary Thrust (MBT) - Siwaliks to Lesser Himalaya',
      'Main Frontal Thrust (MFT) / Himalayan Frontal Thrust',
      'Main Central Thrust (MCT) - High-grade crystalline boundary',
      'Mishmi Thrust & Tidding Suture Zone (Eastern Syntaxis)',
      'Po-Chu & Kopili Fault Lineaments'
    ],
    rainfallStats: '2,500 mm to 5,500 mm annual torrential precipitation',
    lithology: 'Fragile pre-Cambrian phyllites, fractured quartzites, soft Siwalik mudstones, and schistose formations prone to instant saturation liquefaction'
  },

  districts: {
    tawang: {
      name: 'Tawang',
      headquarters: 'Tawang (2,669 m / 8,756 ft)',
      elevationRange: '1,800 m to 6,500 m',
      languages: ['Monpa (Tawang dialect)', 'Hindi', 'English'],
      greeting: 'Tashi Delek',
      criticalPoints: ['Sela Pass (13,700 ft)', 'Sela Twin-Tube Tunnel (13,000 ft)', 'Bum La Pass (15,200 ft)', 'PTSO Lake', 'Zemithang'],
      rivers: ['Tawang Chu', 'Nyamjang Chu'],
      disasterRisks: ['Severe snow blizzards', 'Rockfalls on Sela approaches', 'Zone V earthquakes', 'Flash avalanches'],
      lifelines: ['Tawang Heliport / ALG', 'Khandu Memorial District Hospital (100 beds)', '168 Military Hospital Tawang', 'IV Corps 5 Mtn Div garrisons'],
      escapeAdvice: 'During Sela blockages, shelter at Dirang or Jaswant Garh army staging posts. Sela Tunnel provides all-weather bypass beneath the pass ridge.'
    },
    west_kameng: {
      name: 'West Kameng',
      headquarters: 'Bomdila (2,217 m / 7,273 ft)',
      elevationRange: '300 m to 6,400 m',
      languages: ['Monpa', 'Sherdukpen', 'Sartang', 'Bugun', 'Hindi'],
      criticalPoints: ['BCT Corridor (Balipara-Charduar-Tawang)', 'Nechiphu Tunnel (5,700 ft heavy fog zone)', 'Dirang Valley', 'Rupa', 'Bhalukpong'],
      rivers: ['Kameng (Bhareli)', 'Tenga', 'Bichom', 'Dirang Chu'],
      disasterRisks: ['Chronic mudslides at Kaspi & Nechiphu', 'River valley flooding', 'Earthquakes'],
      lifelines: ['General Hospital Bomdila (120 beds)', 'Military Hospital Tenga', 'Bhalukpong Railway Station (Broad Gauge)', 'IV Corps Tenga base'],
      escapeAdvice: 'Use the newly commissioned Nechiphu D-shaped bypass tunnel to avoid the treacherous landslide-prone fog ridge.'
    },
    bichom: {
      name: 'Bichom (Created 2024)',
      headquarters: 'Napangphung (1,200 m)',
      elevationRange: '500 m to 3,500 m',
      languages: ['Sajolang (Miji)', 'Hruso (Aka)', 'Hindi'],
      criticalPoints: ['Bichom Dam Reservoir', 'Nafra', 'Lada', 'Bhalukpong-Nafra axis'],
      rivers: ['Bichom', 'Kameng tributaries'],
      disasterRisks: ['Hill-slope slumps', 'Road washouts isolating tribal villages', 'Flash cloudbursts'],
      lifelines: ['Napangphung Health Post', 'Bomdila Referral Hospital', 'SDRF QRT Bomdila']
    },
    east_kameng: {
      name: 'East Kameng',
      headquarters: 'Seppa (363 m)',
      elevationRange: '300 m to 7,000 m (Kangto 7,090 m)',
      languages: ['Nyishi', 'Puroik (Sulung)', 'Hindi'],
      greeting: 'Khamani / Ayo be',
      criticalPoints: ['Seppa-Sagalee Highway', 'Chayang Tajo', 'Bameng', 'Pacha valley'],
      rivers: ['Kameng', 'Pacha', 'Pakke'],
      disasterRisks: ['Violent Kameng river surges', 'Severe bank erosion undermining Seppa township', 'Monsoon road severance'],
      lifelines: ['District Hospital Seppa (80 beds)', 'Seppa Helipad', 'DEOC Seppa (1077)']
    },
    pakke_kessang: {
      name: 'Pakke-Kessang',
      headquarters: 'Lemmi (750 m)',
      elevationRange: '200 m to 3,000 m',
      languages: ['Nyishi', 'Hindi', 'Assamese'],
      criticalPoints: ['Pakke Tiger Reserve fringes', 'Seijosa', 'Pizirang'],
      rivers: ['Pakke', 'Kessang', 'Kameng'],
      disasterRisks: ['Alluvial flooding at Seijosa', 'Foot-trail washouts in dense jungle'],
      lifelines: ['Lemmi CHC', 'Seijosa Police Post', 'Tezpur Base Hospital access']
    },
    papum_pare: {
      name: 'Papum Pare & Capital Complex',
      headquarters: 'Yupia / Itanagar / Naharlagun (120 m to 750 m)',
      elevationRange: '120 m to 2,500 m',
      languages: ['Nyishi', 'Arunachali Hindi', 'English', 'Assamese', 'Bengali'],
      greeting: 'Namaste / Nyishi: Khamani',
      criticalPoints: ['NH-415 (Itanagar-Naharlagun-Banderdewa)', 'Doimukh', 'Hollongi', 'Sagalee-Laptap axis'],
      rivers: ['Dikrong', 'Pachin', 'Pare', 'Senki', 'Chimpu'],
      disasterRisks: ['Catastrophic debris slides (site of 2017 Laptap tragedy)', 'Dikrong flash floods from Pare HEP reservoir releases', 'Urban hill-cutting slumps'],
      lifelines: ['TRIHMS Naharlagun (500 beds + Trauma Center + Blood Bank)', 'Donyi Polo Airport Hollongi (2,300m ILS Runway)', 'Naharlagun Railway Station', '12th Battalion NDRF HQ Emchi/Doimukh', 'State Emergency Operations Centre (1070)']
    },
    lower_subansiri: {
      name: 'Lower Subansiri',
      headquarters: 'Ziro (1,572 m / 5,157 ft)',
      elevationRange: '1,000 m to 3,200 m',
      languages: ['Apatani (Tanii)', 'Nyishi', 'Hindi'],
      greeting: 'Apatani: No kape / Nyishi: Khamani',
      criticalPoints: ['Potin-Ziro NH-13 Corridor (Permanent Landslide Blackspot)', 'Old Ziro', 'Hapoli', 'Talo'],
      rivers: ['Panyor (Ranganadi)', 'Kime', 'Kele'],
      disasterRisks: ['Potin slip zone (blocks travel for weeks)', 'Plateau waterlogging', 'Zone V quakes'],
      lifelines: ['General Hospital Ziro (100 beds)', 'Ziro Civil Airport (Dornier-228 capable)', 'Ziro Helipad', 'FCI Depot Ziro']
    },
    keyi_panyor: {
      name: 'Keyi Panyor (Created 2024)',
      headquarters: 'Yachuli (1,200 m)',
      elevationRange: '600 m to 2,800 m',
      languages: ['Nyishi', 'Hindi'],
      criticalPoints: ['Ranganadi Hydroelectric Project (NEEPCO Dam)', 'Potin Junction', 'Yazali'],
      rivers: ['Panyor (Ranganadi)'],
      disasterRisks: ['Dam release flash surges', 'Potin-Yachuli NH-13 mud avalanches'],
      lifelines: ['Yachuli CHC', 'Potin Police Outpost', 'Quick access to Naharlagun / TRIHMS']
    },
    kurung_kumey: {
      name: 'Kurung Kumey',
      headquarters: 'Koloriang (1,040 m)',
      elevationRange: '600 m to 5,000 m (Bordering Tibet)',
      languages: ['Nyishi', 'Bangni', 'Hindi'],
      criticalPoints: ['Damin', 'Sarli', 'Parsi-Parlo', 'Huri border track', 'Kumey Gorge'],
      rivers: ['Kurung', 'Kumey'],
      disasterRisks: ['Total geographic isolation', 'Bridges swept away over roaring gorges', 'Severe OFC fiber cutouts'],
      lifelines: ['Koloriang Helipad (Pawan Hans / IAF Mi-17)', 'Koloriang District Hospital', 'ITBP Border Posts (Damin/Sarli)']
    },
    kra_daadi: {
      name: 'Kra Daadi',
      headquarters: 'Jamin / Palin (1,200 m)',
      elevationRange: '500 m to 4,500 m',
      languages: ['Nyishi', 'Hindi'],
      criticalPoints: ['Palin-Nyapin road', 'Chambang', 'Pipsorang (deep interior)'],
      rivers: ['Palin', 'Kurung'],
      disasterRisks: ['Hillside sliding', 'Zero mobile network in hinterlands', 'Cloudbursts'],
      lifelines: ['Palin District Hospital', 'Palin Helipad', 'DEOC Jamin']
    },
    kamle: {
      name: 'Kamle',
      headquarters: 'Raga (1,350 m)',
      elevationRange: '400 m to 3,500 m',
      languages: ['Nyishi', 'Tagin', 'Hindi'],
      criticalPoints: ['Raga-Daporijo NH-13 stretch', 'Dollungmukh', 'Geku axis'],
      rivers: ['Kamle', 'Subansiri'],
      disasterRisks: ['Road sinking on Trans-Arunachal Highway', 'River bluff erosion'],
      lifelines: ['Raga CHC', 'Subansiri Valley Quick Response']
    },
    upper_subansiri: {
      name: 'Upper Subansiri',
      headquarters: 'Daporijo (600 m)',
      elevationRange: '400 m to 5,500 m',
      languages: ['Tagin', 'Galo', 'Nyishi', 'Hindi'],
      greeting: 'Tagin: Aito / Galo: Gidai',
      criticalPoints: ['Daporijo Bailey Bridge over Subansiri', 'Limeking', 'Taksing (LAC Enclave)', 'Nacho', 'Siyum'],
      rivers: ['Subansiri (massive discharge)', 'Sipi', 'Menga', 'Sigin'],
      disasterRisks: ['Trans-boundary flash floods', 'Historical 1950 dam-burst catastrophe site', 'Taksing border cutoff'],
      lifelines: ['District Hospital Daporijo (90 beds)', 'Daporijo Helipad', 'ITBP Limeking/Taksing bases with satellite comms']
    },
    shi_yomi: {
      name: 'Shi-Yomi',
      headquarters: 'Tato / Mechuka (1,560 m to 1,890 m)',
      elevationRange: '1,000 m to 6,000 m',
      languages: ['Memba', 'Tagin', 'Adi (Bokar/Ramo)', 'Hindi'],
      greeting: 'Memba: Tashi Delek',
      criticalPoints: ['Mechuka Valley', 'Tato Siyom Bridge', 'Monigong (LAC)', 'Pidi'],
      rivers: ['Yargyap Chu', 'Siyom'],
      disasterRisks: ['GLOF glacial lake outbursts', 'Severe winter snow isolation', 'Aalo-Mechuka road cuts'],
      lifelines: ['Mechuka Advanced Landing Ground (C-130J & Mi-17 capable)', 'CHC Mechuka High Altitude Unit', 'Indian Army Brigade Mechuka']
    },
    west_siang: {
      name: 'West Siang',
      headquarters: 'Aalo (Along - 274 m)',
      elevationRange: '200 m to 3,500 m',
      languages: ['Galo', 'Adi', 'Hindi'],
      greeting: 'Galo: Gidai / Adi: Gidumika',
      criticalPoints: ['Aalo-Silapathar road', 'Aalo-Pangin axis', 'Siyom river confluence', 'Kamba'],
      rivers: ['Siyom', 'Yomgo', 'Siang'],
      disasterRisks: ['Siyom river high-velocity flooding', 'Aalo town perimeter landslides'],
      lifelines: ['General Hospital Aalo (120 beds)', 'Aalo ALG (Operational staging hub)', 'FCI Depot Aalo', '56 Mountain Div garrisons']
    },
    siang: {
      name: 'Siang',
      headquarters: 'Boleng (400 m)',
      elevationRange: '250 m to 4,000 m',
      languages: ['Adi', 'Hindi'],
      greeting: 'Adi: Gidumika',
      criticalPoints: ['Siang River Gorge', 'Pangin Junction', 'Rumgong', 'Kaying'],
      rivers: ['Siang (Yarlung Tsangpo)', 'Siyom', 'Simang'],
      disasterRisks: ['Trans-Himalayan LDOF wave crests (2000 Yigong-style waves)', 'Massive canyon rockslides'],
      lifelines: ['Boleng District Hospital', 'Pangin Emergency Station']
    },
    upper_siang: {
      name: 'Upper Siang',
      headquarters: 'Yingkiong (500 m)',
      elevationRange: '350 m to 6,500 m',
      languages: ['Adi (Shimong/Karko)', 'Memba', 'Khamba', 'Hindi'],
      criticalPoints: ['Tuting ALG', 'Gelling (First village of India on Siang)', 'Singa', 'Kepang La (Tsangpo entry point)', 'Nigging bridge'],
      rivers: ['Siang', 'Yamne', 'Yang Sang Chu'],
      disasterRisks: ['Zero-warning Tibetan river dam bursts', 'Total isolation of Gelling/Singa', 'High seismicity'],
      lifelines: ['Tuting Advanced Landing Ground (1,300m runway, C-130J capable)', 'District Hospital Yingkiong', 'ITBP Tuting Sector']
    },
    east_siang: {
      name: 'East Siang',
      headquarters: 'Pasighat (153 m / 502 ft)',
      elevationRange: '120 m to 2,000 m',
      languages: ['Adi (Padam/Minyong)', 'Arunachali Hindi', 'Assamese', 'English'],
      greeting: 'Adi: Gidumika / Hindi: Namaste',
      criticalPoints: ['Ranaghat Bridge over Siang', 'Pasighat Plains', 'Mebo bank erosion', 'Ruksin border', 'Sille'],
      rivers: ['Siang River (discharges exceed 16,000 m³/s)', 'Sille', 'Remi'],
      disasterRisks: ['Catastrophic alluvial river braided flooding', 'Thousands of hectares washed away at Mebo', 'Pasighat town inundation'],
      lifelines: ['Bakin Pertin General Hospital - BPGH (300 beds + ICU + Blood Bank)', 'Pasighat Airport (ATR-72 & IAF C-130J dual use)', 'Murkongselek-Pasighat Broad Gauge Railhead', 'NDRF Regional Response Centre (RRC) Pasighat']
    },
    lepa_rada: {
      name: 'Lepa-Rada',
      headquarters: 'Basar (660 m)',
      elevationRange: '400 m to 2,500 m',
      languages: ['Galo', 'Hindi'],
      criticalPoints: ['Basar-Aalo NH-13 road', 'Ego', 'Daring'],
      rivers: ['Kidi', 'Ego'],
      disasterRisks: ['Agricultural valley inundation', 'Debris torrents on NH-13'],
      lifelines: ['District Hospital Basar', 'Basar Helipad']
    },
    lower_siang: {
      name: 'Lower Siang',
      headquarters: 'Likabali (150 m)',
      elevationRange: '120 m to 2,500 m',
      languages: ['Galo', 'Assamese', 'Hindi'],
      criticalPoints: ['Likabali-Basar Highway (Soft Sandstone Slides)', 'Silapathar border railhead access', 'Malinithan'],
      rivers: ['Siku', 'Gensi', 'Siyom'],
      disasterRisks: ['Severe siltation', 'Hill-cutting slump collapses', 'Foothill flash floods'],
      lifelines: ['District Hospital Likabali', 'Military Hospital Likabali (56 Mtn Div)', 'Silapathar Railway Station (Assam border)']
    },
    dibang_valley: {
      name: 'Dibang Valley',
      headquarters: 'Anini (1,968 m / 6,457 ft)',
      elevationRange: '1,200 m to 6,000 m',
      languages: ['Idu Mishmi', 'Hindi'],
      greeting: 'Idu: Ayikhe',
      criticalPoints: ['Roing-Hunli-Anini Frontier Highway (NH-313)', 'Hunli Slide Sector', 'Etalin', 'Mipi border post', 'Dri River Canyon'],
      rivers: ['Dri', 'Mathun', 'Talon', 'Tangon', 'Dibang'],
      disasterRisks: ['Chronic washing away of NH-313 cutting off entire district for 3-4 weeks', 'Massive boulder torrents', 'Zone V quakes'],
      lifelines: ['Anini Helipad (IAF Mi-17 heavy airlift lifeline)', 'District Hospital Anini', 'Army HADR Outposts']
    },
    lower_dibang_valley: {
      name: 'Lower Dibang Valley',
      headquarters: 'Roing (390 m)',
      elevationRange: '150 m to 3,500 m',
      languages: ['Idu Mishmi', 'Adi', 'Hindi', 'Assamese'],
      criticalPoints: ['Deopani (Eze) Bridge (Critical Bottleneck)', 'Dambuk Orange belt', 'Sesseri bridge', 'Paglam'],
      rivers: ['Dibang', 'Eze (Deopani)', 'Sesseri'],
      disasterRisks: ['Violent boulder debris flows in Deopani', 'Dambuk isolation during monsoons', 'Embankment breaches'],
      lifelines: ['District Hospital Roing (90 beds)', 'Dhola-Sadiya Bridge connection (9.15 km to Assam)', 'Roing Helipad', 'FCI Depot Roing']
    },
    lohit: {
      name: 'Lohit',
      headquarters: 'Tezu (210 m / 689 ft)',
      elevationRange: '140 m to 3,000 m',
      languages: ['Digaru Mishmi (Taraon)', 'Miju Mishmi', 'Khampti', 'Hindi', 'Assamese'],
      greeting: 'Mishmi: Ayikhe / Khampti: Mai-soong',
      criticalPoints: ['Parasuram Kund', 'Sunpura', 'Digaru river bed', 'Alubari bridge'],
      rivers: ['Lohit (Gravel braided bed)', 'Digaru', 'Kamlang'],
      disasterRisks: ['Massive braided river surges', 'Highway breaches cutting Tezu from Tinsukia', 'High seismicity (near 1950 epicenter)'],
      lifelines: ['Tezu Airport (ATR-72 commercial & military ops)', 'Zonal General Hospital Tezu (120 beds)', 'FCI Depot Tezu', '2 Mountain Division garrisons']
    },
    anjaw: {
      name: 'Anjaw',
      headquarters: 'Hawai (1,296 m)',
      elevationRange: '600 m to 5,000 m',
      languages: ['Miju Mishmi (Kaman)', 'Digaru Mishmi', 'Hindi'],
      criticalPoints: ['Walong ALG (Site of 1962 Battle)', 'Kibithu (Easternmost LAC outpost)', 'Kaho (First Indian village)', 'Chaglagam', 'Hayuliang canyon'],
      rivers: ['Lohit River canyon', 'Dalai', 'Krowti', 'Dichu'],
      disasterRisks: ['Extremely steep rock avalanche slopes', 'Road collapse severing single supply artery', 'High altitude snowstorms'],
      lifelines: ['Walong Advanced Landing Ground (1,133m runway)', 'District Hospital Hawai', 'Army & ITBP Forward Helipads with satellite phones']
    },
    namsai: {
      name: 'Namsai',
      headquarters: 'Namsai (130 m)',
      elevationRange: '110 m to 400 m',
      languages: ['Tai-Khampti', 'Singpho', 'Assamese', 'Hindi'],
      greeting: 'Khampti: Mai-soong',
      criticalPoints: ['Golden Pagoda (Nongtau)', 'Chowkham', 'Mahadevpur border', 'Diyun-Bordumsa axis'],
      rivers: ['Noa-Dihing', 'Lohit', 'Tengapani'],
      disasterRisks: ['70% of district is low-lying plain vulnerable to severe prolonged monsoon inundation', 'River migration swallowing farmlands'],
      lifelines: ['District Hospital Namsai (100 beds)', 'Easy road link to Tinsukia / Dibrugarh hospitals', 'State relief shelters']
    },
    changlang: {
      name: 'Changlang',
      headquarters: 'Changlang (580 m)',
      elevationRange: '150 m to 4,500 m',
      languages: ['Tangsa', 'Tutsa', 'Singpho', 'Lisu (Yobin)', 'Hindi'],
      greeting: 'Tangsa: Nangsai',
      criticalPoints: ['Vijaynagar Salient (Border enclave surrounded on 3 sides by Myanmar)', 'Namdapha National Park jungle trail', 'Pangsau Pass (Stilwell Road)', 'Miao', 'Jairampur'],
      rivers: ['Tirap', 'Noa-Dihing', 'Namchik'],
      disasterRisks: ['Near-permanent geographic isolation of Vijaynagar (157 km unpaved trek)', 'Jungle mudslides', 'Alluvial floods in Miao/Bordumsa'],
      lifelines: ['Vijaynagar ALG (1,240m operational IAF lifeline)', 'District Hospital Changlang', 'Assam Rifles & ITBP posts']
    },
    tirap: {
      name: 'Tirap',
      headquarters: 'Khonsa (1,258 m)',
      elevationRange: '300 m to 2,500 m',
      languages: ['Nocte', 'Tutsa', 'Hindi'],
      criticalPoints: ['Khonsa-Naharkatia road', 'Deomali foothills', 'Namsang'],
      rivers: ['Tirap', 'Chhasa', 'Tisa'],
      disasterRisks: ['Sinking roadbeds on Patkai shale formations', 'Heavy monsoon washouts'],
      lifelines: ['District Hospital Khonsa (80 beds)', 'Khonsa Helipad', 'FCI Depot Khonsa', 'Assam Rifles Sector HQ']
    },
    longding: {
      name: 'Longding',
      headquarters: 'Longding (1,050 m)',
      elevationRange: '200 m to 2,200 m',
      languages: ['Wancho', 'Hindi'],
      greeting: 'Wancho: Man-tai',
      criticalPoints: ['Kanubari-Longding Highway', 'Pangchau', 'Wakka border circle', 'Niausa'],
      rivers: ['Tisa', 'Ti-Peh'],
      disasterRisks: ['Chronic road cuts on Kanubari arterial road', 'Severe dry-season mountain water shortages', 'Monsoon mudslides'],
      lifelines: ['District Hospital Longding', 'Longding Helipad', 'Wancho indigenous emergency community network']
    }
  },

  survivalWisdom: [
    {
      hazard: 'Landslide / Debris Torrent',
      rule: 'RUN PERPENDICULAR TO THE FLOW VECTOR',
      physicsExplanation: 'Debris flows travel downslope following maximum gravitational gradient (10-30 m/s). Sprinting downslope is fatal. Moving at 90 degrees exits the destructive reach cone within 15-30 meters.',
      indigenousSign: 'Listen for trees cracking like rifle shots uphill and muddy spring water suddenly drying up or turning dark chocolate brown.'
    },
    {
      hazard: 'Siang River Surge / LDOF',
      rule: 'CLIMB 15 METERS ABOVE RIVER WATERLINE IMMEDIATELY',
      physicsExplanation: 'Landslide dam outbursts from Tibet (Yarlung Tsangpo) can release 10,000+ m³/s surges with 10-30m wave heights within minutes.',
      indigenousSign: 'Sudden stillness or drop in water level during peak monsoon indicates an artificial debris dam has choked the gorge upstream. Catastrophic breach follows within hours.'
    },
    {
      hazard: 'Zone V Earthquake',
      rule: 'DROP, COVER, AND HOLD ON — NEVER RUN OUTSIDE DURING SHAKING',
      physicsExplanation: 'In mountainous terrain, running outside exposes you to masonry avalanches, collapsing overhead power lines, and falling boulders. 70% of casualties happen while moving.',
      indigenousSign: 'Secondary landslides occur up to 8 days post-quake due to micro-fissures in phyllite rock beds. Avoid steep road cuts after tremors.'
    },
    {
      hazard: 'Himalayan Pit Viper Bite',
      rule: 'STRICT IMMOBILIZATION BELOW HEART LEVEL — NO CUTTING OR SUCKING',
      physicsExplanation: 'Trimeresurus pit viper venom is hemotoxic causing tissue necrosis. Muscle movement pumps venom through lymph nodes. Splint like a broken bone and evacuate to TRIHMS or district hospital.'
    },
    {
      hazard: 'Lost in Namdapha / Patkai Jungle',
      rule: 'FOLLOW DRAINAGE SPURS DOWNSLOPE TO MAJOR RIVER CONFLUENCE & USE BAMBOO WATER',
      physicsExplanation: 'Hollow green bamboo (Bambusa tulda) contains potable water in lower internodes. Pierce node with knife. Smoke signals using damp pine/banana leaves produce dense white smoke visible to IAF Mi-17 search flights.'
    }
  ]
};
