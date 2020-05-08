export abstract class JobBuilder {
  public abstract buildJobList(): Job[];
  protected findPriorityJobs(): Job[] {
    return [];
  }
}
