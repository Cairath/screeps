export const park = (creep: Creep, task: ParkTask): ActionReturnCode => {
  // RoomPosition needs re-initialization due to not surviving deserialization
  // todo: helper function for this
  const location = new RoomPosition(task.location.x, task.location.y, task.location.roomName);

  if (creep.pos.getRangeTo(location) > 1) {
    creep.say("🎉 chill!");
    creep.moveTo(location, { visualizePathStyle: { stroke: "#ffffff" } });
    return ACTION_IN_PROGRESS;
  }

  return ACTION_DONE;
};
