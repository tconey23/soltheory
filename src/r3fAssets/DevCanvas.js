import { Canvas, useFrame } from '@react-three/fiber'
import { Billboard, Html, OrbitControls, TransformControls } from '@react-three/drei'
import { useState, useEffect, useRef} from 'react'
import { Physics, TrimeshCollider } from '@react-three/rapier'
import { PerspectiveCamera } from '@react-three/drei'
import React from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormLabel, List, ListItem, Radio, Slider, useMediaQuery } from '@mui/material'
import { useGlobalContext } from '../business/GlobalContext'
import {Stack} from '@mui/material'
import GroundPlane from './GroundPlane'
import { useHelper } from '@react-three/drei'
import { Debug } from '@react-three/rapier'
import { DirectionalLightHelper } from 'three'
import { SketchPicker } from 'react-color'
import { Box } from '@mui/system'
import { MeshPortalMaterial } from '@react-three/drei'


const CameraControl = ({ props }) => {
    const cameraRef = useRef()
    const { camera, set } = useThree()

    
    
    useFrame(() => {
        if (cameraRef.current) {
          const {posx, posy, posz} = props.camProps.pos
          const { x, y, z } = props.camProps.lookAt
          cameraRef.current.lookAt(new THREE.Vector3(x, y, z))
          cameraRef.current.position.set(posx, posy,posz)
        }
      }, [props.camProps.lookAt.x, props.camProps.lookAt.y, props.camProps.lookAt.z])
      
  
    return (
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={75}
        near={0.1}
        far={1000}
      />
    )
  }

const OptionPanel = ({ props }) => {
  
    return (
      <Stack backgroundColor={'white'} width={300} height={500} alignItems={'center'} sx={{overflow: 'scroll'}}
      onMouseOver={(e) => {
        e.stopPropagation();
        props.setAllowPan(false);
    }}
    onMouseOut={(e) => {
        e.stopPropagation();
        props.setAllowPan(true);
    }}
      >
        <Stack width={290} justifyContent={'center'} alignItems={'center'}>
          <List sx={{ width: '100%' }}>
            <ListItem sx={{ border: '1px solid black', width: '100%', display: 'flex', flexDirection: 'column'}}>
                <Checkbox checked={props.showLightHelper} onChange={(e) => props.setShowLightHelper(e.target.checked)} />
            </ListItem>
            <ListItem sx={{ border: '1px solid black', width: '100%', display: 'flex', flexDirection: 'column'}}>
                <FormLabel>Light Height</FormLabel>
                <Slider
                    value={props.height}
                    valueLabelDisplay={true}
                    onChange={(e) => props.setHeight(e.target.value)}
                />
            </ListItem>
            <ListItem sx={{ border: '1px solid black', width: '100%', display: 'flex', flexDirection: 'column'}}>
                <FormLabel>Light Spread</FormLabel>
                <Slider
                    value={props.xSpread}
                    valueLabelDisplay={true}
                    onChange={(e) => props.setXSpread(e.target.value)}
                />
            </ListItem>
            <ListItem sx={{ border: '1px solid black', width: '100%', display: 'flex', flexDirection: 'column'}}>
                <FormLabel>Light Intensity</FormLabel>
                <Slider
                    value={props.lightInt}
                    valueLabelDisplay={true}
                    onChange={(e) => props.setLightInt(e.target.value)}
                />
            </ListItem>
            <Accordion>
                <AccordionSummary>
                        <FormLabel>Light Colors</FormLabel>
                </AccordionSummary>
                <AccordionDetails>
                    <ListItem sx={{ border: '1px solid black', width: '100%', display: 'flex', flexDirection: 'column'}}>
                        <Stack>
                            <Box>
                            <FormLabel>Light 1</FormLabel>
                            <SketchPicker
                                    color={props.lightColor.light1}
                                    onChangeComplete={(c) => props.setLightColor(prev=> ({
                                        ...prev,
                                        light1 : c.hex
                                    }))}
                                    />
                            </Box>
                            <Box>
                            <FormLabel>Light 2</FormLabel>
                            <SketchPicker
                                    color={props.lightColor.light2}
                                    onChangeComplete={(c) => props.setLightColor(prev=> ({
                                        ...prev,
                                        light2 : c.hex
                                    }))}
                                    />
                            </Box>
                        </Stack>
                    </ListItem>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary>
                        <FormLabel>Camera Controls</FormLabel>
                </AccordionSummary>
                <AccordionDetails>
                    <ListItem sx={{ border: '1px solid black', width: '100%', display: 'flex', flexDirection: 'column'}}>
                        <Stack>
                            <FormLabel>X Position</FormLabel>
                            <Slider
                                step={0.01}
                                min={-100}
                                max={100}
                                value={props.camProps.pos.posx}
                                valueLabelDisplay={true}
                                onChange={(e) => props.setCamProps(prev => ({
                                    ...prev,
                                    pos: {
                                      ...prev.pos,
                                      posx: e.target.value
                                    }
                                  }))}
                            />
                            <FormLabel>Y Position</FormLabel>
                            <Slider
                                step={0.01}
                                min={-100}
                                max={100}
                                value={props.camProps.pos.posy}
                                valueLabelDisplay={true}
                                onChange={(e) => props.setCamProps(prev => ({
                                    ...prev,
                                    pos: {
                                      ...prev.pos,
                                      posy: e.target.value
                                    }
                                  }))}
                            />
                            <FormLabel>Z Position</FormLabel>
                            <Slider
                                step={0.01}
                                min={-100}
                                max={100}
                                value={props.camProps.pos.posz}
                                valueLabelDisplay={true}
                                onChange={(e) => props.setCamProps(prev => ({
                                    ...prev,
                                    pos: {
                                      ...prev.pos,
                                      posz: e.target.value
                                    }
                                  }))}
                            />
                        </Stack>
                        <Stack>
                            <FormLabel>X Look At</FormLabel>
                            <Slider
                                step={0.01}
                                value={props.camProps.lookAt.x}
                                valueLabelDisplay={true}
                                onChange={(e) => props.setCamProps(prev => ({
                                    ...prev,
                                    lookAt: {
                                      ...prev.lookAt,
                                      x: e.target.value
                                    }
                                  }))}
                            />
                            <FormLabel>Y Look At</FormLabel>
                            <Slider
                                step={0.01}
                                value={props.camProps.lookAt.y}
                                valueLabelDisplay={true}
                                onChange={(e) => props.setCamProps(prev => ({
                                    ...prev,
                                    lookAt: {
                                      ...prev.lookAt,
                                      y: e.target.value
                                    }
                                  }))}
                            />
                            <FormLabel>Z Look At</FormLabel>
                            <Slider
                                step={0.01}
                                value={props.camProps.lookAt.z}
                                valueLabelDisplay={true}
                                onChange={(e) => props.setCamProps(prev => ({
                                    ...prev,
                                    lookAt: {
                                      ...prev.lookAt,
                                      z: e.target.value
                                    }
                                  }))}
                            />
                        </Stack>
                    </ListItem>
                </AccordionDetails>
            </Accordion>
          </List>
        </Stack>
      </Stack>
    )
  }

const OrbitingControl = ({props}) => {

    const orbit = useRef()

    return <OrbitControls ref={orbit} enableZoom={true} enablePan={props.allowPan}/>
}

const Lighting = ({props}) => {

    const lightRef = useRef()
    const lightRef2 = useRef()


    useHelper(props.showLightHelper && lightRef, DirectionalLightHelper, 5, props.lightColor.light1)
    useHelper(props.showLightHelper && lightRef2, DirectionalLightHelper,5, props.lightColor.light2)

    return (
        <>
            <directionalLight color={props.lightColor.light1} ref={lightRef} position={[props.xSpread,props.height,0]} intensity={props.lightInt} />
            <directionalLight color={props.lightColor.light2} ref={lightRef2} position={[-props.xSpread,props.height,0]} intensity={props.lightInt}/>
        </>
    )
}

const DevCanvas = () => {

    const billboardRef = useRef()

    const [height, setHeight] = useState(75)
    const [xSpread, setXSpread] = useState(64)
    const [showOptions, setShowOptions] = useState()
    const [optPanPos, setOptPanPos] = useState([0,10,0])
    const [allowPan, setAllowPan] = useState(true)
    const [showLightHelper, setShowLightHelper] = useState(false)
    const [lightInt, setLightInt] = useState(13)
    const [showGizmo, setShowGizmo] = useState(false)
    const [camProps, setCamProps] = useState({
        pos: {posx:-1.34, posy:53.05, posz:-88.36},
        lookAt: {x:0, y:0, z:0}
    })
    const [lightColor, setLightColor] = useState({
        light1: '#D860F4',
        light2: '#B1D7F2'
    })

    const props = {
        height, setHeight,
        xSpread, setXSpread,
        optPanPos, setOptPanPos,
        showOptions, setShowOptions,
        allowPan, setAllowPan,
        lightColor, setLightColor,
        lightInt, setLightInt,
        showLightHelper, setShowLightHelper,
        camProps, setCamProps,
    }

    const handleShowOptions = (t) => {

        if(t.target.tagName === "CANVAS"){
            setShowOptions(false)
        }
    }

  return (
    <>
        <Canvas userdata='dev_canvas' gl={{ physicallyCorrectLights: true }} shadows style={{height: '100%', background: 'black'}} onClick={(e) => handleShowOptions(e)}>
          
          <group>
          {allowPan && <OrbitingControl props={props}/>}

          <CameraControl props={props}/>

          <Billboard position={[props.camProps.pos.posx +50, props.camProps.pos.posy +10, 0]}>
            <Html>
                <Button userdata='dev_canvas_button' onClick={() => setShowOptions(prev => !prev)}>Options</Button>
            </Html>
          </Billboard>

         
            <Billboard ref={billboardRef} position={[0,25,0]} >
                <Html>
                    {showOptions && <OptionPanel props={props}/>}
                </Html>
            </Billboard>
        
        <group>
          <Lighting props={props} />
        </group>
        </group>

          <Physics gravity={[0, -20, 0]}>
                {/* <Debug/> */}

                <group position={[0,0,0]} >
                    <GroundPlane />
                </group>

                <mesh position={[0, 10, 0]}>
                    <planeGeometry args={[25,25]} />
                    <MeshPortalMaterial>
                        <group scale={[0.25, 0.25, 0.25]} position={[0, 0, 0]}>
                            <directionalLight intensity={10} />
                            <directionalLight />
                            <group position={[0,0,0]} >
                                
                            </group>
                        </group>
                    </MeshPortalMaterial>
                </mesh>
          </Physics>  
          </Canvas>
    </>
  );
};

export default DevCanvas;