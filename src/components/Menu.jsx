import { useEffect, useState } from 'react';
import { Button, Modal, Stack, Tooltip, Typography } from '@mui/material';
import useGlobalStore from '../business/useGlobalStore';

import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { login, logout } from '../business/supabase_calls';
import useBreakpoints from '../business/useBreakpoints';

const Menu = ({renders, setRenders}) => {
  const {xs} = useBreakpoints()
  const MotionStack = motion(Stack)
  const nav = useNavigate()
  const loc = useLocation()

  const [isVisible, setIsVisible] = useState(true);
  const font = useGlobalStore((state) => state.font)

  const user = useGlobalStore((state) => state.user)
  const userMeta = useGlobalStore((state) => state.userMeta)
  const setToggleMenu = useGlobalStore((state) => state.setToggleMenu)
  const [buttons, setButtons] = useState([])
  const [curLoc, setCurLoc] = useState()

  const [width, setWidth] = useState('10%')
  const {screen} = useGlobalStore()


  useEffect(()=>{
    setCurLoc(loc.pathname)
    setRenders(prev => prev +1)
  }, [loc])

  const delayedNav = (path) => {
    setIsVisible(false)
    setTimeout(() => {
      nav(path)
      setToggleMenu(false)
    }, 200);
  }


  const handleHome = async () => {
    delayedNav('/home')
  }

  const handleLogin = async () =>{
    delayedNav('/login')
  }

  const handleAccount = () => {
    delayedNav('/account')
  };

  const handleLogout = async () => {
    logout()
  }

  const handleGames = async () => {
    delayedNav('/games')
  }

  const handleSolmates = async () => {
    delayedNav('/solmates')
  }

  //<i className="fi fi-sr-psychology"></i>
  
  const menuButtons = [
    {
      name: 'Home',
      function: handleHome,
      color: 'primary',
      display: true,
      tooltip: userMeta ? 'Modify account' : 'Login to SOLTheory',
      pathFilter: '/home',
      icon: <i style={{marginRight: 10}} className="fi fi-rr-house-chimney"></i>
    },
    {
      name: userMeta ? 'mySOL' : "Login",
      function: userMeta ? handleAccount : handleLogin,
      color: 'primary',
      display: true,
      tooltip: userMeta ? 'Modify account' : 'Login to SOLTheory',
      pathFilter: '/account',
      icon: userMeta ? <i style={{marginRight: 8}} className="fi fi-ss-user-skill-gear"></i> : <i style={{marginRight: 8}} className="fi fi-rr-sign-in-alt"></i>
    },
    {
      name: userMeta && 'SOLGames',
      function: userMeta ? handleGames : handleLogin,
      color: userMeta ? 'primary' : 'disabled',
      display: userMeta ? true : false,
      tooltip: userMeta ? 'Play SOLGames' : 'Login to play SOLGames',
      pathFilter: '/games',
      icon: <i style={{marginRight: 5}} className="fi fi-rs-gamepad"></i>
    },
    {
      name: userMeta && 'SOLMates',
      function: handleSolmates,
      color: userMeta ? 'primary' : 'disabled',
      display: userMeta ? true : false,
      tooltip: userMeta ? 'See SOLMates' : 'Login to see SOLMates',
      pathFilter: '/solmates',
      icon: <i style={{marginRight: 5}} className="fi fi-rr-following"></i>
    },
    {
      name: userMeta && 'Logout',
      function: userMeta ? handleLogout : handleLogin,
      color: userMeta ? 'important' : 'disabled',
      display: userMeta ? true : false,
      tooltip: 'Log out of SOLTheory',
      icon: <i style={{marginRight: 5}} className="fi fi-rr-leave"></i>
    }
  ]

  useEffect(() => {
    
      setButtons(
        menuButtons.map((b, i) => {
          if(loc.pathname !== b.pathFilter){
            return (
                <Tooltip key={i} title={b.tooltip} followCursor>
                  <Stack paddingY={2} paddingX={5} alignItems={'center'}>
                    {user ?
                      <Button sx={{textAlign: 'center', width: 'fit-content', paddingX: 2}} title="button" disabled={!b.display} color={b.color} onClick={b.function}>
                        <Typography fontSize={15}>{b?.icon}</Typography>
                        <Typography fontSize={15}>{b.name}</Typography>
                      </Button>
                    :
                      <>
                        {!user && b.name === 'Login' &&                       
                        <Button sx={{textAlign: 'center', width: 'fit-content', paddingX: 2}} title="button" disabled={!b.display} color={b.color} onClick={b.function}>
                        <Typography fontSize={15}>{b?.icon}</Typography>
                        <Typography fontSize={15}>{b.name}</Typography>
                      </Button>}
                      </>
                    }
                  </Stack>
                </Tooltip>
              )
            }     
        })
      )
    
  }, [])

  return (
      <Stack onClick={(e) => {
        if(e.target.title === 'modal_inner_wrapper'){
          setToggleMenu(false)
        }
      }} direction={'column'} width={'100%'} height={'100%'} justifyContent={'center'} title="modal_inner_wrapper" sx={{overflowY: 'auto'}} >

        <AnimatePresence>
          {isVisible 
            &&
          <MotionStack
            title="motion_stack"
            bgcolor={'#474973'} 
            width={screen === 'xs' ? '50%' : '25%'} 
            height={'85%'}
            initial={{ x: -200, y: 0 }}
            animate={{ x: 2, y: 0 }}
            exit={{ x: -200, y: 0 }}
            transition={{ duration: 0.5 }}
            direction="column"
            spacing={2}
            paddingX={2}
            paddingY={3}
            borderRadius={1}
            sx={{overflowY: 'auto'}}
            justifyContent={'flex-start'}
          >

          <Typography sx={{textOverflow: 'ellipsis', whiteSpace: 'wrap'}} overflow={'hidden'} font={'Fredoka Regular'} textAlign={'center'} fontSize={12}>{`Welcome ${user ? user?.email : 'to SolTheory'}`}</Typography>

            <Stack>
              {curLoc && buttons}
            </Stack>


          </MotionStack>
          }
        </AnimatePresence>
      </Stack>
  );
};

export default Menu;