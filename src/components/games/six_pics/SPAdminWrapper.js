import { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, Stack } from '@mui/material';
import SPAdminPacks from './SPAdminPacks';
import { useNavigate } from 'react-router-dom';

const SPAdminWrapper = () => {
    const [forceRefresh, setForceRefresh] = useState(0)
    const nav = useNavigate()

  return (
    <Stack direction={'column'} sx={{ height: '98vh', width: '100vw' }} fontFamily={'Fredoka Regular'}> 
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
    </Stack>
  );
};

export default SPAdminWrapper;