import React, {useState} from 'react'
import { Joystick } from 'react-joystick-component'
import { useGlobalContext } from '../business/GlobalContext'


const JoystickWrapper = ({ move, stop }) => {

  const {isMobile, showJoystick} = useGlobalContext()


  return (
    <div
      style={{
        position: 'absolute',
        bottom: isMobile ? 150 : 100,
        left: isMobile ? 50 : 100,
        zIndex: 16579833,
        pointerEvents: 'auto',
      }}
    >
      {showJoystick && 
      <Joystick
        size={isMobile ? 80 : 100}
        baseColor="rgba(135,206,235,0.3)"  // skyblue translucent
        stickColor="skyblue"
        throttle={100}
        move={(e) => {
          if (e && e.x !== null && e.y !== null) {
            const angle = Math.atan2(e.y, e.x) - Math.PI / 2 // 🧭 Adjust so 0 = forward
            const force = Math.sqrt(e.x ** 2 + e.y ** 2)
            move({ angle, force })
          }
        }}
        stop={stop}
      />}
    </div>
  )
}

export default JoystickWrapper
