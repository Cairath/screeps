Object.defineProperty(Room.prototype, "sources", {
  get: function (this: Room & { _sources: Source[] }) {
    // If we dont have the value stored locally
    if (!this._sources) {
      // If we dont have the value stored in memory
      if (!this.memory.sourceIds) {
        // Find the sources and store their id's in memory,
        // NOT the full objects
        this.memory.sourceIds = this.find(FIND_SOURCES).map((source: Source) => source.id);
      }
      // Get the source objects from the id's in memory and store them locally
      this._sources = _.chain(this.memory.sourceIds)
        .map((id: Id<Source>) => Game.getObjectById(id))
        .filter((source: Source | null) => source !== null)
        .value() as Source[];
    }
    // return the locally stored value
    return this._sources;
  },
  set: function (newValue: Source[]) {
    // when storing in memory you will want to change the setter
    // to set the memory value as well as the local value
    this.memory.sources = newValue.map((source: Source) => source.id);
    this._sources = newValue;
  },
  enumerable: false,
  configurable: true
});
