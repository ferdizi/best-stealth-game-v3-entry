// input.js — keyboard and mouse input for The Meridian Archive.
// One job: turn keys and clicks into a clean movement intent for main.js.
function createInputState() {
  return {
    up: false,
    down: false,
    left: false,
    right: false,
    sprint: false,
    interact: false,
    mouseX: CANVAS_WIDTH / 2,
    mouseY: CANVAS_HEIGHT / 2,
    mouseDown: false
  };
}

function bindKeyboardInput(input) {
  const keyMap = {
    ArrowUp: 'up', KeyW: 'up',
    ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
    ShiftLeft: 'sprint', ShiftRight: 'sprint',
    KeyE: 'interact', Space: 'interact'
  };
  window.addEventListener('keydown', function (event) {
    const field = keyMap[event.code];
    if (field) { input[field] = true; event.preventDefault(); }
  });
  window.addEventListener('keyup', function (event) {
    const field = keyMap[event.code];
    if (field) { input[field] = false; event.preventDefault(); }
  });
}

function bindMouseInput(input, canvas) {
  canvas.addEventListener('mousemove', function (event) {
    const rect = canvas.getBoundingClientRect();
    input.mouseX = (event.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
    input.mouseY = (event.clientY - rect.top) * (CANVAS_HEIGHT / rect.height);
  });
  canvas.addEventListener('mousedown', function () { input.mouseDown = true; });
  window.addEventListener('mouseup', function () { input.mouseDown = false; });
}

function inputMoveVector(input) {
  let x = 0;
  let y = 0;
  if (input.left) { x -= 1; }
  if (input.right) { x += 1; }
  if (input.up) { y -= 1; }
  if (input.down) { y += 1; }
  if (x !== 0 && y !== 0) { x *= 0.7071; y *= 0.7071; }
  return { x: x, y: y, sprint: input.sprint };
}

function inputIsMoving(input) {
  return input.up || input.down || input.left || input.right;
}

function inputHasInteract(input) {
  return input.interact;
}
