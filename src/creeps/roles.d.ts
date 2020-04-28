declare const ROLE_BUILDER: ROLE_BUILDER;
declare const ROLE_HARVESTER: ROLE_HARVESTER;
declare const ROLE_CARRIER: ROLE_CARRIER;
declare const ROLE_UPGRADER: ROLE_UPGRADER;

type RoleConstant = ROLE_BUILDER | ROLE_HARVESTER | ROLE_CARRIER | ROLE_UPGRADER;

type ROLE_BUILDER = "builder";
type ROLE_HARVESTER = "harvester";
type ROLE_CARRIER = "carrier";
type ROLE_UPGRADER = "upgrader";
