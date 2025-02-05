import _ from "lodash";
import * as action from "./actions";
import { Core } from "core";

export const act = (creep: Creep) => {
  const task = creep.memory.task;
  creep.say(task.type);
  let result: ActionReturnCode;
  switch (task.type) {
    case TASK_IDLE: {
      result = ACTION_IN_PROGRESS;
      break;
    }
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
    case TASK_WITHDRAW: {
      result = action.withdraw(creep, task);
      break;
    }
    case TASK_PICKUP: {
      result = action.pickup(creep, task);
      break;
    }
    case TASK_TRANSFER: {
      result = action.transfer(creep, task);
      break;
    }
    case TASK_DROP_IN_PLACE: {
      result = action.dropInPlace(creep, task);
      break;
    }
    case TASK_BUILD: {
      result = action.build(creep, task);
      break;
    }
    case TASK_REPAIR: {
      result = action.repair(creep, task);
      break;
    }
    case TASK_UPGRADE: {
      result = action.upgrade(creep, task);
      break;
    }
    case TASK_PARK: {
      result = action.park(creep, task);
      break;
    }
    // default: {
    //   result = ACTION_ERR_DROP_TASK_LIST;
    //   console.log(`Action for task ${task.type} is not implemented. Dropping the task.`);
    // }
  }

  let newTask: CreepTask;
  switch (result) {
    case ACTION_IN_PROGRESS: {
      return;
    }
    case ACTION_DONE:
    case ACTION_ERR_MOVE_ON: {
      newTask = task.next ?? { type: TASK_IDLE };
      handleRepeatableTask(task, newTask);
      break;
    }
    case ACTION_ERR_USE_FALLBACK: {
      if (task.fallback) {
        newTask = task.fallback;
        newTask.next = task.next ?? { type: TASK_IDLE };
      } else {
        newTask = task.next ?? { type: TASK_IDLE };
      }
      handleRepeatableTask(task, newTask);
      break;
    }
    case ACTION_ERR_DROP_TASK_LIST: {
      task.repeatable = false;
      newTask = { type: TASK_IDLE };
      break;
    }
    case ACTION_ERR_DROP_TASK_LIST_AFTER_FALLBACK: {
      task.repeatable = false;
      if (task.fallback) {
        newTask = task.fallback;
        newTask.next = { type: TASK_IDLE };
      } else {
        newTask = { type: TASK_IDLE };
      }
      break;
    }
  }

  cleanUpHarvesterAssignments(creep, task, newTask, result);
  cleanUpStoreReservationAssignments(creep, task);
  creep.memory.task = newTask;
};

const handleRepeatableTask = (task: CreepTask, newTask: CreepTask) => {
  if (task.repeatable) {
    let currTask = newTask;
    while (currTask.next && currTask.next.type !== TASK_IDLE) {
      currTask = currTask.next;
    }

    currTask.next = _.cloneDeep(task);
  }
};

const cleanUpHarvesterAssignments = (creep: Creep, task: CreepTask, newTask: CreepTask, result: ActionReturnCode) => {
  if (task.type !== TASK_HARVEST) {
    return;
  }

  let foundAnotherSource: boolean = false;
  if (!task.repeatable) {
    let currTask: CreepTask | undefined = newTask;

    while (currTask) {
      if (currTask.type === TASK_HARVEST && currTask.objectId !== task.objectId) {
        foundAnotherSource = true;
        break;
      }

      currTask = currTask.next;
    }
  }

  if (
    foundAnotherSource ||
    result === ACTION_ERR_DROP_TASK_LIST_AFTER_FALLBACK ||
    result === ACTION_ERR_DROP_TASK_LIST
  ) {
    const currentSource = Game.getObjectById(task.objectId);
    if (currentSource instanceof Source) {
      delete Memory.sources[currentSource.id].assignedCreeps[creep.name];
    } else if (currentSource instanceof Deposit) {
      delete Memory.deposits[currentSource.id].assignedCreeps[creep.name];
    } else if (currentSource instanceof Mineral) {
      delete Memory.minerals[currentSource.id].assignedCreeps[creep.name];
    }
  }
};

const cleanUpStoreReservationAssignments = (creep: Creep, task: CreepTask) => {
  if (task.type === TASK_TRANSFER) {
    Core.getStorageController(task.targetId)?.deleteIncomingDelivery(task.targetId, creep.name);
    return;
  }

  if (task.type === TASK_WITHDRAW) {
    Core.getStorageController(task.targetId)?.deleteOutgoingStoreReservation(task.targetId, creep.name);
    return;
  }

  if (task.type === TASK_PICKUP) {
    Core.getStorageController(task.targetId)?.deleteOutgoingResourceReservation(task.targetId, creep.name);
    return;
  }
};
