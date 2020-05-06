import _ from "lodash";
import { JobBuilder } from "./JobBuilder";

const MAX_WORKING_PARTS = 11;

export class HarvesterJobBuilder extends JobBuilder {
  private clusterInfo: ClusterInfo;
  private sources: { [sourceId: string]: string };
  private minerals: { [mineralId: string]: string };
  private sourcesAndMinerals: { [harvestableId: string]: string };

  constructor(clusterInfo: ClusterInfo) {
    super();

    this.clusterInfo = clusterInfo;

    this.sources = clusterInfo.sources;
    this.minerals = clusterInfo.minerals;
    this.sourcesAndMinerals = { ...this.sources, ...this.minerals };
  }

  public buildJobList(): Job[] {
    let jobs: Job[] = [];

    // prioritize sources with containers?
    _.forEach(Object.keys(this.sourcesAndMinerals), (id: string) => {
      const harvestable = Game.getObjectById<Source | Mineral>(id);

      if (harvestable === null) {
        // todo: handle rooms with currently no visibility in them
        return;
      }

      if (harvestable instanceof Mineral) {
        // todo: account for mineral's density
        if (
          harvestable.pos
            .findInRange(FIND_MY_STRUCTURES, 0)
            .filter((structure: AnyOwnedStructure) => structure.structureType === STRUCTURE_EXTRACTOR).length === 0
        ) {
          return;
        }
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
      const resource = harvestable instanceof Source ? RESOURCE_ENERGY : harvestable.mineralType;

      let nextTask: CreepTask;
      if (containerId) {
        nextTask = {
          type: TASK_TRANSFER,
          targetId: containerId,
          resource: resource,
          fallback: {
            type: TASK_DROP_IN_PLACE,
            resource: resource
          }
        };
      } else {
        nextTask = {
          type: TASK_DROP_IN_PLACE,
          resource: resource
        };
      }

      const job: HarvestJob = {
        type: TASK_HARVEST,
        priority: harvestable instanceof Source ? PRIORITY_NORMAL : PRIORITY_LOW,
        repeatable: true,
        objectId: harvestable.id,
        spotsAvailable: availableSpots,
        workPartsNeeded: MAX_WORKING_PARTS - workingParts,
        nextTask: nextTask
      };

      jobs.push(job);
    });

    jobs = _.orderBy(jobs, [(j: Job) => j.priority, "workPartsNeeded"], ["desc", "desc"]);

    return jobs;
  }
}
