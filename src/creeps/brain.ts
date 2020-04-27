import { harvest } from "./actions/harvest.action";

export const act = (creep: Creep) => {
  const task = creep.memory.task;
  let result: ActionReturnCode = ACTION_OK;
  switch (task.type) {
    case TASK_HARVEST: {
      result = harvest(creep, task);
      break;
    }
  }

  if (result !== ACTION_OK) {
    creep.memory.task = task.next ?? { type: TASK_IDLE };
  }
};
