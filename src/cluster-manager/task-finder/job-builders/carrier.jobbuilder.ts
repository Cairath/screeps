import { ClusterManager } from "cluster-manager";
import _ from "lodash";
import { JobBuilder } from "./JobBuilder";

export class CarrierJobBuilder extends JobBuilder {
  private clusterManager: ClusterManager;

  constructor(clusterManager: ClusterManager) {
    super();

    this.clusterManager = clusterManager;
  }

  public buildJobList(): Job[] {
    let jobs: Job[] = [];

    jobs = _.orderBy(jobs, (j: Job) => j.priority, "desc");

    return jobs;
  }
}
