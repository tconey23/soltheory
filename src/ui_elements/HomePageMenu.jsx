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
import ThriveParenting from '../components/ThriveParenting';
import { useInView } from 'react-intersection-observer';

const MotionStack = motion(Stack);

const MenuGridItem = ({ delay = 0, content, index }) => {

  const [itemOpac, setItemOpac] = useState(0)

  const { ref, inView, entry } = useInView({
    triggerOnce: false,
    threshold:  Array.from({ length: 101 }, (_, i) => i / 100),
  });
  
  useEffect(() => {
    if (entry) {
      setItemOpac(entry.intersectionRatio)
    }
  }, [entry, index]);

  return (
    <div ref={ref} style={{ width: '100%', height: '450px' }}>
      
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
          animate={{ y: 0, opacity: itemOpac }}
          transition={{
            duration: 0.5,
            ease: 'easeOut',
            delay: 0,
          }}
        >
          {inView && content}
        </MotionStack>
      
    </div>
  );
};

const HomePageMenu = () => {
  const screen = useGlobalStore((state) => state.screen)
   const userMeta = useGlobalStore((state) => state.userMeta)
  const [columnCount, setColumnCount] = useState()
  const menuItems = [
    userMeta ? <Account/> : <Login />,
    // <ThriveParenting />,
    <GamesWrapper />,
    <GameData />,
    <Affiliates />
  ]

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