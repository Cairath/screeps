export const recycle = (creep: Creep, task: RecycleTask): ActionReturnCode => {
  const spawn = Game.getObjectById(task.spawnId);
  if (spawn === null) {
    return ACTION_ERR_MOVE_ON;
  }

  switch (spawn.recycleCreep(creep)) {
    case ERR_NOT_IN_RANGE: {
      creep.moveTo(spawn);
      break;
    }
    case OK: {
      return ACTION_DONE;
    }
  }

  return ACTION_IN_PROGRESS;
};
