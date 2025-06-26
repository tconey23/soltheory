import { useEffect, useRef, useState } from 'react';
import { Box, List, ListItem, MenuItem, Stack, Typography } from '@mui/material';
import { supabase } from '../../../business/supabaseClient';
import useGlobalStore from '../../../business/useGlobalStore';

const PackButton = ({pack, setGamePack, disable, playedDate}) => {
    
    const [font, setFont] = useState('Fredoka') 
    const videoRef = useRef()
    const [played, setPlayed] = useState()
    const [isHover, setIsHover] = useState(false)
    const user = useGlobalStore((state) => state.user)
    const screen = useGlobalStore((state) => state.screen)

    const formatDate = (unix) => {
        if (!unix) return

        const date = new Date(Number(unix)); // Ensure it's a number
        if (isNaN(date.getTime())) return "Invalid date"; // handle bad value

        setPlayed(date.toISOString().split('T')[0])
    };

    useEffect(() => {
        console.log(formatDate(playedDate))
    }, [playedDate])

    const getFileType = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        if (ext === 'mp4') return 'video/mp4';
        if (ext === 'svg') return 'image/svg+xml';
        return 'unknown';
      };

    return (
        <MenuItem
        // disabled={disable}
        userdata='pack_button'
        onClick={(e) => {
            // console.log(pack.id)
            if(played) return;
            
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
                maxHeight: '155px',
                minWidth: screen === 'xs' ? '90%' : '60%',
                height: 'fit-content',
                width: screen === 'xs' ? '90%' : '30%',
                flexDirection: 'column',
                backgroundColor: 'white',
                marginY: 2,
                justifySelf: 'center',
            }}>

                    <Stack width={'90%'} height={'100%'} alignItems={'center'}>
                        <Stack width={screen === 'xs' ? '90%' : '60%'} height={screen === 'xs' ? '150px' : '155px'} justifyContent={'center'} alignItems={'flex-start'} direction={'row'}>
                            {disable && 
                                <Box sx={{position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#00000045'}}>
                                    <Typography sx={{bgcolor:'#000000d4', padding: 1, color: 'white'}}>{`Played on: ${played}`}</Typography>
                                </Box>
                            }
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
                                    width: 'auto',
                                    height: '95%',
                                    paddingY: 30
                                }} muted autoPlay={false} loop={false}>
                                    <source src={pack?.graphic} type="video/mp4"/>
                            </video>
                        </Stack>

                        {/* <Stack width={'50%'} height={'35%'} justifyContent={'center'} alignItems={'center'}>
                            <Typography sx={{padding: '10px'}} fontSize={'clamp(11px, 2vw, 20px)'} fontFamily={'Fredoka Regular'}>{pack?.pack_name.toUpperCase()}</Typography>
                        </Stack> */}

                        {/* <Stack width={'70%'} minHeight={'24px'} height={'30%'} alignItems={'flex-start'}>
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
                        </Stack> */}
                    
                    </Stack>
        </MenuItem>
        
    )
}

export default PackButton