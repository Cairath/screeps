import * as _ from "lodash";

const MAX_WORKING_PARTS = 11;

export function buildJobList(clusterInfo: ClusterInfo): Job[] {
  /*
  - find a source that has less than 10 work parts on it and still has a spot around it
  - assign a HARVEST task, let the source know (? or when assigning? potentially need multiple tasks here?)
  - assign a DROPENERGY task.next if source does not have its container
  - assing a TRANSFER task.next if source has its container
*/

  let jobs: Job[] = [];
  const sources = clusterInfo.sources;
  const minerals = clusterInfo.minerals;

  const sourcesAndMinerals = { ...sources, ...minerals };

  _.forEach(Object.keys(sourcesAndMinerals), (id: string) => {
    const harvestable = Game.getObjectById<Source | Mineral>(id);

    if (harvestable === null) {
      // todo: handle rooms with currently no visibility in them
      return;
    }

    const availableSpots = harvestable.memory.accessibleSpots - _.size(harvestable.memory.assignedCreeps);

    if (availableSpots < 1) {
      return;
    }

    const workingParts = _.sumBy(_.values(harvestable.memory.assignedCreeps), (v) => v.workParts);
    if (workingParts >= MAX_WORKING_PARTS) {
      return;
    }

    const containerId = harvestable.memory.containerId;
    let nextTask: CreepTask;

    if (containerId) {
      nextTask = {
        type: TASK_TRANSFER,
        objectId: containerId,
        resource: RESOURCE_ENERGY,
        structureType: STRUCTURE_CONTAINER
      };
    } else {
      nextTask = {
        type: TASK_DROP_IN_PLACE,
        resource: RESOURCE_ENERGY
      };
    }

    const job: HarvestJob = {
      type: TASK_HARVEST,
      priority: PRIORITY_NORMAL,
      repeatable: true,
      objectId: harvestable.id,
      spotsAvailable: availableSpots,
      workPartsNeeded: MAX_WORKING_PARTS - workingParts
    };

    jobs.push(job);
  });

  jobs = _.orderBy(jobs, (j: Job) => j.priority, "desc");
  return jobs;
}
