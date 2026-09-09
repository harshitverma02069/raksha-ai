import Dexie from 'dexie';

class RakshaDatabase extends Dexie {
  constructor() {
    super('RakshaOfflineDB');
    
    this.version(1).stores({
      roadNodes: 'id, lat, lng',
      roadEdges: 'id, from, to, weight',
      safeZones: 'id, district, capacity',
      cachedAlerts: 'id, type, severity, district',
      sosOutbox: '++id, priority, timestamp, sentStatus', // sentStatus: pending, sent
      userProfile: 'id', // singleton
      hazardCache: 'districtId, lastUpdated'
    });
  }
}

export const offlineDb = new RakshaDatabase();

export const OfflineStore = {
  async initializeOfflineData() {
    console.log('Initializing offline data stores...');
    // Seed offline maps or base data here if needed
  },

  async queueSOS(payload) {
    const id = await offlineDb.sosOutbox.add({
      ...payload,
      timestamp: new Date().toISOString(),
      sentStatus: 'pending'
    });
    return id;
  },

  async getPendingSOS() {
    return await offlineDb.sosOutbox.where('sentStatus').equals('pending').toArray();
  },

  async markSOSSent(id) {
    await offlineDb.sosOutbox.update(id, { sentStatus: 'sent' });
  },

  async cacheHazardData(data) {
    await offlineDb.hazardCache.bulkPut(data.map(item => ({
      ...item,
      lastUpdated: new Date().toISOString()
    })));
  },

  async getCachedHazardData() {
    return await offlineDb.hazardCache.toArray();
  },

  async saveUserProfile(profile) {
    await offlineDb.userProfile.put({ id: 'me', ...profile });
  },

  async getUserProfile() {
    return await offlineDb.userProfile.get('me');
  }
};
