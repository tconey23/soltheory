import { useEffect, useState } from 'react';
import { Avatar, Button, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import useGlobalStore from '../business/useGlobalStore';
import MotionStack from '../ui_elements/MotionStack';
import AvatarForm from './AvatarForm';
import { updateUserName } from '../business/supabase_calls';
import Username from './Username';
import Password from './Password';
import AdminControls from './AdminControls';
import { useNavigate } from 'react-router-dom';
import { logout } from '../business/supabase_calls';
import MyGames from './game_data/MyGames';

const Account = () => {
  const MotionText = motion(Typography); 
  const MotionAvatar = motion(Avatar);

  const navTo = useNavigate()
  const font = useGlobalStore((state) => state.font);
  const screen = useGlobalStore((state) => state.screen);
  const userMeta = useGlobalStore((state) => state.userMeta);
  const user = useGlobalStore((state) => state.user)

  const [selectedAccountOption, setSelectedAccountOption] = useState('');
  const [accountObj, setAccountObj] = useState()
  const [hasMounted, setHasMounted] = useState(false);
  const [backCol, setBackCol] = useState('#414770')



    useEffect(() => {
        setTimeout(() => {
            setHasMounted(true);
        }, 2000);
    }, []);


    useEffect(() => {
        switch(selectedAccountOption){
            case 'change_avatar': setAccountObj(<AvatarForm />);
            break;
            case 'change_username': setAccountObj(
                                        <>
                                            <Username />
                                        </>
                                    );
            break;
            case 'update_password': setAccountObj(<Password />);
            break;
            case 'admin_controls': navTo('/account/admin');
            break;
            case 'my_games': setAccountObj(<MyGames />)
                             setBackCol('white');
                              
            break;
        }
    }, [selectedAccountOption])

  return (
    <Stack
        width="90%"
        height="95%"
        alignItems="center"
        justifyContent="flex-start"
        bgcolor={'#ffffffbd'}
        borderRadius={5}
        overflow={'auto'}
    >
      <Stack width={'90%'} height={'80%'} overflow={'auto'} marginTop={5} alignItems="center"
      justifyContent="flex-start">

      <MotionText
        paddingY={2}
        fontFamily="Fredoka Regular"
        fontSize={22}
        initial={hasMounted ? false : { y: -300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        >
        {`Welcome ${userMeta?.user_name || userMeta?.email}`}
      </MotionText>

      <Stack padding={0}>
        <MotionAvatar
          initial={hasMounted ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1, duration: 2 }}
          src={userMeta?.avatar || null}
          sx={{ border: '1px solid black', scale: 1.25 }}
          />
      </Stack>

      <MotionStack
        key="account_select"
        width="85%"
        sx={{ height: '10%' }}
        alignItems="center"
        justifyContent="center"
        direction="column"
        paddingY={5}
        initial={hasMounted ? false : { opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        >
        <Stack
          sx={{
            bgcolor: backCol,
            height: 'fit-content',
            width: '100%',
            borderRadius: 1,
            marginTop: 20
          }}
          >
            <Typography sx={{bgcolor: backCol, marginY: 2, color: 'white'}}>Account Options</Typography>
          <Select
            value={selectedAccountOption}
            onChange={(e) => setSelectedAccountOption(e.target.value)}
            >
            <MenuItem value="change_avatar">Change Avatar</MenuItem>
            <MenuItem value="change_username">Change Username</MenuItem>
            <MenuItem value="update_password">Update Password</MenuItem>
            <MenuItem value="my_games">My Games</MenuItem>
            {userMeta?.is_admin && <MenuItem value="admin_controls">Admin Controls</MenuItem>}
          </Select>
        </Stack>
      </MotionStack>

      <AnimatePresence mode="wait">
        {selectedAccountOption && (
          <MotionStack
          key={selectedAccountOption}
          width="85%"
          sx={{ height: 'fit-content', bgcolor: backCol, marginY: 15}}
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
        <Stack >
          <Button onClick={() => logout()} color='primary'>Logout</Button>
        </Stack>
    </Stack>
  );
};

export default Account;
