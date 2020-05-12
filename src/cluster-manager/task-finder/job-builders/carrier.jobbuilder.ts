import { ClusterManager } from "cluster-manager";
import _ from "lodash";
import { JobBuilder } from "./JobBuilder";
import { StorageController } from "cluster-manager/storage-controller/StorageController";
import { RoleBodyConfigurations } from "creeps";
import * as storageUtils from "../../storage-controller/utils";

export class CarrierJobBuilder extends JobBuilder {
  private clusterManager: ClusterManager;

  constructor(clusterManager: ClusterManager) {
    super();

    this.clusterManager = clusterManager;
  }

  public buildJobList(): CarrierJob[] {
    let jobs: CarrierJob[] = [];

    const storageController = this.clusterManager.storageController;

    const storesWithEmptyMode = storageController.getStores(STORAGE_MODE_EMPTY);
    const storesWithFillMode = storageController.getStores(STORAGE_MODE_FILL) as StructureWithStoreDefinition[];
    const looseResources = storageController.getLooseResources();

    const carryCapacitiesAtCurrentTier =
      _.filter(
        RoleBodyConfigurations.carrier[this.clusterManager.creepsTier],
        (part: BodyPartConstant) => part === CARRY
      ).length * CARRY_CAPACITY;

    /* Assigning loose resources */
    looseResources.forEach((looseRes: Resource) => {
      const resourceAmount = storageController.getResourceAmountAfterOutgoingReservations(looseRes);
      if (resourceAmount < 20) {
        // todo: const for when to stop picking resources off the ground, mind decay
        return;
      }
      const pickupJob: PickupJob = {
        type: TASK_PICKUP,
        priority: PRIORITY_HIGH,
        objectId: looseRes.id,
        resource: looseRes.resourceType,
        amount: resourceAmount
      };

      jobs.push(pickupJob);
    });

    /* Assigning stores to empty */
    storesWithEmptyMode.forEach((object: StructureWithStoreDefinition | Tombstone | Ruin) => {
      const store = object.store as StoreDefinition;
      if (store.getUsedCapacity() < carryCapacitiesAtCurrentTier) {
        return;
      }

      const resourcesInStore = storageUtils.getResourcesInStore(store);

      (Object.keys(resourcesInStore) as ResourceConstant[]).forEach((resource: ResourceConstant) => {
        const amount = this.clusterManager.storageController.getResourcesAfterOutgoingReservations(object, resource);

        if (!amount || amount < carryCapacitiesAtCurrentTier) {
          return;
        }

        const withdrawJob: WithdrawJob = {
          type: TASK_WITHDRAW,
          priority: object instanceof Tombstone || object instanceof Ruin ? PRIORITY_HIGH : PRIORITY_NORMAL,
          objectId: object.id,
          resource: resource,
          amount: amount
        };

        jobs.push(withdrawJob);
      });
    });

    /* Assigning stores to fill */
    storesWithFillMode.forEach((object: StructureWithStoreDefinition) => {
      const resource = RESOURCE_ENERGY; // todo: have buildings store their resource preferences

      const availableSpace = this.clusterManager.storageController.getAvailableSpaceAfterIncomingDeliveries(
        object,
        resource
      );

      if (availableSpace <= 0) {
        return;
      }

      const transferJob: TransferJob = {
        type: TASK_TRANSFER,
        priority:
          object instanceof StructureSpawn || object instanceof StructureExtension ? PRIORITY_HIGH : PRIORITY_NORMAL,
        targetId: object.id,
        resource: resource,
        amount: availableSpace
      };

      jobs.push(transferJob);
    });

    jobs = _.orderBy(jobs, [(j: CarrierJob) => j.priority, (j: CarrierJob) => j.amount], ["desc", "desc"]);
    //  console.log(JSON.stringify(jobs, null, 2));
    return jobs;
  }
}
