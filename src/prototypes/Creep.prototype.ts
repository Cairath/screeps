import { act } from "creeps/brain";

Creep.prototype.act = function () {
  act(this);
};

Object.defineProperty(Creep.prototype, "isFull", {
  get: function (this: Creep & { _isFull: boolean }) {
    if (!this._isFull) {
      this._isFull = this.store.getUsedCapacity() === this.carryCapacity;
    }
    return this._isFull;
  },
  enumerable: false,
  configurable: true
});
