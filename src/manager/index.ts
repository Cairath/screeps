import _ from "lodash";
import { RoleBodyConfigurations } from "creeps/bodies";
import { TaskFinder } from "./task-finder/TaskFinder";

class ClusterManager {
  name: string;
  baseRoom: string;
  taskFinder: TaskFinder; // main cluster room with spawns
  // additionalRooms: string[] -- rooms to manage for mining resources. possibly a dictionary or a record of room name,
  // and specifying whether type of management (mining sources / minerals / both / something else???)

  constructor(name: string, room: string) {
    this.name = name;
    this.baseRoom = room;
    this.taskFinder = new TaskFinder({ name: this.name, baseRoom: this.baseRoom });
  }

  manage() {
    this.adjustCreepPopulation();
    this.taskFinder.assignTasks();
  }

  private adjustCreepPopulation() {
    const aliveCreepCount = _.chain(Game.creeps)
      .filter((creep: Creep) => creep.memory.cluster === this.name)
      .countBy((creep: Creep) => creep.memory.role)
      .value();

    const requestedCreepCount = this.calculateRequiredCreeps();

    const requiredSpawns: RoleConstant[] = [];
    const requiredSuicides: RoleConstant[] = [];
    const roles = Object.keys(requestedCreepCount) as RoleConstant[];

    for (const role of roles) {
      const diff = requestedCreepCount[role] - aliveCreepCount[role];

      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          requiredSpawns.push(role);
          // todo: prioritize the requirements
        }
      } else {
        for (let i = 0; i > diff; i--) {
          requiredSuicides.push(role);
        }
      }
    }

    if (requiredSpawns.length === 0) {
      return;
    }

    // todo: split me to a spawning method
    const spawns = Game.rooms[this.baseRoom].find(FIND_MY_SPAWNS);
    let nextSpawnRole = requiredSpawns.shift();
    let suffix = 0;

    spawns.forEach((spawn: StructureSpawn) => {
      if (!nextSpawnRole) {
        return;
      }

      const opts: SpawnOptions = {
        memory: {
          role: nextSpawnRole,
          cluster: this.name,
          task: { type: TASK_IDLE }
        }
      };

      const name = `${nextSpawnRole}-${this.name}-${Game.time}${suffix++}`;

      if (spawn.spawnCreep(RoleBodyConfigurations[nextSpawnRole], name, { ...opts, dryRun: true }) === OK) {
        spawn.spawnCreep(RoleBodyConfigurations[nextSpawnRole], name, opts);
        console.log(`Spawning new ${nextSpawnRole}: ` + name);

        nextSpawnRole = requiredSpawns.shift();
      }
    });

    // todo: handle suicides
  }

  private calculateRequiredCreeps(): Record<RoleConstant, number> {
    // todo: actual calculations
    return {
      [ROLE_BUILDER]: 1,
      [ROLE_HARVESTER]: 1,
      [ROLE_UPGRADER]: 1,
      [ROLE_CARRIER]: 1
    };
  }
}

export default ClusterManager;
