import { useEffect, useState } from 'react';
import { Avatar, Button, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import useGlobalStore from '../../business/useGlobalStore';
import MotionStack from '../../ui_elements/MotionStack';
import { useNavigate } from 'react-router-dom';
import ChatBox from './ChatBox';

const HeaderImage = () => {

    const [imgIndex, setImgIndex] = useState(0)
    const [headerImg, setHeaderImg] = useState(<img src={'/teamwork.gif'} style={{height: '100%'}}/>)

  return headerImg

}

const SolMates = () => {
    const MotionText = motion(Typography);
    const MotionAvatar = motion(Avatar);
    const navTo = useNavigate()
  
    const font = useGlobalStore((state) => state.font);
    const screen = useGlobalStore((state) => state.screen);
    const userMeta = useGlobalStore((state) => state.userMeta);
    const user = useGlobalStore((state) => state.user)
  

    const [selectedOption, setSelectedOption] = useState('messages')
    const [accountObj, setAccountObj] = useState()
    const [hasMounted, setHasMounted] = useState(false);

      useEffect(() => {
          setTimeout(() => {
              setHasMounted(true);
          }, 2000);
      }, []);
  
  
      useEffect(() => {
        switch(selectedOption){
            case 'messages': setAccountObj(<ChatBox />);
            break;
            case 'solmates': setAccountObj();
            break;
        }
    }, [selectedOption])


  
    return (
      <Stack
        direction="column"
        width="100%"
        height="75%"
        alignItems="center"
        justifyContent="flex-start"

      >
        <MotionText
          paddingY={2}
          fontFamily="Fredoka Regular"
          fontSize={22}
          initial={hasMounted ? false : { y: -300, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          SOLMates
        </MotionText>

        <Stack marginBottom={7}>
            <MotionAvatar
            initial={hasMounted ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1, duration: 2 }}
            sx={{ border: '1px solid black', scale: 1.25 }}
            >
            <HeaderImage />
            </MotionAvatar>
        </Stack>
  
        <MotionStack
          key="account_select"
          width="85%"
          sx={{ height: '10%' }}
          alignItems="center"
          justifyContent="center"
          direction="column"
          paddingY={2}
          initial={hasMounted ? false : { opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, delay: 1.5}}
        >
          <Stack
            sx={{
              bgcolor: '#f4f6f8',
              height: 'fit-content',
              width: '100%',
              borderRadius: 1,
            }}
          >
 
            <Select
              value={selectedOption || ''}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <MenuItem value="messages">
                <Stack direction={'row'} justifyContent={'center'}>
                    <i style={{marginRight: 3, justifyItems: 'center'}} className="fi fi-rr-envelope"></i> Messages
                </Stack> 
              </MenuItem>

              <MenuItem value="solmates">
                <Stack direction={'row'} justifyContent={'center'}>
                    <i style={{marginRight: 3, justifyItems: 'center'}} className="fi fi-sr-users-alt"></i> SOLMates
                </Stack> 
              </MenuItem>

            </Select>
          </Stack>
        </MotionStack>
        <AnimatePresence mode="wait">
        {selectedOption && (
          <MotionStack
            key={selectedOption}
            width="85%"
            sx={{ height: 'fit-content', bgcolor: '#414770', marginY: 3, overflowY: 'auto'}}
            alignItems="center"
            justifyContent="center"
            direction="column"
            paddingY={2}
            borderRadius={1}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
          >
            {accountObj}
          </MotionStack>
        )}
      </AnimatePresence>
      </Stack>
    );
};

export default SolMates;