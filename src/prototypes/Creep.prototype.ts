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

Object.defineProperty(Creep.prototype, "isIdle", {
  get: function (this: Creep & { _isIdle: boolean }) {
    if (!this._isIdle) {
      this._isIdle = this.memory.task.type === TASK_IDLE || this.memory.task.type === TASK_PARK;
    }
    return this._isIdle;
  },
  enumerable: false,
  configurable: true
});
