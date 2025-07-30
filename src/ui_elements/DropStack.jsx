import { Button, Stack, InputLabel, Checkbox } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const MotionStack = motion(Stack);

const DropStack = ({ showInfo, children, setShowInfo, top, storageKey}) => {
  const [dontShowInfo, setDontShowInfo] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) setDontShowInfo(JSON.parse(stored));
  }, []);

  useEffect(() => {
    setShowInfo(!dontShowInfo);
  }, [dontShowInfo]);

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
              overflow: 'hidden',
              top: `${top}px`
            }}
            initial={{ height: '0%', opacity: 0 }}
            animate={{ height: '78dvh', opacity: 1 }}
            exit={{ height: '0%', opacity: 0}}
            transition={{ duration: 2 }}
          >
            {children}
            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} bgcolor={'white'} width={'100%'}>
                    <InputLabel>Don't show this again</InputLabel>
                    <Checkbox 
                    onChange={() => setDontShowInfo(prev => {
                      const updated = !prev;
                      localStorage.setItem(storageKey, JSON.stringify(updated));
                      return updated;
                    })} 
                    checked={dontShowInfo}
                  />
            <Button onClick={() => setShowInfo(false)}>Close</Button>
                  </Stack>
          </MotionStack>
        )}
      </AnimatePresence>
  );
};

export default DropStack;
