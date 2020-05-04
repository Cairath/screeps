export const harvest = (
  creep: Creep,
  task: HarvestTask
): ACTION_OK | ACTION_ERR_FULL | ACTION_ERR_NOT_ENOUGH_RESOURCES | ACTION_ERR_NOT_FOUND => {
  if (creep.isFull) {
    return ACTION_ERR_FULL;
  }

  const deposit = Game.getObjectById(task.objectId);
  if (deposit === null) {
    return ACTION_ERR_NOT_FOUND;
  }

  const result = creep.harvest(deposit);
  if (result === ERR_NOT_IN_RANGE) {
    creep.moveTo(deposit, { visualizePathStyle: { stroke: "#ffaa00" } });
  } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
    return ACTION_ERR_NOT_ENOUGH_RESOURCES;
  }

  return ACTION_OK;
};
