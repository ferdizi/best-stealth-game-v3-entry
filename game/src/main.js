// main.js — game state, the loop, deterministic shot states and the selftest.
// One job: own the game object and drive it from load to win screen.
function buildGameState(shot) {
  const wingIndex = shot === 'victory' ? 4 : 0;
  const wing = buildWing(wingIndex);
  const guards = [];
  for (let i = 0; i < wing.guards.length; i++) {
    guards.push(createGuard(wing.guards[i]));
  }
  return {
    wing: wing,
    guards: guards,
    player: { x: wing.playerStart.x, y: wing.playerStart.y },
    meter: createDetectionMeter(),
    gate: createExitGate(wing.exit),
    audio: createFootstepAudio(),
    input: createInputState(),
    time: SHOT_FIXED_TIME,
    frame: 0,
    wingsCleared: 0,
    relicsCollected: 0,
    banner: null,
    caption: null,
    shot: shot || 'play',
    won: false,
    stepCounter: 0
  };
}

function applyShotState(game, shot) {
  if (shot === 'cover') {
    game.guards[0].x = 660; game.guards[0].y = 280; game.guards[0].angle = 0.3;
    game.guards[1].x = 920; game.guards[1].y = 560; game.guards[1].angle = 2.4;
    game.player.x = 150; game.player.y = 660;
    game.caption = 'WING 1 — every system on screen: patrol routes, vision cones, cover, relics, exit';
    spawnFootstepRipple(game.audio, 105, 690);
    spawnFootstepRipple(game.audio, 125, 682);
    return;
  }
  if (shot === 'patrol') {
    game.guards[0].x = 500; game.guards[0].y = 180; game.guards[0].angle = 0.49;
    game.guards[1].x = 820; game.guards[1].y = 640; game.guards[1].angle = 1.9;
    game.player.x = 690; game.player.y = 280;
    game.meter.value = 0.18; game.meter.status = 'hidden';
    spawnFootstepRipple(game.audio, 650, 262);
    spawnFootstepRipple(game.audio, 670, 270);
    spawnFootstepRipple(game.audio, 680, 274);
    game.caption = 'TIMING THE GAP — the amber cone passes inches away. Wait, then move.';
    return;
  }
  if (shot === 'nearmiss') {
    game.guards[0].x = 430; game.guards[0].y = 375; game.guards[0].angle = Math.PI;
    game.guards[0].state = 'investigate';
    game.guards[0].investigateX = 320; game.guards[0].investigateY = 375;
    game.guards[1].x = 900; game.guards[1].y = 560; game.guards[1].angle = 2.8;
    game.player.x = 275; game.player.y = 375;
    game.meter.value = 0.82; game.meter.status = 'suspicious';
    game.caption = 'NEAR MISS — spotted, broke sight behind the statue. Guards calm after 5s unseen.';
    return;
  }
  if (shot === 'victory') {
    for (let i = 0; i < game.wing.relics.length; i++) { game.wing.relics[i].taken = true; }
    game.relicsCollected = RELICS_PER_WING;
    game.wingsCleared = 5;
    exitGateOpen(game.gate, RELICS_PER_WING, RELICS_PER_WING);
    game.guards[3].x = 430; game.guards[3].y = 520; game.guards[3].angle = 0.6;
    game.player.x = 715; game.player.y = 162;
    spawnFootstepRipple(game.audio, 695, 162);
    game.meter.value = 0; game.meter.status = 'hidden';
    game.banner = {
      title: 'HEIST COMPLETE',
      subtitle: 'STEALTH RATING: GHOST — 100%  •  5/5 wings cleared unseen',
      color: COLORS.exitGreen
    };
    game.caption = 'All five wings. Every relic. Never caught.';
    return;
  }
}

function updateGame(game) {
  game.frame += 1;
  game.time += 16;
  game.audio.frame = game.frame;
  const move = inputMoveVector(game.input);
  const speed = PLAYER_SPEED * (move.sprint ? PLAYER_SPRINT_MULT : 1);
  if (move.x !== 0 || move.y !== 0) {
    game.player.x += move.x * speed;
    game.player.y += move.y * speed;
    game.player.x = Math.max(20, Math.min(CANVAS_WIDTH - 20, game.player.x));
    game.player.y = Math.max(PLAY_TOP + 20, Math.min(PLAY_BOTTOM - 20, game.player.y));
    blockPlayerByWalls(game);
    game.stepCounter += 1;
    if (game.stepCounter % FOOTSTEP_INTERVAL_FRAMES === 0) {
      spawnFootstepRipple(game.audio, game.player.x, game.player.y);
      footstepBlip(game.audio, 'player');
    }
  }
  updateFootstepRipples(game.audio);
  let seen = false;
  let seenBy = null;
  for (let i = 0; i < game.guards.length; i++) {
    updateGuard(game.guards[i], game.player, game.wing.cover, game.wing.walls);
    if (playerSeenByGuard(game.player, game.guards[i], game.wing.cover, game.wing.walls)) {
      seen = true;
      seenBy = game.guards[i];
    }
    const d = guardDistanceTo(game.guards[i], game.player.x, game.player.y);
    guardProximityBlip(game.audio, d);
  }
  const hidden = coverHidesPlayer(game.player, game.wing.cover);
  const status = updateDetectionMeter(game.meter, seen, hidden);
  if (status === 'spotted' && seenBy) {
    seenBy.state = 'alert';
    guardInvestigate(seenBy, game.player.x, game.player.y);
    seenBy.state = 'alert';
  } else if (status === 'hidden') {
    for (let i = 0; i < game.guards.length; i++) {
      if (game.guards[i].state === 'alert') { guardCalmDown(game.guards[i]); }
    }
  }
  for (let i = 0; i < game.wing.relics.length; i++) {
    const r = game.wing.relics[i];
    if (!r.taken) {
      const dx = game.player.x - r.x;
      const dy = game.player.y - r.y;
      if (Math.sqrt(dx * dx + dy * dy) < 28) {
        r.taken = true;
        game.relicsCollected += 1;
      }
    }
  }
  exitGateOpen(game.gate, game.relicsCollected, RELICS_PER_WING);
  if (playerAtExitGate(game.player, game.gate)) {
    game.wingsCleared += 1;
    if (game.wing.index + 1 >= WING_COUNT) {
      game.won = true;
      game.banner = {
        title: 'HEIST COMPLETE',
        subtitle: 'STEALTH RATING: GHOST — 100%  •  5/5 wings cleared unseen',
        color: COLORS.exitGreen
      };
    } else {
      const next = buildGameState('play');
      next.wing = buildWing(game.wing.index + 1);
      next.wingsCleared = game.wingsCleared;
      next.guards = [];
      for (let i = 0; i < next.wing.guards.length; i++) { next.guards.push(createGuard(next.wing.guards[i])); }
      next.player = { x: next.wing.playerStart.x, y: next.wing.playerStart.y };
      next.gate = createExitGate(next.wing.exit);
      game.wing = next.wing; game.guards = next.guards; game.player = next.player; game.gate = next.gate;
      game.relicsCollected = 0;
      game.banner = { title: 'WING CLEAR', subtitle: 'Next wing: ' + game.wing.name, color: COLORS.textBright };
    }
  }
}

function blockPlayerByWalls(game) {
  for (let i = 0; i < game.wing.walls.length; i++) {
    const w = game.wing.walls[i];
    const p = game.player;
    if (p.x + PLAYER_RADIUS > w.x && p.x - PLAYER_RADIUS < w.x + w.w &&
        p.y + PLAYER_RADIUS > w.y && p.y - PLAYER_RADIUS < w.y + w.h) {
      const pushLeft = (p.x + PLAYER_RADIUS) - w.x;
      const pushRight = (w.x + w.w) - (p.x - PLAYER_RADIUS);
      const pushUp = (p.y + PLAYER_RADIUS) - w.y;
      const pushDown = (w.y + w.h) - (p.y - PLAYER_RADIUS);
      const min = Math.min(pushLeft, pushRight, pushUp, pushDown);
      if (min === pushLeft) { p.x = w.x - PLAYER_RADIUS; }
      else if (min === pushRight) { p.x = w.x + w.w + PLAYER_RADIUS; }
      else if (min === pushUp) { p.y = w.y - PLAYER_RADIUS; }
      else { p.y = w.y + w.h + PLAYER_RADIUS; }
    }
  }
}

function renderFrame(ctx, game) {
  renderGame(ctx, game);
  drawHud(ctx, game);
  if (game.caption) { drawShotCaption(ctx, game.caption); }
}

function drawShotCaption(ctx, caption) {
  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = 'rgba(10, 6, 2, 0.85)';
  const w = ctx.measureText(caption).width + 36;
  ctx.fillRect((CANVAS_WIDTH - w) / 2, PLAY_BOTTOM - 34, w, 28);
  ctx.fillStyle = COLORS.textBright;
  ctx.textAlign = 'center';
  ctx.fillText(caption, CANVAS_WIDTH / 2, PLAY_BOTTOM - 15);
}

function gameLoop(ctx, game) {
  updateGame(game);
  renderFrame(ctx, game);
  if (game.banner && game.won) { return; }
  window.requestAnimationFrame(function () { gameLoop(ctx, game); });
}

function runSelftest() {
  const results = [];
  function check(name, pass) { results.push({ name: name, pass: !!pass }); }
  check('five wings defined', WING_COUNT === 5 && wingNames().length === 5);
  let allThreeRelics = true;
  let allHaveGuards = true;
  for (let i = 0; i < WING_COUNT; i++) {
    const w = buildWing(i);
    if (w.relics.length !== RELICS_PER_WING) { allThreeRelics = false; }
    if (w.guards.length < 2) { allHaveGuards = false; }
  }
  check('every wing has 3 relics', allThreeRelics);
  check('every wing has 2+ guards', allHaveGuards);
  const types = {};
  for (let i = 0; i < WING_COUNT; i++) {
    const w = buildWing(i);
    for (let j = 0; j < w.guards.length; j++) { types[w.guards[j].type] = true; }
  }
  check('three guard types present', !!(types.patroller && types.sentry && types.responder));
  const guard = createGuard({ type: 'patroller', waypoints: [[100, 100], [300, 100]], start: 0 });
  const poly = conePolygon(guard, [], []);
  check('vision cone polygon has points', poly.length > 10);
  check('line of sight clear with no cover', !lineOfSightBlocked(0, 0, 100, 0, [], []));
  check('cover blocks line of sight', lineOfSightBlocked(0, 50, 200, 50, [{ x: 90, y: 0, w: 20, h: 100 }], []));
  check('player seen inside cone', playerSeenByGuard({ x: 150, y: 100 }, guard, [], []));
  const hiddenPlayer = { x: 100, y: 50 };
  check('cover hides player', coverHidesPlayer(hiddenPlayer, [{ x: 90, y: 0, w: 20, h: 100 }]));
  const meter = createDetectionMeter();
  updateDetectionMeter(meter, true, false);
  check('detection meter rises when seen', meter.value > 0);
  for (let i = 0; i < 100; i++) { updateDetectionMeter(meter, false, false); }
  check('detection meter falls when unseen', meter.value === 0);
  const gate = createExitGate({ x: 0, y: 0, w: 50, h: 50 });
  check('exit gate locked before relics', !exitGateOpen(gate, 0, 3));
  check('exit gate opens after 3 relics', exitGateOpen(gate, 3, 3));
  check('player at open exit detected', playerAtExitGate({ x: 25, y: 25 }, gate));
  const audio = createFootstepAudio();
  spawnFootstepRipple(audio, 10, 10);
  check('footstep ripple spawns', audio.ripples.length === 1);
  updateFootstepRipples(audio);
  check('footstep ripple grows', audio.ripples.length === 1 && audio.ripples[0].radius > 4);
  const hunter = createGuard({ type: 'responder', waypoints: [[100, 100], [300, 100]], start: 0 });
  guardInvestigate(hunter, 250, 250);
  check('guard investigates last-seen spot', hunter.state === 'investigate' && hunter.investigateX === 250);
  const passed = results.filter(function (r) { return r.pass; }).length;
  const lines = results.map(function (r) { return (r.pass ? 'PASS' : 'FAIL') + ' ' + r.name; });
  lines.unshift('SELFTEST ' + passed + '/' + results.length + (passed === results.length ? ' ALL PASS' : ' FAILURES PRESENT'));
  const el = document.getElementById('selftest-output');
  if (el) { el.textContent = lines.join('\n'); }
  document.title = 'SELFTEST ' + passed + '/' + results.length;
  return { passed: passed, total: results.length, lines: lines };
}

function startMeridianArchive() {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const params = new URLSearchParams(window.location.search);
  if (params.get('selftest') === '1') {
    const result = runSelftest();
    const game = buildGameState('cover');
    applyShotState(game, 'cover');
    renderFrame(ctx, game);
    return result;
  }
  const shot = params.get('shot');
  const game = buildGameState(shot || 'play');
  if (shot) {
    applyShotState(game, shot);
    renderFrame(ctx, game);
    document.title = 'The Meridian Archive — shot ' + shot;
    return game;
  }
  bindKeyboardInput(game.input);
  bindMouseInput(game.input, canvas);
  window.addEventListener('keydown', function () { ensureAudioContext(game.audio); });
  gameLoop(ctx, game);
  return game;
}

window.addEventListener('DOMContentLoaded', startMeridianArchive);
