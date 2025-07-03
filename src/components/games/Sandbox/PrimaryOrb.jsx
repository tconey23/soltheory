import React, { useRef, useEffect, useCallback } from "react";
import Matter from 'matter-js'

const PrimaryOrb = () => {

const cue = Matter.Bodies.circle(x - 500, y, 20, {
      restitution: 0.5,
      density: 2,
    });
    cue.label = "cue";

  return (
    <>
        {cue}
    </>
  )
}

export default PrimaryOrb
