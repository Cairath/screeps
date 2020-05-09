export const getResourcesInStore = (store: StoreDefinition): Partial<Record<ResourceConstant, number>> => {
  const resourcesInStore: Partial<Record<ResourceConstant, number>> = {};

  RESOURCES_ALL.forEach((res: ResourceConstant) => {
    const amount = store.getUsedCapacity(res);
    if (amount && amount > 0) {
      resourcesInStore[res] = amount;
    }
  });

  return resourcesInStore;
};
