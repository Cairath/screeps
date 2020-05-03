import { harvest } from "./actions/harvest.action";
import { transfer } from "./actions/transfer.action";

export const act = (creep: Creep) => {
  const task = creep.memory.task;
  let result: ActionReturnCode = ACTION_OK;
  switch (task.type) {
    case TASK_HARVEST: {
      result = harvest(creep, task);
      // todo: if source is empty and has long time to renew left, possibly unassign the creep?
      break;
    }
    case TASK_TRANSFER: {
      result = transfer(creep, task);

      if (result === ACTION_ERR_FULL) {
        result = ACTION_ERR_USE_FALLBACK;
      }

      break;
    }
  }

  if (result !== ACTION_OK) {
    let newTask: CreepTask;

    if (result === ACTION_ERR_USE_FALLBACK && task.fallback) {
      newTask = task.fallback;
      newTask.next = task.next ?? { type: TASK_IDLE };
    } else {
      newTask = task.next ?? { type: TASK_IDLE };
    }

    if (task.repeatable) {
      let currTask = newTask;
      while (currTask.next && currTask.next.type !== TASK_IDLE) {
        currTask = currTask.next;
      }

      currTask.next = task;
    }

    if (task.type === TASK_HARVEST && !task.repeatable) {
      let currTask: CreepTask | undefined = newTask;
      let foundAnotherSource = false;
      do {
        if (currTask.type === TASK_HARVEST && currTask.objectId !== task.objectId) {
          foundAnotherSource = true;
          break;
        }

        currTask = currTask.next;
      } while (currTask);

      if (foundAnotherSource) {
        const currentSource = Game.getObjectById(task.objectId);
        if (currentSource instanceof Source) {
          delete Memory.sources[currentSource.id].assignedCreeps[creep.id];
        } else if (currentSource instanceof Deposit) {
          delete Memory.deposits[currentSource.id].assignedCreeps[creep.id];
        } else if (currentSource instanceof Mineral) {
          delete Memory.minerals[currentSource.id].assignedCreeps[creep.id];
        }
      }
    }

    creep.memory.task = newTask;
  }
};
