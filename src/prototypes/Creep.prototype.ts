import { act } from "creeps/brain";

Creep.prototype.act = function () {
  act(this);
};

Object.defineProperty(Creep.prototype, "isFull", {
  get: function (this: Creep) {
    return this.store.getUsedCapacity() === this.carryCapacity;
  },
  enumerable: false,
  configurable: true
});

Object.defineProperty(Creep.prototype, "isEmpty", {
  get: function (this: Creep) {
    return this.store.getUsedCapacity() === 0;
  },
  enumerable: false,
  configurable: true
});

Object.defineProperty(Creep.prototype, "isIdle", {
  get: function (this: Creep) {
    return this.memory.task.type === TASK_IDLE || this.memory.task.type === TASK_PARK;
  },
  enumerable: false,
  configurable: true
});
