import _ from "lodash";
import * as TaskBuilder from "./job-builders";

export class TaskFinder {
  private clusterInfo: ClusterInfo;
  private parkSpot: RoomPosition;

  constructor(cluster: ClusterInfo) {
    this.clusterInfo = cluster;
    this.parkSpot = new RoomPosition(19, 24, cluster.baseRoom); // todo: not hardcoded position
  }

  assignTasks() {
    const harvesterJobs = TaskBuilder.BuildHarvesterJobList(this.clusterInfo);
    const builderJobs = TaskBuilder.BuildBuilderJobList(this.clusterInfo);
    const carrierJobs = TaskBuilder.BuildCarrierJobList(this.clusterInfo);

    const creeps = _.filter(Game.creeps, (creep: Creep) => creep.memory.cluster === this.clusterInfo.name);

    // todo: split meeeeee
    const harvesters = creeps.filter((creep: Creep) => creep.memory.role === ROLE_HARVESTER);
    const idleHarvesters = harvesters.filter((creep: Creep) => creep.isIdle);
    idleHarvesters.forEach((creep: Creep) => {
      const job = harvesterJobs.length > 0 ? harvesterJobs[0] : null;
      if (!job) {
        const task: ParkTask = {
          type: TASK_PARK,
          location: this.parkSpot
        };

        creep.memory.task = task;
        return;
      }

      switch (job.type) {
        case TASK_HARVEST: {
          // todo: split me tooooo
          creep.memory.task = {
            type: TASK_HARVEST,
            repeatable: job.repeatable,
            objectId: job.objectId,
            next: job.nextTask,
            fallback: job.fallbackTask
          };

          const workParts = _.filter(creep.body, (body) => body.type === WORK).length;

          Game.getObjectById<Source>(job.objectId)!.memory.assignedCreeps[creep.id] = {
            workParts: workParts
          };

          job.spotsAvailable--;
          job.workPartsNeeded = -workParts;
          if (job.spotsAvailable === 0 || job.workPartsNeeded === 0) {
            harvesterJobs.shift();
          }

          break;
        }
        default: {
          console.log(`Attempted to assign ${job.type} task to ${creep.name} but its role cannot handle that.`);
        }
      }
    });
  }
}
