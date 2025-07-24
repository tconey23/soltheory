import { useEffect, useState } from 'react';
import { Box, Button, Stack } from '@mui/material';

const Header = ({tab, setTab}) => {

    const menuTabs = [
        {
            name: 'presets',
            display: 'Presets',
        },
        {
            name: 'wavetypes',
            display: 'Waves',
        },
        {
            name: 'tuner',
            display: 'Tuner',
        },
        {
            name: 'compressor',
            display: 'Compressor',
        },
        {
            name: 'volume',
            display: 'Volume',
        },
        {
            name: 'vumeter',
            display: 'Vu',
        }
    ]


  return (
    <Stack direction={'row'} width={'90%'} height={'100%'} spacing={1} justifyContent={'flex-start'} alignItems={'center'} sx={{overflowX: 'auto'}}>
        {menuTabs?.map((t, i) => {
            return  <Box key={i}>
                        <Button variant={tab === t.name ? 'outlined' : 'contained'} sx={{bgcolor: tab === t.name ? '#937bdb' : '#372248', fontSize: 10, width: 'fit-content', maxWidth: '100px'}} onClick={() => setTab(t.name)}>{t.display}</Button>
                    </Box>
        })}
    </Stack>
  );
};

export default Header;