import "consts";
import ClusterManager from "manager";
import "prototypes";
import { ErrorMapper } from "utils/ErrorMapper";
import * as Config from "./game/config";

const managerConfigs = Config.CLUSTERS;
const managers: ClusterManager[] = [];

managerConfigs.forEach((manager: { name: string; room: string }) =>
  managers.push(new ClusterManager(manager.name, manager.room))
);

export const loop = ErrorMapper.wrapLoop(() => {
  for (const creepName in Memory.creeps) {
    if (!(creepName in Game.creeps)) {
      delete Memory.creeps[creepName];
      // todo: also delete creep assignments, e.g. to sources, in case the creep died without properly dropping the task
    }
  }

  for (const creepName in Game.creeps) {
    Game.creeps[creepName].act();
  }

  managers.forEach((manager: ClusterManager) => manager.manage());
});

console.log("[!] Scripts uploaded");
