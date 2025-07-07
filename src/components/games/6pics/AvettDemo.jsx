import { Box, Button, Stack, Typography } from '@mui/material'
import {useState, useEffect} from 'react'
import { motion } from 'framer-motion' 
import { useNavigate } from 'react-router-dom'
import useGlobalStore from '../../../business/useGlobalStore'

const AvettDemo = ({demo}) => {

   const MotionStack = motion(Stack)
   const navTo = useNavigate()
   const isDemo = useGlobalStore((state) => state.isDemo)
   const setIsDemo = useGlobalStore((state) => state.setIsDemo)

   useEffect(() => {
    if(isDemo){
        navTo('/games/6pics/avett')
    }
   }, [isDemo])

  return (
    <Stack height={'100%'}>

        <MotionStack
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0 }}
            height={'4%'}
        >
            <Typography fontFamily={'fredoka regular'} fontSize={30}>
                6 Pics
            </Typography>
        </MotionStack>

        <MotionStack 
            marginTop={2}
            alignItems={'center'}
            height={'20%'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
        >
            <Typography fontFamily={'fredoka regular'} fontSize={25}>
                Avett Brothers
            </Typography>
            <motion.img
                width='60%'
                height='auto'
                src='/AvettBros_NoAlpha.png'
            />
        </MotionStack>

        <MotionStack 
            marginTop={0} 
            alignItems={'center'}
            height={'50%'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
        >
            <Typography fontFamily={'fredoka regular'} fontSize={25}>
                Welcome to 6 Pics!
            </Typography>

            <Typography marginTop={-1} fontFamily={'fredoka regular'} fontSize={14}>
                A SOL Theory game
            </Typography>

            <Typography sx={{marginTop: 2}} fontFamily={'fredoka regular'} fontSize={25}>
                Think you know the Avett Brothers?
            </Typography>

            <MotionStack 
                width={'95%'} 
                height={'85%'} 
                justifyContent={'space-evenly'} 
                alignItems={'center'} 
                marginTop={'10px'}
                paddingY={1}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 1.1 }}
            >
                <Typography fontFamily={'fredoka regular'} fontSize={16}>
                    In this game, you’ll see six images clips, each one slowly revealing an Avett-inspired image across three stages.
                </Typography>

                <Stack height={'90%'} width={'92%'} marginTop={'10px'} alignItems={'flex-start'} overflow={'auto'}>
                    <Typography marginTop={2} textAlign={'left'} fontFamily={'fredoka regular'} fontSize={15}>
                        •	Tap play to reveal the first part of each image.
                    </Typography>

                    <Typography marginTop={2} textAlign={'left'} fontFamily={'fredoka regular'} fontSize={15}>
                        •	Guess early to earn max points — or reveal more if you’re unsure.
                    </Typography>

                    <Typography marginTop={2} textAlign={'left'} fontFamily={'fredoka regular'} fontSize={15}>
                        •	But beware: every extra stage costs you points.
                    </Typography>

                    <Typography marginTop={2} textAlign={'center'} fontFamily={'fredoka regular'} fontSize={17}>
                        Can you guess each song title before the final frame?
                    </Typography>
                </Stack>
            </MotionStack>
        <MotionStack
            marginTop={2}
            width={'98%'}
            height={'4%'}
            alignItems={'center'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1.5 }}
        >
            <Button onClick={() => setIsDemo(true)}>Play</Button>
        </MotionStack>
        </MotionStack>
    </Stack>
  )
}

export default AvettDemo
