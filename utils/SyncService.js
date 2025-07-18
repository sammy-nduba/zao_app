export class SyncService {
  static startSync(userId, container, isVerified, isRegistrationComplete) {
    console.log('SyncService: Starting sync for user:', userId, 'isVerified:', isVerified, 'isRegistrationComplete:', isRegistrationComplete);
    if (!userId) {
      console.warn('SyncService: No userId provided, skipping sync');
      return () => {};
    }
    if (!container) {
      console.warn('SyncService: No container provided, skipping sync');
      return () => {};
    }
    if (!isVerified) {
      console.warn('SyncService: User not verified, skipping sync');
      return () => {};
    }
    if (!isRegistrationComplete) {
      console.warn('SyncService: Registration not complete, skipping sync');
      return () => {};
    }

    let isSyncing = false;
    const sync = async () => {
      if (isSyncing) {
        console.log('SyncService: Already syncing, skipping');
        return;
      }
      isSyncing = true;
      try {
        console.log('SyncService: Device online, starting sync');
        const farmerRepository = container.get('farmerRepository');
        const farmerData = await farmerRepository.getFarmer(userId);
        if (farmerData) {
          console.log('SyncService: Fetched farmer data:', farmerData);
          // Perform sync logic
        } else {
          console.log('SyncService: No farmer data found, skipping sync');
        }
      } catch (error) {
        console.error('SyncService: Sync failed:', error);
      } finally {
        isSyncing = false;
      }
    };

    // Start initial sync
    sync();

    // Set up interval for periodic sync
    const interval = setInterval(sync, 60000); // Sync every minute
    return () => {
      console.log('SyncService: Stopping sync');
      clearInterval(interval);
    };
  }
}