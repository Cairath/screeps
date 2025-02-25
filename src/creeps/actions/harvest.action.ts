import _ from "lodash";

export const harvest = (creep: Creep, task: HarvestTask): ActionReturnCode => {
  const deposit = Game.getObjectById(task.objectId);
  if (deposit === null) {
    return ACTION_ERR_DROP_TASK_LIST;
  }

  switch (creep.harvest(deposit)) {
    case ERR_NOT_IN_RANGE: {
      creep.moveTo(deposit, { visualizePathStyle: { stroke: "#ffaa00" } });
      break;
    }
  }

  if (creep.store.energy + _.filter(creep.body, (body) => body.type === WORK).length * 2 >= creep.store.getCapacity()) {
    return ACTION_DONE;
  }

  return ACTION_IN_PROGRESS;
};
