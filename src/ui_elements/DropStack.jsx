import { Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const MotionStack = motion(Stack);

const DropStack = ({ showInfo, children}) => {
    const [showContent, setShowContent] = useState(false)

  return (
    <Stack sx={{ width: '100%', bgcolor: '#000000d6', zIndex: 100000, overflow: 'hidden'}}>
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
              zIndex: 100000
            }}
            initial={{ height: '0%', opacity: 0 }}
            animate={{ height: '77%', opacity: 1 }}
            exit={{ height: '0%', opacity: 0}}
            transition={{ duration: 2 }}
          >
            {children}
          </MotionStack>
        )}
      </AnimatePresence>
    </Stack>
  );
};

export default DropStack;
