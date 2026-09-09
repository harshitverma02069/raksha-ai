// RAKSHA AI — Comprehensive User Manual & Help Box Index
// Multi-Lingual Mountain Disaster Survival Handbook for Arunachal Pradesh

export const USER_MANUAL_CATEGORIES = [
  { id: 'all', icon: '📚', label: 'All Manuals' },
  { id: 'start', icon: '🚀', label: 'Getting Started' },
  { id: 'personas', icon: '👥', label: 'User Personas' },
  { id: 'escape_3d', icon: '🎬', label: '3D Escape Model' },
  { id: 'tourist', icon: '🧳', label: 'Tourist & Travel' },
  { id: 'resident', icon: '🏡', label: 'Resident Survival' },
  { id: 'telemetry', icon: '📡', label: 'Live Telemetry' },
  { id: 'sos', icon: '🆘', label: 'Emergency SOS' },
  { id: 'gemini', icon: '🤖', label: 'Gemini AI Assistant' },
  { id: 'lifelines', icon: '🏥', label: 'Emergency Lifelines' },
  { id: 'faq', icon: '❓', label: 'FAQ' }
];

export const USER_MANUAL_ITEMS = [
  {
    id: 'um-start-overview',
    category: 'start',
    icon: '🚀',
    title: {
      en: '1. Getting Started: What is RAKSHA AI?',
      hi: '1. शुरुआत: रक्षा एआई (RAKSHA AI) क्या है?',
      ny: '1. Aane Donyi Polo: Raksha AI Hoka Haya?',
      adi: '1. Gidumika: Raksha AI Ingko?',
      gal: '1. Gidai: Raksha AI Heke Emna?',
      mon: '1. Tashi Delek: Raksha AI Gachi In?',
      wan: '1. Man-tai: Raksha AI Cha-a?'
    },
    summary: {
      en: 'RAKSHA AI is a mathematically perfect mountain disaster survival system for Arunachal Pradesh covering all 28 districts, with real-time USGS earthquakes, Open-Meteo rainfall, 3D animated escape models, and Google Gemini AI.',
      hi: 'रक्षा एआई अरुणाचल प्रदेश के सभी 28 जिलों के लिए बनाया गया आपदा जीवन रक्षा तंत्र है, जिसमें लाइव मौसम, भूकंप, 3D एस्केप मॉडल और गूगल जेमिनी एआई शामिल हैं।',
      ny: 'Raksha AI nyishi dolo siko 28 districts dolo nyirup survive hoka system.',
      adi: 'Raksha AI Siang agom dolo 28 districts survival technology.',
      gal: 'Raksha AI Aalo Galo kiding dolo disaster escape system.',
      mon: 'Raksha AI Tawang Monpa yul dolo disaster survival engine.',
      wan: 'Raksha AI Wancho Longding hills dolo survival guide.'
    },
    content: {
      en: `### System Architecture & Offline Resilience
- **Offline-First Architecture**: Operates without cellular coverage inside deep valleys using client-side mathematical physics engines (FoS, TD-MOA*, Fahrboschung reach angle).
- **15 Local & Tribal Languages**: Full UI translation and Web Speech voice synthesis in English, Hindi, Nyishi, Adi, Galo, Monpa, Wancho, Apatani, Tagin, and more.
- **Top Bar Controls**:
  - **Persona Switcher**: Seamlessly switch between Local Resident, Tourist/Visitor, and Statewide Monitor.
  - **Live Marquee Ticker**: Real-time updates for highway blockages and rainfall.
  - **Hazard Report Button**: Broadcast real-time hazards live to all users.`,
      hi: `### सिस्टम आर्किटेक्चर एवं ऑफलाइन कार्यप्रणाली
- **इंटरनेट के बिना भी सक्रिय**: गहरी घाटियों में बिना नेटवर्क के भी भौतिकी व गणितीय मॉडलों (FoS, TD-MOA*) द्वारा कार्य करता है।
- **15 स्थानीय एवं जनजातीय भाषाएं**: हिन्दी, अंग्रेजी, निशि, आदि, गालो, मोनपा, वांचो सहित सभी में बोलकर मार्गदर्शन।
- **मुख्य नियंत्रण बार**:
  - **पर्सोना चयनकर्ता**: स्थानीय निवासी, पर्यटक या मॉनिटर मोड चुनें।
  - **लाइव टिकर**: राजमार्गों की स्थिति व वर्षा की ताजा जानकारी।
  - **आपदा रिपोर्ट**: किसी भी नए भूस्खलन की सूचना तुरंत दर्ज करें।`
    }
  },
  {
    id: 'um-personas-guide',
    category: 'personas',
    icon: '👥',
    title: {
      en: '2. User Personas: Choosing the Right Profile',
      hi: '2. यूजर पर्सोना: अपनी सही श्रेणी कैसे चुनें',
      ny: '2. Persona Switch: Ngunu Haya Persona Tolo?',
      adi: '2. Persona Kiding: Ngolu Emna Persona Lika?',
      gal: '2. Persona: Heke Persona Rika?',
      mon: '2. Persona Kye: Persona Gachi Kye?',
      wan: '2. Persona: Cha-a Persona?'
    },
    summary: {
      en: 'RAKSHA AI adapts its interface and mathematical models into 3 dedicated personas: Local Resident, Tourist / Visitor, and Statewide Monitor.',
      hi: 'रक्षा एआई इंटरफेस और गणनाओं को 3 श्रेणियों में विभाजित करता है: स्थानीय निवासी, पर्यटक / आगंतुक, और राज्यव्यापी मॉनिटर।',
      ny: '3 persona dolo switch ato: Resident, Tourist, Monitor.',
      adi: '3 persona dolo rigo: Resident, Tourist, Monitor.',
      gal: '3 persona ka: Resident, Tourist, Monitor.',
      mon: 'Persona sum yod: Resident, Tourist, Monitor.',
      wan: 'Persona a-dum: Resident, Tourist, Monitor.'
    },
    content: {
      en: `### Persona Profiles:
1. **🏡 Local Resident / Trapped Civilian**:
   - **Primary Objective**: Immediate tactical survival from catastrophic slope failures (FoS < 1.0) and flood surges.
   - **Tools**: Factor of Safety (FoS) parameter sliders, 90° perpendicular sprint vectors, tribal jungle survival (potable bamboo water, wild edible shoots), and P0 SOS Beacon.
2. **🧳 Tourist / Outsider / Visitor / Remote Worker**:
   - **Primary Objective**: Safe transit, pass validation, permit legality, and altitude acclimatization.
   - **Tools**: Sela Tunnel vs Old Pass status, Inner Line Permit (ILP) emergency disaster validity rules, Acute Mountain Sickness (AMS) high-altitude checklist, Assam exit corridors, and homestay safety verifier.
3. **📡 Situational Monitor / Remote Family / Authority**:
   - **Primary Objective**: Statewide overview and telemetry across 28 districts.
   - **Tools**: 28-district vulnerability score table, live USGS seismic tremors in Zone V, live roadways status feed (NH-13, BCT, NH-313), and crowdsourced citizen hazard map pins.`,
      hi: `### पर्सोना प्रोफाइल विवरण:
1. **🏡 स्थानीय निवासी / फंसा हुआ नागरिक**:
   - **प्राथमिक लक्ष्य**: भूस्खलन (FoS < 1.0) व अचानक आई बाढ़ से तत्काल जीवन रक्षा।
   - **सुविधाएं**: FoS स्लाइडर, 90 अंश लंबवत दौड़ वेक्टर, बांस से पीने योग्य पानी निकालना, और आपातकालीन SOS।
2. **🧳 पर्यटक / बाहरी आगंतुक**:
   - **प्राथमिक लक्ष्य**: सुरक्षित यात्रा, सेला सुरंग की स्थिति, परमिट वैधता और ऊंचाई की बीमारी (AMS) से बचाव।
   - **सुविधाएं**: सेला टनल एडवाइजरी, इनर लाइन परमिट (ILP) आपदा विस्तार नियम, असम के लिए निकासी मार्ग (गुवाहाटी, तेजपुर, डिब्रूगढ़)।
3. **📡 राज्यव्यापी मॉनिटर / दूरस्थ परिवार**:
   - **प्राथमिक लक्ष्य**: सभी 28 जिलों की लाइव स्थिति व सड़कों की निगरानी।
   - **सुविधाएं**: लाइव भूकंपीय डाटा (USGS Zone V), राजमार्गों की स्थिति (NH-13, NH-313), और नागरिकों की लाइव रिपोर्ट।`
    }
  },
  {
    id: 'um-escape-3d',
    category: 'escape_3d',
    icon: '🎬',
    title: {
      en: '3. 3D Animated Escape Model: How to Use',
      hi: '3. 3D एनिमेटेड एस्केप मॉडल: उपयोग विधि',
      ny: '3. 3D Escape Model: Haya be Daalo?',
      adi: '3. 3D Escape Model: Ekengka Rigo?',
      gal: '3. 3D Escape Model: Heke be Ekal?',
      mon: '3. 3D Escape Model: Gachi Gyuk?',
      wan: '3. 3D Escape Model: Cha-a?'
    },
    summary: {
      en: 'Experience a physics-driven 3D isometric simulation showing exactly how to escape a mountain landslide or flood with real-time human avatar and tumbling boulders.',
      hi: 'पहाड़ी भूस्खलन या बाढ़ से बचने का वास्तविक 3D भौतिकी सिमुलेशन देखें, जिसमें आपका एनिमेटेड अवतार गिरती चट्टानों से बचकर सुरक्षित कटक की ओर भागता है।',
      ny: '3D animated video model dolo 90 degree slope sprint kene tatla.',
      adi: '3D animated video model dolo perpendicular daalo rigo.',
      gal: '3D animated model dolo safe bedrock ridge kal.',
      mon: '3D animated model dolo safe ridge gyuk.',
      wan: '3D animated model dolo safe path a-dum.'
    },
    content: {
      en: `### How to Use the 3D Escape Model:
1. **Select a Scenario**:
   - **🏔️ Mountain Landslide**: Simulates catastrophic slope failure with 35 tumbling 3D boulders and dust particle clouds.
   - **🌊 Siang River Surge**: Simulates a flash flood dam breach requiring vertical terrace climb.
   - **⛔ Highway Washout**: Simulates vehicle abandonment and foot trail evacuation.
   - **⚡ Zone V Earthquake**: Simulates Drop-Cover-Hold during tremors.
2. **Switch View Mode**:
   - Tap **⛰️ 3D Topo** for immersive 3D elevation perspective with ground shadows.
   - Tap **🗺️ Tactical 2D** for overhead tactical drone map.
3. **Playback Speed Controls**:
   - Choose **0.5x** (Slow-motion study), **1.0x** (Real-time speed), or **2.0x** (Fast preview).
4. **Scrubber Slider**: Drag the slider to review the escape at any second.
5. **🔊 Vocal Guide**: Tap to hear step-by-step vocal instructions in your selected language!`,
      hi: `### 3D एस्केप मॉडल का उपयोग कैसे करें:
1. **आपदा परिदृश्य चुनें**:
   - **🏔️ पहाड़ी भूस्खलन**: 35 गिरती हुई 3D चट्टानों और धूल के बादलों के बीच लंबवत दौड़।
   - **🌊 सियांग नदी बाढ़**: नदी के किनारे से कम से कम 15 मीटर ऊपर पहाड़ी पर चढ़ने का अभ्यास।
   - **⛔ राजमार्ग अवरोध**: गाड़ी छोड़कर सुरक्षित पहाड़ी पगडंडी की ओर जाना।
   - **⚡ जोन V भूकंप**: झटकों के दौरान 'ड्रॉप-कवर-होल्ड'।
2. **कैमरा व्यू बदलें**:
   - **⛰️ 3D Topo**: 3D पर्वतीय दृश्य देखने के लिए।
   - **🗺️ Tactical 2D**: ऊपर से ड्रोन मैप देखने के लिए।
3. **गति नियंत्रण**: 0.5x (धीमी गति), 1.0x (सामान्य), या 2.0x (तेज गति)।
4. **🔊 Vocal Guide**: अपनी चुनी हुई भाषा में आवाज द्वारा निर्देश सुनने के लिए टैप करें!`
    }
  },
  {
    id: 'um-tourist-guide',
    category: 'tourist',
    icon: '🧳',
    title: {
      en: '4. Tourist Survival & Travel Feasibility Guide',
      hi: '4. पर्यटक जीवन रक्षा एवं यात्रा मार्गदर्शन',
      ny: '4. Tourist Guide: Sela Tunnel & ILP Lam',
      adi: '4. Tourist Guide: Sela Tunnel & ILP Lam',
      gal: '4. Tourist Guide: Sela Tunnel & ILP Lam',
      mon: '4. Tourist Guide: Sela Tunnel & ILP Lam',
      wan: '4. Tourist Guide: Sela Tunnel & ILP Lam'
    },
    summary: {
      en: 'Essential survival rules for travelers: Sela Tunnel vs Old Sela Pass live status, ILP disaster extension rights, Acute Mountain Sickness (AMS), and Assam exit corridors.',
      hi: 'यात्रियों के लिए महत्वपूर्ण नियम: सेला टनल बनाम पुराना दर्रा, इनर लाइन परमिट (ILP) आपदा विस्तार कानून, ऊंचाई की बीमारी (AMS), और असम वापसी मार्ग।',
      ny: 'Tourist kene Sela Tunnel, ILP extension, and AMS high-altitude advice.',
      adi: 'Tourist kene Sela Tunnel, ILP extension, and AMS high-altitude advice.',
      gal: 'Tourist kene Sela Tunnel, ILP extension, and AMS high-altitude advice.',
      mon: 'Tourist kene Sela Tunnel, ILP extension, and AMS high-altitude advice.',
      wan: 'Tourist kene Sela Tunnel, ILP extension, and AMS high-altitude advice.'
    },
    content: {
      en: `### Critical Tourist Protocols:
1. **Sela Tunnel vs Old Pass**:
   - **Sela Tunnel (13,000 ft)**: The new twin-tube tunnel (Tunnel 1: 980m, Tunnel 2: 1,555m) is **all-weather operational and safe**.
   - **Old Sela Pass (13,700 ft)**: Prone to black ice, sudden blizzards, and rockfalls. **Mandatory diversion through Sela Tunnel**.
2. **Inner Line Permit (ILP) Disaster Extension**:
   - Under Section 4 of Bengal Eastern Frontier Regulation 1873 during state-declared red-alert natural disasters (landslides/washouts), tourists stranded past their permit expiration are granted **automatic legal immunity and temporary transit extension**. Contact nearest District Tourist Officer (DTO) or DC office.
3. **Acute Mountain Sickness (AMS)**:
   - Tawang is at 10,000 ft and Bum La is at 15,200 ft. **Never travel directly from Guwahati/Tezpur in one single day**. Stop overnight at Dirang (1,560m) or Bomdila (2,415m).
   - If severe headache, breathlessness, or vomiting occurs, **DESCENT IS THE ONLY CURE**. Drop at least 500-1,000m immediately.
4. **Assam Exit Corridors**:
   - West: BCT Road -> Bhalukpong -> **Tezpur Airport (TEZ)** or **Guwahati (GAU)**.
   - Central: Hollongi -> **Donyi Polo Airport Itanagar (HGI)** with daily flights to Kolkata/Delhi.
   - East: NH-515 & Bogibeel Bridge -> **Dibrugarh Airport (DIB)**.`,
      hi: `### पर्यटकों के लिए महत्वपूर्ण दिशानिर्देश:
1. **सेला सुरंग बनाम पुराना सेला दर्रा**:
   - **सेला टनल (13,000 फीट)**: नई दोहरी ट्यूब सुरंग हर मौसम में खुली व पूरी तरह सुरक्षित है।
   - **पुराना दर्रा (13,700 फीट)**: बर्फ जमने (ब्लैक आइस) और चट्टानों के गिरने के कारण बंद रहता है। सेला सुरंग का ही उपयोग करें।
2. **इनर लाइन परमिट (ILP) आपदा विस्तार**:
   - बंगाल ईस्टर्न फ्रंटियर रेगुलेशन 1873 की धारा 4 के तहत, प्राकृतिक आपदा में फंसे पर्यटकों का परमिट स्वतः बढ़ जाता है। किसी भी कानूनी परेशानी की चिंता न करें।
3. **ऊंचाई की बीमारी (AMS)**:
   - तवांग (10,000 फीट) जाने से पहले दिरांग या बोमडिला में एक रात जरूर रुकें।
   - सिरदर्द या उल्टी होने पर तुरंत नीचे की ओर उतरना ही एकमात्र सुरक्षित इलाज है।
4. **असम के लिए सुरक्षित निकास**:
   - पश्चिम: भालुकपोंग होकर **तेजपुर** या **गुवाहाटी** हवाई अड्डा।
   - मध्य: होलोंगी होकर **डोनी पोलो हवाई अड्डा ईटानगर (HGI)**।
   - पूर्व: बोगीबील पुल होकर **डिब्रूगढ़ हवाई अड्डा (DIB)**।`
    }
  },
  {
    id: 'um-resident-guide',
    category: 'resident',
    icon: '🏡',
    title: {
      en: '5. Local Resident Survival: FoS Physics & Tribal Jungle Wisdom',
      hi: '5. स्थानीय निवासी जीवन रक्षा: FoS भौतिकी व जनजातीय जंगल ज्ञान',
      ny: '5. Nyishi Dolo Survival: Siko Water & Molo Daalo',
      adi: '5. Adi Survival: Siang Flood & Wild Plants',
      gal: '5. Galo Survival: Aalo Hills & Bedrock Ridge',
      mon: '5. Monpa Survival: Snow Blizzard & Rock Shelter',
      wan: '5. Wancho Survival: Bamboo Water & Forest Shelter'
    },
    summary: {
      en: 'Life-or-death slope failure physics (FoS < 1.0), 90-degree lateral sprint, potable water tapping from mountain bamboo, edible wild plants, and rain shelters.',
      hi: 'पहाड़ी ढलान स्थिरता भौतिकी (FoS < 1.0), 90 डिग्री लंबवत दौड़, बांस से पीने योग्य पानी निकालना, और जंगल में सुरक्षित कंद-मूल।',
      ny: 'Dolo siko nyirup, bamboo potable water, and edible forest shoots.',
      adi: 'Dolo siko nyirup, bamboo potable water, and edible forest shoots.',
      gal: 'Dolo siko nyirup, bamboo potable water, and edible forest shoots.',
      mon: 'Dolo siko nyirup, bamboo potable water, and edible forest shoots.',
      wan: 'Dolo siko nyirup, bamboo potable water, and edible forest shoots.'
    },
    content: {
      en: `### Resident Survival Tactics:
1. **The 90° Perpendicular Sprint**:
   - When a landslide begins, **NEVER run downslope along the fall line**.
   - Immediately sprint at a 90° right angle to the flow path toward the nearest solid bedrock ridge.
   - Debris flows travel at 12–25 m/s; you cannot outrun them downhill, but moving laterally 15–20 meters moves you outside the runout envelope.
2. **Potable Water from Mountain Bamboo**:
   - Large mountain bamboo (*Dendrocalamus hamiltonii*) stores clean, pre-filtered drinking water in sealed lower internodes.
   - Tap by piercing the node joint with a clean knife. Safe to drink directly.
3. **Safe Wild Edible Plants**:
   - Wild fiddlehead ferns (*dhekia saag*), inner shoot core of wild banana tree (*kola thol*), and young bamboo shoots (*eup* / *bamboo shoots*).
   - Avoid brightly colored wild mushrooms and plants with milky latex sap.
4. **Torrential Rain Shelter**:
   - Build a 45° single-pitch lean-to using split bamboo rafters.
   - Shingle heavily with broad *Tokopat* (Livistona jenkinsiana) or wild banana leaves pointing downward.`,
      hi: `### स्थानीय जीवन रक्षा तकनीक:
1. **90 डिग्री लंबवत दौड़**:
   - भूस्खलन शुरू होते ही ढलान के नीचे कभी न भागें!
   - मलबे के बहाव की दिशा से 90 अंश के कोण पर किसी मजबूत चट्टानी रिज की ओर तुरंत दौड़ें।
2. **बांस से पीने का पानी**:
   - बड़े पहाड़ी बांस (*डेंड्रोकैलेमस हैमिल्टोनी*) के निचले जोड़ों में शुद्ध, प्राकृतिक रूप से छना हुआ पीने योग्य पानी होता है।
   - चाकू से छेद करके यह पानी सीधे पिया जा सकता है।
3. **जंगल में सुरक्षित खाद्य पदार्थ**:
   - ढेकिया साग (Fiddlehead fern), जंगली केले का भीतरी तना, और बांस की ताजी कोपलें।
   - सफेद दूधिया रस वाले पौधों व चमकीले मशरूम से दूर रहें।
4. **आपातकालीन बांस की छतरी/शेल्टर**:
   - बांस के ढांचे पर तोकोपात (Tokopat) या जंगली केले के बड़े पत्तों को नीचे की ओर ढलान में लगाकर जलरोधी शेल्टर बनाएं।`
    }
  },
  {
    id: 'um-telemetry-gis',
    category: 'telemetry',
    icon: '📡',
    title: {
      en: '6. Live Telemetry & GIS Survival Map',
      hi: '6. लाइव टेलीमेट्री एवं जीआईएस रक्षा मानचित्र',
      ny: '6. Live Telemetry & Leaflet Map',
      adi: '6. Live Telemetry & Leaflet Map',
      gal: '6. Live Telemetry & Leaflet Map',
      mon: '6. Live Telemetry & Leaflet Map',
      wan: '6. Live Telemetry & Leaflet Map'
    },
    summary: {
      en: 'Understanding real-time weather feeds (Open-Meteo), USGS earthquake monitoring in Zone V, live roadway statuses, and reporting hazards.',
      hi: 'ओपन-मेटियो मौसम डाटा, यूएसजीएस जोन V भूकंप फीड, लाइव सड़क स्थिति और आपदा रिपोर्टिंग का उपयोग।',
      ny: 'Live weather, USGS seismic quakes, and road status map.',
      adi: 'Live weather, USGS seismic quakes, and road status map.',
      gal: 'Live weather, USGS seismic quakes, and road status map.',
      mon: 'Live weather, USGS seismic quakes, and road status map.',
      wan: 'Live weather, USGS seismic quakes, and road status map.'
    },
    content: {
      en: `### Live Telemetry Capabilities:
1. **Open-Meteo Weather**: Fetches authentic 1h rainfall, 24h accumulated rain, temperature, and soil moisture directly for your GPS coordinates.
2. **USGS Live Seismic Feed**: Monitors earthquake tremors along the Main Central Thrust and Mishmi fault lines in Zone V.
3. **Live Roadway Arteries**: Real-time status for NH-13, Sela Tunnel, NH-313, and NH-515.
4. **Citizen Hazard Reporting**:
   - Tap **📢 Report Hazard** in the top ribbon.
   - Choose hazard type, location, and description.
   - Report is broadcast via SSE and pinned on the map in real time!`,
      hi: `### लाइव टेलीमेट्री सुविधाएं:
1. **मौसम फीड (Open-Meteo)**: आपके जीपीएस स्थान की वास्तविक वर्षा (मिमी/घंटा) व तापमान।
2. **भूकंप फीड (USGS)**: हिमालयी जोन V फॉल्ट लाइनों पर आने वाले भूकंपों की लाइव निगरानी।
3. **राजमार्ग स्थिति**: NH-13, सेला टनल, NH-313 की लाइव चालू/बंद स्थिति।
4. **नागरिक आपदा रिपोर्टिंग**:
   - टॉप बार में **📢 Report Hazard** पर क्लिक करें।
   - भूस्खलन या सड़क टूटने की सूचना दर्ज करें; यह तुरंत सभी उपयोगकर्ताओं के मानचित्र पर दिखने लगेगी!`
    }
  },
  {
    id: 'um-sos-beacon',
    category: 'sos',
    icon: '🆘',
    title: {
      en: '7. Emergency SOS Beacon & Satellite/SMS Triage',
      hi: '7. आपातकालीन एसओएस बीकन एवं सैटेलाइट/एसएमएस प्रारूप',
      ny: '7. Emergency SOS Beacon & NDRF Call',
      adi: '7. Emergency SOS Beacon & NDRF Call',
      gal: '7. Emergency SOS Beacon & NDRF Call',
      mon: '7. Emergency SOS Beacon & NDRF Call',
      wan: '7. Emergency SOS Beacon & NDRF Call'
    },
    summary: {
      en: 'How to trigger priority P0 distress packets with exact GPS coordinates, altitude, battery level, and headcount directly to 12th Bn NDRF and State EOC.',
      hi: 'सटीक जीपीएस, ऊंचाई, बैटरी प्रतिशत और व्यक्तियों की संख्या के साथ 12वीं बटालियन एनडीआरएफ व राज्य आपदा नियंत्रण कक्ष को P0 संकट संदेश भेजना।',
      ny: 'SOS button tap kene 12th Bn NDRF Doimukh direct distress call aato.',
      adi: 'SOS button tap kene 12th Bn NDRF Doimukh direct distress call aato.',
      gal: 'SOS button tap kene 12th Bn NDRF Doimukh direct distress call aato.',
      mon: 'SOS button tap kene 12th Bn NDRF Doimukh direct distress call aato.',
      wan: 'SOS button tap kene 12th Bn NDRF Doimukh direct distress call aato.'
    },
    content: {
      en: `### Triggering Emergency SOS:
1. Navigate to the **🆘 SOS Beacon** tab.
2. Tap the large pulsating **SOS** button.
3. The system transmits a structured distress packet containing:
   - **GPS Coordinates**: Exact Latitude and Longitude.
   - **Altitude**: Meter elevation above sea level.
   - **Triage**: UNINJURED / WOUNDED / IMMOBILE.
   - **Headcount**: Number of individuals in your party.
4. **Satellite & SMS String**:
   - If mobile data is absent, tap **📋 COPY SOS STRING & DIAL 112**.
   - Copy-pastes the standardized compact format for satellite phones or low-signal 2G SMS.`,
      hi: `### आपातकालीन एसओएस का उपयोग:
1. **🆘 SOS Beacon** टैब पर जाएं।
2. बड़े लाल **SOS** बटन पर टैप करें।
3. सिस्टम तुरंत आपका जीपीएस, ऊंचाई, बैटरी स्तर और लोगों की संख्या आपदा नियंत्रण कक्ष को भेजता है।
4. **सैटेलाइट फोन व एसएमएस प्रारूप**:
   - यदि इंटरनेट न हो, तो **📋 COPY SOS STRING & DIAL 112** पर टैप करें।
   - यह संदेश को कम सिग्नल वाले साधारण एसएमएस या सैटेलाइट फोन के लिए कॉपी कर देता है।`
    }
  },
  {
    id: 'um-gemini-assistant',
    category: 'gemini',
    icon: '🤖',
    title: {
      en: '8. Gemini Survival Assistant: Voice Input & API Setup',
      hi: '8. जेमिनी सर्वाइवल असिस्टेंट: वॉयस इनपुट एवं एपीआई सेटअप',
      ny: '8. Gemini AI Assistant: Agom & Voice Guide',
      adi: '8. Gemini AI Assistant: Agom & Voice Guide',
      gal: '8. Gemini AI Assistant: Agom & Voice Guide',
      mon: '8. Gemini AI Assistant: Agom & Voice Guide',
      wan: '8. Gemini AI Assistant: Agom & Voice Guide'
    },
    summary: {
      en: 'Conversational mountain survival intelligence with Google Gemini 1.5 Flash, microphone voice dictation, speech synthesis read-aloud, and local offline fallback.',
      hi: 'गूगल जेमिनी 1.5 फ्लैश द्वारा संचालित वार्तालाप एआई, माइक्रोफोन द्वारा आवाज से प्रश्न पूछना, बोलकर उत्तर सुनना, और ऑफलाइन बैकअप।',
      ny: 'Google Gemini AI kene voice dictation and local neural engine.',
      adi: 'Google Gemini AI kene voice dictation and local neural engine.',
      gal: 'Google Gemini AI kene voice dictation and local neural engine.',
      mon: 'Google Gemini AI kene voice dictation and local neural engine.',
      wan: 'Google Gemini AI kene voice dictation and local neural engine.'
    },
    content: {
      en: `### Using the Gemini Survival Assistant:
1. **Voice Dictation (Microphone)**:
   - Tap the 🎙️ **Microphone button** next to the input box.
   - Speak your emergency question naturally in English, Hindi, or local dialect.
   - Speech-to-Text automatically transcribes your query.
2. **Audio Read-Aloud**:
   - Every AI response features a 🔊 **Listen / Speak** button that reads out the survival guidance in your selected language.
3. **Adding a Free Google Gemini API Key**:
   - Tap **🔑 Gemini Key** in the top right of the assistant tab.
   - Get a 100% free API key from **Google AI Studio** (\`aistudio.google.com\`).
   - Paste your key and click **Verify & Save Key**.
   - A green badge **✨ Gemini 1.5 Flash Connected** will confirm activation!
4. **Offline Neural Engine**:
   - If you have no key or lose internet connection, the system automatically uses the high-precision **Local Offline Neural Survival Engine** with full knowledge of all 28 districts.`,
      hi: `### जेमिनी सर्वाइवल असिस्टेंट का उपयोग:
1. **आवाज द्वारा पूछें (माइक्रोफोन)**:
   - इनपुट बॉक्स के पास 🎙️ **माइक बटन** पर टैप करें।
   - अपना प्रश्न बोलें; सिस्टम आपकी आवाज को टेक्स्ट में बदल देगा।
2. **बोलकर सुनें**:
   - प्रत्येक उत्तर के साथ दिए गए 🔊 **Listen** बटन पर टैप करके अपनी चुनी हुई भाषा में उत्तर सुनें।
3. **मुफ्त गूगल जेमिनी एपीआई की (Key) जोड़ें**:
   - ऊपर दाईं ओर **🔑 Gemini Key** पर टैप करें।
   - **Google AI Studio** (\`aistudio.google.com\`) से मुफ्त की प्राप्त करें और सेव करें।
   - हरा बैज **✨ Gemini 1.5 Flash Connected** सक्रियता की पुष्टि करेगा।
4. **ऑफलाइन न्यूरल इंजन**:
   - नेटवर्क न होने पर भी स्थानीय इंजन सभी 28 जिलों की संपूर्ण जानकारी के साथ तुरंत उत्तर देता है।`
    }
  },
  {
    id: 'um-lifelines-directory',
    category: 'lifelines',
    icon: '🏥',
    title: {
      en: '9. 28 Districts Emergency Lifelines Directory',
      hi: '9. 28 जिलों की आपातकालीन जीवन रेखा निर्देशिका',
      ny: '9. 28 Districts Hospital & Helpline Directory',
      adi: '9. 28 Districts Hospital & Helpline Directory',
      gal: '9. 28 Districts Hospital & Helpline Directory',
      mon: '9. 28 Districts Hospital & Helpline Directory',
      wan: '9. 28 Districts Hospital & Helpline Directory'
    },
    summary: {
      en: 'Contact numbers for State Emergency Operations Centre (1070), 12th Bn NDRF Doimukh, Advanced Landing Grounds (ALGs), and major trauma hospitals.',
      hi: 'राज्य आपदा संचालन केंद्र (1070), 12वीं बटालियन एनडीआरएफ, एडवांस लैंडिंग ग्राउंड्स (ALGs), और जिला अस्पतालों के संपर्क सूत्र।',
      ny: 'SEOC 1070, 12th Bn NDRF Doimukh, and hospital phone numbers.',
      adi: 'SEOC 1070, 12th Bn NDRF Doimukh, and hospital phone numbers.',
      gal: 'SEOC 1070, 12th Bn NDRF Doimukh, and hospital phone numbers.',
      mon: 'SEOC 1070, 12th Bn NDRF Doimukh, and hospital phone numbers.',
      wan: 'SEOC 1070, 12th Bn NDRF Doimukh, and hospital phone numbers.'
    },
    content: {
      en: `### Key Emergency Helplines:
- **State Emergency Operations Centre (SEOC) Itanagar**: **1070** / **0360-2212268**
- **12th Battalion NDRF (Doimukh / Emchi)**: **0360-2277107** / **+91-9436040801**
- **State Police Emergency**: **112** / **100**
- **Medical Emergency Ambulance**: **108**
- **Arunachal Tourism Emergency Helpline**: **1800-345-3657**
- **District Control Rooms**: **1077** (prefix local district code)

### Advanced Landing Grounds (ALGs) for Aerial Evacuation:
- **Mechuka ALG** (Shi Yomi, 1,829m) — Dual-use IAF/Civil
- **Tuting ALG** (Upper Siang, 730m) — Northern border valley bridge
- **Pasighat ALG** (East Siang, 155m) — Commercial ATR-72 / IAF
- **Walong ALG** (Anjaw, 1,090m) — Easternmost frontier lifeline
- **Ziro ALG** (Lower Subansiri, 1,572m) — Central valley staging
- **Aalo ALG** (West Siang, 610m) — Operational strip`,
      hi: `### प्रमुख आपातकालीन टेलीफोन नंबर:
- **राज्य आपदा नियंत्रण कक्ष (SEOC ईटानगर)**: **1070** / **0360-2212268**
- **12वीं बटालियन एनडीआरएफ दोईमुख**: **0360-2277107**
- **पुलिस आपातकालीन सेवा**: **112** / **100**
- **एंबुलेंस सेवा**: **108**
- **पर्यटन हेल्पलाइन**: **1800-345-3657**
- **जिला आपदा नियंत्रण कक्ष**: **1077**

### हवाई निकासी केंद्र (ALGs):
- **मेचुका एएलजी** (शी योमी) — सीमावर्ती घाटी
- **तूटिंग एएलजी** (अपर सियांग) — उत्तरी सीमा
- **पासीघाट एएलजी** (ईस्ट सियांग) — वाणिज्यिक हवाई अड्डा
- **वालोंग एएलजी** (अंजाॉ) — पूर्वी सीमावर्ती केंद्र
- **जीरो एएलजी** (लोअर सुबनसिरी) — मध्य अरुणाचल केंद्र`
    }
  },
  {
    id: 'um-faq',
    category: 'faq',
    icon: '❓',
    title: {
      en: '10. Frequently Asked Questions (FAQ)',
      hi: '10. अक्सर पूछे जाने वाले प्रश्न (FAQ)',
      ny: '10. FAQ: Ngunu Questions & Answers',
      adi: '10. FAQ: Ngolu Questions & Answers',
      gal: '10. FAQ: Heke Questions & Answers',
      mon: '10. FAQ: Questions & Answers',
      wan: '10. FAQ: Questions & Answers'
    },
    summary: {
      en: 'Common questions about offline functionality, GPS battery conservation, traveling during monsoon, and language support.',
      hi: 'इंटरनेट के बिना उपयोग, जीपीएस बैटरी बचत, मानसून में यात्रा और भाषा समर्थन संबंधी प्रश्न।',
      ny: 'Offline usage, GPS battery, monsoon travel FAQ.',
      adi: 'Offline usage, GPS battery, monsoon travel FAQ.',
      gal: 'Offline usage, GPS battery, monsoon travel FAQ.',
      mon: 'Offline usage, GPS battery, monsoon travel FAQ.',
      wan: 'Offline usage, GPS battery, monsoon travel FAQ.'
    },
    content: {
      en: `### Frequently Asked Questions:
- **Q: Does RAKSHA AI work without mobile signal or internet?**
  - **A**: YES! The application is an offline-first Progressive Web App (PWA). The 3D escape simulation, Factor of Safety (FoS) calculator, offline maps, tribal survival guides, and local neural AI engine run completely offline inside your browser.
- **Q: How does the AI speak in local tribal languages?**
  - **A**: RAKSHA AI uses phonetic text-to-speech mapping specifically crafted for Nyishi, Adi, Galo, Monpa, Wancho, and Hindi dialects with authentic mountain terminology.
- **Q: Is my Gemini API key stored securely?**
  - **A**: Yes. Your API key is stored locally in your browser's encrypted localStorage and only sent securely over HTTPS directly to Google's API.
- **Q: What if a landslide blocks my route on NH-13?**
  - **A**: Switch to the **Escape Nav** tab to compute multi-modal detour routes through feeder trails, river terraces, or nearby Advanced Landing Grounds (ALGs).`,
      hi: `### अक्सर पूछे जाने वाले प्रश्न:
- **प्र: क्या रक्षा एआई बिना मोबाइल नेटवर्क या इंटरनेट के काम करता है?**
  - **उ**: हाँ! यह एक ऑफलाइन-फर्स्ट PWA है। 3D सिमुलेशन, FoS कैलकुलेटर, ऑफलाइन नक्शे और स्थानीय न्यूरल इंजन बिना इंटरनेट के भी पूरी तरह काम करते हैं।
- **प्र: एआई स्थानीय जनजातीय भाषाएं कैसे बोलता है?**
  - **उ**: रक्षा एआई में निशि, आदि, गालो, मोनपा, वांचो और हिन्दी के लिए विशेष फोनेटिक शब्दावली तैयार की गई है।
- **प्र: क्या मेरी जेमिनी एपीआई की (Key) सुरक्षित है?**
  - **उ**: बिल्कुल। आपकी एपीआई की केवल आपके डिवाइस के स्थानीय ब्राउज़र स्टोरेज में रहती है और सीधे सुरक्षित गूगल सर्वर से संपर्क करती है।`
    }
  }
];
