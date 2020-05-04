interface Memory {
  sources: { [id: string]: SourceMemory };
  deposits: { [id: string]: DepositMemory };
  minerals: { [id: string]: MineralMemory };
  storages: { [id: string]: StoreStructureMemory };
}

interface RoomMemory {
  sourceIds: Id<Source>[];
}

interface CreepMemory {
  cluster: string;
  role: RoleConstant;
  task: CreepTask;
}

interface HarvestableMemory {
  /**
   * Number of accessible non-wall spots around the harvestable.
   */
  accessibleSpots: number;

  /**
   * Id of a Container (if exists) within radius of 1 around the harvestable.
   */
  containerId: Id<StructureContainer> | null;

  /**
   * Creeps currently assigned to harvest this harvestable.
   */
  assignedCreeps: { [creepId: string]: HarvestableCreepAssignment };
}

interface SourceMemory extends HarvestableMemory {}

interface DepositMemory extends HarvestableMemory {}

interface MineralMemory extends HarvestableMemory {}

interface StructureWithStoreMemory {
  /**
   * Storage mode to be used in building carrier tasks.
   * @warning Do not use directly. Use `structure.storageMode` to trigger initialization correctly.
   */
  storageMode: StorageModeConstant;
}

interface StorageMemory extends StructureWithStoreMemory {}

interface ContainerMemory extends StructureWithStoreMemory {}

interface LinkMemory extends StructureWithStoreMemory {}

type StoreStructureMemory = StorageMemory | ContainerMemory | LinkMemory;
