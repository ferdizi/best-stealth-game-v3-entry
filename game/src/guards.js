// guards.js — the three guard kinds and how they move and hunt.
// One job: patrol routes, sentry rotation, investigation and calming.
function createGuard(def) {
  const type = GUARD_TYPES[def.type];
  const start = def.waypoints[def.start || 0];
  return {
    type: def.type,
    label: type.label,
    x: start[0],
    y: start[1],
    angle: def.angle !== undefined ? def.angle : 0,
    speed: type.speed,
    coneRange: type.cone,
    waypoints: def.waypoints,
    waypointIndex: (def.start || 0) + 1 >= def.waypoints.length ? 0 : (def.start || 0) + 1,
    state: 'patrol',
    investigateX: 0,
    investigateY: 0,
    unseenFrames: 0,
    alertFlash: 0
  };
}

function updateGuard(guard, player, cover, walls) {
  if (guard.state === 'alert') {
    guard.alertFlash = (guard.alertFlash + 1) % 40;
  }
  if (guard.type === 'sentry') {
    guard.angle += GUARD_SENTRY_ROTATE_SPEED;
    if (guard.state === 'investigate') {
      moveGuardToward(guard, guard.investigateX, guard.investigateY, GUARD_INVESTIGATE_SPEED);
      if (guardDistanceTo(guard, guard.investigateX, guard.investigateY) < 12) {
        guard.state = 'patrol';
      }
    }
    return;
  }
  if (guard.state === 'investigate') {
    moveGuardToward(guard, guard.investigateX, guard.investigateY, GUARD_INVESTIGATE_SPEED);
    if (guardDistanceTo(guard, guard.investigateX, guard.investigateY) < 12) {
      guard.state = 'patrol';
    }
    return;
  }
  moveGuardAlongPatrol(guard);
}

function moveGuardAlongPatrol(guard) {
  const target = guard.waypoints[guard.waypointIndex];
  moveGuardToward(guard, target[0], target[1], guard.speed);
  if (guardDistanceTo(guard, target[0], target[1]) < 6) {
    guard.waypointIndex = (guard.waypointIndex + 1) % guard.waypoints.length;
  }
}

function moveGuardToward(guard, tx, ty, speed) {
  const dx = tx - guard.x;
  const dy = ty - guard.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 0.001) { return; }
  guard.x += (dx / dist) * speed;
  guard.y += (dy / dist) * speed;
  guard.angle = Math.atan2(dy, dx);
}

function guardDistanceTo(guard, x, y) {
  const dx = x - guard.x;
  const dy = y - guard.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function guardInvestigate(guard, x, y) {
  guard.state = 'investigate';
  guard.investigateX = x;
  guard.investigateY = y;
  guard.unseenFrames = 0;
}

function guardCalmDown(guard) {
  guard.state = 'patrol';
  guard.unseenFrames = 0;
}

function guardStateColor(guard) {
  if (guard.state === 'alert') { return COLORS.coneAlert; }
  if (guard.state === 'investigate') { return COLORS.coneSuspect; }
  return COLORS.conePatrol;
}

function guardStateName(guard) {
  if (guard.state === 'alert') { return 'ALERT'; }
  if (guard.state === 'investigate') { return 'SUSPICIOUS'; }
  return 'PATROL';
}

function guardWaypointCount(guard) {
  return guard.waypoints.length;
}
