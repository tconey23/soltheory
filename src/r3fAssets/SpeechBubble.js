import React, {useState, useEffect} from "react"
import { Stack, typography } from "@mui/system"
import { Typography } from "@mui/material"
import { Html, Billboard } from "@react-three/drei"

const SpeechBubble = ({setToggleOptions}) => {

    const [dynamicPos, setDynamicPos] = useState(
        {
            0:{height: 65, height2: -16},
            1:{height: 90, height2: -40},
            2:{height: 90, height2: -40},
            3:{height: 110, height2: -60},
            4:{height: 90, height2: -40}
        })
 
    const [messages, setMessages] = useState([
        'Welcome to SOLTheory®!',
        'For the classic experience, click any of the links above.',
        'Or you can follow me to discover the inner world...',
        'Controls: Movement - WASD, Sprint - LShift, or use the joystick below',
        ''
    ])
    const [index, setIndex] = useState(0)
    const [currentMessage, setCurrentMessage] = useState()

    useEffect(() => {
        if(index == messages.length -1){
            setToggleOptions(false)
        }
    }, [index])

    useEffect(() =>{
        let index = 0
        const currIndex = messages.findIndex((i) => i === currentMessage)
            setIndex(currIndex)

        if(!currentMessage){
            setCurrentMessage(messages[0])
        }

        const messageInterval = setInterval(() =>{

            setCurrentMessage(messages[currIndex + 1])

        }, [4000])

        return () => clearInterval(messageInterval)


    }, [currentMessage])


    return (
        <mesh>
        <Billboard>
            <Html
                scale={0.75}
                transform
                position={[-1, 1, 0]} // Relative to mesh center
                center
                style={{background: '#ffffff'}}
                >
        <Stack position={'absolute'} top={index > -1 ? dynamicPos[index].height2 : 0} sx={{background: '#ffffff00'}}>
            <Stack
             sx={{background: '#ffffff00'}}
             top={index > 0 ? dynamicPos[index].height : 65} 
             left={15} 
             position={'relative'} 
             width={170} 
             //  backgroundColor={'green'}
             >
                <Typography>{currentMessage}</Typography>
            </Stack>
            <svg
            width="200"
            
            height="150"
            viewBox="0 0 200 150"
            xmlns="http://www.w3.org/2000/svg"
            >
                <rect
                    x="10"
                    y="10"
                    rx="20"
                    ry="20"
                    width="180"
                    height="100"
                    fill="white"
                    stroke="black"
                    stroke-width="3"
                    />

                <polygon
                    points="60,110 90,110 75,140"
                    fill="white"
                    stroke="black"
                    stroke-width="3"
                    />
            </svg>
        </Stack>
    </Html>
    </Billboard>
    </mesh>
    )
}

export default SpeechBubble