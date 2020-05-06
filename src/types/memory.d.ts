interface Memory {
  sources: { [id: string]: SourceMemory };
  deposits: { [id: string]: DepositMemory };
  minerals: { [id: string]: MineralMemory };
  storages: { [id: string]: StoreStructureMemory };
}

interface RoomMemory {}

interface CreepMemory {
  cluster: string;
  role: RoleConstant;
  tier: number;
  task: CreepTask;
}

interface HarvestableMemory {
  /**
   * Creeps currently assigned to harvest this harvestable.
   */
  assignedCreeps: { [creepName: string]: HarvestableCreepAssignment };
}

interface SourceMemory extends HarvestableMemory {}

interface DepositMemory extends HarvestableMemory {}

interface MineralMemory extends HarvestableMemory {}

interface StructureWithStoreMemory {
  /**
   * List of en route deliveries to this store.
   */
  incomingDeliveries: { [creepName: string]: StoreReservation };

  /**
   * List of reserved resources in currently performed tasks.
   */
  outgoingReservations: { [creepName: string]: StoreReservation };
}

interface StorageMemory extends StructureWithStoreMemory {}

interface ContainerMemory extends StructureWithStoreMemory {}

interface LinkMemory extends StructureWithStoreMemory {}

type StoreStructureMemory = StorageMemory | ContainerMemory | LinkMemory;
