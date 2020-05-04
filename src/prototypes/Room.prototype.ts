Object.defineProperty(Room.prototype, "sources", {
  get: function (this: Room & { _sources: Source[] } & { memory: { sourceIds: Id<Source>[] } }) {
    if (!this._sources) {
      if (!this.memory.sourceIds) {
        this.memory.sourceIds = this.find(FIND_SOURCES).map((source: Source) => source.id);
      }
      this._sources = _.chain(this.memory.sourceIds)
        .map((id: Id<Source>) => Game.getObjectById(id))
        .filter((source: Source | null) => source !== null)
        .value() as Source[];
    }
    return this._sources;
  },
  set: function (newValue: Source[]) {
    this.memory.sources = newValue.map((source: Source) => source.id);
    this._sources = newValue;
  },
  enumerable: false,
  configurable: true
});
