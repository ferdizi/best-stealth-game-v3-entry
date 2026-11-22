// coverSystem.js — statues, shelves and curtains that block sight.
// One job: decide when the player is hidden and when a cone is cut short.
function playerInCover(player, cover) {
  for (let i = 0; i < cover.length; i++) {
    if (pointInRect(player.x, player.y, cover[i])) { return cover[i]; }
  }
  return null;
}

function coverHidesPlayer(player, cover) {
  return playerInCover(player, cover) !== null;
}

function coverBlocksSight(x1, y1, x2, y2, cover) {
  for (let i = 0; i < cover.length; i++) {
    if (segmentIntersectsRect(x1, y1, x2, y2, cover[i])) { return true; }
  }
  return false;
}

function coverLabel(coverPiece) {
  return coverPiece.label || 'COVER';
}

function coverKindName(kind) {
  if (kind === 'statue') { return 'Statue'; }
  if (kind === 'shelf') { return 'Shelf'; }
  if (kind === 'curtain') { return 'Curtain'; }
  return 'Cover';
}

function coverColor(kind) {
  if (kind === 'statue') { return COLORS.coverStatue; }
  if (kind === 'shelf') { return COLORS.coverShelf; }
  if (kind === 'curtain') { return COLORS.coverCurtain; }
  return COLORS.coverShelf;
}

function coverCount(cover) {
  return cover.length;
}

function nearestCoverDistance(player, cover) {  let best = Infinity;
  for (let i = 0; i < cover.length; i++) {
    const cx = Math.max(cover[i].x, Math.min(player.x, cover[i].x + cover[i].w));
    const cy = Math.max(cover[i].y, Math.min(player.y, cover[i].y + cover[i].h));
    const dx = player.x - cx;
    const dy = player.y - cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < best) { best = d; }
  }
  return best;
}
