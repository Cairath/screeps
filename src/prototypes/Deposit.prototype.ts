Object.defineProperty(Deposit.prototype, "memory", {
  configurable: true,
  get: function (this: Deposit) {
    if (_.isUndefined(Memory.deposits)) {
      Memory.deposits = {};
    }
    if (!_.isObject(Memory.deposits)) {
      return undefined;
    }
    return (Memory.deposits[this.id] = Memory.deposits[this.id] ?? {});
  },
  set: function (value: DepositMemory) {
    if (_.isUndefined(Memory.deposits)) {
      Memory.deposits = {};
    }
    if (!_.isObject(Memory.deposits)) {
      throw new Error("Could not set deposit memory");
    }
    Memory.deposits[this.id] = value;
  }
});

Object.defineProperty(Deposit.prototype, "accessibleSpots", {
  get: function (this: Deposit & { _accessibleSpots: number } & { memory: { accessibleSpots: number } }) {
    if (this._accessibleSpots === undefined) {
      if (this.memory.accessibleSpots === undefined) {
        let freeSpaceCount = 0;
        [this.pos.x - 1, this.pos.x, this.pos.x + 1].forEach((x) => {
          [this.pos.y - 1, this.pos.y, this.pos.y + 1].forEach((y) => {
            if (Game.map.getRoomTerrain(this.pos.roomName).get(x, y) !== TERRAIN_MASK_WALL) freeSpaceCount++;
          }, this);
        }, this);
        this.memory.accessibleSpots = freeSpaceCount;
      }
      this._accessibleSpots = this.memory.accessibleSpots;
    }
    return this._accessibleSpots;
  },
  enumerable: false,
  configurable: true
});

Object.defineProperty(Deposit.prototype, "containerId", {
  get: function (this: Deposit & { _containerId: Id<StructureContainer> | null }) {
    if (this._containerId === undefined) {
      const containersInRange = this.pos
        .findInRange(FIND_STRUCTURES, 1)
        .filter(
          (structure: Structure): structure is StructureContainer => structure.structureType === STRUCTURE_CONTAINER
        );

      const container = containersInRange.shift();
      this._containerId = container ? container.id : null;
    }
    return this._containerId;
  },
  enumerable: false,
  configurable: true
});
