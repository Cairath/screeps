import "consts";
import { Core } from "core";
import "prototypes";
import { ErrorMapper } from "utils/ErrorMapper";

Core.init();

export const loop = ErrorMapper.wrapLoop(Core.loop);

console.log("[!] Scripts uploaded");
