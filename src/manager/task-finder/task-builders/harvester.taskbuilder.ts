import { TASK_DROP_IN_PLACE } from "consts/tasks.consts";

export function buildTasks(clusterInfo: ClusterInfo): CreepTask[] {
  /*
  - find a source that has less than 10 work parts on it and still has a spot around it
  - assign a HARVEST task, let the source know (? or when assigning? potentially need multiple tasks here?)
  - assign a DROPENERGY task.next if source does not have its container
  - assing a TRANSFER task.next if source has its container
*/

  const fakeSrc = Game.rooms[clusterInfo.baseRoom]
    .find(FIND_SOURCES)
    .filter((source: Source) => source.id === "someId")
    .shift() as Source;

  const fakeTask: HarvestTask = {
    type: TASK_HARVEST,
    repeatable: true,
    objectId: fakeSrc.id
  };

  let fakeNextTask: CreepTask;
  if (fakeSrc.memory.containerId) {
    fakeNextTask = {
      type: TASK_TRANSFER,
      objectId: fakeSrc.memory.containerId,
      resource: RESOURCE_ENERGY,
      structureType: STRUCTURE_CONTAINER
    };
  } else {
    fakeNextTask = {
      type: TASK_DROP_IN_PLACE,
      resource: RESOURCE_ENERGY
    };
  }

  fakeTask.next = fakeNextTask;

  return [fakeTask];
}
