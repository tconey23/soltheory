import { useEffect, useRef, useState } from 'react'
import RobotGLB from './RobotGLB'
import useGlobalStore from '../../business/useGlobalStore'

const NPRobot = ({pos, rot}) => {
    const groupRef = useRef()

    return (
        <group ref={groupRef}
         position={pos} 
         rotation={rot}
         >    
            <mesh>
                <RobotGLB groupRef={groupRef} />
            </mesh>
        </group>
    )

}

export default NPRobot
