import _ from "lodash";
import * as JobBuilder from "./job-builders";
import { ClusterManager } from "cluster-manager/ClusterManager";
import * as storageUtils from "../storage-controller/utils";

export class TaskFinder {
  private clusterManager: ClusterManager;
  private parkSpot: RoomPosition;

  private harvesterJobBuilder: JobBuilder.HarvesterJobBuilder;
  private carrierJobBuilder: JobBuilder.CarrierJobBuilder;
  private builderJobBuilder: JobBuilder.BuilderJobBuilder;

  constructor(clusterManager: ClusterManager) {
    this.clusterManager = clusterManager;
    this.parkSpot = new RoomPosition(19, 24, clusterManager.baseRoom); // todo: not hardcoded position

    this.harvesterJobBuilder = new JobBuilder.HarvesterJobBuilder(this.clusterManager);
    this.carrierJobBuilder = new JobBuilder.CarrierJobBuilder(this.clusterManager);
    this.builderJobBuilder = new JobBuilder.BuilderJobBuilder(this.clusterManager);
  }

  assignTasks(): void {
    const creeps = _.filter(
      Game.creeps,
      (creep: Creep) => creep.memory.cluster === this.clusterManager.name && !creep.spawning
    );

    this.assignHarvesters(creeps);
    this.assignBuilders(creeps);
    this.assignCarriers(creeps);

    const idleCreeps = creeps.filter((creep: Creep) => creep.isIdle);
    idleCreeps.forEach((creep: Creep) => {
      const task: ParkTask = {
        type: TASK_PARK,
        location: this.parkSpot
      };

      creep.memory.task = task;
    });
  }

  private assignHarvesters(creeps: Creep[]): void {
    const jobs = this.harvesterJobBuilder.buildJobList();
    const allCreeps = creeps.filter((creep: Creep) => creep.memory.role === ROLE_HARVESTER);
    const idleCreeps = allCreeps.filter((creep: Creep) => creep.isIdle);

    idleCreeps.forEach((creep: Creep) => {
      const job = jobs.length > 0 ? jobs[0] : null;
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
          // todo: handle situation in which container appears while the repeatable task is running
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
            jobs.shift();
          }

          break;
        }
        default: {
          console.log(
            `Attempted to assign ${job.type} task to ${
              creep.name
            } but its role ${creep.memory.role.toUpperCase()} cannot handle that.`
          );
        }
      }
    });
  }

  private assignCarriers(creeps: Creep[]): void {
    let jobs = this.carrierJobBuilder.buildJobList();
    const allCreeps = creeps.filter((creep: Creep) => creep.memory.role === ROLE_CARRIER);
    let idleCreeps = allCreeps.filter((creep: Creep) => creep.isIdle);
    const idleNotEmptyCreeps = idleCreeps.filter((creep: Creep) => !creep.isEmpty);

    idleNotEmptyCreeps.forEach((creep: Creep) => {
      const creepResources = storageUtils.getResourcesInStore(creep.store);

      (Object.keys(creepResources) as ResourceConstant[]).forEach((resource: ResourceConstant) => {
        const amount = creepResources[resource];

        if (!amount) {
          return;
        }

        const deliveryTarget = this.clusterManager.storageController.getDeliveryTarget(creep, resource, amount);
        if (!deliveryTarget) {
          return;
        }

        const transferTask: TransferTask = {
          type: TASK_TRANSFER,
          targetId: deliveryTarget.id,
          resource: resource
        };

        creep.memory.task = transferTask;
        this.clusterManager.storageController.addIncomingDelivery(deliveryTarget.id, creep.name, resource, amount);
      });
    });

    // re-filter to get out the creeps that just got an assignment
    idleCreeps = allCreeps.filter((creep: Creep) => creep.isIdle && !creep.isFull);

    while (idleCreeps.length > 0 && jobs.length > 0) {
      const job = jobs[0];
      switch (job.type) {
        case TASK_WITHDRAW: {
          const target = Game.getObjectById(job.objectId);
          if (!target) {
            jobs.shift();
            break;
          }

          const closestIdleCreep = _(idleCreeps)
            .orderBy((creep: Creep) => target.pos.findPathTo(creep).length)
            .shift();

          if (!closestIdleCreep) {
            jobs.shift();
            break;
          }

          const creepCapacity = closestIdleCreep.store.getFreeCapacity(job.resource);

          const withdrawTask: WithdrawTask = {
            type: TASK_WITHDRAW,
            targetId: job.objectId,
            resource: job.resource,
            amount: creepCapacity
            // next: job.nextTask // todo: will this ever have a next?
          };

          closestIdleCreep.memory.task = withdrawTask;
          this.clusterManager.storageController.addOutgoingStoreReservation(
            target.id,
            closestIdleCreep.name,
            job.resource,
            creepCapacity
          );

          job.amount -= creepCapacity;
          if (job.amount <= 0) {
            jobs.shift();
          }

          break;
        }
        case TASK_PICKUP: {
          const target = Game.getObjectById(job.objectId);
          if (!target) {
            jobs.shift();
            break;
          }

          const closestIdleCreep = _(idleCreeps)
            .orderBy((creep: Creep) => target.pos.findPathTo(creep).length)
            .first();

          if (!closestIdleCreep) {
            jobs.shift();
            break;
          }

          const creepCapacity = closestIdleCreep.store.getFreeCapacity(job.resource);

          const pickupTask: PickupTask = {
            type: TASK_PICKUP,
            targetId: job.objectId,
            resource: job.resource
            // amount: creepCapacity
            // next: job.nextTask // todo: will this ever have a next?
          };

          closestIdleCreep.memory.task = pickupTask;
          this.clusterManager.storageController.addOutgoingResourceReservation(
            target.id,
            closestIdleCreep.name,
            creepCapacity
          );

          job.amount -= creepCapacity;
          if (job.amount <= 0) {
            jobs.shift();
          }

          break;
        }
        case TASK_TRANSFER: {
          const target = Game.getObjectById(job.targetId);
          if (!target) {
            jobs.shift();
            break;
          }

          const withdrawTarget = this.clusterManager.storageController.getClosestWithdrawTarget(
            target.pos,
            job.resource
          );
          if (!withdrawTarget) {
            jobs.shift();
            break;
          }

          const closestIdleCreep = _(idleCreeps)
            .orderBy((creep: Creep) => withdrawTarget.pos.findPathTo(creep).length)
            .first();

          if (!closestIdleCreep) {
            jobs.shift();
            break;
          }

          const creepCapacity = closestIdleCreep.store.getFreeCapacity(job.resource);
          const resourceInStore = this.clusterManager.storageController.getResourcesAfterOutgoingReservations(
            withdrawTarget,
            job.resource
          );

          const taskResAmount = Math.min(creepCapacity, resourceInStore);

          const withdrawTask: WithdrawTask = {
            type: TASK_WITHDRAW,
            targetId: withdrawTarget.id,
            resource: job.resource,
            amount: taskResAmount
          };

          const transferTask: TransferTask = {
            type: TASK_TRANSFER,
            targetId: job.targetId,
            resource: job.resource,
            amount: taskResAmount
          };

          withdrawTask.next = transferTask;

          closestIdleCreep.memory.task = withdrawTask;
          this.clusterManager.storageController.addOutgoingStoreReservation(
            withdrawTarget.id,
            closestIdleCreep.name,
            job.resource,
            taskResAmount
          );

          this.clusterManager.storageController.addIncomingDelivery(
            job.targetId,
            closestIdleCreep.name,
            job.resource,
            taskResAmount
          );

          job.amount -= taskResAmount;
          if (job.amount <= 0) {
            jobs.shift();
          }

          break;
        }
      }

      jobs = _.orderBy(jobs, [(j: CarrierJob) => j.priority, (j: CarrierJob) => j.amount], ["desc", "desc"]);
      _.remove(idleCreeps, (c: Creep) => !c.isIdle);
    }
  }

  private assignBuilders(creeps: Creep[]): void {
    // todo
  }
}
