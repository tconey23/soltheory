import { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, Modal, Stack, Typography } from '@mui/material';
import SPAdminPacks from './SPAdminPacks';
import { useNavigate } from 'react-router-dom';
import useGlobalStore from '../../../../business/useGlobalStore';

const SPAdminWrapper = ({setSelectedOption}) => {
    const [forceRefresh, setForceRefresh] = useState(0)
    const nav = useNavigate()

    const {screen} = useGlobalStore()

  return (
    <Stack direction={'column'} sx={{ height: '98vh', width: '100%' }} fontFamily={'Fredoka Regular'}> 
        <Stack>
            <Accordion
                id='packs-accordion' 
                onClick={(e) => {
                    if(e.target.innerText == 'View / Edit Packs'){
                        setForceRefresh(prev => prev +1)
                    }
                }}>
                <AccordionSummary>
                    View / Edit Packs 
                </AccordionSummary>
                <AccordionDetails>
                    <SPAdminPacks forceRefresh={forceRefresh} setForceRefresh={setForceRefresh}/>
                </AccordionDetails>
            </Accordion>
        </Stack>
        <Button onClick={() => nav('/account')} >Back</Button>
        <Modal open={false}>
            <Stack width={'100%'} height={'100%'} alignItems={'center'} justifyContent={'center'}>
                <Stack width={'50%'} height={'20%'} bgcolor={'white'} direction={'column'} alignItems={'center'} justifyContent={'center'}>
                    <Typography textAlign={'center'}>
                        <i style={{color: 'red', fontSize: '20px', margin: 20}} className="fi fi-sr-exclamation"></i>
                    </Typography>
                    <Typography textAlign={'center'}>This option must be viewed on a desktop device</Typography>
                    <Button onClick={() => setSelectedOption(null)} >Back</Button>
                </Stack>
            </Stack>
        </Modal>
    </Stack>
  );
};

export default SPAdminWrapper;