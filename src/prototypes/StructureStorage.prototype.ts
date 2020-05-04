Object.defineProperty(StructureStorage.prototype, "memory", {
  configurable: true,
  get: function (this: StructureStorage) {
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
      throw new Error("Could not set storage memory");
    }
    Memory.storages[this.id] = value;
  }
});

Object.defineProperty(StructureStorage.prototype, "storageMode", {
  get: function (
    this: StructureStorage & { _storageMode: StorageModeConstant } & { memory: { storageMode: StorageModeConstant } }
  ) {
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
