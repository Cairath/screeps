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
  task: CreepTask;
}

interface HarvestableMemory {
  /**
   * Creeps currently assigned to harvest this harvestable.
   */
  assignedCreeps: { [creepId: string]: HarvestableCreepAssignment };
}

interface SourceMemory extends HarvestableMemory {}

interface DepositMemory extends HarvestableMemory {}

interface MineralMemory extends HarvestableMemory {}

interface StructureWithStoreMemory {}

interface StorageMemory extends StructureWithStoreMemory {}

interface ContainerMemory extends StructureWithStoreMemory {}

interface LinkMemory extends StructureWithStoreMemory {}

type StoreStructureMemory = StorageMemory | ContainerMemory | LinkMemory;
