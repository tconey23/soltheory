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
        }
    ]


  return (
    <Stack direction={'row'} width={'100%'} height={'100%'} spacing={2}>
        {menuTabs?.map((t, i) => {
            return  <Box key={i}>
                        <Button variant={tab === t.name ? 'outlined' : 'contained'} sx={{bgcolor: tab === t.name ? '#937bdb' : '#372248', fontSize: 10}} onClick={() => setTab(t.name)}>{t.display}</Button>
                    </Box>
        })}
    </Stack>
  );
};

export default Header;