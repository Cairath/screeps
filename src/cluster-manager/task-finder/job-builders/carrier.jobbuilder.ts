import { ClusterManager } from "cluster-manager";
import _ from "lodash";
import { JobBuilder } from "./JobBuilder";
import { StorageController } from "cluster-manager/storage-controller/StorageController";

export class CarrierJobBuilder extends JobBuilder {
  private clusterManager: ClusterManager;
  private storageController: StorageController;

  constructor(clusterManager: ClusterManager) {
    super();

    this.clusterManager = clusterManager;
    this.storageController = clusterManager.storageController;
  }

  public buildJobList(): Job[] {
    let jobs: Job[] = [];

    jobs = _.orderBy(jobs, (j: Job) => j.priority, "desc");

    return jobs;
  }

  protected findPriorityJobs(): Job[] {
    return [];
  }
}
