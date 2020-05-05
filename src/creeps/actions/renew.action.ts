export const renew = (creep: Creep, task: RenewTask): ACTION_DONE | ACTION_CONT | ACTION_ERR_NOT_FOUND => {
  const spawn = Game.getObjectById(task.spawnId);

  if (!spawn) {
    return ACTION_ERR_NOT_FOUND;
  }

  switch (spawn.renewCreep(creep)) {
    case ERR_NOT_IN_RANGE: {
      creep.moveTo(spawn);
      break;
    }
    case ERR_BUSY: {
      return ACTION_CONT;
    }
  }

  if (creep.ticksToLive! > 1400) {
    return ACTION_DONE;
  }

  return ACTION_CONT;
};
