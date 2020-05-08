import { ClusterManager } from "cluster-manager";

export class StorageController {
  private clusterManager: ClusterManager;

  constructor(clusterManager: ClusterManager) {
    this.clusterManager = clusterManager;
  }

  public setStorageMode(objectId: string, storageMode: StorageModeConstant) {
    this.getStoreMemory(objectId).storageMode = storageMode;
  }

  public getStorageMode(objectId: string) {
    return this.getStoreMemory(objectId).storageMode;
  }

  private getStoreMemory(objectId: string) {
    const storeMemory = Memory.clusters[this.clusterManager.name].stores;
    if (!storeMemory[objectId]) {
      this.initializeStoreMemory(objectId);
    }

    return storeMemory[objectId];
  }

  private initializeStoreMemory(objectId: string) {
    Memory.clusters[this.clusterManager.name].stores[objectId] = {
      storageMode: STORAGE_MODE_NORMAL,
      incomingDeliveries: {},
      outgoingReservations: {}
    };
  }
}
