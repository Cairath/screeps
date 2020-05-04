interface HarvestableCreepAssignment {
  workParts: number;
}

interface ClusterInfo {
  name: string;
  baseRoom: string;
  sources: { [sourceId: string]: string };
  minerals: { [mineralId: string]: string };
}
