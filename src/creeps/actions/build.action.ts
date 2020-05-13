import _ from "lodash";

export const build = (creep: Creep, task: BuildTask): ActionReturnCode => {
  const constructionSite = Game.getObjectById(task.constructionSiteId);
  if (constructionSite === null) {
    return ACTION_ERR_MOVE_ON;
  }

  switch (creep.build(constructionSite)) {
    case ERR_NOT_IN_RANGE: {
      creep.moveTo(constructionSite, { visualizePathStyle: { stroke: "#ffaa00" } });
      break;
    }
    default: {
      return ACTION_ERR_MOVE_ON;
    }
  }

  return ACTION_IN_PROGRESS;
};
