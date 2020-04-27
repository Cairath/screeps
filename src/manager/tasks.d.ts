declare const TASK_MOVE: TASK_MOVE;
declare const TASK_HARVEST: TASK_HARVEST;
declare const TASK_WITHDRAW: TASK_WITHDRAW;
declare const TASK_TRANSFER: TASK_TRANSFER;
declare const TASK_BUILD: TASK_BUILD;
declare const TASK_IDLE: TASK_IDLE;
declare const TASK_UPGRADE: TASK_UPGRADE;
declare const TASK_NONE: TASK_NONE;

type TASK_MOVE = "move";
type TASK_HARVEST = "harvest";
type TASK_WITHDRAW = "withdraw";
type TASK_TRANSFER = "transfer";
type TASK_BUILD = "build";
type TASK_REPAIR = "repair";
type TASK_UPGRADE = "upgrade";

type TASK_IDLE = TASK_NONE | TASK_PARK;
type TASK_NONE = "none";
type TASK_PARK = "park";

type TaskConstant = HarvesterTaskConstant | BuilderTaskConstant;
type CommonTaskConstant = TASK_IDLE | TASK_MOVE | TASK_WITHDRAW;
type HarvesterTaskConstant = CommonTaskConstant | TASK_HARVEST | TASK_TRANSFER;
type BuilderTaskConstant = CommonTaskConstant | TASK_BUILD;
type UpgraderTaskConstant = CommonTaskConstant | TASK_UPGRADE;

type CreepTask = HarvestTask | BuilderTask | ParkTask | IdleTask;

interface BaseTask<T extends TaskConstant> {
  type: T;
  next?: CreepTask;
}

interface HarvestTask extends BaseTask<TASK_HARVEST> {
  objectId: Id<Source | Deposit | Mineral<MineralConstant>>;
}

interface BuilderTask extends BaseTask<TASK_BUILD> {
  objectId: string;
}

interface ParkTask extends BaseTask<TASK_PARK> {
  location: RoomPosition;
}

interface IdleTask extends BaseTask<TASK_IDLE> {}
