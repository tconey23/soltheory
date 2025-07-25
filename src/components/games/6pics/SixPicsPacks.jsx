import { useEffect, useRef, useState } from 'react';
import { List, ListItem, Stack, Typography } from '@mui/material';
import { supabase } from '../../../business/supabaseClient';

const PackButton = ({name, icon, iconType, hover}) => {
    const [font, setFont] = useState('Fredoka')
    const videoRef = useRef()

    useEffect(() =>{
        if(videoRef.current && hover){
            videoRef.current.play()
        }
    }, [videoRef, hover])

    return (
        <Stack
            // border={'1px solid black'}
            padding={2} 
            direction={'row'}
            height={80} width={'75%'} justifyContent={'center'} alignItems={'center'} overflow={'hidden'}
            sx={{

                transition: 'all 0.25s ease-in-out',
                "&:hover": {
                    cursor: 'pointer',
                    boxShadow: '3px 3px 7px 1px #9a1fd94a',
                    borderRadius: 20,
                    scale: 1.05
                }
            }}>
                <Stack height={'90%'} width={'50%'} overflow={'hidden'} justifyContent={'center'} alignItems={'center'}>

                {
                    iconType === 'svg' ? 
                    <img height={'80px'}  src={icon}/>
                    :
                    <video ref={videoRef} style={{height: '100%', margin: 5}} muted autoPlay loop>
                    <source src={icon} type="video/mp4"/>
                </video>
                }
                </Stack>
                <Stack height={'100%'} justifyContent={'center'} alignItems={'center'}>
                    <Typography sx={{padding: 5}} fontSize={20} fontFamily={font}>{name.toUpperCase()}</Typography>
                </Stack>
        </Stack>
    )
}

const SixPicsPacks = ({setGamePack, gamePack}) => {
    const [packs, setPacks] = useState([])
    const [hover, setHover] = useState(false)

    const fetchPacks = async () => {
        let { data: sixpicspacks, error } = await supabase 
        .from('sixpicspacks')
        .select('*')

        if(sixpicspacks){
            setPacks(sixpicspacks)
        }
    }

useEffect(() => {
    fetchPacks() 
}, [])

  return (
    <Stack userdata='game_parent' direction={'column'} sx={{ height: '90%', width: '100%'}} justifyContent={'center'} alignItems={'center'} >
        <Typography fontFamily={'Fredoka Regular'} fontSize={40}>Select Pack</Typography>
        <Stack userdata='list_container' sx={{overflow: 'auto'}} height={'100%'} width={'100%'} justifyContent={'center'}>
            <List userdata='pack_list' sx={{width: '100%', alignItems: 'center'}}>
                {packs && packs
                .sort((a,b) => b.sort_order - a.sort_order)
                .map((p, i) => {
                    let fileType = p.graphic
                    return (
                        <ListItem
                        userdata='pack_button'
                        key={i}
                        sx={{justifyContent: 'center'}}
                         onClick={() => {
                            setGamePack(p)
                            }} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
                            <PackButton name={p.pack_name} icon={p.graphic} iconType={fileType} hover={hover}/>
                        </ListItem>
                    )
                })}
            </List>
        </Stack>
    </Stack>
  );
};

export default SixPicsPacks;