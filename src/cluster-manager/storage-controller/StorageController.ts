import { ClusterManager } from "cluster-manager";
import _ from "lodash";
import { resolve } from "dns";

export class StorageController {
  private clusterManager: ClusterManager;
  private clusterMemory: ClusterMemory;

  constructor(clusterManager: ClusterManager) {
    this.clusterManager = clusterManager;
    this.clusterMemory = Memory.clusters[this.clusterManager.name];
  }

  public setStorageMode(objectId: string, storageMode: StorageModeConstant): void {
    this.getStoreMemory(objectId).storageMode = storageMode;
  }

  public getStorageMode(objectId: string): StorageModeConstant {
    return this.getStoreMemory(objectId).storageMode;
  }

  public getStores(storageMode?: StorageModeConstant): (StructureWithStoreDefinition | Tombstone | Ruin)[] {
    let storeMems = this.clusterMemory.stores;
    if (storageMode) {
      storeMems = _.pickBy(storeMems, (storeMemory: StoreMemory) => storeMemory.storageMode === storageMode);
    }
    return _.compact(
      _.map(Object.keys(storeMems), (storeId: string) =>
        Game.getObjectById<StructureWithStoreDefinition | Tombstone | Ruin>(storeId)
      )
    );
  }

  public getAvailableSpaceAfterIncomingDeliveries(
    structure: StructureWithStoreDefinition,
    resource: ResourceConstant
  ): number {
    // todo: is resource needed here?
    return Math.max(
      0,
      structure.store.getFreeCapacity(resource) -
        _(this.getStoreMemory(structure.id).incomingDeliveries)
          .values()
          .sumBy((incoming: StoreReservation) => incoming.amount)
    );
  }

  public addIncomingDelivery(
    structure: StructureWithStoreDefinition | Creep | PowerCreep,
    creepId: Id<Creep | PowerCreep>,
    resource: ResourceConstant,
    amount: number
  ): void {
    this.getStoreMemory(structure.id).incomingDeliveries[creepId] = { amount: amount, resource: resource };
  }

  public deleteIncomingDelivery(structure: StructureWithStoreDefinition, creepId: Id<Creep | PowerCreep>): void {
    delete this.getStoreMemory(structure.id).incomingDeliveries[creepId];
  }

  public addOutgoingReservation(
    structure: StructureWithStoreDefinition | Creep | PowerCreep,
    creepId: Id<Creep | PowerCreep>,
    resource: ResourceConstant,
    amount: number
  ): void {
    this.getStoreMemory(structure.id).outgoingReservations[creepId] = { amount: amount, resource: resource };
  }

  public deleteOutgoingReservation(structure: StructureWithStoreDefinition, creepId: Id<Creep | PowerCreep>): void {
    delete this.getStoreMemory(structure.id).outgoingReservations[creepId];
  }

  public getDeliveryTarget(
    creep: Creep,
    resource: ResourceConstant,
    amount: number
  ): Creep | PowerCreep | StructureWithStoreDefinition | undefined {
    const creepPos = creep.pos;

    // todo: actually implement
    const fillSpawnsAndExtensions = true;
    if (fillSpawnsAndExtensions && resource === RESOURCE_ENERGY) {
      const closestNotFullSpawn = creepPos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure: Structure) =>
          structure.structureType === STRUCTURE_SPAWN &&
          this.getAvailableSpaceAfterIncomingDeliveries(structure as StructureWithStoreDefinition, resource) > 0
      }) as StructureWithStoreDefinition;

      if (closestNotFullSpawn) {
        return closestNotFullSpawn;
      }

      const closestNotFullExtension = creepPos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure: Structure) =>
          structure.structureType === STRUCTURE_EXTENSION &&
          this.getAvailableSpaceAfterIncomingDeliveries(structure as StructureWithStoreDefinition, resource) > 0
      }) as StructureWithStoreDefinition;

      if (closestNotFullExtension) {
        return closestNotFullExtension;
      }
    }

    return undefined;
  }

  private getStoreMemory(objectId: string): StoreMemory {
    const storeMemory = this.clusterMemory.stores;
    if (!storeMemory[objectId]) {
      this.initializeStoreMemory(objectId);
    }

    return storeMemory[objectId];
  }

  private initializeStoreMemory(objectId: string) {
    this.clusterMemory.stores[objectId] = {
      storageMode: STORAGE_MODE_NORMAL,
      incomingDeliveries: {},
      outgoingReservations: {}
    };
  }
}
