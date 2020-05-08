import { ClusterManager } from "cluster-manager";
import * as Config from "./config";
import _ from "lodash";
import { StorageController } from "cluster-manager/storage-controller/StorageController";

export class Core {
  private constructor() {}

  private static managers: ClusterManager[] = [];

  public static init() {
    const managerConfigs = Config.CLUSTERS;

    if (!Memory.clusters) {
      Memory.clusters = {};
    }

    managerConfigs.forEach((manager: { name: string; room: string }) =>
      this.managers.push(new ClusterManager(manager.name, manager.room))
    );
  }

  public static getManager(name: string): ClusterManager | undefined {
    return Core.managers.find((cm: ClusterManager) => cm.name === name);
  }

  public static getManagerForRoom(roomName: string): ClusterManager | undefined {
    return Core.managers.find((cm: ClusterManager) => cm.baseRoom === roomName); // todo: handle additionalRooms
  }

  public static getStorageController(objectId: Id<Structure | Ruin | Tombstone>): StorageController | undefined {
    const object = Game.getObjectById(objectId);

    if (!object || !object.room) {
      return undefined;
    }

    return this.getManagerForRoom(object.room.name)?.storageController;
  }

  public static loop(): void {
    for (const creepName in Memory.creeps) {
      if (!(creepName in Game.creeps)) {
        delete Memory.creeps[creepName];
        // todo: also delete creep assignments, e.g. to sources, in case the creep died without properly dropping the task
        // todo: also gc memory of all no longer existing structures

        _.forEach(Memory.sources, (memory: SourceMemory) => {
          delete memory.assignedCreeps[creepName];
        });

        _.forEach(Memory.deposits, (memory: DepositMemory) => {
          delete memory.assignedCreeps[creepName];
        });

        _.forEach(Memory.minerals, (memory: MineralMemory) => {
          delete memory.assignedCreeps[creepName];
        });

        _.forEach(Memory.clusters, (clusterMemory: ClusterMemory) => {
          _.forEach(clusterMemory.stores, (storeMemory: StoreMemory) => {
            delete storeMemory.incomingDeliveries[creepName];
            delete storeMemory.outgoingReservations[creepName];
          });
        });
      }
    }

    for (const creepName in Game.creeps) {
      Game.creeps[creepName].act();
    }

    Core.managers.forEach((manager: ClusterManager) => manager.manage());
  }
}
