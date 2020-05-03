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
}

interface HarvestableMemory {
  accessibleSpots: number;
  containerId?: Id<StructureContainer>;
  assignedCreeps: { [creepId: string]: { workParts: number } };
}

interface SourceMemory extends HarvestableMemory {}

interface DepositMemory extends HarvestableMemory {}

interface MineralMemory extends HarvestableMemory {}

interface ClusterInfo {
  name: string;
  baseRoom: string;
  sources: { [sourceId: string]: string };
  minerals: { [mineralId: string]: string };
}
