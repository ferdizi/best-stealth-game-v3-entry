// visionCone.js — vision cones, line of sight and who can see the player.
// One job: decide exactly what each guard can see, and shape its cone.
function pointInCone(px, py, guard) {
  const dx = px - guard.x;
  const dy = py - guard.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > guard.coneRange) { return false; }
  if (dist < 4) { return true; }
  const angleTo = Math.atan2(dy, dx);
  let diff = angleTo - guard.angle;
  while (diff > Math.PI) { diff -= Math.PI * 2; }
  while (diff < -Math.PI) { diff += Math.PI * 2; }
  return Math.abs(diff) <= CONE_HALF_ANGLE;
}

function lineOfSightBlocked(x1, y1, x2, y2, cover, walls) {
  const blockers = cover.concat(walls);
  for (let i = 0; i < blockers.length; i++) {
    if (segmentIntersectsRect(x1, y1, x2, y2, blockers[i])) { return true; }
  }
  return false;
}

function segmentIntersectsRect(x1, y1, x2, y2, rect) {
  if (pointInRect(x1, y1, rect) || pointInRect(x2, y2, rect)) { return true; }
  const edges = [
    [rect.x, rect.y, rect.x + rect.w, rect.y],
    [rect.x + rect.w, rect.y, rect.x + rect.w, rect.y + rect.h],
    [rect.x + rect.w, rect.y + rect.h, rect.x, rect.y + rect.h],
    [rect.x, rect.y + rect.h, rect.x, rect.y]
  ];
  for (let i = 0; i < edges.length; i++) {
    if (segmentsIntersect(x1, y1, x2, y2, edges[i][0], edges[i][1], edges[i][2], edges[i][3])) { return true; }
  }
  return false;
}

function pointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function segmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  const d1 = direction(x3, y3, x4, y4, x1, y1);
  const d2 = direction(x3, y3, x4, y4, x2, y2);
  const d3 = direction(x1, y1, x2, y2, x3, y3);
  const d4 = direction(x1, y1, x2, y2, x4, y4);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
}

function direction(x1, y1, x2, y2, x3, y3) {
  return (x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1);
}

function playerSeenByGuard(player, guard, cover, walls) {
  if (!pointInCone(player.x, player.y, guard)) { return false; }
  if (lineOfSightBlocked(guard.x, guard.y, player.x, player.y, cover, walls)) { return false; }
  return true;
}

function coneTip(guard) {
  return { x: guard.x, y: guard.y };
}

function conePolygon(guard, cover, walls) {
  const points = [{ x: guard.x, y: guard.y }];
  const blockers = cover.concat(walls);
  for (let i = 0; i <= CONE_RAYS; i++) {
    const angle = guard.angle - CONE_HALF_ANGLE + (2 * CONE_HALF_ANGLE * i) / CONE_RAYS;
    const reach = rayReach(guard.x, guard.y, angle, guard.coneRange, blockers);
    points.push({ x: guard.x + Math.cos(angle) * reach, y: guard.y + Math.sin(angle) * reach });
  }
  return points;
}

function rayReach(x, y, angle, maxRange, blockers) {
  let best = maxRange;
  const ex = x + Math.cos(angle) * maxRange;
  const ey = y + Math.sin(angle) * maxRange;
  for (let i = 0; i < blockers.length; i++) {
    const hit = rayRectDistance(x, y, ex, ey, blockers[i]);
    if (hit !== null && hit < best) { best = hit; }
  }
  return best;
}

function rayRectDistance(x1, y1, x2, y2, rect) {
  const edges = [
    [rect.x, rect.y, rect.x + rect.w, rect.y],
    [rect.x + rect.w, rect.y, rect.x + rect.w, rect.y + rect.h],
    [rect.x + rect.w, rect.y + rect.h, rect.x, rect.y + rect.h],
    [rect.x, rect.y + rect.h, rect.x, rect.y]
  ];
  let best = null;
  for (let i = 0; i < edges.length; i++) {
    const t = raySegmentHit(x1, y1, x2, y2, edges[i][0], edges[i][1], edges[i][2], edges[i][3]);
    if (t !== null && (best === null || t < best)) { best = t; }
  }
  return best;
}

function raySegmentHit(x1, y1, x2, y2, x3, y3, x4, y4) {
  const rdx = x2 - x1;
  const rdy = y2 - y1;
  const sdx = x4 - x3;
  const sdy = y4 - y3;
  const denom = rdx * sdy - rdy * sdx;
  if (Math.abs(denom) < 0.000001) { return null; }
  const t = ((x3 - x1) * sdy - (y3 - y1) * sdx) / denom;
  const u = ((x3 - x1) * rdy - (y3 - y1) * rdx) / denom;
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return t * Math.sqrt(rdx * rdx + rdy * rdy);
  }
  return null;
}
