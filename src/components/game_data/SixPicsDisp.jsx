import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import useGlobalStore from '../../business/useGlobalStore';
import GameChart from './GameChart';


const SixPicsDisp = ({gameData}) => {
    const [displayData, setDisplayData] = useState()

    const userMeta = useGlobalStore((state) => state.userMeta) 

    useEffect(() => {
        
       

    }, [])

    useEffect(() => {

        const getPackData = async (pack) => {
            let { data: pack_data, error } = await supabase
            .from('six_pics_data')
            .select("*")
            .eq('pack_name', pack)

            let dataArray

            if(pack_data?.length > 0){
                dataArray = pack_data.map((d, i) => {
                    return {
                        label: i,
                        value: d.score
                    }
                })

                setDisplayData(dataArray)
            }
        }

        if(gameData){
            getPackData(gameData)
        }
    }, [gameData])

  return (
    <Stack direction={'column'} width={'100%'} height={'100%'}>
      {displayData ? 
        <GameChart data={displayData} userFav={null}/>
        :
        <Typography>No data for this pack</Typography>
      }
    </Stack>
  );
};

export default SixPicsDisp;