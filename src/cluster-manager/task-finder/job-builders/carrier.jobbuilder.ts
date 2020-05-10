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

  public buildJobList(): Job[] {
    let jobs: Job[] = [];

    const storageController = this.clusterManager.storageController;

    const storesWithEmptyMode = storageController.getStores(STORAGE_MODE_EMPTY);
    const storesWithFillMode = storageController.getStores(STORAGE_MODE_FILL);
    const storesWithNormalMode = storageController.getStores(STORAGE_MODE_FILL);
    const storesWithoutEmptyMode = [...storesWithFillMode, ...storesWithNormalMode];

    const carryCapacitiesAtCurrentTier =
      _.filter(
        RoleBodyConfigurations.carrier[this.clusterManager.creepsTier],
        (part: BodyPartConstant) => part === CARRY
      ).length * CARRY_CAPACITY;

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
          priority: PRIORITY_NORMAL,
          objectId: object.id,
          resource: resource,
          amount: amount
        };

        jobs.push(withdrawJob);
      });
    });

    jobs = _.orderBy(jobs, [(j: Job) => j.priority, "amount"], ["desc", "desc"]);
    return jobs;
  }
}
