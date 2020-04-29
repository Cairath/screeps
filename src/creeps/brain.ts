import { harvest } from "./actions/harvest.action";
import { transfer } from "./actions/transfer.action";

export const act = (creep: Creep) => {
  const task = creep.memory.task;
  let result: ActionReturnCode = ACTION_OK;
  switch (task.type) {
    case TASK_HARVEST: {
      result = harvest(creep, task);
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

    creep.memory.task = newTask;
  }
};
