import { Button, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const MotionStack = motion(Stack);

const DropStack = ({ showInfo, children, setShowInfo}) => {

  return (
      <AnimatePresence> 
        {showInfo && (
          <MotionStack
            key="drop"
            justifyContent={'center'} 
            alignItems={'center'}
            sx={{
              position: 'absolute',
              width: '100%',
              bgcolor: '#000000d6',
              zIndex: 1000000,
              height: '100dvh',
              overflow: 'hidden'
            }}
            initial={{ height: '0%', opacity: 0 }}
            animate={{ height: '100%', opacity: 1 }}
            exit={{ height: '0%', opacity: 0}}
            transition={{ duration: 2 }}
          >
            {children}
            <Button onClick={() => setShowInfo(false)}>Close</Button>
          </MotionStack>
        )}
      </AnimatePresence>
  );
};

export default DropStack;
