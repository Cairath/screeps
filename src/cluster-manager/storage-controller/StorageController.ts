import { ClusterManager } from "cluster-manager";

export class StorageController {
  private clusterManager: ClusterManager;

  constructor(clusterManager: ClusterManager) {
    this.clusterManager = clusterManager;
  }
}
