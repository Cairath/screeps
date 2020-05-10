import { ClusterManager } from "cluster-manager";
import _ from "lodash";
import { resolve } from "dns";

export class StorageController {
  private clusterManager: ClusterManager;
  private get clusterMemory(): ClusterMemory {
    return Memory.clusters[this.clusterManager.name];
  }

  constructor(clusterManager: ClusterManager) {
    this.clusterManager = clusterManager;
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

  public getResourcesAfterOutgoingReservations(
    structure: StructureWithStoreDefinition | Tombstone | Ruin,
    resource: ResourceConstant
  ): number {
    // todo: is resource needed here?
    return Math.max(
      0,
      structure.store.getUsedCapacity(resource) -
        _(this.getStoreMemory(structure.id).outgoingReservations)
          .values()
          .sumBy((outgoing: StoreReservation) => outgoing.amount)
    );
  }

  public addIncomingDelivery(
    structureId: Id<StructureWithStoreDefinition | Creep | PowerCreep>,
    creepName: string,
    resource: ResourceConstant,
    amount: number
  ): void {
    this.getStoreMemory(structureId).incomingDeliveries[creepName] = { amount: amount, resource: resource };
  }

  public deleteIncomingDelivery(
    structureId: Id<StructureWithStoreDefinition | Creep | PowerCreep>,
    creepName: string
  ): void {
    delete this.getStoreMemory(structureId).incomingDeliveries[creepName];
  }

  public addOutgoingReservation(
    structureId: Id<StructureWithStoreDefinition | Ruin | Tombstone>,
    creepName: string,
    resource: ResourceConstant,
    amount: number
  ): void {
    this.getStoreMemory(structureId).outgoingReservations[creepName] = { amount: amount, resource: resource };
  }

  public deleteOutgoingReservation(
    structureId: Id<StructureWithStoreDefinition | Ruin | Tombstone>,
    creepName: string
  ): void {
    delete this.getStoreMemory(structureId).outgoingReservations[creepName];
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

    const closestNotFullContainerOrStorage = creepPos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure: Structure) =>
        (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) &&
        this.getStorageMode(structure.id) !== STORAGE_MODE_EMPTY &&
        this.getAvailableSpaceAfterIncomingDeliveries(structure as StructureWithStoreDefinition, resource) > 0
    }) as StructureWithStoreDefinition;

    if (closestNotFullContainerOrStorage) {
      return closestNotFullContainerOrStorage;
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
    const object = Game.getObjectById(objectId);

    if (!object) {
      console.log(
        `[ERROR]: Attempted to initialize store memory for objectId ${objectId} but could not find the object in Game.`
      );
      return;
    }

    const storageMode =
      object instanceof Tombstone || object instanceof Resource || object instanceof Ruin
        ? STORAGE_MODE_EMPTY
        : STORAGE_MODE_NORMAL;
    this.clusterMemory.stores[objectId] = {
      storageMode: storageMode,
      incomingDeliveries: {},
      outgoingReservations: {}
      // todo: store type of the store?
    };
  }
}
