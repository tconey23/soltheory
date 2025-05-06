import { useEffect, useState } from 'react';
import { Button, Modal, Stack, Tooltip, Typography } from '@mui/material';
import useGlobalStore from '../business/useGlobalStore';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { logout } from '../business/supabase_calls';

const Menu = ({renders, setRenders}) => {
  const MotionStack = motion(Stack)
  const nav = useNavigate()
  const loc = useLocation()

  const [isVisible, setIsVisible] = useState(true);
  const font = useGlobalStore((state) => state.font)
  const isMobile = useGlobalStore((state) => state.isMobile)
  const user = useGlobalStore((state) => state.user)
  const userMeta = useGlobalStore((state) => state.userMeta)
  const setToggleMenu = useGlobalStore((state) => state.setToggleMenu)
  const [buttons, setButtons] = useState([])
  const [curLoc, setCurLoc] = useState()


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
  
  const menuButtons = [
    {
      name: 'Home',
      function: handleHome,
      color: 'primary',
      display: true,
      tooltip: userMeta ? 'Modify account' : 'Login to SOLTheory',
      pathFilter: '/home'
    },
    {
      name: userMeta ? 'mySOL' : "Login",
      function: userMeta ? handleAccount : handleLogin,
      color: 'primary',
      display: true,
      tooltip: userMeta ? 'Modify account' : 'Login to SOLTheory',
      pathFilter: '/account'
    },
    {
      name: userMeta && 'SOLGames',
      function: userMeta ? handleGames : handleLogin,
      color: userMeta ? 'primary' : 'disabled',
      display: userMeta ? true : false,
      tooltip: userMeta ? 'Play SOLGames' : 'Login to play SOLGames',
      pathFilter: '/games'
    },
    {
      name: userMeta && 'SOLMates',
      function: userMeta ? handleAccount : handleLogin,
      color: userMeta ? 'primary' : 'disabled',
      display: userMeta ? true : false,
      tooltip: userMeta ? 'See SOLMates' : 'Login to see SOLMates',
      pathFilter: '/mates'
    },
    {
      name: userMeta && 'Logout',
      function: userMeta ? handleLogout : handleLogin,
      color: userMeta ? 'important' : 'disabled',
      display: userMeta ? true : false,
      tooltip: 'Log out of SOLTheory'
    }
  ]

  useEffect(() => {
    
      setButtons(
        menuButtons.map((b) => {
          if(loc.pathname !== b.pathFilter){
              console.log(loc.pathname, b.pathFilter)
            return (
              <Tooltip title={b.tooltip} followCursor>
            <Stack paddingY={2}>
              <Button title="button" disabled={!b.display} color={b.color} onClick={b.function}>{b.name}</Button>
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
      }} direction={'column'} width={'100%'} height={'100%'} justifyContent={'center'} title="modal_inner_wrapper">

        <AnimatePresence>
          {isVisible 
            &&
          <MotionStack
          title="motion_stack"
          bgcolor={'#474973'} 
          width={isMobile ? '33%' : '10%'} 
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
          >

          <Typography sx={{textOverflow: 'ellipsis', whiteSpace: 'wrap'}} overflow={'hidden'} font={font} textAlign={'center'} fontSize={12}>{`Welcome ${user?.email}`}</Typography>

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