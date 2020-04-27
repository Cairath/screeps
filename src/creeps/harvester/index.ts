import { body } from "./harvester.body";
import { act } from "./harvester.brain";

export const harvester: CreepRole = {
  name: ROLE_HARVESTER,
  body: body,
  act: act
};
