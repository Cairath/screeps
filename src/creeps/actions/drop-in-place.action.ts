export const dropInPlace = (creep: Creep, task: DropInPlaceTask): ACTION_DONE => {
  creep.drop(task.resource);
  return ACTION_DONE;
};
