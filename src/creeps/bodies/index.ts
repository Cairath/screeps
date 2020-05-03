import harvester from "./harvester.body";
import builder from "./builder.body";
import carrier from "./carrier.body";

export const HarvesterBody = harvester;
export const BuilderBody = builder;
export const CarrierBody = carrier;

export const RoleBodyConfigurations: Record<RoleConstant, BodyPartConstant[][]> = {
  [ROLE_HARVESTER]: HarvesterBody,
  [ROLE_BUILDER]: BuilderBody,
  [ROLE_CARRIER]: CarrierBody
};
