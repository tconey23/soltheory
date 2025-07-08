import { useEffect, useRef, useState } from 'react';
import { Box, List, ListItem, MenuItem, Stack, Typography } from '@mui/material';
import { supabase } from '../../../business/supabaseClient';
import useGlobalStore from '../../../business/useGlobalStore';

const PackButton = ({pack, setGamePack, disable, playedDate}) => {
    
    const videoRef = useRef()
    const buttonRef = useRef()
    const screen = useGlobalStore((state) => state.screen)
    const setAlertContent = useGlobalStore((state) => state.setAlertContent)
    const userMeta = useGlobalStore((state) => state.userMeta)
    const [buttonWidth, setButtonWidth] = useState(208)

    useEffect(() =>{
        setButtonWidth(buttonRef?.current.offsetWidth)
    }, [buttonRef])

    return (
        <MenuItem
        userdata='pack_button'
        onClick={(e) => {
            if(disable && !userMeta.is_admin){
                setAlertContent({
                    text: `You have already played this pack`,
                    type: 'warning'
                })
            return 
            }
            
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

                    <Stack ref={buttonRef} width={'90%'} height={'100%'} alignItems={'center'}>
                        <Stack width={screen === 'xs' ? '90%' : '60%'} height={screen === 'xs' ? '150px' : '155px'} justifyContent={'center'} alignItems={'flex-start'} direction={'row'}>
                            {disable && 
                                <Stack sx={{top: '0px', position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#00000045'}}>
                                    <Typography fontSize={20} sx={{borderRadius: 1, padding: 1, color: 'green', position: 'absolute', top: '0px', left: `${buttonWidth - 30}px`}}><i className="fi fi-sr-check-circle"></i></Typography>
                                </Stack>
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
                    </Stack>
        </MenuItem>
        
    )
}

export default PackButton