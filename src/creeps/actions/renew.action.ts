export const renew = (creep: Creep, task: RenewTask): ACTION_DONE | ACTION_CONT | ACTION_ERR_NOT_FOUND => {
  // todo: handle this nicer without creeps ganging up on one spawn and waiting too long
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
