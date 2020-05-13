import _ from "lodash";

export const upgrade = (creep: Creep, task: UpgradeTask): ActionReturnCode => {
  const controller = Game.getObjectById(task.controllerId);
  if (controller === null) {
    return ACTION_ERR_MOVE_ON;
  }

  switch (creep.upgradeController(controller)) {
    case ERR_NOT_IN_RANGE: {
      creep.moveTo(controller, { visualizePathStyle: { stroke: "#ffaa00" } });
      break;
    }
    default: {
      return ACTION_ERR_MOVE_ON;
    }
  }

  return ACTION_IN_PROGRESS;
};
