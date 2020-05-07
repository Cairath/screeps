interface HarvestableCreepAssignment {
  workParts: number;
}

interface StoreReservation {
  resource: ResourceConstant;
  amount: number;
}

// workaround for actions targetting Structure with not all structures having a store
interface StructureWithStore<TResource extends ResourceConstant = ResourceConstant, TUnlimited extends boolean = false>
  extends Structure {
  store: Store<TResource, TUnlimited>;
}
