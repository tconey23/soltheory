import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import TwentyOneCalendar from './TwentyOneCalendar';
import TwentyOneThingsDisp from './TwentyOneThingsDisp'; 

const TwentyOneThingsData = () => {

    const [dayGame, setDayGame] = useState()
    // useEffect(() => {
    //     console.log(dayGame)
    // }, [dayGame])

  return (
    <Stack direction={'column'} width={'100%'} height={'100%'} bgcolor={''}>
        <Stack>
            <TwentyOneCalendar dayGame={dayGame} setDayGame={setDayGame}/>
        </Stack>
        <Stack>
            <TwentyOneThingsDisp gameData={dayGame}/>
        </Stack>
    </Stack>
  );

};

export default TwentyOneThingsData;