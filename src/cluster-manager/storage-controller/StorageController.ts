import { ClusterManager } from "cluster-manager";
import _ from "lodash";

export class StorageController {
  private clusterManager: ClusterManager;
  private get clusterMemory(): ClusterMemory {
    return Memory.clusters[this.clusterManager.name];
  }

  constructor(clusterManager: ClusterManager) {
    this.clusterManager = clusterManager;
  }

  /* Common */
  public ensureRegisteredInStorageController(
    objectId: Id<StructureWithStoreDefinition | Tombstone | Ruin | Resource>
  ): void {
    const object = Game.getObjectById(objectId);
    if (!object) {
      return;
    }

    if (object instanceof Resource) {
      this.getResourceMemory(objectId);
    } else {
      this.getStoreMemory(objectId);
    }
  }

  // todo: do something with this cast hell
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
        this.getStorageMode((structure as StructureWithStoreDefinition).id) !== STORAGE_MODE_EMPTY &&
        this.getAvailableSpaceAfterIncomingDeliveries(structure as StructureWithStoreDefinition, resource) > 0
    }) as StructureWithStoreDefinition;

    if (closestNotFullContainerOrStorage) {
      return closestNotFullContainerOrStorage;
    }

    return undefined;
  }

  /* Stores (cluster.stores) */

  public setStorageMode(objectId: Id<StructureWithStoreDefinition>, storageMode: StorageModeConstant): void {
    this.getStoreMemory(objectId).storageMode = storageMode;
  }

  public getStorageMode(objectId: Id<StructureWithStoreDefinition>): StorageModeConstant {
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

  public addOutgoingStoreReservation(
    structureId: Id<StructureWithStoreDefinition | Ruin | Tombstone>,
    creepName: string,
    resource: ResourceConstant,
    amount: number
  ): void {
    this.getStoreMemory(structureId).outgoingReservations[creepName] = { amount: amount, resource: resource };
  }

  public deleteOutgoingStoreReservation(
    structureId: Id<StructureWithStoreDefinition | Ruin | Tombstone>,
    creepName: string
  ): void {
    delete this.getStoreMemory(structureId).outgoingReservations[creepName];
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

  /* Loose resources (cluster.looseResources) */

  public getLooseResources(): Resource[] {
    return _.compact(
      _.map(Object.keys(this.clusterMemory.looseResources), (resId: string) => Game.getObjectById<Resource>(resId))
    );
  }

  public getResourceAmountAfterOutgoingReservations(resource: Resource): number {
    return Math.max(
      0,
      resource.amount -
        _(this.getResourceMemory(resource.id).outgoingReservations)
          .values()
          .sumBy((outgoing: ResourceReservation) => outgoing.amount)
    );
  }

  public addOutgoingResourceReservation(structureId: Id<Resource>, creepName: string, amount: number): void {
    this.getResourceMemory(structureId).outgoingReservations[creepName] = { amount: amount };
  }

  public deleteOutgoingResourceReservation(structureId: Id<Resource>, creepName: string): void {
    delete this.getResourceMemory(structureId).outgoingReservations[creepName];
  }

  private getResourceMemory(objectId: string): ResourceMemory {
    const looseResMemory = this.clusterMemory.looseResources;
    if (!looseResMemory[objectId]) {
      this.initializeLooseResourcesMemory(objectId);
    }

    return looseResMemory[objectId];
  }

  private initializeLooseResourcesMemory(objectId: string) {
    const object = Game.getObjectById(objectId);

    if (!object) {
      console.log(
        `[ERROR]: Attempted to initialize resource memory for objectId ${objectId} but could not find the Resource in Game.`
      );
      return;
    }
    this.clusterMemory.looseResources[objectId] = {
      outgoingReservations: {}
    };
  }
}
