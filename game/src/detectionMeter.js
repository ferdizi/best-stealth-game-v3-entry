// detectionMeter.js — the detection meter and the near-miss recovery rule.
// One job: turn "seen / unseen" into a meter, a status and a second chance.
function createDetectionMeter() {
  return { value: 0, status: 'hidden', timesSpotted: 0, graceFramesLeft: 0 };
}

function updateDetectionMeter(meter, seen, playerHidden) {
  if (seen && !playerHidden) {
    meter.value += DETECTION_RISE_PER_FRAME;
    if (meter.value >= ALERT_THRESHOLD) {
      meter.value = ALERT_THRESHOLD;
      if (meter.status !== 'spotted') { meter.timesSpotted += 1; }
      meter.status = 'spotted';
      meter.graceFramesLeft = 0;
    } else if (meter.value >= SUSPECT_THRESHOLD) {
      meter.status = 'suspicious';
    }
  } else {
    meter.value -= DETECTION_FALL_PER_FRAME;
    if (meter.value < 0) { meter.value = 0; }
    if (meter.status === 'spotted') {
      meter.graceFramesLeft += 1;
      if (meter.graceFramesLeft >= CALM_AFTER_FRAMES) {
        meter.status = 'hidden';
        meter.graceFramesLeft = 0;
      }
    } else if (meter.value < SUSPECT_THRESHOLD) {
      meter.status = 'hidden';
    }
  }
  return meter.status;
}

function detectionStatus(meter) {
  return STATUS_LABELS[meter.status] || 'HIDDEN';
}

function detectionMeterColor(meter) {
  if (meter.status === 'spotted') { return COLORS.coneAlert; }
  if (meter.status === 'suspicious') { return COLORS.coneSuspect; }
  return COLORS.exitGreen;
}

function detectionMeterFraction(meter) {
  return meter.value / ALERT_THRESHOLD;
}

function detectionRecoverySeconds(meter) {
  if (meter.status !== 'spotted') { return 0; }
  return Math.max(0, (CALM_AFTER_FRAMES - meter.graceFramesLeft) / 60);
}

function detectionIsCalm(meter) {
  return meter.status === 'hidden' && meter.value === 0;
}
