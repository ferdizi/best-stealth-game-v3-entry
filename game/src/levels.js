// levels.js — the five wings (heists) of The Meridian Archive.
// One job: define each wing's map, guards, cover, relics and exit gate.
function buildWing(index) {
  const wings = [wingMarbleHall(), wingMapRoom(), wingRelicVault(), wingCandleGallery(), wingMeridianChamber()];
  return wings[index % wings.length];
}

function wingMarbleHall() {
  return {
    index: 0,
    name: 'WING 1 — THE MARBLE HALL',
    subtitle: 'Learn the patrols. Patience opens the way.',
    mechanic: 'Steady patrollers with dotted patrol routes',
    playerStart: { x: 90, y: 660 },
    exit: { x: 1150, y: 130, w: 84, h: 84, label: 'EXIT' },
    relics: [
      { x: 330, y: 220, taken: false, name: 'Moon Dial' },
      { x: 660, y: 620, taken: false, name: 'Ivory Quill' },
      { x: 980, y: 300, taken: false, name: 'Brass Astrolabe' }
    ],
    cover: [
      { x: 240, y: 300, w: 70, h: 150, kind: 'statue', label: 'STATUE — COVER' },
      { x: 520, y: 150, w: 150, h: 60, kind: 'shelf', label: 'SHELF — COVER' },
      { x: 760, y: 420, w: 70, h: 150, kind: 'statue', label: 'STATUE — COVER' },
      { x: 1020, y: 480, w: 150, h: 60, kind: 'curtain', label: 'CURTAIN — COVER' },
      { x: 420, y: 520, w: 150, h: 60, kind: 'shelf', label: 'SHELF — COVER' }
    ],
    walls: [
      { x: 600, y: 250, w: 26, h: 180 },
      { x: 180, y: 470, w: 26, h: 160 }
    ],
    guards: [
      { type: 'patroller', waypoints: [[300, 180], [900, 180], [900, 420], [300, 420]], start: 0 },
      { type: 'patroller', waypoints: [[1050, 620], [500, 620], [500, 380], [1050, 380]], start: 2 }
    ],
    hint: 'Wait for the amber cone to pass, then slip behind the statue.'
  };
}

function wingMapRoom() {
  return {
    index: 1,
    name: 'WING 2 — THE MAP ROOM',
    subtitle: 'Sentries sweep the room. Time the rotating cone.',
    mechanic: 'Sentry guards with rotating vision cones',
    playerStart: { x: 90, y: 180 },
    exit: { x: 1150, y: 640, w: 84, h: 84, label: 'EXIT' },
    relics: [
      { x: 420, y: 640, taken: false, name: 'Star Chart' },
      { x: 700, y: 180, taken: false, name: 'Compass Rose' },
      { x: 1050, y: 380, taken: false, name: 'Meridian Scroll' }
    ],
    cover: [
      { x: 300, y: 300, w: 70, h: 150, kind: 'statue', label: 'STATUE — COVER' },
      { x: 620, y: 420, w: 150, h: 60, kind: 'shelf', label: 'SHELF — COVER' },
      { x: 900, y: 180, w: 70, h: 150, kind: 'curtain', label: 'CURTAIN — COVER' },
      { x: 180, y: 520, w: 150, h: 60, kind: 'shelf', label: 'SHELF — COVER' }
    ],
    walls: [
      { x: 480, y: 300, w: 26, h: 180 },
      { x: 850, y: 480, w: 26, h: 160 }
    ],
    guards: [
      { type: 'sentry', waypoints: [[640, 300]], start: 0, angle: 0.4 },
      { type: 'sentry', waypoints: [[950, 560]], start: 0, angle: 2.6 },
      { type: 'patroller', waypoints: [[250, 380], [1050, 380]], start: 1 }
    ],
    hint: 'A sentry never moves — its cone turns. Cross behind its back.'
  };
}

function wingRelicVault() {
  return {
    index: 2,
    name: 'WING 3 — THE RELIC VAULT',
    subtitle: 'Fast responders hunt noise. Move soft, move slow.',
    mechanic: 'Fast responders that chase footsteps',
    playerStart: { x: 640, y: 680 },
    exit: { x: 90, y: 130, w: 84, h: 84, label: 'EXIT' },
    relics: [
      { x: 180, y: 380, taken: false, name: 'Jade Lantern' },
      { x: 640, y: 220, taken: false, name: 'Silver Sextant' },
      { x: 1100, y: 480, taken: false, name: 'Gold Meridian' }
    ],
    cover: [
      { x: 260, y: 180, w: 150, h: 60, kind: 'shelf', label: 'SHELF — COVER' },
      { x: 520, y: 380, w: 70, h: 150, kind: 'statue', label: 'STATUE — COVER' },
      { x: 820, y: 180, w: 70, h: 150, kind: 'curtain', label: 'CURTAIN — COVER' },
      { x: 980, y: 560, w: 150, h: 60, kind: 'shelf', label: 'SHELF — COVER' },
      { x: 180, y: 560, w: 70, h: 120, kind: 'statue', label: 'STATUE — COVER' }
    ],
    walls: [
      { x: 420, y: 480, w: 26, h: 170 },
      { x: 760, y: 300, w: 26, h: 170 }
    ],
    guards: [
      { type: 'responder', waypoints: [[300, 300], [1000, 300], [1000, 600], [300, 600]], start: 0 },
      { type: 'responder', waypoints: [[1100, 200], [1100, 600], [200, 600], [200, 200]], start: 2 },
      { type: 'patroller', waypoints: [[640, 420], [640, 180]], start: 0 }
    ],
    hint: 'Sprint and they hear you. Walk, and the vault stays yours.'
  };
}

function wingCandleGallery() {
  return {
    index: 3,
    name: 'WING 4 — THE CANDLE GALLERY',
    subtitle: 'Three guard kinds at once. Read every cone.',
    mechanic: 'Patroller + sentry + responder together',
    playerStart: { x: 90, y: 660 },
    exit: { x: 1150, y: 130, w: 84, h: 84, label: 'EXIT' },
    relics: [
      { x: 360, y: 180, taken: false, name: 'Wax Seal' },
      { x: 700, y: 480, taken: false, name: 'Candle Crown' },
      { x: 1080, y: 620, taken: false, name: 'Ember Lens' }
    ],
    cover: [
      { x: 220, y: 380, w: 70, h: 150, kind: 'statue', label: 'STATUE — COVER' },
      { x: 500, y: 180, w: 150, h: 60, kind: 'curtain', label: 'CURTAIN — COVER' },
      { x: 820, y: 380, w: 70, h: 150, kind: 'shelf', label: 'SHELF — COVER' },
      { x: 1000, y: 300, w: 150, h: 60, kind: 'statue', label: 'STATUE — COVER' },
      { x: 420, y: 560, w: 150, h: 60, kind: 'shelf', label: 'SHELF — COVER' }
    ],
    walls: [
      { x: 640, y: 260, w: 26, h: 180 },
      { x: 300, y: 560, w: 26, h: 130 }
    ],
    guards: [
      { type: 'patroller', waypoints: [[280, 240], [980, 240]], start: 0 },
      { type: 'sentry', waypoints: [[640, 560]], start: 0, angle: 1.8 },
      { type: 'responder', waypoints: [[1100, 420], [400, 420], [400, 640], [1100, 640]], start: 1 }
    ],
    hint: 'The sentry pins the middle. The responder owns the south hall.'
  };
}

function wingMeridianChamber() {
  return {
    index: 4,
    name: 'WING 5 — THE MERIDIAN CHAMBER',
    subtitle: 'The final heist. Every guard kind, every trick.',
    mechanic: 'All three guard kinds in one grand hall',
    playerStart: { x: 640, y: 680 },
    exit: { x: 590, y: 120, w: 100, h: 84, label: 'EXIT — FREEDOM' },
    relics: [
      { x: 180, y: 200, taken: false, name: 'Meridian Key' },
      { x: 1100, y: 200, taken: false, name: 'Crown of Hours' },
      { x: 640, y: 420, taken: false, name: 'The Meridian Heart' }
    ],
    cover: [
      { x: 280, y: 300, w: 70, h: 150, kind: 'statue', label: 'STATUE — COVER' },
      { x: 930, y: 300, w: 70, h: 150, kind: 'statue', label: 'STATUE — COVER' },
      { x: 480, y: 520, w: 150, h: 60, kind: 'shelf', label: 'SHELF — COVER' },
      { x: 660, y: 520, w: 150, h: 60, kind: 'curtain', label: 'CURTAIN — COVER' },
      { x: 180, y: 480, w: 150, h: 60, kind: 'shelf', label: 'SHELF — COVER' },
      { x: 950, y: 480, w: 150, h: 60, kind: 'shelf', label: 'SHELF — COVER' }
    ],
    walls: [
      { x: 420, y: 200, w: 26, h: 150 },
      { x: 840, y: 200, w: 26, h: 150 }
    ],
    guards: [
      { type: 'patroller', waypoints: [[240, 200], [1040, 200]], start: 0 },
      { type: 'patroller', waypoints: [[1040, 620], [240, 620]], start: 1 },
      { type: 'sentry', waypoints: [[640, 300]], start: 0, angle: 3.1 },
      { type: 'responder', waypoints: [[320, 420], [960, 420], [960, 620], [320, 620]], start: 0 }
    ],
    hint: 'Take the Heart last. The chamber watches it closest.'
  };
}

function wingCount() {
  return WING_COUNT;
}

function wingNames() {
  return [
    'WING 1 — THE MARBLE HALL',
    'WING 2 — THE MAP ROOM',
    'WING 3 — THE RELIC VAULT',
    'WING 4 — THE CANDLE GALLERY',
    'WING 5 — THE MERIDIAN CHAMBER'
  ];
}
