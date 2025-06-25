import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { motion } from 'framer-motion';
import useGlobalStore from '../business/useGlobalStore';
import Account from '../components/Account';
import GamesWrapper from '../components/games/GamesWrapper';
import SolMates from '../components/solmates/SolMates';
import Login from '../components/Login';
import Affiliates from '../components/Affiliates';
import GameData from '../components/game_data/GameData';

const MotionStack = motion(Stack);

const MenuGridItem = ({ delay = 0, content, index}) => {
  return (
    <MotionStack
      key={index}
      justifyContent={'center'}
      alignItems={'center'}
      overflow={'hidden'}
      width={'100%'}
      height={'450px'}
      bgcolor={'#80808073'}
      borderRadius={5}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
        delay: delay,
      }}
    >
        {content}
    </MotionStack>
  );
};

const HomePageMenu = () => {
  const screen = useGlobalStore((state) => state.screen)
   const userMeta = useGlobalStore((state) => state.userMeta)
  const [columnCount, setColumnCount] = useState()
  const menuItems = [
    userMeta ? <Account/> : <Login />,
    <GamesWrapper />,
    <GameData />,
    <Affiliates />
  ]

  useEffect(() => {
    console.log(screen)
  }, [screen])

  return (
    <Stack direction={'column'} width={'100%'} height={'95%'} alignItems={'center'} position={'absolute'} zIndex={2} paddingBottom={'5px'}>
      <Stack
        sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 1,
            width: '90%',
            height: '82%',
            overflow: 'auto',
            justifyItems:'center',
        }}
      >
        {menuItems?.map((m, i) => 
        <MenuGridItem key={i} index={i} delay={i*0.5} content={m}/>
    )}
      </Stack>
    </Stack>
  );
};

export default HomePageMenu;