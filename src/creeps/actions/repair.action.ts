import _ from "lodash";

export const repair = (creep: Creep, task: RepairTask): ActionReturnCode => {
  const structure = Game.getObjectById(task.structureId);
  if (structure === null) {
    return ACTION_ERR_MOVE_ON;
  }

  switch (creep.repair(structure)) {
    case ERR_NOT_IN_RANGE: {
      creep.moveTo(structure, { visualizePathStyle: { stroke: "#ffaa00" } });
      break;
    }
    default: {
      return ACTION_ERR_MOVE_ON;
    }
  }

  return ACTION_IN_PROGRESS;
};
