interface Creep {
  act: Function;
}

interface CreepMemory {
  cluster: string;
  role: RoleConstant;
  task: CreepTask;
}

interface CreepTask {
  type: TaskConstant;
  objectId: string;
  destination: RoomPosition;
}

interface CreepRole {
  name: RoleConstant;
  body: BodyPartConstant[];
  act: Function;
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
