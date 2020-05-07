export const renew = (creep: Creep, task: RenewTask): ActionReturnCode => {
  const spawn = Game.getObjectById(task.spawnId);

  if (!spawn) {
    return ACTION_ERR_MOVE_ON;
  }

  switch (spawn.renewCreep(creep)) {
    case ERR_NOT_IN_RANGE: {
      creep.moveTo(spawn);
      break;
    }
  }

  if (creep.ticksToLive! > 1400) {
    return ACTION_DONE;
  }

  return ACTION_IN_PROGRESS;
};
