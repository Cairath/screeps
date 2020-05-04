interface Memory {
  sources: { [id: string]: SourceMemory };
  deposits: { [id: string]: DepositMemory };
  minerals: { [id: string]: MineralMemory };
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
