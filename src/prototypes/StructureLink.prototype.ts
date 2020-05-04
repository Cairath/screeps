Object.defineProperty(StructureLink.prototype, "memory", {
  configurable: true,
  get: function (this: StructureLink) {
    if (_.isUndefined(Memory.storages)) {
      Memory.storages = {};
    }
    if (!_.isObject(Memory.storages)) {
      return undefined;
    }
    return (Memory.storages[this.id] = Memory.storages[this.id] ?? {});
  },
  set: function (value: StorageMemory) {
    if (_.isUndefined(Memory.storages)) {
      Memory.storages = {};
    }
    if (!_.isObject(Memory.storages)) {
      throw new Error("Could not set link memory");
    }
    Memory.storages[this.id] = value;
  }
});

Object.defineProperty(StructureLink.prototype, "storageMode", {
  get: function (this: StructureLink & { _storageMode: StorageModeConstant }) {
    if (!this._storageMode) {
      if (!this.memory.storageMode) {
        this.memory.storageMode = STORAGE_MODE_NORMAL;
      }
      this._storageMode = this.memory.storageMode;
    }
    return this._storageMode;
  },
  set: function (newValue: StorageModeConstant) {
    this.memory.storageMode = newValue;
    this._storageMode = newValue;
  },
  enumerable: false,
  configurable: true
});
