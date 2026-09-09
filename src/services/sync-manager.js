import { OfflineStore } from './offline-store.js';

class SyncManager extends EventTarget {
  constructor() {
    super();
    this.isOnline = navigator.onLine;
    this.syncInterval = null;
    this.retryDelay = 1000;

    window.addEventListener('online', () => this.handleConnectionChange(true));
    window.addEventListener('offline', () => this.handleConnectionChange(false));
  }

  handleConnectionChange(status) {
    this.isOnline = status;
    this.dispatchEvent(new CustomEvent('status_change', { detail: { isOnline: this.isOnline } }));
    
    if (this.isOnline) {
      this.retryDelay = 1000;
      this.triggerImmediateSync();
    }
  }

  checkConnectivity() {
    return this.isOnline;
  }

  async syncSOSQueue() {
    if (!this.isOnline) return;

    const pending = await OfflineStore.getPendingSOS();
    if (pending.length === 0) return;

    console.log(`Syncing ${pending.length} pending SOS signals...`);
    
    for (const sos of pending) {
      try {
        const response = await fetch('http://localhost:3001/api/sos/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sos)
        });
        
        if (response.ok) {
          await OfflineStore.markSOSSent(sos.id);
        }
      } catch (error) {
        console.error('SOS sync failed for item', sos.id, error);
        // Exponential backoff logic could be applied here for individual items
      }
    }
  }

  async syncHazardData() {
    if (!this.isOnline) return;
    try {
      const response = await fetch('http://localhost:3001/api/hazard/current');
      if (response.ok) {
        const data = await response.json();
        await OfflineStore.cacheHazardData(data);
        this.dispatchEvent(new CustomEvent('hazard_synced'));
      }
    } catch (e) {
      console.error('Hazard sync failed', e);
    }
  }

  async syncAlerts() {
    if (!this.isOnline) return;
    // Implementation for syncing alerts
  }

  async triggerImmediateSync() {
    try {
      await Promise.all([
        this.syncSOSQueue(),
        this.syncHazardData(),
        this.syncAlerts()
      ]);
      this.retryDelay = 1000; // Reset backoff on success
    } catch (error) {
      console.error('Sync failed, backing off', error);
      this.retryDelay = Math.min(this.retryDelay * 2, 60000);
      setTimeout(() => this.triggerImmediateSync(), this.retryDelay);
    }
  }

  startPeriodicSync(intervalMs = 60000) {
    this.stopSync();
    this.syncInterval = setInterval(() => {
      this.triggerImmediateSync();
    }, intervalMs);
    console.log(`Periodic sync started (${intervalMs}ms)`);
  }

  stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

export const syncManager = new SyncManager();
