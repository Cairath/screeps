interface CreepMemory {
  room: string;
  working: boolean;
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
