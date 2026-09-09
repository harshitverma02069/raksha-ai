export const EMERGENCY_RESOURCES = {
  ndrf: [
    { id: 'ndrf_1', name: '12th Bn NDRF (Doimukh)', lat: 27.1350, lon: 93.7118, type: 'NDRF', capacity: 'Battalion', contact: '0360-2277114' },
    { id: 'ndrf_2', name: 'NDRF RRC (Pasighat)', lat: 28.0622, lon: 95.3262, type: 'NDRF', capacity: 'Company', contact: '03784-222222' }
  ],
  sdrf: [
    { id: 'sdrf_1', name: 'SDRF HQ (Itanagar)', lat: 27.0850, lon: 93.6067, type: 'SDRF', capacity: 'Company', contact: '1077' },
    { id: 'sdrf_2', name: 'SDRF Unit (Dirang)', lat: 27.3582, lon: 92.2346, type: 'SDRF', capacity: 'Platoon', contact: '1077' },
    { id: 'sdrf_3', name: 'SDRF Unit (Tezu)', lat: 27.9179, lon: 96.1661, type: 'SDRF', capacity: 'Platoon', contact: '1077' }
  ],
  army: [
    { id: 'army_iv_corps', name: 'IV Corps HQ (Tezpur, covers West)', lat: 26.6528, lon: 92.7926, type: 'Army', capacity: 'Corps HQ', contact: 'Military Ops' },
    { id: 'army_iii_corps', name: 'III Corps HQ (Dimapur, covers East)', lat: 25.9060, lon: 93.7255, type: 'Army', capacity: 'Corps HQ', contact: 'Military Ops' },
    { id: 'army_5_mtn_div', name: '5 Mountain Division (Tenga)', lat: 27.2000, lon: 92.4500, type: 'Army', capacity: 'Division', contact: 'Military Ops' },
    { id: 'army_2_mtn_div', name: '2 Mountain Division (Dinjan)', lat: 27.5000, lon: 95.3000, type: 'Army', capacity: 'Division', contact: 'Military Ops' }
  ],
  itbp: [
    { id: 'itbp_neloc', name: 'ITBP NE Frontier HQ (Itanagar)', lat: 27.1000, lon: 93.6100, type: 'ITBP', capacity: 'Sector HQ', contact: '0360-221234' },
    { id: 'itbp_alo', name: 'ITBP Sector HQ (Aalo)', lat: 28.1691, lon: 94.7963, type: 'ITBP', capacity: 'Sector HQ', contact: '03783-22234' }
  ],
  hospitals: [
    { id: 'hosp_trihms', name: 'TRIHMS (Naharlagun)', lat: 27.1066, lon: 93.7029, beds: 500, type: 'State Referral Hospital', hasTraumaCenter: true, hasBloodBank: true, contact: '0360-2244293' },
    { id: 'hosp_bpgh', name: 'BPGH (Pasighat)', lat: 28.0622, lon: 95.3262, beds: 300, type: 'Regional Referral Hospital', hasTraumaCenter: true, hasBloodBank: true, contact: '03784-222014' },
    { id: 'hosp_rkm', name: 'Ramakrishna Mission Hospital (Itanagar)', lat: 27.0850, lon: 93.6067, beds: 250, type: 'Tertiary Charitable Hospital', hasTraumaCenter: true, hasBloodBank: true, contact: '0360-2212263' },
    { id: 'hosp_tawang', name: 'District Hospital Tawang', lat: 27.5861, lon: 91.8775, beds: 100, type: 'District Hospital', hasTraumaCenter: true, hasBloodBank: true, contact: '03794-222222' },
    { id: 'hosp_bomdila', name: 'General Hospital Bomdila', lat: 27.2645, lon: 92.4159, beds: 120, type: 'General Hospital', hasTraumaCenter: true, hasBloodBank: true, contact: '03782-222021' },
    { id: 'hosp_seppa', name: 'District Hospital Seppa', lat: 27.3639, lon: 93.0336, beds: 80, type: 'District Hospital', hasTraumaCenter: false, hasBloodBank: true, contact: '03787-222223' },
    { id: 'hosp_ziro', name: 'General Hospital Ziro', lat: 27.5623, lon: 93.8344, beds: 100, type: 'General Hospital', hasTraumaCenter: true, hasBloodBank: true, contact: '03788-224255' },
    { id: 'hosp_daporijo', name: 'District Hospital Daporijo', lat: 27.9868, lon: 94.2185, beds: 90, type: 'District Hospital', hasTraumaCenter: true, hasBloodBank: false, contact: '03792-223233' },
    { id: 'hosp_aalo', name: 'General Hospital Aalo', lat: 28.1691, lon: 94.7963, beds: 120, type: 'General Hospital', hasTraumaCenter: true, hasBloodBank: true, contact: '03783-222216' },
    { id: 'hosp_yingkiong', name: 'District Hospital Yingkiong', lat: 28.6145, lon: 95.0483, beds: 75, type: 'District Hospital', hasTraumaCenter: false, hasBloodBank: false, contact: '03777-222225' },
    { id: 'hosp_roing', name: 'District Hospital Roing', lat: 28.1408, lon: 95.8447, beds: 90, type: 'District Hospital', hasTraumaCenter: true, hasBloodBank: true, contact: '03803-222223' },
    { id: 'hosp_anini', name: 'District Hospital Anini', lat: 28.7950, lon: 95.9015, beds: 50, type: 'District Hospital', hasTraumaCenter: false, hasBloodBank: false, contact: '03801-222224' },
    { id: 'hosp_tezu', name: 'Zonal General Hospital Tezu', lat: 27.9179, lon: 96.1661, beds: 120, type: 'Zonal General Hospital', hasTraumaCenter: true, hasBloodBank: true, contact: '03804-222226' },
    { id: 'hosp_hawai', name: 'District Hospital Hawai', lat: 27.8825, lon: 96.8005, beds: 50, type: 'District Hospital', hasTraumaCenter: false, hasBloodBank: false, contact: '03805-222227' },
    { id: 'hosp_namsai', name: 'District Hospital Namsai', lat: 27.6710, lon: 95.8752, beds: 100, type: 'District Hospital', hasTraumaCenter: true, hasBloodBank: true, contact: '03806-222228' },
    { id: 'hosp_changlang', name: 'District Hospital Changlang', lat: 27.1264, lon: 95.7366, beds: 75, type: 'District Hospital', hasTraumaCenter: false, hasBloodBank: false, contact: '03786-222229' },
    { id: 'hosp_khonsa', name: 'District Hospital Khonsa', lat: 27.0270, lon: 95.5323, beds: 80, type: 'District Hospital', hasTraumaCenter: true, hasBloodBank: false, contact: '03786-222230' },
    { id: 'hosp_longding', name: 'District Hospital Longding', lat: 26.8667, lon: 95.3333, beds: 60, type: 'District Hospital', hasTraumaCenter: false, hasBloodBank: false, contact: '03786-222231' },
    { id: 'hosp_mechuka', name: 'CHC Mechuka High Altitude Medical Unit', lat: 28.5991, lon: 94.1378, beds: 40, type: 'Community Health Centre', hasTraumaCenter: true, hasBloodBank: false, contact: '03783-222232' },
    { id: 'hosp_basar', name: 'District Hospital Basar', lat: 27.9833, lon: 94.6667, beds: 70, type: 'District Hospital', hasTraumaCenter: false, hasBloodBank: false, contact: '03783-222233' },
    { id: 'hosp_boleng', name: 'District Hospital Boleng', lat: 28.3333, lon: 94.9667, beds: 60, type: 'District Hospital', hasTraumaCenter: false, hasBloodBank: false, contact: '03777-222234' },
    { id: 'hosp_likabali', name: 'District Hospital Likabali', lat: 27.6500, lon: 94.6500, beds: 60, type: 'District Hospital', hasTraumaCenter: false, hasBloodBank: false, contact: '03783-222235' }
  ],
  fciDepots: [
    { id: 'fci_1', name: 'FCI Depot Bhalukpong', lat: 27.0051, lon: 92.6465, capacity_mt: 5000 },
    { id: 'fci_2', name: 'FCI Depot Karsingsa', lat: 27.1500, lon: 93.7500, capacity_mt: 10000 },
    { id: 'fci_3', name: 'FCI Depot Pasighat', lat: 28.0622, lon: 95.3262, capacity_mt: 8000 },
    { id: 'fci_4', name: 'FCI Depot Tezu', lat: 27.9179, lon: 96.1661, capacity_mt: 6000 },
    { id: 'fci_5', name: 'FCI Depot Ziro', lat: 27.5623, lon: 93.8344, capacity_mt: 3000 },
    { id: 'fci_6', name: 'FCI Depot Roing', lat: 28.1408, lon: 95.8447, capacity_mt: 4500 },
    { id: 'fci_7', name: 'FCI Depot Khonsa', lat: 27.0270, lon: 95.5323, capacity_mt: 2000 }
  ],
  seoc: {
    name: 'State Emergency Operation Centre (Itanagar)',
    lat: 27.0850, lon: 93.6067,
    contact: '1070', altContact: '0360-2292087',
    email: 'seoc-arn@nic.in'
  },
  emergencyNumbers: {
    police: '100', fire: '101', ambulance: '102', disaster: '108',
    womenHelpline: '1091', childHelpline: '1098'
  }
};
