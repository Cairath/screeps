import _ from "lodash";
import * as action from "./actions";

export const act = (creep: Creep) => {
  const task = creep.memory.task;
  let result: ActionReturnCode = ACTION_CONT;
  switch (task.type) {
    case TASK_RECYCLE: {
      result = action.recycle(creep, task);
      break;
    }
    case TASK_RENEW: {
      result = action.renew(creep, task);
      break;
    }
    case TASK_HARVEST: {
      result = action.harvest(creep, task);
      // todo: if source is empty and has long time to renew left, possibly unassign the creep?
      break;
    }
    case TASK_TRANSFER: {
      result = action.transfer(creep, task);

      if (result === ACTION_ERR_FULL) {
        result = ACTION_ERR_USE_FALLBACK;
      }

      break;
    }
    case TASK_DROP_IN_PLACE: {
      result = action.dropInPlace(creep, task);
      break;
    }
  }

  if (result !== ACTION_CONT) {
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

      currTask.next = _.cloneDeep(task);
    }

    if (task.type === TASK_HARVEST && !task.repeatable) {
      let currTask: CreepTask | undefined = newTask;
      let foundAnotherSource = false;

      while (currTask) {
        if (currTask.type === TASK_HARVEST && currTask.objectId !== task.objectId) {
          foundAnotherSource = true;
          break;
        }

        currTask = currTask.next;
      }

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
