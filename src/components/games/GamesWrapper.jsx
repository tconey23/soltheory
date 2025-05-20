import { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Input, InputLabel, List, Menu, MenuItem, Select, Stack, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import useGlobalStore from '../../business/useGlobalStore';
import MotionStack from '../../ui_elements/MotionStack';
import TwentOneThingsButton from './TwentyOneThingsButton';
import { useNavigate } from 'react-router-dom';
import SixPicsButton from './SixPicsButton';
import { v4 as uuidv4 } from 'uuid';
import dayjs from "dayjs"
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)


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
    const navigate = useNavigate()
  
    const font = useGlobalStore((state) => state.font);
    const screen = useGlobalStore((state) => state.screen);
    const userMeta = useGlobalStore((state) => state.userMeta);
    const user = useGlobalStore((state) => state.user)
    const setToggleLogin = useGlobalStore((state) => state.setToggleLogin)
    const toggleLogin = useGlobalStore((state) => state.toggleLogin)
    const guestUser = useGlobalStore((state) => state.guestUser)
    const setGuestUser = useGlobalStore((state) => state.setGuestUser)

    const [selectedGame, setSelectedGame] = useState(null)
    const [gameObj, setGameObj] = useState()
    const [hasMounted, setHasMounted] = useState(false);

    const menuStyle = {
      boxShadow : '1px 1px 5px 5px #66339933', 
      marginY : 5, 
      borderRadius: 2
    }

      useEffect(() => {
          setTimeout(() => {
              setHasMounted(true);
          }, 2000); 
      }, []);
  
      const startGame = async (gameName, isLoggedIn) => { 
        let gameId;

        if (userMeta) {
          gameId = uuidv4(); // generate locally
        } else {
          // create a guest game row in Supabase and return the UUID
          let formatDate = dayjs(Date.now()).format('YYYY-MM-DD')
          let userId = uuidv4()
          
          const { data: guest, error: guesterror } = await supabase
            .from('users')
            .insert([{ user_name: `guest-${userId}`, primary_id: userId, email: `${userId}@example.com`}])
            .select('*');
            
            if(guesterror) {
              console.error(guesterror)
              return
            } else {

              console.log(guest?.[0])
              setGuestUser({id: userId})
            }

          const { data, error } = await supabase
            .from('twentyone_things_data')
            .insert({ game_name: 'TwentyOneThings', user_id: guest?.[0]?.primary_id})
            .select('id')
            .single();

          if (error) {
            console.error(error);
            return;
          }

          gameId = data.id;
        }

        const path = `/games/${gameName}/${gameId}`;
        navigate(path);
      };

  
    return (
      <Stack
        direction="column"
        width="90%"
        height="95%"
        alignItems="center"
        justifyContent="flex-start"
        bgcolor={'#ffffffbd'}
        borderRadius={5}
        overflow={'auto'}
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
          transition={{ duration: 0.5, delay: 1.5}}
        >
          <Stack
            sx={{
              width: '100%',
              marginTop: 20,
              borderRadius: 1,
            }}
          >
            <List
              value={selectedGame || ''}
              onChange={(e) => setSelectedGame(e.target.value)}
            >
              <MenuItem sx={menuStyle} value="21things" onClick={() => startGame(`21things`)}>
                <TwentOneThingsButton />
              </MenuItem>

              <MenuItem sx={menuStyle} value="6pics"  onClick={() => startGame(`6pics`)}>
                <SixPicsButton />
              </MenuItem>

            </List>
          </Stack>
        </MotionStack>
      </Stack>
    );
};

export default GamesWrapper;