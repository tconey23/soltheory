import { useState, useEffect } from "react"
import { CuboidCollider, Debug, Physics, RigidBody } from "@react-three/rapier"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Lightformer, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import LightWeightCamControl from "./LightWeightCamControl"
import { Text } from "@react-three/drei"
import { EffectComposer } from "@react-three/postprocessing"
import { Bloom } from "@react-three/postprocessing"
import { Edges } from "@react-three/drei"
import * as THREE from 'three'
import { useMemo } from 'react'
import { useCursor } from '@react-three/drei'

const degrees = (d) => d * (Math.PI / 180)

const Stage = ({props}) => {

    useEffect(() => {
        if(props.stage1[0] && props.stage1[0][1]){
            console.log(props.stage1[0][1])
        }
    }, [props])

    console.log(props.stage1[0])

    

    return (
        <group position={[0,0,0]}>

            <group position={[0,0,25]}>
                {props.stage1[0] && props.stage1[0][1] && props.stage1[0][1]}
                <RigidBody type='fixed'>
                    <mesh>
                        <boxGeometry args={[5,0.1,4]}/>
                        <meshStandardMaterial color={'yellow'}/>
                    </mesh>
                </RigidBody> 
            </group>

        </group>
    )


}


const Prompt = ({promptText, pos, index, props}) => {
    const [font] = useState("/fonts/Fredoka_Regular.json")
    const [toggleHover, setToggleHover] = useState(false)
    useCursor(toggleHover, /*'pointer', 'auto', document.body*/)
    const [selected, setSelected] = useState(false)
    const [row, setRow] = useState()

    useEffect(() => {
        switch(props.currStage){
            case 'stage1': setRow('row1')
            break;
            case 'stage2': setRow('row2')
            break;
            case 'stage3': setRow('row3')
            break;
        }
    }, [])

    useFrame(() => {

    })
    
    // useEffect(() => {
    //     if(row && props[props.currStage].length > 0){
    //         console.log(props[props.currStage])
    //     }
    // }, [row, props[props.currStage]])

    const [opts, setOpts] = useState({
        font: "Philosopher",
        fontSize: 12,
        color: "black",
        maxWidth: 300,
        lineHeight: 1,
        letterSpacing: 0,
        textAlign: "justify",
        materialType: "MeshStandardMaterial",
      });

      const handleSelection = (obj, index) => {
        
        
      }

    return (
      <group
        key={index}
        rotation={[degrees(0), degrees(0), degrees(0)]}
        position={pos}
      >
        <mesh castShadow receiveShadow>
            <RigidBody
                userData={promptText}
                type="dynamic"
                colliders={false}
                enabledRotations={[false, false, false]}
            >
        <group rotation={[degrees(0), degrees(90), degrees(0)]} position={[0.8,1,0]}>
        <Text
            // font={font}
            size={1}
            text={'This is the text of the prompt'}
            anchorX="center"
            anchorY="top"
            maxWidth={2}
            textAlign="center"
            whiteSpace="normal"
            overflowWrap="normal"
            fontSize={0.4}
            >
            <meshStandardMaterial
              attach="material"
              color={opts.color}
              transparent
              opacity={1}
            />
          </Text>
          <mesh
            castShadow 
            receiveShadow
            position={[0, -1, -1]}
            onPointerOver={() => setToggleHover(true)}
            onPointerOut={() => setToggleHover(false)}
            onClick={(e) => handleSelection(e, index)}
          >
          <boxGeometry args={[3, 2.5, 1]} />
          <meshBasicMaterial
            castShadow 
            receiveShadow
            transparent
            opacity={0} // Fully invisible
            depthWrite={false} // Prevents z-buffer issues
          />
        </mesh>
        </group>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[1, 2.5, 3]} />
                <meshStandardMaterial
                 castShadow 
                 receiveShadow
                 transparent 
                 opacity={0.4} 
                 color={selected ? 'purple' : 'cyan'}
                 emissive={selected ? 'purple' : 'cyan'}
                 emissiveIntensity={2}
                />
            </mesh>

                <CuboidCollider args={[1,1.3,1.3]} position={[0,0,0]}/>
            </RigidBody>
        </mesh>
      </group>
    )
}

const Column = ({pos, prompts, setSelections, props, stageState}) => {
console.log(props)
    return (
        <group position={pos}> 
            {prompts}
        </group>
    )
}

const Scene = (props) => {

    useEffect(() => {
        // console.clear()
        const triggerCondition = 
            props.prompts.row1.prompts.length > 0 && 
            props.prompts.row2.prompts.length > 0 && 
            props.prompts.row3.prompts.length > 0 && 
            props.stage1.length < 1 &&
            props.stage2.length < 1 &&
            props.stage3.length < 1;

        if(triggerCondition){
            props.setStage1(prev => ([
                ...prev,
                props.prompts.row1.prompts.map((p, i) => (       
                    <Prompt props={props} pos={[0, 4.9 * i, 0]} promptText={`Prompt # ${i}`} index={i} />
                ))
            ]))
            
            props.setStage2(prev => ([
                ...prev,
                props.prompts.row2.prompts.map((p, i) => (       
                    <Prompt props={props} pos={[0, 4.9 * i, 0]} promptText={`Prompt # ${i}`} index={i}/>
                ))
            ]))

            props.setStage3(prev => ([
                ...prev,
                props.prompts.row3.prompts.map((p, i) => (       
                    <Prompt props={props} pos={[0, 4.9 * i, 0]} promptText={`Prompt # ${i}`} index={i}/>
                ))
            ]))
            
        }
    
    }, [props])

    return (
        <group>
            <RigidBody type='fixed' colliders='cuboid'>
                <mesh position={[0,0,0]}>
                    <boxGeometry args={[20,0.1,20]}/>
                    <meshStandardMaterial transparent opacity={1}/>
                </mesh>
            </RigidBody>

            <Column pos={[0,7,3.5]} prompts={props.stage1[0]} props={props}/>
            <Column pos={[0,7,0]} prompts={props.stage2[0]} props={props}/>
            <Column pos={[0,7,-3.5]} prompts={props.stage3[0]} props={props}/>
            
            <Stage pos={[0,7,3.5]} props={props}/>
            <Stage pos={[0,7,0]}  props={props}/>
            <Stage pos={[0,7,-3.5]} props={props}/>

            <EffectComposer >
                <Bloom 
                    intensity={0.6}
                    luminanceThreshold={0.1}
                    luminanceSmoothing={0.9}
                />
            </EffectComposer>
        </group>
    )
}


const ThreeDTwentyOne = () => {
    
    const [prompts, setPrompts] = useState({
        stage1: [],
        stage2: [],
        stage3: []
    })
    const [stage1, setStage1] = useState([])
    const [stage2, setStage2] = useState([])
    const [stage3, setStage3] = useState([])
    const [currStage, setCurrStage] = useState('stage1')

    useEffect(() => {
        // console.log(prompts)
    }, [prompts])


    useEffect(() => {

        let array1 = []
        let array2 = []
        let array3 = []

        if(prompts.row1 || prompts.row2 || prompts.row3){
            return
        }

        for(let i = 0; i < 21; i ++){
            if(i < 7){
                array1.push(i)
                setPrompts(prev => ({
                    ...prev,
                    ['row1']: {
                        prompts: array1
                    }
                }))
            }
            if(i >= 7 && i < 14){
                array2.push(i)
                setPrompts(prev => ({
                    ...prev,
                    ['row2']: {
                        prompts: array2
                    }
                }))
            }

            if(i >= 14){
                array3.push(i)
                setPrompts(prev => ({
                    ...prev,
                    ['row3']: {
                        prompts: array3
                    }
                }))
            }
        }
    }, [])

        
    
    return (
        <div style={{background: 'black', height: '100%', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
        <Canvas>
            <OrbitControls enableZoom={true} enablePan={true}/>
            <ambientLight intensity={0.5} />
            <directionalLight intensity={1} position={[5, 10, 5]} castShadow />
            <PerspectiveCamera makeDefault position={[0, 10, 10]}/>
            <LightWeightCamControl key={'camControl'}/>

            <Physics gravity={[0, -9.81, 0]}>
                {/* <Debug /> */}

                {prompts.row1 && prompts.row2 && prompts.row3 &&
                <Scene 
                    prompts={prompts} 
                    stage1={stage1}
                    stage2={stage2}
                    stage3={stage3}
                    setStage1={setStage1}
                    setStage2={setStage2}
                    setStage3={setStage3}
                    currStage={currStage}
                    setCurrStage={setCurrStage}
                />
                }
            </Physics>

        </Canvas>
        </div>
    )
}

export default ThreeDTwentyOne