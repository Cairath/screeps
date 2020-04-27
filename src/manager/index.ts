import _ from "lodash";

class ClusterManager {
  cluster: string; // main cluster room with spawns
  // additionalRooms: string[] -- rooms to manage for mining resources. possibly a dictionary or a record of room name,
  // and specifying whether type of management (mining sources / minerals / both / something else???)

  constructor(room: string) {
    this.cluster = room;
  }

  manage() {
    const roomCreeps = _.filter(Game.creeps, (creep: Creep) => creep.memory.cluster === this.cluster);
    // handle creep numbers. calculate how many of which need to be alive and adjust accordingly

    // check if there are any priority jobs, such as gathering loot that is decaying, critical repair etc.
    // construct a list of those jobs grouped by job type / role

    const idleCreeps = _.filter(roomCreeps, (creep: Creep) => creep.memory.task.type === TASK_IDLE);

    if (!idleCreeps || idleCreeps.length === 0) {
      // if there are priority jobs and no idle creep for a given job, grab the most fitting busy creep and make him do that

      return;
    }
    /* if there are any idle creeps
        - construct a list of available idle roles (dictionary of role - count?)
        - find and assign jobs for the list above
    */
  }
}

export default ClusterManager;
