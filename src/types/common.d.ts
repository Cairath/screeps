interface HarvestableCreepAssignment {
  workParts: number;
}

interface ClusterInfo {
  name: string;
  baseRoom: string;
  sources: Map<Id<Source>, string>;
  minerals: Map<Id<Mineral>, string>;
}
