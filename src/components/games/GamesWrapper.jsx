import { useEffect, useState, lazy, suspense, Suspense } from 'react';
import { Avatar, Badge, Button, Input, InputLabel, List, Menu, MenuItem, Select, Stack, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import useGlobalStore from '../../business/useGlobalStore';
import MotionStack from '../../ui_elements/MotionStack';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import dayjs from "dayjs"
import customParseFormat from 'dayjs/plugin/customParseFormat'
import MyThreeSongsButton from './MyThreeSongsButton';
import FadeStack from '../../ui_elements/FadeStack';
dayjs.extend(customParseFormat)


// import TwentOneThingsButton from './TwentyOneThingsButton';
// import SixPicsButton from './SixPicsButton';
// import SandboxButton from './SandboxButton'

const TwentOneThingsButton = lazy(() => import('./TwentyOneThingsButton'))
const SixPicsButton = lazy(() => import('./SixPicsButton'))
const SandboxButton = lazy(() => import('./SandboxButton'))
const WavetunerButton = lazy(() => import('./WavetunerButton'))


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
      marginY : 1, 
      maxHeight: '100px',
      borderRadius: 2,
      bgcolor: 'white'
    }

      useEffect(() => {
          setTimeout(() => {
              setHasMounted(true);
          }, 2000); 
      }, []);
  
      const startGame = async (gameName, isLoggedIn) => { 
       
        if (gameName ===  'sandbox') {
          navigate('/games/sandbox')
          return
        }

        if (gameName ===  'wavetuner') {
          navigate('/games/wavetuner')
          return
        }
       
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
        height="90%"
        alignItems="center"
        justifyContent="flex-start"
        bgcolor={'#ffffffbd'}
        borderRadius={5}
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
  
        <Stack marginBottom={0}>
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
          sx={{ height: '100%' }}
          alignItems="center"
          justifyContent="flex-start"
          direction="column"
          paddingY={2}
          paddingX={2}
          marginBottom={3}
          initial={hasMounted ? false : { opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, delay: 1.5}}
          overflow={'auto'}
        >
          <Stack
            sx={{
              width: '100%',
              height: '100%',
              marginBottom: 1,
              paddingBottom: 1,
              borderRadius: 1,
              overflow: 'auto',
              justifyContent: 'flex-start'
            }}
          >
            <List
              sx={{paddingLeft: '10px', paddingRight: '10px', height: '70%', paddingBottom: '20px', marginBottom: '10px'}}
              value={selectedGame || ''}
              onChange={(e) => setSelectedGame(e.target.value)}
            >
              <Suspense
                fallback={
                  <FadeStack>
                    <Stack width={'100%'} height={'80%'} bgcolor={'black'} position={'absolute'} justifyContent={'center'}>
                      <Typography color={'white'}>Loading ...</Typography>
                    </Stack>
                  </FadeStack>
                }
              >
                <MenuItem sx={menuStyle} value="21things" onClick={() => startGame(`21things`)}>
                  <TwentOneThingsButton />
                </MenuItem>
              </Suspense>

              <Suspense
                fallback={
                  <FadeStack>
                    <Stack width={'100%'} height={'80%'} bgcolor={'black'} position={'absolute'} justifyContent={'center'}>
                      <Typography color={'white'}>Loading ...</Typography>
                    </Stack>
                  </FadeStack>
                }
              >
              <MenuItem sx={menuStyle} value="6pics"  onClick={() => startGame(`6pics`)}>
                <SixPicsButton />
              </MenuItem>
              </Suspense>

              <Suspense
                fallback={
                  <FadeStack>
                    <Stack width={'100%'} height={'80%'} bgcolor={'black'} position={'absolute'} justifyContent={'center'}>
                      <Typography color={'white'}>Loading ...</Typography>
                    </Stack>
                  </FadeStack>
                }
              >
                {userMeta?.is_admin &&
                <MenuItem sx={menuStyle} value="sandbox"  onClick={() => startGame(`wavetuner`)}>
                  <WavetunerButton />
                </MenuItem>
                }

              <MenuItem sx={menuStyle} value="sandbox"  onClick={() => startGame(`sandbox`)}>
                  <SandboxButton />
                </MenuItem>
              </Suspense>

              {/* <MenuItem sx={menuStyle} value="6pics"  onClick={() => navigate(`/mythreesongs`)}>
                <MyThreeSongsButton />
              </MenuItem> */}
            </List>
          </Stack>
        </MotionStack>
      </Stack>
    );
};

export default GamesWrapper;