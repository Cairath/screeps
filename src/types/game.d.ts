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
