import { Box, Button, Stack, Typography } from '@mui/material'
import {useState, useEffect} from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const AvettDemo = ({demo}) => {

   const MotionStack = motion(Stack)
   const navTo = useNavigate()

  return (
    <Stack>
        <MotionStack
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0 }}
        >
            <Typography fontFamily={'fredoka regular'} fontSize={35}>
                6 Pics
            </Typography>
        </MotionStack>
        <MotionStack 
            marginTop={2}
            alignItems={'center'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
        >
            <Typography fontFamily={'fredoka regular'} fontSize={30}>
                Avett Brothers
            </Typography>
            <motion.img
                width='60%'
                height='auto'
                src='/AvettBros_NoAlpha.png'
            />
        </MotionStack>
        <MotionStack 
            marginTop={5} 
            alignItems={'center'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 2 }}
        >
            <Typography fontFamily={'fredoka regular'} fontSize={30}>
                Welcome to 6 Pics!
            </Typography>

            <Typography marginTop={-1} fontFamily={'fredoka regular'} fontSize={14}>
                A SOL Theory game
            </Typography>

            <Typography sx={{marginTop: 2}} fontFamily={'fredoka regular'} fontSize={25}>
                Think you know the Avett Brothers?
            </Typography>

            <MotionStack 
                width={'98%'} 
                height={'100%'} 
                justifyContent={'space-evenly'} 
                alignItems={'center'} 
                marginTop={'10px'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 3 }}
            >
                <Typography fontFamily={'fredoka regular'} fontSize={16}>
                    In this game, you’ll see six images clips, each one slowly revealing an Avett-inspired image across three stages.
                </Typography>

                <Stack height={'100%'} width={'92%'} marginTop={'10px'} alignItems={'center'}>
                    <Typography marginTop={2} textAlign={'left'} fontFamily={'fredoka regular'} fontSize={18}>
                        •	Tap play to reveal the first part of each image.
                    </Typography>

                    <Typography marginTop={2} textAlign={'left'} fontFamily={'fredoka regular'} fontSize={18}>
                        •	Guess early to earn max points — or reveal more if you’re unsure.
                    </Typography>

                    <Typography marginTop={2} textAlign={'left'} fontFamily={'fredoka regular'} fontSize={18}>
                        •	But beware: every extra stage costs you points.
                    </Typography>
                </Stack>

                <Typography marginTop={2} textAlign={'center'} fontFamily={'fredoka regular'} fontSize={20}>
                    Can you guess each song title before the final frame?
                </Typography>
            </MotionStack>
        </MotionStack>
        <MotionStack
            marginTop={2}
            width={'98%'}
            alignItems={'center'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 3 }}
        >
            <Button onClick={() => navTo('/games/6pics/avett')}>Play</Button>
        </MotionStack>
    </Stack>
  )
}

export default AvettDemo
