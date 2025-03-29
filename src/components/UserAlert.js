import { useEffect, useState } from 'react';
import { Button, Modal, Stack, Typography } from '@mui/material';

const UserAlert = () => {
    const [display, setDisplay] = useState(false)

  return (
    <Modal
        open={display}
        onClose={() => setDisplay(false)}
        sx={{justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}
    >
        <Stack width={'100%'} height={'100%'} alignItems={'center'} justifyContent={'center'}>
            <Stack direction={'column'} sx={{ height: '50%', width: '50%', background: 'white' }} alignItems={'center'} justifyContent={'center'}>
                <Typography>Are you sure?</Typography>
                <Stack direction={'row'}>
                <Button>Yes</Button>
                <Button onClick={() => setDisplay(false)}>Cancel</Button>
                </Stack>
            </Stack>
        </Stack>
    </Modal>
  );
};

export default UserAlert;