import { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Stack } from '@mui/material';
import SPAdminPacks from './SPAdminPacks';

const SPAdminWrapper = () => {

  return (
    <Stack direction={'column'} sx={{ height: '98vh', width: '100vw' }} fontFamily={'Fredoka Regular'}>
        <Stack>
            <Accordion>
                <AccordionSummary>
                    View / Edit Packs
                </AccordionSummary>
                <AccordionDetails>
                    <SPAdminPacks />
                </AccordionDetails>
            </Accordion>
        </Stack>
    </Stack>
  );
};

export default SPAdminWrapper;