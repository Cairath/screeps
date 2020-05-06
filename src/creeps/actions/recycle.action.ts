export const recycle = (creep: Creep, task: RecycleTask): ACTION_DONE | ACTION_CONT | ACTION_ERR_NOT_FOUND => {
  const spawn = Game.getObjectById(task.spawnId);
  if (spawn === null) {
    return ACTION_ERR_NOT_FOUND;
  }

  switch (spawn.recycleCreep(creep)) {
    case ERR_NOT_IN_RANGE: {
      creep.moveTo(spawn);
      break;
    }
    case OK: {
      return ACTION_DONE;
    }
    default: {
      return ACTION_ERR_NOT_FOUND; // todo: another return code for those cases
    }
  }

  return ACTION_CONT;
};
