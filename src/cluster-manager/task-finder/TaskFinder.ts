import _ from "lodash";
import * as JobBuilder from "./job-builders";

export class TaskFinder {
  private clusterInfo: ClusterInfo;
  private parkSpot: RoomPosition;

  private harvesterJobBuilder: JobBuilder.HarvesterJobBuilder;
  private carrierJobBuilder: JobBuilder.CarrierJobBuilder;
  private builderJobBuilder: JobBuilder.BuilderJobBuilder;

  constructor(cluster: ClusterInfo) {
    this.clusterInfo = cluster;
    this.parkSpot = new RoomPosition(19, 24, cluster.baseRoom); // todo: not hardcoded position

    this.harvesterJobBuilder = new JobBuilder.HarvesterJobBuilder(this.clusterInfo);
    this.carrierJobBuilder = new JobBuilder.CarrierJobBuilder(this.clusterInfo);
    this.builderJobBuilder = new JobBuilder.BuilderJobBuilder(this.clusterInfo);
  }

  assignTasks() {
    const harvesterJobs = this.harvesterJobBuilder.buildJobList();
    const builderJobs = this.builderJobBuilder.buildJobList();
    const carrierJobs = this.carrierJobBuilder.buildJobList();

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

          Game.getObjectById(job.objectId)!.memory.assignedCreeps[creep.name] = {
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
