// Joystick.js
import { useEffect, useRef } from 'react'
import nipplejs from 'nipplejs'

const Joystick = ({ onMove, onEnd }) => {
  const joystickZone = useRef()

  useEffect(() => {
    const manager = nipplejs.create({
      zone: joystickZone.current,
      mode: 'semi',
      position: { left: '75px', bottom: '75px' },
      color: 'skyblue',
      size: 130
    })

    manager.on('move', (evt, data) => {
      const { angle, force } = data
      if (angle) {
        onMove({
          angle: angle.radian,
          force
        })
      }
    })

    manager.on('end', () => {
      onEnd()
    })

    return () => manager.destroy()
  }, [onMove, onEnd])

  return (
    <div
      ref={joystickZone}
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '150px',
        height: '150px',
        zIndex: 100
      }}
    />
  )
}

export default Joystick
