interface CreepMemory {
  cluster: string;
  role: RoleConstant;
  task: CreepTask;
}

interface CreepTask {
  type: TaskConstant;
  objectId: string;
  destination: Location;
}

interface Location {
  room?: string;
  x: number;
  y: number;
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
}
