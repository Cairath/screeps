import { ErrorMapper } from "utils/ErrorMapper";

export const loop = ErrorMapper.wrapLoop(() => {
  // empty
});

console.log(`[${Date.now()}] Scripts uploaded`);
