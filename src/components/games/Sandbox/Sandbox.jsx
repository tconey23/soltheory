import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import planck from 'planck-js';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { HexColorPicker } from "react-colorful";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight * 0.80;
const SCALE = 30;

const toPixels = (v) => v * SCALE;
const toMeters = (v) => v / SCALE;

const Sandbox = () => {
  const canvasRef = useRef();
  const worldRef = useRef();
  const appRef = useRef();
  const orbsRef = useRef([]);
  const cueRef = useRef();

  const DAMPING_FACTOR = 0.95;

  const [orbCount, setOrbCount] = useState(50)
  const [orbColor1, setOrbColor1] = useState('#34ebc0')
  const [orbColor2, setOrbColor2] = useState('#7a34eb')
  const [orbCollColor, setOrbCollColor] = useState('#eb34d5')
  const [resetColor, setResetColor] = useState(10)

useEffect(() => {
  const app = new PIXI.Application({
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: 0x111111,
    antialias: true,
  });

  appRef.current = app;

  if (canvasRef.current && canvasRef.current.parentNode) {
    canvasRef.current.parentNode.replaceChild(app.view, canvasRef.current);
  }

  const world = new planck.World(planck.Vec2(0, 0));
  worldRef.current = world;

  world.on('begin-contact', (contact) => {
  const fixtureA = contact.getFixtureA();
  const fixtureB = contact.getFixtureB();
  const bodyA = fixtureA.getBody();
  const bodyB = fixtureB.getBody();

  const now = Date.now();
  const flashDuration = 200; // ms

  if (bodyA.name === 'orb' && bodyB.name === 'orb') {
    const orbA = orbsRef.current.find(o => o.body === bodyA);
    const orbB = orbsRef.current.find(o => o.body === bodyB);

    if (orbA) orbA.flashUntil = now + flashDuration;
    if (orbB) orbB.flashUntil = now + flashDuration;
  }

  // Example: cue hits orb
  if ((bodyA.name === 'cue' && bodyB.name === 'orb') || 
      (bodyB.name === 'cue' && bodyA.name === 'orb')) {
    // Do something, like play a sound or flash
  }
  });

  world.on('end-contact', (contact) => {
  const bodyA = contact.getFixtureA().getBody();
  const bodyB = contact.getFixtureB().getBody();
  console.log('Collision ended between:', bodyA.name, bodyB.name);
  });

  // Create walls
  const createWall = (x, y, w, h) => {
    const body = world.createBody();
    body.createFixture(planck.Box(toMeters(w / 2), toMeters(h / 2)), { restitution: 1 });
    body.setPosition(planck.Vec2(toMeters(x), toMeters(y)));
  };

  createWall(WIDTH / 2, 0, WIDTH, 40);
  createWall(WIDTH / 2, HEIGHT, WIDTH, 40);
  createWall(0, HEIGHT / 2, 40, HEIGHT);
  createWall(WIDTH, HEIGHT / 2, 40, HEIGHT);

  // Cue ball
  const cue = world.createDynamicBody();
  cue.createFixture(planck.Circle(toMeters(14)), {
    restitution: 0.1,
    density: 10,
    friction: 0.05,
  });
  cue.setPosition(planck.Vec2(toMeters(100), toMeters(HEIGHT / 2)));
  cue.name = 'cue'
  cueRef.current = cue;

  const cueGraphic = new PIXI.Graphics();
  cueGraphic.beginFill(0xff4444);
  cueGraphic.drawCircle(0, 0, 14);
  cueGraphic.endFill();
  app.stage.addChild(cueGraphic);

  // Aim line
  const aimLine = new PIXI.Graphics();
  app.stage.addChild(aimLine);
  const aimLineRef = { current: aimLine };

  // Drag state
  let isDragging = false;
  let dragStart = null;
  let dragEnd = null;

  const getMouseWorld = (event) => {
    const rect = app.view.getBoundingClientRect();
    const x = toMeters(event.clientX - rect.left);
    const y = toMeters(event.clientY - rect.top);
    return planck.Vec2(x, y);
  };

  const onPointerDown = (e) => {
    const worldPos = getMouseWorld(e);
    const cuePos = cue.getPosition();
    const dist = cuePos.clone().sub(worldPos).length();

    if (dist < toMeters(14)) {
      isDragging = true;
      dragStart = worldPos;
      dragEnd = worldPos;
      cue.setLinearVelocity(planck.Vec2(0, 0));
      cue.setAngularVelocity(0);
    }
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    dragEnd = getMouseWorld(e);
  };

  const onPointerUp = () => {
    if (!isDragging || !dragStart || !dragEnd) return;
    const impulse = dragStart.clone().sub(dragEnd);
    cue.applyLinearImpulse(impulse.mul(50), cue.getWorldCenter(), true);
    isDragging = false;
    aimLineRef.current.clear();
  };

  app.view.addEventListener('pointerdown', onPointerDown);
  app.view.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  // Animation loop
  app.ticker.add(() => {

    for (let body = world.getBodyList(); body; body = body.getNext()) {
      if (body.isDynamic()) {

        if(body.name === 'cue'){
          const velocity = body.getLinearVelocity();
          const mass = body.getMass();
          const damp = Math.pow(DAMPING_FACTOR, 1 / Math.max(0.01, mass));
          velocity.mul(damp);
          body.setLinearVelocity(velocity);
        }

        if(body.name === 'orb'){
          const velocity = body.getLinearVelocity();
          const mass = body.getMass() * 1;
          const damp = Math.pow(DAMPING_FACTOR, 1 / Math.max(20, mass));
          velocity.mul(damp);
          body.setLinearVelocity(velocity);
        }
      }

      const pos = body.getPosition();
      // console.log(toPixels(pos.x), toPixels(pos.y));
    }
    world.step(1 / 60);

    // Update cue
    const cuePos = cue.getPosition();
    cueGraphic.x = toPixels(cuePos.x);
    cueGraphic.y = toPixels(cuePos.y);

    // Update orbs
    const now = Date.now();

    for (const { body, graphic, flashUntil } of orbsRef.current) {
      const pos = body.getPosition();
      graphic.x = toPixels(pos.x);
      graphic.y = toPixels(pos.y);

      const isFlashing = flashUntil && now < flashUntil;
      const desiredColor = isFlashing ? orbColor2 : orbColor1;

      if (graphic.currentColor !== desiredColor) {
        graphic.clear();
        graphic.beginFill(desiredColor);
        graphic.drawCircle(0, 0, 10);
        graphic.endFill();
        graphic.currentColor = desiredColor; // cache it on the graphic object
      }
    }

    // Draw aim line
    const g = aimLineRef.current;
    g.clear();
    if (isDragging && dragStart && dragEnd) {
      g.lineStyle(2, 0xffffff, 0.8);
      g.moveTo(toPixels(dragStart.x), toPixels(dragStart.y));
      g.lineTo(toPixels(dragEnd.x), toPixels(dragEnd.y));
    }
  });

  return () => {
    app.destroy(true, { children: true });
    window.removeEventListener('pointerup', onPointerUp);
  };
}, []);

useEffect(() => {
  const world = worldRef.current;
  const app = appRef.current;
  const orbs = orbsRef.current;

  if (!world || !app) return;

  const currentCount = orbs.length;

  // Add orbs if needed
  if (orbCount > currentCount) {
    const toAdd = orbCount - currentCount;
    for (let i = 0; i < toAdd; i++) {
      const body = world.createDynamicBody();
      body.createFixture(planck.Circle(toMeters(10)), {
        restitution: 0.9,
        density: 0.5,
        friction: 0,
      });
      body.name = 'orb'
      body.setPosition(planck.Vec2(
        toMeters(WIDTH / 2 + Math.random() * 100 - 50),
        toMeters(HEIGHT / 2 + Math.random() * 100 - 50)
      ));

      const graphic = new PIXI.Graphics();
      graphic.beginFill(orbColor1);
      graphic.drawCircle(0, 0, 10);
      graphic.endFill();
      app.stage.addChild(graphic);

      orbs.push({
        body,
        graphic,
        flashUntil: 0,
        currentColor: orbColor1, // track current
      });
    }
  }

  // Remove orbs if needed
  if (orbCount < currentCount) {
    const toRemove = currentCount - orbCount;
    for (let i = 0; i < toRemove; i++) {
      const { body, graphic } = orbs.pop();
      world.destroyBody(body);
      app.stage.removeChild(graphic);
    }
  }
}, [orbCount]);

  return (
    <Stack height={'80%'} width={'100%'}>
      {/* <Stack height={'30%'} bgcolor={'#ffffff00'}>
      <Accordion sx={{height: '70%', overflow: 'auto', width: '40%', position: 'absolute', bgcolor: '#ffffff00'}}>
        <AccordionSummary sx={{color: 'white'}}><i class="fi fi-bs-menu-burger"></i></AccordionSummary>
        <AccordionDetails>
          <Stack width={'98%'}>
            <Typography>Orb Count ({orbCount})</Typography>
            <Slider value={orbCount} max={500} step={10} onChange={(e) => setOrbCount(e.target.value)}/>
          </Stack>
          <Stack width={'98%'}>
            <Typography>Orb color 1</Typography>
            <HexColorPicker color={orbColor1} onChange={setOrbColor1}/>
          </Stack>
          <Stack width={'98%'}>
            <Typography>Orb color 2</Typography>
            <HexColorPicker color={orbColor2} onChange={setOrbColor2}/>
          </Stack>
          <Stack width={'98%'}>
            <Typography>Orb collision color</Typography>
            <HexColorPicker color={orbCollColor} onChange={setOrbCollColor}/>
          </Stack>
          <Stack width={'98%'}>
            <Typography>Collision color time</Typography>
            <Slider value={resetColor} max={500} step={1} onChange={(e) => setResetColor(e.target.value)}/>
          </Stack>
        </AccordionDetails>
      </Accordion>
      </Stack> */}
      <canvas style={{position: 'absolute'}} width={'100%'} height={'100%'} ref={canvasRef} />
    </Stack>
  )
};

export default Sandbox;