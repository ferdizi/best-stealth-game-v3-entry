// config.js — every tunable number, colour and label of The Meridian Archive.
// One job: hold the game's constants so every other file reads the same truth.
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 800;
const HUD_HEIGHT = 96;
const LEGEND_HEIGHT = 46;
const PLAY_TOP = HUD_HEIGHT;
const PLAY_BOTTOM = CANVAS_HEIGHT - LEGEND_HEIGHT;
const PLAYER_RADIUS = 11;
const PLAYER_SPEED = 2.7;
const PLAYER_SPRINT_MULT = 1.6;
const GUARD_RADIUS = 14;
const GUARD_PATROL_SPEED = 1.15;
const GUARD_SENTRY_ROTATE_SPEED = 0.011;
const GUARD_RESPONDER_SPEED = 2.1;
const GUARD_INVESTIGATE_SPEED = 1.7;
const CONE_RANGE = 175;
const CONE_HALF_ANGLE = 0.62;
const CONE_RAYS = 26;
const DETECTION_RISE_PER_FRAME = 0.05;
const DETECTION_FALL_PER_FRAME = 0.022;
const SUSPECT_THRESHOLD = 0.35;
const ALERT_THRESHOLD = 1.0;
const CALM_AFTER_FRAMES = 300;
const RELICS_PER_WING = 3;
const WING_COUNT = 5;
const FOOTSTEP_INTERVAL_FRAMES = 14;
const SHOT_FIXED_TIME = 1200;

const COLORS = {
  floor: '#241c14',
  floorTile: '#2c2318',
  floorGlow: '#3a2d1c',
  wall: '#171008',
  wallEdge: '#6b5326',
  hudBg: '#120d06',
  hudLine: '#8a6d2f',
  textBright: '#f5e6b8',
  textDim: '#c9a86a',
  textAlert: '#ff5a4e',
  conePatrol: '#f5b942',
  coneSuspect: '#ff7a1a',
  coneAlert: '#ff2e2e',
  coneSafe: '#f5b942',
  player: '#ffe9a8',
  playerRing: '#ffffff',
  relic: '#ffd94d',
  relicGlow: '#ffef9e',
  exitGreen: '#3dff7a',
  exitGlow: '#9dffc4',
  coverStatue: '#8f8578',
  coverShelf: '#5d4326',
  coverCurtain: '#7a1f2b',
  coverLabel: '#e8dcc0',
  patrolRoute: '#d8c27a',
  ripple: '#ffe9a8',
  safeZone: 'rgba(61, 255, 122, 0.10)',
  dangerZone: 'rgba(255, 46, 46, 0.08)'
};

const GUARD_TYPES = {
  patroller: { label: 'PATROLLER', speed: GUARD_PATROL_SPEED, cone: CONE_RANGE, desc: 'steady patrol' },
  sentry: { label: 'SENTRY', speed: 0, cone: CONE_RANGE + 25, desc: 'rotating cone' },
  responder: { label: 'RESPONDER', speed: GUARD_RESPONDER_SPEED, cone: CONE_RANGE - 15, desc: 'fast, chases noise' }
};

const STATUS_LABELS = {
  hidden: 'HIDDEN',
  suspicious: 'SUSPICIOUS',
  spotted: 'SPOTTED'
};

const SHOT_NAMES = ['cover', 'patrol', 'nearmiss', 'victory'];
