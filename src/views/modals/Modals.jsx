import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import {Modal} from '@mui/material';
import Login from '../../components/Login';
import Menu from '../../components/Menu';
import useGlobalStore from '../../business/useGlobalStore'; 
import Affiliates from '../../components/Affiliates';

const Modals = ({needsLogin}) => {

    const user = useGlobalStore((state) => state.user)
    const toggleLogin = useGlobalStore((state) => state.toggleLogin)
    const toggleMenu = useGlobalStore((state) => state.toggleMenu) 
    const setToggleMenu = useGlobalStore((state) => state.setToggleMenu)
    const screen = useGlobalStore((state) => state.screen)
    const setToggleAffiliates = useGlobalStore((state) => state.setToggleAffiliates)
    const toggleAffiliates = useGlobalStore((state) => state.toggleAffiliates)

    const [renders, setRenders] = useState(0)

  return (
    <>
        {/* Login menu */}
        <Modal open={!!needsLogin || !!toggleLogin}>
      <Stack width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
        <Stack bgcolor={'white'} width={screen ? '77%' : '50%'} height={'50%'} borderRadius={1} justifyContent={'center'} alignItems={'center'}>
          <Login />
        </Stack>
      </Stack>
    </Modal>

    {/* Sidebar menu */}
    <Modal open={!!toggleMenu} sx={{height: '94dvh', alignSelf: 'flex-end'}} >
      <Stack width="100%" height="100%">
        <Menu renders={renders} setRenders={setRenders}/>
      </Stack>
    </Modal>

    <Modal open={!!toggleAffiliates} sx={{height: '94dvh', alignSelf: 'flex-end'}} >
      <Stack width="100%" height="100%" justifyContent={'center'} alignItems={'center'}>
        <Affiliates setToggleAffiliates={setToggleAffiliates}/>
      </Stack>
    </Modal>
    </>
  );
};

export default Modals;