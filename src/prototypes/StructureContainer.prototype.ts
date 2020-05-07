Object.defineProperty(StructureContainer.prototype, "storageMode", {
  get: function (
    this: StructureContainer & { _storageMode: StorageModeConstant } & { memory: { storageMode: StorageModeConstant } }
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
