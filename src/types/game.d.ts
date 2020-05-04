interface Creep {
  act: Function;
  isFull: boolean;
  isIdle: boolean;
}

interface Room {
  sources: Source[];
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

interface StructureContainer {
  memory: ContainerMemory;
  storageMode: StorageModeConstant;
}

interface StructureLink {
  memory: LinkMemory;
  storageMode: StorageModeConstant;
}

interface StructureStorage {
  memory: StorageMemory;
  storageMode: StorageModeConstant;
}
