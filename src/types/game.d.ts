interface Creep {
  act: Function;
  isFull: boolean;
  isIdle: boolean;
}

interface Room {
  sources: Source[];
}

interface Harvestable {
  accessibleSpots: number;
  containerId: Id<StructureContainer> | null;
}

interface Source extends Harvestable {
  memory: SourceMemory;
}

interface Deposit extends Harvestable {
  memory: DepositMemory;
}

interface Mineral extends Harvestable {
  memory: DepositMemory;
  room: Room;
}

interface StructureWithStore {
  storageMode: StorageModeConstant;
}

interface StructureContainer extends StructureWithStore {}

interface StructureLink extends StructureWithStore {}

interface StructureStorage extends StructureWithStore {}
