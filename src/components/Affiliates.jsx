import { useEffect, useState } from 'react';
import { Box, Button, List, MenuItem, Stack, Typography } from '@mui/material';
import useGlobalStore from '../business/useGlobalStore';
import { Link } from 'react-router-dom';

const Affiliates = () => {
  const setToggleAffiliates = useGlobalStore((state) => state.setToggleAffiliates)
  const [isMobile, setIsMobile] = useState(true)
  const screen = useGlobalStore((state) => state.screen)

  
  useEffect(() =>{
    console.log(screen)
    
    if(screen === 'xs'){
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }, [screen])

      const ads = [
    {
      name: isMobile ? 'personos_mobile' : 'personos_desktop',
      type: isMobile ? 'mobile' : 'desktop',
      image: isMobile ? '/personos_large_desktop.png' : '/personos_large_desktop.png',
      url: 'https://www.personos.ai/',
      dims: {
        width: isMobile ? '100%' : '100%', 
        height: isMobile ? '60px' : '169px'
      }
    },
    {
      name: isMobile ? 'mom_mobile' : 'mom_desktop',
      type: isMobile ? 'mobile' : 'desktop',
      image: isMobile ? '/mom_large_desktop.png' : '/mom_large_desktop.png',
      url: 'https://www.andreasnlp.com/trainings/metaphors-of-movement/l1/',
      dims: {
        width: isMobile ? '100%' : '100%', 
        height: isMobile ? '60px' : '169px'
      }
    }
  ];


  return (
    <Stack 
      direction={'column'} 
      width="90%"
      height="95%"
      borderRadius={5}
      justifyContent={'center'} 
      alignItems={'center'} 
      overflow={'auto'} 
      bgcolor={'#ffffffbd'}
    >
        <Stack marginTop={1}>
            <Typography fontFamily={'Fredoka Regular'} fontSize={20}>SOL Theory Affiliates</Typography>
        </Stack>
      <Stack height={'80%'}>
        <List sx={{overflowY: 'scroll', height: '100%'}}>
            {ads.map((s, i) => (
                <MenuItem key={i} sx={{width: '100%', padding: 3, justifyContent:'center', alignItems:'center'}}>
                    <Link to={s?.url} target="_blank" rel="noopener noreferrer">
                    <Box>
                        <img width={'100%'} height={'auto'} src={s?.image} sx={{margin: 3}}/>
                    </Box>
                    </Link>
                </MenuItem> 
            ))}
        </List>
      </Stack>
      
      {/* <Stack width={'10%'} marginTop={1}>
        <Button onClick={() => setToggleAffiliates(false)} >Back</Button>
      </Stack> */}
    </Stack>
  );
};

export default Affiliates;