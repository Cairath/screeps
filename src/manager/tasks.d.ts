declare const TASK_MOVE: TASK_MOVE;
declare const TASK_HARVEST: TASK_HARVEST;
declare const TASK_WITHDRAW: TASK_WITHDRAW;
declare const TASK_TRANSFER: TASK_TRANSFER;
declare const TASK_BUILD: TASK_BUILD;
declare const TASK_UPGRADE: TASK_UPGRADE;
declare const TASK_IDLE: TASK_IDLE;
declare const TASK_PARK: TASK_PARK;

type TASK_MOVE = "move";
type TASK_HARVEST = "harvest";
type TASK_WITHDRAW = "withdraw";
type TASK_TRANSFER = "transfer";
type TASK_BUILD = "build";
type TASK_REPAIR = "repair";
type TASK_UPGRADE = "upgrade";
type TASK_DROP_IN_PLACE = "drop-in-place";

type TASK_IDLE = "idle";
type TASK_PARK = "park";

type TaskConstant =
  | TASK_MOVE
  | TASK_HARVEST
  | TASK_WITHDRAW
  | TASK_TRANSFER
  | TASK_BUILD
  | TASK_REPAIR
  | TASK_UPGRADE
  | TASK_DROP_IN_PLACE
  | TASK_IDLE
  | TASK_PARK;

type CreepTask = HarvestTask | BuilderTask | TransferTask | DropInPlaceTask | IdleTask | ParkTask;

interface BaseTask<T extends TaskConstant> {
  type: T;
  repeatable?: boolean;
  next?: CreepTask;
  fallback?: CreepTask;
}

interface HarvestTask extends BaseTask<TASK_HARVEST> {
  objectId: Id<Source | Deposit | Mineral<MineralConstant>>;
}

interface BuilderTask extends BaseTask<TASK_BUILD> {
  objectId: string;
}

interface TransferTask extends BaseTask<TASK_TRANSFER> {
  objectId: string;
  structureType: StructureConstant;
  resource: ResourceConstant;
}

interface DropInPlaceTask extends BaseTask<TASK_DROP_IN_PLACE> {
  resource: ResourceConstant;
}

interface ParkTask extends BaseTask<TASK_PARK> {
  location: RoomPosition;
}

interface IdleTask extends BaseTask<TASK_IDLE> {}
