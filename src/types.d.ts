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
}

interface Source {
  memory: SourceMemory;
}

interface SourceMemory {
  accessibleSpots: number;
  containerId?: Id<StructureContainer>;
}

interface ClusterInfo {
  name: string;
  baseRoom: string;
}
