import _ from "lodash";

const MAX_WORKING_PARTS = 11;

export function buildJobList(clusterInfo: ClusterInfo): Job[] {
  let jobs: Job[] = [];
  const sources = clusterInfo.sources;
  const minerals = clusterInfo.minerals;

  const sourcesAndMinerals = { ...sources, ...minerals };

  // prioritize sources with containers?
  _.forEach(Object.keys(sourcesAndMinerals), (id: string) => {
    const harvestable = Game.getObjectById<Source | Mineral>(id);

    if (harvestable === null) {
      // todo: handle rooms with currently no visibility in them
      return;
    }

    const availableSpots = harvestable.accessibleSpots - _.size(harvestable.memory.assignedCreeps);

    if (availableSpots < 1) {
      return;
    }

    const workingParts = _.sumBy(_.values(harvestable.memory.assignedCreeps), (v) => v.workParts);
    if (workingParts >= MAX_WORKING_PARTS) {
      return;
    }

    const containerId = harvestable.containerId;
    let nextTask: CreepTask;

    if (containerId) {
      nextTask = {
        type: TASK_TRANSFER,
        objectId: containerId,
        resource: RESOURCE_ENERGY,
        structureType: STRUCTURE_CONTAINER,
        fallback: {
          type: TASK_DROP_IN_PLACE,
          resource: RESOURCE_ENERGY
        }
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
      workPartsNeeded: MAX_WORKING_PARTS - workingParts,
      nextTask: nextTask
    };

    jobs.push(job);
  });

  jobs = _.orderBy(jobs, (j: Job) => [j.priority, "workPartsNeeded"], ["desc", "desc"]);

  return jobs;
}
