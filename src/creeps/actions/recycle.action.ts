export const recycle = (creep: Creep, task: RecycleTask): ACTION_DONE | ACTION_CONT | ACTION_ERR_NOT_FOUND => {
  const spawn = Game.getObjectById(task.spawnId);
  if (spawn === null) {
    return ACTION_ERR_NOT_FOUND;
  }

  const result = spawn.recycleCreep(creep);
  if (result === ERR_NOT_IN_RANGE) {
    creep.moveTo(spawn);
  } else if (result === OK) {
    return ACTION_DONE;
  } else {
    return ACTION_ERR_NOT_FOUND; // todo: another return code for those cases
  }

  return ACTION_CONT;
};
