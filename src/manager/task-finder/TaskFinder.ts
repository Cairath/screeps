import * as TaskBuilder from "./job-builders";

export class TaskFinder {
  private clusterInfo: ClusterInfo;

  constructor(cluster: ClusterInfo) {
    this.clusterInfo = cluster;
  }

  assignTasks() {
    let harvesterJobs = TaskBuilder.BuildHarvesterJobList(this.clusterInfo);
    // todo: assign creep to source when assigning it a task!
    let builderJobs = TaskBuilder.BuildBuilderJobList(this.clusterInfo);
    let carrierJobs = TaskBuilder.BuildCarrierJobList(this.clusterInfo);
  }

  // static assignTasks(creeps: Creep[]) {
  //   let priorityTasks = this.findPriorityTasks();

  //   const idleCreeps = creeps.filter(
  //     (creep: Creep) => creep.memory.task.type === TASK_IDLE || creep.memory.task.type === TASK_PARK
  //   );

  //   // if (!idleCreeps || idleCreeps.length === 0) {
  //   //   // if there are priority jobs and no idle creep for a given job, grab the most fitting busy creep and make him do that

  //   //   return;
  //   // }

  //   (Object.keys(priorityTasks) as RoleConstant[]).forEach((role: RoleConstant) => {
  //     const idleWithRole = idleCreeps.filter((creep: Creep) => creep.memory.role === role);
  //   });

  //   /* if there are any idle creeps
  //       - construct a list of available idle roles (dictionary of role - count?)
  //       - find and assign jobs for the list above
  //   */
  // }
}
