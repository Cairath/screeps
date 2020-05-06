import _ from "lodash";
import { JobBuilder } from "./JobBuilder";

export class BuilderJobBuilder extends JobBuilder {
  private clusterInfo: ClusterInfo;

  constructor(clusterInfo: ClusterInfo) {
    super();

    this.clusterInfo = clusterInfo;
  }

  public buildJobList(): Job[] {
    let jobs: Job[] = [];

    jobs = _.orderBy(jobs, (j: Job) => j.priority, "desc");

    return jobs;
  }
}
