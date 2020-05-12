import _ from "lodash";
import { JobBuilder } from "./JobBuilder";
import { ClusterManager } from "cluster-manager";

const MAX_WORKING_PARTS = 11;

export class HarvesterJobBuilder extends JobBuilder {
  private clusterManager: ClusterManager;
  private sources: { [sourceId: string]: string } = {};
  private minerals: { [mineralId: string]: string } = {};
  private sourcesAndMinerals: { [harvestableId: string]: string };

  constructor(clusterManager: ClusterManager) {
    super();

    this.clusterManager = clusterManager;

    // todo: handle additional rooms.
    Game.rooms[clusterManager.baseRoom].sources.map((source: Source) => {
      this.sources[source.id] = source.room.name;
    });

    Game.rooms[clusterManager.baseRoom].find(FIND_MINERALS).map((mineral: Mineral) => {
      this.minerals[mineral.id] = mineral.room.name;
    });

    this.sourcesAndMinerals = { ...this.sources, ...this.minerals };
  }

  public buildJobList(): HarvesterJob[] {
    // todo: rewrite this for better handling type of the harvestable; add handling deposits
    let jobs: HarvesterJob[] = [];

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

      const availableSpots =
        harvestable instanceof Mineral
          ? _.size(harvestable.memory.assignedCreeps) === 0
            ? 1
            : 0
          : harvestable.accessibleSpots - _.size(harvestable.memory.assignedCreeps);

      if (availableSpots < 1) {
        return;
      }

      const workingParts = _.sumBy(
        _.values(harvestable.memory.assignedCreeps),
        (v: HarvestableCreepAssignment) => v.workParts
      );
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

    jobs = _.orderBy(jobs, [(j: HarvesterJob) => j.priority, (j: HarvesterJob) => j.workPartsNeeded], ["desc", "desc"]);

    return jobs;
  }
}
