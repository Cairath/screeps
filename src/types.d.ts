interface Creep {
  act: Function;
  isFull: boolean;
}

interface CreepMemory {
  cluster: string;
  role: RoleConstant;
  task: CreepTask;
}

interface Room {
  sources: Source[];
}

interface RoomMemory {
  sourceIds: Id<Source>[];
}

interface Memory {
  sources: { [id: string]: SourceMemory };
  deposits: { [id: string]: DepositMemory };
  minerals: { [id: string]: MineralMemory };
}

interface Source {
  memory: SourceMemory;
}

interface Deposit {
  memory: DepositMemory;
}

interface Mineral {
  memory: DepositMemory;
  room: Room;
}

interface HarvestableMemory {
  /**
   * Number of accessible non-wall spots around the harvestable.
   */
  accessibleSpots: number;

  /**
   * Id of a Container (if exists) within radius of 1 around the harvestable.
   */
  containerId?: Id<StructureContainer>;

  /**
   * Creeps currently assigned to harvest this harvestable.
   */
  assignedCreeps: { [creepId: string]: HarvestableCreepAssignment };
}

interface HarvestableCreepAssignment {
  workParts: number;
}

interface SourceMemory extends HarvestableMemory {}

interface DepositMemory extends HarvestableMemory {}

interface MineralMemory extends HarvestableMemory {}

interface ClusterInfo {
  name: string;
  baseRoom: string;
  sources: Map<Id<Source>, string>;
  minerals: Map<Id<Mineral>, string>;
}
