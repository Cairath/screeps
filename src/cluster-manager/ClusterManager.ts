import { RoleBodyConfigurations } from "creeps/bodies";
import _ from "lodash";
import { TaskFinder } from "./task-finder/TaskFinder";
import { StorageController } from "./storage-controller/StorageController";

const RENEWAL_TICKS: number = 150;

export class ClusterManager {
  name: string;
  baseRoom: string; // main cluster room with spawns
  taskFinder: TaskFinder;
  storageController: StorageController;

  get creepsTier() {
    return 0; // todo: actual calculations
  }
  // additionalRooms: string[] -- rooms to manage for mining resources. possibly a dictionary or a record of room name,
  // and specifying whether type of management (mining sources / minerals / both / something else???)

  constructor(name: string, room: string) {
    this.name = name;
    this.baseRoom = room;

    if (!Memory.clusters[name]) {
      Memory.clusters[name] = { stores: {} };
    }

    // todo ????
    this.taskFinder = new TaskFinder(this);
    this.storageController = new StorageController(this);
  }

  public manage() {
    this.handleRenewalNeeds();
    this.adjustCreepPopulation();
    this.registerTombsAndRuinsInStorageController();
    this.taskFinder.assignTasks();
  }

  private handleRenewalNeeds() {
    const creepsToRenew = _.filter(
      Game.creeps,
      (creep: Creep) =>
        !!creep.ticksToLive && creep.ticksToLive < RENEWAL_TICKS && creep.memory.task.type !== TASK_RENEW
    );

    creepsToRenew.forEach((creep: Creep) => {
      // todo: handle this nicer without creeps ganging up on one spawn and waiting too long
      const renewTask: RenewTask = {
        type: TASK_RENEW,
        spawnId: Game.rooms[this.baseRoom].find(FIND_MY_SPAWNS)[0].id
      };

      const currentTask = creep.memory.task;
      renewTask.next = currentTask;
      creep.memory.task = renewTask;
    });
  }

  private adjustCreepPopulation() {
    const aliveCreepCount = _.chain(Game.creeps)
      .filter((creep: Creep) => creep.memory.cluster === this.name)
      .countBy((creep: Creep) => creep.memory.role)
      .value();

    const requestedCreepCount = this.calculateRequiredCreeps();

    const requiredSpawns: RoleConstant[] = [];
    const requiredRecycling: RoleConstant[] = [];
    const roles = Object.keys(requestedCreepCount) as RoleConstant[];

    for (const role of roles) {
      const diff = requestedCreepCount[role] - (aliveCreepCount[role] ?? 0);

      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          requiredSpawns.push(role);
          // todo: prioritize the requirements
        }
      } else {
        for (let i = 0; i > diff; i--) {
          requiredRecycling.push(role);
        }
      }
    }

    this.spawnCreeps(requiredSpawns);
    this.recycleCreeps(requiredRecycling);
  }

  private spawnCreeps(requiredSpawns: RoleConstant[]): void {
    if (requiredSpawns.length === 0) {
      return;
    }

    const spawns = Game.rooms[this.baseRoom].find(FIND_MY_SPAWNS);
    let nextSpawnRole = requiredSpawns.shift();
    let suffix = 0;
    const tier = this.creepsTier;

    spawns.forEach((spawn: StructureSpawn) => {
      if (!nextSpawnRole) {
        return;
      }

      const name = `${nextSpawnRole}-${this.name}-${Game.time}${suffix++}`;

      const opts: SpawnOptions = {
        memory: {
          role: nextSpawnRole,
          tier: tier,
          cluster: this.name,
          task: { type: TASK_IDLE }
        }
      };

      if (spawn.spawnCreep(RoleBodyConfigurations[nextSpawnRole][tier], name, { ...opts, dryRun: true }) === OK) {
        spawn.spawnCreep(RoleBodyConfigurations[nextSpawnRole][tier], name, opts);
        console.log(`Spawning new ${nextSpawnRole}: ` + name);

        nextSpawnRole = requiredSpawns.shift();
      }
    });
  }

  private recycleCreeps(requiredRecycling: RoleConstant[]) {
    const recycleRoleCount = _.countBy(requiredRecycling, (r: RoleConstant) => r);

    (Object.keys(recycleRoleCount) as RoleConstant[]).forEach((role: RoleConstant) => {
      const roleCreeps = _.filter(Game.creeps, (creep: Creep) => creep.memory.role === role);
      const creepsBeingRecycled = _.filter(
        roleCreeps,
        (creep: Creep) => creep.memory.task.type === TASK_RECYCLE || creep.memory.task.next?.type === TASK_RECYCLE
      );

      const numberToRecycle = recycleRoleCount[role] - creepsBeingRecycled.length;

      if (numberToRecycle === 0) {
        return;
      }

      const aliveRoleCreeps = _.chain(roleCreeps)
        .filter(
          (creep: Creep) => creep.memory.task.type !== TASK_RECYCLE && creep.memory.task.next?.type !== TASK_RECYCLE
        )
        .orderBy((creep: Creep) => creep.ticksToLive, "asc")
        .value();

      for (let i = 0; i < numberToRecycle; i++) {
        const creepToRecycle = aliveRoleCreeps.shift();
        if (!creepToRecycle) {
          continue;
        }

        const taskTypesToFinish: TaskConstant[] = [];

        const closestSpawn = creepToRecycle.pos.findClosestByPath(FIND_MY_SPAWNS);
        if (!closestSpawn) {
          console.log(`[ERROR]: attempting to recycle ${creepToRecycle.name} but it cannot find a spawn by path.`);
        } else {
          const task: RecycleTask = {
            type: TASK_RECYCLE,
            spawnId: closestSpawn.id
          };

          // todo: if a "suicide container" is available next to the spawn, go there.

          if (taskTypesToFinish.includes(creepToRecycle.memory.task.type)) {
            creepToRecycle.memory.task.next = task;
          } else {
            creepToRecycle.memory.task = task;
          }
        }
      }
    });
  }

  private calculateRequiredCreeps(): Record<RoleConstant, number> {
    // todo: actual calculations
    return {
      [ROLE_BUILDER]: 0,
      [ROLE_HARVESTER]: 1,
      [ROLE_CARRIER]: 2
    };
  }

  private registerTombsAndRuinsInStorageController(): void {
    // todo: handle additional rooms
    Game.rooms[this.baseRoom].find(FIND_RUINS).forEach((ruin: Ruin) => this.storageController.ensureInStores(ruin.id));
    Game.rooms[this.baseRoom]
      .find(FIND_TOMBSTONES)
      .forEach((tomb: Tombstone) => this.storageController.ensureInStores(tomb.id));
  }
}
