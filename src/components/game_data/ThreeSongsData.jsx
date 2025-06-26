import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import useGlobalStore from '../../business/useGlobalStore';
import { motion } from 'framer-motion';

const SongListObject = ({list, date, toggleExpand}) => {

    const [songs, setSongs] = useState([])
    // const [toggleExpand, setToggleExpand] = useState(false)

    const offset = 70
    const albumSize = 120

    const formDate = (date) => {
        const [year, month, day] = date.split("-");
        const formatted = `${month}-${day}-${year}`;

        return formatted
    }

    useEffect(() =>{
        if(list){
            // console.log(list)
            setSongs(
                list?.map((s) => (
                    <Stack>
                        {/* <Stack bgcolor={''}>
                            <Typography color='white' fontSize={10}>{s.artist}</Typography>
                        </Stack> */}

                        <Stack>
                            <img style={{width: `${albumSize}px`, height: 'auto'}} src={s.albumArt}/>
                        </Stack>

                        {/* <Stack bgcolor={''}>
                            <Typography color='white' fontSize={10}>{s.name}</Typography>
                        </Stack> */}
                    </Stack>
                ))
            )
        }
    }, [list])
    
    return (
        <Stack
            width={'250px'}
            height={'250px'}
            justifyContent={'center'}
            alignItems={'center'}
            sx={{ position: 'relative' }}
        >

            <Stack 
                // onClick={() => setToggleExpand(prev => !prev)} 
                sx={{
                    // clipPath: 'circle(50% at 50% 50%)', 
                    bgcolor: '#004080', 
                    width: '100px', 
                    height: '100px', 
                    margin: '10px', 
                    zIndex: toggleExpand ? 0 : 200,
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '#000000a8 0px 0px 11px 8px',
                    fontFamily: 'Fredoka Variable',
                    fontWeight: 'bold',
                    color: 'white'
                }} justifyContent={'center'} alignItems={'center'}>{formDate(date)}</Stack>
            
            <motion.div
                initial={{ x: 0, y: 0 }}
                animate={toggleExpand ? { x: 0, y: -offset, opacity: 1 } : { x: 0, y: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    // clipPath: 'circle(50% at 50% 50%)',
                    // backgroundColor: 'yellow',
                    width: `${albumSize}px`,
                    height: `${albumSize}px`,
                    margin: '2px',
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 25,
                    overflow: 'hidden',
                    boxShadow: '#000000a8 0px 0px 11px 8px'
                }}
            >
                {songs[2]}
            </motion.div>

            <motion.div
                initial={{ x: 0, y: 0 }}
                animate={toggleExpand ? { x: -offset, y: offset, opacity: 1  } : { x: 0, y: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    // clipPath: 'circle(50% at 50% 50%)',
                    // backgroundColor: 'yellow',
                    width: `${albumSize}px`,
                    height: `${albumSize}px`,
                    margin: '2px',
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 25,
                    overflow: 'hidden',
                    boxShadow: '#000000a8 0px 0px 11px 8px'
                }}
            >
                {songs[1]}
            </motion.div>

            <motion.div
                initial={{ x: 0, y: 0 }}
                animate={toggleExpand ? { x: offset, y: offset, opacity: 1 } : { x: 0, y: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    // clipPath: 'circle(50% at 50% 50%)',
                    // backgroundColor: 'yellow',
                    width: `${albumSize}px`,
                    height: `${albumSize}px`,
                    margin: '2px',
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 25,
                    overflow: 'hidden',
                    boxShadow: '#000000a8 0px 0px 11px 8px'
                }}
            >
                {songs[0]}
            </motion.div>


        </Stack>
    )


}

const ThreeSongsData = () => {

    const userMeta = useGlobalStore((state) => state.userMeta)

    const [songLists, setSongLists] = useState([])
    const [opened, setOpened] = useState()

    const getSongs = async () =>{
        setSongLists([]

        )
        let { data: three_songs, error } = await supabase
        .from('three_songs_data')
        .select("*")
        .eq('user_id', userMeta.primary_id)

        three_songs?.forEach((s) => {
             setSongLists(prev => ([
                ...prev,
                s
             ]))  
        })

    }

    useEffect(() => {
        getSongs()
    }, [])

  return (
    <Stack direction={'column'} width={'100%'} height={'100%'} justifyContent={'flex-start'} alignItems={'center'}>
      {songLists?.map((l, i) => {
        console.log(l)
        let expand = false
        if(opened === i){
            expand = true
        }
        return (
            <Stack sx={{cursor: 'pointer'}} onClick={() => setOpened(i)}>
                <SongListObject  list={l.song_list} date={l.created_at} toggleExpand={expand}/>
            </Stack>
        )
      })}
    </Stack>
  );
};

export default ThreeSongsData;