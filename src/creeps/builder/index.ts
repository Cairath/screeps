import { body } from "./builder.body";
import { act } from "./builder.brain";

export const builder: CreepRole = {
  name: ROLE_BUILDER,
  body: body,
  act: act
};
