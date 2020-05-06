interface HarvestableCreepAssignment {
  workParts: number;
}

interface StoreReservation {
  resource: ResourceConstant;
  amount: number;
}

interface ClusterInfo {
  name: string;
  baseRoom: string;
  sources: { [sourceId: string]: string };
  minerals: { [mineralId: string]: string };
}
