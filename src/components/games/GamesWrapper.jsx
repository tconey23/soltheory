import { useEffect, useState } from 'react';
import { Avatar, Button, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import useGlobalStore from '../../business/useGlobalStore';
import MotionStack from '../../ui_elements/MotionStack';
import TwentOneThingsButton from './TwentyOneThingsButton';
import { useNavigate } from 'react-router-dom';
import SixPicsButton from './SixPicsButton';

const HeaderImage = () => {

    const [imgIndex, setImgIndex] = useState(0)
    const [headerImg, setHeaderImg] = useState(<img src={'/joystick.gif'} style={{height: '100%'}}/>)

    const headerImages = [
        <img src={'/joystick.gif'} style={{height: '100%'}}/>,
        <img src={'/puzzle.gif'} style={{height: '100%'}}/>, 
        <img src={'/game-controller.gif'} style={{height: '100%'}}/>
    ]

  useEffect(() => {
    setHeaderImg(headerImages[imgIndex])
  }, [imgIndex])

  useEffect(() => {
    setTimeout(() => {
        if(imgIndex < 2){
            setImgIndex(prev => prev +1)
        } else {
            setImgIndex(0)
        }
    }, 2000);
  }, [headerImg])

  return headerImg

}

const GamesWrapper = () => {

    const MotionText = motion(Typography);
    const MotionAvatar = motion(Avatar);
    const navTo = useNavigate()
  
    const font = useGlobalStore((state) => state.font);
    const screen = useGlobalStore((state) => state.screen);
    const userMeta = useGlobalStore((state) => state.userMeta);
    const user = useGlobalStore((state) => state.user)
  

    const [selectedGame, setSelectedGame] = useState(null)
    const [gameObj, setGameObj] = useState()
    const [hasMounted, setHasMounted] = useState(false);

      useEffect(() => {
          setTimeout(() => {
              setHasMounted(true);
          }, 2000);
      }, []);
  
  

  
    return (
      <Stack
        direction="column"
        width="100%"
        height="100%"
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
          SOL Games
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
          transition={{ duration: 0.5 }}
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
              value={selectedGame || ''}
              onChange={(e) => setSelectedGame(e.target.value)}
            >
              <MenuItem value="21things" onClick={() => navTo(`/games/21things`)}>
                <TwentOneThingsButton />
              </MenuItem>

              <MenuItem value="6pics"  onClick={() => navTo(`/games/6pics`)}>
                <SixPicsButton />
              </MenuItem>

            </Select>
          </Stack>
        </MotionStack>
      </Stack>
    );
};

export default GamesWrapper;