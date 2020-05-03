Object.defineProperty(Mineral.prototype, "memory", {
  configurable: true,
  get: function (this: Mineral) {
    if (_.isUndefined(Memory.minerals)) {
      Memory.minerals = {};
    }
    if (!_.isObject(Memory.minerals)) {
      return undefined;
    }
    return (Memory.minerals[this.id] = Memory.minerals[this.id] ?? {});
  },
  set: function (value: MineralMemory) {
    if (_.isUndefined(Memory.minerals)) {
      Memory.minerals = {};
    }
    if (!_.isObject(Memory.minerals)) {
      throw new Error("Could not set mineral memory");
    }
    Memory.minerals[this.id] = value;
  }
});

Object.defineProperty(Mineral.prototype, "accessibleSpots", {
  get: function (this: Mineral & { _accessibleSpots: number }) {
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

Object.defineProperty(Mineral.prototype, "containerId", {
  get: function (this: Mineral & { _accessibleSpots: number }) {
    const containersInRange = this.pos
      .findInRange(FIND_MY_STRUCTURES, 1)
      .filter(
        (structure: Structure): structure is StructureContainer => structure.structureType === STRUCTURE_CONTAINER
      );

    const container = containersInRange.shift();

    return container ? container.id : undefined;
  },
  enumerable: false,
  configurable: true
});
