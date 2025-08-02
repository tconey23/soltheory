import { useEffect, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionStack = motion(Stack)

const Error = () => {
    const [seconds, setSeconds] = useState(10)
    const loc = useLocation()
    const navTo = useNavigate()

    useEffect(() => {
      if(seconds >=1){
        setTimeout(() => {
          setSeconds(prev => prev-1)
        }, 1000);
      } else {
        navTo('/home')
      }
    }, [seconds])

  return (
    <Stack direction={'column'} width={'100%'} height={'100%'} sx={{bgcolor: '#f4f6f8',}} justifyContent={'center'}>
      <Typography fontFamily={'fredoka regular'} sx={{bgcolor: '#f4f6f8',}}>Whoops!</Typography>
      <Typography fontFamily={'fredoka regular'} sx={{bgcolor: '#f4f6f8',}}>This page doesn't exist</Typography>
      
      <MotionStack
        justifyContent={'center'}
        alignItems={'center'}
        width={'100%'}
        height={'100%'}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 2, delay: 1}}
      >
      <motion.img
        width="50%"  
        height='auto'
        src='/soltheorygrayscale.png'
        />
      <Typography fontFamily={'fredoka regular'} fontSize={20} sx={{bgcolor: '#f4f6f8',}}>Don't worry, this happens sometimes.</Typography>
      <Typography fontFamily={'fredoka regular'} fontSize={20} sx={{bgcolor: '#f4f6f8',}}>{`Redirecting in ${seconds}`}</Typography>
      <Stack>
        <Button onClick={() => navTo('/home')}>Home</Button>
      </Stack>
      </MotionStack>
    </Stack>
  );
};

export default Error;