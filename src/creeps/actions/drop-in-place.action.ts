export const dropInPlace = (creep: Creep, task: DropInPlaceTask): ActionReturnCode => {
  creep.drop(task.resource);
  return ACTION_DONE;
};
