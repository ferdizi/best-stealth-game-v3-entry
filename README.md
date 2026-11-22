# The Meridian Archive — Five Heists by Lamplight

[![make.fun](https://make.fun/badge/best-stealth-game-20261121-1759.svg)](https://make.fun/c/best-stealth-game-20261121-1759)
[![rank](https://make.fun/badge/best-stealth-game-20261121-1759/ferdizi/best-stealth-game-v3-entry/rank.svg)](https://make.fun/c/best-stealth-game-20261121-1759)
[![reward](https://make.fun/badge/best-stealth-game-20261121-1759/ferdizi/best-stealth-game-v3-entry/reward.svg)](https://make.fun/c/best-stealth-game-20261121-1759)

A top-down 2D stealth game in a moonlit museum archive. Five wings, five heists — each with its own guard kind and trick. Learn the patrols, hide behind statues, shelves and curtains, collect 3 relics per wing, then reach the glowing green exit unseen.

## How to play

- **WASD / arrows** — move. **SHIFT** — sprint (guards hear footsteps).
- **Vision cones** are colour-coded: **amber** = patrol, **orange** = suspicious, **red** = alert.
- **Dotted lines** on the floor are patrol routes — learn them, time the gap.
- **Cover** (statues, shelves, curtains) blocks line of sight: a cone that touches cover stops at it.
- **Detection meter**: seen → it rises; break sight and it falls. Spotted guards investigate your last-seen spot, then calm down after 5 seconds unseen — every near-miss is recoverable.
- **Footstep ripples** + soft audio blips mark every step, yours and the guards'.
- Collect all 3 relics to unlock the exit gate, then escape for a stealth rating per wing.

## The five wings

1. **The Marble Hall** — steady patrollers, learn the routes.
2. **The Map Room** — sentries with rotating cones.
3. **The Relic Vault** — fast responders that chase noise.
4. **The Candle Gallery** — all three guard kinds at once.
5. **The Meridian Chamber** — the final heist, every trick together.

## Run it

Serve `game/` with any static server and open `index.html` in desktop Chrome. No network requests, no build step, vanilla canvas JS.

Deterministic screenshots: `?shot=cover`, `?shot=patrol`, `?shot=nearmiss`, `?shot=victory`. Self-test: `?selftest=1`.

## Structure

- `game/src/config.js` — constants, colours, guard types
- `game/src/input.js` — keyboard + mouse input
- `game/src/levels.js` — the five wing definitions
- `game/src/guards.js` — patrol, sentry rotation, investigation
- `game/src/visionCone.js` — cones, raycast sight, line of sight
- `game/src/detectionMeter.js` — detection meter + recovery rule
- `game/src/coverSystem.js` — cover that blocks sight
- `game/src/exitGate.js` — the glowing exit gate
- `game/src/footstepAudio.js` — footstep ripples + WebAudio blips
- `game/src/render.js` — canvas drawing of the museum
- `game/src/hud.js` — HUD, detection bar, legend strip
- `game/src/main.js` — game state, loop, shot states, selftest

Entry for the [best stealth game bounty](https://make.fun/c/best-stealth-game-20261121-1759) on make.fun.
