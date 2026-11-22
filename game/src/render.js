// render.js — every pixel of the museum floor, guards, cones and cover.
// One job: draw the current game state onto the canvas, legibly at a glance.
function renderGame(ctx, game) {
  ctx.fillStyle = COLORS.floor;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawFloor(ctx, game);
  drawSafeZones(ctx, game);
  drawPatrolRoutes(ctx, game);
  drawCover(ctx, game);
  drawWalls(ctx, game);
  drawRelics(ctx, game);
  drawExitGate(ctx, game);
  drawVisionCones(ctx, game);
  drawGuards(ctx, game);
  drawFootstepRipples(ctx, game);
  drawPlayer(ctx, game);
  if (game.banner) { drawBanner(ctx, game.banner); }
}

function drawFloor(ctx, game) {
  const tile = 64;
  for (let y = PLAY_TOP; y < PLAY_BOTTOM; y += tile) {
    for (let x = 0; x < CANVAS_WIDTH; x += tile) {
      const odd = ((x / tile) + (y / tile)) % 2 === 0;
      ctx.fillStyle = odd ? COLORS.floor : COLORS.floorTile;
      ctx.fillRect(x, y, tile, tile);
    }
  }
  ctx.strokeStyle = 'rgba(245, 230, 184, 0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= CANVAS_WIDTH; x += tile) {
    ctx.beginPath(); ctx.moveTo(x, PLAY_TOP); ctx.lineTo(x, PLAY_BOTTOM); ctx.stroke();
  }
  for (let y = PLAY_TOP; y <= PLAY_BOTTOM; y += tile) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y); ctx.stroke();
  }
  const cx = CANVAS_WIDTH / 2;
  const cy = (PLAY_TOP + PLAY_BOTTOM) / 2;
  const glow = ctx.createRadialGradient(cx, cy, 60, cx, cy, 620);
  glow.addColorStop(0, 'rgba(245, 185, 66, 0.07)');
  glow.addColorStop(1, 'rgba(245, 185, 66, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, PLAY_TOP, CANVAS_WIDTH, PLAY_BOTTOM - PLAY_TOP);
}

function drawSafeZones(ctx, game) {
  ctx.fillStyle = COLORS.safeZone;
  for (let i = 0; i < game.wing.cover.length; i++) {
    const c = game.wing.cover[i];
    ctx.fillRect(c.x - 10, c.y - 10, c.w + 20, c.h + 20);
  }
}

function drawWalls(ctx, game) {
  ctx.fillStyle = COLORS.wall;
  ctx.fillRect(0, PLAY_TOP, CANVAS_WIDTH, 8);
  ctx.fillRect(0, PLAY_BOTTOM - 8, CANVAS_WIDTH, 8);
  ctx.fillRect(0, PLAY_TOP, 8, PLAY_BOTTOM - PLAY_TOP);
  ctx.fillRect(CANVAS_WIDTH - 8, PLAY_TOP, 8, PLAY_BOTTOM - PLAY_TOP);
  for (let i = 0; i < game.wing.walls.length; i++) {
    const w = game.wing.walls[i];
    ctx.fillStyle = COLORS.wall;
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeStyle = COLORS.wallEdge;
    ctx.lineWidth = 3;
    ctx.strokeRect(w.x, w.y, w.w, w.h);
  }
}

function drawCover(ctx, game) {
  for (let i = 0; i < game.wing.cover.length; i++) {
    const c = game.wing.cover[i];
    ctx.fillStyle = coverColor(c.kind);
    ctx.fillRect(c.x, c.y, c.w, c.h);
    ctx.strokeStyle = '#e8dcc0';
    ctx.lineWidth = 2;
    ctx.strokeRect(c.x, c.y, c.w, c.h);
    if (c.kind === 'statue') {
      ctx.beginPath();
      ctx.arc(c.x + c.w / 2, c.y + c.h / 2, Math.min(c.w, c.h) / 3, 0, Math.PI * 2);
      ctx.fillStyle = '#b5aa97';
      ctx.fill();
    }
    if (c.kind === 'shelf') {
      ctx.strokeStyle = '#c9a86a';
      ctx.beginPath();
      ctx.moveTo(c.x + 6, c.y + c.h / 2);
      ctx.lineTo(c.x + c.w - 6, c.y + c.h / 2);
      ctx.stroke();
    }
    if (c.kind === 'curtain') {
      ctx.strokeStyle = '#c94b5a';
      ctx.lineWidth = 3;
      for (let f = 0; f < 4; f++) {
        ctx.beginPath();
        ctx.moveTo(c.x + 10 + f * (c.w - 20) / 3, c.y + 6);
        ctx.lineTo(c.x + 10 + f * (c.w - 20) / 3, c.y + c.h - 6);
        ctx.stroke();
      }
    }
    ctx.fillStyle = COLORS.coverLabel;
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(c.label, c.x + c.w / 2, c.y + c.h + 16);
  }
}

function drawPatrolRoutes(ctx, game) {
  ctx.strokeStyle = COLORS.patrolRoute;
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 8]);
  for (let i = 0; i < game.guards.length; i++) {
    const g = game.guards[i];
    ctx.beginPath();
    for (let j = 0; j < g.waypoints.length; j++) {
      const p = g.waypoints[j];
      if (j === 0) { ctx.moveTo(p[0], p[1]); } else { ctx.lineTo(p[0], p[1]); }
    }
    ctx.closePath();
    ctx.stroke();
    for (let j = 0; j < g.waypoints.length; j++) {
      ctx.beginPath();
      ctx.arc(g.waypoints[j][0], g.waypoints[j][1], 4, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.patrolRoute;
      ctx.fill();
    }
  }
  ctx.setLineDash([]);
  ctx.fillStyle = COLORS.patrolRoute;
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('— — dotted line = patrol route', 24, PLAY_TOP + 22);
}

function drawVisionCones(ctx, game) {
  for (let i = 0; i < game.guards.length; i++) {
    drawVisionCone(ctx, game.guards[i], game.wing.cover, game.wing.walls);
  }
}

function drawVisionCone(ctx, guard, cover, walls) {
  const poly = conePolygon(guard, cover, walls);
  const color = guardStateColor(guard);
  ctx.beginPath();
  ctx.moveTo(poly[0].x, poly[0].y);
  for (let i = 1; i < poly.length; i++) { ctx.lineTo(poly[i].x, poly[i].y); }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.30;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawGuards(ctx, game) {
  for (let i = 0; i < game.guards.length; i++) {
    drawGuard(ctx, game.guards[i]);
  }
}

function drawGuard(ctx, guard) {
  const color = guardStateColor(guard);
  ctx.beginPath();
  ctx.arc(guard.x, guard.y, GUARD_RADIUS + 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(guard.x, guard.y, GUARD_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = '#3a2a12';
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(guard.x, guard.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(guard.x, guard.y);
  ctx.lineTo(guard.x + Math.cos(guard.angle) * (GUARD_RADIUS + 8), guard.y + Math.sin(guard.angle) * (GUARD_RADIUS + 8));
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = COLORS.textBright;
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(guard.label, guard.x, guard.y - GUARD_RADIUS - 10);
  const state = guardStateName(guard);
  if (state !== 'PATROL') {
    ctx.fillStyle = color;
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(state + '!', guard.x, guard.y + GUARD_RADIUS + 18);
  }
}

function drawRelics(ctx, game) {
  for (let i = 0; i < game.wing.relics.length; i++) {
    const r = game.wing.relics[i];
    if (r.taken) { continue; }
    const pulse = 0.6 + 0.4 * Math.sin(game.time / 240 + i);
    ctx.beginPath();
    ctx.arc(r.x, r.y, 16 + 3 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 217, 77, 0.25)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r.x, r.y, 9, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.relic;
    ctx.fill();
    ctx.strokeStyle = COLORS.relicGlow;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#3a2a12';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('◆', r.x, r.y + 4);
    ctx.fillStyle = COLORS.textBright;
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('RELIC', r.x, r.y - 20);
  }
}

function drawExitGate(ctx, game) {
  const gate = game.gate;
  const glow = exitGateGlowPhase(game.time);
  ctx.save();
  ctx.globalAlpha = gate.open ? 0.55 + 0.4 * glow : 0.25;
  ctx.fillStyle = gate.open ? COLORS.exitGreen : '#2a5a3a';
  ctx.fillRect(gate.x - 6, gate.y - 6, gate.w + 12, gate.h + 12);
  ctx.restore();
  ctx.strokeStyle = gate.open ? COLORS.exitGreen : '#4a7a5a';
  ctx.lineWidth = 4;
  ctx.strokeRect(gate.x, gate.y, gate.w, gate.h);
  ctx.fillStyle = gate.open ? COLORS.exitGlow : COLORS.textDim;
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(gate.open ? 'EXIT ✓' : 'EXIT', gate.x + gate.w / 2, gate.y + gate.h / 2 + 7);
  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = COLORS.textBright;
  ctx.fillText(gate.open ? 'OPEN — GO!' : 'LOCKED', gate.x + gate.w / 2, gate.y + gate.h + 18);
}

function drawFootstepRipples(ctx, game) {
  for (let i = 0; i < game.audio.ripples.length; i++) {
    const r = game.audio.ripples[i];
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
    ctx.strokeStyle = COLORS.ripple;
    ctx.globalAlpha = Math.max(0, r.alpha);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

function drawPlayer(ctx, game) {
  const p = game.player;
  const hidden = coverHidesPlayer(p, game.wing.cover);
  ctx.beginPath();
  ctx.arc(p.x, p.y, PLAYER_RADIUS + 6, 0, Math.PI * 2);
  ctx.fillStyle = hidden ? 'rgba(61, 255, 122, 0.35)' : 'rgba(255, 233, 168, 0.25)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(p.x, p.y, PLAYER_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.player;
  ctx.fill();
  ctx.strokeStyle = COLORS.playerRing;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#3a2a12';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('YOU', p.x, p.y + 4);
  ctx.fillStyle = hidden ? COLORS.exitGreen : COLORS.textBright;
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText(hidden ? 'HIDDEN ✓' : 'YOU — THIEF', p.x, p.y - PLAYER_RADIUS - 12);
  if (game.meter.value > 0.02) {
    const w = 46;
    ctx.fillStyle = '#000000';
    ctx.fillRect(p.x - w / 2, p.y + PLAYER_RADIUS + 8, w, 7);
    ctx.fillStyle = detectionMeterColor(game.meter);
    ctx.fillRect(p.x - w / 2, p.y + PLAYER_RADIUS + 8, w * detectionMeterFraction(game.meter), 7);
  }
}

function drawBanner(ctx, banner) {
  const bw = 720;
  const bh = 92;
  const bx = (CANVAS_WIDTH - bw) / 2;
  const by = (CANVAS_HEIGHT - bh) / 2 - 40;
  ctx.fillStyle = 'rgba(10, 6, 2, 0.88)';
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = COLORS.hudLine;
  ctx.lineWidth = 3;
  ctx.strokeRect(bx, by, bw, bh);
  ctx.fillStyle = banner.color || COLORS.textBright;
  ctx.font = 'bold 34px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(banner.title, CANVAS_WIDTH / 2, by + 42);
  ctx.fillStyle = COLORS.textBright;
  ctx.font = 'bold 17px sans-serif';
  ctx.fillText(banner.subtitle, CANVAS_WIDTH / 2, by + 72);
}

function bannerHeight() {
  return 92;
}
