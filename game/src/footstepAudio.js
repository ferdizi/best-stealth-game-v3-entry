// footstepAudio.js — footstep ripples and WebAudio blips.
// One job: make every step visible as a ripple and audible as a soft blip.
function createFootstepAudio() {
  return { context: null, enabled: false, ripples: [], lastBlipFrame: 0 };
}

function ensureAudioContext(audio) {
  if (audio.context) { return audio.context; }
  try {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) { return null; }
    audio.context = new Ctor();
    audio.enabled = true;
  } catch (e) {
    audio.enabled = false;
  }
  return audio.context;
}

function footstepBlip(audio, kind) {
  const ctx = ensureAudioContext(audio);
  if (!ctx || !audio.enabled || ctx.state !== 'running') { return; }
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = kind === 'guard' ? 140 : 520;
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.13);
}

function guardProximityBlip(audio, distance) {
  if (distance < 220 && audio.lastBlipFrame + 45 < audio.frame) {
    footstepBlip(audio, 'guard');
    audio.lastBlipFrame = audio.frame;
  }
}

function spawnFootstepRipple(audio, x, y) {
  audio.ripples.push({ x: x, y: y, radius: 4, alpha: 0.8 });
  if (audio.ripples.length > 40) { audio.ripples.shift(); }
}

function updateFootstepRipples(audio) {
  for (let i = audio.ripples.length - 1; i >= 0; i--) {
    audio.ripples[i].radius += 1.1;
    audio.ripples[i].alpha -= 0.03;
    if (audio.ripples[i].alpha <= 0) { audio.ripples.splice(i, 1); }
  }
}

function footstepRippleCount(audio) {
  return audio.ripples.length;
}
