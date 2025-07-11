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
import { Button } from '@mui/material';

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
  const [resetRef, setResetRef] = useState(0)

  const DAMPING_FACTOR = 0.95;

  const [orbCount, setOrbCount] = useState(50)
  const [orbColor1, setOrbColor1] = useState('#34ebc0')
  const [orbColor2, setOrbColor2] = useState('#7a34eb')
  const [orbCollColor, setOrbCollColor] = useState('#ff008d')
  const [resetColor, setResetColor] = useState(10)
  const [orbSize, setOrbSize] = useState(10)
  const orbColor1Ref = useRef(orbColor1);
  const orbCollColorRef = useRef(orbCollColor);
  const orbSizeRef = useRef(orbSize)

  const hexToNumber = (hex) => Number(hex.replace(/^#/, '0x'))

  useEffect(() => {
  orbColor1Ref.current = orbColor1;
}, [orbColor1]);

useEffect(() => {
  orbCollColorRef.current = orbCollColor;
}, [orbCollColor]);

useEffect(() => {
  orbSizeRef.current = orbSize;
}, [orbSize]);

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
  cueGraphic.beginFill('#f59e42');
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

  const x = toMeters((event.clientX ?? event.touches?.[0]?.clientX) - rect.left);
  const y = toMeters((event.clientY ?? event.touches?.[0]?.clientY) - rect.top);

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
      const desiredColor = isFlashing
        ? orbCollColorRef.current
        : orbColor1Ref.current;

      if (graphic.currentColor !== desiredColor) {
        graphic.clear();
        graphic.beginFill(hexToNumber(desiredColor));
        graphic.drawCircle(0, 0, Number(orbSizeRef.current)); // <-- FIXED!
        graphic.endFill();
        graphic.currentColor = desiredColor;
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
  const orbRadius = orbSize;

  if (!world || !app) return;

  let currentCount = orbs.length;

  // Add orbs if needed
  if (orbCount > currentCount) {
    const toAdd = orbCount - currentCount;
    for (let i = 0; i < toAdd; i++) {
      const body = world.createDynamicBody();
      body.createFixture(planck.Circle(toMeters(orbRadius)), {
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
      graphic.beginFill(hexToNumber(orbColor1));
      graphic.drawCircle(0, 0, orbRadius);
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
}, [orbCount, orbSize]);


useEffect(() => {
  const orbs = orbsRef.current;
  const app = appRef.current;
  const world = worldRef.current;

  if (!orbs || !app || !world) return;

  orbs.forEach((orb) => {
    // ---- Update Planck physics fixture ----

    // Remove the old fixture (there's only one for each orb)
    const oldFixture = orb.body.getFixtureList();
    if (oldFixture) {
      orb.body.destroyFixture(oldFixture);
    }
    // Add new fixture with the updated radius
    orb.body.createFixture(planck.Circle(toMeters(orbSizeRef.current)), {
      restitution: 0.9,
      density: 0.5,
      friction: 0,
    });

    // ---- Update PIXI graphics ----

    orb.graphic.clear();
    orb.graphic.beginFill(hexToNumber(orbColor1Ref.current));
    orb.graphic.drawCircle(0, 0, orbSizeRef.current); // new size!
    orb.graphic.endFill();
    orb.graphic.currentColor = orbColor1Ref.current; // cache for comparison
  });
}, [orbSize]);


  return (  
    <Stack height={'80%'} width={'100%'}>
      <Stack height={'30%'} bgcolor={'#ffffff00'}>
      <Accordion sx={{height: 'fit-content', overflow: 'auto', width: 'auto', position: 'absolute', bgcolor: '#ffffff00', maxHeight: '50%'}}>
        <AccordionSummary sx={{color: 'white'}}><i class="fi fi-bs-menu-burger"></i></AccordionSummary>
        <AccordionDetails>
          <Stack width={'98%'}>
            <Typography fontFamily={'fredoka regular'} color={'whitesmoke'}>Orb Count ({orbCount})</Typography>
            <Slider value={orbCount} max={500} step={10} onChange={(e) => setOrbCount(Number(e.target.value))}/>
          </Stack>
          <Stack width={'98%'}>
            <Typography fontFamily={'fredoka regular'} color={'whitesmoke'}>Orb Size</Typography>
            <Slider value={orbSize} max={20} min={1} step={0.5} onChange={(e) => setOrbSize(Number(e.target.value))}/>
          </Stack>
          <Stack width={'98%'}>
            <Typography fontFamily={'fredoka regular'} color={'whitesmoke'}>Orb color 1</Typography>
            <HexColorPicker color={orbColor1} onChange={setOrbColor1}/>
          </Stack>
          <Stack width={'98%'}>
            <Typography fontFamily={'fredoka regular'} color={'whitesmoke'}>Orb color 2</Typography>
            <HexColorPicker color={orbColor2} onChange={setOrbColor2}/>
          </Stack>
          <Stack width={'98%'}>
            <Typography fontFamily={'fredoka regular'} color={'whitesmoke'}>Orb collision color</Typography>
            <HexColorPicker color={orbCollColor} onChange={setOrbCollColor}/>
          </Stack>
        </AccordionDetails>
      </Accordion>
      </Stack>
      <canvas style={{position: 'absolute'}} width={'100%'} height={'100%'} ref={canvasRef} />
    </Stack>
  )
};

export default Sandbox;