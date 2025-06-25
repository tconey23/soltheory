import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import useGlobalStore from '../../business/useGlobalStore';
import GameChart from './GameChart';


const SixPicsDisp = ({gameData}) => {
    const [displayData, setDisplayData] = useState()
    const [userData, setUserData] = useState()

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
            // console.log(pack_data)
            if(pack_data?.length > 0){
                dataArray = pack_data.map((d, i) => { 
                    if(d.user_id === userMeta.primary_id){
                        setUserData(i)
                    }
                    return { 
                        label: i,
                        value: d.score
                    }
                })

                setDisplayData(dataArray)

            } else {
                setDisplayData()
            }
        }

        if(gameData){
            getPackData(gameData)
        }
    }, [gameData])

  return (
    <Stack direction={'column'} width={'100%'} height={'100%'}>
      {displayData ? 
        <GameChart data={displayData} userFav={userData}/>
        :
        <Typography>No data for this pack</Typography>
      }
    </Stack>
  );
};

export default SixPicsDisp;