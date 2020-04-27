import { ErrorMapper } from "utils/ErrorMapper";
import ClusterManager from "manager";

const managerRooms = ["W7N6"];
const managers: ClusterManager[] = [];

managerRooms.forEach((room: string) => managers.push(new ClusterManager(room)));

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
