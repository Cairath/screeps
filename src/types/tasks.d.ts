declare const TASK_MOVE: TASK_MOVE;
declare const TASK_HARVEST: TASK_HARVEST;
declare const TASK_WITHDRAW: TASK_WITHDRAW;
declare const TASK_TRANSFER: TASK_TRANSFER;
declare const TASK_PICKUP: TASK_PICKUP;
declare const TASK_BUILD: TASK_BUILD;
declare const TASK_UPGRADE: TASK_UPGRADE;
declare const TASK_DROP_IN_PLACE: TASK_DROP_IN_PLACE;
declare const TASK_IDLE: TASK_IDLE;
declare const TASK_PARK: TASK_PARK;
declare const TASK_RECYCLE: TASK_RECYCLE;
declare const TASK_RENEW: TASK_RENEW;

declare const PRIORITY_HIGH: PRIORITY_HIGH;
declare const PRIORITY_NORMAL: PRIORITY_NORMAL;
declare const PRIORITY_LOW: PRIORITY_LOW;

declare const STORAGE_MODE_FILL: STORAGE_MODE_FILL;
declare const STORAGE_MODE_EMPTY: STORAGE_MODE_EMPTY;
declare const STORAGE_MODE_NORMAL: STORAGE_MODE_NORMAL;

type TASK_MOVE = "move";
type TASK_HARVEST = "harvest";
type TASK_WITHDRAW = "withdraw";
type TASK_TRANSFER = "transfer";
type TASK_PICKUP = "pickup";
type TASK_BUILD = "build";
type TASK_REPAIR = "repair";
type TASK_UPGRADE = "upgrade";
type TASK_DROP_IN_PLACE = "drop-in-place";

type TASK_IDLE = "idle";
type TASK_PARK = "park";

type TASK_RECYCLE = "recycle";
type TASK_RENEW = "renew";

type TaskConstant =
  | TASK_MOVE
  | TASK_HARVEST
  | TASK_WITHDRAW
  | TASK_TRANSFER
  | TASK_PICKUP
  | TASK_BUILD
  | TASK_REPAIR
  | TASK_UPGRADE
  | TASK_DROP_IN_PLACE
  | TASK_IDLE
  | TASK_PARK
  | TASK_RECYCLE
  | TASK_RENEW;

type CreepTask =
  | HarvestTask
  | BuildTask
  | TransferTask
  | WithdrawTask
  | PickupTask
  | DropInPlaceTask
  | IdleTask
  | ParkTask
  | RecycleTask
  | RenewTask;

type Job = HarvestJob | BuildJob | WithdrawJob | PickupJob | TransferJob;
type CarrierJob = WithdrawJob | TransferJob | PickupJob;

type JobPriorityConstant = PRIORITY_HIGH | PRIORITY_NORMAL | PRIORITY_LOW;
type PRIORITY_HIGH = 2;
type PRIORITY_NORMAL = 1;
type PRIORITY_LOW = 0;

type StorageModeConstant = STORAGE_MODE_EMPTY | STORAGE_MODE_FILL | STORAGE_MODE_NORMAL;
type STORAGE_MODE_FILL = "fill";
type STORAGE_MODE_EMPTY = "empty";
type STORAGE_MODE_NORMAL = "normal";

interface BaseTask<T extends TaskConstant> {
  type: T;
  repeatable?: boolean;
  next?: CreepTask;
  fallback?: CreepTask;
}

interface BaseJob<T extends TaskConstant> {
  type: T;
  priority: JobPriorityConstant;
  repeatable?: boolean;
  nextTask?: CreepTask;
  fallbackTask?: CreepTask;
}

interface HarvestTask extends BaseTask<TASK_HARVEST> {
  objectId: Id<Source | Deposit | Mineral>;
}

interface HarvestJob extends BaseJob<TASK_HARVEST> {
  objectId: Id<Source | Deposit | Mineral>;
  spotsAvailable: number;
  workPartsNeeded: number;
}

interface BuildTask extends BaseTask<TASK_BUILD> {
  objectId: Id<ConstructionSite>;
}

interface BuildJob extends BaseJob<TASK_BUILD> {
  objectId: Id<ConstructionSite>;
}

interface TransferTask extends BaseTask<TASK_TRANSFER> {
  targetId: Id<Creep | PowerCreep | StructureWithStoreDefinition>;
  resource: ResourceConstant;
  amount?: number;
}

interface TransferJob extends BaseJob<TASK_TRANSFER> {
  targetId: Id<Creep | PowerCreep | StructureWithStoreDefinition>;
  resource: ResourceConstant;
  amount: number;
}

interface WithdrawTask extends BaseTask<TASK_WITHDRAW> {
  targetId: Id<Tombstone | Ruin | StructureWithStoreDefinition>;
  resource: ResourceConstant;
  amount?: number;
}

interface WithdrawJob extends BaseJob<TASK_WITHDRAW> {
  objectId: Id<Tombstone | Ruin | StructureWithStoreDefinition>;
  resource: ResourceConstant;
  amount: number;
}

interface PickupTask extends BaseTask<TASK_PICKUP> {
  targetId: Id<Resource>;
  resource: ResourceConstant;
}

interface PickupJob extends BaseJob<TASK_PICKUP> {
  objectId: Id<Resource>;
  resource: ResourceConstant;
  amount: number;
}

interface DropInPlaceTask extends BaseTask<TASK_DROP_IN_PLACE> {
  resource: ResourceConstant;
}

interface ParkTask extends BaseTask<TASK_PARK> {
  location: RoomPosition;
}

interface IdleTask extends BaseTask<TASK_IDLE> {}

interface RecycleTask extends BaseTask<TASK_RECYCLE> {
  spawnId: Id<StructureSpawn>;
  // todo: possibly have a container at a spawn to die into
}

interface RenewTask extends BaseTask<TASK_RENEW> {
  spawnId: Id<StructureSpawn>;
}
