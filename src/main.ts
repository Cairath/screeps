import { ErrorMapper } from "utils/ErrorMapper";
import ClusterManager from "manager";
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
    }
  }

  for (const creepName in Game.creeps) {
    Game.creeps[creepName].act();
  }

  managers.forEach((manager: ClusterManager) => manager.manage());
});

console.log("[!] Scripts uploaded");
