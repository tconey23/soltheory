import { useEffect, useRef, useState } from 'react';
import { List, ListItem, MenuItem, Stack, Typography } from '@mui/material';
import { supabase } from '../../../business/supabaseClient';
import useGlobalStore from '../../../business/useGlobalStore';

const PackButton = ({pack, setGamePack}) => {
    
    const [font, setFont] = useState('Fredoka')
    const videoRef = useRef()
    const [played, setPlayed] = useState(false)
    const [isHover, setIsHover] = useState(false)
    const user = useGlobalStore((state) => state.user)

    const getPlayedPacks = async () => {
        const isPlayed = user?.game_data?.filter((g) => g?.pack?.id === pack.id)

        if(isPlayed?.length > 0){
            setPlayed(true)
        }
    }

    useEffect(() => {
        getPlayedPacks()
    }, [])

    const getFileType = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        if (ext === 'mp4') return 'video/mp4';
        if (ext === 'svg') return 'image/svg+xml';
        return 'unknown';
      };

    return (
        <MenuItem
        userdata='pack_button'
        onClick={(e) => {
            // console.log(pack.id)
            setGamePack(pack)
        }}
            sx={{
                overflow:'hidden',
                transition: 'all 0.25s ease-in-out',
                boxShadow: '3px 3px 7px 1px #9a1fd94a',
                borderRadius: 10,
                "&:hover": {
                    cursor: 'pointer',
                    boxShadow: '3px 3px 7px 1px #9a1fd94a',
                    borderRadius: 20,
                    scale: 1.05
                },
                flexWrap: 'nowrap',
                maxHeight: '160px',
                minWidth: '95%',
                height: 'fit-content',
                width: '100%',
                flexDirection: 'column',
                backgroundColor: 'white',
                marginY: 2
            }}>

                    <Stack width={'100%'} height={'100%'} alignItems={'center'} >

                        <Stack width={'40%'} height={'50px'} justifyContent={'center'} alignItems={'center'} direction={'row'}>
                            <video 
                            playsInline
                            onLoadedMetadata={(e) => {
                                e.target.currentTime = e.target.duration;
                                e.target.playbackRate = 2
                                setTimeout(() => {
                                    e.target.play()
                                }, 1000);
                            }}
                            ref={videoRef} 
                            style={{
                                width: '50%',
                                height: 'auto',
                            }} muted autoPlay={false} loop={false}>
                                <source src={pack?.graphic} type="video/mp4"/>
                            </video>
                        </Stack>

                        <Stack width={'50%'} height={'35%'} justifyContent={'center'} alignItems={'center'}>
                            <Typography sx={{padding: '10px'}} fontSize={'clamp(11px, 2vw, 20px)'} fontFamily={'Fredoka Regular'}>{pack?.pack_name.toUpperCase()}</Typography>
                        </Stack>

                        <Stack width={'70%'} minHeight={'24px'} height={'30%'} alignItems={'flex-start'}>
                            {played && 
                                <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
                                    <Stack marginX={3} alignItems={'center'} justifyContent={'center'}>
                                        <Typography lineHeight={0}><i onMouseOver={() => setIsHover(true)} onMouseOut={() => setIsHover(false)} style={{color: 'limegreen'}} className="fi fi-sr-checkbox"></i></Typography>
                                    </Stack>

                                    <Stack alignItems={'center'} justifyContent={'center'} >
                                        <Typography sx={{transition: 'all 0.25s ease-in-out', opacity: isHover ? 1 : 0}} fontSize={10} fontFamily={'Fredoka Regular'} >You have played this pack</Typography>
                                    </Stack>
                                </Stack>  
                            }
                        </Stack>
                    
                    </Stack>
        </MenuItem>
        
    )
}

export default PackButton