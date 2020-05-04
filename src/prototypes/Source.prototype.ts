Object.defineProperty(Source.prototype, "memory", {
  configurable: true,
  get: function (this: Source) {
    if (_.isUndefined(Memory.sources)) {
      Memory.sources = {};
    }
    if (!_.isObject(Memory.sources)) {
      return undefined;
    }
    return (Memory.sources[this.id] = Memory.sources[this.id] ?? {});
  },
  set: function (value: SourceMemory) {
    if (_.isUndefined(Memory.sources)) {
      Memory.sources = {};
    }
    if (!_.isObject(Memory.sources)) {
      throw new Error("Could not set source memory");
    }
    Memory.sources[this.id] = value;
  }
});

Object.defineProperty(Source.prototype, "accessibleSpots", {
  get: function (this: Source & { _accessibleSpots: number }) {
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

Object.defineProperty(Source.prototype, "containerId", {
  get: function (this: Source & { _containerId: Id<StructureContainer> | null }) {
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
