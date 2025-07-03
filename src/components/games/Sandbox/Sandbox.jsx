import React, { useEffect, useRef, useState } from 'react';
import { Stage, Graphics } from 'react-pixi-fiber'; // or '@inlet/react-pixi'
import planck from 'planck-js';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const SCALE = 30;

const toPixels = (v) => v * SCALE;
const toMeters = (v) => v / SCALE;

const Sandbox = () => {
  const worldRef = useRef(null);
  const cueRef = useRef(null);
  const bodiesRef = useRef([]);
  const [frame, setFrame] = useState(0); // trigger re-render

  useEffect(() => {
    const world = new planck.World(planck.Vec2(0, 0));
    worldRef.current = world;

    const wall = (x, y, w, h) => {
      const body = world.createBody();
      body.createFixture(planck.Box(toMeters(w / 2), toMeters(h / 2)), { restitution: 1 });
      body.setPosition(planck.Vec2(toMeters(x), toMeters(y)));
    };

    // Walls
    wall(WIDTH / 2, 0, WIDTH, 40);
    wall(WIDTH / 2, HEIGHT, WIDTH, 40);
    wall(0, HEIGHT / 2, 40, HEIGHT);
    wall(WIDTH, HEIGHT / 2, 40, HEIGHT);

    // Static circles
    const staticCircles = Array.from({ length: 50 }).map(() => {
      const body = world.createBody();
      body.createFixture(planck.Circle(toMeters(8)), { restitution: 0.9 });
      body.setPosition(planck.Vec2(
        toMeters(Math.random() * WIDTH),
        toMeters(Math.random() * HEIGHT)
      ));
      return body;
    });

    // Cue
    const cue = world.createDynamicBody();
    cue.createFixture(planck.Circle(toMeters(12)), { restitution: 1, density: 1 });
    cue.setPosition(planck.Vec2(toMeters(100), toMeters(HEIGHT / 2)));
    cue.setLinearVelocity(planck.Vec2(10, 0));
    cueRef.current = cue;

    bodiesRef.current = [...staticCircles, cue];

    let animationFrame;
    const loop = () => {
    world.step(1 / 60);
    animationFrame = requestAnimationFrame(loop);
    setFrame(Date.now()); // ✅ same state value unless enough time has passed
    };
    animationFrame = requestAnimationFrame(loop);

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Stage options={{ backgroundColor: 0x202020, width: WIDTH, height: HEIGHT }}>
        {bodiesRef.current.map((body, i) => {
          const pos = body.getPosition();
          const radius = body.getFixtureList().getShape().m_radius;
          const isCue = cueRef.current === body;

          console.log({
            index: i,
            pos: pos,
            radius: radius,
            isCue
          });

          return (
            <Graphics
              key={i}
              draw={g => {
                g.clear();
                g.beginFill(isCue ? 0xff4444 : 0x56e3c4);
                g.drawCircle(toPixels(pos.x), toPixels(pos.y), toPixels(radius));
                g.endFill();
              }}
            />
          );
        })}
      </Stage>
    </div>
  );
};

export default Sandbox;