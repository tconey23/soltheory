import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionStack = motion(Stack)

const Error = () => {
    const loc = useLocation()
  return (
    <Stack direction={'column'} width={'100%'} height={'100%'} sx={{bgcolor: '#f4f6f8',}}>
      <Typography fontFamily={'fredoka regular'} sx={{bgcolor: '#f4f6f8',}}>Whoops!</Typography>
      <Typography fontFamily={'fredoka regular'} sx={{bgcolor: '#f4f6f8',}}>This page doesn't exist</Typography>
      
      <MotionStack
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 2, delay: 1}}
      >
      <motion.img  
        src='/soltheorygrayscale.png'
        />
      <Typography fontFamily={'fredoka regular'} fontSize={20} sx={{bgcolor: '#f4f6f8',}}>Don't worry, this happens sometimes.</Typography>
      </MotionStack>
    </Stack>
  );
};

export default Error;