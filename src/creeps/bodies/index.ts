import harvester from "./harvester.body";
import builder from "./builder.body";

export const HarvesterBody = harvester;
export const BuilderBody = builder;

export const RoleBodyConfigurations: Record<RoleConstant, BodyPartConstant[]> = {
  [ROLE_HARVESTER]: HarvesterBody,
  [ROLE_BUILDER]: BuilderBody,
  [ROLE_CARRIER]: BuilderBody,
  [ROLE_UPGRADER]: BuilderBody
};
