import { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Stack } from '@mui/material';
import useGlobalStore from '../business/useGlobalStore';

const AppHeader = () => {

  const screen = useGlobalStore((state) => state.screen)
  const user = useGlobalStore((state) => state.user)
  const setUser = useGlobalStore((state) => state.setUser)
  const session = useGlobalStore((state) => state.session)
  const setSession = useGlobalStore((state) => state.setSession)
  const userMeta = useGlobalStore((state) => state.userMeta)
  const setUserMeta = useGlobalStore((state) => state.setUserMeta)
  const toggleMenu = useGlobalStore((state) => state.toggleMenu)
  const setToggleMenu = useGlobalStore((state) => state.setToggleMenu)
  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    if(userMeta){
      setAvatar(userMeta.avatar)
    }
  }, [userMeta])

  return (
    <Stack direction={'row'} width={'100%'} height={'100%'} bgcolor={'#372248'} alignItems={'center'} paddingY={1}>
      <Stack paddingX={2}>
        <Button onClick={() => setToggleMenu(true)}>
          <i className="fi fi-br-menu-dots-vertical"></i>
        </Button>
      </Stack>
      <Stack width={'90%'}  alignItems={'flex-end'} paddingX={3}>
        <Badge badgeContent={<i class="fi fi-sr-circle-star"></i>} color='error'>
          <Avatar src={avatar}/>
        </Badge>
      </Stack>
    </Stack>
  );
};

export default AppHeader;
