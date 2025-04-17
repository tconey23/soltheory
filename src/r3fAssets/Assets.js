import { useState, useEffect, useRef} from 'react'
import React from 'react'
import { useGlobalContext } from '../business/GlobalContext'
import RobotModel from './RobotModel'
import ChaseCamera from './ChaseCamera'
import { create } from 'zustand'
import { PointerLockControls } from '@react-three/drei'

const useUIStore = create((set) => ({
  isLoading: true,
  showRobot: false,
  turnAround: false,
  showEnvironment: false,
  showPlatforms: false,
  showGround: false,

  setShowGround: (val) => set({ showGround: val }),
  setIsLoading: (val) => set({ isLoading: val }),
  setShowRobot: (val) => set({ showRobot: val }),
  setTurnAround: (val) => set({ turnAround: val }),
  setShowEnvironment: (val) => set({ showEnvironment: val }),
  setShowPlatforms: (val) => set({ showPlatforms: val }),
}))

const Assets = ({robot, camera, joystickData}) => {

    const {isMobile} = useGlobalContext()

      const robotRef = useRef()
      const controlsRef = useRef()

    const {
        turnAround,
        setTurnAround,
      } = useUIStore()


      return (
        <>

            {!isMobile && <PointerLockControls />}

            {robot && 
                <RobotModel
                  bodyRef={robotRef}
                  joystick={joystickData}
                  setTurnAround={setTurnAround}
                  turnAround={turnAround}
                  controlsRef={controlsRef}
                />}

            {camera && 
                <ChaseCamera 
                    turnAround={turnAround}
                    setTurnAround={setTurnAround}
                    targetRef={robotRef}
                    setControlsRef={(ref) => {
                    controlsRef.current = ref.current
                    }}
                />
            }
        </>
      )
}

export default Assets
