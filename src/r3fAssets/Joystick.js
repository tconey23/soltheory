import React from 'react'
import { Joystick } from 'react-joystick-component'


const JoystickWrapper = ({ move, stop }) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 100,
        left: 100,
        zIndex: 16579833,
        pointerEvents: 'auto',
      }}
    >
      <Joystick
        size={100}
        baseColor="rgba(135,206,235,0.3)"  // skyblue translucent
        stickColor="skyblue"
        throttle={100}
        move={(e) => {
          if (e && e.x !== null && e.y !== null) {
            const angle = Math.atan2(e.y, e.x) // radians
            const force = Math.sqrt(e.x ** 2 + e.y ** 2)
            move({ angle, force })
          }
        }}
        stop={stop}
      />
    </div>
  )
}

export default JoystickWrapper
