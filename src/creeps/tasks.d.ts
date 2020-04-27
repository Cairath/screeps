declare const TASK_MOVE: TASK_MOVE;
declare const TASK_HARVEST: TASK_HARVEST;
declare const TASK_WITHDRAW: TASK_WITHDRAW;
declare const TASK_TRANSFER: TASK_TRANSFER;
declare const TASK_BUILD: TASK_BUILD;
declare const TASK_IDLE: TASK_IDLE;
declare const TASK_UPGRADE: TASK_UPGRADE;

type TASK_MOVE = "move";
type TASK_HARVEST = "harvest";
type TASK_WITHDRAW = "withdraw";
type TASK_TRANSFER = "transfer";
type TASK_BUILD = "build";
type TASK_REPAIR = "repair";
type TASK_UPGRADE = "upgrade";

type TASK_IDLE = "idle";

type TaskConstant = HarvesterTaskConstant | BuilderTaskConstant;
type CommonTaskConstant = TASK_MOVE | TASK_WITHDRAW | TASK_IDLE;
type HarvesterTaskConstant = CommonTaskConstant | TASK_HARVEST | TASK_TRANSFER;
type BuilderTaskConstant = CommonTaskConstant | TASK_BUILD;
type UpgraderTaskConstant = CommonTaskConstant | TASK_UPGRADE;
