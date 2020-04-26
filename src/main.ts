import { ErrorMapper } from "utils/ErrorMapper";
import Manager from "manager";

const managerRooms = ["W7N6"];
const managers: Manager[] = [];

managerRooms.forEach((room: string) => managers.push(new Manager(room)));

export const loop = ErrorMapper.wrapLoop(() => {
  managers.forEach((manager: Manager) => manager.manage());
});

console.log("[!] Scripts uploaded");
