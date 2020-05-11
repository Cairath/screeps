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

  public static getStorageController(
    objectId: Id<Structure | Ruin | Tombstone | Creep | PowerCreep>
  ): StorageController | undefined {
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

    _.forEach(Memory.clusters, (clusterMemory: ClusterMemory) => {
      _.forEach(Object.keys(clusterMemory.stores), (objectId: string) => {
        if (!Game.getObjectById(objectId)) {
          delete clusterMemory.stores[objectId];
        }
      });

      _.forEach(Object.keys(clusterMemory.looseResources), (objectId: string) => {
        if (!Game.getObjectById(objectId)) {
          delete clusterMemory.looseResources[objectId];
        }
      });
    });

    Core.managers.forEach((manager: ClusterManager) => manager.manage());

    for (const creepName in Game.creeps) {
      Game.creeps[creepName].act();
    }
  }
}
