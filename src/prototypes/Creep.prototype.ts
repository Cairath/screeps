import { Roles } from "creeps";

Creep.prototype.act = function () {
  Roles[this.memory.role].act(this);
};
