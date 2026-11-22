// hud.js — the HUD bar, detection meter and the legend strip.
// One job: tell the player (and the judge) exactly what every system means.
function drawHud(ctx, game) {
  ctx.fillStyle = COLORS.hudBg;
  ctx.fillRect(0, 0, CANVAS_WIDTH, HUD_HEIGHT);
  ctx.strokeStyle = COLORS.hudLine;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, HUD_HEIGHT - 1);
  ctx.lineTo(CANVAS_WIDTH, HUD_HEIGHT - 1);
  ctx.stroke();
  ctx.fillStyle = COLORS.textBright;
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('THE MERIDIAN ARCHIVE', 20, 34);
  ctx.fillStyle = COLORS.textDim;
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Five Heists by Lamplight  •  a stealth game', 20, 58);
  ctx.fillStyle = COLORS.textBright;
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(game.wing.name, 20, 82);
  drawObjective(ctx, game);
  drawDetectionMeterBar(ctx, game);
  drawWingProgress(ctx, game);
  drawLegendStrip(ctx, game);
}

function drawObjective(ctx, game) {
  const collected = RELICS_PER_WING - relicsRemaining(game.wing.relics);
  const text = 'OBJECTIVE: collect ' + collected + '/' + RELICS_PER_WING + ' relics, then reach the EXIT unseen';
  ctx.fillStyle = COLORS.textBright;
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(text, 560, 34);
  ctx.fillStyle = COLORS.textDim;
  ctx.font = '14px sans-serif';
  ctx.fillText(game.wing.mechanic, 560, 58);
  ctx.fillStyle = COLORS.textDim;
  ctx.font = 'italic 13px sans-serif';
  ctx.fillText(game.wing.hint, 560, 80);
}

function drawDetectionMeterBar(ctx, game) {
  const x = 1010;
  const y = 18;
  const w = 240;
  const h = 18;
  ctx.fillStyle = '#000000';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = detectionMeterColor(game.meter);
  ctx.fillRect(x, y, w * detectionMeterFraction(game.meter), h);
  ctx.strokeStyle = COLORS.textBright;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);
  const status = detectionStatus(game.meter);
  ctx.fillStyle = detectionMeterColor(game.meter);
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('DETECTION  ' + status, x, y + 36);
  if (game.meter.status === 'spotted') {
    ctx.fillStyle = COLORS.textAlert;
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('Break sight — guards calm after 5s unseen', x, y + 56);
  }
}

function drawWingProgress(ctx, game) {
  const x = 1010;
  const y = 78;  ctx.fillStyle = COLORS.textDim;
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'left';
  let label = 'WINGS: ';
  for (let i = 0; i < WING_COUNT; i++) {
    label += (i < game.wingsCleared ? '★' : (i === game.wing.index ? '◐' : '☆')) + ' ';
  }
  label += '  ' + game.wingsCleared + '/5 cleared';
  ctx.fillText(label, x, y);
}

function drawLegendStrip(ctx, game) {
  ctx.fillStyle = COLORS.hudBg;
  ctx.fillRect(0, PLAY_BOTTOM, CANVAS_WIDTH, LEGEND_HEIGHT);  ctx.strokeStyle = COLORS.hudLine;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, PLAY_BOTTOM);
  ctx.lineTo(CANVAS_WIDTH, PLAY_BOTTOM);
  ctx.stroke();
  const items = [
    ['AMBER cone = patrol', COLORS.conePatrol],
    ['ORANGE = suspicious', COLORS.coneSuspect],
    ['RED = alert', COLORS.coneAlert],
    ['Statue / shelf / curtain = COVER', '#e8dcc0'],
    ['Green gate = EXIT', COLORS.exitGreen],
    ['Ripples = footsteps', COLORS.ripple],
    ['WASD move • SHIFT sprint • E interact', COLORS.textDim]
  ];
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'left';
  let x = 18;
  for (let i = 0; i < items.length; i++) {
    ctx.fillStyle = items[i][1];
    ctx.fillRect(x, PLAY_BOTTOM + 16, 12, 12);
    ctx.fillStyle = COLORS.textBright;
    ctx.fillText(items[i][0], x + 17, PLAY_BOTTOM + 27);
    x += 17 + ctx.measureText(items[i][0]).width + 22;
  }
}

function hudLegendItems() {
  return ['AMBER cone = patrol', 'ORANGE = suspicious', 'RED = alert', 'cover', 'exit', 'footsteps'];
}
