import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import useGlobalStore from '../../business/useGlobalStore';
import GameChart from './GameChart';


const TwentyOneThingsDisp = ({gameData}) => {
    const [favs, setFavs] = useState([])
    const [userFav, setUserFav] = useState()
    const [displayData, setDisplayData] = useState()

    const userMeta = useGlobalStore((state) => state.userMeta) 

    useEffect(() => {
        
        if(favs?.length > 0){
            const counts = favs?.reduce((acc, str) => {
            const normalized = str?.trim();
            acc[normalized] = (acc[normalized] || 0) + 1;
            return acc;
        }, {});
        const chartData = Object.entries(counts)?.map(([label, value]) => ({
            label, 
            value
        }))
            setDisplayData(chartData)
        } else {
            setDisplayData()
        }

    }, [favs])

    useEffect(() => {
        if(gameData){
           setFavs(gameData?.map((g) => g?.stage3?.[0]?.prompt))
           const userFound =  gameData?.find((g) => g.user_id === userMeta?.primary_id)
           if(userFound){

            setUserFav(userFound?.stage3?.[0]?.prompt)
           } else {
            setUserFav('')
           }
        }
    }, [gameData])

  return (
    <Stack direction={'column'} width={'100%'} height={'100%'}>
      {displayData ? 
        <GameChart data={displayData} userFav={userFav}/>
        :
        <Typography>No data for this date</Typography>
      }
    </Stack>
  );
};

export default TwentyOneThingsDisp;