import { buildTasks as buildBuilderTasks } from "./builder.taskbuilder";
import { buildTasks as buildCarrierTasks } from "./carrier.taskbuilder";
import { buildTasks as buildHarvesterTasks } from "./harvester.taskbuilder";
import { buildTasks as buildUpgraderTasks } from "./upgrader.taskbuilder";

export const BuildHarvesterTasks = buildHarvesterTasks;
export const BuildBuilderTasks = buildBuilderTasks;
export const BuildCarrierTasks = buildCarrierTasks;
export const BuildUpgraderTasks = buildUpgraderTasks;
