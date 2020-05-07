export const withdraw = (creep: Creep, task: WithdrawTask): ACTION_DONE | ACTION_CONT | ACTION_ERR_NOT_FOUND => {
  const target = Game.getObjectById(task.targetId);

  if (!target) {
    return ACTION_ERR_NOT_FOUND;
  }

  let amount = task.amount;
  if (task.amount) {
    const creepSpace = creep.store.getFreeCapacity(task.resource);
    const targetResources = target.store.getUsedCapacity(task.resource);

    if (creepSpace < task.amount) {
      console.log(
        `[ERROR] ${creep.name} attempted to withdraw ${task.amount} ${task.resource} while only having space for ${creepSpace}. Check task assignments.`
      );
    }
    if (targetResources < task.amount) {
      console.log(
        `[ERROR] ${creep.name} attempted to withdraw ${task.amount} ${task.resource} from ${target.id} that has only ${targetResources}. Check task assignments.`
      );
    }

    amount = Math.min(creepSpace, targetResources, task.amount);
  }

  switch (creep.withdraw(target, task.resource, amount)) {
    case ERR_NOT_IN_RANGE: {
      creep.moveTo(target);
      break;
    }
    case OK: {
      return ACTION_DONE;
    }
  }

  return ACTION_CONT;
};
