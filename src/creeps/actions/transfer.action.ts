export const transfer = (
  creep: Creep,
  task: TransferTask
): ACTION_DONE | ACTION_CONT | ACTION_ERR_NOT_FOUND | ACTION_ERR_FULL => {
  const target = Game.getObjectById(task.targetId);

  if (!target) {
    return ACTION_ERR_NOT_FOUND;
  }

  let amount = task.amount;
  if (task.amount) {
    const creepRes = creep.store.getUsedCapacity(task.resource);
    if (creepRes < task.amount) {
      amount = creepRes;
      console.log(
        `[ERROR] ${creep.name} attempted to transfer ${task.amount} ${task.resource} while only carrying ${creepRes}. Check task assignments.`
      );
    }
  }

  switch (creep.transfer(target, task.resource, amount)) {
    case ERR_NOT_IN_RANGE: {
      creep.moveTo(target);
      break;
    }
    case ERR_FULL: {
      return ACTION_ERR_FULL;
    }
    case OK: {
      return ACTION_DONE;
    }
  }

  return ACTION_CONT;
};
