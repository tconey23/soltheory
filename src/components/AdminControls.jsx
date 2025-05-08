import { useEffect, useState } from 'react';
import { Avatar, Button, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import useGlobalStore from '../business/useGlobalStore';
import MotionStack from '../ui_elements/MotionStack';
import { useNavigate } from 'react-router-dom';
import SPAdminWrapper from './games/6pics/admin/SPAdminWrapper';
import SPAdminPacks from './games/6pics/admin/SPAdminPacks';
import InProgress from '../ui_elements/InProgress';

const AdminControls = () => {
  const MotionText = motion(Typography);
  const MotionAvatar = motion(Avatar);

  const navTo = useNavigate()
  const font = useGlobalStore((state) => state.font);
  const screen = useGlobalStore((state) => state.screen);
  const userMeta = useGlobalStore((state) => state.userMeta);
  const user = useGlobalStore((state) => state.user)

  const [selectedOption, setSelectedOption] = useState()
  const [accountObj, setAccountObj] = useState()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => {
        setHasMounted(true);
    }, 2000);
  }, []);

    useEffect(() => {
          switch(selectedOption){
              case '21things_prompts': setAccountObj(<InProgress />);
              break;
              case '6pics_packs': setAccountObj(<SPAdminPacks setSelectedOption={setSelectedOption}/>);
              break;
              case 'user_controls': setAccountObj(<InProgress />);
              break;
          }
      }, [selectedOption])

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
      Admin Controls
    </MotionText>

    <Stack padding={3}>
      <MotionAvatar
        initial={hasMounted ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 1, duration: 2 }}
        src={null}
        sx={{ border: '1px solid black', scale: 1.25 }}
      >
        <i class="fi fi-rs-admin-alt"></i>
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
          <Typography sx={{bgcolor: '#f4f6f8', marginY: 2}}>Select Option</Typography>
        <Select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <MenuItem value="21things_prompts">21Things Prompts</MenuItem>
          <MenuItem value="6pics_packs">6Pics Packs</MenuItem>
          <MenuItem value="user_controls">User Controls</MenuItem>
        </Select>
      </Stack>
    </MotionStack>

    <AnimatePresence mode="wait">
        {selectedOption && (
          <MotionStack
            key={selectedOption}
            width="85%"
            sx={{ height: selectedOption? '64%': '20%', bgcolor: '#414770', marginY: 3}}
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

export default AdminControls;