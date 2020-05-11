export const pickup = (creep: Creep, task: PickupTask): ActionReturnCode => {
  const target = Game.getObjectById(task.targetId);

  if (!target) {
    return ACTION_ERR_DROP_TASK_LIST;
  }

  const creepSpace = creep.store.getFreeCapacity(task.resource);

  if (creepSpace === 0 || target.amount === 0) {
    return ACTION_ERR_DROP_TASK_LIST;
  }

  switch (creep.pickup(target)) {
    case ERR_NOT_IN_RANGE: {
      creep.moveTo(target);
      break;
    }
    case OK: {
      return ACTION_DONE;
    }
    default: {
      return ACTION_ERR_DROP_TASK_LIST;
    }
  }

  return ACTION_IN_PROGRESS;
};
