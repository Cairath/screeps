declare const ROLES: RoleConstant[];
declare const ROLE_BUILDER: ROLE_BUILDER;
declare const ROLE_HARVESTER: ROLE_HARVESTER;
declare const ROLE_CARRIER: ROLE_CARRIER;

type RoleConstant = ROLE_BUILDER | ROLE_HARVESTER | ROLE_CARRIER;

type ROLE_BUILDER = "builder";
type ROLE_HARVESTER = "harvester";
type ROLE_CARRIER = "carrier";
