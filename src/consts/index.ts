import * as ROLES from "./roles.consts";
import * as TASKS from "./tasks.consts";
import * as ACTION_RETURN_CODES from "./action-return-codes.consts";

Object.assign(global, ROLES);
Object.assign(global, TASKS);
Object.assign(global, ACTION_RETURN_CODES);
