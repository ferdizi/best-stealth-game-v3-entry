// exitGate.js — the glowing green exit gate of each wing.
// One job: open the gate once all relics are taken, and spot the escape.
function createExitGate(def) {
  return {
    x: def.x,
    y: def.y,
    w: def.w,
    h: def.h,
    label: def.label || 'EXIT',
    open: false,
    pulse: 0
  };
}

function exitGateOpen(gate, relicsCollected, relicsTotal) {
  gate.open = relicsCollected >= relicsTotal;
  return gate.open;
}

function playerAtExitGate(player, gate) {
  if (!gate.open) { return false; }
  return pointInRect(player.x, player.y, gate);
}

function exitGateGlowPhase(time) {
  return 0.5 + 0.5 * Math.sin(time / 300);
}

function exitGateStatusText(gate, relicsCollected, relicsTotal) {
  if (gate.open) { return 'EXIT OPEN — GO!'; }
  return 'EXIT LOCKED — RELICS ' + relicsCollected + '/' + relicsTotal;
}

function relicsRemaining(relics) {
  let left = 0;
  for (let i = 0; i < relics.length; i++) {
    if (!relics[i].taken) { left += 1; }
  }
  return left;
}

function exitGateCenter(gate) {
  return { x: gate.x + gate.w / 2, y: gate.y + gate.h / 2 };
}
