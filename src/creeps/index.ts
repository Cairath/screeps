import { harvester } from "./harvester";
import { builder } from "./builder";

export const Harvester = harvester;
export const Builder = builder;

export const Roles = {
  [Harvester.name]: Harvester,
  [Builder.name]: Builder
};
